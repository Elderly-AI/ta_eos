package config

import "os"

type Config struct {
	FrontUrl      string
	BackendUrl    string
	PostgresHost  string
	RedisAddr     string
	CookieTimeout int
}

var appConfig = Config{ // by default local docker settings
	FrontUrl:      "http://127.0.0.1:80/",
	BackendUrl:    "http://0.0.0.0:80/",
	PostgresHost:  "postgres",
	RedisAddr:     "redis:6379",
	CookieTimeout: 2_678_400,
}

func GetConfig() Config {
	if os.Getenv("ENV_TYPE") == "local" { //local without docker
		appConfig.FrontUrl = "http://localhost:80/"
		appConfig.PostgresHost = "localhost"
		appConfig.RedisAddr = "localhost:6379"
	}
	return appConfig
}
