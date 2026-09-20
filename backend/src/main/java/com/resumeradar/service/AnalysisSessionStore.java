package com.resumeradar.service;

import com.resumeradar.dto.FormattingWarning;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Short-lived in-memory store for analysis sessions. Keyed by analysisId (UUID).
 * Used to pass data between analyze-file -> generate-fixed-resume -> download.
 */
@Component
public class AnalysisSessionStore {

    private final ConcurrentHashMap<String, AnalysisSession> sessions = new ConcurrentHashMap<>();

    public void put(String analysisId, AnalysisSession session) {
        sessions.put(analysisId, session);
    }

    public AnalysisSession get(String analysisId) {
        return sessions.get(analysisId);
    }

    public void remove(String analysisId) {
        sessions.remove(analysisId);
    }

    public static class AnalysisSession {
        private final String resumeText;
        private final byte[] originalFileBytes;
        private final String originalFileName;
        private final boolean isDocx;
        private final List<String> missingKeywords;
        private final List<FormattingWarning> formattingWarnings;
        private byte[] fixedDocxBytes;

        public AnalysisSession(String resumeText, byte[] originalFileBytes, String originalFileName,
                               boolean isDocx, List<String> missingKeywords,
                               List<FormattingWarning> formattingWarnings) {
            this.resumeText = resumeText;
            this.originalFileBytes = originalFileBytes;
            this.originalFileName = originalFileName;
            this.isDocx = isDocx;
            this.missingKeywords = missingKeywords;
            this.formattingWarnings = formattingWarnings;
        }

        public String getResumeText() {
            return resumeText;
        }

        public byte[] getOriginalFileBytes() {
            return originalFileBytes;
        }

        public String getOriginalFileName() {
            return originalFileName;
        }

        public boolean isDocx() {
            return isDocx;
        }

        public List<String> getMissingKeywords() {
            return missingKeywords;
        }

        public List<FormattingWarning> getFormattingWarnings() {
            return formattingWarnings;
        }

        public byte[] getFixedDocxBytes() {
            return fixedDocxBytes;
        }

        public void setFixedDocxBytes(byte[] fixedDocxBytes) {
            this.fixedDocxBytes = fixedDocxBytes;
        }
    }
}
