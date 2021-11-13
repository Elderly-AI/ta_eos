package session

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/golang/glog"
	"github.com/nu7hatch/gouuid"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
	"net/http"
	"time"
)

type Store struct {
	db            *redis.Client
	cookieTimeout int
}

func CreateSessionStore(client *redis.Client, cookieTimeout int) *Store {
	return &Store{
		db:            client,
		cookieTimeout: cookieTimeout,
	}
}

func (s *Store) AuthMiddleware(ctx context.Context, request *http.Request) metadata.MD {
	meta := make(map[string]string)
	token, err := request.Cookie("authToken")
	if err != nil {
		return nil
	}
	result, err := s.db.Get(ctx, token.Value).Result()
	if err != nil {
		glog.Warning("No auth")
		result = ""
	}
	meta["user_id"] = result
	md := metadata.New(meta)
	return md
}

func GetUserIdFromContext(c context.Context) *string {
	md, ok := metadata.FromIncomingContext(c)
	if ok {
		userID := md["user_id"]
		if len(userID) > 0 && userID[0] != "" {
			return &userID[0]
		}
	}
	glog.Warning("not ok or bad userID")
	return nil
}

func (s *Store) SetCookieGRPC(c context.Context, userId string) error {
	authToken, _ := uuid.NewV4()
	strToken := authToken.String()

	err := s.db.Set(c, strToken, userId, time.Duration(s.cookieTimeout)).Err()
	if err != nil {
		return err
	}
	return s.SetAuthCookieHeaderGrpc(c, strToken)
}

func (s *Store) GetSetCookieHeader(authToken string) string {
	return fmt.Sprintf("authToken=%s; Max-Age=%d", authToken, s.cookieTimeout)
}

func (s *Store) SetAuthCookieHeaderGrpc(c context.Context, authToken string) error {
	cookie := s.GetSetCookieHeader(authToken)
	header := metadata.Pairs("Set-Cookie", cookie)
	err := grpc.SetHeader(c, header)
	if err != nil {
		return err
	}
	return nil
}
