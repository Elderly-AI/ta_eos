package model

import (
	"encoding/json"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/template"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/types/known/structpb"
)

type KrTemplate struct {
	WhatToDo     string `json:"what_to_do"`
	TemplateName string `json:"template_name"`
	UI           []struct {
		Name string `json:"name"`
		Data []struct {
			Name string `json:"name"`
			Data []struct {
				Name  string `json:"name"`
				Value string `json:"value"`
			} `json:"data"`
		} `json:"data"`
	} `json:"UI"`
}

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
	return &template, nil
}

func TemplateToProtoStructure(template *KrTemplate) (*structpb.Struct, error) {
	b, err := json.Marshal(template)
	if err != nil {
		return nil, err
	}
	s := &structpb.Struct{}
	err = protojson.Unmarshal(b, s)
	return s, err
}
