import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './config/logger.js';
import { apiRouter } from './routes/index.js';
import { env } from './config/env.js';
import { rateLimit } from './middlewares/rateLimit.js';

/**
 * Create and configure the Express application.
 * Separating app creation from HTTP listening enables testing.
 */
export function createApp(): express.Application {
  const app = express();
  app.disable('x-powered-by');

  // ── Global Middleware ──────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use('/api', rateLimit());

  // Simple CORS headers for development (Vite proxy handles dev; production serves static)
  app.use((req, res, next) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(value => value.trim()).filter(Boolean);
    const origin = req.header('origin');
    if (origin && (env.isDev || allowedOrigins.includes(origin))) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    if (env.isProd) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // Request logging
  app.use((req, _res, next) => {
    if (!req.path.startsWith('/node_modules') && !req.path.startsWith('/@') && !req.path.startsWith('/src')) {
      logger.debug(`${req.method} ${req.path}`);
    }
    next();
  });

  // ── API Routes ─────────────────────────────────────────────────
  app.use('/api/v1', apiRouter);
  // Preserve legacy paths without letting the broad /api mount intercept /api/v1.
  app.use('/api', (req, res, next) => req.path.startsWith('/v1/') ? next() : apiRouter(req, res, next));

  // ── Centralized Error Handler (must be last) ───────────────────
  app.use(errorHandler);

  return app;
}
