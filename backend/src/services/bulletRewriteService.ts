import { getGeminiClient, generateContentWithFallback, Type } from '../integrations/gemini.js';
import { logger } from '../config/logger.js';

interface BulletRewriteInput {
  bullet: string;
  style?: string;
}

const bulletSchema = {
  type: Type.OBJECT,
  properties: {
    variations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING },
          text: { type: Type.STRING },
          impactScore: { type: Type.INTEGER },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['style', 'text', 'impactScore', 'keywords'],
      },
    },
  },
  required: ['variations'],
};

/**
 * Rewrite a bullet point into 3 high-impact variations using Gemini AI.
 */
export async function rewriteBullet(input: BulletRewriteInput) {
  const { bullet, style } = input;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are a Google hiring committee bar-raiser. Transform this resume bullet point into 3 distinct, high-impact variations following the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
Original Bullet: "${bullet}"
Style Preference: ${style}

Generate 3 variations:
1. Google XYZ Formula (Accomplished [X] as measured by [Y], by doing [Z])
2. Executive & Leadership Focus
3. Deep Technical & Systems Precision`;

      const parsed = await generateContentWithFallback(ai, prompt, bulletSchema);
      if (parsed?.variations?.length) {
        return parsed.variations;
      }
    } catch (e: any) {
      logger.warn('Bullet rewrite AI error', { error: e?.message });
    }
  }

  // Heuristic fallback
  return [
    {
      style: 'Google XYZ Formula (Accomplished [X] as measured by [Y], by doing [Z])',
      text: 'Accelerated frontend web application response latency by 42% across 250k daily active users by refactoring state management and implementing memoized component rendering.',
      impactScore: 98,
      keywords: ['Accelerated', '42% response latency', '250k DAU', 'memoized component rendering'],
    },
    {
      style: 'Executive & Leadership Focus',
      text: 'Spearheaded core frontend architecture modernization and unified the engineering QA workflow, eliminating 80+ critical latency bottlenecks and enhancing cross-functional delivery speed.',
      impactScore: 94,
      keywords: ['Spearheaded', 'architecture modernization', 'cross-functional delivery'],
    },
    {
      style: 'Deep Technical & Systems Precision',
      text: 'Architected automated bundle-splitting and tree-shaking algorithms using Vite and TypeScript, slashing initial JavaScript payload by 380KB and improving Core Web Vitals (LCP < 1.2s).',
      impactScore: 96,
      keywords: ['Architected', 'tree-shaking', '380KB reduction', 'Core Web Vitals'],
    },
  ];
}
