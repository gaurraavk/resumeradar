package com.resumeradar.dto;

import java.util.List;

public class BestFitResponse {

    private List<BestFitResult> results;

    public BestFitResponse() {}

    public BestFitResponse(List<BestFitResult> results) {
        this.results = results;
    }

    public List<BestFitResult> getResults() {
        return results;
    }

    public void setResults(List<BestFitResult> results) {
        this.results = results;
    }

    public static class BestFitResult {
        private String title;
        private int matchScore;
        private List<String> missingKeywords;

        public BestFitResult() {}

        public BestFitResult(String title, int matchScore, List<String> missingKeywords) {
            this.title = title;
            this.matchScore = matchScore;
            this.missingKeywords = missingKeywords;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public int getMatchScore() {
            return matchScore;
        }

        public void setMatchScore(int matchScore) {
            this.matchScore = matchScore;
        }

        public List<String> getMissingKeywords() {
            return missingKeywords;
        }

        public void setMissingKeywords(List<String> missingKeywords) {
            this.missingKeywords = missingKeywords;
        }
    }
}
