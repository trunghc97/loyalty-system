package model

// BlockchainRequest represents the request from Java service
type BlockchainRequest struct {
	UserID        string `json:"userId"`
	Amount        int64  `json:"amount"`
	TransactionID string `json:"transactionId"`
}

// BlockchainResponse represents the response to Java service
type BlockchainResponse struct {
	TxHash string `json:"txHash"`
	Status string `json:"status"` // SUCCESS, FAILED
	Error  string `json:"error,omitempty"`
}

// MockBlockchainTx mocks a blockchain transaction for development
type MockBlockchainTx struct {
	TxHash    string
	Status    string
	Timestamp int64
}
