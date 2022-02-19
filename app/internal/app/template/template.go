package template

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	templateRepo "github.com/Elderly-AI/ta_eos/internal/pkg/database/template"
	templateFacade "github.com/Elderly-AI/ta_eos/internal/pkg/template"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/template"
)

type Server struct {
	repo   *templateRepo.Repo
	facade *templateFacade.Facade
	pb.UnimplementedTemplateServer
}

func (s Server) GetKrHandler(ctx context.Context, request *pb.KrRequest) (*pb.OkMessage, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetKrHandler not implemented")
}

func (s Server) ApproveKrHandler(context.Context, *pb.KrRequest) (*pb.OkMessage, error) {

	return nil, status.Errorf(codes.Unimplemented, "method ApproveKrHandler not implemented")
}

func NewTemplateHandler(repo *templateRepo.Repo, facade *templateFacade.Facade) Server {
	return Server{
		repo:   repo,
		facade: facade,
	}
}
