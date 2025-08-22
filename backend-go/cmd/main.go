package main

import (
	"github.com/loyalty/backend-go/internal/app"
	"github.com/loyalty/backend-go/internal/config"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"os"
)

func main() {
	// Setup logger
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})

	// Load config
	cfg := config.Load()

	// Create and start app
	app := app.New(cfg)
	if err := app.Start(); err != nil {
		log.Fatal().Err(err).Msg("Failed to start application")
	}
}
