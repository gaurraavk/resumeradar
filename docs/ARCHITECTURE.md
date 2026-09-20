# Technical Architecture Specification

## Architecture Overview

ResumeRadar backend is a Java 21 / Spring Boot 3.3.4 REST API with a layered architecture.

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│   React 19 + TypeScript + Vite Frontend (SPA)        │
└────────────────────────┬────────────────────────────┘
                         │ HTTP / JSON / Multipart
                         ▼
┌─────────────────────────────────────────────────────┐
│               Spring Boot Application                │
│  ┌─────────────────────────────────────────────────┐│
│  │              Security Filter Chain              ││
│  │  - CORS Config                                  ││
│  │  - JWT Authentication Filter                    ││
│  │  - Rate Limit Filter                            ││
│  └─────────────────────┬───────────────────────────┘│
│                        ▼                             │
│  ┌─────────────────────────────────────────────────┐│
│  │              Controllers Layer                  ││
│  │  - AnalysisController (analyze, analyze-file,   ││
│  │    generate-fixed-resume, download, best-fit)   ││
│  │  - AdminController (login, overview)            ││
│  │  - HealthController (healthz)                   ││
│  └─────────────────────┬───────────────────────────┘│
│                        ▼                             │
│  ┌─────────────────────────────────────────────────┐│
│  │               Services Layer                    ││
│  │  - AnalysisService (ATS orchestration)          ││
│  │  - AtsKeywordService (deterministic matching)   ││
│  │  - FormattingAnalysisService (POI/PDFBox)       ││
│  │  - ResumeFixService (auto-fix engine)           ││
│  │  - AnalysisSessionStore (in-memory sessions)    ││
│  │  - AdminService (JWT auth)                      ││
│  └─────────────────────────────────────────────────┘│
│                                                      │
│  ┌─────────────────────────────────────────────────┐│
│  │               DTOs / Models                     ││
│  │  AnalysisRequest, AnalysisResponse,             ││
│  │  AnalysisFileResponse, FormattingWarning,       ││
│  │  FixResumeResponse, BestFitRequest/Response,    ││
│  │  AtsResult, ApiResponse                         ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

## Data Flow Pipeline

1. **Client Request**: Frontend sends REST API call (JSON or multipart form data).
2. **Security**: CORS validation, JWT verification for admin routes, rate limiting.
3. **Controller**: Validates input, delegates to appropriate service.
4. **Service**: Executes deterministic business logic:
   - ATS keyword extraction and matching
   - DOCX formatting analysis via Apache POI
   - PDF text extraction via Apache PDFBox
   - Resume auto-fix (font, table, verb, skills)
5. **Response**: Wrapped in standardized `{ success, message, data }` envelope.

## Design Principles
- **Zero AI/ML**: All features are deterministic, rule-based Java logic.
- **In-Memory Sessions**: ConcurrentHashMap for analysis session storage (no database).
- **Dictionary-Based Fixes**: Action verb replacements use a static JSON dictionary — never generating new content.
