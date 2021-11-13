package calculations

import (
	"github.com/Elderly-AI/ta_eos/internal/pkg/calculations"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

type CalculationsServer struct {
	pb.UnimplementedCalculationsServer
	CalculationsFacade *calculations.Facade
}

func NewCalculationsHandler(calculations *calculations.Facade) CalculationsServer {
	return CalculationsServer{
		CalculationsFacade: calculations,
	}
}
