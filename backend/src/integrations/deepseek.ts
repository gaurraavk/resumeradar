import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat'; // deepseek-chat = DeepSeek-V3, deepseek-reasoner = R1

/**
 * Returns true when the DeepSeek key is configured.
 */
export function hasDeepSeekClient(): boolean {
  return !!env.DEEPSEEK_API_KEY;
}

/**
 * Call the DeepSeek chat completions endpoint and return parsed JSON.
 *
 * DeepSeek's API is fully OpenAI-compatible, so we call it directly with
 * fetch — no extra SDK dependency required.
 *
 * @param systemPrompt  High-level instruction for the model
 * @param userPrompt    The actual task / content to process
 * @returns             Parsed JSON object extracted from the model response
 * @throws              On HTTP error or when the response cannot be parsed as JSON
 */
export async function deepSeekGenerate(
  systemPrompt: string,
  userPrompt: string
): Promise<any> {
  if (!env.DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not configured');
  }

  const body = {
    model: DEEPSEEK_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 4096,
  };

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`DeepSeek API error ${response.status}: ${text}`);
  }

  const data = await response.json() as any;
  const content: string = data?.choices?.[0]?.message?.content ?? '';

  if (!content) {
    throw new Error('DeepSeek returned an empty response');
  }

  // Strip markdown code fences if the model wraps its JSON
  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`DeepSeek response is not valid JSON: ${cleaned.slice(0, 200)}`);
  }
}

/**
 * Convenience wrapper: send a single combined prompt and get parsed JSON back.
 * Matches the calling pattern used in services so they can swap providers easily.
 */
export async function deepSeekGenerateFromPrompt(prompt: string): Promise<any> {
  logger.debug('Calling DeepSeek', { model: DEEPSEEK_MODEL });
  return deepSeekGenerate(
    'You are an expert ATS resume analysis assistant. Always respond with valid JSON only.',
    prompt
  );
}
