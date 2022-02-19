package auth

import (
	"context"
	"github.com/Elderly-AI/ta_eos/internal/pkg/model"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type Repo struct {
	conn *sqlx.DB
}

func CreateRepo(conn *sqlx.DB) Repo {
	return Repo{
		conn,
	}
}

func (r *Repo) GetUserById(ctx context.Context, userID string) (model.User, error) {
	var res model.User
	err := r.conn.GetContext(ctx, &res, "SELECT * from users WHERE user_id=$1", userID)
	return res, err
}

func (r *Repo) AddUser(ctx context.Context, usr model.User) (string, error) {
	var userID string
	query := `INSERT INTO users(name, email, study_group, password) 
          VALUES($1, $2, $3, $4) RETURNING user_id`
	err := r.conn.GetContext(ctx, &userID, query, usr.Name, usr.Email, usr.Group, usr.Password)
	return userID, err
}

func (r *Repo) GetUserByEmailAndPassword(ctx context.Context, email string, password string) (res model.User, err error) {
	err = r.conn.GetContext(ctx, &res, "SELECT * from users WHERE email=$1 and password=$2", email, password)
	return
}

func (r *Repo) SearchUsersByGroup(ctx context.Context, group string) ([]model.User, error) {
	var res []model.User
	err := r.conn.SelectContext(ctx, &res, "SELECT * from users WHERE lower(study_group) LIKE lower($1)", "%"+group+"%")
	return res, err
}

func (r *Repo) SearchUsersByFIO(ctx context.Context, fio string) ([]model.User, error) {

	var res []model.User
	err := r.conn.SelectContext(ctx, &res, "SELECT * from users WHERE lower(name) LIKE lower($1)", "%"+fio+"%")
	return res, err
}

func (r *Repo) SearchUsersByFIOOrGroup(ctx context.Context, searchText string) ([]model.User, error) {
	var res []model.User
	likeText := "%" + searchText + "%"
	err := r.conn.SelectContext(ctx, &res, "SELECT * from users WHERE lower(name) LIKE lower($1) OR lower(study_group) LIKE lower($1)", likeText)
	return res, err
}
