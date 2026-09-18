package com.resumeradar.service;

import com.resumeradar.dto.AtsResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AtsKeywordServiceTest {

    private AtsKeywordService service;

    @BeforeEach
    void setUp() {
        service = new AtsKeywordService();
    }

    @Test
    void testPerfectMatch() {
        String jd = "We are seeking a senior Java Spring Boot engineer with experience in Docker and Microservices Architecture.";
        String resume = "Experienced in Java, Spring Boot, Docker, and Microservices Architecture development.";

        AtsResult result = service.analyzeKeywords(resume, jd);
        System.out.println("ATS Score: " + result.getAtsScore());
        System.out.println("Matched: " + result.getMatchedKeywords());
        System.out.println("Missing: " + result.getMissingKeywords());

        assertTrue(result.getAtsScore() >= 50, "Score should reflect matched core keywords");
        assertTrue(result.getMatchedKeywords().contains("spring boot") || result.getMatchedKeywords().contains("java"));
    }

    @Test
    void testMissingKeywords() {
        String jd = "Requirements: Python, Kubernetes, Terraform, Machine Learning.";
        String resume = "Background in React, TypeScript, HTML, CSS, and UI/UX design.";

        AtsResult result = service.analyzeKeywords(resume, jd);

        assertTrue(result.getAtsScore() < 30, "Score should be low for disparate skillsets");
        assertTrue(result.getMissingKeywords().contains("python") || result.getMissingKeywords().contains("kubernetes"));
    }

    @Test
    void testEmptyInput() {
        AtsResult result = service.analyzeKeywords("", "");
        assertEquals(100, result.getAtsScore());
        assertTrue(result.getMatchedKeywords().isEmpty());
    }
}
