# Technical Architecture Specification

## Architecture Overview

ResumeRadar backend is built on a modular, multi-tier Layered Architecture designed for maintainability, security, resilience, and API-first extensibility.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│   React 19 Frontend / SPA / LinkedIn OAuth Popup / API Tests │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                       │
│  - CORS & Helmet Security Headers                           │
│  - Request Logging & Correlation ID                         │
│  - Rate Limiting Middleware                                 │
│  - Centralized Error & Exception Handler                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Routing Layer                         │
│  - /api/v1/auth/*         - /api/v1/analyze                 │
│  - /api/v1/optimize       - /api/v1/cover-letter            │
│  - /api/v1/rewrite-bullet - /api/v1/interview-questions     │
│  - /api/v1/resumes        - /api/v1/jobs                    │
│  - /api/v1/history        - /api/v1/linkedin/*              │
│  - /api/v1/admin/*        - /api/v1/health                  │
│  (with backwards-compatible aliases for legacy /api/* paths)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Middleware & Guards                       │
│  - Auth Guard (Bearer Token verification)                   │
│  - Role Guard (Admin / Super Admin RBAC)                    │
│  - Schema & Input Validation (strict sanitization)          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Controllers Layer                       │
│  Extracts params/body, delegates to Services, sets HTTP code│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Services Layer                         │
│  - AuthService            - AnalysisService                 │
│  - OptimizationService    - CoverLetterService              │
│  - BulletRewriteService   - InterviewPredictorService       │
│  - LinkedInService        - AdminService                    │
│  - ResumeService          - JobService                      │
│  - HistoryService                                           │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│     Repositories Layer       │ │    External Integrations    │
│  - UserRepository            │ │  - Google GenAI SDK         │
│  - ResumeRepository          │ │    (Gemini 3.7 / 3.1 /      │
│  - JobRepository             │ │     Flash multi-fallback)   │
│  - HistoryRepository         │ │  - Heuristic Engine         │
│  - AuditLogRepository        │ │  - LinkedIn OAuth / Feed    │
│  - Persistence Store (JSON/DB│ └─────────────────────────────┘
└──────────────────────────────┘
```

## Data Flow Pipeline

1. **Client Request**: Frontend triggers REST API call with JSON payload.
2. **Gateway**: Passes through CORS, security headers, rate limiting, request logging.
3. **Route & Middleware**: Authenticates token if route requires auth; verifies roles for admin endpoints; validates request schema.
4. **Controller**: Unpacks validated request context, calls appropriate domain Service.
5. **Service**: Executes business logic:
   - For AI workflows: calls Gemini Gen AI API with schema enforcement and multi-model fallback chain (`gemini-3.7-flash` -> `gemini-3.1-flash-lite` -> `gemini-flash-latest`), with seamless heuristic fallback if AI quota is unavailable.
   - For CRUD & data operations: interfaces with Repositories.
6. **Repository**: Performs atomic data operations, querying in-memory indexes and persisting data.
7. **Response**: Encapsulates output in standardized `{ success: true, data: ... }` response structure.

## Fallback & Resilience Strategy
- **AI Outage Resistance**: The system guarantees zero user-facing downtime. If Gemini API keys are missing or API limits are hit, the embedded rule-based ATS analysis and NLP heuristic engines automatically synthesize realistic scores, power recommendations, and optimized bullet points.
- **LinkedIn OAuth Simulation**: Seamlessly operates in live OAuth mode when client credentials are provided, or automatic zero-config simulator mode with real profile hydration when omitted.
