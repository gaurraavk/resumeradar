package com.resumeradar.dto;

import java.util.ArrayList;
import java.util.List;

public class AnalysisResponse {

    private String analysisId;
    private int atsScore;
    private List<String> matchedKeywords = new ArrayList<>();
    private List<String> missingKeywords = new ArrayList<>();
    private List<FormattingWarning> formattingWarnings = new ArrayList<>();
    private String formattingNote;

    // Feature 1: Repeated keyword stuffing warnings
    private List<String> repeatedKeywordWarnings = new ArrayList<>();

    // Feature 2: Weak sentence metrics and examples
    private int weakSentenceCount;
    private int totalSentenceCount;
    private List<String> weakSentenceExamples = new ArrayList<>();

    // Feature 3: Missing standard resume sections
    private List<String> missingSections = new ArrayList<>();

    public AnalysisResponse() {}

    public AnalysisResponse(int atsScore, List<String> matchedKeywords, List<String> missingKeywords) {
        this.atsScore = atsScore;
        this.matchedKeywords = matchedKeywords != null ? matchedKeywords : new ArrayList<>();
        this.missingKeywords = missingKeywords != null ? missingKeywords : new ArrayList<>();
        this.formattingWarnings = new ArrayList<>();
    }

    public AnalysisResponse(String analysisId, int atsScore, List<String> matchedKeywords,
                            List<String> missingKeywords, List<FormattingWarning> formattingWarnings,
                            String formattingNote) {
        this.analysisId = analysisId;
        this.atsScore = atsScore;
        this.matchedKeywords = matchedKeywords != null ? matchedKeywords : new ArrayList<>();
        this.missingKeywords = missingKeywords != null ? missingKeywords : new ArrayList<>();
        this.formattingWarnings = formattingWarnings != null ? formattingWarnings : new ArrayList<>();
        this.formattingNote = formattingNote;
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

    public String getFormattingNote() {
        return formattingNote;
    }

    public void setFormattingNote(String formattingNote) {
        this.formattingNote = formattingNote;
    }

    public List<String> getRepeatedKeywordWarnings() {
        return repeatedKeywordWarnings;
    }

    public void setRepeatedKeywordWarnings(List<String> repeatedKeywordWarnings) {
        this.repeatedKeywordWarnings = repeatedKeywordWarnings != null ? repeatedKeywordWarnings : new ArrayList<>();
    }

    public int getWeakSentenceCount() {
        return weakSentenceCount;
    }

    public void setWeakSentenceCount(int weakSentenceCount) {
        this.weakSentenceCount = weakSentenceCount;
    }

    public int getTotalSentenceCount() {
        return totalSentenceCount;
    }

    public void setTotalSentenceCount(int totalSentenceCount) {
        this.totalSentenceCount = totalSentenceCount;
    }

    public List<String> getWeakSentenceExamples() {
        return weakSentenceExamples;
    }

    public void setWeakSentenceExamples(List<String> weakSentenceExamples) {
        this.weakSentenceExamples = weakSentenceExamples != null ? weakSentenceExamples : new ArrayList<>();
    }

    public List<String> getMissingSections() {
        return missingSections;
    }

    public void setMissingSections(List<String> missingSections) {
        this.missingSections = missingSections != null ? missingSections : new ArrayList<>();
    }
}
