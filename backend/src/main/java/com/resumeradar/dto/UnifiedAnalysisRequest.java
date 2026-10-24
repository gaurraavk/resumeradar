package com.resumeradar.dto;

import jakarta.validation.constraints.NotBlank;

public class UnifiedAnalysisRequest {

    @NotBlank(message = "resumeText is required")
    private String resumeText;

    @NotBlank(message = "jobDescription is required")
    private String jobDescription;

    public UnifiedAnalysisRequest() {}

    public UnifiedAnalysisRequest(String resumeText, String jobDescription) {
        this.resumeText = resumeText;
        this.jobDescription = jobDescription;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
}
