import { randomBytes } from 'node:crypto';

/**
 * Generate a prefixed unique ID.
 * Format: prefix-timestamp_randomhex (e.g. "usr-1724219400000_a3f2")
 */
export function generateId(prefix: string): string {
  const ts = Date.now();
  const rand = randomBytes(4).toString('hex');
  return `${prefix}-${ts}_${rand}`;
}

/** Shorthand ID generators for each entity type */
export const ids = {
  user: () => generateId('usr'),
  resume: () => generateId('res'),
  job: () => generateId('job'),
  analysis: () => generateId('analysis'),
  optimization: () => generateId('opt'),
  history: () => generateId('hist'),
  auditLog: () => generateId('log'),
  recommendation: (n: number) => `rec-${n}`,
};
