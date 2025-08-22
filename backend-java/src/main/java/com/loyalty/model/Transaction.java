package com.loyalty.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private String userId;
    private TransactionType type;
    private Long amount;
    private String description;
    private String txHash;
    private LocalDateTime createdAt;

    public enum TransactionType {
        EARN,
        TRANSFER,
        REDEEM
    }
}
