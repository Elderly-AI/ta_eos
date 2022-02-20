package template

import (
	"context"
	"fmt"
	templateRepo "github.com/Elderly-AI/ta_eos/internal/pkg/database/template"
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/template"
)

type Server struct {
	repo templateRepo.Repo
	pb.UnimplementedTemplateServer
}

func GetTemplate() model.KrTemplate {
	return model.KrTemplate{
		WhatToDo:     "",
		TemplateName: "",
		UI:           nil,
	}
}

func (s Server) GetKrHandler(context.Context, *pb.TemplateRequest) (*pb.TemplateRequest, error) {
	template := GetTemplate()
	res, err := model.TemplateToProtoStructure(&template)
	return &pb.TemplateRequest{
		KrName: "asd",
		Data:   res,
	}, err
}

func (s Server) ApproveKrHandler(ctx context.Context, request *pb.TemplateRequest) (*pb.OkMessage, error) {
	template, err := model.TemplateFromProto(request)
	if err != nil {
		return nil, err
	}
	fmt.Println(template)
	return &pb.OkMessage{
		Ok:    true,
		Error: "",
	}, nil
}

func NewTemplateHandler(repo templateRepo.Repo) Server {
	return Server{
		repo: repo,
	}
}
