# ResumeRadar

ResumeRadar is a clean, modern, privacy-first ATS resume scanner combining **deterministic keyword analysis** with **automatic resume optimization** and **formatting detection**.

---

## 🏗️ Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Security, JWT, Maven
- **Document Processing**: Apache PDFBox (PDF text extraction), Apache POI (DOCX reading/writing)

---

## 🚀 Core Features

1. **Deterministic ATS Keyword Matching (Java)**
   - Extracts technical keywords, frameworks, tools, and multi-word phrases from job descriptions
   - Performs exact and boundary matching against the candidate's resume
   - Calculates a transparent, deterministic ATS match score (0–100%)
   - Identifies matched vs. missing keywords

2. **Formatting Detection & Analysis**
   - Detects risky fonts, tables, and narrow margins in .docx uploads
   - Extracts text from both .pdf and .docx files for keyword analysis
   - Provides actionable formatting warnings

3. **Auto-Fix & Download**
   - Standardizes fonts to Calibri 11pt across all text runs
   - Converts table content to plain paragraphs for ATS compatibility
   - Replaces weak verbs with stronger action verbs (dictionary-based)
   - Adds missing keywords to a Skills section
   - Generates a downloadable corrected .docx file

4. **Best-Fit Multi-Job Comparison**
   - Compare one resume against multiple job descriptions simultaneously
   - Results ranked by match score for quick decision-making

5. **Admin Console & Governance**
   - Protected admin authentication via JWT (`/api/v1/auth/admin-login`)
   - Real-time system telemetry and JVM runtime monitoring (`/api/v1/auth/admin/overview`)

---

## 📋 Prerequisites

- **Java JDK 21+** (e.g. Microsoft OpenJDK 21 or Eclipse Temurin 21)
- **Apache Maven 3.9+**
- **Node.js 20+** & **npm** (or **Bun**)

---

## 🛠️ Quick Start

### 1. Start the Java Backend (Port 8080)

```bash
cd backend
mvn spring-boot:run
```

Optional environment variables:
- `ADMIN_EMAIL`: Admin email (default: `admin@resumeradar.io`)
- `ADMIN_PASSWORD`: Admin password (default: `admin123`)
- `JWT_SECRET`: JWT signing key (default: development key)

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
| `POST` | `/api/v1/analyze` | Text-based ATS keyword scan | Public (Rate limited) |
| `POST` | `/api/v1/analyze-file` | File upload analysis with formatting detection | Public (Rate limited) |
| `POST` | `/api/v1/generate-fixed-resume` | Generate auto-fixed .docx resume | Public |
| `GET` | `/api/v1/download/fixed-resume/{id}` | Download corrected resume file | Public |
| `POST` | `/api/v1/best-fit` | Multi-job comparison ranking | Public |
| `POST` | `/api/v1/auth/admin-login` | Admin login, issues JWT | Public |
| `GET` | `/api/v1/auth/admin/overview` | Admin telemetry & status | Bearer JWT (Admin) |
| `GET` | `/healthz` | Health check probe | Public |

---

## 📄 License

MIT
