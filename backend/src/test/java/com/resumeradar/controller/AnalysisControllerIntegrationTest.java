package com.resumeradar.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeradar.dto.AnalysisRequest;
import com.resumeradar.dto.BestFitRequest;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AnalysisControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAnalyzeEndpoint_ReturnsZeroAiFields() throws Exception {
        AnalysisRequest request = new AnalysisRequest();
        request.setResumeText("Java Spring Boot Developer with experience in Docker");
        request.setJobDescription("Looking for a Java developer with Spring Boot skills");

        mockMvc.perform(post("/api/v1/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.atsScore").isNumber())
                .andExpect(jsonPath("$.data.matchedKeywords").isArray())
                .andExpect(jsonPath("$.data.missingKeywords").isArray())
                // Ensure zero AI-related fields
                .andExpect(jsonPath("$.data.aiCritique").doesNotExist())
                .andExpect(jsonPath("$.data.aiError").doesNotExist());
    }

    @Test
    void testFileUpload_AutoFix_AndDownloadWorkflow() throws Exception {
        // 1. Create a dummy docx file
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (XWPFDocument doc = new XWPFDocument()) {
            XWPFParagraph p = doc.createParagraph();
            XWPFRun r = p.createRun();
            r.setText("I worked on Java microservices and helped deploy Docker containers.");
            doc.write(baos);
        }
        byte[] docxBytes = baos.toByteArray();

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "resume.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                docxBytes
        );

        // 2. Call /api/v1/analyze-file
        MvcResult analyzeResult = mockMvc.perform(multipart("/api/v1/analyze-file")
                        .file(file)
                        .param("jobDescription", "Senior Java Engineer with Kubernetes experience")
                        .param("jobTitle", "Java Engineer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.analysisId").isNotEmpty())
                .andExpect(jsonPath("$.data.formattingWarnings").isArray())
                // Ensure zero AI-related fields
                .andExpect(jsonPath("$.data.aiCritique").doesNotExist())
                .andReturn();

        String responseBody = analyzeResult.getResponse().getContentAsString();
        Map<String, Object> map = objectMapper.readValue(responseBody, Map.class);
        Map<String, Object> data = (Map<String, Object>) map.get("data");
        String analysisId = (String) data.get("analysisId");

        // 3. Call /api/v1/generate-fixed-resume
        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("analysisId", analysisId))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.originalScore").isNumber())
                .andExpect(jsonPath("$.data.improvedScore").isNumber())
                .andExpect(jsonPath("$.data.fixesApplied").isArray())
                .andExpect(jsonPath("$.data.downloadUrl", startsWith("/api/v1/download/fixed-resume/" + analysisId)));

        // 4. Call /api/v1/download/fixed-resume/{analysisId}
        MvcResult downloadResult = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString("resume_original.docx")))
                .andReturn();

        byte[] downloadedBytes = downloadResult.getResponse().getContentAsByteArray();
        assertTrue(downloadedBytes.length > 0);

        // Verify valid docx
        try (XWPFDocument fixedDoc = new XWPFDocument(new java.io.ByteArrayInputStream(downloadedBytes))) {
            assertFalse(fixedDoc.getParagraphs().isEmpty());
        }
    }

    @Test
    void testTextPaste_AutoFix_AndDownloadWorkflow() throws Exception {
        AnalysisRequest request = new AnalysisRequest();
        request.setResumeText("Software engineer with experience in Java and SQL databases.");
        request.setJobDescription("Looking for a Senior Java Developer with Spring Boot and Kubernetes experience.");

        // 1. Call /api/v1/analyze
        MvcResult analyzeResult = mockMvc.perform(post("/api/v1/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.analysisId").isNotEmpty())
                .andExpect(jsonPath("$.data.formattingWarnings").isArray())
                .andExpect(jsonPath("$.data.formattingNote").value("Formatting checks require a .docx upload"))
                .andReturn();

        String responseBody = analyzeResult.getResponse().getContentAsString();
        Map<String, Object> map = objectMapper.readValue(responseBody, Map.class);
        Map<String, Object> data = (Map<String, Object>) map.get("data");
        String analysisId = (String) data.get("analysisId");

        // 2. Call /api/v1/generate-fixed-resume using the text analysisId
        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("analysisId", analysisId))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.originalScore").isNumber())
                .andExpect(jsonPath("$.data.improvedScore").isNumber())
                .andExpect(jsonPath("$.data.fixesApplied").isArray())
                .andExpect(jsonPath("$.data.downloadUrl", startsWith("/api/v1/download/fixed-resume/" + analysisId)));

        // 3. Download the generated fixed resume
        MvcResult downloadResult = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString("resume_original.docx")))
                .andReturn();

        byte[] downloadedBytes = downloadResult.getResponse().getContentAsByteArray();
        assertTrue(downloadedBytes.length > 0);

        try (XWPFDocument fixedDoc = new XWPFDocument(new java.io.ByteArrayInputStream(downloadedBytes))) {
            assertFalse(fixedDoc.getParagraphs().isEmpty());
        }
    }

    @Test
    void testBestFitEndpoint_ReturnsRankedResults() throws Exception {
        BestFitRequest request = new BestFitRequest(
                "Senior Java Spring Boot Engineer with AWS and Docker experience",
                List.of(
                        new BestFitRequest.JobDescriptionEntry("Python Developer", "Python, Django, FastAPI"),
                        new BestFitRequest.JobDescriptionEntry("Java Specialist", "Java, Spring Boot, AWS, Docker")
                )
        );

        mockMvc.perform(post("/api/v1/best-fit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.results").isArray())
                .andExpect(jsonPath("$.data.results[0].title").value("Java Specialist"))
                .andExpect(jsonPath("$.data.results[1].title").value("Python Developer"));
    }

    @Test
    void testTemplatesEndpoint_ReturnsCatalog() throws Exception {
        mockMvc.perform(get("/api/v1/templates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].id").value("classic-professional"))
                .andExpect(jsonPath("$.data[0].layoutType").value("SINGLE_COLUMN"))
                .andExpect(jsonPath("$.data[0].fontFamily").value("Times New Roman"))
                .andExpect(jsonPath("$.data[1].id").value("modern-sidebar"))
                .andExpect(jsonPath("$.data[1].layoutType").value("SIDEBAR_TWO_COLUMN"))
                .andExpect(jsonPath("$.data[1].accentColorHex").value("#1F2937"))
                .andExpect(jsonPath("$.data[2].id").value("compact-banner"))
                .andExpect(jsonPath("$.data[2].layoutType").value("BANNER_COMPACT"))
                .andExpect(jsonPath("$.data[2].accentColorHex").value("#0F766E"));
    }

    @Test
    void testGenerateFixedResume_WithTemplate_AppliesSuccessfully() throws Exception {
        // 1. Analyze text resume
        AnalysisRequest request = new AnalysisRequest();
        request.setResumeText("""
                Grace Hopper
                grace@navy.mil | 555-0144
                SUMMARY
                Pioneer of computer programming and compiler development.
                EXPERIENCE
                Rear Admiral at US Navy
                - Created first compiler for programming languages
                SKILLS
                COBOL, Compilers, Systems
                """);
        request.setJobDescription("Looking for a software engineer with Compiler and Systems experience");

        MvcResult analyzeResult = mockMvc.perform(post("/api/v1/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> map = objectMapper.readValue(analyzeResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> data = (Map<String, Object>) map.get("data");
        String analysisId = (String) data.get("analysisId");

        // 2. Generate with "classic-professional" template
        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "analysisId", analysisId,
                                "templateId", "classic-professional"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.templateId").value("classic-professional"))
                .andExpect(jsonPath("$.data.templateName").value("Classic Professional"))
                .andExpect(jsonPath("$.data.fixesApplied", hasItem("Applied the 'Classic Professional' template")));

        // 3. Download and verify font is Times New Roman and cache-control headers
        MvcResult downloadResult = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId)
                        .param("templateId", "classic-professional"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", containsString("no-store")))
                .andExpect(header().string("Content-Disposition", containsString("resume_classic-professional.docx")))
                .andReturn();

        byte[] bytes = downloadResult.getResponse().getContentAsByteArray();
        try (XWPFDocument doc = new XWPFDocument(new java.io.ByteArrayInputStream(bytes))) {
            assertFalse(doc.getParagraphs().isEmpty());
            assertEquals("Times New Roman", doc.getParagraphs().get(0).getRuns().get(0).getFontFamily());
        }
    }

    @Test
    void testTemplateCycle_OriginalToTemplatesToOriginal() throws Exception {
        // Complete cycle: original -> classic-professional -> modern-sidebar -> compact-banner -> original
        AnalysisRequest request = new AnalysisRequest();
        request.setResumeText("""
                Alan Turing
                alan@bletchleypark.uk | 555-0101
                SUMMARY
                Mathematician, cryptanalyst, and computer scientist.
                EXPERIENCE
                Cryptanalyst at Bletchley Park
                - Designed Bombe machine to decipher Enigma
                SKILLS
                Cryptanalysis, Mathematics, Logic
                """);
        request.setJobDescription("Software engineer with Logic, Mathematics and Cryptanalysis");

        MvcResult analyzeResult = mockMvc.perform(post("/api/v1/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> map = objectMapper.readValue(analyzeResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> data = (Map<String, Object>) map.get("data");
        String analysisId = (String) data.get("analysisId");

        // 1. Generate Original
        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "analysisId", analysisId,
                                "templateId", "original"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.templateId").value("original"));

        byte[] origBytes1 = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsByteArray();

        // 2. Generate Classic Professional
        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "analysisId", analysisId,
                                "templateId", "classic-professional"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.templateId").value("classic-professional"));

        byte[] classicBytes = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsByteArray();

        // 3. Generate Modern Sidebar
        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "analysisId", analysisId,
                                "templateId", "modern-sidebar"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.templateId").value("modern-sidebar"));

        byte[] sidebarBytes = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsByteArray();

        // 4. Generate Compact Banner
        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "analysisId", analysisId,
                                "templateId", "compact-banner"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.templateId").value("compact-banner"));

        byte[] bannerBytes = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsByteArray();

        // 5. Generate Original again
        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "analysisId", analysisId,
                                "templateId", "original"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.templateId").value("original"));

        byte[] origBytes2 = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsByteArray();

        // Verify byte differences between templates
        assertFalse(Arrays.equals(origBytes1, classicBytes), "Original and Classic bytes should differ");
        assertFalse(Arrays.equals(classicBytes, sidebarBytes), "Classic and Sidebar bytes should differ");
        assertFalse(Arrays.equals(sidebarBytes, bannerBytes), "Sidebar and Banner bytes should differ");

        // Verify original layout restored identically
        assertEquals(origBytes1.length, origBytes2.length, "Restored original docx should match initial original length");
    }

    @Test
    void testGenerateFixedResume_WithInvalidTemplate_Returns400() throws Exception {
        AnalysisRequest request = new AnalysisRequest();
        request.setResumeText("Ada Lovelace\nada@analytical.org\nEXPERIENCE\nMathematician");
        request.setJobDescription("Looking for a Mathematician");

        MvcResult analyzeResult = mockMvc.perform(post("/api/v1/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> map = objectMapper.readValue(analyzeResult.getResponse().getContentAsString(), Map.class);
        String analysisId = (String) ((Map<String, Object>) map.get("data")).get("analysisId");

        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "analysisId", analysisId,
                                "templateId", "non-existent-template"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("Unknown templateId")));
    }

    @Test
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/healthz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("healthy"));
    }

    @Test
    void testCompareVersions_ScoresAndIdentifiesWinner() throws Exception {
        String resumeA = "Software developer skilled in Java and SQL.";
        String resumeB = "Senior software engineer skilled in Java, Spring Boot, Docker, and Kubernetes.";
        String jd = "Seeking a developer experienced with Java, Spring Boot, Docker, and Kubernetes.";

        mockMvc.perform(post("/api/v1/compare-versions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "resumeTextA", resumeA,
                                "resumeTextB", resumeB,
                                "jobDescription", jd
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.resultA.atsScore").isNumber())
                .andExpect(jsonPath("$.data.resultB.atsScore").isNumber())
                .andExpect(jsonPath("$.data.winner").value("B"))
                .andExpect(jsonPath("$.data.newlyAddedKeywords", hasItems("spring boot", "docker", "kubernetes")));
    }

    @Test
    void testAnalyzeQuality_CalculatesQualityMetricsAndFeedback() throws Exception {
        String resume = "John Doe\njohn.doe@example.com | (555) 123-4567\n\n" +
                "EXPERIENCE\n" +
                "- Architected a microservice architecture leading to 45% latency reduction across 12 services.\n" +
                "- Accelerated CI/CD build times by 30% saving 10 developer hours per week.\n" +
                "- Spearheaded cloud migration for 5 enterprise applications.\n\n" +
                "EDUCATION\n" +
                "Bachelor of Science in Computer Science\n\n" +
                "SKILLS\n" +
                "Java, Spring Boot, Docker";

        mockMvc.perform(post("/api/v1/analyze-quality")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("resumeText", resume))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.hasContactInfo").value(true))
                .andExpect(jsonPath("$.data.wordCount").isNumber())
                .andExpect(jsonPath("$.data.estimatedLength").isString())
                .andExpect(jsonPath("$.data.bulletPointCount").value(greaterThanOrEqualTo(3)))
                .andExpect(jsonPath("$.data.actionVerbUsageCount").value(greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$.data.measurableAchievementCount").value(greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$.data.qualityScore").value(greaterThanOrEqualTo(50)));
    }

    @Test
    void testAnalyzeQuality_WithWorkHistoryHeading_RecognizesExperienceAndChecksWording() throws Exception {
        String resume = "Jane Doe\njane@example.com\n\nWORK HISTORY\n- Developed microservices in Java.\n\nTECHNICAL SKILLS\nJava, SQL";

        mockMvc.perform(post("/api/v1/analyze-quality")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("resumeText", resume))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.missingSections", not(hasItem("Experience"))))
                .andExpect(jsonPath("$.data.missingSections", not(hasItem("Skills"))))
                .andExpect(jsonPath("$.data.missingSections", hasItem("Education")))
                .andExpect(jsonPath("$.data.improvementAreas", hasItem("Add the 'Education' section to meet standard ATS formatting")));
    }
}


