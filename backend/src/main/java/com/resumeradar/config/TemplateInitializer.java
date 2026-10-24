package com.resumeradar.config;

import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.repository.ResumeTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TemplateInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(TemplateInitializer.class);

    private final ResumeTemplateRepository resumeTemplateRepository;

    public TemplateInitializer(ResumeTemplateRepository resumeTemplateRepository) {
        this.resumeTemplateRepository = resumeTemplateRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (resumeTemplateRepository.count() == 0) {
            log.info("Seeding resume templates into resume_templates table...");
            resumeTemplateRepository.saveAll(List.of(
                    new ResumeTemplate(
                            "classic",
                            "Classic",
                            "Traditional serif typography with centered header and academic-first layout",
                            "Times New Roman",
                            "#000000",
                            "CENTER",
                            "UPPER",
                            true,
                            List.of("EDUCATION", "EXPERIENCE", "PROJECTS", "SKILLS", "CERTIFICATIONS")
                    ),
                    new ResumeTemplate(
                            "modern",
                            "Modern",
                            "Sleek sans-serif style with indigo accents and skills-forward hierarchy",
                            "Calibri",
                            "#4F46E5",
                            "LEFT",
                            "TITLE",
                            false,
                            List.of("SKILLS", "EXPERIENCE", "PROJECTS", "EDUCATION", "CERTIFICATIONS")
                    ),
                    new ResumeTemplate(
                            "fresher-focus",
                            "Fresher Focus",
                            "Teal accents highlighting education and projects, best for students and early career",
                            "Arial",
                            "#0F766E",
                            "LEFT",
                            "UPPER",
                            true,
                            List.of("EDUCATION", "PROJECTS", "SKILLS", "CERTIFICATIONS", "EXPERIENCE")
                    ),
                    new ResumeTemplate(
                            "executive",
                            "Executive",
                            "Distinguished navy Georgia serif emphasizing leadership and professional experience",
                            "Georgia",
                            "#1E3A8A",
                            "CENTER",
                            "UPPER",
                            true,
                            List.of("EXPERIENCE", "SKILLS", "EDUCATION", "PROJECTS", "CERTIFICATIONS")
                    )
            ));
            log.info("Successfully seeded 4 resume templates.");
        }
    }
}
