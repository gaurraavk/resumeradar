package com.resumeradar.service.renderer;

import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.service.ResumeSectionParser;

public interface ResumeRenderer {
    byte[] render(ResumeSectionParser.ParsedResume parsed, ResumeTemplate template);
    String getLayoutType();
}
