package session

import (
	"context"
	"fmt"
	"github.com/Elderly-AI/ta_eos/internal/pkg/database/metrics"
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	"github.com/go-redis/redis/v8"
	"github.com/golang/glog"
	"github.com/nu7hatch/gouuid"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
	"net/http"
	"strconv"
	"time"
)

type Store struct {
	db            *redis.Client
	metricsRepo   *metrics.Repo
	cookieTimeout int
}

func CreateSessionStore(client *redis.Client, cookieTimeout int, repo *metrics.Repo) *Store {
	return &Store{
		db:            client,
		cookieTimeout: cookieTimeout,
		metricsRepo:   repo,
	}
}

func (s *Store) AuthMiddleware(ctx context.Context, request *http.Request) metadata.MD {
	meta := make(map[string]string)
	token, err := request.Cookie("authToken")
	if err != nil {
		return nil
	}
	rawUserId, err := s.db.Get(ctx, token.Value).Result()
	if err != nil {
		rawUserId = ""
	}
	userId, _ := strconv.Atoi(rawUserId)
	meta["user_id"] = rawUserId
	md := metadata.New(meta)

	metric := model.Metric{ // TODO add to usecase
		MethodName: request.RequestURI,
		Date:       time.Now(),
		UserId:     uint64(userId),
	}
	err = s.metricsRepo.AddMetric(metric)
	if err != nil {
		glog.Warning("error on metrics %r", err)
	}

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
	return nil
}

func (s *Store) SetCookieGRPC(c context.Context, userId string) error {
	authToken, _ := uuid.NewV4()
	strToken := authToken.String()
	expired := time.Duration(s.cookieTimeout) * time.Second

	err := s.db.Set(c, strToken, userId, expired).Err()
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
