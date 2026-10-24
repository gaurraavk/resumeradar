package com.resumeradar.service;

import com.resumeradar.dto.AnalysisRecordDto;
import com.resumeradar.model.AnalysisRecord;
import com.resumeradar.model.User;
import com.resumeradar.repository.AnalysisRecordRepository;
import com.resumeradar.repository.UserRepository;
import com.resumeradar.security.JwtTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private static final Logger log = LoggerFactory.getLogger(HistoryService.class);

    private final AnalysisRecordRepository analysisRecordRepository;
    private final UserRepository userRepository;
    private final JwtTokenService jwtTokenService;

    public HistoryService(AnalysisRecordRepository analysisRecordRepository,
                          UserRepository userRepository,
                          JwtTokenService jwtTokenService) {
        this.analysisRecordRepository = analysisRecordRepository;
        this.userRepository = userRepository;
        this.jwtTokenService = jwtTokenService;
    }

    public void recordAnalysis(String analysisId,
                               String authHeader,
                               String jobTitle,
                               int atsScore,
                               int matchedCount,
                               int missingCount,
                               List<String> missingKeywords,
                               String inputType) {
        try {
            Long userId = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7).trim();
                if (jwtTokenService.validateToken(token)) {
                    String email = jwtTokenService.getEmailFromToken(token);
                    if (email != null) {
                        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase());
                        if (userOpt.isPresent()) {
                            userId = userOpt.get().getId();
                        }
                    }
                }
            }

            String topKeywords = null;
            if (missingKeywords != null && !missingKeywords.isEmpty()) {
                String joined = missingKeywords.stream()
                        .limit(10)
                        .collect(Collectors.joining(", "));
                if (joined.length() > 255) {
                    joined = joined.substring(0, 255);
                }
                topKeywords = joined;
            }

            String safeJobTitle = jobTitle;
            if (safeJobTitle != null && safeJobTitle.length() > 255) {
                safeJobTitle = safeJobTitle.substring(0, 255);
            }

            AnalysisRecord record = new AnalysisRecord(
                    analysisId,
                    userId,
                    safeJobTitle,
                    atsScore,
                    matchedCount,
                    missingCount,
                    topKeywords,
                    inputType != null ? inputType : "TEXT",
                    LocalDateTime.now()
            );

            analysisRecordRepository.save(record);
        } catch (Throwable t) {
            log.warn("Failed to record analysis record: {}", t.getMessage());
        }
    }

    public void recordTemplateUsed(String analysisId, String templateId) {
        try {
            if (analysisId == null || analysisId.isBlank()) return;
            Optional<AnalysisRecord> recordOpt = analysisRecordRepository.findFirstByAnalysisId(analysisId);
            if (recordOpt.isPresent()) {
                AnalysisRecord record = recordOpt.get();
                record.setTemplateUsed(templateId);
                analysisRecordRepository.save(record);
            }
        } catch (Throwable t) {
            log.warn("Failed to update templateUsed for analysisId {}: {}", analysisId, t.getMessage());
        }
    }

    public List<AnalysisRecordDto> getMyHistory(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<AnalysisRecord> records = analysisRecordRepository.findTop50ByUserIdOrderByCreatedAtDesc(user.getId());
        if (records == null || records.isEmpty()) {
            return Collections.emptyList();
        }

        return records.stream()
                .map(r -> new AnalysisRecordDto(
                        r.getId(),
                        r.getAnalysisId(),
                        r.getJobTitle(),
                        r.getAtsScore(),
                        r.getMatchedCount(),
                        r.getMissingCount(),
                        r.getTopMissingKeywords(),
                        r.getInputType(),
                        r.getTemplateUsed(),
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
