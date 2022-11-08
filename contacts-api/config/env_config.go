package config

type Config struct {
	ApiPort       string `env:"PORT"`
	CorsUrl       string `env:"CORS_URL"`
	CustomerOSUrl string `env:"CUSTOMER_OS_URL"`
}
