package model

import "time"

type Transaction struct {
	ID          string    `json:"id" bson:"_id,omitempty"`
	TxHash      string    `json:"txHash" bson:"txHash"`
	Type        string    `json:"type" bson:"type"`
	Amount      int64     `json:"amount" bson:"amount"`
	Description string    `json:"description" bson:"description"`
	Status      string    `json:"status" bson:"status"`
	CreatedAt   time.Time `json:"createdAt" bson:"createdAt"`
}

type TransactionStatus struct {
	TxHash string `json:"txHash"`
	Status string `json:"status"`
}
