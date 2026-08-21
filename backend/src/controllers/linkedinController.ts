import { Request, Response, NextFunction } from 'express';
import { getLinkedInAuthUrl, getLinkedInProfile, matchLinkedInJobs, getOAuthCallbackHtml } from '../services/linkedinService.js';
import { env } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/response.js';

export function handleGetLinkedInAuthUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const appUrl = env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const result = getLinkedInAuthUrl(appUrl);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function handleOAuthCallback(req: Request, res: Response) {
  const code = String(req.query.code || '');
  const html = getOAuthCallbackHtml(code);
  res.send(html);
}

export function handleGetProfile(_req: Request, res: Response, next: NextFunction) {
  try {
    const profile = getLinkedInProfile();
    sendSuccess(res, { profile });
  } catch (err) {
    next(err);
  }
}

export function handleMatchJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const { resume, skills } = req.body;
    const candidateSkills: string[] = skills || resume?.skills || [];

    const result = matchLinkedInJobs(candidateSkills);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
