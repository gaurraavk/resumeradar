package com.resumeradar.service;

import com.resumeradar.model.ResumeTemplate;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTPageMar;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTSectPr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;

@Service
public class TemplateResumeService {

    private static final Logger logger = LoggerFactory.getLogger(TemplateResumeService.class);
    private final ResumeSectionParser sectionParser;

    public TemplateResumeService(ResumeSectionParser sectionParser) {
        this.sectionParser = sectionParser;
    }

    public byte[] render(String fixedResumeText, ResumeTemplate template) {
        ResumeSectionParser.ParsedResume parsed = sectionParser.parse(fixedResumeText);
        return render(parsed, template);
    }

    public byte[] render(ResumeSectionParser.ParsedResume parsed, ResumeTemplate template) {
        if (template == null) {
            throw new IllegalArgumentException("ResumeTemplate cannot be null");
        }

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

            ParagraphAlignment alignment = "CENTER".equalsIgnoreCase(template.getNameAlignment())
                    ? ParagraphAlignment.CENTER
                    : ParagraphAlignment.LEFT;

            // 2. Candidate Name: large and bold (24pt) using template alignment & font
            if (parsed.getCandidateName() != null && !parsed.getCandidateName().isBlank()) {
                XWPFParagraph namePara = doc.createParagraph();
                namePara.setAlignment(alignment);
                namePara.setSpacingAfter(40);

                XWPFRun nameRun = namePara.createRun();
                nameRun.setText(parsed.getCandidateName());
                nameRun.setBold(true);
                nameRun.setFontSize(24);
                nameRun.setFontFamily(template.getFontFamily());
            }

            // 3. Contact lines: 10pt using template alignment & font
            if (!parsed.getContactLines().isEmpty()) {
                for (String contactLine : parsed.getContactLines()) {
                    XWPFParagraph contactPara = doc.createParagraph();
                    contactPara.setAlignment(alignment);
                    contactPara.setSpacingAfter(60);

                    XWPFRun contactRun = contactPara.createRun();
                    contactRun.setText(contactLine);
                    contactRun.setFontSize(10);
                    contactRun.setFontFamily(template.getFontFamily());
                    contactRun.setColor("4B5563"); // Elegant muted slate for contact
                }
            }

            // 4. If fallback with no headings: render all content paragraphs in original order
            if (parsed.isFallbackNoHeadings()) {
                List<String> lines = parsed.getSectionLines("OTHER");
                renderBodyLines(doc, lines, template);
                doc.write(baos);
                return baos.toByteArray();
            }

            // 5. Standard structured template rendering:
            // SUMMARY is always rendered right after the contact line regardless of template order
            if (parsed.hasSection("SUMMARY")) {
                renderSection(doc, "SUMMARY", parsed.getSectionLines("SUMMARY"), template);
            }

            // Render sections in the template's sectionOrder (skip empty ones)
            List<String> order = template.getSectionOrder();
            if (order != null) {
                for (String sectionKey : order) {
                    if (parsed.hasSection(sectionKey)) {
                        renderSection(doc, sectionKey, parsed.getSectionLines(sectionKey), template);
                    }
                }
            }

            // Unrecognised content goes to OTHER (rendered last)
            if (parsed.hasSection("OTHER")) {
                renderSection(doc, "OTHER", parsed.getSectionLines("OTHER"), template);
            }

            doc.write(baos);
            return baos.toByteArray();

        } catch (IOException e) {
            logger.error("Failed to render resume with template {}: {}", template.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to render resume docx: " + e.getMessage(), e);
        }
    }

    private void renderSection(XWPFDocument doc, String sectionKey, List<String> lines, ResumeTemplate template) {
        if (lines == null || lines.isEmpty()) return;

        // Heading
        XWPFParagraph headingPara = doc.createParagraph();
        headingPara.setSpacingBefore(180);
        headingPara.setSpacingAfter(60);

        if (template.isShowDividerLine()) {
            headingPara.setBorderBottom(Borders.SINGLE);
        }

        XWPFRun headingRun = headingPara.createRun();
        headingRun.setText(formatHeading(sectionKey, template.getHeadingCase()));
        headingRun.setBold(true);
        headingRun.setFontSize(12);
        headingRun.setFontFamily(template.getFontFamily());

        String hex = template.getAccentColorHex();
        if (hex != null) {
            headingRun.setColor(hex.replace("#", ""));
        }

        // Section body
        renderBodyLines(doc, lines, template);
    }

    private void renderBodyLines(XWPFDocument doc, List<String> lines, ResumeTemplate template) {
        if (lines == null) return;

        for (String line : lines) {
            if (line.trim().isEmpty()) continue;

            XWPFParagraph para = doc.createParagraph();
            para.setSpacingAfter(40);

            String trimmed = line.trim();
            boolean isBullet = trimmed.matches("^[\\-*•–—]\\s+.*")
                    || trimmed.startsWith("•")
                    || trimmed.startsWith("- ")
                    || trimmed.startsWith("* ");

            XWPFRun run = para.createRun();
            run.setFontFamily(template.getFontFamily());
            run.setFontSize(11);

            if (isBullet) {
                para.setIndentationLeft(360); // 0.25 inch indentation
                String cleanText = trimmed.replaceFirst("^[\\-*•–—]\\s*", "");
                run.setText("• " + cleanText);
            } else {
                run.setText(trimmed);
            }
        }
    }

    private String formatHeading(String sectionKey, String headingCase) {
        String display = switch (sectionKey.toUpperCase()) {
            case "SUMMARY" -> "Summary";
            case "EDUCATION" -> "Education";
            case "EXPERIENCE" -> "Experience";
            case "PROJECTS" -> "Projects";
            case "SKILLS" -> "Skills";
            case "CERTIFICATIONS" -> "Certifications";
            case "OTHER" -> "Additional Information";
            default -> sectionKey;
        };

        if ("UPPER".equalsIgnoreCase(headingCase)) {
            return display.toUpperCase();
        } else {
            return display;
        }
    }
}
