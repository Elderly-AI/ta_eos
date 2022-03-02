package template

import (
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var errCantParseKrTemplateUIType error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIType")
var errCantParseKrTemplateUIBlock error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIBlock")
var errCantParseKrTemplateUIBlockType error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIBlockType")
var errCantParseKrTemplateUIBlockValuePair error = status.Errorf(codes.InvalidArgument, "error cant parse KrTemplateUIBlockValuePair")

type KrTemplateUI struct {
	Type KrTemplateUIType
	Data []KrTemplateUIBlock
}

func (k *KrTemplateUI) Parse(KrTemplate map[string]interface{}) error {
	krTemplateUIType, ok := KrTemplate["name"]
	if !ok {
		return errCantParseKrTemplateUIType
	}
	err := k.Type.Parse(krTemplateUIType)
	if err != nil {
		return err
	}

	krTemplateUIBlocksInterface, ok := KrTemplate["data"]
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

type ValuePair struct {
	Name  string
	Value string
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
	v.Value, ok = valueInterface.(string)
	if !ok {
		return errCantParseKrTemplateUIBlockValuePair
	}
	return nil
}
