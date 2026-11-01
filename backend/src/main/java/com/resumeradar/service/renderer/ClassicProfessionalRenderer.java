package com.resumeradar.service.renderer;

import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.service.ResumeSectionParser;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ClassicProfessionalRenderer implements ResumeRenderer {

    // Matches date range at the end of an entry line
    private static final Pattern DATE_RANGE_PATTERN = Pattern.compile(
            "(?i)^(.*?)(?:\\s*[|•–—\\t]\\s*|\\s{2,})((?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?\\s+)?(?:19|20)\\d{2})\\s*(?:[-–—]|to)\\s*(?:Present|Current|Ongoing|Now|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?\\s+)?(?:19|20)\\d{2}))\\s*$"
    );

    @Override
    public String getLayoutType() {
        return "SINGLE_COLUMN";
    }

    @Override
    public byte[] render(ResumeSectionParser.ParsedResume parsed, ResumeTemplate template) {
        String fontFamily = (template != null && template.getFontFamily() != null) ? template.getFontFamily() : "Times New Roman";
        String accentColor = (template != null && template.getAccentColorHex() != null)
                ? template.getAccentColorHex().replace("#", "")
                : "000000";

        try (XWPFDocument doc = new XWPFDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            // 1. Page margins: 0.75 inch = 1080 dxa
            CTSectPr sectPr = doc.getDocument().getBody().addNewSectPr();
            CTPageMar pageMar = sectPr.addNewPgMar();
            BigInteger marginDxa = BigInteger.valueOf(1080);
            pageMar.setLeft(marginDxa);
            pageMar.setRight(marginDxa);
            pageMar.setTop(marginDxa);
            pageMar.setBottom(marginDxa);

            // 2. Candidate Name: Centered (Times New Roman 22pt bold)
            if (parsed.getCandidateName() != null && !parsed.getCandidateName().isBlank()) {
                XWPFParagraph namePara = doc.createParagraph();
                namePara.setAlignment(ParagraphAlignment.CENTER);
                namePara.setSpacingAfter(40);

                XWPFRun nameRun = namePara.createRun();
                nameRun.setText(parsed.getCandidateName());
                nameRun.setBold(true);
                nameRun.setFontSize(22);
                nameRun.setFontFamily(fontFamily);
                nameRun.setColor(accentColor);
            }

            // 3. Contact line: Centered with " | " separators, thin full-width rule under it
            if (!parsed.getContactLines().isEmpty()) {
                XWPFParagraph contactPara = doc.createParagraph();
                contactPara.setAlignment(ParagraphAlignment.CENTER);
                contactPara.setSpacingAfter(100);
                contactPara.setBorderBottom(Borders.SINGLE);

                String joinedContact = String.join(" | ", parsed.getContactLines());
                XWPFRun contactRun = contactPara.createRun();
                contactRun.setText(joinedContact);
                contactRun.setFontSize(10);
                contactRun.setFontFamily(fontFamily);
                contactRun.setColor("374151");
            }

            // Fallback for resumes without detected headings
            if (parsed.isFallbackNoHeadings()) {
                renderLines(doc, parsed.getSectionLines("OTHER"), fontFamily);
                doc.write(baos);
                return baos.toByteArray();
            }

            // Standard order: Summary, Education, Experience, Projects, Skills, Certifications
            List<String> sectionOrder = template != null && template.getSectionOrder() != null && !template.getSectionOrder().isEmpty()
                    ? template.getSectionOrder()
                    : List.of("SUMMARY", "EDUCATION", "EXPERIENCE", "PROJECTS", "SKILLS", "CERTIFICATIONS");

            Set<String> processedSections = new HashSet<>();

            // Always render SUMMARY first if present
            if (parsed.hasSection("SUMMARY")) {
                renderSection(doc, "SUMMARY", parsed.getSectionLines("SUMMARY"), fontFamily, accentColor);
                processedSections.add("SUMMARY");
            }

            for (String secKey : sectionOrder) {
                if (parsed.hasSection(secKey) && !processedSections.contains(secKey)) {
                    renderSection(doc, secKey, parsed.getSectionLines(secKey), fontFamily, accentColor);
                    processedSections.add(secKey);
                }
            }

            // Invariant: Render any remaining sections so no content line is ever dropped
            for (Map.Entry<String, List<String>> entry : parsed.getSections().entrySet()) {
                if (!processedSections.contains(entry.getKey()) && entry.getValue() != null && !entry.getValue().isEmpty()) {
                    renderSection(doc, entry.getKey(), entry.getValue(), fontFamily, accentColor);
                    processedSections.add(entry.getKey());
                }
            }

            doc.write(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to render classic-professional resume docx: " + e.getMessage(), e);
        }
    }

    private void renderSection(XWPFDocument doc, String sectionKey, List<String> lines, String fontFamily, String accentColor) {
        if (lines == null || lines.isEmpty()) return;

        // Section heading: UPPERCASE bold with a bottom border
        XWPFParagraph headingPara = doc.createParagraph();
        headingPara.setSpacingBefore(160);
        headingPara.setSpacingAfter(60);
        headingPara.setBorderBottom(Borders.SINGLE);

        XWPFRun headingRun = headingPara.createRun();
        headingRun.setText(formatHeading(sectionKey).toUpperCase());
        headingRun.setBold(true);
        headingRun.setFontSize(12);
        headingRun.setFontFamily(fontFamily);
        headingRun.setColor(accentColor);

        // Body lines
        renderLines(doc, lines, fontFamily);
    }

    private void renderLines(XWPFDocument doc, List<String> lines, String fontFamily) {
        if (lines == null) return;

        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            String trimmed = line.trim();

            XWPFParagraph para = doc.createParagraph();
            para.setSpacingAfter(40);

            boolean isBullet = trimmed.matches("^[\\-*•–—]\\s+.*")
                    || trimmed.startsWith("•")
                    || trimmed.startsWith("- ")
                    || trimmed.startsWith("* ");

            if (isBullet) {
                para.setIndentationLeft(360);
                String cleanText = trimmed.replaceFirst("^[\\-*•–—]\\s*", "");
                XWPFRun run = para.createRun();
                run.setFontFamily(fontFamily);
                run.setFontSize(10.5);
                run.setText("• " + cleanText);
            } else {
                // Check if entry line has a date range to use right-aligned tab stop
                Matcher dateMatcher = DATE_RANGE_PATTERN.matcher(trimmed);
                if (dateMatcher.matches()) {
                    String titlePart = dateMatcher.group(1).trim();
                    String datePart = dateMatcher.group(2).trim();

                    setRightTabStop(para, 10080); // Right margin tab stop

                    XWPFRun runTitle = para.createRun();
                    runTitle.setFontFamily(fontFamily);
                    runTitle.setFontSize(11);
                    runTitle.setBold(true);
                    runTitle.setText(titlePart);

                    XWPFRun runTab = para.createRun();
                    runTab.setText("\t");

                    XWPFRun runDate = para.createRun();
                    runDate.setFontFamily(fontFamily);
                    runDate.setFontSize(10.5);
                    runDate.setText(datePart);
                } else {
                    XWPFRun run = para.createRun();
                    run.setFontFamily(fontFamily);
                    run.setFontSize(11);
                    run.setText(trimmed);
                }
            }
        }
    }

    private void setRightTabStop(XWPFParagraph para, int posDxa) {
        try {
            CTPPr ppr = para.getCTP().getPPr();
            if (ppr == null) ppr = para.getCTP().addNewPPr();
            CTTabs tabs = ppr.isSetTabs() ? ppr.getTabs() : ppr.addNewTabs();
            CTTabStop tab = tabs.addNewTab();
            tab.setVal(STTabJc.RIGHT);
            tab.setPos(BigInteger.valueOf(posDxa));
        } catch (Exception ignored) {
        }
    }

    private String formatHeading(String sectionKey) {
        return switch (sectionKey.toUpperCase()) {
            case "SUMMARY" -> "Professional Summary";
            case "EDUCATION" -> "Education";
            case "EXPERIENCE" -> "Professional Experience";
            case "PROJECTS" -> "Key Projects";
            case "SKILLS" -> "Technical Skills";
            case "CERTIFICATIONS" -> "Certifications & Honors";
            case "OTHER" -> "Additional Information";
            default -> sectionKey;
        };
    }
}
