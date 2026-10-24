package com.resumeradar.dto;

import java.util.List;

public class JobAnalysisResponse {

    private List<String> topKeywords;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private String experienceRequired;
    private String educationRequired;

    public JobAnalysisResponse() {}

    public JobAnalysisResponse(List<String> topKeywords,
                               List<String> requiredSkills,
                               List<String> preferredSkills,
                               String experienceRequired,
                               String educationRequired) {
        this.topKeywords = topKeywords;
        this.requiredSkills = requiredSkills;
        this.preferredSkills = preferredSkills;
        this.experienceRequired = experienceRequired;
        this.educationRequired = educationRequired;
    }

    public List<String> getTopKeywords() {
        return topKeywords;
    }

    public void setTopKeywords(List<String> topKeywords) {
        this.topKeywords = topKeywords;
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public List<String> getPreferredSkills() {
        return preferredSkills;
    }

    public void setPreferredSkills(List<String> preferredSkills) {
        this.preferredSkills = preferredSkills;
    }

    public String getExperienceRequired() {
        return experienceRequired;
    }

    public void setExperienceRequired(String experienceRequired) {
        this.experienceRequired = experienceRequired;
    }

    public String getEducationRequired() {
        return educationRequired;
    }

    public void setEducationRequired(String educationRequired) {
        this.educationRequired = educationRequired;
    }
}
