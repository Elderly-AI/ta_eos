package template

import (
	"context"
	"github.com/jmoiron/sqlx"
)

type Repo struct {
	conn *sqlx.DB
}

func CreateRepo(conn *sqlx.DB) *Repo {
	return &Repo{
		conn,
	}
}

func (r *Repo) SaveTemplate(ctx context.Context, template map[string]interface{}) error {
	return nil
}

func (r *Repo) GetTemplate(ctx context.Context, id uint64) (map[string]interface{}, error) {
	return nil, nil
}
