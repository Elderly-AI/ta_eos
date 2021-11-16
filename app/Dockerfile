FROM golang:1.17-alpine

WORKDIR /app

COPY . .

RUN go mod tidy
RUN go mod download
RUN go build ./cmd/main.go

EXPOSE 8090

CMD [ "/app/main" ]
