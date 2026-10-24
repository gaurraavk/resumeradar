package com.resumeradar.service;

import com.resumeradar.dto.AuthResponse;
import com.resumeradar.dto.LoginRequest;
import com.resumeradar.dto.RegisterRequest;
import com.resumeradar.dto.UserProfileDto;
import com.resumeradar.model.User;
import com.resumeradar.repository.UserRepository;
import com.resumeradar.security.JwtTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenService jwtTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }

        String fullName = request.getFullName();
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required");
        }

        String email = request.getEmail();
        if (email == null || email.trim().isEmpty() || !EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new IllegalArgumentException("Valid email address is required");
        }

        String password = request.getPassword();
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        String passwordHash = passwordEncoder.encode(password);
        User user = new User(
                fullName.trim(),
                normalizedEmail,
                passwordHash,
                "USER",
                LocalDateTime.now()
        );
        user = userRepository.save(user);

        String token = jwtTokenService.generateToken(user.getEmail(), "USER");
        AuthResponse.UserSummaryDto userSummary = new AuthResponse.UserSummaryDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );

        return new AuthResponse(token, userSummary);
    }

    public AuthResponse login(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        user = userRepository.save(user);

        String token = jwtTokenService.generateToken(user.getEmail(), user.getRole());
        AuthResponse.UserSummaryDto userSummary = new AuthResponse.UserSummaryDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );

        return new AuthResponse(token, userSummary);
    }

    public UserProfileDto getProfile(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found"));

        return new UserProfileDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getLastLoginAt()
        );
    }
}
