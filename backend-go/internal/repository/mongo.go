package repository

import (
	"context"
	"github.com/loyalty/backend-go/internal/model"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type MongoRepository struct {
	client *mongo.Client
	db     *mongo.Database
}

func NewMongoRepository(uri string) *MongoRepository {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to MongoDB")
	}

	return &MongoRepository{
		client: client,
		db:     client.Database("loyalty"),
	}
}

func (r *MongoRepository) SaveTransaction(tx *model.Transaction) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := r.db.Collection("blockchain_transactions")
	_, err := collection.InsertOne(ctx, tx)
	return err
}

func (r *MongoRepository) GetTransactionStatus(txHash string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := r.db.Collection("blockchain_transactions")
	var tx model.Transaction
	err := collection.FindOne(ctx, bson.M{"txHash": txHash}).Decode(&tx)
	if err != nil {
		return "", err
	}
	return tx.Status, nil
}
