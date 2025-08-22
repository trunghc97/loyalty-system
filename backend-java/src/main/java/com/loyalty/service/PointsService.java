package com.loyalty.service;

import com.loyalty.dto.PointsRequest;
import com.loyalty.model.Transaction;
import com.loyalty.model.User;
import com.loyalty.repository.TransactionRepository;
import com.loyalty.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PointsService {
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BlockchainService blockchainService;

    @Transactional
    public Transaction earnPoints(String userId, PointsRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPoints(user.getPoints() + request.getAmount());
        userRepository.save(user);

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(Transaction.TransactionType.EARN);
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setCreatedAt(LocalDateTime.now());
        
        // Anchor transaction to blockchain
        String txHash = blockchainService.anchorReceipt(transaction);
        transaction.setTxHash(txHash);
        
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction transferPoints(String fromUserId, PointsRequest request) {
        User fromUser = userRepository.findById(fromUserId)
            .orElseThrow(() -> new RuntimeException("From user not found"));
        User toUser = userRepository.findByUsername(request.getToUsername())
            .orElseThrow(() -> new RuntimeException("To user not found"));

        if (fromUser.getPoints() < request.getAmount()) {
            throw new RuntimeException("Insufficient points");
        }

        fromUser.setPoints(fromUser.getPoints() - request.getAmount());
        toUser.setPoints(toUser.getPoints() + request.getAmount());
        
        userRepository.save(fromUser);
        userRepository.save(toUser);

        Transaction transaction = new Transaction();
        transaction.setUserId(fromUserId);
        transaction.setType(Transaction.TransactionType.TRANSFER);
        transaction.setAmount(request.getAmount());
        transaction.setDescription("Transfer to " + toUser.getUsername());
        transaction.setCreatedAt(LocalDateTime.now());
        
        // Submit transfer to blockchain
        String txHash = blockchainService.trade(transaction);
        transaction.setTxHash(txHash);
        
        return transactionRepository.save(transaction);
    }
}
