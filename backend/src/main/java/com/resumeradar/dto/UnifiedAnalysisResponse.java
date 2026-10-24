package com.resumeradar.dto;

public class UnifiedAnalysisResponse {

    private AtsResult atsMatch;
    private ResumeQualityResponse resumeQuality;
    private JobAnalysisResponse jobRequirements;
    private String overallSummary;

    public UnifiedAnalysisResponse() {}

    public UnifiedAnalysisResponse(AtsResult atsMatch,
                                   ResumeQualityResponse resumeQuality,
                                   JobAnalysisResponse jobRequirements,
                                   String overallSummary) {
        this.atsMatch = atsMatch;
        this.resumeQuality = resumeQuality;
        this.jobRequirements = jobRequirements;
        this.overallSummary = overallSummary;
    }

    public AtsResult getAtsMatch() {
        return atsMatch;
    }

    public void setAtsMatch(AtsResult atsMatch) {
        this.atsMatch = atsMatch;
    }

    public ResumeQualityResponse getResumeQuality() {
        return resumeQuality;
    }

    public void setResumeQuality(ResumeQualityResponse resumeQuality) {
        this.resumeQuality = resumeQuality;
    }

    public JobAnalysisResponse getJobRequirements() {
        return jobRequirements;
    }

    public void setJobRequirements(JobAnalysisResponse jobRequirements) {
        this.jobRequirements = jobRequirements;
    }

    public String getOverallSummary() {
        return overallSummary;
    }

    public void setOverallSummary(String overallSummary) {
        this.overallSummary = overallSummary;
    }
}
