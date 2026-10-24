package com.resumeradar.controller;

import com.resumeradar.dto.AnalysisRecordDto;
import com.resumeradar.dto.ApiResponse;
import com.resumeradar.service.HistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/history")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<AnalysisRecordDto>>> getMyHistory(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }

        List<AnalysisRecordDto> history = historyService.getMyHistory(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
