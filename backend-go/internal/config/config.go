package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port     int
	LogLevel string
	MongoURI string
}

func Load() *Config {
	port, _ := strconv.Atoi(getEnv("GO_API_PORT", "8081"))
	
	return &Config{
		Port:     port,
		LogLevel: getEnv("LOG_LEVEL", "info"),
		MongoURI: getEnv("MONGO_URI", "mongodb://localhost:27017/loyalty"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
