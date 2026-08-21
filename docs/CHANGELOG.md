# Changelog

## 2026-08-21
- Replaced permissive frontend demo authentication with validated backend registration and credential verification. Candidate accounts now require unique email, username, and mobile number; tokens persist across refreshes and protected in-app destinations require authentication.
- Split the application into `frontend/` (React/Vite) and `backend/` (Express API) workspaces. The frontend now proxies API requests to the standalone backend on port 3001 during development.
- Implemented complete modular backend: persistence, authentication/RBAC, libraries, history, quotas, audit logging, admin governance, security middleware, and remaining career-tool endpoints.
- Added environment template and AI-session working memory.
