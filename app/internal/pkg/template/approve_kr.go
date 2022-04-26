package template

import (
	"regexp"
	"strconv"
	"strings"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/Elderly-AI/ta_eos/internal/pkg/value_lib"
)

const defaultGridSize = 8

var errCantParseKrTemplate error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplate")
var errCantParseKrTemplateType error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateType")
var errCantParseKrTemplateUIType error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIType")
var errCantParseKrTemplateUIBlock error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIBlock")
var errCantParseKrTemplateUIBlockType error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIBlockType")
var errCantParseKrTemplateUIBlockValuePair error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIBlockValuePair")
var errCantParseNullableString error = status.Errorf(codes.InvalidArgument, "error cant parse NullableString")
var errCantParseNullableAdditionalSteps error = status.Errorf(codes.InvalidArgument, "error cant parse NullableAdditionalSteps")

type Points struct {
	Correct   uint64
	Incorrect uint64
}

func (f *Facade) ApproveKr(kr map[string]interface{}) (map[string]interface{}, Points, error) {
	var krTemplate KrTemplate
	var points Points

	err := krTemplate.Parse(kr)
	if err != nil {
		return nil, points, err
	}

	switch krTemplate.Type {
	case KrTemplateUITypeFirst:
		points, err = f.KrTemplateUITypeFirstHandler(&krTemplate)
		if err != nil {
			return nil, points, nil
		}
	}

	return krTemplate.Construct(), points, nil
}

func (f *Facade) KrTemplateUITypeFirstHandler(krTemplate *KrTemplate) (points Points, err error) {
	for i, ui := range krTemplate.UI {
		var p Points
		switch ui.Type {
		case KrTemplateUITypeTable:
			p, err = f.KrTemplateUITypeTableHandler(&krTemplate.UI[i])
			if err != nil {
				return
			}
		}
		points.Correct += p.Correct
		points.Incorrect += p.Incorrect
	}
	return
}

func (f *Facade) KrTemplateUITypeTableHandler(ui *KrTemplateUI) (points Points, err error) {
	valuesMap := make(map[string]int64)
	for i, block := range ui.Data {
		var p Points
		switch block.Type {
		case KrTemplateUIBlockValues:
			valuesMap, err = f.KrTemplateUIBlockValuesHandler(&ui.Data[i])
			if err != nil {
				return
			}
		case KrTemplateUIBlockDirectCode:
			p, err = f.KrTemplateUIBlockValuePair(&ui.Data[i], value_lib.ValueTypeDirectCode, valuesMap)
			if err != nil {
				return
			}
		case KrTemplateUIBlockReturnCode:
			p, err = f.KrTemplateUIBlockValuePair(&ui.Data[i], value_lib.ValueTypeReturnCode, valuesMap)
			if err != nil {
				return
			}
		case KrTemplateUIBlockAdditionalCode:
			p, err = f.KrTemplateUIBlockValuePair(&ui.Data[i], value_lib.ValueTypeAdditionalCode, valuesMap)
			if err != nil {
				return
			}
		}

		points.Correct += p.Correct
		points.Incorrect += p.Incorrect
	}
	return
}

func (f *Facade) KrTemplateUIBlockValuesHandler(block *KrTemplateUIBlock) (map[string]int64, error) {
	valuesMap := make(map[string]int64)
	for _, pair := range block.Data {
		if pair.Value.Valid {
			value, err := strconv.Atoi(pair.Value.Value)
			if err != nil {
				return nil, err
			}
			valuesMap[pair.Name] = int64(value)
		}
	}
	return valuesMap, nil
}

func (f *Facade) KrTemplateUIBlockValuePair(block *KrTemplateUIBlock, valueType value_lib.ValueType, valuesMap map[string]int64) (points Points, err error) {
	for i, pair := range block.Data {
		var value *value_lib.Value
		var additionalSteps NullableAdditionalSteps

		sum, _ := regexp.MatchString(`\+`, pair.Name)
		leftShift, _ := regexp.MatchString(`<<`, pair.Name)
		rightShift, _ := regexp.MatchString(`>>`, pair.Name)

		if sum {
			value, additionalSteps, err = f.KrTemplateUIBlockValuePairNameSum(pair.Name, valueType, valuesMap)
			if err != nil {
				return
			}
		} else if leftShift {
			value, err = f.KrTemplateUIBlockValuePairNameLeftShift(pair.Name, valueType, valuesMap)
			if err != nil {
				return
			}
		} else if rightShift {
			value, err = f.KrTemplateUIBlockValuePairNameRightShift(pair.Name, valueType, valuesMap)
			if err != nil {
				return
			}
		} else {
			value, err = f.KrTemplateUIBlockValuePairNameValue(pair.Name, valueType, valuesMap)
			if err != nil {
				return
			}
		}
		correct := false

		if block.Data[i].Overflow == value.Overflow() && (&block.Data[i].Value).Value == value.String() {
			correct = true
		} else {
			correct = false
		}
		if correct && additionalSteps.Valid && (!block.Data[i].AdditionalSteps.Valid ||
			additionalSteps.ValueA != block.Data[i].AdditionalSteps.ValueA ||
			additionalSteps.ValueB != block.Data[i].AdditionalSteps.ValueB ||
			additionalSteps.Transfer != block.Data[i].AdditionalSteps.Transfer ||
			additionalSteps.Direct != block.Data[i].AdditionalSteps.Direct ||
			additionalSteps.Decimal != block.Data[i].AdditionalSteps.Decimal) {
			correct = false
		}

		if correct {
			points.Correct += 1
		} else {
			points.Incorrect += 1
			block.Data[i].Overflow = value.Overflow()
			(&block.Data[i].Value).Value = value.String()
			(&block.Data[i].Value).Valid = true
			block.Data[i].AdditionalSteps = additionalSteps
		}
	}
	return
}

func (f *Facade) KrTemplateUIBlockValuePairNameSum(name string, valueType value_lib.ValueType, valuesMap map[string]int64) (*value_lib.Value, NullableAdditionalSteps, error) {
	additionalSteps := NullableAdditionalSteps{Valid: false}
	values := strings.Split(name, "+")
	if len(values) != 2 {
		return nil, additionalSteps, errCantParseKrTemplateUIBlockValuePair
	}
	fv, ok := valuesMap[values[0]]
	if !ok {
		return nil, additionalSteps, errCantParseKrTemplateUIBlockValuePair
	}
	sv, ok := valuesMap[values[1]]
	if !ok {
		return nil, additionalSteps, errCantParseKrTemplateUIBlockValuePair
	}
	fvv := value_lib.InitValueFromInt64(fv, defaultGridSize, valueType)
	svv := value_lib.InitValueFromInt64(sv, defaultGridSize, valueType)
	value := fvv.Add(svv)

	if value.Overflow() {
		additionalSteps.ValueA = fvv.String()
		additionalSteps.ValueB = svv.String()
		directValue := value
		directValue.ConvertType(value_lib.ValueTypeDirectCode)
		additionalSteps.Direct = directValue.String()
		additionalSteps.Decimal = directValue.ToInt()
		additionalSteps.Transfer = value_lib.InitValueFromInt64(1, defaultGridSize, value_lib.ValueTypeDirectCode).String()
		additionalSteps.Valid = true
	}
	return &value, additionalSteps, nil
}

func (f *Facade) KrTemplateUIBlockValuePairNameLeftShift(name string, valueType value_lib.ValueType, valuesMap map[string]int64) (*value_lib.Value, error) {
	values := strings.Split(name, "<<")
	if len(values) != 2 {
		return nil, errCantParseKrTemplateUIBlockValuePair
	}
	fv, ok := valuesMap[values[0]]
	if !ok {
		return nil, errCantParseKrTemplateUIBlockValuePair
	}
	count, err := strconv.ParseUint(values[1], 10, 64)
	if err != nil {
		return nil, errCantParseKrTemplateUIBlockValuePair
	}
	fvv := value_lib.InitValueFromInt64(fv, defaultGridSize, valueType)
	value := fvv.LeftShift(count)
	return &value, nil
}

func (f *Facade) KrTemplateUIBlockValuePairNameRightShift(name string, valueType value_lib.ValueType, valuesMap map[string]int64) (*value_lib.Value, error) {
	values := strings.Split(name, ">>")
	if len(values) != 2 {
		return nil, errCantParseKrTemplateUIBlockValuePair
	}
	fv, ok := valuesMap[values[0]]
	if !ok {
		return nil, errCantParseKrTemplateUIBlockValuePair
	}
	count, err := strconv.ParseUint(values[1], 10, 64)
	if err != nil {
		return nil, errCantParseKrTemplateUIBlockValuePair
	}
	fvv := value_lib.InitValueFromInt64(fv, defaultGridSize, valueType)
	value := fvv.RightShift(count)
	return &value, nil
}

func (f *Facade) KrTemplateUIBlockValuePairNameValue(name string, valueType value_lib.ValueType, valuesMap map[string]int64) (*value_lib.Value, error) {
	fv, ok := valuesMap[name]
	if !ok {
		return nil, errCantParseKrTemplateUIBlockValuePair
	}
	value := value_lib.InitValueFromInt64(fv, defaultGridSize, valueType)
	return &value, nil
}

type KrTemplate struct {
	Task string
	Type KrTemplateType
	UI   []KrTemplateUI
}

func (k *KrTemplate) Parse(krTemplateInterface interface{}) error {
	krTemplate, ok := krTemplateInterface.(map[string]interface{})
	if !ok {
		return errCantParseKrTemplate
	}
	taskInterface, ok := krTemplate["what_to_do"]
	if !ok {
		return errCantParseKrTemplate
	}
	k.Task, ok = taskInterface.(string)
	if !ok {
		return errCantParseKrTemplate
	}

	typeInterface, ok := krTemplate["template_name"]
	if !ok {
		return errCantParseKrTemplate
	}
	err := k.Type.Parse(typeInterface)
	if err != nil {
		return err
	}

	krTemplateUIInterface, ok := krTemplate["UI"]
	if !ok {
		return errCantParseKrTemplate
	}
	krTemplateUISlice, ok := krTemplateUIInterface.([]interface{})
	if !ok {
		return errCantParseKrTemplate
	}
	k.UI = make([]KrTemplateUI, len(krTemplateUISlice))
	for i, krTemplateUI := range krTemplateUISlice {
		err = k.UI[i].Parse(krTemplateUI)
		if err != nil {
			return err
		}
	}
	return nil
}

func (k *KrTemplate) Construct() map[string]interface{} {
	uiSlice := make([]interface{}, len(k.UI))
	for i, ui := range k.UI {
		uiSlice[i] = ui.Construct()
	}
	return map[string]interface{}{
		"what_to_do":    k.Task,
		"template_name": k.Type.Construct(),
		"UI":            uiSlice,
	}
}

type KrTemplateType uint64

const (
	KrTemplateUITypeFirst KrTemplateType = iota
)

func (k *KrTemplateType) Parse(KrTemplateTypeInterface interface{}) error {
	krTemplateType, ok := KrTemplateTypeInterface.(string)
	if !ok {
		return errCantParseKrTemplateType
	}
	switch krTemplateType {
	case "first":
		*k = KrTemplateUITypeFirst
	default:
		return errCantParseKrTemplateType
	}
	return nil
}

func (k *KrTemplateType) Construct() interface{} {
	switch *k {
	case KrTemplateUITypeFirst:
		return "first"
	}
	return nil
}

type KrTemplateUI struct {
	Type KrTemplateUIType
	Data []KrTemplateUIBlock
}

func (k *KrTemplateUI) Parse(krTemplateUIInterface interface{}) error {
	krTemplateUI, ok := krTemplateUIInterface.(map[string]interface{})
	if !ok {
		return errCantParseKrTemplateUIType
	}

	krTemplateUIType, ok := krTemplateUI["name"]
	if !ok {
		return errCantParseKrTemplateUIType
	}
	err := k.Type.Parse(krTemplateUIType)
	if err != nil {
		return err
	}

	krTemplateUIBlocksInterface, ok := krTemplateUI["data"]
	if !ok {
		return errCantParseKrTemplateUIBlock
	}
	krTemplateUIBlocksSlice, ok := krTemplateUIBlocksInterface.([]interface{})
	if !ok {
		return errCantParseKrTemplateUIBlock
	}

	k.Data = make([]KrTemplateUIBlock, len(krTemplateUIBlocksSlice))
	for i, krTemplateUIBlock := range krTemplateUIBlocksSlice {
		err = k.Data[i].Parse(krTemplateUIBlock)
		if err != nil {
			return err
		}
	}
	return nil
}

func (k *KrTemplateUI) Construct() interface{} {
	KrTemplateUIBlockSlice := make([]interface{}, len(k.Data))
	for i, krTemplateUIBlock := range k.Data {
		KrTemplateUIBlockSlice[i] = krTemplateUIBlock.Construct()
	}
	return map[string]interface{}{
		"name": k.Type.Construct(),
		"data": KrTemplateUIBlockSlice,
	}
}

type KrTemplateUIType uint64

const (
	KrTemplateUITypeTable KrTemplateUIType = iota
)

func (k *KrTemplateUIType) Parse(krTemplateUITypeInterface interface{}) error {
	krTemplateUIType, ok := krTemplateUITypeInterface.(string)
	if !ok {
		return errCantParseKrTemplateUIType
	}
	switch krTemplateUIType {
	case "table":
		*k = KrTemplateUITypeTable
	default:
		return errCantParseKrTemplateUIType
	}
	return nil
}

func (k *KrTemplateUIType) Construct() interface{} {
	switch *k {
	case KrTemplateUITypeTable:
		return "table"
	}
	return nil
}

type KrTemplateUIBlock struct {
	Type KrTemplateUIBlockType
	Data []ValuePair
}

func (k *KrTemplateUIBlock) Parse(krTemplateUIBlockInterface interface{}) error {
	krTemplateUIBlock, ok := krTemplateUIBlockInterface.(map[string]interface{})
	if !ok {
		return errCantParseKrTemplateUIBlock
	}
	krTemplateUIBlockTypeInterface, ok := krTemplateUIBlock["name"]
	if !ok {
		return errCantParseKrTemplateUIBlock
	}
	err := k.Type.Parse(krTemplateUIBlockTypeInterface)
	if err != nil {
		return err
	}
	krTemplateUIBlockDataInterface, ok := krTemplateUIBlock["data"]
	if !ok {
		return errCantParseKrTemplateUIBlock
	}
	krTemplateUIBlockDataSlice, ok := krTemplateUIBlockDataInterface.([]interface{})
	if !ok {
		return errCantParseKrTemplateUIBlock
	}
	k.Data = make([]ValuePair, len(krTemplateUIBlockDataSlice))
	for i, valuePair := range krTemplateUIBlockDataSlice {
		err = k.Data[i].Parse(valuePair)
		if err != nil {
			return err
		}
	}
	return nil
}

func (k *KrTemplateUIBlock) Construct() interface{} {
	valuePairSlice := make([]interface{}, len(k.Data))
	for i, valuePair := range k.Data {
		valuePairSlice[i] = valuePair.Construct()
	}
	return map[string]interface{}{
		"data": valuePairSlice,
		"name": k.Type.Construct(),
	}
}

type KrTemplateUIBlockType uint64

const (
	KrTemplateUIBlockVariables KrTemplateUIBlockType = iota
	KrTemplateUIBlockValues
	KrTemplateUIBlockDirectCode
	KrTemplateUIBlockReturnCode
	KrTemplateUIBlockAdditionalCode
)

func (k *KrTemplateUIBlockType) Parse(blockTypeInterface interface{}) error {
	blockType, ok := blockTypeInterface.(string)
	if !ok {
		return errCantParseKrTemplateUIBlockType
	}
	switch blockType {
	case "Переменные":
		*k = KrTemplateUIBlockVariables
	case "Значения":
		*k = KrTemplateUIBlockValues
	case "Прямой код":
		*k = KrTemplateUIBlockDirectCode
	case "Обратный код":
		*k = KrTemplateUIBlockReturnCode
	case "Дополнительный код":
		*k = KrTemplateUIBlockAdditionalCode
	default:
		return errCantParseKrTemplateUIType
	}
	return nil
}

func (k *KrTemplateUIBlockType) Construct() interface{} {
	switch *k {
	case KrTemplateUIBlockVariables:
		return "Переменные"
	case KrTemplateUIBlockValues:
		return "Значения"
	case KrTemplateUIBlockDirectCode:
		return "Прямой код"
	case KrTemplateUIBlockReturnCode:
		return "Обратный код"
	case KrTemplateUIBlockAdditionalCode:
		return "Дополнительный код"
	}
	return nil
}

type ValuePair struct {
	Name            string
	Value           NullableString
	Overflow        bool
	AdditionalSteps NullableAdditionalSteps
}

func (v *ValuePair) Parse(valuePairInterface interface{}) error {
	valuePair, ok := valuePairInterface.(map[string]interface{})
	if !ok {
		return errCantParseKrTemplateUIBlockValuePair
	}
	nameInterface, ok := valuePair["name"]
	if !ok {
		return errCantParseKrTemplateUIBlockValuePair
	}
	v.Name, ok = nameInterface.(string)
	if !ok {
		return errCantParseKrTemplateUIBlockValuePair
	}
	valueInterface, ok := valuePair["value"]
	if !ok {
		return errCantParseKrTemplateUIBlockValuePair
	}
	err := v.Value.Parse(valueInterface)
	if err != nil {
		return err
	}
	overflowInterface, ok := valuePair["overflow"]
	if ok {
		v.Overflow, ok = overflowInterface.(bool)
		if !ok {
			return errCantParseKrTemplateUIBlockValuePair
		}
	}
	additionalStepsInterface, ok := valuePair["additionalSteps"]
	if !ok {
		v.AdditionalSteps.Valid = false
	} else {
		err = v.AdditionalSteps.Parse(additionalStepsInterface)
		if err != nil {
			return err
		}
	}
	return nil
}

func (v *ValuePair) Construct() interface{} {
	valuePairMap := map[string]interface{}{
		"name":     v.Name,
		"value":    v.Value.Construct(),
		"overflow": v.Overflow,
	}
	if v.AdditionalSteps.Valid {
		valuePairMap["additionalSteps"] = v.AdditionalSteps.Construct()
	}
	return valuePairMap
}

type NullableString struct {
	Value string
	Valid bool
}

func (n *NullableString) Parse(nullableStringInterface interface{}) error {
	if nullableStringInterface == nil {
		n.Valid = false
		return nil
	}
	nullableString, ok := nullableStringInterface.(string)
	if !ok {
		return errCantParseNullableString
	}
	n.Valid = true
	n.Value = nullableString
	return nil
}

func (n *NullableString) Construct() interface{} {
	if n.Valid {
		return n.Value
	}
	return nil
}

type NullableAdditionalSteps struct {
	ValueA   string
	ValueB   string
	Transfer string
	Direct   string
	Decimal  string
	Valid    bool
}

func (n *NullableAdditionalSteps) Parse(nullableAdditionalStepsInterface interface{}) error {
	if nullableAdditionalStepsInterface == nil {
		n.Valid = false
		return nil
	}
	nullableAdditionalStepsMap, ok := nullableAdditionalStepsInterface.(map[string]interface{})
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	valueAInterface, ok := nullableAdditionalStepsMap["a"]
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	n.ValueA, ok = valueAInterface.(string)
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	valueBInterface, ok := nullableAdditionalStepsMap["b"]
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	n.ValueB, ok = valueBInterface.(string)
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	transferInterface, ok := nullableAdditionalStepsMap["transfer"]
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	n.Transfer, ok = transferInterface.(string)
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	directInterface, ok := nullableAdditionalStepsMap["direct"]
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	n.Direct, ok = directInterface.(string)
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	decimalInterface, ok := nullableAdditionalStepsMap["decimal"]
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	n.Decimal, ok = decimalInterface.(string)
	if !ok {
		return errCantParseNullableAdditionalSteps
	}
	n.Valid = true
	return nil
}

func (n *NullableAdditionalSteps) Construct() interface{} {
	if !n.Valid {
		return nil
	}
	return map[string]interface{}{
		"a":        n.ValueA,
		"b":        n.ValueB,
		"transfer": n.Transfer,
		"direct":   n.Direct,
		"decimal":  n.Decimal,
	}
}
