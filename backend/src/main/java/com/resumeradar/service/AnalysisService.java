package com.resumeradar.service;

import com.resumeradar.dto.AnalysisRequest;
import com.resumeradar.dto.AnalysisResponse;
import com.resumeradar.dto.AtsResult;
import org.springframework.stereotype.Service;

@Service
public class AnalysisService {

    private final AtsKeywordService atsKeywordService;

    public AnalysisService(AtsKeywordService atsKeywordService) {
        this.atsKeywordService = atsKeywordService;
    }

    public AnalysisResponse runAnalysis(AnalysisRequest request) {
        AtsResult atsResult = atsKeywordService.analyzeKeywords(request.getResumeText(), request.getJobDescription());

        return new AnalysisResponse(
                atsResult.getAtsScore(),
                atsResult.getMatchedKeywords(),
                atsResult.getMissingKeywords()
        );
    }
}
