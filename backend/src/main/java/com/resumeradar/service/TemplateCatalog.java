package com.resumeradar.service;

import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.repository.ResumeTemplateRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TemplateCatalog {

    private static final List<String> PREFERRED_ORDER = List.of("classic", "modern", "fresher-focus", "executive");

    private static final List<ResumeTemplate> DEFAULT_TEMPLATES = List.of(
            new ResumeTemplate("classic", "Classic", "Traditional serif typography with centered header and academic-first layout", "Times New Roman", "#000000", "CENTER", "UPPER", true, List.of("EDUCATION", "EXPERIENCE", "PROJECTS", "SKILLS", "CERTIFICATIONS")),
            new ResumeTemplate("modern", "Modern", "Sleek sans-serif style with indigo accents and skills-forward hierarchy", "Calibri", "#4F46E5", "LEFT", "TITLE", false, List.of("SKILLS", "EXPERIENCE", "PROJECTS", "EDUCATION", "CERTIFICATIONS")),
            new ResumeTemplate("fresher-focus", "Fresher Focus", "Teal accents highlighting education and projects, best for students and early career", "Arial", "#0F766E", "LEFT", "UPPER", true, List.of("EDUCATION", "PROJECTS", "SKILLS", "CERTIFICATIONS", "EXPERIENCE")),
            new ResumeTemplate("executive", "Executive", "Distinguished navy Georgia serif emphasizing leadership and professional experience", "Georgia", "#1E3A8A", "CENTER", "UPPER", true, List.of("EXPERIENCE", "SKILLS", "EDUCATION", "PROJECTS", "CERTIFICATIONS"))
    );

    private final ResumeTemplateRepository resumeTemplateRepository;

    public TemplateCatalog() {
        this.resumeTemplateRepository = null;
    }

    @org.springframework.beans.factory.annotation.Autowired
    public TemplateCatalog(@org.springframework.beans.factory.annotation.Autowired(required = false) ResumeTemplateRepository resumeTemplateRepository) {
        this.resumeTemplateRepository = resumeTemplateRepository;
    }

    public List<ResumeTemplate> getAllTemplates() {
        if (resumeTemplateRepository != null) {
            List<ResumeTemplate> all = resumeTemplateRepository.findAll();
            all.sort(Comparator.comparingInt(t -> {
                int idx = PREFERRED_ORDER.indexOf(t.getId().toLowerCase());
                return idx != -1 ? idx : Integer.MAX_VALUE;
            }));
            return all;
        }
        return new ArrayList<>(DEFAULT_TEMPLATES);
    }

    public Optional<ResumeTemplate> findById(String id) {
        if (id == null || id.isBlank()) return Optional.empty();
        String slug = id.trim().toLowerCase();
        if (resumeTemplateRepository != null) {
            return resumeTemplateRepository.findByIdIgnoreCase(slug);
        }
        return DEFAULT_TEMPLATES.stream().filter(t -> t.getId().equalsIgnoreCase(slug)).findFirst();
    }

    public ResumeTemplate getById(String id) {
        return findById(id).orElseThrow(() -> new IllegalArgumentException("Unknown templateId: " + id));
    }

    public boolean isValidTemplateId(String id) {
        if (id == null || id.isBlank()) return false;
        return findById(id).isPresent();
    }
}
