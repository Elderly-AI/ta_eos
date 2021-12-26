package calculations

import (
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	"github.com/Elderly-AI/ta_eos/internal/pkg/value_lib"
)

func (c *Facade) AdditionalCodeWithCorrectiveStepCalculation(req model.CalculationRequestV2) (steps []model.Step, err error) {
	expandGreed := uint8(2 * req.GridSize)
	factor := req.Factor.ChangeGreed(expandGreed).LeftShift(uint64(req.GridSize))
	multiplier := req.Multiplier.ChangeGreed(expandGreed).LeftShift(uint64(req.GridSize))

	sum := value_lib.InitValue(0, expandGreed, value_lib.ValueTypeAdditionalCode)
	correction := value_lib.InitValue(0, expandGreed, value_lib.ValueTypeAdditionalCode)

	if factor.Sign() > 0 {
		correction = multiplier.Invert().Inc()
	}
	steps = append(steps, createStepV2(correction, sum, req.Factor.String()[:1], 0))
	sum = sum.Add(correction)

	for index, binDec := range req.Factor.String()[1:] {
		multiplier = multiplier.RightShift(1)
		if string(binDec) == value_lib.OneString {
			steps = append(steps, createStepV2(multiplier, sum, string(binDec), index+1))
			sum = sum.Add(multiplier)
			continue
		}
		zeroValue := value_lib.InitValue(0, expandGreed, value_lib.ValueTypeAdditionalCode)
		steps = append(steps, createStepV2(zeroValue, sum, string(binDec), index+1))
	}
	zeroValue := value_lib.InitValue(0, expandGreed, value_lib.ValueTypeAdditionalCode)
	steps = append(steps, createStepV2(zeroValue, sum, "", len(req.Factor.String())))
	return
}

func createStepV2(value value_lib.Value, sum value_lib.Value, binDec string, index int) model.Step {
	step := model.Step{
		Index:      uint64(index),
		BinDec:     binDec,
		Value:      value.String(),
		PartialSum: sum.String(),
	}
	return step
}
