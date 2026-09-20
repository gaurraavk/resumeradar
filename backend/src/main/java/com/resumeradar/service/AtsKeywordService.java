package com.resumeradar.service;

import com.resumeradar.dto.AtsResult;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AtsKeywordService {

    private static final Set<String> STOP_WORDS = Set.of(
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
            "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can",
            "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
            "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
            "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
            "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
            "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
            "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
            "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
            "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
            "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to",
            "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
            "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
            "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
            "you've", "your", "yours", "yourself", "yourselves", "will", "shall", "must", "may", "might", "etc",
            "role", "responsibilities", "requirements", "qualifications", "experience", "looking", "candidate",
            "candidates", "years", "year", "team", "work", "working", "opportunity", "company", "position",
            "seeking", "experienced", "skills", "ability", "knowledge"
    );

    // Common multi-word technical and professional phrases to recognize
    private static final List<String> KNOWN_PHRASES = List.of(
            "machine learning", "deep learning", "artificial intelligence", "data science",
            "spring boot", "rest api", "restful api", "rest apis", "ci/cd", "ci cd",
            "continuous integration", "continuous deployment", "microservices architecture",
            "cloud computing", "amazon web services", "google cloud platform", "microsoft azure",
            "test driven development", "unit testing", "integration testing", "agile methodology",
            "scrum master", "product management", "system design", "distributed systems",
            "object oriented programming", "front end", "back end", "full stack", "data engineering",
            "relational database", "nosql database", "version control", "pull request", "code review"
    );

    public AtsResult analyzeKeywords(String resumeText, String jobDescription) {
        if (resumeText == null) resumeText = "";
        if (jobDescription == null) jobDescription = "";

        String normalizedResume = normalizeText(resumeText);
        String normalizedJob = normalizeText(jobDescription);

        // 1. Extract significant keywords & phrases from Job Description
        Set<String> jobKeywords = extractSignificantKeywords(jobDescription, normalizedJob);

        if (jobKeywords.isEmpty()) {
            return new AtsResult(100, Collections.emptyList(), Collections.emptyList());
        }

        // 2. Cross-reference each job keyword in the resume text
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String keyword : jobKeywords) {
            if (isKeywordPresent(normalizedResume, keyword)) {
                matched.add(keyword);
            } else {
                missing.add(keyword);
            }
        }

        Collections.sort(matched);
        Collections.sort(missing);

        // 3. Compute deterministic ATS Score
        int total = jobKeywords.size();
        int matchedCount = matched.size();
        int score = (int) Math.round(((double) matchedCount / total) * 100.0);
        score = Math.min(100, Math.max(0, score));

        return new AtsResult(score, matched, missing);
    }

    private String normalizeText(String text) {
        return text.toLowerCase()
                .replaceAll("[^a-z0-9#+./\\-\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private Set<String> extractSignificantKeywords(String rawJobText, String normalizedJob) {
        Set<String> keywords = new LinkedHashSet<>();

        // Check for known multi-word phrases first
        for (String phrase : KNOWN_PHRASES) {
            if (normalizedJob.contains(phrase)) {
                keywords.add(phrase);
            }
        }

        // Extract individual tokens
        Pattern tokenPattern = Pattern.compile("\\b[a-z0-9#+./-]{2,25}\\b");
        Matcher matcher = tokenPattern.matcher(normalizedJob);

        Map<String, Integer> frequency = new HashMap<>();
        while (matcher.find()) {
            String token = matcher.group();
            // Filter numbers only or stop words
            if (token.matches("^\\d+$") || STOP_WORDS.contains(token)) {
                continue;
            }
            // Skip short purely alphabetic words
            if (token.length() <= 2 && !token.equals("c#") && !token.equals("r") && !token.equals("go") && !token.equals("ui") && !token.equals("ux")) {
                continue;
            }
            frequency.put(token, frequency.getOrDefault(token, 0) + 1);
        }

        // Sort by frequency and select top terms
        List<Map.Entry<String, Integer>> sortedTokens = frequency.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(40)
                .collect(Collectors.toList());

        for (Map.Entry<String, Integer> entry : sortedTokens) {
            String token = entry.getKey();
            // Check if token is already part of an identified phrase
            boolean alreadyInPhrase = keywords.stream().anyMatch(p -> p.contains(token));
            if (!alreadyInPhrase) {
                keywords.add(token);
            }
        }

        return keywords;
    }

    private boolean isKeywordPresent(String normalizedText, String keyword) {
        if (keyword.contains(" ")) {
            return normalizedText.contains(keyword);
        }
        // Match boundary
        Pattern pattern = Pattern.compile("(?<![a-z0-9])" + Pattern.quote(keyword) + "(?![a-z0-9])");
        return pattern.matcher(normalizedText).find();
    }

    private static final Map<String, String> COMMON_SECTIONS = new LinkedHashMap<>();
    static {
        COMMON_SECTIONS.put("education", "Education");
        COMMON_SECTIONS.put("experience", "Experience");
        COMMON_SECTIONS.put("skills", "Skills");
        COMMON_SECTIONS.put("projects", "Projects");
        COMMON_SECTIONS.put("certifications", "Certifications");
    }

    /**
     * Feature 3: Check if the resume contains common section headings (case-insensitive).
     * Returns list of missing section names (e.g. ["Projects", "Certifications"]).
     */
    public List<String> detectMissingSections(String resumeText) {
        if (resumeText == null || resumeText.isBlank()) {
            return new ArrayList<>(COMMON_SECTIONS.values());
        }

        List<String> missing = new ArrayList<>();
        for (Map.Entry<String, String> entry : COMMON_SECTIONS.entrySet()) {
            String keyword = entry.getKey();
            Pattern pattern = Pattern.compile("(?i)\\b" + Pattern.quote(keyword) + "s?\\b");
            if (!pattern.matcher(resumeText).find()) {
                missing.add(entry.getValue());
            }
        }
        return missing;
    }

    /**
     * Feature 1: Count keyword frequency in resume text. Flag any keyword appearing > 6 times
     * as a potential keyword stuffing risk.
     */
    public List<String> detectRepeatedKeywords(String resumeText) {
        if (resumeText == null || resumeText.isBlank()) {
            return Collections.emptyList();
        }

        Pattern tokenPattern = Pattern.compile("\\b[a-zA-Z0-9#+./-]{2,25}\\b");
        Matcher matcher = tokenPattern.matcher(resumeText);

        Map<String, Integer> counts = new LinkedHashMap<>();
        Map<String, String> displayNames = new HashMap<>();

        while (matcher.find()) {
            String rawToken = matcher.group();
            String lower = rawToken.toLowerCase();

            if (lower.matches("^\\d+$") || STOP_WORDS.contains(lower)) {
                continue;
            }
            if (lower.length() <= 2 && !lower.equals("c#") && !lower.equals("r") && !lower.equals("go") && !lower.equals("ui") && !lower.equals("ux")) {
                continue;
            }

            counts.put(lower, counts.getOrDefault(lower, 0) + 1);
            if (!displayNames.containsKey(lower)) {
                displayNames.put(lower, rawToken);
            }
        }

        List<String> warnings = new ArrayList<>();
        counts.entrySet().stream()
                .filter(e -> e.getValue() > 6)
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .forEach(e -> {
                    String name = displayNames.getOrDefault(e.getKey(), e.getKey());
                    warnings.add(String.format("The word '%s' appears %d times — this may look unnatural to ATS systems, consider reducing it.", name, e.getValue()));
                });

        return warnings;
    }
}
