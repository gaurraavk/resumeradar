# Backend API Contract

All endpoints support JSON payloads and respond with standardized envelope structures.
Primary prefix: `/api/v1/`

---

## 1. Authentication Endpoints

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
      "token": "jwt_token_string",
      "user": {
        "email": "admin@resumeradar.io",
        "name": "Chief Administrator",
        "role": "Super Administrator"
      }
    }
  }
  ```

### `GET /api/v1/auth/admin/overview`
* **Auth**: Bearer JWT (Admin)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "status": "RUNNING",
      "uptimeSeconds": 3600,
      "jvmVersion": "21",
      "totalMemoryMb": 256,
      "freeMemoryMb": 128
    }
  }
  ```

---

## 2. ATS Analysis Endpoints

### `POST /api/v1/analyze`
* **Auth**: Public (Rate limited)
* **Request**:
  ```json
  {
    "resumeText": "Full resume text...",
    "jobDescription": "Target job description...",
    "jobTitle": "Senior Software Engineer"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "atsScore": 74,
      "matchedKeywords": ["java", "spring boot", "react"],
      "missingKeywords": ["kubernetes", "docker"]
    }
  }
  ```

### `POST /api/v1/analyze-file`
* **Auth**: Public (Rate limited)
* **Content-Type**: `multipart/form-data`
* **Parameters**: `file` (PDF/DOCX), `jobDescription` (string), `jobTitle` (string, optional)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "analysisId": "uuid-string",
      "atsScore": 74,
      "matchedKeywords": ["java", "spring boot"],
      "missingKeywords": ["kubernetes"],
      "formattingWarnings": [
        { "issue": "Risky font detected", "detail": "Comic Sans MS found" },
        { "issue": "Tables detected", "detail": "2 table(s) found" }
      ]
    }
  }
  ```

---

## 3. Auto-Fix Endpoints

### `POST /api/v1/generate-fixed-resume`
* **Auth**: Public
* **Request**:
  ```json
  {
    "analysisId": "uuid-from-analyze-file"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "fixesApplied": [
        "Standardized font to Calibri 11pt across 42 text runs",
        "Converted 1 table(s) to plain paragraph format",
        "Replaced 3 weak verb phrase(s) with stronger action verbs",
        "Added Skills section with 5 missing keyword(s)"
      ],
      "downloadUrl": "/api/v1/download/fixed-resume/uuid-string"
    }
  }
  ```

### `GET /api/v1/download/fixed-resume/{analysisId}`
* **Auth**: Public
* **Response**: Binary `.docx` file download with `Content-Disposition: attachment`

---

## 4. Best-Fit Comparison Endpoint

### `POST /api/v1/best-fit`
* **Auth**: Public
* **Request**:
  ```json
  {
    "resumeText": "Full resume text...",
    "jobDescriptions": [
      { "title": "Backend Engineer", "text": "Job description..." },
      { "title": "Full Stack Developer", "text": "Job description..." }
    ]
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "results": [
        { "title": "Full Stack Developer", "matchScore": 82, "missingKeywords": ["docker"] },
        { "title": "Backend Engineer", "matchScore": 74, "missingKeywords": ["kubernetes", "aws"] }
      ]
    }
  }
  ```

---

## 5. Health Check

### `GET /healthz`
* **Auth**: Public
* **Response (200 OK)**:
  ```json
  {
    "status": "healthy",
    "service": "resumeradar-backend",
    "runtime": "Java 21 / Spring Boot 3.3"
  }
  ```
