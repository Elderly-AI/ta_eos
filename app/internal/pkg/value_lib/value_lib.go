package value_lib

import (
	"fmt"
	"strings"
)

const (
	ZeroString = "0"
	OneString  = "1"
)

type ValueType uint8

const (
	_ ValueType = iota
	ValueTypeDirectCode
	ValueTypeAdditionalCode
)

type Value struct {
	value     uint64
	grid      uint8
	valueType ValueType
}

func InitValue(value uint64, grid uint8, valueType ValueType) Value {
	return Value{
		value:     value,
		grid:      grid,
		valueType: valueType,
	}
}

func (v Value) Sign() uint64 {
	return v.value & (1 << (v.grid))
}

func (v Value) Value() uint64 {
	return v.value & ((1 << (v.grid)) - 1)
}

func (v Value) String() string {
	str := fmt.Sprintf("%b", v.value)
	if int(v.grid+1) <= len(str) {
		return str
	}
	return strings.Repeat(ZeroString, int(v.grid+1)-len(str)) + str
}

func (v Value) LeftShift(count uint64) Value {
	val := v.Value()
	sign := v.Sign()
	return Value{
		value:     (val << count) + sign,
		grid:      v.grid,
		valueType: v.valueType,
	}
}

func (v Value) RightShift(count uint64) Value {
	val := v.Value()
	sign := v.Sign()
	baseShift := Value{
		value:     (val >> count) + sign,
		grid:      v.grid,
		valueType: v.valueType,
	}

	switch v.valueType {
	case ValueTypeAdditionalCode:
		if v.Sign() > 0 {
			baseShift.value = baseShift.value + (1 << (v.grid - 1))
			return baseShift
		}
		return baseShift
	default:
		return baseShift
	}

}

func (v Value) Invert() Value {
	return Value{
		value:     ^v.value & (1<<(v.grid+1) - 1),
		grid:      v.grid,
		valueType: v.valueType,
	}
}

func (v Value) Add(value Value) Value {
	sign := v.Sign()
	if value.Sign() != 0 {
		sign = value.Sign()
	}

	return Value{
		value:     (v.Value()+value.Value())&(1<<v.grid-1) + sign,
		grid:      v.grid,
		valueType: v.valueType,
	}
}

func (v Value) ChangeGreed(grid uint8) Value {
	sign := v.Sign()
	if grid > v.grid {
		sign = sign << (grid - v.grid)
	} else {
		sign = sign >> (v.grid - grid)
	}
	return Value{
		value:     v.Value() + sign,
		grid:      grid,
		valueType: v.valueType,
	}
}

func (v Value) Inc() Value {
	return Value{
		value:     (v.Value() + 1) + v.Sign(),
		grid:      v.grid,
		valueType: v.valueType,
	}
}
