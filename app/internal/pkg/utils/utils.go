package utils

import "github.com/go-playground/validator/v10"

var v = validator.New()

func ValidateStruct(st interface{}) error {
	return v.Struct(st)
}
