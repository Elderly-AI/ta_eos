generate:
	buf generate -o ./pkg/

run:
	go mod tidy
	go run ./cmd/main.go

build:
	go mod tidy
	go build ./cmd/main.go

docker:
	docker-compose up --build

migrations:
	goose -dir ./migrations postgres "user=postgres dbname=postgres sslmode=disable" up
