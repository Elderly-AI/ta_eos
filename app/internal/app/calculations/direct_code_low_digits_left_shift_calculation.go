package calculations

import (
	"context"
	"strconv"

	model "github.com/Elderly-AI/ta_eos/internal/pkg/model/calculations"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

func (s *CalculationsServer) DirectCodeLowDigitsLeftShiftCalculation(ctx context.Context, req *pb.DirectCodeLowDigitsLeftShiftRequest) (*pb.DirectCodeLowDigitsLeftShiftResponse, error) {
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
	steps := s.CalculationsFacade.DirectCodeLowDigitsLeftShiftCalculation(
		model.CalculationRequest{
			Factor:     factor,
			Multiplier: multiplier,
			GridSize:   gridSize,
		})
	resp := convertStepsIntoDirectCodeLowDigitsLeftShiftResponse(steps)
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

func convertStepsIntoDirectCodeLowDigitsLeftShiftResponse(steps []model.Step) (resp pb.DirectCodeLowDigitsLeftShiftResponse) {
	for _, step := range steps {
		resp.Sequence = append(resp.Sequence, &pb.DirectCodeLowDigitsLeftShiftResponse_Step{
			Index:      step.Index,
			BinDec:     step.BinDec,
			Value:      step.Value,
			PartialSum: step.PartialSum,
		})
	}
	return
}
