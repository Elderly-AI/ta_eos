package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"

	"google.golang.org/grpc"

	pbAuth "github.com/Elderly-AI/ta_eos/pkg/proto"
	"github.com/Elderly-AI/ta_eos/internal/app/auth"
	common "github.com/Elderly-AI/ta_eos/internal/pkg/middleware"
	gwruntime "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
)

func newGateway(ctx context.Context, conn *grpc.ClientConn, opts []gwruntime.ServeMuxOption) (http.Handler, error) {
	mux := gwruntime.NewServeMux(opts...)

	for _, f := range []func(ctx context.Context, mux *gwruntime.ServeMux, conn *grpc.ClientConn) error{
		pbAuth.RegisterAuthHandler,
	} {
		if err := f(ctx, mux, conn); err != nil {
			return nil, err
		}
	}
	return mux, nil
}

type Options struct {
	// Addr is the address to listen
	Addr string

	// OpenAPIDir is a path to a directory from which the server
	// serves OpenAPI specs.
	OpenAPIDir string

	// Mux is a list of options to be passed to the gRPC-Gateway multiplexer
	Mux []gwruntime.ServeMuxOption
}

func createInitialOptions() Options {
	opts := Options{}
	opts.Mux = []gwruntime.ServeMuxOption{gwruntime.WithMetadata(common.AuthMiddleware)}
	return opts
}

func main() {
	opts := createInitialOptions()
	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalln("Failed to listen:", err)
	}

	s := grpc.NewServer()
	log.Println("Serving gRPC on 0.0.0.0:8080")
	go func() {
		log.Fatalln(s.Serve(lis))
	}()

	registerServices(s)
	// register services

	// Create a client connection to the gRPC server we just started
	// This is where the gRPC-Gateway proxies the requests
	conn, err := grpc.DialContext(
		context.Background(),
		"0.0.0.0:8080",
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

func registerServices(s *grpc.Server) {
	authRepo := AuthRepo{}
	authDelivery := auth.NewAuthHandler(authRepo)
	pbAuth.RegisterAuthServer(s, &authDelivery)
}}