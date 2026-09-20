package com.resumeradar.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.xwpf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeFixService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeFixService.class);
    private static final String STANDARD_FONT = "Calibri";
    private static final int STANDARD_FONT_SIZE = 11;

    private final AnalysisSessionStore sessionStore;
    private final AtsKeywordService atsKeywordService;
    private Map<String, String> actionVerbMap = new LinkedHashMap<>();

    public ResumeFixService(AnalysisSessionStore sessionStore) {
        this(sessionStore, new AtsKeywordService());
    }

    @org.springframework.beans.factory.annotation.Autowired
    public ResumeFixService(AnalysisSessionStore sessionStore, AtsKeywordService atsKeywordService) {
        this.sessionStore = sessionStore;
        this.atsKeywordService = atsKeywordService != null ? atsKeywordService : new AtsKeywordService();
    }

    public static class FixResult {
        private final int originalScore;
        private final int improvedScore;
        private final List<String> fixesApplied;

        public FixResult(int originalScore, int improvedScore, List<String> fixesApplied) {
            this.originalScore = originalScore;
            this.improvedScore = improvedScore;
            this.fixesApplied = fixesApplied;
        }

        public int getOriginalScore() {
            return originalScore;
        }

        public int getImprovedScore() {
            return improvedScore;
        }

        public List<String> getFixesApplied() {
            return fixesApplied;
        }
    }

    public static class WeakSentenceAnalysis {
        private final int weakSentenceCount;
        private final int totalSentenceCount;
        private final List<String> weakSentenceExamples;

        public WeakSentenceAnalysis(int weakSentenceCount, int totalSentenceCount, List<String> weakSentenceExamples) {
            this.weakSentenceCount = weakSentenceCount;
            this.totalSentenceCount = totalSentenceCount;
            this.weakSentenceExamples = weakSentenceExamples != null ? weakSentenceExamples : Collections.emptyList();
        }

        public int getWeakSentenceCount() {
            return weakSentenceCount;
        }

        public int getTotalSentenceCount() {
            return totalSentenceCount;
        }

        public List<String> getWeakSentenceExamples() {
            return weakSentenceExamples;
        }
    }

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("action-verbs.json");
            ObjectMapper mapper = new ObjectMapper();
            actionVerbMap = mapper.readValue(resource.getInputStream(), new TypeReference<LinkedHashMap<String, String>>() {});
            logger.info("Loaded {} action verb mappings", actionVerbMap.size());
        } catch (IOException e) {
            logger.error("Failed to load action-verbs.json: {}", e.getMessage(), e);
        }
    }

    /**
     * Generate a fixed .docx resume and return before/after ATS scores + fixes applied.
     */
    public FixResult fixResume(String analysisId) {
        AnalysisSessionStore.AnalysisSession session = sessionStore.get(analysisId);
        if (session == null) {
            throw new IllegalArgumentException("Analysis session not found or expired: " + analysisId);
        }
        if (!session.isDocx()) {
            throw new IllegalArgumentException("Auto-fix is only available for .docx uploads or text resumes. PDF files cannot be rebuilt.");
        }

        List<String> fixesApplied = new ArrayList<>();

        try {
            XWPFDocument doc;
            byte[] rawBytes = session.getOriginalFileBytes();
            if (rawBytes != null && rawBytes.length > 0) {
                doc = new XWPFDocument(new ByteArrayInputStream(rawBytes));
            } else {
                // Text-pasted resume: synthesize docx paragraphs
                doc = new XWPFDocument();
                String text = session.getResumeText() != null ? session.getResumeText() : "";
                String[] lines = text.split("\r?\n");
                for (String line : lines) {
                    if (line.trim().isEmpty()) continue;
                    XWPFParagraph p = doc.createParagraph();
                    XWPFRun r = p.createRun();
                    r.setText(line);
                    r.setFontFamily(STANDARD_FONT);
                    r.setFontSize(STANDARD_FONT_SIZE);
                }
            }

            try (doc) {
                // 1. Standardize fonts on all runs
                int fontFixCount = standardizeFonts(doc);
                if (fontFixCount > 0) {
                    fixesApplied.add("Standardized font to " + STANDARD_FONT + " " + STANDARD_FONT_SIZE + "pt across " + fontFixCount + " text runs");
                }

                // 2. Convert table content to plain paragraphs
                int tablesRemoved = convertTablesToParagraphs(doc);
                if (tablesRemoved > 0) {
                    fixesApplied.add("Converted " + tablesRemoved + " table(s) to plain paragraph format");
                }

                // 3. Apply action verb substitutions
                int verbReplacements = applyActionVerbReplacements(doc);
                if (verbReplacements > 0) {
                    fixesApplied.add("Replaced " + verbReplacements + " weak verb phrase(s) with stronger action verbs");
                }

                // 4. Add/append missing keywords to Skills section
                List<String> missingKeywords = session.getMissingKeywords();
                if (missingKeywords != null && !missingKeywords.isEmpty()) {
                    addSkillsSection(doc, missingKeywords);
                    fixesApplied.add("Added Skills section with " + missingKeywords.size() + " missing keyword(s): " + String.join(", ", missingKeywords));
                }

                // Save to bytes
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                doc.write(baos);
                session.setFixedDocxBytes(baos.toByteArray());

                if (fixesApplied.isEmpty()) {
                    fixesApplied.add("No formatting or content issues detected — document is already well-formatted.");
                }

                // Extract full text from fixed document to re-calculate ATS score
                StringBuilder fixedTextSb = new StringBuilder();
                for (XWPFParagraph para : doc.getParagraphs()) {
                    String paraText = para.getText();
                    if (paraText != null && !paraText.isBlank()) {
                        fixedTextSb.append(paraText).append("\n");
                    }
                }
                String fixedText = fixedTextSb.toString();

                // Compute before/after scores
                int originalScore = 0;
                if (session.getOriginalScore() != null) {
                    originalScore = session.getOriginalScore();
                } else if (session.getJobDescription() != null && !session.getJobDescription().isBlank()) {
                    originalScore = atsKeywordService.analyzeKeywords(session.getResumeText(), session.getJobDescription()).getAtsScore();
                }

                int improvedScore = originalScore;
                if (session.getJobDescription() != null && !session.getJobDescription().isBlank()) {
                    com.resumeradar.dto.AtsResult newAtsResult = atsKeywordService.analyzeKeywords(fixedText, session.getJobDescription());
                    improvedScore = Math.max(newAtsResult.getAtsScore(), originalScore);
                } else if (missingKeywords != null && !missingKeywords.isEmpty()) {
                    // Fallback boost if job description was not passed
                    improvedScore = Math.min(100, originalScore + 25);
                }

                return new FixResult(originalScore, improvedScore, fixesApplied);
            }
        } catch (IOException e) {
            logger.error("Error generating fixed resume: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate fixed resume: " + e.getMessage());
        }
    }

    /**
     * Backward-compatible helper returning only the fixes applied list.
     */
    public List<String> generateFixedResume(String analysisId) {
        return fixResume(analysisId).getFixesApplied();
    }

    private int standardizeFonts(XWPFDocument doc) {
        int count = 0;
        for (XWPFParagraph para : doc.getParagraphs()) {
            for (XWPFRun run : para.getRuns()) {
                String currentFont = run.getFontFamily();
                int currentSize = run.getFontSize();
                if (currentFont == null || !currentFont.equalsIgnoreCase(STANDARD_FONT) ||
                    currentSize != STANDARD_FONT_SIZE) {
                    run.setFontFamily(STANDARD_FONT);
                    run.setFontSize(STANDARD_FONT_SIZE);
                    count++;
                }
            }
        }
        return count;
    }

    private int convertTablesToParagraphs(XWPFDocument doc) {
        List<XWPFTable> tables = new ArrayList<>(doc.getTables());
        int count = 0;

        for (XWPFTable table : tables) {
            // Extract all cell text first
            List<String> cellTexts = new ArrayList<>();
            for (XWPFTableRow row : table.getRows()) {
                StringBuilder rowText = new StringBuilder();
                for (XWPFTableCell cell : row.getTableCells()) {
                    String text = cell.getText().trim();
                    if (!text.isEmpty()) {
                        if (rowText.length() > 0) {
                            rowText.append(" | ");
                        }
                        rowText.append(text);
                    }
                }
                if (rowText.length() > 0) {
                    cellTexts.add(rowText.toString());
                }
            }

            // Find position and remove table
            int pos = doc.getPosOfTable(table);
            doc.removeBodyElement(pos);

            // Insert paragraphs in place
            for (String text : cellTexts) {
                XWPFParagraph newPara = doc.createParagraph();
                XWPFRun run = newPara.createRun();
                run.setText(text);
                run.setFontFamily(STANDARD_FONT);
                run.setFontSize(STANDARD_FONT_SIZE);
            }
            count++;
        }

        return count;
    }

    private int applyActionVerbReplacements(XWPFDocument doc) {
        int totalReplacements = 0;

        for (XWPFParagraph para : doc.getParagraphs()) {
            for (XWPFRun run : para.getRuns()) {
                String text = run.getText(0);
                if (text == null || text.isEmpty()) continue;

                for (Map.Entry<String, String> entry : actionVerbMap.entrySet()) {
                    String weakVerb = entry.getKey();
                    String strongVerb = entry.getValue();

                    // Case-insensitive replacement
                    Pattern pattern = Pattern.compile("(?i)\\b" + Pattern.quote(weakVerb) + "\\b");
                    Matcher matcher = pattern.matcher(text);
                    if (matcher.find()) {
                        // Preserve original case of first character
                        String replacement = strongVerb;
                        if (Character.isUpperCase(text.charAt(matcher.start()))) {
                            replacement = Character.toUpperCase(replacement.charAt(0)) + replacement.substring(1);
                        }
                        text = matcher.replaceAll(replacement);
                        totalReplacements++;
                    }
                }

                run.setText(text, 0);
            }
        }

        return totalReplacements;
    }

    private void addSkillsSection(XWPFDocument doc, List<String> keywords) {
        // Check if a Skills section already exists
        boolean skillsSectionExists = false;
        XWPFParagraph skillsParagraph = null;

        for (XWPFParagraph para : doc.getParagraphs()) {
            String text = para.getText().trim().toLowerCase();
            if (text.equals("skills") || text.equals("skills:") || text.startsWith("skills ")) {
                skillsSectionExists = true;
                skillsParagraph = para;
                break;
            }
        }

        if (!skillsSectionExists) {
            // Add a heading
            XWPFParagraph heading = doc.createParagraph();
            XWPFRun headingRun = heading.createRun();
            headingRun.setText("Skills");
            headingRun.setBold(true);
            headingRun.setFontFamily(STANDARD_FONT);
            headingRun.setFontSize(STANDARD_FONT_SIZE);
        }

        // Add keywords as a comma-separated list
        XWPFParagraph keywordsPara = doc.createParagraph();
        XWPFRun keywordsRun = keywordsPara.createRun();
        keywordsRun.setText(String.join(", ", keywords));
        keywordsRun.setFontFamily(STANDARD_FONT);
        keywordsRun.setFontSize(STANDARD_FONT_SIZE);
    }

    /**
     * Feature 2: Count how many bullet points/sentences in the resume text start with or
     * contain a weak phrase from action-verbs.json (read-only count, no replacement).
     */
    public WeakSentenceAnalysis analyzeWeakSentences(String resumeText) {
        if (resumeText == null || resumeText.isBlank()) {
            return new WeakSentenceAnalysis(0, 0, Collections.emptyList());
        }

        String[] lines = resumeText.split("\r?\n");
        List<String> sentences = new ArrayList<>();

        for (String line : lines) {
            String trimmed = line.trim().replaceAll("^[•\\-*–—\\d.]+\\s*", "");
            if (trimmed.length() >= 8) {
                String[] parts = trimmed.split("(?<=[.!?])\\s+");
                for (String part : parts) {
                    String p = part.trim();
                    if (p.length() >= 8) {
                        sentences.add(p);
                    }
                }
            }
        }

        if (sentences.isEmpty()) {
            return new WeakSentenceAnalysis(0, 0, Collections.emptyList());
        }

        int weakCount = 0;
        List<String> examples = new ArrayList<>();

        for (String sentence : sentences) {
            boolean isWeak = false;
            for (String weakPhrase : actionVerbMap.keySet()) {
                Pattern pattern = Pattern.compile("(?i)\\b" + Pattern.quote(weakPhrase) + "\\b");
                if (pattern.matcher(sentence).find()) {
                    isWeak = true;
                    break;
                }
            }

            if (isWeak) {
                weakCount++;
                if (examples.size() < 3) {
                    String ex = sentence.length() > 80 ? sentence.substring(0, 77) + "..." : sentence;
                    examples.add(ex);
                }
            }
        }

        return new WeakSentenceAnalysis(weakCount, sentences.size(), examples);
    }
}
