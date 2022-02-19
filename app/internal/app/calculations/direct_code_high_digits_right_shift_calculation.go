package calculations

import (
	"context"
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"

	pb "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

func (s *CalculationsServer) DirectCodeHighDigitsRightShiftCalculation(ctx context.Context, req *pb.DirectCodeHighDigitsRightShiftRequest) (*pb.DirectCodeHighDigitsRightShiftResponse, error) {
	factor, err := convertBinStringToNumber(req.GetFactor())
	if err != nil {
		return nil, err
	}
	multiplier, err := convertBinStringToNumber(req.GetMultiplier())
	if err != nil {
		return nil, err
	}
	gridSize := req.GetGridSize()
	if gridSize == 0 {
		gridSize = defaultGridSize
	}
	if err = validateFactorAndMultiplier(factor.BinValue, multiplier.BinValue, gridSize); err != nil {
		return nil, err
	}
	steps := s.CalculationsFacade.DirectCodeHighDigitsRightShiftCalculation(
		model.CalculationRequest{
			Factor:     factor,
			Multiplier: multiplier,
			GridSize:   gridSize,
		})
	resp := convertStepsIntoDirectCodeHighDigitsRightShiftResponse(steps)
	return &resp, nil
}

func convertStepsIntoDirectCodeHighDigitsRightShiftResponse(steps []model.Step) (resp pb.DirectCodeHighDigitsRightShiftResponse) {
	for _, step := range steps {
		resp.Sequence = append(resp.Sequence, &pb.DirectCodeHighDigitsRightShiftResponse_Step{
			Index:      step.Index,
			BinDec:     step.BinDec,
			Value:      step.Value,
			PartialSum: step.PartialSum,
		})
	}
	return
}
