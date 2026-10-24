package com.resumeradar.dto;

import jakarta.validation.constraints.NotBlank;

public class JobAnalysisRequest {

    @NotBlank(message = "jobDescription is required")
    private String jobDescription;

    public JobAnalysisRequest() {}

    public JobAnalysisRequest(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
}
