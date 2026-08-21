import type { NextFunction, Request, Response } from 'express';
import type { UserEntity, UserRole } from '../models/entities.js';
import { verifyToken } from '../services/authService.js';
import { AppError } from '../utils/response.js';
declare global { namespace Express { interface Request { user?: UserEntity; } } }
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) { try { const value = req.header('authorization'); if (value) { if (!value.startsWith('Bearer ')) throw new AppError('Use a Bearer token', 401, 'UNAUTHORIZED'); req.user = await verifyToken(value.slice(7)); } next(); } catch (e) { next(e); } }
export async function requireAuth(req: Request, res: Response, next: NextFunction) { await optionalAuth(req, res, err => err ? next(err) : req.user ? next() : next(new AppError('Authentication is required', 401, 'UNAUTHORIZED'))); }
export function requireRole(...roles: UserRole[]) { return (req: Request, _res: Response, next: NextFunction) => !req.user ? next(new AppError('Authentication is required', 401, 'UNAUTHORIZED')) : roles.includes(req.user.role) ? next() : next(new AppError('You do not have permission for this action', 403, 'FORBIDDEN')); }
