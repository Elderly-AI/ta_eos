package auth

import (
	"context"
	"fmt"

	"google.golang.org/grpc/metadata"

	auth2 "github.com/Elderly-AI/ta_eos/internal/pkg/database/auth"
	"github.com/Elderly-AI/ta_eos/pkg/proto"
)

type AuthServer struct {
	repo auth2.AuthRepo
}

func (s *AuthServer) LoginHandler(ctx context.Context, request *auth.LoginRequest) (*auth.User, error) {
	panic("implement me")
}

func (s *AuthServer) GetCurrentUser(ctx context.Context, request *auth.EmptyRequest) (*auth.SafeUser, error) {
	panic("implement me")
}

func NewAuthHandler(repo auth2.AuthRepo) AuthServer {
	return AuthServer{
		repo,
	}
}

func (s *AuthServer) RegisterHandler(c context.Context, in *auth.RegisterRequest) (*auth.SafeUser, error) {
	md, ok := metadata.FromIncomingContext(c)
	r := c.Value("test2")
	fmt.Println(md, ok, r)

	return &auth.SafeUser{Name: "auth",
		Surname: "s",
		Email:   "a",
	}, nil
}
