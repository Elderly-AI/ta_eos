package template

import (
	"context"
	templateRepo "github.com/Elderly-AI/ta_eos/internal/pkg/database/template"
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	templateFacade "github.com/Elderly-AI/ta_eos/internal/pkg/template"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/template"
	"math/rand"
	"strconv"
)

type Server struct {
	repo   templateRepo.Repo
	facade *templateFacade.Facade
	pb.UnimplementedTemplateServer
}

func GetFirstTemplate() map[string]interface{} {
	A := rand.Intn(40-10) + 10
	B := rand.Intn(40-10) + 10

	res := map[string]interface{}{
		"what_to_do":    "Первая контрольная работа",
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
							map[string]interface{}{
								"name":  "-B",
								"value": "-B",
							},
							map[string]interface{}{
								"name":     "A>-2",
								"value":    "A*2^-2",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+3",
								"value":    "A*2^3",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+4",
								"value":    "A*2^4",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>-2",
								"value":    "B*2^-2",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+3",
								"value":    "B*2^3",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+4",
								"value":    "B*2^4",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    "A+B",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    "-A-B",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    "-A+B",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    "-A-B",
								"overflow": false,
							},
						},
					},
					map[string]interface{}{
						"name": "Значения",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "A",
								"value": strconv.Itoa(A),
							},
							map[string]interface{}{
								"name":  "B",
								"value": strconv.Itoa(B),
							},
							map[string]interface{}{
								"name":  "-A",
								"value": strconv.Itoa(-A),
							},
							map[string]interface{}{
								"name":  "-B",
								"value": strconv.Itoa(-B),
							},
							map[string]interface{}{
								"name":     "A>-2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>-2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    nil,
								"overflow": false,
							},
						},
					},
					map[string]interface{}{
						"name": "Прямой код",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "A",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "B",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-A",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-B",
								"value": nil,
							},
							map[string]interface{}{
								"name":     "A>-2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>-2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    nil,
								"overflow": false,
							},
						},
					},
					map[string]interface{}{
						"name": "Обратный код",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "A",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "B",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-A",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-B",
								"value": nil,
							},
							map[string]interface{}{
								"name":     "A>-2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>-2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    nil,
								"overflow": false,
							},
						},
					},
					map[string]interface{}{
						"name": "Дополнительный код",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "A",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "B",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-A",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-B",
								"value": nil,
							},
							map[string]interface{}{
								"name":     "A>-2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>+4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>-2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>+4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A-B",
								"value":    nil,
								"overflow": false,
							},
						},
					},
				},
			},
		},
	}
	return res
}

func GetTemplate(templateName string) map[string]interface{} {
	if templateName == "first" {
		return GetFirstTemplate()
	}
	return make(map[string]interface{})
}

func (s Server) GetKrHandler(ctx context.Context, req *pb.TemplateRequest) (*pb.TemplateRequest, error) {
	template := GetTemplate(req.KrName)
	res, err := model.ConvertToProtoJSON(template)
	return &pb.TemplateRequest{
		KrName: req.KrName,
		Data:   res,
	}, err
}

func (s Server) ApproveKrHandler(ctx context.Context, request *pb.TemplateRequest) (*pb.TemplateRequest, error) {
	data := request.Data.AsMap()
	updated, err := s.facade.ApproveKr(data)
	if err != nil {
		return nil, err
	}
	res, err := model.ConvertToProtoJSON(updated)
	if err != nil {
		return nil, err
	}
	return &pb.TemplateRequest{
		KrName: "first",
		Data:   res,
	}, nil
}

func NewTemplateHandler(repo templateRepo.Repo, facade *templateFacade.Facade) Server {
	return Server{
		repo:   repo,
		facade: facade,
	}
}
