import { Response } from 'express';

interface SuccessPayload {
  data?: any;
  [key: string]: any;
}

interface ErrorPayload {
  message: string;
  code?: string;
  errors?: any[];
}

/**
 * Send standardized success response.
 * Supports both envelope pattern { success: true, data: ... }
 * and direct spread { success: true, coverLetter: "..." } for frontend compatibility.
 */
export function sendSuccess(res: Response, payload: SuccessPayload, statusCode = 200): void {
  res.status(statusCode).json({ success: true, ...payload });
}

/**
 * Send standardized error response.
 */
export function sendError(res: Response, statusCode: number, payload: ErrorPayload): void {
  res.status(statusCode).json({
    success: false,
    message: payload.message,
    code: payload.code,
    ...(payload.errors ? { errors: payload.errors } : {}),
  });
}

/**
 * Application-level error class with HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
