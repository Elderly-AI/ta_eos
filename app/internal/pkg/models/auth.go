package models

import (
	"errors"
	pb "github.com/Elderly-AI/ta_eos/pkg/proto/auth"
)

type SafeUser struct {
	Name  string `json:"name,omitempty" db:"name"`
	Email string `json:"email,omitempty" db:"email"`
	Group string `json:"group,omitempty" db:"study_group"`
	Role  string `json:"role,omitempty" db:"role"`
}

type User struct {
	UserID   string `json:"user_id,omitempty" db:"user_id"`
	Name     string `json:"name,omitempty" db:"name" validate:"required,min=2,max=20"`
	Email    string `json:"email,omitempty" db:"email" validate:"required,min=3,max=30"`
	Group    string `json:"group,omitempty" db:"study_group" validate:"required,min=2,max=7"`
	Password string `json:"password,omitempty" db:"password" validate:"required,min=2,max=40"`
	Role     string `json:"role,omitempty" db:"role"`
}

func SafeUserFromUser(usr User) SafeUser {
	return SafeUser{
		Name:  usr.Name,
		Email: usr.Email,
		Group: usr.Group,
	}
}

func UserFromGrpc(usr *pb.User) (User, error) {
	err := validatePbUser(usr)
	if err != nil {
		return User{}, err
	}
	user := User{
		UserID:   "",
		Name:     usr.Name,
		Email:    usr.Email,
		Group:    usr.Group,
		Password: usr.Password,
	}
	return user, nil
}

func validatePbUser(user *pb.User) error {
	if len(user.Name) > 256 || user.Name == "" {
		return errors.New("user name is too long or too short")
	}
	if len(user.Password) > 256 || user.Password == "" {
		return errors.New("user password is too long or too short")
	}
	if len(user.Email) > 256 || user.Email == "" {
		return errors.New("user email is too long or too short")
	}
	if len(user.Group) > 256 || user.Group == "" {
		return errors.New("user group is too long or too short")
	}
	return nil
}

func UserToGRPCSafeUser(usr User) *pb.SafeUser {
	return &pb.SafeUser{
		Name:  usr.Name,
		Email: usr.Email,
		Group: usr.Group,
		Role:  usr.Role,
	}
}

func UsersToGRPCSafeUsers(usrs []User) *pb.SafeUsers {
	res := make([]*pb.SafeUser, 0, len(usrs))
	for _, usr := range usrs {
		res = append(res, UserToGRPCSafeUser(usr))
	}
	return &pb.SafeUsers{
		Users: res,
	}
}
