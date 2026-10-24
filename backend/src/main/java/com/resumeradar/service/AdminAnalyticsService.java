package com.resumeradar.service;

import com.resumeradar.dto.AdminAnalyticsResponse;
import com.resumeradar.dto.UserProfileDto;
import com.resumeradar.model.AnalysisRecord;
import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.model.User;
import com.resumeradar.repository.AnalysisRecordRepository;
import com.resumeradar.repository.ResumeTemplateRepository;
import com.resumeradar.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsService {

    private final UserRepository userRepository;
    private final AnalysisRecordRepository analysisRecordRepository;
    private final ResumeTemplateRepository resumeTemplateRepository;

    public AdminAnalyticsService(UserRepository userRepository,
                                 AnalysisRecordRepository analysisRecordRepository,
                                 ResumeTemplateRepository resumeTemplateRepository) {
        this.userRepository = userRepository;
        this.analysisRecordRepository = analysisRecordRepository;
        this.resumeTemplateRepository = resumeTemplateRepository;
    }

    public AdminAnalyticsResponse getAnalytics() {
        long totalUsers = userRepository.count();

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        long newUsersLast7Days = userRepository.countByCreatedAtAfter(sevenDaysAgo);

        List<AnalysisRecord> allAnalyses = analysisRecordRepository.findAll();
        long totalAnalyses = allAnalyses.size();

        // 7-day trend (zero-filled days ending today)
        LocalDate today = LocalDate.now();
        Map<LocalDate, Long> dailyCounts = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            dailyCounts.put(today.minusDays(i), 0L);
        }
        for (AnalysisRecord record : allAnalyses) {
            if (record.getCreatedAt() != null) {
                LocalDate recordDate = record.getCreatedAt().toLocalDate();
                if (dailyCounts.containsKey(recordDate)) {
                    dailyCounts.put(recordDate, dailyCounts.get(recordDate) + 1);
                }
            }
        }
        List<AdminAnalyticsResponse.DailyCountDto> analysesLast7Days = dailyCounts.entrySet().stream()
                .map(e -> new AdminAnalyticsResponse.DailyCountDto(e.getKey().toString(), e.getValue()))
                .collect(Collectors.toList());

        // Average ATS Score
        double averageAtsScore = 0.0;
        if (totalAnalyses > 0) {
            double sum = allAnalyses.stream().mapToInt(AnalysisRecord::getAtsScore).sum();
            averageAtsScore = Math.round((sum / totalAnalyses) * 10.0) / 10.0;
        }

        // Score Buckets
        Map<String, Long> scoreBuckets = new LinkedHashMap<>();
        scoreBuckets.put("0-39", 0L);
        scoreBuckets.put("40-59", 0L);
        scoreBuckets.put("60-79", 0L);
        scoreBuckets.put("80-100", 0L);

        for (AnalysisRecord record : allAnalyses) {
            int score = record.getAtsScore();
            if (score <= 39) {
                scoreBuckets.put("0-39", scoreBuckets.get("0-39") + 1);
            } else if (score <= 59) {
                scoreBuckets.put("40-59", scoreBuckets.get("40-59") + 1);
            } else if (score <= 79) {
                scoreBuckets.put("60-79", scoreBuckets.get("60-79") + 1);
            } else {
                scoreBuckets.put("80-100", scoreBuckets.get("80-100") + 1);
            }
        }

        // Template Usage
        List<ResumeTemplate> dbTemplates = resumeTemplateRepository.findAll();
        Map<String, String> templateNameMap = new LinkedHashMap<>();
        templateNameMap.put("classic", "Classic");
        templateNameMap.put("modern", "Modern");
        templateNameMap.put("fresher-focus", "Fresher Focus");
        templateNameMap.put("executive", "Executive");
        for (ResumeTemplate t : dbTemplates) {
            templateNameMap.put(t.getId().toLowerCase(), t.getName());
        }

        Map<String, Long> templateCounts = new LinkedHashMap<>();
        for (String tid : templateNameMap.keySet()) {
            templateCounts.put(tid, 0L);
        }

        for (AnalysisRecord record : allAnalyses) {
            String tmpl = record.getTemplateUsed();
            if (tmpl != null && !tmpl.isBlank()) {
                String key = tmpl.trim().toLowerCase();
                templateCounts.put(key, templateCounts.getOrDefault(key, 0L) + 1);
                if (!templateNameMap.containsKey(key)) {
                    templateNameMap.put(key, tmpl);
                }
            }
        }

        List<AdminAnalyticsResponse.TemplateUsageDto> templateUsage = templateCounts.entrySet().stream()
                .map(e -> new AdminAnalyticsResponse.TemplateUsageDto(e.getKey(), templateNameMap.getOrDefault(e.getKey(), e.getKey()), e.getValue()))
                .collect(Collectors.toList());

        // Top Missing Keywords (top 10 aggregated from analysis_records.top_missing_keywords)
        Map<String, Long> keywordFrequencies = new HashMap<>();
        for (AnalysisRecord record : allAnalyses) {
            String rawKeywords = record.getTopMissingKeywords();
            if (rawKeywords != null && !rawKeywords.isBlank()) {
                String[] parts = rawKeywords.split(",");
                for (String part : parts) {
                    String kw = part.trim().toLowerCase();
                    if (!kw.isEmpty()) {
                        keywordFrequencies.put(kw, keywordFrequencies.getOrDefault(kw, 0L) + 1);
                    }
                }
            }
        }

        List<AdminAnalyticsResponse.KeywordCountDto> topMissingKeywords = keywordFrequencies.entrySet().stream()
                .sorted((a, b) -> {
                    int cmp = Long.compare(b.getValue(), a.getValue());
                    return cmp != 0 ? cmp : a.getKey().compareTo(b.getKey());
                })
                .limit(10)
                .map(e -> new AdminAnalyticsResponse.KeywordCountDto(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // Input Type Split
        long fileCount = allAnalyses.stream()
                .filter(r -> "FILE".equalsIgnoreCase(r.getInputType()))
                .count();
        long textCount = totalAnalyses - fileCount;
        AdminAnalyticsResponse.InputTypeSplitDto inputTypeSplit =
                new AdminAnalyticsResponse.InputTypeSplitDto(textCount, fileCount);

        // Recent Analyses (last 10)
        List<AnalysisRecord> top10Records = analysisRecordRepository.findTop10ByOrderByCreatedAtDesc();
        Map<Long, String> userNames = new HashMap<>();
        List<Long> userIds = top10Records.stream()
                .map(AnalysisRecord::getUserId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        if (!userIds.isEmpty()) {
            userRepository.findAllById(userIds)
                    .forEach(u -> userNames.put(u.getId(), u.getFullName()));
        }

        List<AdminAnalyticsResponse.RecentAnalysisDto> recentAnalyses = top10Records.stream()
                .map(r -> {
                    String userName = "Guest";
                    if (r.getUserId() != null && userNames.containsKey(r.getUserId())) {
                        userName = userNames.get(r.getUserId());
                    }
                    String jobTitle = (r.getJobTitle() != null && !r.getJobTitle().isBlank())
                            ? r.getJobTitle()
                            : "Target Role";
                    return new AdminAnalyticsResponse.RecentAnalysisDto(r.getCreatedAt(), jobTitle, r.getAtsScore(), userName);
                })
                .collect(Collectors.toList());

        return new AdminAnalyticsResponse(
                totalUsers,
                newUsersLast7Days,
                totalAnalyses,
                analysesLast7Days,
                averageAtsScore,
                scoreBuckets,
                templateUsage,
                topMissingKeywords,
                inputTypeSplit,
                recentAnalyses
        );
    }

    public List<UserProfileDto> getRecentUsers() {
        List<User> users = userRepository.findTop100ByOrderByCreatedAtDesc();
        return users.stream()
                .map(u -> new UserProfileDto(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getRole(),
                        u.getCreatedAt(),
                        u.getLastLoginAt()
                ))
                .collect(Collectors.toList());
    }
}
