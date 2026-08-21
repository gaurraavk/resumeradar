import { getGeminiClient, generateContentWithFallback, Type } from '../integrations/gemini.js';
import { logger } from '../config/logger.js';

interface CoverLetterInput {
  resume: any;
  jobTitle?: string;
  jobDescription?: string;
  companyName?: string;
  tone?: string;
}

const coverLetterSchema = {
  type: Type.OBJECT,
  properties: {
    coverLetter: { type: Type.STRING },
  },
  required: ['coverLetter'],
};

/**
 * Generate a tailored cover letter using Gemini AI with template fallback.
 */
export async function generateCoverLetter(input: CoverLetterInput): Promise<string> {
  const { resume, jobTitle, jobDescription, companyName, tone } = input;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are a high-level executive career coach. Write a 1-page high-converting, quantified cover letter for candidate ${resume.name} applying for ${jobTitle} at ${companyName || 'the hiring team'}.
Writing Tone: ${tone || 'confident'}.
Resume Summary: ${resume.summary}
Key Experience: ${JSON.stringify(resume.experience?.slice(0, 2))}
Job Description: ${jobDescription || jobTitle}

Requirements:
- Target length: 3-4 structured paragraphs (~280-350 words).
- Quantify key achievements with metrics.
- Seamlessly weave in relevant keywords without keyword stuffing.`;

      const parsed = await generateContentWithFallback(ai, prompt, coverLetterSchema);
      if (parsed?.coverLetter) {
        return parsed.coverLetter;
      }
    } catch (e: any) {
      logger.warn('Cover letter AI generation error', { error: e?.message });
    }
  }

  // Template fallback
  return `Dear ${companyName || 'Hiring Team'},\n\nI am writing to express my strong interest in the ${jobTitle || 'Senior Software Engineer'} position. With over 6 years of experience engineering high-performance user interfaces and distributed web architectures, I have consistently delivered mission-critical applications that elevate user engagement and operational velocity.\n\nAt ${resume.experience?.[0]?.company || 'my recent company'}, I spearheaded core web application development using React.js and TypeScript, reducing initial load latency by 40% while strictly enforcing WCAG AA accessibility. My technical background in modern front-end build pipelines, automated CI/CD workflows, and component design systems directly aligns with the technical vision outlined in your requirements.\n\nWhat excites me most about this opportunity is the chance to bring this blend of technical rigor and product ownership to your engineering team. I welcome the opportunity to discuss how my background and problem-solving mindset can contribute to your upcoming product milestones.\n\nThank you for your time and consideration.\n\nSincerely,\n${resume.name}\n${resume.email} | ${resume.phone}\n${resume.location}`;
}
