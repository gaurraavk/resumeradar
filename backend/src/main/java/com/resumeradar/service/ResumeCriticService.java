package com.resumeradar.service;

import com.resumeradar.dto.AiCritique;
import com.resumeradar.integration.GeminiClient;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ResumeCriticService {

    private final GeminiClient geminiClient;

    public ResumeCriticService(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
    }

    public Optional<AiCritique> critique(String resumeText, String jobDescription, String jobTitle) {
        return geminiClient.critiqueResume(resumeText, jobDescription, jobTitle);
    }
}
