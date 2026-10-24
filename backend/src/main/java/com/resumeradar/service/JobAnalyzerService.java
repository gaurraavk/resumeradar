package com.resumeradar.service;

import com.resumeradar.dto.JobAnalysisResponse;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class JobAnalyzerService {

    private final AtsKeywordService atsKeywordService;

    private static final Pattern REQUIRED_PATTERN = Pattern.compile(
            "(?i)\\b(must\\s+have|requirements?|required|qualifications?|minimum|mandatory|what\\s+you(?:'ll)?\\s+need)\\b"
    );

    private static final Pattern PREFERRED_PATTERN = Pattern.compile(
            "(?i)\\b(preferred|nice\\s+to\\s+have|plus|bonus|good\\s+to\\s+have|desired|additional|optional|assets?)\\b"
    );

    private static final List<Pattern> EXPERIENCE_PATTERNS = List.of(
            Pattern.compile("(?i)\\b(\\d+\\s*\\+?\\s*(?:to|-)\\s*\\d+\\s*\\+?\\s*years?(?:\\s+of\\s+experience)?)\\b"),
            Pattern.compile("(?i)\\b(\\d+\\s*\\+?\\s*years?(?:\\s+of\\s+experience)?)\\b"),
            Pattern.compile("(?i)\\b((?:minimum|at\\s+least)\\s+\\d+\\s*years?(?:\\s+of\\s+experience)?)\\b"),
            Pattern.compile("(?i)\\b((?:one|two|three|four|five|six|seven|eight|nine|ten)\\s*\\+?\\s*years?(?:\\s+of\\s+experience)?)\\b")
    );

    public JobAnalyzerService(AtsKeywordService atsKeywordService) {
        this.atsKeywordService = atsKeywordService;
    }

    public JobAnalysisResponse analyzeJob(String jobDescription) {
        if (jobDescription == null || jobDescription.isBlank()) {
            return new JobAnalysisResponse(
                    Collections.emptyList(),
                    Collections.emptyList(),
                    Collections.emptyList(),
                    null,
                    null
            );
        }

        // 1. Top keywords reused directly from AtsKeywordService
        Set<String> extracted = atsKeywordService.extractKeywords(jobDescription);
        List<String> topKeywords = new ArrayList<>(extracted);

        // 2. Classify into required vs preferred skills
        Set<String> requiredSet = new LinkedHashSet<>();
        Set<String> preferredSet = new LinkedHashSet<>();

        classifySkills(jobDescription, topKeywords, requiredSet, preferredSet);

        List<String> requiredSkills = new ArrayList<>(requiredSet);
        List<String> preferredSkills = new ArrayList<>(preferredSet);

        // 3. Extract experience required
        String experienceRequired = extractExperience(jobDescription);

        // 4. Extract education required
        String educationRequired = extractEducation(jobDescription);

        return new JobAnalysisResponse(
                topKeywords,
                requiredSkills,
                preferredSkills,
                experienceRequired,
                educationRequired
        );
    }

    private static final Pattern RESET_PATTERN = Pattern.compile(
            "(?i)\\b(education|about\\s+(?:us|the\\s+company|the\\s+role)|benefits|perks|compensation|salary|who\\s+we\\s+are)\\b"
    );

    private void classifySkills(String jobText, List<String> topKeywords, Set<String> requiredSet, Set<String> preferredSet) {
        // Split text into chunks by sentence boundaries or newlines
        String[] chunks = jobText.split("(?<=[.!?\\n;])\\s+");
        int currentContext = 0; // 0 = uncategorized, 1 = required, 2 = preferred

        for (String chunk : chunks) {
            String trimmed = chunk.trim();
            if (trimmed.isEmpty()) continue;

            boolean hasReq = REQUIRED_PATTERN.matcher(trimmed).find();
            boolean hasPref = PREFERRED_PATTERN.matcher(trimmed).find();
            boolean hasReset = RESET_PATTERN.matcher(trimmed).find();

            // If a chunk has both required and preferred, classify based on proximity
            if (hasReq && hasPref) {
                String normalizedChunk = " " + atsKeywordService.normalizeText(trimmed) + " ";
                for (String kw : topKeywords) {
                    if (isKeywordInLine(normalizedChunk, kw)) {
                        int kwIdx = trimmed.toLowerCase().indexOf(kw.toLowerCase());
                        int reqDist = findMinDistance(trimmed, REQUIRED_PATTERN, kwIdx);
                        int prefDist = findMinDistance(trimmed, PREFERRED_PATTERN, kwIdx);
                        if (reqDist <= prefDist) {
                            requiredSet.add(kw);
                        } else {
                            preferredSet.add(kw);
                        }
                    }
                }
                continue;
            }

            if (hasReq) {
                currentContext = 1;
            } else if (hasPref) {
                currentContext = 2;
            } else if (hasReset) {
                currentContext = 0;
            }

            if (currentContext != 0) {
                String normalizedChunk = " " + atsKeywordService.normalizeText(trimmed) + " ";
                for (String kw : topKeywords) {
                    if (isKeywordInLine(normalizedChunk, kw)) {
                        if (currentContext == 1) {
                            requiredSet.add(kw);
                        } else if (currentContext == 2) {
                            preferredSet.add(kw);
                        }
                    }
                }
            }
        }

        // Skills marked required take precedence over preferred
        preferredSet.removeAll(requiredSet);
    }

    private int findMinDistance(String text, Pattern pattern, int targetIndex) {
        Matcher m = pattern.matcher(text);
        int minDist = Integer.MAX_VALUE;
        while (m.find()) {
            int dist = Math.abs(m.start() - targetIndex);
            if (dist < minDist) {
                minDist = dist;
            }
        }
        return minDist;
    }

    private boolean isKeywordInLine(String normalizedLine, String keyword) {
        if (keyword.contains(" ")) {
            return normalizedLine.contains(" " + keyword + " ");
        }
        Pattern pattern = Pattern.compile("(?<![a-z0-9])" + Pattern.quote(keyword) + "(?![a-z0-9])");
        return pattern.matcher(normalizedLine).find();
    }

    private String extractExperience(String text) {
        for (Pattern p : EXPERIENCE_PATTERNS) {
            Matcher m = p.matcher(text);
            if (m.find()) {
                String match = m.group(1).trim();
                // Clean up trailing whitespace and normalize case
                return Character.toUpperCase(match.charAt(0)) + match.substring(1);
            }
        }
        return null;
    }

    private String extractEducation(String text) {
        String lower = text.toLowerCase();

        if (lower.contains("ph.d") || lower.contains("phd") || lower.contains("doctorate")) {
            return "Ph.D. / Doctorate";
        }
        if (lower.contains("master's") || lower.contains("masters degree") || lower.contains("master degree") || lower.contains("mca") || lower.contains("m.s.") || lower.contains("m.tech")) {
            return "Master's degree";
        }
        if (lower.contains("bachelor's") || lower.contains("bachelors degree") || lower.contains("bachelor degree") || lower.contains("b.tech") || lower.contains("btech") || lower.contains("b.e.") || lower.contains("bca") || lower.contains("b.s.")) {
            return "Bachelor's degree";
        }
        if (lower.contains("associate's") || lower.contains("associates degree") || lower.contains("associate degree")) {
            return "Associate degree";
        }
        if (Pattern.compile("(?i)\\bdegree\\s+in\\s+[a-z\\s]+\\b").matcher(text).find()) {
            return "Degree required";
        }
        if (lower.contains("degree")) {
            return "Degree required";
        }

        return null;
    }
}
