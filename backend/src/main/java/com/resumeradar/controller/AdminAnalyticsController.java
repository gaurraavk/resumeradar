package com.resumeradar.controller;

import com.resumeradar.dto.AdminAnalyticsResponse;
import com.resumeradar.dto.ApiResponse;
import com.resumeradar.dto.UserProfileDto;
import com.resumeradar.service.AdminAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    public AdminAnalyticsController(AdminAnalyticsService adminAnalyticsService) {
        this.adminAnalyticsService = adminAnalyticsService;
    }

    @GetMapping({"/api/v1/admin/analytics", "/api/v1/auth/admin/analytics"})
    public ResponseEntity<ApiResponse<AdminAnalyticsResponse>> getAnalytics() {
        AdminAnalyticsResponse response = adminAnalyticsService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping({"/api/v1/admin/users", "/api/v1/auth/admin/users"})
    public ResponseEntity<ApiResponse<List<UserProfileDto>>> getRecentUsers() {
        List<UserProfileDto> users = adminAnalyticsService.getRecentUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}
