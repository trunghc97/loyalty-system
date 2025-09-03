package main

import (
	"os"

	"github.com/loyalty/backend-go/internal/app"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	// Setup logger
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})

	// Create and start app
	app := app.New()
	if err := app.Start(":8081"); err != nil {
		log.Fatal().Err(err).Msg("Failed to start application")
	}
}
