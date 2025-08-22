package com.loyalty.repository;

import com.loyalty.model.Voucher;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VoucherRepository extends MongoRepository<Voucher, String> {
    List<Voucher> findByActiveTrue();
    Optional<Voucher> findByCodeAndActiveTrue(String code);
}
