# Architecture Decision Log (ADR)

---

### DEC-001: Java/Spring Boot Backend Architecture
* **Decision**: Use Java 21 with Spring Boot 3.3.4 for the backend, with a layered architecture: `config/`, `controller/`, `service/`, `dto/`, `security/`, `exception/`.
* **Why**: Strong type safety, mature ecosystem, easy deployment to Render/cloud platforms.
* **Impact**: Production-grade backend with minimal configuration.
* **Date**: 2026-09-19

---

### DEC-002: Deterministic Analysis Only — Zero AI Dependencies
* **Decision**: All ATS scoring, formatting detection, and resume auto-fix features use deterministic, rule-based Java logic only. No AI/ML/LLM APIs.
* **Why**: Predictable, reproducible results. No API key management, rate limits, or external dependencies.
* **Impact**: 100% uptime guarantee, zero external API costs, fully offline-capable.
* **Date**: 2026-09-19

---

### DEC-003: JWT-Based Admin Authentication
* **Decision**: Use JJWT library for stateless JWT authentication with Spring Security.
* **Why**: Clean RESTful statelessness, no session management needed.
* **Impact**: Simple, secure admin authentication.
* **Date**: 2026-09-19

---

### DEC-004: Apache POI + PDFBox for Document Processing
* **Decision**: Use Apache POI 5.2.5 for DOCX reading/writing and Apache PDFBox 2.0.30 for PDF text extraction.
* **Why**: Industry-standard Java libraries for document processing, well-maintained, no external service dependencies.
* **Impact**: Full DOCX formatting analysis and auto-fix capability.
* **Date**: 2026-09-19

---

### DEC-005: In-Memory Session Store for Analysis Sessions
* **Decision**: Use ConcurrentHashMap for short-lived analysis session storage instead of a database.
* **Why**: Simplifies deployment (no database needed), sufficient for the upload -> analyze -> fix -> download workflow.
* **Impact**: Sessions are lost on server restart, which is acceptable for this use case.
* **Date**: 2026-09-19
