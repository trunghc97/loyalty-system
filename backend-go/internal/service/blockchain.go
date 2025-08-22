package service

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"github.com/loyalty/backend-go/internal/model"
	"github.com/loyalty/backend-go/internal/repository"
	"github.com/rs/zerolog/log"
	"time"
)

type BlockchainService struct {
	repo *repository.MongoRepository
}

func NewBlockchainService(repo *repository.MongoRepository) *BlockchainService {
	return &BlockchainService{repo: repo}
}

func (s *BlockchainService) AnchorReceipt(tx *model.Transaction) (string, error) {
	// Mock blockchain anchor by generating hash
	txHash := generateTxHash(tx)
	
	tx.TxHash = txHash
	tx.Status = "CONFIRMED"
	tx.CreatedAt = time.Now()

	if err := s.repo.SaveTransaction(tx); err != nil {
		log.Error().Err(err).Msg("Failed to save transaction")
		return "", err
	}

	return txHash, nil
}

func (s *BlockchainService) Trade(tx *model.Transaction) (string, error) {
	// Mock blockchain trade
	txHash := generateTxHash(tx)
	
	tx.TxHash = txHash
	tx.Status = "CONFIRMED"
	tx.CreatedAt = time.Now()

	if err := s.repo.SaveTransaction(tx); err != nil {
		log.Error().Err(err).Msg("Failed to save transaction")
		return "", err
	}

	return txHash, nil
}

func (s *BlockchainService) Pay(tx *model.Transaction) (string, error) {
	// Mock blockchain payment
	txHash := generateTxHash(tx)
	
	tx.TxHash = txHash
	tx.Status = "CONFIRMED"
	tx.CreatedAt = time.Now()

	if err := s.repo.SaveTransaction(tx); err != nil {
		log.Error().Err(err).Msg("Failed to save transaction")
		return "", err
	}

	return txHash, nil
}

func (s *BlockchainService) GetStatus(txHash string) (string, error) {
	return s.repo.GetTransactionStatus(txHash)
}

func generateTxHash(tx *model.Transaction) string {
	data := fmt.Sprintf("%v-%v-%v", tx.Type, tx.Amount, time.Now().UnixNano())
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}
