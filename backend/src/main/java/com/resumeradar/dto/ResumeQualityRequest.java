package com.resumeradar.dto;

import jakarta.validation.constraints.NotBlank;

public class ResumeQualityRequest {

    @NotBlank(message = "resumeText is required")
    private String resumeText;

    public ResumeQualityRequest() {}

    public ResumeQualityRequest(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }
}
