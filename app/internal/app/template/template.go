package template

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	templateRepo "github.com/Elderly-AI/ta_eos/internal/pkg/database/template"
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	"github.com/Elderly-AI/ta_eos/internal/pkg/session"
	templateFacade "github.com/Elderly-AI/ta_eos/internal/pkg/template"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/template"
	"math"
	"math/rand"
	"strconv"
	"time"
)

type Server struct {
	repo   templateRepo.Repo
	facade *templateFacade.Facade
	pb.UnimplementedTemplateServer
}

func GetFirstTemplate() map[string]interface{} {
	A := rand.Intn(20) + 20
	B := -rand.Intn(20) - 20

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
								"name":     "A<<2",
								"value":    "A<<2",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>3",
								"value":    "A>>3",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>4",
								"value":    "A>>4",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B<<2",
								"value":    "B<<2",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>3",
								"value":    "B>>3",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>4",
								"value":    "B>>4",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    "A+B",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+-B",
								"value":    "-A-B",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    "-A+B",
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+-B",
								"value":    "A-B",
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
								"name":     "A<<2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B<<2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+-B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+-B",
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
								"name":     "A<<2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B<<2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+-B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+-B",
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
								"name":     "A<<2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B<<2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+-B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+-B",
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
								"name":     "A<<2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A>>4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B<<2",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>3",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "B>>4",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+-B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "-A+B",
								"value":    nil,
								"overflow": false,
							},
							map[string]interface{}{
								"name":     "A+-B",
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

func (s Server) GetKrHandler(ctx context.Context, req *pb.GetKrHandlerRequest) (*pb.GetKrHandlerResponse, error) {
	krStartTime := time.Now()
	userID := session.GetUserIdFromContext(ctx)
	if userID == nil {
		return nil, errors.New("not Authed")
	}
	startNew := false
	test, err := s.repo.GetTemplate(ctx, *userID, req.KrName)
	if err != nil {
		startNew = true
		if err != sql.ErrNoRows {
			return nil, err
		}
	}
	var templateMap map[string]interface{}
	if startNew == false {
		err = json.Unmarshal(test.Template, &templateMap)
		if err != nil {
			return nil, err
		}
	}
	template := GetTemplate(req.KrName)
	if len(templateMap) > 0 {
		template = templateMap
		krStartTime = test.Saved_date
	} else {
		err = s.repo.SaveTemplate(ctx, template, *userID, req.KrName)
		if err != nil {
			return nil, err
		}
	}

	res, err := model.ConvertToProtoJSON(template)
	return &pb.GetKrHandlerResponse{
		KrName:      req.KrName,
		Data:        res,
		KrStartTime: krStartTime.Format("2006-01-02T15:04:05"),
	}, err
}

func (s Server) ApproveKrHandler(ctx context.Context, request *pb.ApproveKrHandlerRequest) (*pb.ApproveKrHandlerResponse, error) {
	userIDStr := session.GetUserIdFromContext(ctx)
	if userIDStr == nil {
		return nil, errors.New("not Authed")
	}
	userID, err := strconv.Atoi(*userIDStr)
	if err != nil {
		return nil, err
	}
	data := request.Data.AsMap()
	updated, points, err := s.facade.ApproveKr(data)
	if err != nil {
		return nil, err
	}
	res, err := model.ConvertToProtoJSON(updated)
	if err != nil {
		return nil, err
	}
	grade := float32(math.RoundToEven(float64(points.Correct) / float64(points.Correct+points.Incorrect) * 5.0))
	_, err = s.repo.SetGrades(ctx, "first", int(grade), userID)
	if err != nil {
		return nil, err
	}
	return &pb.ApproveKrHandlerResponse{
		KrName: "first",
		Data:   res,
		Points: grade,
	}, nil
}

func NewTemplateHandler(repo templateRepo.Repo, facade *templateFacade.Facade) Server {
	return Server{
		repo:   repo,
		facade: facade,
	}
}
