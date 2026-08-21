import { Request, Response } from 'express';
import { APP_NAME, APP_VERSION, GEMINI_MODEL_CHAIN } from '../constants/index.js';
import { env } from '../config/env.js';

export function handleHealth(_req: Request, res: Response) {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    engine: {
      geminiConfigured: env.hasGemini,
      primaryModel: GEMINI_MODEL_CHAIN[0],
    },
    version: APP_VERSION,
  });
}
