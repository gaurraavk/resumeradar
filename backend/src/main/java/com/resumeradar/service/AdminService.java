package com.resumeradar.service;

import com.resumeradar.dto.AdminLoginRequest;
import com.resumeradar.dto.AdminLoginResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class AdminService {

    @Value("${resumeradar.admin.email:admin@resumeradar.io}")
    private String adminEmail;

    @Value("${resumeradar.admin.password:admin123}")
    private String adminPassword;

    @Value("${resumeradar.admin.jwt-secret:ResumeRadarSecretKeyForDevelopmentMustBe32BytesMinLength12345}")
    private String jwtSecret;

    @Value("${resumeradar.admin.jwt-expiration-ms:86400000}")
    private long jwtExpirationMs;

    public AdminLoginResponse login(AdminLoginRequest request) {
        if (!adminEmail.equalsIgnoreCase(request.getEmail().trim()) || !adminPassword.equals(request.getPassword())) {
            throw new BadCredentialsException("Invalid admin credentials");
        }

        String token = generateToken(request.getEmail());
        AdminLoginResponse.AdminUserDto user = new AdminLoginResponse.AdminUserDto(
                adminEmail,
                "Chief Administrator",
                "Super Administrator"
        );

        return new AdminLoginResponse(token, user);
    }

    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    private String generateToken(String email) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("role", "ADMIN")
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }
}
