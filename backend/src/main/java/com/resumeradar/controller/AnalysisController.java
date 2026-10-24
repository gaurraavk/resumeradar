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

import com.resumeradar.model.ResumeTemplate;

@RestController
@RequestMapping("/api/v1")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final AtsKeywordService atsKeywordService;
    private final FormattingAnalysisService formattingAnalysisService;
    private final ResumeFixService resumeFixService;
    private final AnalysisSessionStore sessionStore;
    private final TemplateCatalog templateCatalog;
    private final TemplateResumeService templateResumeService;
    private final JobAnalyzerService jobAnalyzerService;
    private final ResumeComparisonService resumeComparisonService;
    private final ResumeQualityService resumeQualityService;
    private final UnifiedAnalysisService unifiedAnalysisService;

    @org.springframework.beans.factory.annotation.Autowired
    public AnalysisController(AnalysisService analysisService,
                              AtsKeywordService atsKeywordService,
                              FormattingAnalysisService formattingAnalysisService,
                              ResumeFixService resumeFixService,
                              AnalysisSessionStore sessionStore,
                              TemplateCatalog templateCatalog,
                              TemplateResumeService templateResumeService,
                              JobAnalyzerService jobAnalyzerService,
                              ResumeComparisonService resumeComparisonService,
                              ResumeQualityService resumeQualityService,
                              UnifiedAnalysisService unifiedAnalysisService) {
        this.analysisService = analysisService;
        this.atsKeywordService = atsKeywordService;
        this.formattingAnalysisService = formattingAnalysisService;
        this.resumeFixService = resumeFixService;
        this.sessionStore = sessionStore;
        this.templateCatalog = templateCatalog;
        this.templateResumeService = templateResumeService;
        this.jobAnalyzerService = jobAnalyzerService;
        this.resumeComparisonService = resumeComparisonService;
        this.resumeQualityService = resumeQualityService;
        this.unifiedAnalysisService = unifiedAnalysisService;
    }

    public AnalysisController(AnalysisService analysisService,
                              AtsKeywordService atsKeywordService,
                              FormattingAnalysisService formattingAnalysisService,
                              ResumeFixService resumeFixService,
                              AnalysisSessionStore sessionStore,
                              TemplateCatalog templateCatalog,
                              TemplateResumeService templateResumeService) {
        this(analysisService, atsKeywordService, formattingAnalysisService, resumeFixService, sessionStore,
                templateCatalog, templateResumeService,
                new JobAnalyzerService(atsKeywordService),
                new ResumeComparisonService(atsKeywordService),
                new ResumeQualityService(atsKeywordService, resumeFixService),
                new UnifiedAnalysisService(atsKeywordService, new ResumeQualityService(atsKeywordService, resumeFixService), new JobAnalyzerService(atsKeywordService)));
    }

    public AnalysisController(AnalysisService analysisService,
                              AtsKeywordService atsKeywordService,
                              FormattingAnalysisService formattingAnalysisService,
                              ResumeFixService resumeFixService,
                              AnalysisSessionStore sessionStore) {
        this(analysisService, atsKeywordService, formattingAnalysisService, resumeFixService, sessionStore,
                new TemplateCatalog(), new TemplateResumeService(new ResumeSectionParser()));
    }

    // Existing text-only endpoint - updated to store session in AnalysisSessionStore and support fix/download
    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<AnalysisResponse>> analyze(@Valid @RequestBody AnalysisRequest request) {
        AnalysisResponse response = analysisService.runAnalysis(request);

        String analysisId = UUID.randomUUID().toString();
        response.setAnalysisId(analysisId);
        response.setFormattingWarnings(Collections.emptyList());
        response.setFormattingNote("Formatting checks require a .docx upload");

        // Feature 1, 2, 3
        response.setRepeatedKeywordWarnings(atsKeywordService.detectRepeatedKeywords(request.getResumeText()));
        response.setMissingSections(atsKeywordService.detectMissingSections(request.getResumeText()));
        ResumeFixService.WeakSentenceAnalysis weak = resumeFixService.analyzeWeakSentences(request.getResumeText());
        response.setWeakSentenceCount(weak.getWeakSentenceCount());
        response.setTotalSentenceCount(weak.getTotalSentenceCount());
        response.setWeakSentenceExamples(weak.getWeakSentenceExamples());

        // Store session for potential auto-fix exactly like /api/v1/analyze-file does
        AnalysisSession session = new AnalysisSession(
                request.getResumeText(),
                null,
                "resume.docx",
                true,
                response.getMissingKeywords(),
                Collections.emptyList(),
                request.getJobDescription(),
                response.getAtsScore()
        );
        sessionStore.put(analysisId, session);

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
                atsResult.getMissingKeywords(), formattingResult.getWarnings(),
                jobDescription, atsResult.getAtsScore()
        );
        sessionStore.put(analysisId, session);

        AnalysisFileResponse response = new AnalysisFileResponse(
                analysisId,
                atsResult.getAtsScore(),
                atsResult.getMatchedKeywords(),
                atsResult.getMissingKeywords(),
                formattingResult.getWarnings()
        );

        // Feature 1, 2, 3
        response.setRepeatedKeywordWarnings(atsKeywordService.detectRepeatedKeywords(resumeText));
        response.setMissingSections(atsKeywordService.detectMissingSections(resumeText));
        ResumeFixService.WeakSentenceAnalysis weak = resumeFixService.analyzeWeakSentences(resumeText);
        response.setWeakSentenceCount(weak.getWeakSentenceCount());
        response.setTotalSentenceCount(weak.getTotalSentenceCount());
        response.setWeakSentenceExamples(weak.getWeakSentenceExamples());

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/templates")
    public ResponseEntity<ApiResponse<List<ResumeTemplate>>> getTemplates() {
        return ResponseEntity.ok(ApiResponse.success(templateCatalog.getAllTemplates()));
    }

    // Task 5: Generate fixed resume with before/after score comparison and optional template
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
                    .body(ApiResponse.error("Auto-fix is only available for .docx uploads or text resumes. PDF files cannot be rebuilt."));
        }

        String templateId = request.get("templateId");
        if (templateId != null && templateId.isBlank()) {
            templateId = null;
        }

        ResumeTemplate selectedTemplate = null;
        if (templateId != null && !templateId.equalsIgnoreCase("original")) {
            Optional<ResumeTemplate> optTemplate = templateCatalog.findById(templateId);
            if (optTemplate.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Unknown templateId: " + templateId));
            }
            selectedTemplate = optTemplate.get();
        }

        ResumeFixService.FixResult fixResult = resumeFixService.fixResume(analysisId);
        String downloadUrl = "/api/v1/download/fixed-resume/" + analysisId;

        List<String> fixes = new ArrayList<>(fixResult.getFixesApplied());
        String resTemplateId = "original";
        String resTemplateName = "Original layout";

        if (selectedTemplate != null) {
            byte[] templateBytes = templateResumeService.render(fixResult.getFixedText(), selectedTemplate);
            session.setFixedDocxBytes(templateBytes);
            fixes.add("Applied the '" + selectedTemplate.getName() + "' template");
            resTemplateId = selectedTemplate.getId();
            resTemplateName = selectedTemplate.getName();
        }

        FixResumeResponse response = new FixResumeResponse(
                fixResult.getOriginalScore(),
                fixResult.getImprovedScore(),
                fixes,
                downloadUrl,
                resTemplateId,
                resTemplateName
        );
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

        String orig = session.getOriginalFileName();
        if (orig == null || orig.isBlank()) {
            orig = "resume.docx";
        }
        if (!orig.toLowerCase().endsWith(".docx")) {
            orig = orig.replaceAll("\\.[^.]+$", "") + ".docx";
        }
        String filename = "fixed_" + orig;

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

    // Module 1: Job Description Analyzer
    @PostMapping("/analyze-job")
    public ResponseEntity<ApiResponse<JobAnalysisResponse>> analyzeJob(@RequestBody(required = false) JobAnalysisRequest request) {
        String jd = (request != null && request.getJobDescription() != null) ? request.getJobDescription() : "";
        JobAnalysisResponse response = jobAnalyzerService.analyzeJob(jd);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Module 2: Resume Version Comparison
    @PostMapping("/compare-versions")
    public ResponseEntity<ApiResponse<CompareVersionsResponse>> compareVersions(@RequestBody(required = false) CompareVersionsRequest request) {
        String resumeA = (request != null && request.getResumeTextA() != null) ? request.getResumeTextA() : "";
        String resumeB = (request != null && request.getResumeTextB() != null) ? request.getResumeTextB() : "";
        String jd = (request != null && request.getJobDescription() != null) ? request.getJobDescription() : "";
        CompareVersionsResponse response = resumeComparisonService.compareVersions(resumeA, resumeB, jd);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Module 3: Resume Quality Analyzer
    @PostMapping("/analyze-quality")
    public ResponseEntity<ApiResponse<ResumeQualityResponse>> analyzeQuality(@RequestBody(required = false) ResumeQualityRequest request) {
        String resume = (request != null && request.getResumeText() != null) ? request.getResumeText() : "";
        ResumeQualityResponse response = resumeQualityService.analyzeQuality(resume);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Module 4: Unified Analysis Dashboard
    @PostMapping("/unified-analysis")
    public ResponseEntity<ApiResponse<UnifiedAnalysisResponse>> unifiedAnalysis(@RequestBody(required = false) UnifiedAnalysisRequest request) {
        String resume = (request != null && request.getResumeText() != null) ? request.getResumeText() : "";
        String jd = (request != null && request.getJobDescription() != null) ? request.getJobDescription() : "";
        UnifiedAnalysisResponse response = unifiedAnalysisService.runUnifiedAnalysis(resume, jd);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

