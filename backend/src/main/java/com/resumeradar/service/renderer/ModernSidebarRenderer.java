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

@Component
public class ModernSidebarRenderer implements ResumeRenderer {

    private static final Set<String> LEFT_COLUMN_SECTIONS = Set.of("SKILLS", "EDUCATION", "CERTIFICATIONS");
    private static final Set<String> RIGHT_COLUMN_SECTIONS = Set.of("SUMMARY", "EXPERIENCE", "PROJECTS");

    @Override
    public String getLayoutType() {
        return "SIDEBAR_TWO_COLUMN";
    }

    @Override
    public byte[] render(ResumeSectionParser.ParsedResume parsed, ResumeTemplate template) {
        String fontFamily = (template != null && template.getFontFamily() != null) ? template.getFontFamily() : "Calibri";
        String sidebarBg = (template != null && template.getAccentColorHex() != null)
                ? template.getAccentColorHex().replace("#", "")
                : "1F2937";

        try (XWPFDocument doc = new XWPFDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            // Page margins: 0.5 inch (720 dxa) to maximize two-column printable width
            CTSectPr sectPr = doc.getDocument().getBody().addNewSectPr();
            CTPageMar pageMar = sectPr.addNewPgMar();
            BigInteger marginDxa = BigInteger.valueOf(720);
            pageMar.setLeft(marginDxa);
            pageMar.setRight(marginDxa);
            pageMar.setTop(marginDxa);
            pageMar.setBottom(marginDxa);

            // Two-column layout built as a borderless 2-cell table
            XWPFTable table = doc.createTable(1, 2);
            table.removeBorders();
            makeTableBorderless(table);

            XWPFTableRow row = table.getRow(0);
            XWPFTableCell leftCell = row.getCell(0);
            XWPFTableCell rightCell = row.getCell(1);

            // Left column (about 32% ~ 3450 dxa), Right column (about 68% ~ 7350 dxa)
            leftCell.setWidth("3450");
            rightCell.setWidth("7350");

            setGridColumnWidths(table, BigInteger.valueOf(3450), BigInteger.valueOf(7350));
            setCellPadding(leftCell, 220, 220, 220, 220);
            setCellPadding(rightCell, 220, 220, 220, 220);

            // Left column dark slate shading (#1F2937)
            leftCell.setColor(sidebarBg);

            // ==================== LEFT COLUMN CONTENT ====================
            // Candidate Name: white, bold 20pt
            XWPFParagraph namePara = leftCell.getParagraphs().get(0);
            namePara.setSpacingAfter(60);
            if (parsed.getCandidateName() != null && !parsed.getCandidateName().isBlank()) {
                XWPFRun nameRun = namePara.createRun();
                nameRun.setText(parsed.getCandidateName());
                nameRun.setBold(true);
                nameRun.setFontSize(20);
                nameRun.setFontFamily(fontFamily);
                nameRun.setColor("FFFFFF");
            }

            // Contact details: white / light slate text
            if (!parsed.getContactLines().isEmpty()) {
                for (String contact : parsed.getContactLines()) {
                    XWPFParagraph cp = leftCell.addParagraph();
                    cp.setSpacingAfter(40);
                    XWPFRun cr = cp.createRun();
                    cr.setText(contact);
                    cr.setFontSize(9.5);
                    cr.setFontFamily(fontFamily);
                    cr.setColor("E5E7EB");
                }
            }

            // Left sections: Skills, Education, Certifications
            List<String> leftOrder = List.of("SKILLS", "EDUCATION", "CERTIFICATIONS");
            for (String secKey : leftOrder) {
                if (parsed.hasSection(secKey)) {
                    renderSidebarSection(leftCell, secKey, parsed.getSectionLines(secKey), fontFamily);
                }
            }

            // ==================== RIGHT COLUMN CONTENT ====================
            // Right sections: Summary, Experience, Projects
            List<String> rightOrder = List.of("SUMMARY", "EXPERIENCE", "PROJECTS");
            boolean firstRightParaUsed = false;

            if (parsed.isFallbackNoHeadings()) {
                renderMainLines(rightCell, parsed.getSectionLines("OTHER"), fontFamily, firstRightParaUsed);
            } else {
                for (String secKey : rightOrder) {
                    if (parsed.hasSection(secKey)) {
                        renderMainSection(rightCell, secKey, parsed.getSectionLines(secKey), fontFamily, firstRightParaUsed);
                        firstRightParaUsed = true;
                    }
                }

                // Invariant: If there are unrecognised sections (e.g. OTHER, AWARDS), render them in the right column
                for (Map.Entry<String, List<String>> entry : parsed.getSections().entrySet()) {
                    String k = entry.getKey();
                    if (!LEFT_COLUMN_SECTIONS.contains(k) && !RIGHT_COLUMN_SECTIONS.contains(k)
                            && entry.getValue() != null && !entry.getValue().isEmpty()) {
                        renderMainSection(rightCell, k, entry.getValue(), fontFamily, firstRightParaUsed);
                        firstRightParaUsed = true;
                    }
                }
            }

            doc.write(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to render modern-sidebar resume docx: " + e.getMessage(), e);
        }
    }

    private void renderSidebarSection(XWPFTableCell cell, String sectionKey, List<String> lines, String fontFamily) {
        if (lines == null || lines.isEmpty()) return;

        XWPFParagraph headingPara = cell.addParagraph();
        headingPara.setSpacingBefore(180);
        headingPara.setSpacingAfter(50);
        headingPara.setBorderBottom(Borders.SINGLE);

        XWPFRun hr = headingPara.createRun();
        hr.setText(formatHeading(sectionKey).toUpperCase());
        hr.setBold(true);
        hr.setFontSize(11);
        hr.setFontFamily(fontFamily);
        hr.setColor("93C5FD"); // Soft ice blue accent on dark slate

        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            XWPFParagraph p = cell.addParagraph();
            p.setSpacingAfter(30);

            String trimmed = line.trim();
            boolean isBullet = trimmed.matches("^[\\-*•–—]\\s+.*")
                    || trimmed.startsWith("•")
                    || trimmed.startsWith("- ")
                    || trimmed.startsWith("* ");

            XWPFRun r = p.createRun();
            r.setFontFamily(fontFamily);
            r.setFontSize(9.5);
            r.setColor("F3F4F6");

            if (isBullet) {
                p.setIndentationLeft(200);
                String clean = trimmed.replaceFirst("^[\\-*•–—]\\s*", "");
                r.setText("• " + clean);
            } else {
                r.setText(trimmed);
            }
        }
    }

    private void renderMainSection(XWPFTableCell cell, String sectionKey, List<String> lines, String fontFamily, boolean firstUsed) {
        if (lines == null || lines.isEmpty()) return;

        XWPFParagraph headingPara;
        if (!firstUsed && !cell.getParagraphs().isEmpty()) {
            headingPara = cell.getParagraphs().get(0);
        } else {
            headingPara = cell.addParagraph();
        }

        headingPara.setSpacingBefore(firstUsed ? 180 : 0);
        headingPara.setSpacingAfter(60);
        headingPara.setBorderBottom(Borders.SINGLE);

        XWPFRun hr = headingPara.createRun();
        hr.setText(formatHeading(sectionKey).toUpperCase());
        hr.setBold(true);
        hr.setFontSize(12);
        hr.setFontFamily(fontFamily);
        hr.setColor("1F2937");

        renderMainLines(cell, lines, fontFamily, true);
    }

    private void renderMainLines(XWPFTableCell cell, List<String> lines, String fontFamily, boolean firstUsed) {
        if (lines == null) return;

        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            XWPFParagraph p = cell.addParagraph();
            p.setSpacingAfter(40);

            String trimmed = line.trim();
            boolean isBullet = trimmed.matches("^[\\-*•–—]\\s+.*")
                    || trimmed.startsWith("•")
                    || trimmed.startsWith("- ")
                    || trimmed.startsWith("* ");

            XWPFRun r = p.createRun();
            r.setFontFamily(fontFamily);
            r.setFontSize(10.5);
            r.setColor("374151");

            if (isBullet) {
                p.setIndentationLeft(360);
                String clean = trimmed.replaceFirst("^[\\-*•–—]\\s*", "");
                r.setText("• " + clean);
            } else {
                r.setText(trimmed);
            }
        }
    }

    private void makeTableBorderless(XWPFTable table) {
        try {
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

    private void setGridColumnWidths(XWPFTable table, BigInteger col1, BigInteger col2) {
        try {
            CTTblGrid grid = table.getCTTbl().addNewTblGrid();
            grid.addNewGridCol().setW(col1);
            grid.addNewGridCol().setW(col2);
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
            case "SKILLS" -> "Skills";
            case "CERTIFICATIONS" -> "Certifications";
            case "OTHER" -> "Additional Information";
            default -> sectionKey;
        };
    }
}
