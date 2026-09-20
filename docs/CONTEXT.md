# ResumeRadar — Project Context

## Project Overview
* **Project Name**: ResumeRadar
* **Purpose**: ATS-focused resume optimization platform. Provides deterministic ATS keyword matching, formatting detection, automatic resume optimization (font/table/verb fixes), best-fit multi-job comparison, and downloadable corrected .docx resumes.
* **Target Users**:
  * **Job Seekers / Candidates**: Optimize resumes for specific job descriptions, benchmark ATS readiness, auto-fix formatting and content issues.
  * **Platform Administrators**: Supervise system telemetry, uptime, and security policies.

## Technology Stack
* **Runtime**: Java 21
* **Backend Framework**: Spring Boot 3.3.4 (REST API with Spring Security, JWT authentication)
* **Document Processing**: Apache PDFBox 2.0.30 (PDF text extraction), Apache POI 5.2.5 (DOCX reading/writing)
* **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4
* **Authentication**: JWT-based admin authentication with Spring Security

## Backend Architecture Summary
* **Layered Architecture**:
  * `Controllers` -> `Services` (Business Logic) -> DTOs
  * Key services: AtsKeywordService, FormattingAnalysisService, ResumeFixService, AnalysisSessionStore
* **API Versioning**: `/api/v1/*`
* **Response Envelope**: `{ success: boolean, data?: any, message?: string }`

## Current Implementation Phase
* **Status**: Production-ready with all core features implemented.
