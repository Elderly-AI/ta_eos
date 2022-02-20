package template

import (
	"context"
	"fmt"
	templateRepo "github.com/Elderly-AI/ta_eos/internal/pkg/database/template"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/template"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Server struct {
	repo templateRepo.Repo
	pb.UnimplementedTemplateServer
}

func (s Server) GetKrHandler(ctx context.Context, request *pb.KrRequest) (*pb.OkMessage, error) {
	fmt.Println(request.Data)
	return &pb.OkMessage{
		Ok:    true,
		Error: "",
	}, nil
}
func (s Server) ApproveKrHandler(context.Context, *pb.KrRequest) (*pb.OkMessage, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ApproveKrHandler not implemented")
}

func NewTemplateHandler(repo templateRepo.Repo) Server {
	return Server{
		repo: repo,
	}
}
