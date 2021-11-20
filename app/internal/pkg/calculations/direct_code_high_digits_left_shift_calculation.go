package calculations

import (
	model "github.com/Elderly-AI/ta_eos/internal/pkg/model/calculations"
)

func (c *Facade) DirectCodeHighDigitsLeftShiftCalculation(req model.CalculationRequest) (steps []model.Step) {
	var sum uint64 = 0
	for index, binDec := range req.Factor.BinValue {
		steps = append(steps, createStep(req.Multiplier.Value, string(binDec), uint64(index), sum, req.GridSize))
		sum = sum << 1
		if string(binDec) != BinZeroString {
			sum += req.Multiplier.Value
		}
	}
	steps = append(steps, createFinalStep(req.Multiplier.Value, req.Factor.Value, uint64(len(req.Factor.BinValue)), req.GridSize))
	return steps
}
