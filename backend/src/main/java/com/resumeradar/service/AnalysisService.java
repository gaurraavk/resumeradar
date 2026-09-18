package com.resumeradar.service;

import com.resumeradar.dto.AiCritique;
import com.resumeradar.dto.AnalysisRequest;
import com.resumeradar.dto.AnalysisResponse;
import com.resumeradar.dto.AtsResult;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AnalysisService {

    private final AtsKeywordService atsKeywordService;
    private final ResumeCriticService resumeCriticService;

    public AnalysisService(AtsKeywordService atsKeywordService, ResumeCriticService resumeCriticService) {
        this.atsKeywordService = atsKeywordService;
        this.resumeCriticService = resumeCriticService;
    }

    public AnalysisResponse runAnalysis(AnalysisRequest request) {
        // 1. Run Deterministic ATS Keyword Matching
        AtsResult atsResult = atsKeywordService.analyzeKeywords(request.getResumeText(), request.getJobDescription());

        // 2. Run Gemini AI Resume Critique (gracefully handled)
        Optional<AiCritique> aiCritiqueOpt = resumeCriticService.critique(
                request.getResumeText(),
                request.getJobDescription(),
                request.getJobTitle()
        );

        String aiError = null;
        if (aiCritiqueOpt.isEmpty()) {
            aiError = "AI critique unavailable (check GEMINI_API_KEY). ATS match scores are fully computed.";
        }

        return new AnalysisResponse(
                atsResult.getAtsScore(),
                atsResult.getMatchedKeywords(),
                atsResult.getMissingKeywords(),
                aiCritiqueOpt.orElse(null),
                aiError
        );
    }
}
