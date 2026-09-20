package com.resumeradar.dto;

import java.util.List;

public class AnalysisFileResponse {

    private String analysisId;
    private int atsScore;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<FormattingWarning> formattingWarnings;

    public AnalysisFileResponse() {}

    public AnalysisFileResponse(String analysisId, int atsScore, List<String> matchedKeywords,
                                 List<String> missingKeywords, List<FormattingWarning> formattingWarnings) {
        this.analysisId = analysisId;
        this.atsScore = atsScore;
        this.matchedKeywords = matchedKeywords;
        this.missingKeywords = missingKeywords;
        this.formattingWarnings = formattingWarnings;
    }

    public String getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(String analysisId) {
        this.analysisId = analysisId;
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

    public List<FormattingWarning> getFormattingWarnings() {
        return formattingWarnings;
    }

    public void setFormattingWarnings(List<FormattingWarning> formattingWarnings) {
        this.formattingWarnings = formattingWarnings;
    }
}
