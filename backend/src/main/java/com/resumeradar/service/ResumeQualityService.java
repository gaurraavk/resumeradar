package com.resumeradar.service;

import com.resumeradar.dto.ResumeQualityResponse;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeQualityService {

    private final AtsKeywordService atsKeywordService;
    private final ResumeFixService resumeFixService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "(?i)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "(?i)(\\+?\\d[\\d\\s\\-\\(\\).]{7,}\\d|\\b\\d{3}[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b|phone|tel:|mobile)"
    );

    private static final Pattern METRIC_PATTERN = Pattern.compile(
            "(?i)\\b(\\$\\d[\\d,]*(?:\\.\\d+)?|\\d+(?:\\.\\d+)?%|\\d+\\+?\\s*(?:x|percent|users|customers|million|billion|k|ms|seconds?|times|pts))\\b|(?<![a-z0-9])\\d+(?![a-z0-9])"
    );

    private static final Pattern BULLET_START_PATTERN = Pattern.compile(
            "^\\s*[-*•–—]\\s*"
    );

    // Common strong action verbs to supplement action-verbs.json values
    private static final Set<String> CORE_STRONG_VERBS = Set.of(
            "developed", "contributed", "built", "managed", "executed", "leveraged",
            "directed", "supported", "participated", "handled", "oversaw", "achieved",
            "orchestrated", "assembled", "established", "devised", "collaborated",
            "communicated", "led", "administered", "served", "acquired", "demonstrated",
            "engineered", "architected", "designed", "implemented", "spearheaded",
            "created", "optimized", "reduced", "increased", "automated", "mentored",
            "delivered", "resolved", "launched", "streamlined", "transformed"
    );

    public ResumeQualityService(AtsKeywordService atsKeywordService, ResumeFixService resumeFixService) {
        this.atsKeywordService = atsKeywordService;
        this.resumeFixService = resumeFixService;
    }

    public ResumeQualityResponse analyzeQuality(String resumeText) {
        if (resumeText == null || resumeText.isBlank()) {
            return new ResumeQualityResponse(
                    0,
                    false,
                    0,
                    "Too short",
                    0,
                    0,
                    0,
                    Collections.emptyList(),
                    atsKeywordService.detectMissingSections(""),
                    List.of("Resume text is empty. Please paste or upload your resume.")
            );
        }

        // 1. Contact Information
        boolean hasContactInfo = EMAIL_PATTERN.matcher(resumeText).find() || PHONE_PATTERN.matcher(resumeText).find();

        // 2. Word count and estimated length
        String[] words = resumeText.trim().split("\\s+");
        int wordCount = words.length;
        String estimatedLength;
        if (wordCount < 300) {
            estimatedLength = "Too short";
        } else if (wordCount <= 700) {
            estimatedLength = "One page";
        } else {
            estimatedLength = "Too long";
        }

        // 3. Bullet points and Action verbs
        Set<String> strongVerbs = new HashSet<>(CORE_STRONG_VERBS);
        if (resumeFixService != null) {
            for (String val : resumeFixService.getStrongVerbs()) {
                String clean = val.toLowerCase().replaceAll("[^a-z]", " ").trim().split("\\s+")[0];
                if (!clean.isEmpty()) {
                    strongVerbs.add(clean);
                }
            }
        }

        int bulletPointCount = 0;
        int actionVerbUsageCount = 0;
        List<String> longParagraphWarnings = new ArrayList<>();

        String[] lines = resumeText.split("\r?\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) continue;

            Matcher bulletMatcher = BULLET_START_PATTERN.matcher(trimmed);
            if (bulletMatcher.find()) {
                bulletPointCount++;
                String bulletContent = trimmed.substring(bulletMatcher.end()).trim();
                String firstWord = bulletContent.split("\\s+")[0].toLowerCase().replaceAll("[^a-z]", "");
                if (strongVerbs.contains(firstWord)) {
                    actionVerbUsageCount++;
                }
            } else {
                // Non-bullet line: check if it's an overly long text paragraph
                String[] pWords = trimmed.split("\\s+");
                if (pWords.length > 35) {
                    String snippet = trimmed.length() > 65 ? trimmed.substring(0, 62) + "..." : trimmed;
                    longParagraphWarnings.add("Paragraph with " + pWords.length + " words is too dense: \"" + snippet + "\". Consider breaking into bullet points.");
                }
            }
        }

        // 4. Measurable achievements (sentences containing numbers, percentages, metrics)
        int measurableAchievementCount = countMeasurableAchievements(resumeText);

        // 5. Missing sections (REUSING existing AtsKeywordService logic)
        List<String> missingSections = atsKeywordService.detectMissingSections(resumeText);

        // 6. Quality Score (Documented weighted calculation, 0-100)
        /*
         * Quality Score Weighting Choices (Total: 100 points):
         * - Contact Info (10 pts): 10 if present, 0 if missing.
         * - Length / Word Count (15 pts): 15 for "One page" (300-700 words), 5 if "Too short", 8 if "Too long".
         * - Bullet Point Density (20 pts): min(20, bulletPointCount * 2) (10+ bullets achieves full marks).
         * - Action Verb Openings (20 pts): min(20, actionVerbUsageCount * 3) (7+ strong verbs achieves full marks).
         * - Measurable Metrics (15 pts): min(15, measurableAchievementCount * 4) (4+ metrics achieves full marks).
         * - Section Structure (20 pts): 20 base, minus 4 per missing standard section (min 0).
         */
        int contactScore = hasContactInfo ? 10 : 0;

        int lengthScore = 5;
        if ("One page".equals(estimatedLength)) {
            lengthScore = 15;
        } else if ("Too long".equals(estimatedLength)) {
            lengthScore = 8;
        }

        int bulletScore = Math.min(20, bulletPointCount * 2);
        int verbScore = Math.min(20, actionVerbUsageCount * 3);
        int metricScore = Math.min(15, measurableAchievementCount * 4);
        int sectionScore = Math.max(0, 20 - (missingSections.size() * 4));

        int qualityScore = contactScore + lengthScore + bulletScore + verbScore + metricScore + sectionScore;
        qualityScore = Math.min(100, Math.max(0, qualityScore));

        // 7. Improvement Areas
        List<String> improvementAreas = new ArrayList<>();
        if (!hasContactInfo) {
            improvementAreas.add("Add clear contact information (email address and phone number)");
        }
        if ("Too short".equals(estimatedLength)) {
            improvementAreas.add("Expand your resume content (currently under 300 words)");
        } else if ("Too long".equals(estimatedLength)) {
            improvementAreas.add("Condense your resume content to 1-2 pages (currently over 700 words)");
        }
        if (bulletPointCount < 6) {
            improvementAreas.add("Structure work experience and project accomplishments into concise bullet points");
        }
        if (actionVerbUsageCount < 4) {
            improvementAreas.add("Start bullet points with strong action verbs (e.g. 'Engineered', 'Orchestrated', 'Built')");
        }
        if (measurableAchievementCount < 2) {
            improvementAreas.add("Add measurable results and metrics (e.g. %, revenue, performance gains, team size)");
        }
        for (String section : missingSections) {
            improvementAreas.add("Add the '" + section + "' section to meet standard ATS formatting");
        }
        if (!longParagraphWarnings.isEmpty()) {
            improvementAreas.add("Break dense paragraphs into readable bullet points");
        }
        if (improvementAreas.isEmpty()) {
            improvementAreas.add("Resume meets high standards across all structure, verb, and metric guidelines");
        }

        return new ResumeQualityResponse(
                qualityScore,
                hasContactInfo,
                wordCount,
                estimatedLength,
                bulletPointCount,
                actionVerbUsageCount,
                measurableAchievementCount,
                longParagraphWarnings,
                missingSections,
                improvementAreas
        );
    }

    private int countMeasurableAchievements(String text) {
        String[] lines = text.split("\r?\n");
        int count = 0;
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() < 10) continue;
            // Check if sentence/line contains numbers or metric indicators
            if (METRIC_PATTERN.matcher(trimmed).find()) {
                count++;
            }
        }
        return count;
    }
}
