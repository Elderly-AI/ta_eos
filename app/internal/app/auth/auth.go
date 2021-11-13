package auth

import (
	"context"
	"fmt"
	authRepo "github.com/Elderly-AI/ta_eos/internal/pkg/database/auth"
	"github.com/Elderly-AI/ta_eos/internal/pkg/errors"
	"github.com/Elderly-AI/ta_eos/internal/pkg/models"
	"github.com/Elderly-AI/ta_eos/internal/pkg/session"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/auth"
	"github.com/golang/glog"
	"github.com/jinzhu/copier"
)

type Server struct {
	repo        authRepo.Repo
	sessionRepo session.Store
	pb.UnimplementedAuthServer
}

func (s *Server) LoginHandler(ctx context.Context, request *pb.LoginRequest) (*pb.User, error) {
	panic("implement me")
}

func (s *Server) GetCurrentUser(ctx context.Context, request *pb.EmptyRequest) (*pb.SafeUser, error) {
	panic("implement me")
}

func NewAuthHandler(repo authRepo.Repo, sessionRepo *session.Store) Server {
	return Server{
		repo:        repo,
		sessionRepo: *sessionRepo,
	}
}

func (s *Server) RegisterHandler(c context.Context, in *pb.RegisterRequest) (*pb.SafeUser, error) {
	res := &pb.SafeUser{}
	userID := session.GetUserIdFromContext(c)
	if userID != nil {
		glog.Infof(" %s already authed", userID)
		userFromRepo, err := s.repo.GetUserById(c, *userID)
		fmt.Println(err)
		err = copier.Copy(res, &userFromRepo)
		fmt.Println(err)
		return res, nil
	}
	cleanUsr := models.User{}
	validationErr := copier.Copy(&cleanUsr, in.User)
	if validationErr != nil {
		glog.Errorln(validationErr)
		return nil, &errors.ApiError{Err: fmt.Sprintf("Incorrect user %s", in.User)}
	}

	userId, err := s.repo.AddUser(c, cleanUsr)
	cleanUsr.UserID = userId
	if err != nil {
		glog.Errorln(err)
		return nil, &errors.ApiError{Err: fmt.Sprintf("Incorrect user dont have all required fields: %s", in.User)}
	}
	err = copier.Copy(res, &cleanUsr)
	if err != nil {
		glog.Errorln(err)
		return nil, &errors.ApiError{Err: fmt.Sprintf("Incorrect user dont have all required fields: %s", in.User)}
	}
	err = s.sessionRepo.SetCookieGRPC(c, userId)
	return res, err
}
