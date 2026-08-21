# Database & Data Model Specification

## Persistence Architecture
ResumeRadar uses a unified repository layer supporting fast in-memory indexing with atomic file-backed JSON/NoSQL persistence and seamless adaptation to SQL/MongoDB production adapters.

---

## Core Entities & Schemas

### 1. `User`
```typescript
interface UserEntity {
  id: string;                    // Primary key, e.g. "usr-12345"
  name: string;
  email: string;                 // Unique index, normalized lowercase
  passwordHash: string;          // PBKDF2 with unique salt
  salt: string;                  // Hex string salt
  role: 'candidate' | 'reviewer' | 'admin' | 'super_admin';
  plan: string;                  // 'Free Candidate Plan' | 'Individual Pro' | 'Enterprise Pro'
  targetRole: string;            // Default target profession
  scansRemaining: number;        // Available scan quota
  maxQuota: number;              // Lifetime / monthly tier ceiling
  status: 'Active' | 'Inactive'; // Admin governance status
  avatarUrl?: string;
  createdAt: string;             // ISO-8601
  updatedAt: string;
}
```

### 2. `Resume`
```typescript
interface ResumeEntity {
  id: string;                    // e.g. "res-pm-1"
  userId?: string;               // Foreign key -> User.id
  name: string;                  // Full candidate name
  title: string;                 // Target or current title
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  skills: string[];              // Normalized string array
  education?: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
  }>;
  rawText?: string;              // Plain text extraction
  fileName?: string;
  fileSize?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3. `JobDescription`
```typescript
interface JobDescriptionEntity {
  id: string;                    // e.g. "job-1"
  userId?: string;               // Foreign key -> User.id
  title: string;
  company: string;
  location: string;
  description: string;
  extractedKeywords?: string[];
  createdAt: string;
}
```

### 4. `AnalysisHistoryItem`
```typescript
interface AnalysisHistoryEntity {
  id: string;                    // e.g. "hist-1724219400000"
  userId?: string;               // Foreign key -> User.id
  jobTitle: string;
  company: string;
  resumeFileName: string;
  initialScore: number;
  finalScore?: number;
  date: string;
  status: 'Draft' | 'Analyzed' | 'Optimized';
  matchResult?: MatchResult;
  optimizationResult?: OptimizationResult;
  createdAt: string;
}
```

### 5. `LinkedInProfileCache` & `LinkedInJobMatch`
```typescript
interface LinkedInProfileEntity {
  id: string;                    // e.g. "li_usr_alexmorgan_9921"
  fullName: string;
  headline: string;
  location: string;
  email: string;
  summary: string;
  positions: Array<any>;
  skills: string[];
  educations: Array<any>;
  certifications?: Array<any>;
  connectedAt: string;
}
```

### 6. `AuditLog`
```typescript
interface AuditLogEntity {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  action: string;                // e.g. "ANALYZE_RESUME", "OPTIMIZE_RESUME", "USER_QUOTA_INCREASE"
  status: 'SUCCESS' | 'FAILURE';
  ipAddress?: string;
  latencyMs?: number;
  metadata?: Record<string, any>;
}
```

---

## Indexing Strategy
* `users.email`: Unique case-insensitive index for constant-time authentication.
* `resumes.userId`: Fast filtering of user documents.
* `history.userId`: Ordered descending by timestamp for instant history loading.
* `history.id`: Fast lookups for single analysis inspection.

## Soft Deletion Strategy
* User accounts and historical analyses support soft deletion by flagging status, ensuring historical metrics remain intact for administrative governance.
