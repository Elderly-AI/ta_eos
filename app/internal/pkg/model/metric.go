package model

import (
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/metrics"
	"github.com/golang/glog"
	"google.golang.org/protobuf/types/known/structpb"
	"google.golang.org/protobuf/types/known/timestamppb"
	"time"
)

type Metric struct {
	MethodName string `json:"method_name" db:"method_name"`
	Date       time.Time
	UserId     int64                   `json:"user_id" db:"user_id"`
	Data       *map[string]interface{} `json:"metric_data" db:"metric_data"`
}

func MetricToGRPCMetric(m Metric) *pb.Metric {
	var data *structpb.Struct
	var err error
	if m.Data != nil {
		data, err = structpb.NewStruct(*m.Data)
	} else {
		data, err = nil, nil
	}
	if err != nil {
		glog.Warning("error when conver struct %r", err)
	}
	return &pb.Metric{
		MethodName: m.MethodName,
		Date:       timestamppb.New(m.Date),
		MetricData: data,
		UserId:     m.UserId,
	}
}

func MetricsToGRPCMetrics(m []Metric) *pb.MetricsArray {
	res := make([]*pb.Metric, 0, len(m))
	for _, metr := range m {
		res = append(res, MetricToGRPCMetric(metr))
	}
	return &pb.MetricsArray{
		Metrics: res,
	}
}
