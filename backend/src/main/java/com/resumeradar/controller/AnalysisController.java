package com.resumeradar.controller;

import com.resumeradar.dto.AnalysisRequest;
import com.resumeradar.dto.AnalysisResponse;
import com.resumeradar.dto.ApiResponse;
import com.resumeradar.service.AnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<AnalysisResponse>> analyze(@Valid @RequestBody AnalysisRequest request) {
        AnalysisResponse response = analysisService.runAnalysis(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
