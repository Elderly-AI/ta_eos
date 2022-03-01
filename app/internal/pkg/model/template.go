package model

import (
	"encoding/json"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/template"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/types/known/structpb"
)

type TableStruct struct {
	Name string `json:"name"`
	Data []struct {
		Name string `json:"name"`
		Data []struct {
			Name  string `json:"name"`
			Value string `json:"value"`
		} `json:"data"`
	} `json:"data"`
}

type KrTemplate struct {
	WhatToDo     string         `json:"what_to_do"`
	TemplateName KrTemplateName `json:"template_name"`
	UI           []interface{}  `json:"UI"`
}

type KrTemplateName string

const (
	FirstKrTemplateName = "first"
)

type KrTemplateUIBlockName string

const (
	KrTemplateUIBlockNameVariables      = "Переменные"
	KrTemplateUIBlockNameValues         = "Значения"
	KrTemplateUIBlockNameDirectCode     = "Прямой код"
	KrTemplateUIBlockNameReturnCode     = "Обратный код"
	KrTemplateUIBlockNameAdditionalCode = "Дополнительный код"
)

func TemplateFromProto(proto *pb.TemplateRequest) (*KrTemplate, error) {
	var template KrTemplate
	marshalled, err := proto.Data.MarshalJSON()
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(marshalled, &template)
	if err != nil {
		return nil, err
	}
	//if template.TemplateName == "table" {
	//	var tableStruct []TableStruct
	//	b, _ := json.Marshal(template.UI)
	//	err = json.Unmarshal(b, &tableStruct)
	//	if err != nil {
	//		return nil, err
	//	}
	//	template.UI = tableStruct
	//}
	return &template, nil
}

func ConvertToProtoJSON(template interface{}) (*structpb.Struct, error) {
	b, err := json.Marshal(template)
	if err != nil {
		return nil, err
	}
	s := &structpb.Struct{}
	err = protojson.Unmarshal(b, s)
	return s, err
}
