package calculations

import (
	"context"

	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	"github.com/Elderly-AI/ta_eos/internal/pkg/value_lib"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

func (s *CalculationsServer) AdditionalCodeWithCorrectiveStepCalculation(ctx context.Context, req *pb.AdditionalCodeWithCorrectiveStepRequest) (*pb.AdditionalCodeWithCorrectiveStepResponse, error) {
	factor, err := model.CreateValueFromString(req.Factor, uint8(req.GridSize), value_lib.ValueTypeAdditionalCode)
	if err != nil {
		return nil, err
	}
	multiplier, err := model.CreateValueFromString(req.Multiplier, uint8(req.GridSize), value_lib.ValueTypeAdditionalCode)
	if err != nil {
		return nil, err
	}

	steps, err := s.CalculationsFacade.AdditionalCodeWithCorrectiveStepCalculation(
		model.CalculationRequestV2{
			Factor:     factor,
			Multiplier: multiplier,
			GridSize:   req.GetGridSize(),
		})

	resp := convertStepsAdditionalCodeWithCorrectiveStepResponse(steps)
	return &resp, nil
}

func convertStepsAdditionalCodeWithCorrectiveStepResponse(steps []model.Step) pb.AdditionalCodeWithCorrectiveStepResponse {
	return pb.AdditionalCodeWithCorrectiveStepResponse{
		Sequence: convertSteps(steps),
	}
}

func convertSteps(steps []model.Step) []*pb.AdditionalCodeWithCorrectiveStepResponse_Step {
	sequence := make([]*pb.AdditionalCodeWithCorrectiveStepResponse_Step, 0)
	for _, step := range steps {
		sequence = append(sequence, convertStep(step))
	}
	return sequence
}

func convertStep(step model.Step) *pb.AdditionalCodeWithCorrectiveStepResponse_Step {
	return &pb.AdditionalCodeWithCorrectiveStepResponse_Step{
		Index:      step.Index,
		BinDec:     step.BinDec,
		Value:      step.Value,
		PartialSum: step.PartialSum,
	}
}
