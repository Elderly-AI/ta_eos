package value_lib

import (
	"fmt"
	"strconv"
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
	ValueTypeReturnCode
)

type Value struct {
	value     uint64
	grid      uint8
	valueType ValueType
}

func InitValue(val uint64, grid uint8, valueType ValueType) Value {
	return Value{
		value:     val,
		grid:      grid,
		valueType: valueType,
	}
}

func InitValueFromInt64(val int64, grid uint8, valueType ValueType) Value {
	value := InitValue(abs(val), grid, ValueTypeDirectCode)
	if val < 0 {
		value.value |= 1 << (grid - 1)
	}
	return value.ConvertType(valueType)

}

func InitValueFromString(str string, grid uint8, valueType ValueType) (Value, error) {
	val, err := strconv.ParseUint(str, 2, 64)
	if err != nil {
		return Value{}, err
	}
	value := InitValue(val, grid, valueType)
	return value, nil
}

func (v Value) Sign() uint64 {
	return v.value & (1 << (v.grid - 1))
}

func (v Value) Value() uint64 {
	return v.value & ((1 << (v.grid - 1)) - 1)
}

func (v Value) String() string {
	str := fmt.Sprintf("%b", v.value)
	if int(v.grid) <= len(str) {
		return str
	}
	return strings.Repeat(ZeroString, int(v.grid)-len(str)) + str
}

func (v Value) LeftShift(count uint64) Value {
	shift := v
	shift.value = shift.Value() << count
	shift.value = shift.Value() | v.Sign()
	if v.valueType == ValueTypeReturnCode && v.Sign() != 0 {
		shift.value |= 1
	}
	return shift
}

func (v Value) RightShift(count uint64) Value {
	shift := v
	shift.value = shift.Value() >> count
	shift.value = shift.Value() | v.Sign()
	if v.valueType == ValueTypeAdditionalCode && v.Sign() != 0 {
		shift.value |= 1 << (v.grid - 2)
	}
	return shift
}

func (v Value) Invert() Value {
	invert := v
	invert.value = ^v.Value()
	invert.value = invert.Value() | v.Sign()
	return invert
}

func (v Value) Add(val Value) Value {
	value := v
	value.value = v.Value() + val.Value()
	value.value = value.Value() | v.Sign() | val.Sign()
	return value
}

func (v Value) ChangeGreed(grid uint8) Value {
	value := v
	if grid > v.grid {
		value.value = value.Value() | (v.Sign() << (grid - v.grid))
		value.grid = grid
	} else {
		value.grid = grid
		value.value = value.Value() | (v.Sign() >> (v.grid - grid))
	}
	return value
}

func (v Value) Inc() Value {
	value := v
	value.value = v.Value() + 1
	value.value = value.Value() | v.Sign()
	return value
}

func (v Value) ConvertType(valueType ValueType) Value {
	if v.valueType == valueType {
		return v
	}
	value := v.convertToDirectCode()
	value = value.convertFromDirectCode(valueType)
	return value
}

func (v Value) convertToDirectCode() Value {
	value := v
	switch value.valueType {
	case ValueTypeAdditionalCode:
		value.valueType = ValueTypeDirectCode
		if value.Sign() != 0 {
			value = value.Invert().Inc()
		}
	case ValueTypeReturnCode:
		value.valueType = ValueTypeDirectCode
		if value.Sign() != 0 {
			value = value.Invert()
		}
	}
	return value
}

func (v Value) convertFromDirectCode(valueType ValueType) Value {
	value := v
	switch valueType {
	case ValueTypeAdditionalCode:
		value.valueType = ValueTypeAdditionalCode
		if value.Sign() == 0 {
			return value
		}
		return value.Invert().Inc()
	case ValueTypeReturnCode:
		value.valueType = ValueTypeReturnCode
		if value.Sign() == 0 {
			return value
		}
		return value.Invert()
	}
	return value
}

func abs(n int64) uint64 {
	y := n >> 63
	return uint64((n ^ y) - y)
}
