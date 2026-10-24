package com.resumeradar.service;

import com.resumeradar.dto.AtsResult;
import com.resumeradar.dto.JobAnalysisResponse;
import com.resumeradar.dto.ResumeQualityResponse;
import com.resumeradar.dto.UnifiedAnalysisResponse;
import org.springframework.stereotype.Service;

@Service
public class UnifiedAnalysisService {

    private final AtsKeywordService atsKeywordService;
    private final ResumeQualityService resumeQualityService;
    private final JobAnalyzerService jobAnalyzerService;

    public UnifiedAnalysisService(AtsKeywordService atsKeywordService,
                                  ResumeQualityService resumeQualityService,
                                  JobAnalyzerService jobAnalyzerService) {
        this.atsKeywordService = atsKeywordService;
        this.resumeQualityService = resumeQualityService;
        this.jobAnalyzerService = jobAnalyzerService;
    }

    public UnifiedAnalysisResponse runUnifiedAnalysis(String resumeText, String jobDescription) {
        if (resumeText == null) resumeText = "";
        if (jobDescription == null) jobDescription = "";

        // 1. Existing ATS Keyword match
        AtsResult atsResult = atsKeywordService.analyzeKeywords(resumeText, jobDescription);

        // 2. Resume Quality Analysis (Module 3)
        ResumeQualityResponse qualityResult = resumeQualityService.analyzeQuality(resumeText);

        // 3. Job Requirements Analysis (Module 1)
        JobAnalysisResponse jobResult = jobAnalyzerService.analyzeJob(jobDescription);

        // 4. Generate 1-2 sentence plain-language overall summary
        String overallSummary = generateOverallSummary(atsResult, qualityResult, jobResult);

        return new UnifiedAnalysisResponse(
                atsResult,
                qualityResult,
                jobResult,
                overallSummary
        );
    }

    private String generateOverallSummary(AtsResult ats, ResumeQualityResponse quality, JobAnalysisResponse job) {
        int atsScore = ats.getAtsScore();
        int qualityScore = quality.getQualityScore();
        int matchedCount = ats.getMatchedKeywords().size();
        int missingCount = ats.getMissingKeywords().size();

        String matchTier;
        if (atsScore >= 80) {
            matchTier = "strong alignment";
        } else if (atsScore >= 55) {
            matchTier = "moderate keyword coverage";
        } else {
            matchTier = "significant keyword gaps";
        }

        String qualityTier;
        if (qualityScore >= 80) {
            qualityTier = "solid resume formatting";
        } else if (qualityScore >= 60) {
            qualityTier = "good structure but needs polish";
        } else {
            qualityTier = "formatting and content areas to improve";
        }

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Your resume achieved a %d%% ATS match (%s) with a %d/100 quality score (%s). ",
                atsScore, matchTier, qualityScore, qualityTier));

        if (missingCount > 0) {
            sb.append(String.format("You matched %d target terms; adding %d missing skill%s will directly boost your ATS compatibility.",
                    matchedCount, missingCount, missingCount == 1 ? "" : "s"));
        } else {
            sb.append("You matched all target job keywords — your resume is exceptionally well aligned with this position.");
        }

        return sb.toString();
    }
}
