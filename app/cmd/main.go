package main

import (
	"context"
	"fmt"
	"github.com/golang/glog"
	"log"
	"net"
	"net/http"

	"github.com/go-redis/redis/v8"
	gwruntime "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"

	"github.com/Elderly-AI/ta_eos/internal/app/auth"
	calc "github.com/Elderly-AI/ta_eos/internal/app/calculations"
	calcFacade "github.com/Elderly-AI/ta_eos/internal/pkg/calculations"
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

func createInitialOptions() Options {
	opts := Options{}
	db, err := sqlx.Connect("postgres", "user=postgres dbname=postgres sslmode=disable")
	if err != nil {
		glog.Fatal(err)
	}
	opts.PosgtresConnection = db

	opts.RedisConnection = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	opts.SessionStore = session.CreateSessionStore(opts.RedisConnection, 2_678_400)
	opts.Addr = "0.0.0.0:8080"
	return opts
}

func addMiddlewares(opts Options) Options {
	opts.Mux = []gwruntime.ServeMuxOption{
		gwruntime.WithMetadata(opts.SessionStore.AuthMiddleware),
		gwruntime.WithOutgoingHeaderMatcher(EmptyHeaderMatcherFunc),
	}
	return opts
}

func main() {
	opts := createInitialOptions()
	opts = addMiddlewares(opts)

	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalln("Failed to listen:", err)
	}

	s := grpc.NewServer()
	log.Println("Serving gRPC on 0.0.0.0:8080")
	go func() {
		log.Fatalln(s.Serve(lis))
	}()

	registerServices(opts, s)
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

	gwServer := &http.Server{
		Addr:    ":8090",
		Handler: common.AllowCORS(mux),
	}

	log.Println("Serving gRPC-Gateway on http://0.0.0.0:8090")
	log.Fatalln(gwServer.ListenAndServe())
}

func EmptyHeaderMatcherFunc(s string) (string, bool) {
	return s, true
}
