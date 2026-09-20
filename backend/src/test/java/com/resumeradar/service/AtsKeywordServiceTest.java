package com.resumeradar.service;

import com.resumeradar.dto.AtsResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

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

    @Test
    void testDetectRepeatedKeywords() {
        String resume = "Java is my favorite language. I have 5 years of Java experience. " +
                "I built Java microservices and Java web apps. Java performance tuning is great. " +
                "Java backend systems and Java frameworks using modern Java.";
        // Java appears 8 times (> 6 threshold)
        List<String> warnings = service.detectRepeatedKeywords(resume);
        assertNotNull(warnings);
        assertFalse(warnings.isEmpty(), "Should have repeated keyword warnings");
        assertTrue(warnings.stream().anyMatch(w -> w.contains("'Java' appears 8 times")),
                "Should flag Java with exact count 8: " + warnings);
        assertTrue(warnings.get(0).contains("unnatural to ATS systems"));
    }

    @Test
    void testDetectRepeatedKeywordsUnderThreshold() {
        String resume = "Java is great. Python is great. We use Docker and Kubernetes for microservices.";
        List<String> warnings = service.detectRepeatedKeywords(resume);
        assertTrue(warnings.isEmpty(), "Words appearing <= 6 times should not trigger warnings");
    }

    @Test
    void testDetectMissingSections() {
        // Contains Education, Experience, Skills, but missing Projects and Certifications
        String resume = "Education: BS Computer Science. Experience: Software Engineer at Acme. Skills: Java, Spring.";
        List<String> missing = service.detectMissingSections(resume);
        assertNotNull(missing);
        assertTrue(missing.contains("Projects"), "Should detect missing Projects");
        assertTrue(missing.contains("Certifications"), "Should detect missing Certifications");
        assertFalse(missing.contains("Education"), "Should find Education");
        assertFalse(missing.contains("Experience"), "Should find Experience");
        assertFalse(missing.contains("Skills"), "Should find Skills");
    }

    @Test
    void testDetectMissingSectionsAllPresent() {
        String resume = "Education: BS. Experience: Acme. Skills: Java. Projects: Web App. Certifications: AWS.";
        List<String> missing = service.detectMissingSections(resume);
        assertTrue(missing.isEmpty(), "No missing sections when all 5 are present");
    }

    @Test
    void testAnalyzeWeakSentences() {
        ResumeFixService fixService = new ResumeFixService(new AnalysisSessionStore());
        fixService.init();

        String resume = "I worked on cloud architecture and helped the team build pipelines.\n" +
                "I was responsible for microservices and attempted to improve latency.\n" +
                "Engineered high-throughput event processing platform with Kafka.\n" +
                "Designed fault-tolerant distributed storage cluster.";

        ResumeFixService.WeakSentenceAnalysis analysis = fixService.analyzeWeakSentences(resume);
        assertNotNull(analysis);
        assertEquals(4, analysis.getTotalSentenceCount(), "Should parse 4 bullet sentences");
        assertEquals(2, analysis.getWeakSentenceCount(), "Should detect weak phrases in first 2 sentences");
        assertFalse(analysis.getWeakSentenceExamples().isEmpty());
        assertTrue(analysis.getWeakSentenceExamples().size() <= 3);
        assertTrue(analysis.getWeakSentenceExamples().get(0).contains("worked on") || analysis.getWeakSentenceExamples().get(0).contains("helped"));
    }
}
