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

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  accentColorHex: string;
  nameAlignment: 'LEFT' | 'CENTER';
  headingCase: 'UPPER' | 'TITLE';
  showDividerLine: boolean;
  sectionOrder: string[];
}

export interface FixResumeResult {
  originalScore?: number;
  improvedScore?: number;
  fixesApplied: string[];
  downloadUrl: string;
  templateId?: string;
  templateName?: string;
}

export interface BestFitResult {
  title: string;
  matchScore: number;
  missingKeywords: string[];
}

export interface AtsScoreResult {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface CompareVersionsResult {
  resultA: AtsScoreResult;
  resultB: AtsScoreResult;
  newlyAddedKeywords: string[];
  stillMissingKeywords: string[];
  winner: 'A' | 'B' | 'tie';
}

export interface ResumeQualityResult {
  qualityScore: number;
  hasContactInfo: boolean;
  wordCount: number;
  estimatedLength: 'One page' | 'Too long' | 'Too short' | string;
  bulletPointCount: number;
  actionVerbUsageCount: number;
  measurableAchievementCount: number;
  longParagraphWarnings: string[];
  missingSections: string[];
  improvementAreas: string[];
}export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponseData {
  token: string;
  user: UserSummary;
}

export interface HistoryRecord {
  id: number;
  analysisId: string;
  jobTitle?: string | null;
  atsScore: number;
  matchedCount: number;
  missingCount: number;
  topMissingKeywords?: string | null;
  inputType: 'TEXT' | 'FILE' | string;
  templateUsed?: string | null;
  createdAt: string;
}

export interface DailyAnalysisCount {
  date: string;
  count: number;
}

export interface TemplateUsageStat {
  templateId: string;
  name: string;
  count: number;
}

export interface KeywordCountStat {
  keyword: string;
  count: number;
}

export interface InputTypeSplit {
  text: number;
  file: number;
}

export interface RecentAnalysisItem {
  date: string;
  jobTitle: string;
  score: number;
  userName: string;
}

export interface AdminAnalyticsData {
  totalUsers: number;
  newUsersLast7Days: number;
  totalAnalyses: number;
  analysesLast7Days: DailyAnalysisCount[];
  averageAtsScore: number;
  scoreBuckets: Record<string, number>;
  templateUsage: TemplateUsageStat[];
  topMissingKeywords: KeywordCountStat[];
  inputTypeSplit: InputTypeSplit;
  recentAnalyses: RecentAnalysisItem[];
}

