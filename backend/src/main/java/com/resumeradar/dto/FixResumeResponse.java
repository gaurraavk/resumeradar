package com.resumeradar.dto;

import java.util.List;

public class FixResumeResponse {

    private List<String> fixesApplied;
    private String downloadUrl;

    public FixResumeResponse() {}

    public FixResumeResponse(List<String> fixesApplied, String downloadUrl) {
        this.fixesApplied = fixesApplied;
        this.downloadUrl = downloadUrl;
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
