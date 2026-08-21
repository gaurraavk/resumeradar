import { GoogleGenAI, Type } from '@google/genai';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { GEMINI_MODEL_CHAIN, GEMINI_MAX_RETRIES, GEMINI_RETRY_BACKOFF_MS } from '../constants/index.js';

// Re-export Type for schema definitions in services
export { Type };

/**
 * Lazy-initialized singleton Gemini client.
 * Returns null if GEMINI_API_KEY is not configured.
 */
let _client: GoogleGenAI | null | undefined;

export function getGeminiClient(): GoogleGenAI | null {
  if (_client !== undefined) return _client;

  if (!env.hasGemini) {
    logger.warn('GEMINI_API_KEY not configured — AI endpoints will use heuristic fallback');
    _client = null;
    return null;
  }

  _client = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });

  logger.info('Gemini AI client initialized', { primaryModel: GEMINI_MODEL_CHAIN[0] });
  return _client;
}

/**
 * Generate structured content with multi-model fallback chain.
 *
 * Tries each model in GEMINI_MODEL_CHAIN with up to GEMINI_MAX_RETRIES
 * attempts per model. Retryable errors (503, 429, 500) trigger backoff.
 *
 * @throws Last encountered error if all models/attempts fail
 */
export async function generateContentWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  schema: any
): Promise<any> {
  let lastError: any = null;

  for (const model of GEMINI_MODEL_CHAIN) {
    for (let attempt = 1; attempt <= GEMINI_MAX_RETRIES; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        });

        if (response && response.text) {
          return JSON.parse(response.text);
        }
      } catch (err: any) {
        lastError = err;
        const status = String(err?.status || err?.code || err?.message || '');
        const isRetryable =
          status.includes('503') ||
          status.includes('UNAVAILABLE') ||
          status.includes('429') ||
          status.includes('RESOURCE_EXHAUSTED') ||
          status.includes('500');

        if (isRetryable && attempt < GEMINI_MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, attempt * GEMINI_RETRY_BACKOFF_MS));
          continue;
        }
        // Move to next model
        break;
      }
    }
  }

  throw lastError || new Error('All Gemini model attempts failed');
}
