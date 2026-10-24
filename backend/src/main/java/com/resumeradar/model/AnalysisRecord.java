package com.resumeradar.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_records")
public class AnalysisRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "analysis_id", nullable = false)
    private String analysisId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "ats_score", nullable = false)
    private int atsScore;

    @Column(name = "matched_count", nullable = false)
    private int matchedCount;

    @Column(name = "missing_count", nullable = false)
    private int missingCount;

    @Column(name = "top_missing_keywords", length = 255)
    private String topMissingKeywords;

    @Column(name = "input_type", length = 10, nullable = false)
    private String inputType; // "TEXT" or "FILE"

    @Column(name = "template_used", length = 64)
    private String templateUsed;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public AnalysisRecord() {}

    public AnalysisRecord(String analysisId,
                          Long userId,
                          String jobTitle,
                          int atsScore,
                          int matchedCount,
                          int missingCount,
                          String topMissingKeywords,
                          String inputType,
                          LocalDateTime createdAt) {
        this.analysisId = analysisId;
        this.userId = userId;
        this.jobTitle = jobTitle;
        this.atsScore = atsScore;
        this.matchedCount = matchedCount;
        this.missingCount = missingCount;
        this.topMissingKeywords = topMissingKeywords;
        this.inputType = inputType;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
