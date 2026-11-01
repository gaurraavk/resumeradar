package com.resumeradar.service;

import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.service.renderer.ResumeRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TemplateResumeService {

    private static final Logger logger = LoggerFactory.getLogger(TemplateResumeService.class);

    private final ResumeSectionParser sectionParser;
    private final Map<String, ResumeRenderer> renderersByLayoutType = new HashMap<>();
    private ResumeRenderer defaultRenderer;

    public TemplateResumeService(ResumeSectionParser sectionParser) {
        this(sectionParser, List.of(
                new com.resumeradar.service.renderer.ClassicProfessionalRenderer(),
                new com.resumeradar.service.renderer.ModernSidebarRenderer(),
                new com.resumeradar.service.renderer.CompactBannerRenderer()
        ));
    }

    @org.springframework.beans.factory.annotation.Autowired
    public TemplateResumeService(ResumeSectionParser sectionParser, List<ResumeRenderer> renderers) {
        this.sectionParser = sectionParser;
        for (ResumeRenderer renderer : renderers) {
            this.renderersByLayoutType.put(renderer.getLayoutType(), renderer);
            if ("SINGLE_COLUMN".equalsIgnoreCase(renderer.getLayoutType())) {
                this.defaultRenderer = renderer;
            }
        }
        if (this.defaultRenderer == null && !renderers.isEmpty()) {
            this.defaultRenderer = renderers.get(0);
        }
    }

    public byte[] render(String fixedResumeText, ResumeTemplate template) {
        ResumeSectionParser.ParsedResume parsed = sectionParser.parse(fixedResumeText);
        return render(parsed, template);
    }

    public byte[] render(ResumeSectionParser.ParsedResume parsed, ResumeTemplate template) {
        if (template == null) {
            throw new IllegalArgumentException("ResumeTemplate cannot be null");
        }

        ResumeRenderer renderer = selectRenderer(template);
        logger.info("Rendering resume for template '{}' using renderer layout '{}'", template.getId(), renderer.getLayoutType());
        return renderer.render(parsed, template);
    }

    private ResumeRenderer selectRenderer(ResumeTemplate template) {
        String layoutType = template.getLayoutType();
        if (layoutType != null && renderersByLayoutType.containsKey(layoutType)) {
            return renderersByLayoutType.get(layoutType);
        }

        // Fallback by ID if layoutType was not set
        String id = template.getId() != null ? template.getId().toLowerCase() : "";
        if (id.contains("sidebar")) {
            ResumeRenderer r = renderersByLayoutType.get("SIDEBAR_TWO_COLUMN");
            if (r != null) return r;
        } else if (id.contains("banner") || id.contains("compact")) {
            ResumeRenderer r = renderersByLayoutType.get("BANNER_COMPACT");
            if (r != null) return r;
        }

        return defaultRenderer;
    }
}
