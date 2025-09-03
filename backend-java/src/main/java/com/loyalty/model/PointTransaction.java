package com.loyalty.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "point_transactions")
public class PointTransaction {
    @Id
    private String id;
    private String userId;
    private TransactionType type;
    private Long amount;
    private TransactionStatus status;
    private String blockchainTx;
    private String description;
    private Date timestamp;
    private String referenceId; // ID của giao dịch liên quan (nếu có)

    public enum TransactionType {
        EARN,       // Earn points from activities
        REDEEM,     // Redeem points for rewards
        TRANSFER,   // Transfer points to another user
        TRADE,      // Trade points on blockchain
        PAY,        // Pay with points on blockchain
        ANCHOR      // Anchor transaction receipt on blockchain
    }

    public enum TransactionStatus {
        PENDING,    // Transaction is being processed
        SUCCESS,    // Transaction completed successfully
        FAILED      // Transaction failed
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    
    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }
    
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }
    
    public String getBlockchainTx() { return blockchainTx; }
    public void setBlockchainTx(String blockchainTx) { this.blockchainTx = blockchainTx; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
    
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
}
