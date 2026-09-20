# Backend Requirements Specification

| ID | Description | Priority | Status |
| :--- | :--- | :--- | :--- |
| **REQ-001** | **Admin Authentication**: Admin login with JWT token generation and validation. | High | Complete |
| **REQ-002** | **ATS Keyword Matching**: Deterministic keyword extraction and matching between resume text and job description, producing a 0-100 match score. | Critical | Complete |
| **REQ-003** | **File Upload Analysis**: Accept .pdf and .docx file uploads, extract text, run ATS matching, and detect formatting issues. | Critical | Complete |
| **REQ-004** | **Formatting Detection**: Detect risky fonts, tables, and narrow margins in .docx uploads. | High | Complete |
| **REQ-005** | **Auto-Fix Engine**: Standardize fonts, convert tables to paragraphs, replace weak verbs with strong action verbs, add missing keywords to Skills section. Generate downloadable .docx. | Critical | Complete |
| **REQ-006** | **Best-Fit Comparison**: Compare one resume against multiple job descriptions, rank by match score. | Medium | Complete |
| **REQ-007** | **Health Check**: Provide liveness probe at `/healthz`. | Medium | Complete |
| **REQ-008** | **Rate Limiting**: Enforce per-IP rate limits on analysis endpoints. | Medium | Complete |
| **REQ-009** | **Security**: CORS configuration, CSRF protection disabled for REST API, stateless JWT sessions. | High | Complete |
