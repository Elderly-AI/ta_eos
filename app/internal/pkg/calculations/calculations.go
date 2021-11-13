package calculations

type Calculations interface{}

type Facade struct{}

func New() *Facade {
	return &Facade{}
}
