package template

import (
	"github.com/Elderly-AI/ta_eos/internal/pkg/value_lib"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"strconv"
)

var errCantParseKrTemplate error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplate")
var errCantParseKrTemplateType error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateType")
var errCantParseKrTemplateUIType error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIType")
var errCantParseKrTemplateUIBlock error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIBlock")
var errCantParseKrTemplateUIBlockType error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIBlockType")
var errCantParseKrTemplateUIBlockValuePair error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIBlockValuePair")
var errCantParseNullableString error = status.Errorf(codes.InvalidArgument, "error cant parse NullableString")

func (f *Facade) ApproveKr(kr map[string]interface{}) (map[string]interface{}, error) {
	var krTemplate KrTemplate
	err := krTemplate.Parse(kr)
	if err != nil {
		return nil, err
	}

	switch krTemplate.Type {
	case KrTemplateUITypeFirst:
		err = f.KrTemplateUITypeFirstHandler(&krTemplate)
		if err != nil {
			return nil, err
		}
	}

	return krTemplate.Construct(), nil
}

func (f *Facade) KrTemplateUITypeFirstHandler(krTemplate *KrTemplate) (err error) {
	for i, ui := range krTemplate.UI {
		switch ui.Type {
		case KrTemplateUITypeTable:
			err = f.KrTemplateUITypeTableHandler(&krTemplate.UI[i])
			if err != nil {
				return
			}
		}
	}
	return
}

func (f *Facade) KrTemplateUITypeTableHandler(ui *KrTemplateUI) (err error) {
	valuesMap := make(map[string]int64)
	for i, block := range ui.Data {
		switch block.Type {
		case KrTemplateUIBlockValues:
			valuesMap, err = f.KrTemplateUIBlockValuesHandler(&ui.Data[i])
			if err != nil {
				return
			}
		case KrTemplateUIBlockDirectCode:
			err = f.KrTemplateUIBlockDirectCodeHandler(&ui.Data[i], valuesMap)
			if err != nil {
				return
			}
		case KrTemplateUIBlockReturnCode:
			err = f.KrTemplateUIBlockReturnCodeHandler(&ui.Data[i], valuesMap)
			if err != nil {
				return
			}
		case KrTemplateUIBlockAdditionalCode:
			err = f.KrTemplateUIBlockAdditionalCodeHandler(&ui.Data[i], valuesMap)
			if err != nil {
				return
			}
		}
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

func (f *Facade) KrTemplateUIBlockDirectCodeHandler(block *KrTemplateUIBlock, valuesMap map[string]int64) (err error) {
	for i, pair := range block.Data {
		value, ok := valuesMap[pair.Name]
		if !ok {
			return errCantParseKrTemplateUIBlock
		}
		v := value_lib.InitValueFromInt64(value, 8, value_lib.ValueTypeDirectCode)
		(&block.Data[i].Value).Value = v.String()
		(&block.Data[i].Value).Valid = true
	}
	return
}

func (f *Facade) KrTemplateUIBlockAdditionalCodeHandler(block *KrTemplateUIBlock, valuesMap map[string]int64) (err error) {
	for i, pair := range block.Data {
		value, ok := valuesMap[pair.Name]
		if !ok {
			return errCantParseKrTemplateUIBlock
		}
		v := value_lib.InitValueFromInt64(value, 8, value_lib.ValueTypeAdditionalCode)
		(&block.Data[i].Value).Value = v.String()
		(&block.Data[i].Value).Valid = true
	}
	return
}

func (f *Facade) KrTemplateUIBlockReturnCodeHandler(block *KrTemplateUIBlock, valuesMap map[string]int64) (err error) {
	for i, pair := range block.Data {
		value, ok := valuesMap[pair.Name]
		if !ok {
			return errCantParseKrTemplateUIBlock
		}
		v := value_lib.InitValueFromInt64(value, 8, value_lib.ValueTypeReturnCode)
		(&block.Data[i].Value).Value = v.String()
		(&block.Data[i].Value).Valid = true
	}
	return
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
	Name  string
	Value NullableString
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
	return nil
}

func (v *ValuePair) Construct() interface{} {
	return map[string]interface{}{
		"name":  v.Name,
		"value": v.Value.Construct(),
	}
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
