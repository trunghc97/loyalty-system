package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/loyalty/backend-go/internal/model"
	"github.com/loyalty/backend-go/internal/service"
)

type BlockchainHandler struct {
	service *service.BlockchainService
}

func NewBlockchainHandler(service *service.BlockchainService) *BlockchainHandler {
	return &BlockchainHandler{service: service}
}

func (h *BlockchainHandler) AnchorReceipt(c *fiber.Ctx) error {
	var tx model.Transaction
	if err := c.BodyParser(&tx); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	txHash, err := h.service.AnchorReceipt(&tx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"txHash": txHash,
	})
}

func (h *BlockchainHandler) Trade(c *fiber.Ctx) error {
	var tx model.Transaction
	if err := c.BodyParser(&tx); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	txHash, err := h.service.Trade(&tx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"txHash": txHash,
	})
}

func (h *BlockchainHandler) Pay(c *fiber.Ctx) error {
	var tx model.Transaction
	if err := c.BodyParser(&tx); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	txHash, err := h.service.Pay(&tx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"txHash": txHash,
	})
}

func (h *BlockchainHandler) GetStatus(c *fiber.Ctx) error {
	txHash := c.Query("txId")
	if txHash == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "txId is required",
		})
	}

	status, err := h.service.GetStatus(txHash)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"txHash": txHash,
		"status": status,
	})
}
