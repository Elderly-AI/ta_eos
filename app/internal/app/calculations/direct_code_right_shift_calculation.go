package calculations

import (
	"context"

	model "github.com/Elderly-AI/ta_eos/internal/pkg/model/calculations"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

func (s *CalculationsServer) DirectCodeRightShiftCalculation(ctx context.Context, req *pb.DirectCodeRightShiftRequest) (*pb.DirectCodeRightShiftResponse, error) {
	factor, err := convertBinStringToNumber(req.GetFactor())
	if err != nil {
		return nil, err
	}
	multiplier, err := convertBinStringToNumber(req.GetMultiplier())
	if err != nil {
		return nil, err
	}
	steps := s.CalculationsFacade.DirectCodeRightShiftCalculation(
		model.CalculationRequest{
			Factor:     factor,
			Multiplier: multiplier,
		})
	resp := convertStepsIntoDirectCodeRightShiftResponse(steps)
	return &resp, nil
}

func convertStepsIntoDirectCodeRightShiftResponse(steps []model.Step) (resp pb.DirectCodeRightShiftResponse) {
	for _, step := range steps {
		resp.Sequence = append(resp.Sequence, &pb.DirectCodeRightShiftResponse_Step{
			Index:  step.Index,
			BinDec: step.BinDec,
			Value:  step.Value,
		})
	}
	return
}
