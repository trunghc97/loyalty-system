package com.loyalty.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "vouchers")
public class Voucher {
    @Id
    private String id;
    private String code;
    private String name;
    private String description;
    private Long pointsCost;
    private Double discountAmount;
    private LocalDateTime expiryDate;
    private boolean active;
}
