package com.resumeradar.config;

import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.repository.ResumeTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class TemplateInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(TemplateInitializer.class);

    private final ResumeTemplateRepository resumeTemplateRepository;

    public TemplateInitializer(ResumeTemplateRepository resumeTemplateRepository) {
        this.resumeTemplateRepository = resumeTemplateRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("Synchronizing resume templates in resume_templates table...");

        // Delete legacy templates if they exist in the database
        List<String> legacyIds = List.of("classic", "modern", "fresher-focus", "executive");
        for (String oldId : legacyIds) {
            if (resumeTemplateRepository.existsById(oldId)) {
                resumeTemplateRepository.deleteById(oldId);
                log.info("Deleted legacy template: {}", oldId);
            }
        }

        // Upsert the 3 structurally different templates
        List<ResumeTemplate> newTemplates = List.of(
                new ResumeTemplate(
                        "classic-professional",
                        "Classic Professional",
                        "ATS-safe single column with centered header, ruled headings, and right-aligned dates",
                        "Times New Roman",
                        "#000000",
                        "CENTER",
                        "UPPER",
                        true,
                        List.of("SUMMARY", "EDUCATION", "EXPERIENCE", "PROJECTS", "SKILLS", "CERTIFICATIONS"),
                        "SINGLE_COLUMN"
                ),
                new ResumeTemplate(
                        "modern-sidebar",
                        "Modern Sidebar",
                        "Two-column layout with dark slate sidebar for contact, skills, and education",
                        "Calibri",
                        "#1F2937",
                        "LEFT",
                        "UPPER",
                        false,
                        List.of("SUMMARY", "EXPERIENCE", "PROJECTS", "SKILLS", "EDUCATION", "CERTIFICATIONS"),
                        "SIDEBAR_TWO_COLUMN"
                ),
                new ResumeTemplate(
                        "compact-banner",
                        "Compact Banner",
                        "ATS-safe single column with full-width teal banner and fresher-first hierarchy",
                        "Arial",
                        "#0F766E",
                        "LEFT",
                        "UPPER",
                        false,
                        List.of("EDUCATION", "EXPERIENCE", "PROJECTS", "SKILLS", "CERTIFICATIONS"),
                        "BANNER_COMPACT"
                )
        );

        resumeTemplateRepository.saveAll(newTemplates);
        log.info("Successfully synchronized {} resume templates.", newTemplates.size());
    }
}
