package com.resumeradar.dto;

import java.util.List;

public class FixResumeResponse {

    private int originalScore;
    private int improvedScore;
    private List<String> fixesApplied;
    private String downloadUrl;

    public FixResumeResponse() {}

    public FixResumeResponse(List<String> fixesApplied, String downloadUrl) {
        this.fixesApplied = fixesApplied;
        this.downloadUrl = downloadUrl;
    }

    public FixResumeResponse(int originalScore, int improvedScore, List<String> fixesApplied, String downloadUrl) {
        this.originalScore = originalScore;
        this.improvedScore = improvedScore;
        this.fixesApplied = fixesApplied;
        this.downloadUrl = downloadUrl;
    }

    public int getOriginalScore() {
        return originalScore;
    }

    public void setOriginalScore(int originalScore) {
        this.originalScore = originalScore;
    }

    public int getImprovedScore() {
        return improvedScore;
    }

    public void setImprovedScore(int improvedScore) {
        this.improvedScore = improvedScore;
    }

    public List<String> getFixesApplied() {
        return fixesApplied;
    }

    public void setFixesApplied(List<String> fixesApplied) {
        this.fixesApplied = fixesApplied;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }
}
