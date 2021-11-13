package calculations

import (
	model "github.com/Elderly-AI/ta_eos/internal/pkg/model/calculations"
	"strings"
)

func (c *Facade) DirectCodeRightShiftCalculation(req model.CalculationRequest) (steps []model.Step) {
	for index, binDec := range req.Factor.BinValue {
		multiplierString := strings.Repeat(BinZeroString, index) + req.Multiplier.BinValue
		steps = append(steps, createStep(multiplierString, string(binDec), uint64(index+1)))
	}
	steps = append(steps, createFinalStep(req.Multiplier.Value, req.Factor.Value))
	return steps
}
