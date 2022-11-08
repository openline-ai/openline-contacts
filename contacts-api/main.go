package main

import (
	"fmt"
	"github.com/openline-ai/openline-contacts/api/config"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/caarlos0/env/v6"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func proxyHandler(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		remote, err := url.Parse(cfg.CustomerOSUrl)
		if err != nil {
			panic(err)
		}

		proxy := httputil.NewSingleHostReverseProxy(remote)
		proxy.Director = func(req *http.Request) {
			req.Header = c.Request.Header
			req.Host = remote.Host
			req.URL.Scheme = remote.Scheme
			req.URL.Host = remote.Host
		}

		proxy.ServeHTTP(c.Writer, c.Request)
	}
}

func main() {
	cfg := loadConfiguration()

	r := gin.Default()

	r.GET("/health", healthCheckHandler)
	r.GET("/readiness", healthCheckHandler)
	r.Any("/", proxyHandler(cfg))
	r.Any("/query", proxyHandler(cfg))

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{cfg.CorsUrl}
	r.Use(cors.New(corsConfig))

	r.Run(fmt.Sprint(":", cfg.ApiPort))
}

func healthCheckHandler(c *gin.Context) {
	c.JSON(200, gin.H{"status": "OK"})
}

func loadConfiguration() *config.Config {
	if err := godotenv.Load(); err != nil {
		log.Println("[WARNING] Error loading .env file")
	}

	cfg := config.Config{}
	if err := env.Parse(&cfg); err != nil {
		log.Printf("%+v\n", err)
	}

	return &cfg
}
