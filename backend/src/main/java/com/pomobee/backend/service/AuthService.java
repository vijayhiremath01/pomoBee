package com.pomobee.backend.service;

import com.pomobee.backend.dto.AuthResponse;
import com.pomobee.backend.dto.LoginRequest;
import com.pomobee.backend.dto.RegisterRequest;
import com.pomobee.backend.exception.InvalidCredentialsException;
import com.pomobee.backend.exception.UserAlreadyExistsException;
import com.pomobee.backend.exception.UserNotFoundException;
import com.pomobee.backend.model.User;
import com.pomobee.backend.repository.UserRepository;
import com.pomobee.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
            throw new UserAlreadyExistsException("User already registered with this email");
        });

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail());
    }
}
