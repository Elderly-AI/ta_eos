package template

import (
	"context"
	"fmt"
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

func ConvertInt(number int, base int, toBase int) (string, error) {
	val := strconv.Itoa(number)
	i, err := strconv.ParseInt(val, base, 64)
	if err != nil {
		return "", err
	}
	return strconv.FormatInt(i, toBase), nil
}

func GetFirstTemplate() map[string]interface{} {
	A := rand.Intn(40-10) + 10
	B := rand.Intn(40-10) + 10
	bitA, _ := ConvertInt(A, 10, 2)
	bitB, _ := ConvertInt(B, 10, 2)

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
						},
					},
					map[string]interface{}{
						"name": "Значения",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "valueA",
								"value": bitA,
							},
							map[string]interface{}{
								"name":  "valueB",
								"value": bitB,
							},
							map[string]interface{}{
								"name":  "-valueA",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-valueB",
								"value": nil,
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
							map[string]interface{}{
								"name":  "-prA",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-prB",
								"value": nil,
							},
						},
					},
					map[string]interface{}{
						"name": "Обратный код",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "obrA",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "obrB",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-obrA",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-obrB",
								"value": nil,
							},
						},
					},
					map[string]interface{}{
						"name": "Дополнительный код",
						"data": []interface{}{
							map[string]interface{}{
								"name":  "dopA",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "dopB",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-dopA",
								"value": nil,
							},
							map[string]interface{}{
								"name":  "-dopB",
								"value": nil,
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

func NewTemplateHandler(repo templateRepo.Repo, facade *templateFacade.Facade) Server {
	return Server{
		repo:   repo,
		facade: facade,
	}
}
