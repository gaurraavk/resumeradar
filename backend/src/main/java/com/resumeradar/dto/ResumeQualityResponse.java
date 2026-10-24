package com.resumeradar.dto;

import java.util.List;

public class ResumeQualityResponse {

    private int qualityScore;
    private boolean hasContactInfo;
    private int wordCount;
    private String estimatedLength;
    private int bulletPointCount;
    private int actionVerbUsageCount;
    private int measurableAchievementCount;
    private List<String> longParagraphWarnings;
    private List<String> missingSections;
    private List<String> improvementAreas;

    public ResumeQualityResponse() {}

    public ResumeQualityResponse(int qualityScore,
                                 boolean hasContactInfo,
                                 int wordCount,
                                 String estimatedLength,
                                 int bulletPointCount,
                                 int actionVerbUsageCount,
                                 int measurableAchievementCount,
                                 List<String> longParagraphWarnings,
                                 List<String> missingSections,
                                 List<String> improvementAreas) {
        this.qualityScore = qualityScore;
        this.hasContactInfo = hasContactInfo;
        this.wordCount = wordCount;
        this.estimatedLength = estimatedLength;
        this.bulletPointCount = bulletPointCount;
        this.actionVerbUsageCount = actionVerbUsageCount;
        this.measurableAchievementCount = measurableAchievementCount;
        this.longParagraphWarnings = longParagraphWarnings;
        this.missingSections = missingSections;
        this.improvementAreas = improvementAreas;
    }

    public int getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(int qualityScore) {
        this.qualityScore = qualityScore;
    }

    public boolean isHasContactInfo() {
        return hasContactInfo;
    }

    public void setHasContactInfo(boolean hasContactInfo) {
        this.hasContactInfo = hasContactInfo;
    }

    public int getWordCount() {
        return wordCount;
    }

    public void setWordCount(int wordCount) {
        this.wordCount = wordCount;
    }

    public String getEstimatedLength() {
        return estimatedLength;
    }

    public void setEstimatedLength(String estimatedLength) {
        this.estimatedLength = estimatedLength;
    }

    public int getBulletPointCount() {
        return bulletPointCount;
    }

    public void setBulletPointCount(int bulletPointCount) {
        this.bulletPointCount = bulletPointCount;
    }

    public int getActionVerbUsageCount() {
        return actionVerbUsageCount;
    }

    public void setActionVerbUsageCount(int actionVerbUsageCount) {
        this.actionVerbUsageCount = actionVerbUsageCount;
    }

    public int getMeasurableAchievementCount() {
        return measurableAchievementCount;
    }

    public void setMeasurableAchievementCount(int measurableAchievementCount) {
        this.measurableAchievementCount = measurableAchievementCount;
    }

    public List<String> getLongParagraphWarnings() {
        return longParagraphWarnings;
    }

    public void setLongParagraphWarnings(List<String> longParagraphWarnings) {
        this.longParagraphWarnings = longParagraphWarnings;
    }

    public List<String> getMissingSections() {
        return missingSections;
    }

    public void setMissingSections(List<String> missingSections) {
        this.missingSections = missingSections;
    }

    public List<String> getImprovementAreas() {
        return improvementAreas;
    }

    public void setImprovementAreas(List<String> improvementAreas) {
        this.improvementAreas = improvementAreas;
    }
}
