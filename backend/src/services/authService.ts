import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { AppError } from '../utils/response.js';
import { ids } from '../utils/ids.js';
import { getDb, persist } from '../repositories/store.js';
import type { UserEntity, UserRole } from '../models/entities.js';
const ITERATIONS = 210000;
const hash = (password: string, salt: string) => pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256').toString('hex');
const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
const sign = (value: string) => createHmac('sha256', env.TOKEN_SECRET).update(value).digest('base64url');
const safeEqual = (left: string, right: string) => { const a = Buffer.from(left); const b = Buffer.from(right); return a.length === b.length && timingSafeEqual(a, b); };
export function publicUser(user: UserEntity) { const { passwordHash, salt, maxQuota, status, updatedAt, ...safe } = user; return safe; }
export async function register(input: { name: string; email: string; username: string; mobile: string; password: string; targetRole?: string }) {
  const db = await getDb(); const email = input.email.trim().toLowerCase(); const username = input.username.trim().toLowerCase(); const mobile = input.mobile.replace(/[\s()-]/g, '');
  if (db.users.some(u => u.email === email)) throw new AppError('This email is already registered.', 409, 'EMAIL_IN_USE');
  if (db.users.some(u => u.username?.toLowerCase() === username)) throw new AppError('This username is already registered.', 409, 'USERNAME_IN_USE');
  if (db.users.some(u => u.mobile === mobile)) throw new AppError('This mobile number is already registered.', 409, 'MOBILE_IN_USE');
  const now = new Date().toISOString(); const salt = randomBytes(16).toString('hex');
  const user: UserEntity = { id: ids.user(), name: input.name.trim(), email, username, mobile, passwordHash: hash(input.password, salt), salt, role: 'candidate', plan: 'Free Candidate Plan', targetRole: input.targetRole?.trim() || '', scansRemaining: 10, maxQuota: 10, status: 'Active', createdAt: now, updatedAt: now };
  db.users.push(user); await persist(); return { token: issueToken(user), user: publicUser(user) };
}
export async function ensureBootstrapAdmin() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 12) return;
  const db = await getDb(); const email = env.ADMIN_EMAIL.trim().toLowerCase();
  if (db.users.some(user => user.email === email)) return;
  const now = new Date().toISOString(); const salt = randomBytes(16).toString('hex');
  db.users.push({ id: ids.user(), name: 'Chief Administrator', email, passwordHash: hash(env.ADMIN_PASSWORD, salt), salt, role: 'super_admin', plan: 'Enterprise Pro', targetRole: '', scansRemaining: 0, maxQuota: 0, status: 'Active', createdAt: now, updatedAt: now });
  await persist();
}
export async function login(identifierInput: string, password: string, adminOnly = false) {
  const identifier = identifierInput.trim().toLowerCase();
  const user = (await getDb()).users.find(u => u.email === identifier || u.username?.toLowerCase() === identifier);
  if (!user) throw new AppError('Account not found. Please register first.', 401, 'ACCOUNT_NOT_FOUND');
  if (!safeEqual(hash(password, user.salt), user.passwordHash)) throw new AppError('Incorrect password. Please try again.', 401, 'INCORRECT_PASSWORD');
  if (user.status !== 'Active') throw new AppError('This account is inactive', 403, 'ACCOUNT_INACTIVE');
  if (adminOnly && !['admin', 'super_admin'].includes(user.role)) throw new AppError('Administrator access is required', 403, 'FORBIDDEN');
  return { token: issueToken(user), user: publicUser(user) };
}
export function issueToken(user: UserEntity) { if (!env.hasTokenSecret) throw new AppError('Authentication is not configured', 503, 'AUTH_NOT_CONFIGURED'); const payload = encode({ sub: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + env.TOKEN_EXPIRY_HOURS * 3600 }); return `${payload}.${sign(payload)}`; }
export async function verifyToken(token: string) { const [payload, signature] = token.split('.'); if (!payload || !signature || !env.hasTokenSecret || !safeEqual(sign(payload), signature)) throw new AppError('Invalid authentication token', 401, 'UNAUTHORIZED'); let claims: any; try { claims = JSON.parse(Buffer.from(payload, 'base64url').toString()); } catch { throw new AppError('Invalid authentication token', 401, 'UNAUTHORIZED'); } if (claims.exp <= Math.floor(Date.now() / 1000)) throw new AppError('Authentication token has expired', 401, 'TOKEN_EXPIRED'); const user = (await getDb()).users.find(u => u.id === claims.sub); if (!user || user.status !== 'Active') throw new AppError('Account is unavailable', 401, 'UNAUTHORIZED'); return user; }
export const isAdmin = (role: UserRole) => role === 'admin' || role === 'super_admin';
