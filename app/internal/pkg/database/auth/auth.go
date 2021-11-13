package auth

import (
	"context"
	"fmt"
	"github.com/Elderly-AI/ta_eos/internal/pkg/models"
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

func (r *Repo) GetUserById(ctx context.Context, userID string) (models.User, error) {
	res := models.User{}
	err := r.conn.GetContext(ctx, &res, "SELECT * from users WHERE user_id=$1", userID)
	return res, err
}

func (r *Repo) AddUser(ctx context.Context, usr models.User) (models.User, error) {
	res := models.User{}
	query := `INSERT INTO users(name, email, group, password) 
          VALUES(:name, :email, :group, :password) RETURNING *`
	res2, err := r.conn.NamedExecContext(ctx, query, usr)
	fmt.Println(res2)
	return res, err
}
