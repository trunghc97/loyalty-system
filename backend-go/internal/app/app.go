package app

import (
	"github.com/loyalty/backend-go/internal/handler"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

type App struct {
	fiber *fiber.App
}

func New() *App {
	app := &App{
		fiber: fiber.New(),
	}

	// Middleware
	app.fiber.Use(logger.New())
	app.fiber.Use(recover.New())

	// Initialize handlers
	blockchainHandler := handler.NewBlockchainHandler()

	// Setup routes
	blockchain := app.fiber.Group("/blockchain")
	{
		blockchain.Post("/trade", blockchainHandler.Trade)
		blockchain.Post("/pay", blockchainHandler.Pay)
		blockchain.Post("/anchor-receipt", blockchainHandler.AnchorReceipt)
		blockchain.Get("/status", blockchainHandler.GetStatus)
	}

	return app
}

func (a *App) Start(addr string) error {
	return a.fiber.Listen(addr)
}
