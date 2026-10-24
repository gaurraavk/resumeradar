package com.resumeradar.service;

import com.resumeradar.dto.AtsResult;
import com.resumeradar.dto.CompareVersionsResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ResumeComparisonService {

    private final AtsKeywordService atsKeywordService;

    public ResumeComparisonService(AtsKeywordService atsKeywordService) {
        this.atsKeywordService = atsKeywordService;
    }

    public CompareVersionsResponse compareVersions(String resumeTextA, String resumeTextB, String jobDescription) {
        if (resumeTextA == null) resumeTextA = "";
        if (resumeTextB == null) resumeTextB = "";
        if (jobDescription == null) jobDescription = "";

        AtsResult resultA = atsKeywordService.analyzeKeywords(resumeTextA, jobDescription);
        AtsResult resultB = atsKeywordService.analyzeKeywords(resumeTextB, jobDescription);

        Set<String> matchedA = new HashSet<>(resultA.getMatchedKeywords());
        Set<String> matchedB = new HashSet<>(resultB.getMatchedKeywords());

        Set<String> missingA = new HashSet<>(resultA.getMissingKeywords());
        Set<String> missingB = new HashSet<>(resultB.getMissingKeywords());

        // Keywords in B matched list that are not in A matched list
        List<String> newlyAdded = new ArrayList<>();
        for (String kw : resultB.getMatchedKeywords()) {
            if (!matchedA.contains(kw)) {
                newlyAdded.add(kw);
            }
        }

        // Keywords missing in both A and B
        List<String> stillMissing = new ArrayList<>();
        for (String kw : resultB.getMissingKeywords()) {
            if (missingA.contains(kw)) {
                stillMissing.add(kw);
            }
        }

        Collections.sort(newlyAdded);
        Collections.sort(stillMissing);

        String winner;
        if (resultB.getAtsScore() > resultA.getAtsScore()) {
            winner = "B";
        } else if (resultA.getAtsScore() > resultB.getAtsScore()) {
            winner = "A";
        } else {
            winner = "tie";
        }

        return new CompareVersionsResponse(resultA, resultB, newlyAdded, stillMissing, winner);
    }
}
