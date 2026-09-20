# PROJECT MEMORY

## Current State
- Frontend and backend are independent workspace applications.
- Backend: Java 21 / Spring Boot 3.3.4, deterministic ATS engine, formatting detection, auto-fix engine.
- Frontend: React 19 + TypeScript + Tailwind CSS + Vite.

## Completed
- JWT-based admin authentication.
- Deterministic ATS keyword matching engine.
- Formatting detection (fonts, tables, margins) for .docx uploads.
- Auto-fix engine: font standardization, table conversion, action verb replacement, missing skills injection.
- Best-fit multi-job comparison endpoint.
- PDF text extraction via Apache PDFBox.
- DOCX reading/writing via Apache POI.

## Important Decisions
- All features are deterministic, rule-based Java logic only — zero AI/ML dependencies.
- In-memory session store (ConcurrentHashMap) for analysis sessions — no database required.
- Action verb replacements are dictionary-based (action-verbs.json), never generating new content.

## Important Constraints
- Set a 32+ character `JWT_SECRET` for production.

## Important Files
- `frontend/`: React/Vite frontend (proxies API requests to port 8080 in development).
- `backend/`: Spring Boot API application (defaults to port 8080).
- `backend/src/main/resources/action-verbs.json`: weak-to-strong verb dictionary.
- `backend/src/main/resources/application.yml`: application configuration.
