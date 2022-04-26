package template

import (
	"context"
	"encoding/json"
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	"github.com/golang/glog"
	"github.com/jmoiron/sqlx"
	"time"
)

type Repo struct {
	conn *sqlx.DB
}

func CreateRepo(conn *sqlx.DB) *Repo {
	return &Repo{
		conn,
	}
}

func (r *Repo) SaveTemplate(ctx context.Context, template map[string]interface{}, userId string, krName string) error {
	res, marshErr := json.Marshal(template)
	if marshErr != nil {
		return marshErr
	}
	_, err := r.conn.ExecContext(ctx, "INSERT INTO templates (user_id, kr_name, template, saved_date) VALUES ($1,$2,$3,$4)",
		userId, krName, res, time.Now())
	return err
}

func (r *Repo) GetTemplate(ctx context.Context, userId string, krName string) (model.KrTemplateResult, error) {
	var res model.KrTemplateResult
	err := r.conn.GetContext(ctx, &res, "SELECT template,saved_date from templates where user_id=$1 and kr_name=$2 order by saved_date LIMIT 1", userId, krName)
	return res, err
}

func (r *Repo) SetGrades(ctx context.Context, workName string, grade int, userId int) (map[string]int, error) {
	var gradesDict map[string]int
	var err error
	var gradesRaw string
	err = r.conn.GetContext(ctx, &gradesRaw, "SELECT grades from users WHERE user_id=$1", userId)
	if err != nil {
		return nil, err
	}
	gradesDict = map[string]int{workName: grade}
	res, marshErr := json.Marshal(gradesDict)
	if marshErr != nil {
		glog.Errorf("Cant set grade for %s", workName)
		return nil, err
	}
	_, err = r.conn.ExecContext(ctx, "UPDATE users SET grades=$1 WHERE user_id=$2", res, userId)
	if err != nil {
		glog.Errorf("Cant set grade for %s", workName)
		return nil, err
	}
	return gradesDict, nil
}
