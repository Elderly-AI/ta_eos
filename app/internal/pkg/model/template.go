package model

import (
	"encoding/json"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/template"
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

func TemplateToProto(template *KrTemplate, krName string) *pb.TemplateRequest {
	return nil // TODO implement
}
