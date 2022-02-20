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

func GetTemplate() map[string]interface{} {
	res := map[string]interface{}{
		"what_to_do":    "Решите плиз кр",
		"template_name": "first",
		"UI": []interface{}{
			map[string]interface{}{
				"name": "table",
				"data": []interface{}{
					map[string]interface{}{
						"name": "Переменные",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "A",
								"value": "A",
							},
							map[string]interface{}{
								"name":  "B",
								"value": "B",
							},
							map[string]interface{}{
								"name":  "-A",
								"value": "-A",
							},
						},
					},
					map[string]interface{}{
						"name": "Значения",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "valueA",
								"value": "01101010",
							},
							map[string]interface{}{
								"name":  "valueB",
								"value": "01101111",
							},
						},
					},
					map[string]interface{}{
						"name": "Прямой код",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "prA",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "prB",
								"value": nil,
							},
						},
					},
				},
			},
			map[string]interface{}{
				"name": "input_field",
				"data": map[string]interface{}{
					"name":        "mom_name",
					"placeholder": "Введите имя мамы",
				},
			},
		},
	}
	return res
}

func (s Server) GetKrHandler(context.Context, *pb.TemplateRequest) (*pb.TemplateRequest, error) {
	template := GetTemplate()
	res, err := model.ConvertToProtoJSON(template)
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
