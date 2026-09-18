package com.resumeradar.dto;

import java.util.List;

public class AnalysisResponse {

    private int atsScore;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private AiCritique aiCritique;
    private String aiError;

    public AnalysisResponse() {}

    public AnalysisResponse(int atsScore, List<String> matchedKeywords, List<String> missingKeywords, AiCritique aiCritique, String aiError) {
        this.atsScore = atsScore;
        this.matchedKeywords = matchedKeywords;
        this.missingKeywords = missingKeywords;
        this.aiCritique = aiCritique;
        this.aiError = aiError;
    }

    public int getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(int atsScore) {
        this.atsScore = atsScore;
    }

    public List<String> getMatchedKeywords() {
        return matchedKeywords;
    }

    public void setMatchedKeywords(List<String> matchedKeywords) {
        this.matchedKeywords = matchedKeywords;
    }

    public List<String> getMissingKeywords() {
        return missingKeywords;
    }

    public void setMissingKeywords(List<String> missingKeywords) {
        this.missingKeywords = missingKeywords;
    }

    public AiCritique getAiCritique() {
        return aiCritique;
    }

    public void setAiCritique(AiCritique aiCritique) {
        this.aiCritique = aiCritique;
    }

    public String getAiError() {
        return aiError;
    }

    public void setAiError(String aiError) {
        this.aiError = aiError;
    }
}
