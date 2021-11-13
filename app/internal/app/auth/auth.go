package auth

import (
	"context"
	"fmt"

	"github.com/golang/glog"
	"github.com/jinzhu/copier"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"

	authRepo "github.com/Elderly-AI/ta_eos/internal/pkg/database/auth"
	"github.com/Elderly-AI/ta_eos/internal/pkg/models"
	"github.com/Elderly-AI/ta_eos/internal/pkg/session"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/auth"
)

type AuthServer struct {
	repo authRepo.Repo
	pb.UnimplementedAuthServer
}

func (s *AuthServer) LoginHandler(ctx context.Context, request *pb.LoginRequest) (*pb.User, error) {
	panic("implement me")
}

func (s *AuthServer) GetCurrentUser(ctx context.Context, request *pb.EmptyRequest) (*pb.SafeUser, error) {
	panic("implement me")
}

func NewAuthHandler(repo authRepo.Repo) AuthServer {
	return AuthServer{
		repo: repo,
	}
}

func (s *AuthServer) RegisterHandler(c context.Context, in *pb.RegisterRequest) (*pb.SafeUser, error) {
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
	asd := copier.Copy(cleanUsr, in.User)
	fmt.Println(asd)
	usr, err := s.repo.AddUser(c, cleanUsr)
	err = copier.Copy(res, &usr)
	fmt.Println(err)
	err = SendAuthCookieGRPC(c)
	fmt.Println(err)
	return res, err
}

func SendAuthCookieGRPC(c context.Context) error {
	header := metadata.Pairs("Set-Cookie", session.GetSetCookieHeader())
	err := grpc.SendHeader(c, header)
	if err != nil {
		return err
	}

	// TODO delete
	header = metadata.Pairs("test", session.GetSetCookieHeader())
	err = grpc.SendHeader(c, header)
	if err != nil {
		return err
	}
	return nil
}
