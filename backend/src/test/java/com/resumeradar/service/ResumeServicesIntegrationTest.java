package com.resumeradar.service;

import com.resumeradar.dto.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.xwpf.usermodel.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTPageMar;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTSectPr;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class ResumeServicesIntegrationTest {

    private FormattingAnalysisService formattingAnalysisService;
    private ResumeFixService resumeFixService;
    private AnalysisSessionStore sessionStore;
    private AtsKeywordService atsKeywordService;

    @BeforeEach
    void setUp() {
        sessionStore = new AnalysisSessionStore();
        formattingAnalysisService = new FormattingAnalysisService();
        resumeFixService = new ResumeFixService(sessionStore);
        resumeFixService.init();
        atsKeywordService = new AtsKeywordService();
    }

    private byte[] createTestDocx(boolean addRiskyFont, boolean addTable, boolean addNarrowMargins) throws IOException {
        try (XWPFDocument doc = new XWPFDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            // Paragraph with text
            XWPFParagraph p = doc.createParagraph();
            XWPFRun r = p.createRun();
            r.setText("I worked on cloud architecture and helped the team build pipelines.");
            if (addRiskyFont) {
                r.setFontFamily("Comic Sans MS");
            } else {
                r.setFontFamily("Arial");
            }

            if (addTable) {
                XWPFTable table = doc.createTable(2, 2);
                table.getRow(0).getCell(0).setText("Company");
                table.getRow(0).getCell(1).setText("Role");
                table.getRow(1).getCell(0).setText("Acme Corp");
                table.getRow(1).getCell(1).setText("Senior Engineer");
            }

            if (addNarrowMargins) {
                CTSectPr sectPr = doc.getDocument().getBody().addNewSectPr();
                CTPageMar pageMar = sectPr.addNewPgMar();
                pageMar.setLeft(BigInteger.valueOf(500)); // < 720
                pageMar.setRight(BigInteger.valueOf(500));
                pageMar.setTop(BigInteger.valueOf(500));
                pageMar.setBottom(BigInteger.valueOf(500));
            }

            doc.write(baos);
            return baos.toByteArray();
        }
    }

    private byte[] createTestPdf(String text) throws IOException {
        try (PDDocument doc = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            doc.addPage(page);

            try (PDPageContentStream cos = new PDPageContentStream(doc, page)) {
                cos.beginText();
                cos.setFont(PDType1Font.HELVETICA, 12);
                cos.newLineAtOffset(100, 700);
                cos.showText(text);
                cos.endText();
            }

            doc.save(baos);
            return baos.toByteArray();
        }
    }

    @Test
    void testDocxFormattingAnalysis_DetectsIssues() throws IOException {
        byte[] docxBytes = createTestDocx(true, true, true);
        FormattingAnalysisService.FormattingResult result = formattingAnalysisService.analyzeDocx(docxBytes);

        assertNotNull(result.getExtractedText());
        assertTrue(result.getExtractedText().contains("worked on cloud architecture"));

        List<FormattingWarning> warnings = result.getWarnings();
        assertFalse(warnings.isEmpty());

        boolean hasRiskyFontWarning = warnings.stream().anyMatch(w -> w.getIssue().toLowerCase().contains("font"));
        boolean hasTableWarning = warnings.stream().anyMatch(w -> w.getIssue().toLowerCase().contains("table"));
        boolean hasMarginWarning = warnings.stream().anyMatch(w -> w.getIssue().toLowerCase().contains("margin"));

        assertTrue(hasRiskyFontWarning, "Should detect Comic Sans MS as risky font");
        assertTrue(hasTableWarning, "Should detect table");
        assertTrue(hasMarginWarning, "Should detect narrow margins");
    }

    @Test
    void testPdfFormattingAnalysis_ExtractsTextAndWarns() throws IOException {
        byte[] pdfBytes = createTestPdf("Experienced software engineer skilled in Java and Spring Boot.");
        FormattingAnalysisService.FormattingResult result = formattingAnalysisService.analyzePdf(pdfBytes);

        assertNotNull(result.getExtractedText());
        assertTrue(result.getExtractedText().contains("Experienced software engineer"));
        assertEquals(1, result.getWarnings().size());
        assertTrue(result.getWarnings().get(0).getIssue().contains("PDF"));
    }

    @Test
    void testResumeFix_GeneratesValidDocxWithFixes() throws IOException {
        byte[] originalDocx = createTestDocx(true, true, false);
        String analysisId = UUID.randomUUID().toString();

        AnalysisSessionStore.AnalysisSession session = new AnalysisSessionStore.AnalysisSession(
                "I worked on cloud architecture and helped the team build pipelines.",
                originalDocx,
                "my_resume.docx",
                true,
                List.of("Kubernetes", "Docker"),
                Collections.emptyList()
        );
        sessionStore.put(analysisId, session);

        List<String> fixes = resumeFixService.generateFixedResume(analysisId);
        assertNotNull(fixes);
        assertFalse(fixes.isEmpty());

        // Check that fixes mention font standardization, table conversion, verbs, and skills
        assertTrue(fixes.stream().anyMatch(f -> f.contains("Standardized font")));
        assertTrue(fixes.stream().anyMatch(f -> f.contains("table")));
        assertTrue(fixes.stream().anyMatch(f -> f.contains("weak verb")));
        assertTrue(fixes.stream().anyMatch(f -> f.contains("Skills section")));

        // Verify the generated bytes can be re-opened as a valid XWPFDocument
        byte[] fixedBytes = session.getFixedDocxBytes();
        assertNotNull(fixedBytes);
        assertTrue(fixedBytes.length > 0);

        try (ByteArrayInputStream bis = new ByteArrayInputStream(fixedBytes);
             XWPFDocument fixedDoc = new XWPFDocument(bis)) {

            // Tables should be 0 now
            assertEquals(0, fixedDoc.getTables().size(), "All tables should have been converted to paragraphs");

            // Fonts should be Calibri 11pt
            for (XWPFParagraph p : fixedDoc.getParagraphs()) {
                for (XWPFRun r : p.getRuns()) {
                    assertEquals("Calibri", r.getFontFamily());
                    assertEquals(11, r.getFontSize());
                }
            }

            // Verify weak verbs replaced ("worked on" -> "developed", "helped" -> "contributed to")
            String fullText = "";
            for (XWPFParagraph p : fixedDoc.getParagraphs()) {
                fullText += p.getText() + " ";
            }
            assertTrue(fullText.contains("developed"), "worked on should be replaced with developed");
            assertTrue(fullText.contains("contributed to"), "helped should be replaced with contributed to");
            assertTrue(fullText.contains("Kubernetes"), "Skills section should include missing keyword Kubernetes");
            assertTrue(fullText.contains("Docker"), "Skills section should include missing keyword Docker");
        }
    }

    @Test
    void testBestFitComparison() {
        String resume = "Proficient in Java, Spring Boot, Microservices, and Docker.";
        BestFitRequest request = new BestFitRequest();
        request.setResumeText(resume);
        request.setJobDescriptions(List.of(
                new BestFitRequest.JobDescriptionEntry("Python Dev", "Python Django Flask Machine Learning"),
                new BestFitRequest.JobDescriptionEntry("Java Backend Engineer", "Senior Java Engineer with Spring Boot and Docker")
        ));

        List<BestFitResponse.BestFitResult> results = new ArrayList<>();
        for (BestFitRequest.JobDescriptionEntry jd : request.getJobDescriptions()) {
            AtsResult ats = atsKeywordService.analyzeKeywords(request.getResumeText(), jd.getText());
            results.add(new BestFitResponse.BestFitResult(jd.getTitle(), ats.getAtsScore(), ats.getMissingKeywords()));
        }
        results.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        assertEquals("Java Backend Engineer", results.get(0).getTitle());
        assertTrue(results.get(0).getMatchScore() > results.get(1).getMatchScore());
    }

    @Test
    void testTextResumeFix_ComputesScoresAndGeneratesDocx() {
        String analysisId = UUID.randomUUID().toString();
        String resumeText = "Software developer experienced in Python and Flask.";
        String jobDescription = "Looking for a Senior Software Engineer with Python, Flask, Docker, and Kubernetes.";

        AnalysisSessionStore.AnalysisSession session = new AnalysisSessionStore.AnalysisSession(
                resumeText,
                null, // plain text
                "resume.docx",
                true,
                List.of("Docker", "Kubernetes"),
                Collections.emptyList(),
                jobDescription,
                40
        );
        sessionStore.put(analysisId, session);

        ResumeFixService.FixResult result = resumeFixService.fixResume(analysisId);
        assertNotNull(result);
        assertEquals(40, result.getOriginalScore());
        assertTrue(result.getImprovedScore() >= result.getOriginalScore(), "Improved score should be >= original score");
        assertNotNull(session.getFixedDocxBytes());
        assertTrue(session.getFixedDocxBytes().length > 0);
    }
}
