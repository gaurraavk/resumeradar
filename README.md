# ResumeRadar

ResumeRadar is a clean, modern, privacy-first ATS resume scanner combining **deterministic keyword analysis** with an **AI resume critic** powered by Google Gemini.

---

## 🏗️ Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Security, JWT, Maven
- **AI Engine**: Google Gemini 2.5 Flash API (graceful fallback if API key is not configured)

---

## 🚀 Core Features

1. **Deterministic ATS Keyword Matching (Java)**
   - Extracts technical keywords, frameworks, tools, and multi-word phrases from job descriptions
   - Performs exact and boundary matching against the candidate's resume
   - Calculates a transparent, deterministic ATS match score (0–100%)
   - Identifies matched vs. missing keywords

2. **AI Resume Critic (Gemini)**
   - Structured JSON critique evaluating strengths, weaknesses, and concrete improvements
   - Operates gracefully: if the AI service or key is unavailable, deterministic ATS scoring continues to work flawlessly

3. **Admin Console & Governance**
   - Protected admin authentication via JWT (`/api/v1/auth/admin-login`)
   - Real-time system telemetry and JVM runtime monitoring (`/api/v1/auth/admin/overview`)

---

## 📋 Prerequisites

- **Java JDK 21+** (e.g. Microsoft OpenJDK 21 or Eclipse Temurin 21)
- **Apache Maven 3.9+**
- **Node.js 20+** & **npm**

---

## 🛠️ Quick Start

### 1. Start the Java Backend (Port 8080)

```bash
cd backend
mvn spring-boot:run
```

Optional environment variables:
- `GEMINI_API_KEY`: Your Google AI Studio Gemini API key.
- `ADMIN_EMAIL`: Admin email (default: `admin@resumeradar.io`)
- `ADMIN_PASSWORD`: Admin password (default: `admin123`)

### 2. Start the React Frontend (Port 5173)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` and `/healthz` requests directly to `http://localhost:8080`.

---

## 🧪 Testing

### Backend Unit Tests
```bash
cd backend
mvn test
```

### Frontend Build Verification
```bash
cd frontend
npm run build
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/analyze` | Evaluates resume against job description | Public (Rate limited) |
| `POST` | `/api/v1/auth/admin-login` | Admin login, issues JWT | Public |
| `GET` | `/api/v1/auth/admin/overview` | Admin telemetry & status | Bearer JWT (Admin) |
| `GET` | `/healthz` | Health check probe | Public |

---

## 📄 License

MIT
