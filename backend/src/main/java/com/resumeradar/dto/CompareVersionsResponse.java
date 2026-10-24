package com.resumeradar.dto;

import java.util.List;

public class CompareVersionsResponse {

    private AtsResult resultA;
    private AtsResult resultB;
    private List<String> newlyAddedKeywords;
    private List<String> stillMissingKeywords;
    private String winner; // "A", "B", or "tie"

    public CompareVersionsResponse() {}

    public CompareVersionsResponse(AtsResult resultA,
                                   AtsResult resultB,
                                   List<String> newlyAddedKeywords,
                                   List<String> stillMissingKeywords,
                                   String winner) {
        this.resultA = resultA;
        this.resultB = resultB;
        this.newlyAddedKeywords = newlyAddedKeywords;
        this.stillMissingKeywords = stillMissingKeywords;
        this.winner = winner;
    }

    public AtsResult getResultA() {
        return resultA;
    }

    public void setResultA(AtsResult resultA) {
        this.resultA = resultA;
    }

    public AtsResult getResultB() {
        return resultB;
    }

    public void setResultB(AtsResult resultB) {
        this.resultB = resultB;
    }

    public List<String> getNewlyAddedKeywords() {
        return newlyAddedKeywords;
    }

    public void setNewlyAddedKeywords(List<String> newlyAddedKeywords) {
        this.newlyAddedKeywords = newlyAddedKeywords;
    }

    public List<String> getStillMissingKeywords() {
        return stillMissingKeywords;
    }

    public void setStillMissingKeywords(List<String> stillMissingKeywords) {
        this.stillMissingKeywords = stillMissingKeywords;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }
}
