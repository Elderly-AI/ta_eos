package template

import (
	"context"
	"github.com/jmoiron/sqlx"
)

type Repo struct {
	conn *sqlx.DB
}

func CreateRepo(conn *sqlx.DB) Repo {
	return Repo{
		conn,
	}
}

func (r *Repo) SaveTemplate(ctx context.Context, template map[string]interface{}) error {
	return nil
}
