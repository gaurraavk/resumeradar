package com.resumeradar.controller;

import com.resumeradar.dto.*;
import com.resumeradar.service.*;
import com.resumeradar.service.AnalysisSessionStore.AnalysisSession;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final AtsKeywordService atsKeywordService;
    private final FormattingAnalysisService formattingAnalysisService;
    private final ResumeFixService resumeFixService;
    private final AnalysisSessionStore sessionStore;

    public AnalysisController(AnalysisService analysisService,
                              AtsKeywordService atsKeywordService,
                              FormattingAnalysisService formattingAnalysisService,
                              ResumeFixService resumeFixService,
                              AnalysisSessionStore sessionStore) {
        this.analysisService = analysisService;
        this.atsKeywordService = atsKeywordService;
        this.formattingAnalysisService = formattingAnalysisService;
        this.resumeFixService = resumeFixService;
        this.sessionStore = sessionStore;
    }

    // Existing text-only endpoint
    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<AnalysisResponse>> analyze(@Valid @RequestBody AnalysisRequest request) {
        AnalysisResponse response = analysisService.runAnalysis(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // New file upload endpoint (Task 4)
    @PostMapping("/analyze-file")
    public ResponseEntity<ApiResponse<AnalysisFileResponse>> analyzeFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam(value = "jobTitle", required = false, defaultValue = "Target Role") String jobTitle) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File is empty"));
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null) originalFileName = "resume";
        String lowerName = originalFileName.toLowerCase();
        boolean isDocx = lowerName.endsWith(".docx");
        boolean isPdf = lowerName.endsWith(".pdf");

        if (!isDocx && !isPdf) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Unsupported file type. Please upload a .pdf or .docx file."));
        }

        byte[] fileBytes = file.getBytes();
        FormattingAnalysisService.FormattingResult formattingResult;

        if (isDocx) {
            formattingResult = formattingAnalysisService.analyzeDocx(fileBytes);
        } else {
            formattingResult = formattingAnalysisService.analyzePdf(fileBytes);
        }

        String resumeText = formattingResult.getExtractedText();
        AtsResult atsResult = atsKeywordService.analyzeKeywords(resumeText, jobDescription);

        String analysisId = UUID.randomUUID().toString();

        // Store session for potential auto-fix
        AnalysisSession session = new AnalysisSession(
                resumeText, fileBytes, originalFileName, isDocx,
                atsResult.getMissingKeywords(), formattingResult.getWarnings()
        );
        sessionStore.put(analysisId, session);

        AnalysisFileResponse response = new AnalysisFileResponse(
                analysisId,
                atsResult.getAtsScore(),
                atsResult.getMatchedKeywords(),
                atsResult.getMissingKeywords(),
                formattingResult.getWarnings()
        );

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Task 5: Generate fixed resume
    @PostMapping("/generate-fixed-resume")
    public ResponseEntity<ApiResponse<FixResumeResponse>> generateFixedResume(@RequestBody Map<String, String> request) {
        String analysisId = request.get("analysisId");
        if (analysisId == null || analysisId.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("analysisId is required"));
        }

        AnalysisSession session = sessionStore.get(analysisId);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Analysis session not found or expired. Please re-upload your resume."));
        }

        if (!session.isDocx()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Auto-fix is only available for .docx uploads."));
        }

        List<String> fixesApplied = resumeFixService.generateFixedResume(analysisId);
        String downloadUrl = "/api/v1/download/fixed-resume/" + analysisId;

        FixResumeResponse response = new FixResumeResponse(fixesApplied, downloadUrl);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Task 5: Download fixed resume
    @GetMapping("/download/fixed-resume/{analysisId}")
    public ResponseEntity<byte[]> downloadFixedResume(@PathVariable String analysisId) {
        AnalysisSession session = sessionStore.get(analysisId);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        byte[] fixedBytes = session.getFixedDocxBytes();
        if (fixedBytes == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        String filename = "fixed_" + (session.getOriginalFileName() != null ? session.getOriginalFileName() : "resume.docx");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .body(fixedBytes);
    }

    // Task 6: Best-fit multi-job comparison
    @PostMapping("/best-fit")
    public ResponseEntity<ApiResponse<BestFitResponse>> bestFit(@RequestBody BestFitRequest request) {
        if (request.getResumeText() == null || request.getResumeText().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("resumeText is required"));
        }
        if (request.getJobDescriptions() == null || request.getJobDescriptions().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("At least one job description is required"));
        }

        List<BestFitResponse.BestFitResult> results = new ArrayList<>();

        for (BestFitRequest.JobDescriptionEntry jd : request.getJobDescriptions()) {
            AtsResult atsResult = atsKeywordService.analyzeKeywords(request.getResumeText(), jd.getText());
            results.add(new BestFitResponse.BestFitResult(
                    jd.getTitle(),
                    atsResult.getAtsScore(),
                    atsResult.getMissingKeywords()
            ));
        }

        // Sort by matchScore descending
        results.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        return ResponseEntity.ok(ApiResponse.success(new BestFitResponse(results)));
    }
}
