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
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"

	authRepo "github.com/Elderly-AI/ta_eos/internal/pkg/database/auth"
	"github.com/Elderly-AI/ta_eos/internal/pkg/models"
	"github.com/Elderly-AI/ta_eos/internal/pkg/session"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/auth"
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
	userID := session.GetUserIdFromContext(c)
	if userID != nil {
		glog.Infof(" %s already authed", *userID)
		userFromRepo, err := s.repo.GetUserById(c, *userID)
		if err != nil {
			glog.Error(err)
		}
		return models.UserToGRPCSafeUser(userFromRepo), nil
	}
	cleanUsr := models.UserFromGrpc(in.User)
	userId, err := s.repo.AddUser(c, cleanUsr)
	cleanUsr.UserID = userId
	if err != nil {
		return err
	}
	err = s.sessionRepo.SetCookieGRPC(c, userId)
	return models.UserToGRPCSafeUser(cleanUsr), err
}
