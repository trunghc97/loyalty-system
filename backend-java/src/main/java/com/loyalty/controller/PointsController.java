package com.loyalty.controller;

import com.loyalty.dto.PointsRequest;
import com.loyalty.model.Transaction;
import com.loyalty.model.User;
import com.loyalty.service.PointsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/java/points")
@RequiredArgsConstructor
public class PointsController {
    private final PointsService pointsService;

    @PostMapping("/earn")
    public ResponseEntity<Transaction> earnPoints(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PointsRequest request) {
        return ResponseEntity.ok(pointsService.earnPoints(user.getId(), request));
    }

    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transferPoints(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PointsRequest request) {
        return ResponseEntity.ok(pointsService.transferPoints(user.getId(), request));
    }

    @GetMapping("/balance")
    public ResponseEntity<Long> getBalance(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user.getPoints());
    }
}
