package com.resumeradar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/healthz")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "service", "resumeradar-backend",
                "runtime", "Java 21 / Spring Boot 3.3"
        ));
    }
}
