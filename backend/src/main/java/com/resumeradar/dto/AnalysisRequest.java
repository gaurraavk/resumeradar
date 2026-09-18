package com.resumeradar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AnalysisRequest {

    @NotBlank(message = "Resume text is required")
    @Size(min = 20, max = 50000, message = "Resume text must be between 20 and 50,000 characters")
    private String resumeText;

    @NotBlank(message = "Job description is required")
    @Size(min = 20, max = 20000, message = "Job description must be between 20 and 20,000 characters")
    private String jobDescription;

    private String jobTitle;

    public AnalysisRequest() {}

    public AnalysisRequest(String resumeText, String jobDescription, String jobTitle) {
        this.resumeText = resumeText;
        this.jobDescription = jobDescription;
        this.jobTitle = jobTitle;
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

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }
}
