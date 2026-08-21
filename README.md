<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# ResumeRadar

The project is split into independent frontend and backend applications.

View your app in AI Studio: https://ai.studio/apps/16ffd0ec-8d06-403e-abcb-573f02369038

## Run Locally

**Prerequisites:**  Node.js


1. Install workspace dependencies:
   `npm install`
2. Copy `backend/.env.example` to `backend/.env` and set `TOKEN_SECRET` (32+ characters). Gemini is optional.
3. Start the API: `npm run dev:backend`
4. In a second terminal, start the frontend: `npm run dev:frontend`

The frontend development server proxies `/api`, `/auth`, and `/healthz` requests to `http://localhost:3001`.
