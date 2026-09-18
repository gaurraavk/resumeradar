package com.resumeradar.dto;

import java.util.List;

public class AiCritique {

    private String overallReview;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;

    public AiCritique() {}

    public AiCritique(String overallReview, List<String> strengths, List<String> weaknesses, List<String> suggestions) {
        this.overallReview = overallReview;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.suggestions = suggestions;
    }

    public String getOverallReview() {
        return overallReview;
    }

    public void setOverallReview(String overallReview) {
        this.overallReview = overallReview;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}
