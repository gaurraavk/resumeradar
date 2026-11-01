package com.resumeradar.service;

import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.service.renderer.ClassicProfessionalRenderer;
import com.resumeradar.service.renderer.CompactBannerRenderer;
import com.resumeradar.service.renderer.ModernSidebarRenderer;
import org.apache.poi.xwpf.usermodel.*;
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
    private ClassicProfessionalRenderer classicRenderer;
    private ModernSidebarRenderer sidebarRenderer;
    private CompactBannerRenderer bannerRenderer;

    @BeforeEach
    void setUp() {
        parser = new ResumeSectionParser();
        catalog = new TemplateCatalog();
        classicRenderer = new ClassicProfessionalRenderer();
        sidebarRenderer = new ModernSidebarRenderer();
        bannerRenderer = new CompactBannerRenderer();
        templateService = new TemplateResumeService(parser, List.of(classicRenderer, sidebarRenderer, bannerRenderer));
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
                Senior Software Engineer at Acme Corp | 2021 - Present
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

        Set<String> parsedContent = new HashSet<>();
        parsedContent.add(parsed.getCandidateName());
        parsedContent.addAll(parsed.getContactLines());
        for (Map.Entry<String, List<String>> entry : parsed.getSections().entrySet()) {
            parsedContent.addAll(entry.getValue());
        }

        for (String line : inputLines) {
            String headingKey = parser.detectHeadingKey(line);
            if (headingKey != null) {
                assertTrue(parsed.getSections().containsKey(headingKey) || headingKey.equals("OTHER"),
                        "Expected section for heading: " + line);
            } else {
                assertTrue(parsedContent.contains(line),
                        "Line was dropped from parsed output: " + line);
            }
        }
    }

    @Test
    void testClassicProfessionalRenderer_StructureAndContent() throws IOException {
        String input = """
                Robert C. Martin
                unclebob@cleancode.org | 555-867-5309 | Chicago, IL
                SUMMARY
                Software craftsman advocating for clean code, design patterns, and TDD.
                EDUCATION
                BS in Computer Science, University of Illinois | 1974 - 1978
                EXPERIENCE
                Founder and Consultant at Clean Coders LLC | 2000 - Present
                - Authored seminal books on agile software craftsmanship
                - Trained thousands of software engineers worldwide
                PROJECTS
                FitNesse Acceptance Testing Framework | 2002 - 2010
                - Created wiki-based integration testing tool
                SKILLS
                Java, C++, Agile, Clean Architecture, Refactoring
                CERTIFICATIONS
                Certified Scrum Master
                """;

        ResumeTemplate tmpl = catalog.getById("classic-professional");
        byte[] docxBytes = templateService.render(input, tmpl);

        assertNotNull(docxBytes);
        assertTrue(docxBytes.length > 500);

        try (XWPFDocument doc = new XWPFDocument(new ByteArrayInputStream(docxBytes))) {
            // ATS-safe single column: no multi-column tables
            assertEquals(0, doc.getTables().size(), "Classic professional should have no tables");

            List<XWPFParagraph> paragraphs = doc.getParagraphs();
            assertFalse(paragraphs.isEmpty());

            // Centered name
            XWPFParagraph namePara = paragraphs.get(0);
            assertEquals(ParagraphAlignment.CENTER, namePara.getAlignment());
            assertTrue(namePara.getText().contains("Robert C. Martin"));

            // Centered contact line with border
            XWPFParagraph contactPara = paragraphs.get(1);
            assertEquals(ParagraphAlignment.CENTER, contactPara.getAlignment());
            assertTrue(contactPara.getText().contains("unclebob@cleancode.org"));

            // Full text content check: ensure nothing was dropped
            String fullText = extractDocumentText(doc);
            assertTrue(fullText.contains("Robert C. Martin"));
            assertTrue(fullText.contains("unclebob@cleancode.org"));
            assertTrue(fullText.contains("Clean Coders LLC"));
            assertTrue(fullText.contains("FitNesse"));
            assertTrue(fullText.contains("Refactoring"));
            assertTrue(fullText.contains("Certified Scrum Master"));
        }
    }

    @Test
    void testModernSidebarRenderer_TwoColumnStructureAndColors() throws IOException {
        String input = """
                Grace Hopper
                grace@navy.mil | 555-123-4567 | Arlington, VA
                SUMMARY
                Pioneering computer scientist and United States Navy rear admiral.
                EDUCATION
                PhD in Mathematics, Yale University
                EXPERIENCE
                Director at Navy Programming Languages Group
                - Led development of compiler standards and COBOL language
                PROJECTS
                A-0 Compiler System
                - Invented first compiler for electronic computer
                SKILLS
                Compilers, Machine Architecture, COBOL, Fortran, Assembly
                CERTIFICATIONS
                National Medal of Technology
                """;

        ResumeTemplate tmpl = catalog.getById("modern-sidebar");
        byte[] docxBytes = templateService.render(input, tmpl);

        assertNotNull(docxBytes);
        assertTrue(docxBytes.length > 500);

        try (XWPFDocument doc = new XWPFDocument(new ByteArrayInputStream(docxBytes))) {
            // Modern sidebar must contain a 2-column table
            assertEquals(1, doc.getTables().size(), "Modern sidebar should contain exactly 1 two-column layout table");
            XWPFTable table = doc.getTables().get(0);
            assertEquals(1, table.getRows().size());
            assertEquals(2, table.getRow(0).getTableCells().size(), "Table must have 2 columns");

            XWPFTableCell leftCell = table.getRow(0).getCell(0);
            XWPFTableCell rightCell = table.getRow(0).getCell(1);

            // Shaded dark slate background on left cell
            assertEquals("1F2937", leftCell.getColor());

            // Candidate name in left cell
            String leftText = extractCellText(leftCell);
            assertTrue(leftText.contains("Grace Hopper"));
            assertTrue(leftText.contains("grace@navy.mil"));
            assertTrue(leftText.contains("Compilers, Machine Architecture"));
            assertTrue(leftText.contains("Yale University"));

            // Summary & experience in right cell
            String rightText = extractCellText(rightCell);
            assertTrue(rightText.contains("Pioneering computer scientist"));
            assertTrue(rightText.contains("Navy Programming Languages Group"));
            assertTrue(rightText.contains("A-0 Compiler System"));
        }
    }

    @Test
    void testCompactBannerRenderer_BannerHeaderAndPipeSkills() throws IOException {
        String input = """
                Ada Lovelace
                ada@analyticalengine.org | 555-987-6543 | London, UK
                SUMMARY
                Mathematician known for work on Charles Babbage's mechanical computer.
                EDUCATION
                Private Tutoring in Mathematics & Science, London
                EXPERIENCE
                Collaborator with Charles Babbage
                - Created first algorithm intended to be executed by a machine
                PROJECTS
                Bernoulli Numbers Algorithm
                - Translated and annotated Menabrea's memoir
                SKILLS
                Algorithm Design
                Mathematical Analysis
                Symbolic Logic
                French Translation
                CERTIFICATIONS
                Fellow of Scientific Society
                """;

        ResumeTemplate tmpl = catalog.getById("compact-banner");
        byte[] docxBytes = templateService.render(input, tmpl);

        assertNotNull(docxBytes);
        assertTrue(docxBytes.length > 500);

        try (XWPFDocument doc = new XWPFDocument(new ByteArrayInputStream(docxBytes))) {
            // Compact banner has a 1-row, 1-cell header band table
            assertEquals(1, doc.getTables().size(), "Compact banner should contain 1 header table");
            XWPFTable banner = doc.getTables().get(0);
            assertEquals(1, banner.getRows().size());
            assertEquals(1, banner.getRow(0).getTableCells().size());

            XWPFTableCell bannerCell = banner.getRow(0).getCell(0);
            assertEquals("0F766E", bannerCell.getColor(), "Header banner must be dark teal #0F766E");

            String bannerText = extractCellText(bannerCell);
            assertTrue(bannerText.contains("Ada Lovelace"));
            assertTrue(bannerText.contains("ada@analyticalengine.org"));

            // Below banner: single-column body with pipe-separated skills
            String docText = extractDocumentText(doc);
            assertTrue(docText.contains("Algorithm Design | Mathematical Analysis | Symbolic Logic | French Translation"),
                    "Skills should be rendered in pipe-separated compact form");
            assertTrue(docText.contains("Private Tutoring"));
            assertTrue(docText.contains("Collaborator with Charles Babbage"));
            assertTrue(docText.contains("Bernoulli Numbers Algorithm"));
        }
    }

    @Test
    void testAllTemplatesExistAndRenderFallbackWithoutThrowing() {
        String unstructuredText = """
                Linus Torvalds
                linus@linuxfoundation.org
                Created Linux kernel in 1991.
                Maintains Git version control system.
                Recipient of Millennium Technology Prize.
                """;

        List<ResumeTemplate> templates = catalog.getAllTemplates();
        assertEquals(3, templates.size());

        for (ResumeTemplate tmpl : templates) {
            byte[] bytes = templateService.render(unstructuredText, tmpl);
            assertNotNull(bytes, "Template " + tmpl.getId() + " failed to render fallback");
            assertTrue(bytes.length > 300);
        }
    }

    private String extractDocumentText(XWPFDocument doc) {
        StringBuilder sb = new StringBuilder();
        for (XWPFParagraph p : doc.getParagraphs()) {
            sb.append(p.getText()).append("\n");
        }
        for (XWPFTable t : doc.getTables()) {
            for (XWPFTableRow r : t.getRows()) {
                for (XWPFTableCell c : r.getTableCells()) {
                    sb.append(extractCellText(c)).append("\n");
                }
            }
        }
        return sb.toString();
    }

    private String extractCellText(XWPFTableCell cell) {
        StringBuilder sb = new StringBuilder();
        for (XWPFParagraph p : cell.getParagraphs()) {
            sb.append(p.getText()).append(" ");
        }
        return sb.toString();
    }
}
