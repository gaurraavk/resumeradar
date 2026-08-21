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

export interface Recommendation {
  id: string;
  category: 'keyword' | 'action_verb' | 'quantify' | 'formatting' | 'clarity';
  title: string;
  description: string;
  targetSection?: string;
  suggestedAddition?: string;
  originalText?: string;
  suggestedText?: string;
  severity: 'high' | 'medium' | 'low';
  selected: boolean;
}

export interface MatchResult {
  id: string;
  jobTitle: string;
  companyName: string;
  overallScore: number;
  atsReadinessLevel: 'Needs Work' | 'Moderate Match' | 'Strong Match' | 'Top 5% Match';
  scoreBreakdown: {
    keywordMatch: number; // 0-100
    experienceRelevance: number; // 0-100
    impactQuantification: number; // 0-100
    formattingAtsCompliance: number; // 0-100
  };
  missingKeywords: Array<{
    term: string;
    impact: 'High Impact' | 'Medium Impact';
    added?: boolean;
  }>;
  foundSkills: string[];
  recommendations: Recommendation[];
  executiveSummary: string;
  createdAt: string;
}

export interface OptimizationResult {
  id: string;
  analysisId: string;
  jobTitle: string;
  originalScore: number;
  optimizedScore: number;
  matchRank: string; // e.g. "Top 5% Match"
  originalResume: ResumeData;
  optimizedResume: ResumeData;
  appliedRecommendationsCount: number;
  highlightedKeywords: string[];
  highlightedActionVerbs: string[];
  timestamp: string;
  version: number;
}

export interface AnalysisHistoryItem {
  id: string;
  jobTitle: string;
  company: string;
  resumeFileName: string;
  initialScore: number;
  finalScore?: number;
  date: string;
  status: 'Draft' | 'Analyzed' | 'Optimized';
  matchResult?: MatchResult;
  optimizationResult?: OptimizationResult;
}

export interface LinkedInProfile {
  id: string;
  fullName: string;
  headline: string;
  location: string;
  profilePicture?: string;
  summary: string;
  email: string;
  vanityName?: string;
  positions: Array<{
    id: string;
    company: string;
    title: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    summary: string;
    skills?: string[];
  }>;
  skills: string[];
  educations: Array<{
    id: string;
    schoolName: string;
    degreeName: string;
    fieldOfStudy: string;
    startYear?: string;
    endYear?: string;
  }>;
  certifications?: Array<{
    id?: string;
    name: string;
    authority?: string;
    issuingAuthority?: string;
    year?: string;
    issueDate?: string;
  }>;
  connectedAt: string;
}

export interface LinkedInJobMatch {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  postedDate: string;
  applicantCount: number;
  atsTier: 'Top 1% Fit' | 'Top 5% Fit' | 'Strong Fit' | 'Good Fit' | 'Top 10% Fit';
  jobUrl: string;
  salary: string;
  description: string;
  notified?: boolean;
  viewed?: boolean;
  dateMatched?: string;
}

export interface InAppNotification {
  id: string;
  type: 'linkedin_match' | 'profile_imported' | 'score_boost' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  matchScore?: number;
  linkedInJob?: LinkedInJobMatch;
}
