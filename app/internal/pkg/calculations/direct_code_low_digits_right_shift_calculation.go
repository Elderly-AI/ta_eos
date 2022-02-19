package calculations

import (
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
)

func (c *Facade) DirectCodeLowDigitsRightShiftCalculation(req model.CalculationRequest) (steps []model.Step) {
	var sum uint64 = 0
	multiplier := req.Multiplier.Value << len(req.Factor.BinValue)
	for index, binDec := range reverseString(req.Factor.BinValue) {
		steps = append(steps, createStep(multiplier, string(binDec), uint64(index), sum, req.GridSize))
		sum = sum >> 1
		if string(binDec) != BinZeroString {
			sum = sum + multiplier
		}
	}
	steps = append(steps, createFinalStep(req.Multiplier.Value, req.Factor.Value, uint64(len(req.Factor.BinValue)), req.GridSize))
	return steps
}
