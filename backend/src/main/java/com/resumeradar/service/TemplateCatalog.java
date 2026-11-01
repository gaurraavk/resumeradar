package com.resumeradar.service;

import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.repository.ResumeTemplateRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TemplateCatalog {

    private static final List<String> PREFERRED_ORDER = List.of("classic-professional", "modern-sidebar", "compact-banner");

    private static final List<ResumeTemplate> DEFAULT_TEMPLATES = List.of(
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

    // Fallbacks for legacy template IDs so old history records or queries resolve gracefully
    private static final Map<String, String> LEGACY_MAPPING = Map.of(
            "classic", "classic-professional",
            "modern", "modern-sidebar",
            "fresher-focus", "compact-banner",
            "executive", "classic-professional"
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
            Optional<ResumeTemplate> found = resumeTemplateRepository.findByIdIgnoreCase(slug);
            if (found.isPresent()) return found;
        }

        Optional<ResumeTemplate> def = DEFAULT_TEMPLATES.stream().filter(t -> t.getId().equalsIgnoreCase(slug)).findFirst();
        if (def.isPresent()) return def;

        // Fallback for legacy ID
        if (LEGACY_MAPPING.containsKey(slug)) {
            String mapped = LEGACY_MAPPING.get(slug);
            return findById(mapped);
        }

        return Optional.empty();
    }

    public ResumeTemplate getById(String id) {
        return findById(id).orElseThrow(() -> new IllegalArgumentException("Unknown templateId: " + id));
    }

    public boolean isValidTemplateId(String id) {
        if (id == null || id.isBlank()) return false;
        return findById(id).isPresent();
    }
}
