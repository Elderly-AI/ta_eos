package model

type Number struct {
	Value    uint64
	BinValue string
}

type CalculationRequest struct {
	Multiplier *Number
	Factor     *Number
	GridSize   uint32
}

type Step struct {
	Index      uint64
	BinDec     string
	Value      string
	PartialSum string
}
