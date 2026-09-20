package com.resumeradar.dto;

import java.util.List;

public class BestFitRequest {

    private String resumeText;
    private List<JobDescriptionEntry> jobDescriptions;

    public BestFitRequest() {}

    public BestFitRequest(String resumeText, List<JobDescriptionEntry> jobDescriptions) {
        this.resumeText = resumeText;
        this.jobDescriptions = jobDescriptions;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public List<JobDescriptionEntry> getJobDescriptions() {
        return jobDescriptions;
    }

    public void setJobDescriptions(List<JobDescriptionEntry> jobDescriptions) {
        this.jobDescriptions = jobDescriptions;
    }

    public static class JobDescriptionEntry {
        private String title;
        private String text;

        public JobDescriptionEntry() {}

        public JobDescriptionEntry(String title, String text) {
            this.title = title;
            this.text = text;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
