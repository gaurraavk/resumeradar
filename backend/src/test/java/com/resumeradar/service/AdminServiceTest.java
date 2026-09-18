package com.resumeradar.service;

import com.resumeradar.dto.AdminLoginRequest;
import com.resumeradar.dto.AdminLoginResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class AdminServiceTest {

    private AdminService adminService;

    @BeforeEach
    void setUp() {
        adminService = new AdminService();
        ReflectionTestUtils.setField(adminService, "adminEmail", "admin@resumeradar.io");
        ReflectionTestUtils.setField(adminService, "adminPassword", "secret123");
        ReflectionTestUtils.setField(adminService, "jwtSecret", "ThisIsASecretKeyForTestingThatIsLongEnough12345");
        ReflectionTestUtils.setField(adminService, "jwtExpirationMs", 3600000L);
    }

    @Test
    void testSuccessfulLoginAndTokenValidation() {
        AdminLoginRequest req = new AdminLoginRequest("admin@resumeradar.io", "secret123");
        AdminLoginResponse res = adminService.login(req);

        assertNotNull(res.getToken());
        assertEquals("admin@resumeradar.io", res.getUser().getEmail());
        assertTrue(adminService.validateToken(res.getToken()));
        assertEquals("admin@resumeradar.io", adminService.getEmailFromToken(res.getToken()));
    }

    @Test
    void testFailedLogin() {
        AdminLoginRequest req = new AdminLoginRequest("admin@resumeradar.io", "wrongpassword");
        assertThrows(BadCredentialsException.class, () -> adminService.login(req));
    }
}
