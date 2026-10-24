package com.resumeradar.service;

import com.resumeradar.model.ResumeTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TemplateCatalog {

    private final Map<String, ResumeTemplate> templates = new LinkedHashMap<>();

    public TemplateCatalog() {
        register(new ResumeTemplate(
                "classic",
                "Classic",
                "Traditional serif typography with centered header and academic-first layout",
                "Times New Roman",
                "#000000",
                "CENTER",
                "UPPER",
                true,
                List.of("EDUCATION", "EXPERIENCE", "PROJECTS", "SKILLS", "CERTIFICATIONS")
        ));

        register(new ResumeTemplate(
                "modern",
                "Modern",
                "Sleek sans-serif style with indigo accents and skills-forward hierarchy",
                "Calibri",
                "#4F46E5",
                "LEFT",
                "TITLE",
                false,
                List.of("SKILLS", "EXPERIENCE", "PROJECTS", "EDUCATION", "CERTIFICATIONS")
        ));

        register(new ResumeTemplate(
                "fresher-focus",
                "Fresher Focus",
                "Teal accents highlighting education and projects, best for students and early career",
                "Arial",
                "#0F766E",
                "LEFT",
                "UPPER",
                true,
                List.of("EDUCATION", "PROJECTS", "SKILLS", "CERTIFICATIONS", "EXPERIENCE")
        ));

        register(new ResumeTemplate(
                "executive",
                "Executive",
                "Distinguished navy Georgia serif emphasizing leadership and professional experience",
                "Georgia",
                "#1E3A8A",
                "CENTER",
                "UPPER",
                true,
                List.of("EXPERIENCE", "SKILLS", "EDUCATION", "PROJECTS", "CERTIFICATIONS")
        ));
    }

    private void register(ResumeTemplate template) {
        templates.put(template.getId().toLowerCase(), template);
    }

    public List<ResumeTemplate> getAllTemplates() {
        return new ArrayList<>(templates.values());
    }

    public Optional<ResumeTemplate> findById(String id) {
        if (id == null) return Optional.empty();
        return Optional.ofNullable(templates.get(id.trim().toLowerCase()));
    }

    public ResumeTemplate getById(String id) {
        return findById(id).orElseThrow(() -> new IllegalArgumentException("Unknown templateId: " + id));
    }

    public boolean isValidTemplateId(String id) {
        if (id == null) return false;
        return templates.containsKey(id.trim().toLowerCase());
    }
}
