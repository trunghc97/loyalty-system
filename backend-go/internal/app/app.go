package app

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/loyalty/backend-go/internal/config"
	"github.com/loyalty/backend-go/internal/handler"
	"github.com/loyalty/backend-go/internal/repository"
	"github.com/loyalty/backend-go/internal/service"
	"github.com/rs/zerolog/log"
)

type App struct {
	config *config.Config
	fiber  *fiber.App
}

func New(cfg *config.Config) *App {
	app := &App{
		config: cfg,
		fiber:  fiber.New(),
	}

	app.setup()
	return app
}

func (a *App) setup() {
	// Middleware
	a.fiber.Use(cors.New())
	a.fiber.Use(logger.New())

	// MongoDB repository
	repo := repository.NewMongoRepository(a.config.MongoURI)

	// Services
	blockchainService := service.NewBlockchainService(repo)

	// Handlers
	blockchainHandler := handler.NewBlockchainHandler(blockchainService)

	// Routes
	api := a.fiber.Group("/blockchain")
	api.Post("/anchor-receipt", blockchainHandler.AnchorReceipt)
	api.Post("/trade", blockchainHandler.Trade)
	api.Post("/pay", blockchainHandler.Pay)
	api.Get("/status", blockchainHandler.GetStatus)
}

func (a *App) Start() error {
	addr := fmt.Sprintf(":%d", a.config.Port)
	log.Info().Msgf("Starting server on %s", addr)
	return a.fiber.Listen(addr)
}
