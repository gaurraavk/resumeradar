package com.resumeradar.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Deterministic resume section parser.
 * Never throws exceptions on malformed input.
 */
@Service
public class ResumeSectionParser {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("(?i)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(?i)(\\+?\\d[\\d\\s\\-\\(\\).]{7,}\\d|\\b\\d{3}[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b|phone|mobile|tel:|cell:)");
    private static final Pattern LINKEDIN_PATTERN = Pattern.compile("(?i)\\blinkedin(\\.com)?\\b");
    private static final Pattern GITHUB_PATTERN = Pattern.compile("(?i)\\bgithub(\\.com)?\\b");

    private static final Map<String, String> HEADING_ALIASES = new LinkedHashMap<>();

    static {
        // SUMMARY
        registerAlias("summary", "SUMMARY");
        registerAlias("objective", "SUMMARY");
        registerAlias("profile", "SUMMARY");
        registerAlias("professional summary", "SUMMARY");
        registerAlias("career objective", "SUMMARY");
        registerAlias("executive summary", "SUMMARY");
        registerAlias("summary of qualifications", "SUMMARY");
        registerAlias("about me", "SUMMARY");
        registerAlias("personal profile", "SUMMARY");
        registerAlias("career summary", "SUMMARY");
        registerAlias("overview", "SUMMARY");

        // EDUCATION
        registerAlias("education", "EDUCATION");
        registerAlias("educational background", "EDUCATION");
        registerAlias("academic background", "EDUCATION");
        registerAlias("academic history", "EDUCATION");
        registerAlias("education & qualifications", "EDUCATION");
        registerAlias("education and qualifications", "EDUCATION");
        registerAlias("academics", "EDUCATION");
        registerAlias("academic qualifications", "EDUCATION");

        // EXPERIENCE
        registerAlias("experience", "EXPERIENCE");
        registerAlias("work experience", "EXPERIENCE");
        registerAlias("professional experience", "EXPERIENCE");
        registerAlias("internship", "EXPERIENCE");
        registerAlias("internships", "EXPERIENCE");
        registerAlias("employment history", "EXPERIENCE");
        registerAlias("work history", "EXPERIENCE");
        registerAlias("career history", "EXPERIENCE");
        registerAlias("relevant experience", "EXPERIENCE");
        registerAlias("professional background", "EXPERIENCE");

        // PROJECTS
        registerAlias("projects", "PROJECTS");
        registerAlias("academic projects", "PROJECTS");
        registerAlias("personal projects", "PROJECTS");
        registerAlias("key projects", "PROJECTS");
        registerAlias("technical projects", "PROJECTS");
        registerAlias("selected projects", "PROJECTS");
        registerAlias("project experience", "PROJECTS");

        // SKILLS
        registerAlias("skills", "SKILLS");
        registerAlias("technical skills", "SKILLS");
        registerAlias("core skills", "SKILLS");
        registerAlias("key skills", "SKILLS");
        registerAlias("skills & abilities", "SKILLS");
        registerAlias("skills and abilities", "SKILLS");
        registerAlias("skills and tools", "SKILLS");
        registerAlias("skills & tools", "SKILLS");
        registerAlias("core competencies", "SKILLS");
        registerAlias("technologies", "SKILLS");
        registerAlias("technical competencies", "SKILLS");
        registerAlias("skills & expertise", "SKILLS");
        registerAlias("areas of expertise", "SKILLS");
        registerAlias("programming languages", "SKILLS");

        // CERTIFICATIONS
        registerAlias("certifications", "CERTIFICATIONS");
        registerAlias("certificates", "CERTIFICATIONS");
        registerAlias("achievements", "CERTIFICATIONS");
        registerAlias("licenses & certifications", "CERTIFICATIONS");
        registerAlias("licenses and certifications", "CERTIFICATIONS");
        registerAlias("certifications and achievements", "CERTIFICATIONS");
        registerAlias("certifications & achievements", "CERTIFICATIONS");
        registerAlias("awards & achievements", "CERTIFICATIONS");
        registerAlias("awards and achievements", "CERTIFICATIONS");
        registerAlias("honors & awards", "CERTIFICATIONS");
        registerAlias("honors and awards", "CERTIFICATIONS");
        registerAlias("awards", "CERTIFICATIONS");
        registerAlias("certifications & licenses", "CERTIFICATIONS");
        registerAlias("licenses", "CERTIFICATIONS");

        // OTHER aliases
        registerAlias("other", "OTHER");
        registerAlias("miscellaneous", "OTHER");
        registerAlias("additional information", "OTHER");
        registerAlias("publications", "OTHER");
        registerAlias("languages", "OTHER");
        registerAlias("volunteer work", "OTHER");
        registerAlias("volunteering", "OTHER");
        registerAlias("references", "OTHER");
        registerAlias("interests", "OTHER");
    }

    private static void registerAlias(String alias, String key) {
        HEADING_ALIASES.put(alias.toLowerCase(), key);
    }

    public static class ParsedResume {
        private final String candidateName;
        private final List<String> contactLines;
        private final Map<String, List<String>> sections;
        private final boolean fallbackNoHeadings;
        private final List<String> allInputLines;

        public ParsedResume(String candidateName,
                            List<String> contactLines,
                            Map<String, List<String>> sections,
                            boolean fallbackNoHeadings,
                            List<String> allInputLines) {
            this.candidateName = candidateName != null ? candidateName : "";
            this.contactLines = contactLines != null ? contactLines : Collections.emptyList();
            this.sections = sections != null ? sections : Collections.emptyMap();
            this.fallbackNoHeadings = fallbackNoHeadings;
            this.allInputLines = allInputLines != null ? allInputLines : Collections.emptyList();
        }

        public String getCandidateName() {
            return candidateName;
        }

        public List<String> getContactLines() {
            return contactLines;
        }

        public Map<String, List<String>> getSections() {
            return sections;
        }

        public boolean isFallbackNoHeadings() {
            return fallbackNoHeadings;
        }

        public List<String> getAllInputLines() {
            return allInputLines;
        }

        public List<String> getSectionLines(String key) {
            return sections.getOrDefault(key, Collections.emptyList());
        }

        public boolean hasSection(String key) {
            List<String> lines = sections.get(key);
            return lines != null && !lines.isEmpty();
        }
    }

    public ParsedResume parse(String text) {
        if (text == null || text.isBlank()) {
            return new ParsedResume("", Collections.emptyList(), Collections.emptyMap(), true, Collections.emptyList());
        }

        try {
            String[] rawLines = text.split("\r?\n");
            List<String> nonBlankLines = new ArrayList<>();
            for (String line : rawLines) {
                if (!line.trim().isEmpty()) {
                    nonBlankLines.add(line.trim());
                }
            }

            if (nonBlankLines.isEmpty()) {
                return new ParsedResume("", Collections.emptyList(), Collections.emptyMap(), true, Collections.emptyList());
            }

            // 1. First non-empty line = candidate name
            String candidateName = nonBlankLines.get(0);

            // Check if any headings exist in lines 1..end
            boolean anyHeadingsExist = false;
            for (int i = 1; i < nonBlankLines.size(); i++) {
                if (detectHeadingKey(nonBlankLines.get(i)) != null) {
                    anyHeadingsExist = true;
                    break;
                }
            }

            // Fallback: If NO headings are detected at all, fall back to one section containing all text in original order
            if (!anyHeadingsExist) {
                List<String> contact = new ArrayList<>();
                List<String> fallbackLines = new ArrayList<>();

                for (int i = 1; i < nonBlankLines.size(); i++) {
                    String line = nonBlankLines.get(i);
                    if (contact.isEmpty() && isContactLine(line)) {
                        contact.add(line);
                    } else {
                        fallbackLines.add(line);
                    }
                }

                Map<String, List<String>> sections = new LinkedHashMap<>();
                if (!fallbackLines.isEmpty()) {
                    sections.put("OTHER", fallbackLines);
                }

                return new ParsedResume(candidateName, contact, sections, true, nonBlankLines);
            }

            // Standard parsing with headings
            List<String> contactLines = new ArrayList<>();
            Map<String, List<String>> sections = new LinkedHashMap<>();
            String currentSection = null;
            boolean firstHeadingFound = false;

            for (int i = 1; i < nonBlankLines.size(); i++) {
                String line = nonBlankLines.get(i);
                String detectedHeading = detectHeadingKey(line);

                if (detectedHeading != null) {
                    firstHeadingFound = true;
                    currentSection = detectedHeading;
                    sections.putIfAbsent(currentSection, new ArrayList<>());
                    continue;
                }

                if (!firstHeadingFound) {
                    // Lines before the first heading
                    if (isContactLine(line)) {
                        contactLines.add(line);
                    } else {
                        // Unrecognised content before first heading goes to OTHER
                        sections.putIfAbsent("OTHER", new ArrayList<>());
                        sections.get("OTHER").add(line);
                    }
                } else {
                    // Content under current section
                    if (currentSection == null) {
                        currentSection = "OTHER";
                        sections.putIfAbsent(currentSection, new ArrayList<>());
                    }
                    sections.get(currentSection).add(line);
                }
            }

            return new ParsedResume(candidateName, contactLines, sections, false, nonBlankLines);

        } catch (Exception e) {
            // Defensive guarantee: Never throw, return best-effort fallback
            List<String> raw = text != null ? Arrays.asList(text.split("\r?\n")) : Collections.emptyList();
            return new ParsedResume(
                    !raw.isEmpty() ? raw.get(0).trim() : "",
                    Collections.emptyList(),
                    Collections.emptyMap(),
                    true,
                    raw
            );
        }
    }

    public String detectHeadingKey(String line) {
        if (line == null) return null;
        String trimmed = line.trim();
        if (trimmed.isEmpty()) return null;

        // Strip leading markdown / bullet chars
        String clean = trimmed.replaceAll("^[#*\\-–—•\\s]+", "").replaceAll("[*#\\s]+$", "");
        // Strip trailing colon and surrounding spaces
        clean = clean.replaceAll("[:\\s]+$", "").trim();

        if (clean.length() > 45) return null;

        String[] words = clean.split("\\s+");
        if (words.length > 5) return null;

        String lower = clean.toLowerCase();
        return HEADING_ALIASES.get(lower);
    }

    public boolean isContactLine(String line) {
        if (line == null || line.isBlank()) return false;
        return EMAIL_PATTERN.matcher(line).find()
                || PHONE_PATTERN.matcher(line).find()
                || LINKEDIN_PATTERN.matcher(line).find()
                || GITHUB_PATTERN.matcher(line).find();
    }
}
