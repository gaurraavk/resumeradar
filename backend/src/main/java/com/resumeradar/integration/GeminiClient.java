package com.resumeradar.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeradar.dto.AiCritique;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class GeminiClient {

    private static final Logger logger = LoggerFactory.getLogger(GeminiClient.class);

    @Value("${resumeradar.gemini.api-key:}")
    private String apiKey;

    @Value("${resumeradar.gemini.model:gemini-2.5-flash}")
    private String model;

    @Value("${resumeradar.gemini.url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiClient() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public Optional<AiCritique> critiqueResume(String resumeText, String jobDescription, String jobTitle) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warn("GEMINI_API_KEY is not configured. AI Critique will be bypassed.");
            return Optional.empty();
        }

        try {
            String prompt = buildPrompt(resumeText, jobDescription, jobTitle);
            String endpoint = String.format("%s/%s:generateContent?key=%s", baseUrl, model, apiKey);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    ),
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json",
                            "temperature", 0.2
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                logger.error("Gemini API call returned status: {}", response.getStatusCode());
                return Optional.empty();
            }

            return parseCritiqueResponse(response.getBody());
        } catch (Exception e) {
            logger.error("Error communicating with Gemini API: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    private String buildPrompt(String resumeText, String jobDescription, String jobTitle) {
        return """
                You are a senior technical recruiter and ATS resume critic.
                Evaluate the following resume against the job description for the target role: "%s".
                
                RESUME:
                %s
                
                JOB DESCRIPTION:
                %s
                
                Respond ONLY with a valid JSON object matching this schema:
                {
                  "overallReview": "A concise 2-3 sentence executive evaluation of the candidate's alignment and presentation.",
                  "strengths": ["Clear strength 1", "Clear strength 2", "Clear strength 3"],
                  "weaknesses": ["Deficit or gap 1", "Deficit or gap 2"],
                  "suggestions": ["Concrete recommendation 1", "Concrete recommendation 2", "Concrete recommendation 3"]
                }
                """.formatted(
                jobTitle != null ? jobTitle : "Target Position",
                resumeText.length() > 4000 ? resumeText.substring(0, 4000) : resumeText,
                jobDescription.length() > 4000 ? jobDescription.substring(0, 4000) : jobDescription
        );
    }

    private Optional<AiCritique> parseCritiqueResponse(String responseJson) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                return Optional.empty();
            }

            JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
            if (textNode.isMissingNode()) {
                return Optional.empty();
            }

            String contentText = textNode.asText().trim();
            // Handle markdown code blocks if present
            if (contentText.startsWith("```json")) {
                contentText = contentText.substring(7);
            } else if (contentText.startsWith("```")) {
                contentText = contentText.substring(3);
            }
            if (contentText.endsWith("```")) {
                contentText = contentText.substring(0, contentText.length() - 3);
            }
            contentText = contentText.trim();

            JsonNode parsed = objectMapper.readTree(contentText);

            String overallReview = parsed.path("overallReview").asText("");
            List<String> strengths = extractStringList(parsed.path("strengths"));
            List<String> weaknesses = extractStringList(parsed.path("weaknesses"));
            List<String> suggestions = extractStringList(parsed.path("suggestions"));

            return Optional.of(new AiCritique(overallReview, strengths, weaknesses, suggestions));
        } catch (Exception e) {
            logger.error("Failed to parse Gemini response JSON: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    private List<String> extractStringList(JsonNode arrayNode) {
        List<String> result = new ArrayList<>();
        if (arrayNode.isArray()) {
            for (JsonNode item : arrayNode) {
                result.add(item.asText());
            }
        }
        return result;
    }
}
