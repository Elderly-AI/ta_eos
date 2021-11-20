package calculations

import (
	"context"
	"fmt"
	"strconv"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	model "github.com/Elderly-AI/ta_eos/internal/pkg/model/calculations"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/calculations"
)

var (
	errMustBeGraterThenZero = status.Error(
		codes.InvalidArgument,
		"Factor and Multiplier length must be greater than zero",
	)

	errValuesMustBeShorter = status.Error(
		codes.InvalidArgument,
		"Factor and Multiplier length must be less than 8",
	)

	errMustStartWithOne = status.Error(
		codes.InvalidArgument,
		"Factor and Multiplier must start with one",
	)

	errMustBeSameLength = status.Errorf(
		codes.InvalidArgument,
		"Factor and Multiplier must be the same length",
	)
)

func (s *CalculationsServer) DirectCodeLeftShiftCalculation(ctx context.Context, req *pb.DirectCodeLeftShiftRequest) (*pb.DirectCodeLeftShiftResponse, error) {
	err := validateFactorAndMultiplier(req.GetFactor(), req.GetMultiplier())
	if err != nil {
		return nil, err
	}
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
		return nil, status.Errorf(
			codes.InvalidArgument,
			fmt.Sprintf("Value %s have invalid format", binValue),
		)
	}
	return &model.Number{
		Value:    value,
		BinValue: binValue,
	}, nil
}

func validateFactorAndMultiplier(factor string, multiplier string) error {
	if err := validateSameLength(factor, multiplier); err != nil {
		return err
	}
	if err := validateMinLength(factor, multiplier); err != nil {
		return err
	}
	if err := validateMaxLength(factor, multiplier); err != nil {
		return err
	}
	if err := validateStartsWithZero(factor, multiplier); err != nil {
		return err
	}
	return nil
}

func validateMinLength(factor string, multiplier string) error {
	if len(factor) == 0 || len(multiplier) == 0 {
		return errMustBeGraterThenZero
	}
	return nil
}

func validateMaxLength(factor string, multiplier string) error {
	if len(factor) > 8 || len(multiplier) > 8 {
		return errValuesMustBeShorter
	}
	return nil
}

func validateStartsWithZero(factor string, multiplier string) error {
	if factor[0] != '1' || multiplier[0] != '1' {
		return errMustStartWithOne
	}
	return nil
}

func validateSameLength(factor string, multiplier string) error {
	if len(factor) != len(multiplier) {
		return errMustBeSameLength
	}
	return nil
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
