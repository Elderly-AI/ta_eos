package value_lib

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/require"
)

const defaultGridSize uint8 = 8
const defaultPositiveValue uint64 = 0b01101001
const defaultNegativeValue uint64 = 0b10101001

func TestValueLib_InitValue(t *testing.T) {
	t.Run("should be ok on init value", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, defaultPositiveValue, value.value)
		require.Equal(t, defaultGridSize, value.grid)
		require.Equal(t, ValueTypeDirectCode, value.valueType)
	})
}

func TestValueLib_InitValueFromInt64(t *testing.T) {
	t.Run("should be ok on init positive value", func(t *testing.T) {
		value := InitValueFromInt64(10, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b00001010), value.value)
		require.Equal(t, defaultGridSize, value.grid)
		require.Equal(t, ValueTypeDirectCode, value.valueType)
	})

	t.Run("should be ok on init negative value", func(t *testing.T) {
		value := InitValueFromInt64(-10, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b10001010), value.value)
		require.Equal(t, defaultGridSize, value.grid)
		require.Equal(t, ValueTypeDirectCode, value.valueType)
	})
}

func TestValueLib_InitValueFromString(t *testing.T) {
	t.Run("should be ok on init positive value", func(t *testing.T) {
		value, err := InitValueFromString("01010100", defaultGridSize, ValueTypeDirectCode)
		require.NoError(t, err)
		require.Equal(t, uint64(0b01010100), value.value)
		require.Equal(t, defaultGridSize, value.grid)
		require.Equal(t, ValueTypeDirectCode, value.valueType)
	})

	t.Run("should be ok on init negative value", func(t *testing.T) {
		value, err := InitValueFromString("11010100", defaultGridSize, ValueTypeDirectCode)
		require.NoError(t, err)
		require.Equal(t, uint64(0b11010100), value.value)
		require.Equal(t, defaultGridSize, value.grid)
		require.Equal(t, ValueTypeDirectCode, value.valueType)
	})
}

func TestValueLib_Sign(t *testing.T) {
	t.Run("should be ok on get sign on positive value", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Zero(t, value.Sign())
	})

	t.Run("should be ok on get sign on negative value", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.NotZero(t, value.Sign())
	})
}

func TestValueLib_Value(t *testing.T) {
	t.Run("should be ok on get value on positive value", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b1101001), value.Value())
	})

	t.Run("should be ok on get value on negative value", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b101001), value.Value())
	})
}

func TestValueLib_String(t *testing.T) {
	t.Run("should be ok on string positive value", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, "01101001", value.String())
	})

	t.Run("should be ok on get value on negative value", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, "10101001", value.String())
	})
}

func TestValueLib_LeftShift(t *testing.T) {
	t.Run("should be ok on LeftShift positive value direct code", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b01010010), value.LeftShift(1).value)
	})

	t.Run("should be ok on LeftShift negative value direct code", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b11010010), value.LeftShift(1).value)
	})

	t.Run("should be ok on LeftShift positive value additional code", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeAdditionalCode)
		require.Equal(t, uint64(0b01010010), value.LeftShift(1).value)
	})

	t.Run("should be ok on LeftShift negative value additional code", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeAdditionalCode)
		require.Equal(t, uint64(0b11010010), value.LeftShift(1).value)
	})

	t.Run("should be ok on LeftShift positive value return code", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeReturnCode)
		require.Equal(t, uint64(0b01010010), value.LeftShift(1).value)
	})

	t.Run("should be ok on LeftShift negative value return code", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeReturnCode)
		require.Equal(t, uint64(0b11010011), value.LeftShift(1).value)
	})
}

func TestValueLib_RightShift(t *testing.T) {
	t.Run("should be ok on RightShift positive value direct code", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b00110100), value.RightShift(1).value)
	})

	t.Run("should be ok on RightShift negative value direct code", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b10010100), value.RightShift(1).value)
	})

	t.Run("should be ok on RightShift positive value additional code", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeAdditionalCode)
		require.Equal(t, uint64(0b00110100), value.RightShift(1).value)
	})

	t.Run("should be ok on RightShift negative value additional code", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeAdditionalCode)
		require.Equal(t, uint64(0b11010100), value.RightShift(1).value)
	})

	t.Run("should be ok on RightShift positive value return code", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeReturnCode)
		require.Equal(t, uint64(0b00110100), value.RightShift(1).value)
	})

	t.Run("should be ok on RightShift negative value return code", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeReturnCode)
		require.Equal(t, uint64(0b10010100), value.RightShift(1).value)
	})
}

func TestValueLib_Invert(t *testing.T) {
	t.Run("should be ok on invert positive value", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b00010110), value.Invert().value)
	})

	t.Run("should be ok on invert negative value", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b11010110), value.Invert().value)
	})
}

func TestValueLib_Add(t *testing.T) {
	t.Run("should be ok on add positive and positive", func(t *testing.T) {
		f := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		s := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b01010010), f.Add(s).value)
	})

	t.Run("should be ok on add negative and negative", func(t *testing.T) {
		f := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		s := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b11010010), f.Add(s).value)
	})

	t.Run("should be ok on add negative and positive", func(t *testing.T) {
		f := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		s := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b10010010), f.Add(s).value)
	})

	t.Run("should be ok on add negative and positive", func(t *testing.T) {
		f := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		s := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b10010010), f.Add(s).value)
	})
}

func TestValueLib_ChangeGreed(t *testing.T) {
	t.Run("should be ok on change greed from bigger to less on positive value", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b0001), value.ChangeGreed(defaultGridSize/2).value)

	})

	t.Run("should be ok on change greed from bigger to less on negative value", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b1001), value.ChangeGreed(defaultGridSize/2).value)

	})

	t.Run("should be ok on change greed from less to bigger on negative value", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b0000000001101001), value.ChangeGreed(defaultGridSize*2).value)

	})

	t.Run("should be ok on change greed from less to bigger on negative value", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		fmt.Println(value.ChangeGreed(defaultGridSize * 2).String())
		require.Equal(t, uint64(0b1000000000101001), value.ChangeGreed(defaultGridSize*2).value)

	})
}

func TestValueLib_Inc(t *testing.T) {
	t.Run("should be ok on inc on positive value", func(t *testing.T) {
		value := InitValue(defaultPositiveValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b01101010), value.Inc().value)

	})

	t.Run("should be ok on inc on negative value", func(t *testing.T) {
		value := InitValue(defaultNegativeValue, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b10101010), value.Inc().value)

	})

	t.Run("should be ok on inc on positive value with overflow", func(t *testing.T) {
		value := InitValue(0b01111111, defaultGridSize, ValueTypeDirectCode)
		require.Equal(t, uint64(0b00000000), value.Inc().value)
	})
}

func TestValueLib_ConvertType(t *testing.T) {
	t.Run("should be ok on convert direct code to direct", func(t *testing.T) {
		value := Value{
			grid:      defaultGridSize,
			valueType: ValueTypeDirectCode,
		}
		for v := uint64(0); v <= 255; v++ {
			value.value = v
			updated := value.ConvertType(ValueTypeDirectCode)
			require.Equal(t, value.valueType, updated.valueType)
			require.Equal(t, value.grid, updated.grid)
			require.Equal(t, value.value, updated.value)
		}
	})

	t.Run("should be ok on convert additional code to additional", func(t *testing.T) {
		value := Value{
			grid:      defaultGridSize,
			valueType: ValueTypeAdditionalCode,
		}
		for v := uint64(0); v <= 255; v++ {
			value.value = v
			updated := value.ConvertType(ValueTypeAdditionalCode)
			require.Equal(t, value.valueType, updated.valueType)
			require.Equal(t, value.grid, updated.grid)
			require.Equal(t, value.value, updated.value)
		}
	})

	t.Run("should be ok on convert returned code to returned", func(t *testing.T) {
		value := Value{
			grid:      defaultGridSize,
			valueType: ValueTypeReturnCode,
		}
		for v := uint64(0); v <= 0b11111111; v++ {
			value.value = v
			updated := value.ConvertType(ValueTypeReturnCode)
			require.Equal(t, value.valueType, updated.valueType)
			require.Equal(t, value.grid, updated.grid)
			require.Equal(t, value.value, updated.value)
		}
	})

	t.Run("should be ok on convert direct code to additional", func(t *testing.T) {
		value := Value{
			grid:      defaultGridSize,
			valueType: ValueTypeDirectCode,
		}
		directValues := []uint64{0b00000000, 0b00000001, 0b10000001, 0b10001000, 0b11111111}
		additionalValues := []uint64{0b00000000, 0b00000001, 0b11111111, 0b11111000, 0b10000001}

		for i := 0; i < len(directValues); i++ {
			value.value = directValues[i]
			updated := value.ConvertType(ValueTypeAdditionalCode)
			require.Equal(t, additionalValues[i], updated.value)
		}
	})

	t.Run("should be ok on convert direct code to returned", func(t *testing.T) {
		value := Value{
			grid:      defaultGridSize,
			valueType: ValueTypeDirectCode,
		}
		directValues := []uint64{0b00000000, 0b00000001, 0b10000001, 0b10001000, 0b11111111}
		returnedValues := []uint64{0b00000000, 0b00000001, 0b11111110, 0b11110111, 0b10000000}

		for i := 0; i < len(directValues); i++ {
			value.value = directValues[i]
			updated := value.ConvertType(ValueTypeReturnCode)
			require.Equal(t, returnedValues[i], updated.value)
		}
	})

	t.Run("should be ok on convert additional code to direct", func(t *testing.T) {
		value := Value{
			grid:      defaultGridSize,
			valueType: ValueTypeAdditionalCode,
		}
		additionalValues := []uint64{0b00000000, 0b00000001, 0b11111111, 0b11111000, 0b10000001}
		directValues := []uint64{0b00000000, 0b00000001, 0b10000001, 0b10001000, 0b11111111}

		for i := 0; i < len(directValues); i++ {
			value.value = additionalValues[i]
			updated := value.ConvertType(ValueTypeDirectCode)
			require.Equal(t, directValues[i], updated.value)
		}
	})

	t.Run("should be ok on convert additional code to returned", func(t *testing.T) {
		value := Value{
			grid:      defaultGridSize,
			valueType: ValueTypeAdditionalCode,
		}
		additionalValues := []uint64{0b00000000, 0b00000001, 0b11111111, 0b11111000, 0b10000001}
		returnedValues := []uint64{0b00000000, 0b00000001, 0b11111110, 0b11110111, 0b10000000}

		for i := 0; i < len(returnedValues); i++ {
			value.value = additionalValues[i]
			updated := value.ConvertType(ValueTypeReturnCode)
			require.Equal(t, returnedValues[i], updated.value)
		}
	})

	t.Run("should be ok on convert returned code to direct", func(t *testing.T) {
		value := Value{
			grid:      defaultGridSize,
			valueType: ValueTypeReturnCode,
		}
		returnedValues := []uint64{0b00000000, 0b00000001, 0b11111110, 0b11110111, 0b10000000}
		directValues := []uint64{0b00000000, 0b00000001, 0b10000001, 0b10001000, 0b11111111}

		for i := 0; i < len(returnedValues); i++ {
			value.value = returnedValues[i]
			updated := value.ConvertType(ValueTypeDirectCode)
			require.Equal(t, directValues[i], updated.value)
		}
	})

	t.Run("should be ok on convert returned code to additional", func(t *testing.T) {
		value := Value{
			grid:      defaultGridSize,
			valueType: ValueTypeReturnCode,
		}
		returnedValues := []uint64{0b00000000, 0b00000001, 0b11111110, 0b11110111, 0b10000000}
		additionalValues := []uint64{0b00000000, 0b00000001, 0b11111111, 0b11111000, 0b10000001}

		for i := 0; i < len(returnedValues); i++ {
			value.value = returnedValues[i]
			updated := value.ConvertType(ValueTypeAdditionalCode)
			require.Equal(t, additionalValues[i], updated.value)
		}
	})
}
