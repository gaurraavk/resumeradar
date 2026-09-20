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
    private Map<String, String> actionVerbMap = new LinkedHashMap<>();

    public ResumeFixService(AnalysisSessionStore sessionStore) {
        this.sessionStore = sessionStore;
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
     * Generate a fixed .docx resume for the given analysisId.
     * Returns a list of human-readable descriptions of fixes applied.
     */
    public List<String> generateFixedResume(String analysisId) {
        AnalysisSessionStore.AnalysisSession session = sessionStore.get(analysisId);
        if (session == null) {
            throw new IllegalArgumentException("Analysis session not found or expired: " + analysisId);
        }
        if (!session.isDocx()) {
            throw new IllegalArgumentException("Auto-fix is only available for .docx uploads. PDF files cannot be rebuilt.");
        }

        List<String> fixesApplied = new ArrayList<>();

        try (ByteArrayInputStream bis = new ByteArrayInputStream(session.getOriginalFileBytes());
             XWPFDocument doc = new XWPFDocument(bis)) {

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

        } catch (IOException e) {
            logger.error("Error generating fixed resume: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate fixed resume: " + e.getMessage());
        }

        return fixesApplied;
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
}
