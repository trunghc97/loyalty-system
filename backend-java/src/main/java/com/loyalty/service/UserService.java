package com.loyalty.service;

import com.loyalty.dto.AuthRequest;
import com.loyalty.dto.AuthResponse;
import com.loyalty.dto.RegisterRequest;
import com.loyalty.model.User;
import com.loyalty.repository.UserRepository;
import com.loyalty.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPoints(0L);
        user.setEnabled(true);

        user = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getPoints());
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        User user = (User) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getPoints());
    }

    @Transactional
    public void updatePoints(String userId, Long amount) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPoints(user.getPoints() + amount);
        userRepository.save(user);
    }
}
