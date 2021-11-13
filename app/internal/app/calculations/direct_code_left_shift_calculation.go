package calculations

import (
	"context"
	"strconv"

	model "github.com/Elderly-AI/ta_eos/internal/pkg/model/calculations"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

func (s *CalculationsServer) DirectCodeLeftShiftCalculation(ctx context.Context, req *pb.DirectCodeLeftShiftRequest) (*pb.DirectCodeLeftShiftResponse, error) {
	factor, err := convertBinStringToNumber(req.GetFactor())
	if err != nil {
		return nil, err
	}
	multiplier, err := convertBinStringToNumber(req.GetMultiplier())
	if err != nil {
		return nil, err
	}
	steps := s.CalculationsFacade.DirectCodeLeftShiftCalculation(
		model.CalculationRequest{
			Factor:     factor,
			Multiplier: multiplier,
		})
	resp := convertStepsIntoDirectCodeLeftShiftResponse(steps)
	return &resp, nil
}

func convertBinStringToNumber(binValue string) (*model.Number, error) {
	value, err := strconv.ParseUint(binValue, 2, 64)
	if err != nil {
		return nil, err
	}
	return &model.Number{
		Value:    value,
		BinValue: binValue,
	}, nil
}

func convertStepsIntoDirectCodeLeftShiftResponse(steps []model.Step) (resp pb.DirectCodeLeftShiftResponse) {
	for _, step := range steps {
		resp.Sequence = append(resp.Sequence, &pb.DirectCodeLeftShiftResponse_Step{
			Index:  step.Index,
			BinDec: step.BinDec,
			Value:  step.Value,
		})
	}
	return
}
