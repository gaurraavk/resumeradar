export type UserRole = 'candidate' | 'reviewer' | 'admin' | 'super_admin';
export type UserStatus = 'Active' | 'Inactive';

export interface UserEntity { id: string; name: string; email: string; passwordHash: string; salt: string; role: UserRole; plan: string; targetRole: string; scansRemaining: number; maxQuota: number; status: UserStatus; avatarUrl?: string; createdAt: string; updatedAt: string; }
export interface ResumeEntity { id: string; userId: string; name: string; title: string; email: string; phone: string; location: string; summary: string; experience: Array<{ id: string; role: string; company: string; period: string; bullets: string[] }>; skills: string[]; education?: Array<{ id: string; degree: string; institution: string; year: string }>; rawText?: string; fileName?: string; fileSize?: string; createdAt: string; updatedAt: string; }
export interface JobEntity { id: string; userId: string; title: string; company: string; location: string; description: string; extractedKeywords?: string[]; createdAt: string; updatedAt: string; }
export interface HistoryEntity { id: string; userId: string; jobTitle: string; company: string; resumeFileName: string; initialScore: number; finalScore?: number; date: string; status: 'Draft' | 'Analyzed' | 'Optimized'; matchResult?: any; optimizationResult?: any; createdAt: string; deletedAt?: string; }
export interface AuditLogEntity { id: string; timestamp: string; userId?: string; userEmail?: string; action: string; status: 'SUCCESS' | 'FAILURE'; ipAddress?: string; latencyMs?: number; metadata?: Record<string, unknown>; }
export interface Database { users: UserEntity[]; resumes: ResumeEntity[]; jobs: JobEntity[]; history: HistoryEntity[]; auditLogs: AuditLogEntity[]; }
