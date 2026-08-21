import { Request, Response, NextFunction } from 'express';
import { optimizeResume } from '../services/optimizationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function handleOptimize(req: Request, res: Response, next: NextFunction) {
  try {
    const { resume, jobDescription, jobTitle, originalScore, analysisId, selectedRecommendations } = req.body;

    if (!resume) {
      return sendError(res, 400, { message: 'Resume payload is required', code: 'VALIDATION_ERROR' });
    }

    const result = await optimizeResume({ resume, jobDescription, jobTitle, originalScore, analysisId, selectedRecommendations });
    sendSuccess(res, { data: result });
  } catch (err) {
    next(err);
  }
}
