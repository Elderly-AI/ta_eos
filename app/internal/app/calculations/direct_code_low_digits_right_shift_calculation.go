package calculations

import (
	"context"

	model "github.com/Elderly-AI/ta_eos/internal/pkg/model/calculations"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

func (s *CalculationsServer) DirectCodeLowDigitsRightShiftCalculation(ctx context.Context, req *pb.DirectCodeLowDigitsRightShiftRequest) (*pb.DirectCodeLowDigitsRightShiftResponse, error) {
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
	steps := s.CalculationsFacade.DirectCodeLowDigitsRightShiftCalculation(
		model.CalculationRequest{
			Factor:     factor,
			Multiplier: multiplier,
			GridSize:   gridSize,
		})
	resp := convertStepsIntoDirectCodeLowDigitsRightShiftResponse(steps)
	return &resp, nil
}

func convertStepsIntoDirectCodeLowDigitsRightShiftResponse(steps []model.Step) (resp pb.DirectCodeLowDigitsRightShiftResponse) {
	for _, step := range steps {
		resp.Sequence = append(resp.Sequence, &pb.DirectCodeLowDigitsRightShiftResponse_Step{
			Index:      step.Index,
			BinDec:     step.BinDec,
			Value:      step.Value,
			PartialSum: step.PartialSum,
		})
	}
	return
}
