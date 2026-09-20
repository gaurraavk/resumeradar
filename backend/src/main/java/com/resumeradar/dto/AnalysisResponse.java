package com.resumeradar.dto;

import java.util.List;

public class AnalysisResponse {

    private int atsScore;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;

    public AnalysisResponse() {}

    public AnalysisResponse(int atsScore, List<String> matchedKeywords, List<String> missingKeywords) {
        this.atsScore = atsScore;
        this.matchedKeywords = matchedKeywords;
        this.missingKeywords = missingKeywords;
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
}
