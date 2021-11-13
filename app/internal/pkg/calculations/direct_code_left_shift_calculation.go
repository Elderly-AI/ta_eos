package calculations

import (
	"strconv"
	"strings"

	model "github.com/Elderly-AI/ta_eos/internal/pkg/model/calculations"
)

const (
	BinZeroString = "0"
	BinOneString  = "1"
)

func (c *Facade) DirectCodeLeftShiftCalculation(req model.CalculationRequest) (steps []model.Step) {
	for index, binDec := range reverseString(req.Factor.BinValue) {
		steps = append(steps, createStep(req.Multiplier.BinValue, string(binDec), uint64(index)))
	}
	steps = append(steps, createFinalStep(req.Multiplier.Value, req.Factor.Value))
	return steps
}

func createStep(value string, binDec string, index uint64) model.Step {
	step := model.Step{
		Index:  index,
		BinDec: binDec,
		Value:  value,
	}
	if binDec == BinZeroString {
		step.Value = strings.Repeat(BinZeroString, len(value))
	}
	return step
}

func createFinalStep(multiplier uint64, factor uint64) model.Step {
	value := multiplier * factor
	binValue := strconv.FormatUint(value, 2)
	return model.Step{
		Value: binValue,
	}
}

func reverseString(str string) (result string) {
	for _, v := range str {
		result = string(v) + result
	}
	return
}
