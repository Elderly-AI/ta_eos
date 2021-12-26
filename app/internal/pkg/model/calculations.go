package model

import (
	"fmt"
	"strconv"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/Elderly-AI/ta_eos/internal/pkg/value_lib"
)

func CreateValueFromString(val string, grid uint8, valueType value_lib.ValueType) (value_lib.Value, error) {
	value, err := strconv.ParseUint(val, 2, 64)
	if err != nil {
		return value_lib.Value{}, status.Errorf(
			codes.InvalidArgument,
			fmt.Sprintf("Value %s have invalid format", val),
		)
	}
	return value_lib.InitValue(value, grid, valueType), nil
}

type Number struct {
	Value    uint64
	BinValue string
}

type CalculationRequest struct {
	Multiplier *Number
	Factor     *Number
	GridSize   uint32
}

type CalculationRequestV2 struct {
	Multiplier value_lib.Value
	Factor     value_lib.Value
	GridSize   uint32
}

type Step struct {
	Index      uint64
	BinDec     string
	Value      string
	PartialSum string
}
