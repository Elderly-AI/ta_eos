package metrics

import (
	"context"
	"github.com/Elderly-AI/ta_eos/internal/pkg/database/metrics"
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/metrics"
)

type Server struct {
	repo metrics.Repo
	pb.UnimplementedMetricsServer
}

func NewMetricsHandler(repo metrics.Repo) Server {
	return Server{
		repo: repo,
	}
}

func (s *Server) SearchTimestamp(ctx context.Context, request *pb.SearchMetricsTimestampRequest) (*pb.MetricsArray, error) {
	res, err := s.repo.SearchMetricWithTimestamp(request.Text, request.From.AsTime(), request.To.AsTime())
	if err != nil {
		return nil, err
	}
	return model.MetricsToGRPCMetrics(res), nil
}

func (s *Server) Search(ctx context.Context, request *pb.SearchMetricsRequest) (*pb.MetricsArray, error) {
	res, err := s.repo.SearchMetricWithoutTimestamp(request.Text)
	if err != nil {
		return nil, err
	}
	return model.MetricsToGRPCMetrics(res), nil
}
