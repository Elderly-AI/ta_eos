package model

import (
	"encoding/json"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/types/known/structpb"
	"time"
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
	WhatToDo     string        `json:"what_to_do"`
	TemplateName string        `json:"template_name"`
	UI           []interface{} `json:"UI"`
}

type KrTemplateResult struct {
	Template   []byte    `json:"template" db:"template"`
	Saved_date time.Time `json:"saved_date" db:"saved_date"`
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
