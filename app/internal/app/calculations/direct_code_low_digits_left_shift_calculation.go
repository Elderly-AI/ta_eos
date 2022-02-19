package calculations

import (
	"context"
	"fmt"
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	"strconv"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

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

	errGridSizeIsTooBig = status.Error(
		codes.InvalidArgument,
		"Grid Size must be less than 8",
	)

	errGridSizeMustBeGraterThenZero = status.Error(
		codes.InvalidArgument,
		"Grid Size must be grater than zero",
	)
)

const maxGridSize uint32 = 8
const defaultGridSize uint32 = 8

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
	if err = validateFactorAndMultiplier(factor.BinValue, multiplier.BinValue, gridSize); err != nil {
		return nil, err
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

func validateFactorAndMultiplier(factor string, multiplier string, gridSize uint32) error {
	if err := validateGridSize(gridSize); err != nil {
		return err
	}
	if err := validateMinLength(factor, multiplier); err != nil {
		return err
	}
	if err := validateMaxLength(factor, multiplier, gridSize); err != nil {
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

func validateMaxLength(factor string, multiplier string, gridSize uint32) error {
	if len(factor) > int(gridSize) || len(multiplier) > int(gridSize) {
		return errValuesMustBeShorter
	}
	return nil
}

func validateGridSize(gridSize uint32) error {
	if gridSize > maxGridSize {
		return errGridSizeIsTooBig
	}
	if gridSize <= 0 {
		return errGridSizeMustBeGraterThenZero
	}
	return nil
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
