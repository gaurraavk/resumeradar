package com.resumeradar.service;

import com.resumeradar.dto.AdminLoginRequest;
import com.resumeradar.dto.AdminLoginResponse;
import com.resumeradar.security.JwtTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

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

    private JwtTokenService jwtTokenService;

    public AdminService() {
        this.jwtTokenService = new JwtTokenService();
    }

    @org.springframework.beans.factory.annotation.Autowired
    public AdminService(JwtTokenService jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }

    private void ensureJwtConfig() {
        if (jwtTokenService == null) {
            jwtTokenService = new JwtTokenService();
        }
        if (jwtSecret != null) {
            jwtTokenService.setJwtSecret(jwtSecret);
        }
        if (jwtExpirationMs > 0) {
            jwtTokenService.setJwtExpirationMs(jwtExpirationMs);
        }
    }

    public AdminLoginResponse login(AdminLoginRequest request) {
        ensureJwtConfig();
        if (!adminEmail.equalsIgnoreCase(request.getEmail().trim()) || !adminPassword.equals(request.getPassword())) {
            throw new BadCredentialsException("Invalid admin credentials");
        }

        String token = jwtTokenService.generateToken(request.getEmail(), "ADMIN");
        AdminLoginResponse.AdminUserDto user = new AdminLoginResponse.AdminUserDto(
                adminEmail,
                "Chief Administrator",
                "Super Administrator"
        );

        return new AdminLoginResponse(token, user);
    }

    public boolean validateToken(String token) {
        ensureJwtConfig();
        return jwtTokenService.validateToken(token);
    }

    public String getEmailFromToken(String token) {
        ensureJwtConfig();
        return jwtTokenService.getEmailFromToken(token);
    }
}
