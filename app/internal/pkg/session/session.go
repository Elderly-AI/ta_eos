package session

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/golang/glog"
	"github.com/nu7hatch/gouuid"
	"google.golang.org/grpc/metadata"
	"net/http"
)

type Store struct {
	db *redis.Client
}

func CreateSessionStore(client *redis.Client) Store {
	return Store{
		db: client,
	}
}

func (s *Store) AuthMiddleware(ctx context.Context, request *http.Request) metadata.MD {
	meta := make(map[string]string)
	token, err := request.Cookie("auth_token")

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
		userID := md["user_id"][0]
		if userID != "" {
			return &userID
		}
	}
	glog.Warning("not ok or bad userID")
	return nil
}

func GetSetCookieHeader() string {
	id, _ := uuid.NewV4()
	return fmt.Sprintf("auth_token=%s; Max-Age=2592000", id.String())

}
