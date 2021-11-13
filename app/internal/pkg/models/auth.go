package models

import pb "github.com/Elderly-AI/ta_eos/pkg/proto/auth"

type SafeUser struct {
	Name  string `json:"name,omitempty" db:"name"`
	Email string `json:"email,omitempty" db:"email"`
	Group string `json:"group,omitempty" db:"study_group"`
}

type User struct {
	UserID   string `json:"user_id,omitempty" db:"user_id"`
	Name     string `json:"name,omitempty" db:"name"`
	Email    string `json:"email,omitempty" db:"email"`
	Group    string `json:"group,omitempty" db:"study_group"`
	Password string `json:"password,omitempty" db:"password"`
}

func SafeUserFromUser(usr User) SafeUser {
	return SafeUser{
		Name:  usr.Name,
		Email: usr.Email,
		Group: usr.Group,
	}
}

func UserFromGrpc(usr *pb.User) User {
	return User{
		UserID:   "",
		Name:     usr.Name,
		Email:    usr.Email,
		Group:    usr.Group,
		Password: usr.Password,
	}
}

func UserToGRPCSafeUser(usr User) *pb.SafeUser {
	return &pb.SafeUser{
		Name:  usr.Name,
		Email: usr.Email,
		Group: usr.Group,
	}
}
