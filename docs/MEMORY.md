# PROJECT MEMORY

## Current State
- Frontend and backend are independent workspace applications with real candidate authentication.
- Current phase: authentication verification complete.

## Completed
- Auth with PBKDF2 and signed bearer tokens; role authorization.
- Registration requires unique username and mobile number; login accepts username or email only when the password matches.
- Optional bootstrap super-admin provisioning via `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- User-owned resume/job libraries, analysis history, quotas, audit logs, admin APIs.
- ATS analysis, optimization, cover letter, bullet rewrite, interview, ATS-check, LinkedIn simulator, health APIs.

## In Progress
- Registration, duplicate prevention, correct/incorrect login, anonymous protected access, frontend build, and standalone backend health endpoint verified.

## Important Decisions
- JSON persistence is atomic at `DATA_DIR/resumeradar.json`.
- AI features fall back to deterministic results if Gemini is unavailable.

## Important Constraints
- Set a 32+ character `TOKEN_SECRET`; authentication intentionally returns 503 without one.
- Live LinkedIn requires credentials; otherwise simulator mode is used.

## Known Issues
- No live LinkedIn job-feed API integration is possible without provider credentials/approved API access.

## Next Actions
- Configure production environment variables and add integration tests in CI.

## Important Files
- `frontend/`: React/Vite frontend (proxies API requests to port 3001 in development).
- `backend/`: Express API application (defaults to port 3001).
- `backend/.env.example`: backend environment-variable template.
- `backend/src/app.ts`: API app and security middleware.
- `backend/src/repositories/store.ts`: atomic persistence.
- `backend/src/services/authService.ts`: passwords and tokens.
