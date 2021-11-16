package errors

import "fmt"

type ApiError struct {
	Err string
}

func (m *ApiError) Error() string {
	return fmt.Sprintf("Err: %s", m.Err)
}
