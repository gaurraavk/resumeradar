/** Application-wide constants */

export const APP_NAME = 'ResumeRadar';
export const APP_VERSION = '1.0.0';

/** AI Model fallback chain — ordered by preference */
export const GEMINI_MODEL_CHAIN = [
  'gemini-3.7-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
] as const;

/** Max retry attempts per model in the fallback chain */
export const GEMINI_MAX_RETRIES = 2;

/** Backoff multiplier (ms) between retries */
export const GEMINI_RETRY_BACKOFF_MS = 600;

/** User roles */
export const ROLES = {
  CANDIDATE: 'candidate',
  REVIEWER: 'reviewer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

/** Default quotas for new users */
export const DEFAULT_SCAN_QUOTA = 10;
export const DEFAULT_PLAN = 'Free Candidate Plan';

/** ATS readiness thresholds */
export const ATS_LEVELS = {
  TOP_5: { min: 90, label: 'Top 5% Match' },
  STRONG: { min: 75, label: 'Strong Match' },
  MODERATE: { min: 60, label: 'Moderate Match' },
  NEEDS_WORK: { min: 0, label: 'Needs Work' },
} as const;
