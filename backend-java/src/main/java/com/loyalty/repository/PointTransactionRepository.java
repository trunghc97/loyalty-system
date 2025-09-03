package com.loyalty.repository;

import com.loyalty.model.PointTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface PointTransactionRepository extends MongoRepository<PointTransaction, String> {
    List<PointTransaction> findByUserIdOrderByTimestampDesc(String userId);
    
    @Query(value = "{'userId': ?0, 'status': 'SUCCESS'}", count = true)
    Long countSuccessfulTransactionsByUserId(String userId);
    
    @Query(value = "{'userId': ?0, 'status': 'SUCCESS'}", fields = "{'amount': 1}")
    List<PointTransaction> findSuccessfulTransactionAmountsByUserId(String userId);
}
