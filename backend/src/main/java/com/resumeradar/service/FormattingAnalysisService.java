package com.resumeradar.service;

import com.resumeradar.dto.FormattingWarning;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTSectPr;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTPageMar;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.*;

@Service
public class FormattingAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(FormattingAnalysisService.class);

    private static final Set<String> RISKY_FONTS = Set.of(
            "comic sans ms", "papyrus", "curlz mt", "jokerman", "chiller",
            "broadway", "algerian", "bleeding cowboys", "lobster",
            "impact", "wingdings", "webdings", "symbol"
    );

    /**
     * Extract text and detect formatting issues from a .docx file.
     */
    public FormattingResult analyzeDocx(byte[] fileBytes) {
        List<FormattingWarning> warnings = new ArrayList<>();
        StringBuilder textBuilder = new StringBuilder();

        try (ByteArrayInputStream bis = new ByteArrayInputStream(fileBytes);
             XWPFDocument doc = new XWPFDocument(bis)) {

            // Extract text from paragraphs
            for (XWPFParagraph para : doc.getParagraphs()) {
                textBuilder.append(para.getText()).append("\n");
            }

            // Extract text from tables
            for (XWPFTable table : doc.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        textBuilder.append(cell.getText()).append(" ");
                    }
                    textBuilder.append("\n");
                }
            }

            // Detect risky fonts
            Set<String> foundRiskyFonts = new LinkedHashSet<>();
            for (XWPFParagraph para : doc.getParagraphs()) {
                for (XWPFRun run : para.getRuns()) {
                    String fontFamily = run.getFontFamily();
                    if (fontFamily != null && RISKY_FONTS.contains(fontFamily.toLowerCase())) {
                        foundRiskyFonts.add(fontFamily);
                    }
                }
            }
            for (XWPFTable table : doc.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        for (XWPFParagraph para : cell.getParagraphs()) {
                            for (XWPFRun run : para.getRuns()) {
                                String fontFamily = run.getFontFamily();
                                if (fontFamily != null && RISKY_FONTS.contains(fontFamily.toLowerCase())) {
                                    foundRiskyFonts.add(fontFamily);
                                }
                            }
                        }
                    }
                }
            }
            if (!foundRiskyFonts.isEmpty()) {
                warnings.add(new FormattingWarning(
                        "Risky font detected",
                        "The following non-standard fonts may cause ATS parsing issues: " + String.join(", ", foundRiskyFonts)
                ));
            }

            // Detect tables
            if (!doc.getTables().isEmpty()) {
                warnings.add(new FormattingWarning(
                        "Tables detected",
                        doc.getTables().size() + " table(s) found. Many ATS systems cannot parse table layouts correctly."
                ));
            }

            // Detect narrow margins
            CTSectPr sectPr = doc.getDocument().getBody().getSectPr();
            if (sectPr != null) {
                CTPageMar pgMar = sectPr.getPgMar();
                if (pgMar != null) {
                    BigInteger left = pgMar.getLeft() instanceof BigInteger ? (BigInteger) pgMar.getLeft() : null;
                    BigInteger right = pgMar.getRight() instanceof BigInteger ? (BigInteger) pgMar.getRight() : null;
                    BigInteger top = pgMar.getTop() instanceof BigInteger ? (BigInteger) pgMar.getTop() : null;
                    BigInteger bottom = pgMar.getBottom() instanceof BigInteger ? (BigInteger) pgMar.getBottom() : null;

                    boolean narrow = false;
                    StringBuilder marginDetails = new StringBuilder();
                    if (left != null && left.intValue() < 720) {
                        narrow = true;
                        marginDetails.append("left=").append(left.intValue()).append(" ");
                    }
                    if (right != null && right.intValue() < 720) {
                        narrow = true;
                        marginDetails.append("right=").append(right.intValue()).append(" ");
                    }
                    if (top != null && top.intValue() < 720) {
                        narrow = true;
                        marginDetails.append("top=").append(top.intValue()).append(" ");
                    }
                    if (bottom != null && bottom.intValue() < 720) {
                        narrow = true;
                        marginDetails.append("bottom=").append(bottom.intValue()).append(" ");
                    }

                    if (narrow) {
                        warnings.add(new FormattingWarning(
                                "Narrow margins detected",
                                "Margins below 0.5 inch (720 twips) detected: " + marginDetails.toString().trim() + ". This may cause content to be cut off when printed."
                        ));
                    }
                }
            }

        } catch (IOException e) {
            logger.error("Error analyzing DOCX formatting: {}", e.getMessage(), e);
            warnings.add(new FormattingWarning("Parse error", "Could not fully analyze document formatting: " + e.getMessage()));
        }

        return new FormattingResult(textBuilder.toString().trim(), warnings);
    }

    /**
     * Extract text from a PDF file. Formatting checks are not available for PDFs.
     */
    public FormattingResult analyzePdf(byte[] fileBytes) {
        List<FormattingWarning> warnings = new ArrayList<>();
        String text = "";

        try (ByteArrayInputStream bis = new ByteArrayInputStream(fileBytes);
             PDDocument doc = PDDocument.load(bis)) {

            PDFTextStripper stripper = new PDFTextStripper();
            text = stripper.getText(doc);

            warnings.add(new FormattingWarning(
                    "PDF format note",
                    "Formatting checks (font, table, margin detection) are only available for .docx uploads. Text was extracted for keyword analysis."
            ));

        } catch (IOException e) {
            logger.error("Error extracting PDF text: {}", e.getMessage(), e);
            warnings.add(new FormattingWarning("Parse error", "Could not extract text from PDF: " + e.getMessage()));
        }

        return new FormattingResult(text.trim(), warnings);
    }

    public static class FormattingResult {
        private final String extractedText;
        private final List<FormattingWarning> warnings;

        public FormattingResult(String extractedText, List<FormattingWarning> warnings) {
            this.extractedText = extractedText;
            this.warnings = warnings;
        }

        public String getExtractedText() {
            return extractedText;
        }

        public List<FormattingWarning> getWarnings() {
            return warnings;
        }
    }
}
