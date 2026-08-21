import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';
import type { Database } from '../models/entities.js';

const empty = (): Database => ({ users: [], resumes: [], jobs: [], history: [], auditLogs: [] });
let loaded: Promise<Database> | undefined;
let writeQueue = Promise.resolve();
function filePath() { return path.resolve(env.DATA_DIR, 'resumeradar.json'); }
async function load(): Promise<Database> {
  await mkdir(path.dirname(filePath()), { recursive: true });
  try { return { ...empty(), ...JSON.parse(await readFile(filePath(), 'utf8')) }; } catch (err: any) { if (err?.code === 'ENOENT') return empty(); throw err; }
}
export async function getDb() { loaded ??= load(); return loaded; }
export async function persist() {
  const db = await getDb();
  writeQueue = writeQueue.then(async () => { const target = filePath(); const temp = `${target}.${process.pid}.tmp`; await writeFile(temp, JSON.stringify(db, null, 2), { mode: 0o600 }); await rename(temp, target); });
  return writeQueue;
}
