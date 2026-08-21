import { Request, Response, NextFunction } from 'express';
import { generateCoverLetter } from '../services/coverLetterService.js';
import { rewriteBullet } from '../services/bulletRewriteService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function handleCoverLetter(req: Request, res: Response, next: NextFunction) {
  try {
    const { resume, jobTitle, jobDescription, companyName, tone } = req.body;

    if (!resume) {
      return sendError(res, 400, { message: 'Resume is required', code: 'VALIDATION_ERROR' });
    }

    const coverLetter = await generateCoverLetter({ resume, jobTitle, jobDescription, companyName, tone });
    sendSuccess(res, { coverLetter });
  } catch (err) {
    next(err);
  }
}

export async function handleBulletRewrite(req: Request, res: Response, next: NextFunction) {
  try {
    const { bullet, style } = req.body;

    if (!bullet) {
      return sendError(res, 400, { message: 'Bullet text is required', code: 'VALIDATION_ERROR' });
    }

    const variations = await rewriteBullet({ bullet, style });
    sendSuccess(res, { variations });
  } catch (err) {
    next(err);
  }
}
