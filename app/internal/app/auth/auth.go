package auth

import (
	"context"
	"errors"
	authRepo "github.com/Elderly-AI/ta_eos/internal/pkg/database/auth"
	"github.com/Elderly-AI/ta_eos/internal/pkg/models"
	"github.com/Elderly-AI/ta_eos/internal/pkg/session"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/auth"
	"github.com/golang/glog"
)

type Server struct {
	repo        authRepo.Repo
	sessionRepo session.Store
	pb.UnimplementedAuthServer
}

func (s *Server) LoginHandler(ctx context.Context, request *pb.LoginRequest) (*pb.SafeUser, error) {
	usr, err := s.repo.GetUserByEmailAndPassword(ctx, request.Email, request.Password)
	if err != nil {
		return nil, err
	}
	return models.UserToGRPCSafeUser(usr), nil
}

func (s *Server) GetCurrentUser(ctx context.Context, request *pb.EmptyRequest) (*pb.SafeUser, error) {
	userID := session.GetUserIdFromContext(ctx)
	if userID != nil {
		usr, err := s.repo.GetUserById(ctx, *userID)
		if err != nil {
			return nil, err
		}
		return models.UserToGRPCSafeUser(usr), nil
	}
	return nil, errors.New("no authenticated user")
}

func (s *Server) SearchUsers(ctx context.Context, request *pb.SearchRequest) (*pb.SafeUsers, error) {
	if request.Text != "" {
		users, err := s.repo.SearchUsersByFIOOrGroup(ctx, request.Text)
		if err != nil {
			return nil, err
		}
		return models.UsersToGRPCSafeUsers(users), nil
	}
	return nil, errors.New("empty search request")
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
	cleanUsr, err := models.UserFromGrpc(in.User)
	if err != nil {
		return nil, err
	}

	userId, err := s.repo.AddUser(c, cleanUsr)
	cleanUsr.UserID = userId
	cleanUsr.Role = "user" //TODO fix harcode
	if err != nil {
		return nil, err
	}
	err = s.sessionRepo.SetCookieGRPC(c, userId)
	return models.UserToGRPCSafeUser(cleanUsr), err
}
