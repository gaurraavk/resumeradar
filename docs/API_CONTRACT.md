# Backend API Contract

All endpoints support JSON payloads and respond with standardized envelope structures.
Primary versioned prefix: `/api/v1/` (with legacy compatibility aliases on `/api/`).

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/register`
* **Auth**: Public
* **Request**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "username": "jane_doe",
    "mobile": "+1 555 123 4567",
    "password": "SecurePassword123",
    "targetRole": "Senior Product Manager"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "signed_token_string",
      "user": {
        "id": "usr-12345",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "candidate",
        "plan": "Free Candidate Plan",
        "targetRole": "Senior Product Manager",
        "scansRemaining": 10,
        "avatarUrl": "..."
      }
    }
  }
  ```

### `POST /api/v1/auth/login`
* **Auth**: Public
* **Request**:
  ```json
  {
    "identifier": "jane_doe",
    "password": "SecurePassword123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "signed_token_string",
      "user": {
        "id": "usr-12345",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "candidate",
        "plan": "Individual Pro",
        "targetRole": "Senior Product Manager",
        "scansRemaining": 48,
        "avatarUrl": "..."
      }
    }
  }
  ```

### `POST /api/v1/auth/admin-login`
* **Auth**: Public
* **Request**:
  ```json
  {
    "email": "admin@resumeradar.io",
    "password": "adminPassword"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "signed_token_string",
      "user": {
        "id": "usr-admin",
        "name": "Chief Administrator",
        "email": "admin@resumeradar.io",
        "role": "super_admin"
      }
    }
  }
  ```

### `GET /api/v1/auth/me`
* **Auth**: Bearer Token
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": { ... }
    }
  }
  ```

---

## 2. ATS Analysis & Optimization Endpoints

### `POST /api/v1/analyze` (and `/api/analyze`)
* **Auth**: Optional / Authenticated
* **Request**:
  ```json
  {
    "resumeText": "Candidate raw text or summary + skills + experience...",
    "jobDescription": "Target role requirements...",
    "resumeName": "Jane_Doe_Resume.pdf",
    "jobTitle": "Staff Software Engineer"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "analysis-1724219400000",
      "jobTitle": "Staff Software Engineer",
      "companyName": "Target Company",
      "overallScore": 74,
      "atsReadinessLevel": "Moderate Match",
      "scoreBreakdown": {
        "keywordMatch": 70,
        "experienceRelevance": 80,
        "impactQuantification": 65,
        "formattingAtsCompliance": 92
      },
      "missingKeywords": [
        { "term": "Kubernetes", "impact": "High Impact", "added": false }
      ],
      "foundSkills": ["React", "TypeScript", "Node.js"],
      "recommendations": [
        {
          "id": "rec-1",
          "category": "quantify",
          "title": "Quantify recent role impact",
          "description": "Add measurable metrics...",
          "originalText": "Worked on the frontend...",
          "suggestedText": "Architected scalable UI...",
          "severity": "high",
          "selected": true
        }
      ],
      "executiveSummary": "Candidate demonstrates competence...",
      "createdAt": "2026-08-21"
    }
  }
  ```

### `POST /api/v1/optimize` (and `/api/optimize`)
* **Auth**: Optional / Authenticated
* **Request**:
  ```json
  {
    "resume": { ...ResumeData },
    "jobDescription": "Full job description text...",
    "jobTitle": "Senior Frontend Developer",
    "originalScore": 72,
    "analysisId": "analysis-1",
    "selectedRecommendations": [ ...Recommendations ]
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "opt-1724219400000",
      "analysisId": "analysis-1",
      "jobTitle": "Senior Frontend Developer",
      "originalScore": 72,
      "optimizedScore": 95,
      "matchRank": "Top 5% Match",
      "originalResume": { ... },
      "optimizedResume": { ... },
      "appliedRecommendationsCount": 3,
      "highlightedKeywords": ["React.js", "TypeScript", "Tailwind CSS"],
      "highlightedActionVerbs": ["Architected", "Optimized", "Spearheaded"],
      "timestamp": "Just now",
      "version": 1
    }
  }
  ```

### `POST /api/v1/cover-letter` (and `/api/cover-letter`)
* **Auth**: Optional / Authenticated
* **Request**:
  ```json
  {
    "resume": { ...ResumeData },
    "jobTitle": "Senior Software Engineer",
    "jobDescription": "Job description text...",
    "companyName": "Stripe",
    "tone": "confident"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "coverLetter": "Dear Stripe Hiring Team,\n\n..."
  }
  ```

### `POST /api/v1/rewrite-bullet` (and `/api/rewrite-bullet`)
* **Auth**: Optional / Authenticated
* **Request**:
  ```json
  {
    "bullet": "Worked on frontend features.",
    "style": "Google XYZ Formula"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "variations": [
      {
        "style": "Google XYZ Formula (Accomplished [X] as measured by [Y], by doing [Z])",
        "text": "Accelerated frontend response latency by 42% across 250k DAU by refactoring state...",
        "impactScore": 98,
        "keywords": ["Accelerated", "42% latency", "250k DAU"]
      }
    ]
  }
  ```

### `POST /api/v1/interview-questions`
* **Auth**: Optional / Authenticated
* **Request**:
  ```json
  {
    "resume": { ...ResumeData },
    "jobTitle": "Staff Software Engineer",
    "jobDescription": "..."
  }
  ```

### `POST /api/v1/ats-check` (and `/api/ats-check`)
* **Auth**: Optional
* **Request**: `{ "resumeText": "..." }` or `{ "resume": { ... } }`
* **Response**: `{ "success": true, "data": { "overallScore": 0-100, "parseable": true, "engines": [...], "recommendations": [...] } }`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "questions": [
      {
        "id": "q-1",
        "category": "technical",
        "categoryLabel": "Technical Deep-Dive",
        "question": "How do you diagnose and resolve...",
        "whyAsked": "Your resume highlights...",
        "starBlueprint": {
          "situation": "...",
          "task": "...",
          "action": "...",
          "result": "..."
        }
      }
    ]
  }
  ```

---

## 3. Resume & Job Library CRUD Endpoints

### `GET /api/v1/resumes`
* **Response (200 OK)**: `{ "success": true, "data": [ ...ResumeData ] }`

### `POST /api/v1/resumes`
* **Request**: `{ ...ResumeData }`
* **Response (201 Created)**: `{ "success": true, "data": { ...ResumeData } }`

### `GET /api/v1/jobs`
* **Response (200 OK)**: `{ "success": true, "data": [ ...JobDescriptionData ] }`

### `POST /api/v1/jobs`
* **Request**: `{ ...JobDescriptionData }`
* **Response (201 Created)**: `{ "success": true, "data": { ...JobDescriptionData } }`

### `PATCH|DELETE /api/v1/resumes/:id` and `/api/v1/jobs/:id`
* **Auth**: Bearer Token; resource owner only
* **Response**: Updated record or `{ "success": true, "message": "Record deleted" }`

### `GET /api/v1/history`
* **Response (200 OK)**: `{ "success": true, "data": [ ...AnalysisHistoryItem ] }`

### `DELETE /api/v1/history/:id`
* **Response (200 OK)**: `{ "success": true, "message": "Record deleted" }`

---

## 4. LinkedIn Radar Endpoints

### `GET /api/v1/auth/linkedin/url` (and `/api/auth/linkedin/url`)
* **Response (200 OK)**: `{ "url": "https://...", "mode": "live" | "simulator" }`

### `GET /api/v1/linkedin/profile` (and `/api/linkedin/profile`)
* **Response (200 OK)**: `{ "success": true, "profile": { ...LinkedInProfile } }`

### `POST /api/v1/linkedin/match-jobs` (and `/api/linkedin/match-jobs`)
* **Request**: `{ "skills": ["React.js", "TypeScript", ...], "resume": { ... } }`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "matches": [ ...LinkedInJobMatch ],
    "totalMatches": 4,
    "topScore": 94
  }
  ```

---

## 5. Admin Governance & Telemetry Endpoints

### `GET /api/v1/admin/overview`
* **Auth**: Admin Bearer Token
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "totalScans": 456,
      "avgScore": 86,
      "activeUsersCount": 128,
      "scanVelocityData": [ ... ],
      "aiLatencyAvgMs": 760
    }
  }
  ```

### `GET /api/v1/admin/users`
* **Auth**: Admin Bearer Token
* **Response (200 OK)**: `{ "success": true, "data": [ ...RegisteredUsers ] }`

### `GET /api/v1/admin/logs` and `GET /api/v1/admin/system`
* **Auth**: Admin Bearer Token
* **Response**: Recent audit logs and safe process diagnostics respectively.

### `PATCH /api/v1/admin/users/:id/status`
* **Auth**: Admin Bearer Token
* **Request**: `{ "status": "Active" | "Inactive" }`
* **Response (200 OK)**: `{ "success": true, "data": { ...User } }`

### `POST /api/v1/admin/users/:id/quota`
* **Auth**: Admin Bearer Token
* **Request**: `{ "increment": 25 }`
* **Response (200 OK)**: `{ "success": true, "data": { ...User } }`

---

## 6. System Health Endpoints

### `GET /api/v1/health` & `GET /healthz`
* **Auth**: Public
* **Response (200 OK)**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-08-21T11:24:41.000Z",
    "uptime": 3600,
    "engine": {
      "geminiConfigured": true,
      "primaryModel": "gemini-3.7-flash"
    },
    "version": "1.0.0"
  }
  ```
