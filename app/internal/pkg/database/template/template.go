package template

import (
	"context"
	"encoding/json"
	"github.com/golang/glog"
	"github.com/jmoiron/sqlx"
	"log"
)

type Repo struct {
	conn *sqlx.DB
}

func CreateRepo(conn *sqlx.DB) *Repo {
	return &Repo{
		conn,
	}
}

func (r *Repo) SaveTemplate(ctx context.Context, template map[string]interface{}, userId int) error {
	return nil
}

func (r *Repo) GetTemplate(ctx context.Context, id uint64) (map[string]interface{}, error) {
	return nil, nil
}

func (r *Repo) SetGrades(ctx context.Context, workName string, grade int, userId int) (map[string]int, error) {
	var gradesDict map[string]int
	var err error
	var gradesRaw string
	err = r.conn.GetContext(ctx, &gradesRaw, "SELECT grades from users WHERE user_id=$1", userId)
	if err != nil {
		return nil, err
	}
	if len(gradesRaw) < 3 {
		gradesDict = map[string]int{workName: grade}
		res, marshErr := json.Marshal(gradesDict)
		if marshErr != nil {
			glog.Errorf("Cant set grade for %s", workName)
			return nil, err
		}
		_, err = r.conn.ExecContext(ctx, "UPDATE users SET grades=$1", res)
		if err != nil {
			glog.Errorf("Cant set grade for %s", workName)
			return nil, err
		}
		return gradesDict, nil
	}
	if err := json.Unmarshal([]byte(gradesRaw), &gradesDict); err != nil {
		log.Fatalf("Cant set grade with %r", err)
	}
	gradesDict[workName] = grade
	return gradesDict, nil
}
