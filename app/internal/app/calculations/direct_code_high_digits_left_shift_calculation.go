package calculations

import (
	"context"
	model "github.com/Elderly-AI/ta_eos/internal/pkg/model/calculations"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

func (s *CalculationsServer) DirectCodeHighDigitsLeftShiftCalculation(ctx context.Context, req *pb.DirectCodeHighDigitsLeftShiftRequest) (*pb.DirectCodeHighDigitsLeftShiftResponse, error) {
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
	steps := s.CalculationsFacade.DirectCodeHighDigitsLeftShiftCalculation(
		model.CalculationRequest{
			Factor:     factor,
			Multiplier: multiplier,
			GridSize:   gridSize,
		})
	resp := convertStepsIntoDirectCodeHighDigitsLeftShiftResponse(steps)
	return &resp, nil
}

func convertStepsIntoDirectCodeHighDigitsLeftShiftResponse(steps []model.Step) (resp pb.DirectCodeHighDigitsLeftShiftResponse) {
	for _, step := range steps {
		resp.Sequence = append(resp.Sequence, &pb.DirectCodeHighDigitsLeftShiftResponse_Step{
			Index:      step.Index,
			BinDec:     step.BinDec,
			Value:      step.Value,
			PartialSum: step.PartialSum,
		})
	}
	return
}
