package com.resumeradar.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AdminAnalyticsResponse {

    private long totalUsers;
    private long newUsersLast7Days;
    private long totalAnalyses;
    private List<DailyCountDto> analysesLast7Days;
    private double averageAtsScore;
    private Map<String, Long> scoreBuckets;
    private List<TemplateUsageDto> templateUsage;
    private List<KeywordCountDto> topMissingKeywords;
    private InputTypeSplitDto inputTypeSplit;
    private List<RecentAnalysisDto> recentAnalyses;

    public AdminAnalyticsResponse() {}

    public AdminAnalyticsResponse(long totalUsers,
                                  long newUsersLast7Days,
                                  long totalAnalyses,
                                  List<DailyCountDto> analysesLast7Days,
                                  double averageAtsScore,
                                  Map<String, Long> scoreBuckets,
                                  List<TemplateUsageDto> templateUsage,
                                  List<KeywordCountDto> topMissingKeywords,
                                  InputTypeSplitDto inputTypeSplit,
                                  List<RecentAnalysisDto> recentAnalyses) {
        this.totalUsers = totalUsers;
        this.newUsersLast7Days = newUsersLast7Days;
        this.totalAnalyses = totalAnalyses;
        this.analysesLast7Days = analysesLast7Days;
        this.averageAtsScore = averageAtsScore;
        this.scoreBuckets = scoreBuckets;
        this.templateUsage = templateUsage;
        this.topMissingKeywords = topMissingKeywords;
        this.inputTypeSplit = inputTypeSplit;
        this.recentAnalyses = recentAnalyses;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getNewUsersLast7Days() {
        return newUsersLast7Days;
    }

    public void setNewUsersLast7Days(long newUsersLast7Days) {
        this.newUsersLast7Days = newUsersLast7Days;
    }

    public long getTotalAnalyses() {
        return totalAnalyses;
    }

    public void setTotalAnalyses(long totalAnalyses) {
        this.totalAnalyses = totalAnalyses;
    }

    public List<DailyCountDto> getAnalysesLast7Days() {
        return analysesLast7Days;
    }

    public void setAnalysesLast7Days(List<DailyCountDto> analysesLast7Days) {
        this.analysesLast7Days = analysesLast7Days;
    }

    public double getAverageAtsScore() {
        return averageAtsScore;
    }

    public void setAverageAtsScore(double averageAtsScore) {
        this.averageAtsScore = averageAtsScore;
    }

    public Map<String, Long> getScoreBuckets() {
        return scoreBuckets;
    }

    public void setScoreBuckets(Map<String, Long> scoreBuckets) {
        this.scoreBuckets = scoreBuckets;
    }

    public List<TemplateUsageDto> getTemplateUsage() {
        return templateUsage;
    }

    public void setTemplateUsage(List<TemplateUsageDto> templateUsage) {
        this.templateUsage = templateUsage;
    }

    public List<KeywordCountDto> getTopMissingKeywords() {
        return topMissingKeywords;
    }

    public void setTopMissingKeywords(List<KeywordCountDto> topMissingKeywords) {
        this.topMissingKeywords = topMissingKeywords;
    }

    public InputTypeSplitDto getInputTypeSplit() {
        return inputTypeSplit;
    }

    public void setInputTypeSplit(InputTypeSplitDto inputTypeSplit) {
        this.inputTypeSplit = inputTypeSplit;
    }

    public List<RecentAnalysisDto> getRecentAnalyses() {
        return recentAnalyses;
    }

    public void setRecentAnalyses(List<RecentAnalysisDto> recentAnalyses) {
        this.recentAnalyses = recentAnalyses;
    }

    public static class DailyCountDto {
        private String date;
        private long count;

        public DailyCountDto() {}

        public DailyCountDto(String date, long count) {
            this.date = date;
            this.count = count;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public static class TemplateUsageDto {
        private String templateId;
        private String name;
        private long count;

        public TemplateUsageDto() {}

        public TemplateUsageDto(String templateId, String name, long count) {
            this.templateId = templateId;
            this.name = name;
            this.count = count;
        }

        public String getTemplateId() {
            return templateId;
        }

        public void setTemplateId(String templateId) {
            this.templateId = templateId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public static class KeywordCountDto {
        private String keyword;
        private long count;

        public KeywordCountDto() {}

        public KeywordCountDto(String keyword, long count) {
            this.keyword = keyword;
            this.count = count;
        }

        public String getKeyword() {
            return keyword;
        }

        public void setKeyword(String keyword) {
            this.keyword = keyword;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public static class InputTypeSplitDto {
        private long text;
        private long file;

        public InputTypeSplitDto() {}

        public InputTypeSplitDto(long text, long file) {
            this.text = text;
            this.file = file;
        }

        public long getText() {
            return text;
        }

        public void setText(long text) {
            this.text = text;
        }

        public long getFile() {
            return file;
        }

        public void setFile(long file) {
            this.file = file;
        }
    }

    public static class RecentAnalysisDto {
        private LocalDateTime date;
        private String jobTitle;
        private int score;
        private String userName;

        public RecentAnalysisDto() {}

        public RecentAnalysisDto(LocalDateTime date, String jobTitle, int score, String userName) {
            this.date = date;
            this.jobTitle = jobTitle;
            this.score = score;
            this.userName = userName;
        }

        public LocalDateTime getDate() {
            return date;
        }

        public void setDate(LocalDateTime date) {
            this.date = date;
        }

        public String getJobTitle() {
            return jobTitle;
        }

        public void setJobTitle(String jobTitle) {
            this.jobTitle = jobTitle;
        }

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }
    }
}
