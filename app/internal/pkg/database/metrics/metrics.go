package metrics

import (
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	"github.com/jmoiron/sqlx"
	"strconv"
	"time"
)

type Repo struct {
	conn *sqlx.DB
}

func NewMetricsRepo(conn *sqlx.DB) Repo {
	return Repo{conn}
}

func (r *Repo) AddMetric(m model.Metric) error {
	query := "INSERT INTO metrics (method_name,date,user_id) VALUES ($1,$2,$3)"
	_, err := r.conn.Exec(query, m.MethodName, m.Date, m.UserId)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repo) SearchMetricWithoutTimestamp(searchText string) ([]model.Metric, error) {
	var res []model.Metric
	conv, err := strconv.Atoi(searchText)
	if err == nil {
		query := "SELECT * from metrics where user_id = $1"
		err = r.conn.Select(&res, query, conv)
	} else {
		query := "SELECT * from metrics where method_name LIKE $1"
		err = r.conn.Select(&res, query, "%"+searchText+"%")
	}

	if err != nil {
		return nil, err
	}
	return res, nil
}

func (r *Repo) SearchMetricWithTimestamp(searchText string, from time.Time, to time.Time) ([]model.Metric, error) {
	var res []model.Metric
	conv, err := strconv.Atoi(searchText)
	if err == nil {
		query := "SELECT * from metrics where user_id = $1 and date>$2 and date < $3"
		err = r.conn.Select(&res, query, conv, from, to)
	} else {
		query := "SELECT * from metrics where method_name LIKE $1 and date>$2 and date < $3"
		err = r.conn.Select(&res, query, "%"+searchText+"%", from, to)
	}
	if err != nil {
		return nil, err
	}
	return res, nil
}
