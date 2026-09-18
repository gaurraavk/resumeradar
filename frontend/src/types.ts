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

export interface AiCritique {
  overallReview: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface AnalysisResult {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  aiCritique: AiCritique | null;
  aiError?: string;
}
