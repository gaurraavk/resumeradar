package com.resumeradar.repository;

import com.resumeradar.model.ResumeTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumeTemplateRepository extends JpaRepository<ResumeTemplate, String> {
    Optional<ResumeTemplate> findByIdIgnoreCase(String id);
}
