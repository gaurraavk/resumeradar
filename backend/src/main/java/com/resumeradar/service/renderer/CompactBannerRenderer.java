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

/**
 * compact-banner renderer:
 * - ATS-safe single column
 * - Full-width colored header band (#0F766E) with white 20pt Arial name and contact line
 * - Compact 10pt Arial body with tight spacing
 * - Small accent section labels (#0F766E)
 * - Skills formatted as one pipe-separated line
 * - Order: Summary (if present), Education first, Experience, Projects, Skills, Certifications, Other
 */
@Component
public class CompactBannerRenderer implements ResumeRenderer {

    private static final String BANNER_COLOR = "0F766E"; // Dark Teal
    private static final String FONT_FAMILY = "Arial";

    @Override
    public String getLayoutType() {
        return "BANNER_COMPACT";
    }

    @Override
    public byte[] render(ResumeSectionParser.ParsedResume parsed, ResumeTemplate template) {
        String fontFamily = (template != null && template.getFontFamily() != null) ? template.getFontFamily() : FONT_FAMILY;
        String bannerColor = (template != null && template.getAccentColorHex() != null)
                ? template.getAccentColorHex().replace("#", "")
                : BANNER_COLOR;

        try (XWPFDocument doc = new XWPFDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            // Page margins: 0.5 inch (720 dxa) to maximize printable area for compact 1-page fit
            CTSectPr sectPr = doc.getDocument().getBody().addNewSectPr();
            CTPageMar pageMar = sectPr.addNewPgMar();
            BigInteger marginDxa = BigInteger.valueOf(720);
            pageMar.setLeft(marginDxa);
            pageMar.setRight(marginDxa);
            pageMar.setTop(marginDxa);
            pageMar.setBottom(marginDxa);

            // Banner using a 1-row, 1-cell borderless table with #0F766E shading
            XWPFTable bannerTable = doc.createTable(1, 1);
            makeTableBorderless(bannerTable);
            bannerTable.setWidth("100%");

            XWPFTableRow row = bannerTable.getRow(0);
            XWPFTableCell cell = row.getCell(0);
            cell.setColor(bannerColor);
            setCellPadding(cell, 180, 200, 180, 200);

            // Name inside banner
            XWPFParagraph namePara = cell.getParagraphs().get(0);
            namePara.setAlignment(ParagraphAlignment.CENTER);
            namePara.setSpacingBefore(80);
            namePara.setSpacingAfter(40);
            XWPFRun nameRun = namePara.createRun();
            nameRun.setText(parsed.getCandidateName() != null && !parsed.getCandidateName().isBlank()
                    ? parsed.getCandidateName()
                    : "Candidate");
            nameRun.setFontFamily(fontFamily);
            nameRun.setFontSize(20);
            nameRun.setBold(true);
            nameRun.setColor("FFFFFF");

            // Contact info inside banner
            if (parsed.getContactLines() != null && !parsed.getContactLines().isEmpty()) {
                XWPFParagraph contactPara = cell.addParagraph();
                contactPara.setAlignment(ParagraphAlignment.CENTER);
                contactPara.setSpacingBefore(0);
                contactPara.setSpacingAfter(80);
                XWPFRun contactRun = contactPara.createRun();
                contactRun.setText(String.join(" | ", parsed.getContactLines()));
                contactRun.setFontFamily(fontFamily);
                contactRun.setFontSize(9);
                contactRun.setColor("F3F4F6"); // off-white
            }

            // Fallback for resumes without detected headings
            if (parsed.isFallbackNoHeadings()) {
                renderLines(doc, parsed.getSectionLines("OTHER"), fontFamily);
                doc.write(baos);
                return baos.toByteArray();
            }

            // Order: Summary (if present), Education first, Experience, Projects, Skills, Certifications
            List<String> order = List.of("SUMMARY", "EDUCATION", "EXPERIENCE", "PROJECTS", "SKILLS", "CERTIFICATIONS");
            Set<String> processed = new HashSet<>();

            for (String secKey : order) {
                if (parsed.hasSection(secKey)) {
                    renderSection(doc, secKey, parsed.getSectionLines(secKey), fontFamily, bannerColor);
                    processed.add(secKey);
                }
            }

            // Invariant: Render any remaining sections so no content line is ever dropped
            for (Map.Entry<String, List<String>> entry : parsed.getSections().entrySet()) {
                if (!processed.contains(entry.getKey()) && entry.getValue() != null && !entry.getValue().isEmpty()) {
                    renderSection(doc, entry.getKey(), entry.getValue(), fontFamily, bannerColor);
                    processed.add(entry.getKey());
                }
            }

            doc.write(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to render compact-banner resume docx: " + e.getMessage(), e);
        }
    }

    private void renderSection(XWPFDocument doc, String sectionKey, List<String> lines, String fontFamily, String bannerColor) {
        if (lines == null || lines.isEmpty()) return;

        // Section Title: Compact accent label
        XWPFParagraph headingPara = doc.createParagraph();
        headingPara.setSpacingBefore(120); // 6pt
        headingPara.setSpacingAfter(40);   // 2pt
        XWPFRun headingRun = headingPara.createRun();
        headingRun.setText(formatHeading(sectionKey).toUpperCase());
        headingRun.setFontFamily(fontFamily);
        headingRun.setFontSize(10);
        headingRun.setBold(true);
        headingRun.setColor(bannerColor);

        // If SKILLS, format as pipe-separated compact line(s)
        if ("SKILLS".equalsIgnoreCase(sectionKey)) {
            XWPFParagraph skillsPara = doc.createParagraph();
            skillsPara.setSpacingBefore(0);
            skillsPara.setSpacingAfter(60);
            XWPFRun skillsRun = skillsPara.createRun();
            skillsRun.setFontFamily(fontFamily);
            skillsRun.setFontSize(9.5);
            skillsRun.setColor("1F2937");

            List<String> validItems = new ArrayList<>();
            for (String l : lines) {
                String trimmed = l.trim();
                if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
                    trimmed = trimmed.replaceFirst("^[•\\-*]\\s*", "");
                }
                if (!trimmed.isEmpty()) {
                    validItems.add(trimmed);
                }
            }
            skillsRun.setText(String.join(" | ", validItems));
            return;
        }

        // Standard body lines
        renderLines(doc, lines, fontFamily);
    }

    private void renderLines(XWPFDocument doc, List<String> lines, String fontFamily) {
        if (lines == null) return;

        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            XWPFParagraph linePara = doc.createParagraph();
            linePara.setSpacingBefore(0);
            linePara.setSpacingAfter(30); // tight ~1.5pt

            XWPFRun lineRun = linePara.createRun();
            lineRun.setFontFamily(fontFamily);
            lineRun.setFontSize(10);
            lineRun.setColor("111827");

            String trimmed = line.trim();
            if (trimmed.matches("^[\\-*•–—]\\s+.*") || trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                linePara.setIndentationLeft(240);
                lineRun.setText("• " + trimmed.replaceFirst("^[\\-*•–—]\\s*", ""));
            } else {
                lineRun.setText(trimmed);
            }
        }
    }

    private void makeTableBorderless(XWPFTable table) {
        try {
            table.removeBorders();
            CTTblPr tblPr = table.getCTTbl().getTblPr();
            if (tblPr == null) tblPr = table.getCTTbl().addNewTblPr();
            CTTblBorders borders = tblPr.isSetTblBorders() ? tblPr.getTblBorders() : tblPr.addNewTblBorders();
            borders.addNewTop().setVal(STBorder.NONE);
            borders.addNewBottom().setVal(STBorder.NONE);
            borders.addNewLeft().setVal(STBorder.NONE);
            borders.addNewRight().setVal(STBorder.NONE);
            borders.addNewInsideH().setVal(STBorder.NONE);
            borders.addNewInsideV().setVal(STBorder.NONE);
        } catch (Exception ignored) {
        }
    }

    private void setCellPadding(XWPFTableCell cell, int top, int right, int bottom, int left) {
        try {
            CTTcPr tcPr = cell.getCTTc().isSetTcPr() ? cell.getCTTc().getTcPr() : cell.getCTTc().addNewTcPr();
            CTTcMar tcMar = tcPr.isSetTcMar() ? tcMar = tcPr.getTcMar() : tcPr.addNewTcMar();
            tcMar.addNewTop().setW(BigInteger.valueOf(top));
            tcMar.addNewRight().setW(BigInteger.valueOf(right));
            tcMar.addNewBottom().setW(BigInteger.valueOf(bottom));
            tcMar.addNewLeft().setW(BigInteger.valueOf(left));
        } catch (Exception ignored) {
        }
    }

    private String formatHeading(String sectionKey) {
        return switch (sectionKey.toUpperCase()) {
            case "SUMMARY" -> "Summary";
            case "EDUCATION" -> "Education";
            case "EXPERIENCE" -> "Experience";
            case "PROJECTS" -> "Projects";
            case "SKILLS" -> "Core Skills";
            case "CERTIFICATIONS" -> "Certifications";
            case "OTHER" -> "Additional Information";
            default -> sectionKey;
        };
    }
}
