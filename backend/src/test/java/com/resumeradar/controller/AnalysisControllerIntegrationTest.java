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
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
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
                .andExpect(jsonPath("$.data.downloadUrl").value("/api/v1/download/fixed-resume/" + analysisId));

        // 4. Call /api/v1/download/fixed-resume/{analysisId}
        MvcResult downloadResult = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString("fixed_resume.docx")))
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
                .andExpect(jsonPath("$.data.downloadUrl").value("/api/v1/download/fixed-resume/" + analysisId));

        // 3. Download the generated fixed resume
        MvcResult downloadResult = mockMvc.perform(get("/api/v1/download/fixed-resume/" + analysisId))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString("fixed_resume.docx")))
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
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/healthz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("healthy"));
    }
}
