package com.resumeradar.dto;

import jakarta.validation.constraints.NotBlank;

public class CompareVersionsRequest {

    @NotBlank(message = "resumeTextA is required")
    private String resumeTextA;

    @NotBlank(message = "resumeTextB is required")
    private String resumeTextB;

    @NotBlank(message = "jobDescription is required")
    private String jobDescription;

    public CompareVersionsRequest() {}

    public CompareVersionsRequest(String resumeTextA, String resumeTextB, String jobDescription) {
        this.resumeTextA = resumeTextA;
        this.resumeTextB = resumeTextB;
        this.jobDescription = jobDescription;
    }

    public String getResumeTextA() {
        return resumeTextA;
    }

    public void setResumeTextA(String resumeTextA) {
        this.resumeTextA = resumeTextA;
    }

    public String getResumeTextB() {
        return resumeTextB;
    }

    public void setResumeTextB(String resumeTextB) {
        this.resumeTextB = resumeTextB;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
}
