# ResumeRadar — AI Context Memory

## Project Overview
* **Project Name**: ResumeRadar
* **Purpose**: Production-grade, ATS-focused resume optimization and career intelligence platform. Provides precision ATS matching, semantic keyword gap analysis, AI-driven bullet point rewriting (Google XYZ framework), tailored cover letter generation, interview question prediction, ATS parser simulation, and automated LinkedIn radar job matching.
* **Target Users**:
  * **Job Seekers / Candidates**: Optimize resumes for specific job descriptions, benchmark ATS readiness, generate targeted cover letters and interview preparation kits, sync with LinkedIn.
  * **Recruiters & Enterprise Reviewers**: Evaluate candidates against technical job postings.
  * **Platform Administrators**: Supervise system telemetry, AI model performance & fallbacks, user quotas, audit logs, and security policies.

## Technology Stack
* **Runtime**: Node.js (v18+) with TypeScript (`tsx` execution)
* **Backend Framework**: Express 4.x (modular layered architecture: routes, controllers, services, repositories, models, middlewares, validators, integrations)
* **AI & LLM Integration**: Google Gen AI SDK (`@google/genai`), multi-model fallback chain (`gemini-3.7-flash` -> `gemini-3.1-flash-lite` -> `gemini-flash-latest`), with resilient heuristic fallback scoring engines.
* **Data Storage / Persistence**: High-performance persistent repository layer with atomic file-backed storage and in-memory cache indexing.
* **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4 + Recharts + Lucide + Motion.
* **Authentication**: Multi-role Authentication (Candidate & Administrator), secure password hashing (`node:crypto` PBKDF2/salt), stateless HMAC-SHA256 signed bearer tokens, role-based access control (RBAC), and LinkedIn OAuth 2.0 / Simulation engine.

## Backend Architecture Summary
* **Layered Clean Architecture**:
  * `Routes` -> `Middlewares` (Auth, Role, Rate-Limit, Validation) -> `Controllers` -> `Services` (Business Logic & Orchestration) -> `Repositories` -> `Database/Store` & `Integrations` (Gemini AI, LinkedIn OAuth).
* **API Versioning**: Standardized on `/api/v1/*` with legacy alias routing support for `/api/*` ensuring 100% frontend backwards compatibility.
* **Response Envelope**: Standardized `{ success: boolean, data?: any, error?: string, message?: string, code?: string }`.

## Current Implementation Phase
* **Phase**: Production Backend Architecture & Implementation.
* **Status**: Establishing persistent `/docs` memory, modularizing backend services, implementing auth, persistence, ATS scoring engine, AI pipelines, admin governance, and automated tests.
