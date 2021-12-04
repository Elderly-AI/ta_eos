package main

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/golang/glog"
	gwruntime "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/jmoiron/sqlx"
	"google.golang.org/grpc"
	"log"
	"net"
	"net/http"

	"github.com/Elderly-AI/ta_eos/internal/app/auth"
	calc "github.com/Elderly-AI/ta_eos/internal/app/calculations"
	calcFacade "github.com/Elderly-AI/ta_eos/internal/pkg/calculations"
	"github.com/Elderly-AI/ta_eos/internal/pkg/config"
	db "github.com/Elderly-AI/ta_eos/internal/pkg/database/auth"
	common "github.com/Elderly-AI/ta_eos/internal/pkg/middleware"
	"github.com/Elderly-AI/ta_eos/internal/pkg/session"
	pbAuth "github.com/Elderly-AI/ta_eos/pkg/proto/auth"
	pbCalculations "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

func registerServices(opts Options, s *grpc.Server) {
	authRepo := db.CreateRepo(opts.PosgtresConnection)
	authDelivery := auth.NewAuthHandler(authRepo, opts.SessionStore)
	pbAuth.RegisterAuthServer(s, &authDelivery)

	calculationsFacade := calcFacade.New()
	calculationsDelivery := calc.NewCalculationsHandler(calculationsFacade)
	pbCalculations.RegisterCalculationsServer(s, &calculationsDelivery)
}

func newGateway(ctx context.Context, conn *grpc.ClientConn, opts []gwruntime.ServeMuxOption) (http.Handler, error) {
	mux := gwruntime.NewServeMux(opts...)

	for _, f := range []func(ctx context.Context, mux *gwruntime.ServeMux, conn *grpc.ClientConn) error{
		pbAuth.RegisterAuthHandler,
		pbCalculations.RegisterCalculationsHandler,
	} {
		if err := f(ctx, mux, conn); err != nil {
			return nil, err
		}
	}
	return mux, nil
}

type Options struct {
	Addr               string
	Mux                []gwruntime.ServeMuxOption
	PosgtresConnection *sqlx.DB
	RedisConnection    *redis.Client
	SessionStore       *session.Store
}

func createInitialOptions(conf config.Config) Options {
	opts := Options{}
	database, err := sqlx.Connect("postgres", fmt.Sprintf("host=%s user=postgres password=postgres dbname=postgres sslmode=disable", conf.PostgresHost))
	if err != nil {
		glog.Fatal(err)
	}
	opts.PosgtresConnection = database

	redisClient := redis.NewClient(&redis.Options{
		Addr:     conf.RedisAddr,
		Password: "",
		DB:       0,
	})
	opts.RedisConnection = redisClient

	opts.SessionStore = session.CreateSessionStore(opts.RedisConnection, conf.CookieTimeout)
	opts.Addr = "0.0.0.0:8080"
	return opts
}

func addGRPCMiddlewares(opts Options) Options {
	opts.Mux = []gwruntime.ServeMuxOption{
		gwruntime.WithMetadata(opts.SessionStore.AuthMiddleware),
		gwruntime.WithOutgoingHeaderMatcher(EmptyHeaderMatcherFunc),
		gwruntime.WithMetadata(opts.SessionStore.AuthMiddleware),
	}
	return opts
}

func main() {
	conf := config.GetConfig()
	opts := createInitialOptions(conf)
	opts = addGRPCMiddlewares(opts)

	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalln("Failed to listen:", err)
	}

	s := grpc.NewServer()
	registerServices(opts, s)
	log.Println("Serving gRPC on 0.0.0.0:8080")
	go func() {
		log.Fatalln(s.Serve(lis))
	}()
	// register services

	// Create a client connection to the gRPC server we just started
	// This is where the gRPC-Gateway proxies the requests
	conn, err := grpc.DialContext(
		context.Background(),
		opts.Addr,
		grpc.WithBlock(),
		grpc.WithInsecure(),
	)
	if err != nil {
		log.Fatalln("Failed to dial server:", err)
	}

	gw, err := newGateway(context.Background(), conn, opts.Mux)
	if err != nil {
		fmt.Println(err)
	}
	mux := http.NewServeMux()
	mux.Handle("/", gw)

	m := common.NewPostgresMiddleware(opts.PosgtresConnection)
	gwServer := &http.Server{
		Addr:    ":8090",
		Handler: m.MetricsMiddleware(common.AllowCORS(mux)),
	}

	log.Println("Serving gRPC-Gateway on http://0.0.0.0:8090")
	log.Fatalln(gwServer.ListenAndServe())
}

func EmptyHeaderMatcherFunc(s string) (string, bool) {
	return s, true
}
