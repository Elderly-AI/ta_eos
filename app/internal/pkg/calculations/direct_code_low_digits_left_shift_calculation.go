package calculations

import (
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	"strconv"
	"strings"
)

const (
	BinZeroString = "0"
	BinOneString  = "1"
)

func (c *Facade) DirectCodeLowDigitsLeftShiftCalculation(req model.CalculationRequest) (steps []model.Step) {
	var sum uint64 = 0
	multiplier := req.Multiplier.Value
	for index, binDec := range reverseString(req.Factor.BinValue) {
		steps = append(steps, createStep(multiplier, string(binDec), uint64(index), sum, req.GridSize))
		if string(binDec) != BinZeroString {
			sum = sum + multiplier
		}
		multiplier = multiplier << 1
	}
	steps = append(steps, createFinalStep(req.Multiplier.Value, req.Factor.Value, uint64(len(req.Factor.BinValue)), req.GridSize))
	return steps
}

func createStep(value uint64, binDec string, index uint64, sum uint64, gridSize uint32) model.Step {
	step := model.Step{
		Index:      index,
		BinDec:     binDec,
		Value:      toBinValue(value, 2*gridSize),
		PartialSum: toBinValue(sum, 2*gridSize),
	}
	if binDec == BinZeroString {
		step.Value = strings.Repeat(BinZeroString, int(2*gridSize))
	}
	return step
}

func createFinalStep(multiplier uint64, factor uint64, index uint64, gridSize uint32) model.Step {
	value := multiplier * factor
	partialSum := toBinValue(value, 2*gridSize)
	return model.Step{
		PartialSum: partialSum,
		Index:      index,
	}
}

func reverseString(str string) (result string) {
	for _, v := range str {
		result = string(v) + result
	}
	return
}

func toBinValue(value uint64, gridSize uint32) string {
	v := strconv.FormatUint(value, 2)
	return strings.Repeat(BinZeroString, int(gridSize)-len(v)) + v
}
