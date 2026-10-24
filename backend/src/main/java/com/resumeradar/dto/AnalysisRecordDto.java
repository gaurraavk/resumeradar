package com.resumeradar.dto;

import java.time.LocalDateTime;

public class AnalysisRecordDto {

    private Long id;
    private String analysisId;
    private String jobTitle;
    private int atsScore;
    private int matchedCount;
    private int missingCount;
    private String topMissingKeywords;
    private String inputType;
    private String templateUsed;
    private LocalDateTime createdAt;

    public AnalysisRecordDto() {}

    public AnalysisRecordDto(Long id,
                             String analysisId,
                             String jobTitle,
                             int atsScore,
                             int matchedCount,
                             int missingCount,
                             String topMissingKeywords,
                             String inputType,
                             String templateUsed,
                             LocalDateTime createdAt) {
        this.id = id;
        this.analysisId = analysisId;
        this.jobTitle = jobTitle;
        this.atsScore = atsScore;
        this.matchedCount = matchedCount;
        this.missingCount = missingCount;
        this.topMissingKeywords = topMissingKeywords;
        this.inputType = inputType;
        this.templateUsed = templateUsed;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(String analysisId) {
        this.analysisId = analysisId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public int getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(int atsScore) {
        this.atsScore = atsScore;
    }

    public int getMatchedCount() {
        return matchedCount;
    }

    public void setMatchedCount(int matchedCount) {
        this.matchedCount = matchedCount;
    }

    public int getMissingCount() {
        return missingCount;
    }

    public void setMissingCount(int missingCount) {
        this.missingCount = missingCount;
    }

    public String getTopMissingKeywords() {
        return topMissingKeywords;
    }

    public void setTopMissingKeywords(String topMissingKeywords) {
        this.topMissingKeywords = topMissingKeywords;
    }

    public String getInputType() {
        return inputType;
    }

    public void setInputType(String inputType) {
        this.inputType = inputType;
    }

    public String getTemplateUsed() {
        return templateUsed;
    }

    public void setTemplateUsed(String templateUsed) {
        this.templateUsed = templateUsed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
