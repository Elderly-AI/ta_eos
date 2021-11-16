package calculations

type Number struct {
	Value    uint64
	BinValue string
}

type CalculationRequest struct {
	Multiplier *Number
	Factor     *Number
}

type Step struct {
	Index  uint64
	BinDec string
	Value  string
}
