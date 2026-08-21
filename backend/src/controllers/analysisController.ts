import { Request, Response, NextFunction } from 'express';
import { analyzeResume } from '../services/analysisService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getDb, persist } from '../repositories/store.js';
import { ids } from '../utils/ids.js';

export async function handleAnalyze(req: Request, res: Response, next: NextFunction) {
  try {
    const { resumeText, jobDescription, resumeName, jobTitle } = req.body;

    if (!resumeText || !jobDescription) {
      return sendError(res, 400, { message: 'Resume text and job description are required.', code: 'VALIDATION_ERROR' });
    }

    const result = await analyzeResume({ resumeText, jobDescription, resumeName, jobTitle });
    if (req.user) {
      if (req.user.scansRemaining < 1) return sendError(res, 429, { message: 'Your scan quota has been reached', code: 'QUOTA_EXCEEDED' });
      req.user.scansRemaining -= 1;
      const db = await getDb();
      db.history.push({ id: ids.history(), userId: req.user.id, jobTitle: result.jobTitle, company: result.companyName, resumeFileName: resumeName || 'Resume', initialScore: result.overallScore, date: result.createdAt, status: 'Analyzed', matchResult: result, createdAt: new Date().toISOString() });
      db.auditLogs.push({ id: ids.auditLog(), timestamp: new Date().toISOString(), userId: req.user.id, userEmail: req.user.email, action: 'ANALYZE_RESUME', status: 'SUCCESS' });
      await persist();
    }
    sendSuccess(res, { data: result });
  } catch (err) {
    next(err);
  }
}
