package com.resumeradar.repository;

import com.resumeradar.model.AnalysisRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnalysisRecordRepository extends JpaRepository<AnalysisRecord, Long> {
    List<AnalysisRecord> findTop50ByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<AnalysisRecord> findFirstByAnalysisId(String analysisId);
    List<AnalysisRecord> findTop10ByOrderByCreatedAtDesc();
    List<AnalysisRecord> findAllByOrderByCreatedAtDesc();
    long countByCreatedAtAfter(LocalDateTime date);
}
