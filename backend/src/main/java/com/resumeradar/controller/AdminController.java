package com.resumeradar.controller;

import com.resumeradar.dto.AdminLoginRequest;
import com.resumeradar.dto.AdminLoginResponse;
import com.resumeradar.dto.ApiResponse;
import com.resumeradar.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.management.ManagementFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/admin-login")
    public ResponseEntity<ApiResponse<AdminLoginResponse>> login(@Valid @RequestBody AdminLoginRequest request) {
        AdminLoginResponse response = adminService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/admin/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverview() {
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        Map<String, Object> data = Map.of(
                "status", "RUNNING",
                "uptimeSeconds", uptimeMs / 1000,
                "jvmVersion", System.getProperty("java.version"),
                "totalMemoryMb", Runtime.getRuntime().totalMemory() / (1024 * 1024),
                "freeMemoryMb", Runtime.getRuntime().freeMemory() / (1024 * 1024)
        );
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
