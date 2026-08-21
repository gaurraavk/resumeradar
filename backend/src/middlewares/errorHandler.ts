import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/response.js';
import { logger } from '../config/logger.js';

/**
 * Centralized Express error handler.
 * Must be registered AFTER all routes.
 * Catches AppError for structured responses; unknown errors return generic 500.
 */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
    return;
  }
  if (Number.isInteger(err?.statusCode) && err.statusCode >= 400 && err.statusCode < 500) {
    res.status(err.statusCode).json({ success: false, message: err.message, code: err.code || 'REQUEST_ERROR' });
    return;
  }

  // Log unexpected errors
  logger.error('Unhandled error', {
    message: err?.message || 'Unknown error',
    stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined,
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
