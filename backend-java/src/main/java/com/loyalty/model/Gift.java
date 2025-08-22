package com.loyalty.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "gifts")
public class Gift {
    @Id
    private String id;
    private String name;
    private String description;
    private Long pointsCost;
    private Integer stock;
    private String imageUrl;
    private boolean active;
}
