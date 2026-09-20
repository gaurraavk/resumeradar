export interface ResumeData {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: ExperienceItem[];
  skills: string[];
  education?: EducationItem[];
  rawText?: string;
  fileName?: string;
  fileSize?: string;
  createdAt: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface JobDescriptionData {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  extractedKeywords?: string[];
  createdAt: string;
}

export interface FormattingWarning {
  issue: string;
  detail: string;
}

export interface AnalysisResult {
  analysisId?: string;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingWarnings?: FormattingWarning[];
  formattingNote?: string;
  repeatedKeywordWarnings?: string[];
  weakSentenceCount?: number;
  totalSentenceCount?: number;
  weakSentenceExamples?: string[];
  missingSections?: string[];
}

export interface AnalysisFileResult {
  analysisId: string;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingWarnings: FormattingWarning[];
  formattingNote?: string;
  repeatedKeywordWarnings?: string[];
  weakSentenceCount?: number;
  totalSentenceCount?: number;
  weakSentenceExamples?: string[];
  missingSections?: string[];
}

export interface FixResumeResult {
  originalScore?: number;
  improvedScore?: number;
  fixesApplied: string[];
  downloadUrl: string;
}

export interface BestFitResult {
  title: string;
  matchScore: number;
  missingKeywords: string[];
}
