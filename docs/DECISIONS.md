# Architecture Decision Log (ADR)

---

### DEC-001: Layered Clean Architecture & Separation of Concerns
* **Decision**: Structure backend code into strict layers: `config/`, `routes/`, `controllers/`, `services/`, `repositories/`, `models/`, `middlewares/`, `validators/`, and `integrations/`.
* **Why**: The original monolithic single-file `server.ts` mixes HTTP routing, AI prompt schemas, mock data, LinkedIn authentication, and fallback logic in one 900-line file. A layered structure isolates business logic from transportation and persistence.
* **Alternatives considered**: Flat route handlers, Next.js server actions.
* **Impact**: Enhances testability, maintainability, and clean dependency inversion.
* **Date**: 2026-08-21

---

### DEC-002: Multi-Model AI Fallback Chain with Deterministic Heuristic Engine
* **Decision**: Implement a tiered fallback hierarchy: primary `gemini-3.7-flash` -> secondary `gemini-3.1-flash-lite` -> alias `gemini-flash-latest`, backed by an embedded zero-failure heuristic scoring engine.
* **Why**: High-load ATS scanning cannot fail when external LLM rate limits (429) or transient cloud errors occur. The system must guarantee 100% uptime with realistic ATS scoring even when API keys are unconfigured.
* **Alternatives considered**: Direct single model calls (fails on 429/quota), queueing requests with long latency.
* **Impact**: Production reliability and graceful degradation under any environment condition.
* **Date**: 2026-08-21

---

### DEC-003: Stateless HMAC-SHA256 Token Authentication with Native PBKDF2 Password Hashing
* **Decision**: Use Node.js built-in `node:crypto` for cryptographic salt generation, PBKDF2 password derivation, and signed Bearer tokens with constant-time signature verification (`timingSafeEqual`).
* **Why**: Zero external vulnerable native C-bindings (like uncompiled bcrypt) while guaranteeing enterprise-grade security and zero extra runtime dependency footprint.
* **Alternatives considered**: Session cookies in memory, external JWT libraries.
* **Impact**: Clean RESTful statelessness across microservices and easy frontend authentication handling.
* **Date**: 2026-08-21

---

### DEC-004: Versioned API Routes with Legacy Alias Compatibility
* **Decision**: Standardize all backend routes under `/api/v1/*` while preserving `/api/*` and direct route aliases.
* **Why**: Ensures current AI Studio frontend components and existing API clients work without requiring breaking frontend refactors.
* **Alternatives considered**: Breaking old paths and forcing frontend rewrite.
* **Impact**: 100% backward compatibility with clean future versioning.
* **Date**: 2026-08-21

---

### DEC-005: Dual-Mode LinkedIn Integration (Live OAuth + Zero-Config Simulator)
* **Decision**: Provide dynamic LinkedIn OAuth URL generation when client credentials exist in environment variables, and seamless fallback to embedded OAuth Simulator with live profile import when credentials are not configured.
* **Why**: Allows instant developer preview and zero-friction trial while supporting real enterprise LinkedIn OAuth in production.
* **Alternatives considered**: Hard failing without LinkedIn credentials.
* **Impact**: Frictionless onboarding and demonstration capability.
* **Date**: 2026-08-21
