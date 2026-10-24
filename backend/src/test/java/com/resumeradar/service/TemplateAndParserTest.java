package com.resumeradar.service;

import com.resumeradar.model.ResumeTemplate;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class TemplateAndParserTest {

    private ResumeSectionParser parser;
    private TemplateCatalog catalog;
    private TemplateResumeService templateService;

    @BeforeEach
    void setUp() {
        parser = new ResumeSectionParser();
        catalog = new TemplateCatalog();
        templateService = new TemplateResumeService(parser);
    }

    @Test
    void testParser_StandardResume() {
        String input = """
                Jane Doe
                jane.doe@example.com | +1 (555) 019-2834 | linkedin.com/in/janedoe | github.com/janedoe
                SUMMARY
                Results-driven software engineer with 5 years experience in distributed systems.
                EDUCATION
                BS in Computer Science, Stanford University
                EXPERIENCE
                Senior Software Engineer at Acme Corp
                - Architected cloud native microservices using Java and Spring Boot
                - Improved API latency by 45%
                PROJECTS
                Distributed Task Queue
                - Developed async task worker in Go
                SKILLS
                Java, Spring Boot, Docker, Kubernetes, AWS, PostgreSQL
                CERTIFICATIONS
                AWS Certified Solutions Architect
                """;

        ResumeSectionParser.ParsedResume parsed = parser.parse(input);

        assertEquals("Jane Doe", parsed.getCandidateName());
        assertEquals(1, parsed.getContactLines().size());
        assertTrue(parsed.getContactLines().get(0).contains("jane.doe@example.com"));
        assertFalse(parsed.isFallbackNoHeadings());

        assertTrue(parsed.hasSection("SUMMARY"));
        assertTrue(parsed.hasSection("EDUCATION"));
        assertTrue(parsed.hasSection("EXPERIENCE"));
        assertTrue(parsed.hasSection("PROJECTS"));
        assertTrue(parsed.hasSection("SKILLS"));
        assertTrue(parsed.hasSection("CERTIFICATIONS"));

        assertEquals("Results-driven software engineer with 5 years experience in distributed systems.",
                parsed.getSectionLines("SUMMARY").get(0));
    }

    @Test
    void testParser_AliasHeadings() {
        String input = """
                Alex Johnson
                alex@tech.org
                Career Objective:
                Passionate developer eager to contribute.
                Educational Background:
                B.Tech in Information Technology
                Work Experience:
                Software Developer Intern at Startup Inc
                * Built REST endpoints
                Academic Projects:
                E-Commerce Portal in React
                Technical Skills:
                Python, Django, React, SQL
                Achievements:
                Dean's Honor List 2023
                """;

        ResumeSectionParser.ParsedResume parsed = parser.parse(input);

        assertEquals("Alex Johnson", parsed.getCandidateName());
        assertTrue(parsed.hasSection("SUMMARY"));
        assertTrue(parsed.hasSection("EDUCATION"));
        assertTrue(parsed.hasSection("EXPERIENCE"));
        assertTrue(parsed.hasSection("PROJECTS"));
        assertTrue(parsed.hasSection("SKILLS"));
        assertTrue(parsed.hasSection("CERTIFICATIONS"));
    }

    @Test
    void testParser_NoHeadingsFallback() {
        String input = """
                Michael Scott
                michael@dundermifflin.com | 555-0100
                Regional Manager with over 15 years leading paper distribution.
                Known for innovative management styles and motivational speaking.
                Top salesman of the company two years in a row.
                """;

        ResumeSectionParser.ParsedResume parsed = parser.parse(input);

        assertEquals("Michael Scott", parsed.getCandidateName());
        assertTrue(parsed.isFallbackNoHeadings());
        assertEquals(1, parsed.getContactLines().size());
        assertTrue(parsed.hasSection("OTHER"));
        assertEquals(3, parsed.getSectionLines("OTHER").size());
    }

    @Test
    void testParser_ContactDetection() {
        String input = """
                Sarah Connor
                sarah@resistance.net
                Tel: +1-800-555-0199
                linkedin.com/in/sarah-connor
                github.com/terminator-hunter
                SKILLS
                Strategic planning, Defense systems
                """;

        ResumeSectionParser.ParsedResume parsed = parser.parse(input);

        assertEquals("Sarah Connor", parsed.getCandidateName());
        assertEquals(4, parsed.getContactLines().size());
        assertTrue(parser.isContactLine("sarah@resistance.net"));
        assertTrue(parser.isContactLine("Tel: +1-800-555-0199"));
        assertTrue(parser.isContactLine("linkedin.com/in/sarah-connor"));
        assertTrue(parser.isContactLine("github.com/terminator-hunter"));
        assertFalse(parser.isContactLine("Strategic planning, Defense systems"));
    }

    @Test
    void testParser_NothingDropped() {
        String input = """
                Alice Walker
                alice@walker.com | 555-1234
                Lead Software Architect
                SUMMARY
                Expert architect with 10 years experience.
                EXPERIENCE
                Senior Architect at BigTech
                - Spearheaded enterprise migration
                SKILLS
                Java, Kotlin, Architecture
                VOLUNTEER WORK
                Mentored high school robotics club
                """;

        ResumeSectionParser.ParsedResume parsed = parser.parse(input);

        List<String> inputLines = Arrays.stream(input.split("\r?\n"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        // Collect all parsed content lines
        Set<String> parsedContent = new HashSet<>();
        parsedContent.add(parsed.getCandidateName());
        parsedContent.addAll(parsed.getContactLines());
        for (Map.Entry<String, List<String>> entry : parsed.getSections().entrySet()) {
            parsedContent.addAll(entry.getValue());
        }

        for (String line : inputLines) {
            String headingKey = parser.detectHeadingKey(line);
            if (headingKey != null) {
                // Was recognized as a heading, so section exists
                assertTrue(parsed.getSections().containsKey(headingKey) || headingKey.equals("OTHER"),
                        "Expected section for heading: " + line);
            } else {
                assertTrue(parsedContent.contains(line),
                        "Line was dropped from parsed output: " + line);
            }
        }
    }

    @Test
    void testRenderer_AllTemplates_ValidDocxAndHeadingOrder() throws IOException {
        String input = """
                Robert C. Martin
                unclebob@cleancode.org | 555-867-5309 | linkedin.com/in/unclebob
                SUMMARY
                Software craftsman advocating for clean code, design patterns, and TDD.
                EDUCATION
                BS in Computer Science, University of Illinois
                EXPERIENCE
                Founder and Consultant at Clean Coders LLC
                - Authored seminal books on agile software craftsmanship
                - Trained thousands of software engineers worldwide
                PROJECTS
                FitNesse Acceptance Testing Framework
                - Created wiki-based integration testing tool
                SKILLS
                Java, C++, Agile, Clean Architecture, Refactoring
                CERTIFICATIONS
                Certified Scrum Master
                """;

        List<ResumeTemplate> templates = catalog.getAllTemplates();
        assertEquals(4, templates.size());

        for (ResumeTemplate template : templates) {
            byte[] docxBytes = templateService.render(input, template);

            assertNotNull(docxBytes, "Docx bytes must not be null for " + template.getId());
            assertTrue(docxBytes.length > 500, "Docx file size should be substantial for " + template.getId());

            // Check PK magic bytes (0x50, 0x4B, 0x03, 0x04)
            assertEquals((byte) 0x50, docxBytes[0]);
            assertEquals((byte) 0x4B, docxBytes[1]);
            assertEquals((byte) 0x03, docxBytes[2]);
            assertEquals((byte) 0x04, docxBytes[3]);

            try (XWPFDocument doc = new XWPFDocument(new ByteArrayInputStream(docxBytes))) {
                List<XWPFParagraph> paragraphs = doc.getParagraphs();
                assertFalse(paragraphs.isEmpty(), "Document must contain paragraphs for " + template.getId());

                // 1. First paragraph is the candidate name
                XWPFParagraph firstPara = paragraphs.get(0);
                assertEquals("Robert C. Martin", firstPara.getText().trim());
                assertFalse(firstPara.getRuns().isEmpty());
                XWPFRun nameRun = firstPara.getRuns().get(0);
                assertEquals(template.getFontFamily(), nameRun.getFontFamily());
                assertEquals(24, nameRun.getFontSize());
                assertTrue(nameRun.isBold());

                // 2. Section headings appear in template's sectionOrder
                List<String> renderedHeadingTexts = new ArrayList<>();
                for (XWPFParagraph p : paragraphs) {
                    for (XWPFRun r : p.getRuns()) {
                        if (r.isBold() && r.getFontSize() == 12) {
                            renderedHeadingTexts.add(p.getText().trim().toUpperCase());
                            break;
                        }
                    }
                }

                // SUMMARY is always right after contact line (first heading)
                assertFalse(renderedHeadingTexts.isEmpty());
                assertEquals("SUMMARY", renderedHeadingTexts.get(0));

                // Remaining headings match template section order
                List<String> expectedSubOrder = new ArrayList<>();
                for (String sectionKey : template.getSectionOrder()) {
                    expectedSubOrder.add(sectionKey.toUpperCase());
                }

                List<String> remainingRendered = renderedHeadingTexts.subList(1, renderedHeadingTexts.size());
                assertEquals(expectedSubOrder, remainingRendered,
                        "Headings for template " + template.getId() + " did not match expected sectionOrder");

                // 3. Font family applied to runs
                for (XWPFParagraph p : paragraphs) {
                    for (XWPFRun r : p.getRuns()) {
                        assertEquals(template.getFontFamily(), r.getFontFamily(),
                                "Font family mismatch in template " + template.getId());
                    }
                }

                // 4. Every non-empty line of the input text appears in the output
                StringBuilder fullDocText = new StringBuilder();
                for (XWPFParagraph p : paragraphs) {
                    fullDocText.append(p.getText()).append("\n");
                }
                String docString = fullDocText.toString();

                String[] rawLines = input.split("\r?\n");
                for (String line : rawLines) {
                    String trimmed = line.trim();
                    if (trimmed.isEmpty()) continue;
                    String clean = trimmed.replaceAll("^[\\-*•–—]\\s*", "");
                    assertTrue(docString.toLowerCase().contains(clean.toLowerCase()),
                            "Document for " + template.getId() + " is missing line: " + clean);
                }
            }
        }
    }

    @Test
    void testRenderer_NoHeadingsFallbackPreservesAllText() throws IOException {
        String input = """
                Alan Turing
                alan@bletchleypark.uk
                Mathematician, computer scientist, and cryptanalyst.
                Designed the Bombe machine to decipher Enigma messages.
                Pioneered theoretical computer science with the Turing machine.
                """;

        ResumeTemplate modern = catalog.getById("modern");
        byte[] docxBytes = templateService.render(input, modern);

        try (XWPFDocument doc = new XWPFDocument(new ByteArrayInputStream(docxBytes))) {
            List<XWPFParagraph> paragraphs = doc.getParagraphs();
            assertEquals("Alan Turing", paragraphs.get(0).getText().trim());

            StringBuilder docText = new StringBuilder();
            for (XWPFParagraph p : paragraphs) {
                docText.append(p.getText()).append("\n");
            }

            assertTrue(docText.toString().contains("alan@bletchleypark.uk"));
            assertTrue(docText.toString().contains("Mathematician, computer scientist"));
            assertTrue(docText.toString().contains("Designed the Bombe machine"));
            assertTrue(docText.toString().contains("Pioneered theoretical computer science"));
        }
    }
}
