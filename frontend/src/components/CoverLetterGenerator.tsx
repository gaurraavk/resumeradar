import React, { useState } from 'react';
import { ResumeData } from '../types';
import { apiFetch } from '../lib/apiClient';

interface CoverLetterGeneratorProps {
  resume: ResumeData;
  jobTitle: string;
  jobDescription: string;
  onClose?: () => void;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  resume,
  jobTitle,
  jobDescription,
}) => {
  const [tone, setTone] = useState<'confident' | 'enthusiastic' | 'concise' | 'executive'>('confident');
  const [companyName, setCompanyName] = useState('Hiring Team');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string>(() => {
    return `Dear ${companyName},\n\nI am writing to express my strong interest in the ${jobTitle || 'Senior Developer'} position. With over 6 years of experience engineering high-performance user interfaces and distributed web architectures, I have consistently delivered mission-critical applications that elevate user engagement and operational velocity.\n\nAt my current and previous roles, I spearheaded core web application development using React.js and TypeScript, reducing initial load latency by 40% while strictly enforcing WCAG AA accessibility. My technical background in modern front-end build pipelines, automated CI/CD workflows, and component design systems directly aligns with the technical vision outlined in your job requirements.\n\nWhat excites me most about this opportunity is the chance to bring this blend of technical rigor and product ownership to your engineering team. I welcome the opportunity to discuss how my background and problem-solving mindset can contribute to your upcoming product milestones.\n\nThank you for your time and consideration.\n\nSincerely,\n${resume.name}\n${resume.email} | ${resume.phone}\n${resume.location}`;
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await apiFetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          jobTitle: jobTitle || 'Target Role',
          jobDescription: jobDescription || 'Senior engineer role focusing on scalability, code quality, and product impact.',
          companyName,
          tone,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.coverLetter) {
          setCoverLetter(result.coverLetter);
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Cover letter AI generation fallback:', e);
    }

    // Heuristic generator
    const tonesMap = {
      confident: 'With a verified track record of scaling high-throughput applications and leading cross-functional engineering squads',
      enthusiastic: 'I was genuinely energized to come across the opening, as my passion for developer productivity and user craft resonates deeply with your product mission',
      concise: 'My engineering background in scalable systems and quantified performance optimization directly answers your requirements',
      executive: 'I offer strategic engineering leadership coupled with deep hands-on architectural execution to drive immediate enterprise value',
    };

    const text = `Dear ${companyName || 'Hiring Manager'},\n\nI am writing to submit my application for the ${jobTitle || 'Senior Software Engineer'} role. ${tonesMap[tone]}, making me an ideal fit for your engineering objectives.\n\nThroughout my career at ${resume.experience?.[0]?.company || 'leading tech companies'}, I have architected resilient web systems utilizing ${resume.skills.slice(0, 4).join(', ')}. Notable milestones include:\n• Championing end-to-end performance initiatives resulting in a 40% reduction in load times.\n• Mentoring cross-disciplinary developers while maintaining high test coverage and type safety.\n• Partnering directly with product and design leaders to deliver features on aggressive release schedules.\n\nI would appreciate the opportunity to connect and discuss how my expertise aligns with your team goals.\n\nWarm regards,\n${resume.name}\n${resume.email} | ${resume.phone}`;
    
    setCoverLetter(text);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${resume.name.replace(/\s+/g, '_')}_Cover_Letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#cfc4c5]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0058bc]"></span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
              AI Cover Letter Generator
            </h1>
          </div>
          <p className="text-xs text-[#4c4546] mt-1">
            Tailor a 1-page high-impact cover letter aligned with target job keywords and quantified achievements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4c4546] hover:text-black px-4 py-2.5 rounded-xl border border-[#cfc4c5]/80 bg-white hover:bg-[#f4f3f8] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider">Customization Parameters</h2>

            <div>
              <label className="text-[11px] font-semibold text-[#4c4546] block mb-1">Company / Team Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp Recruiting Team"
                className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3.5 py-2 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#4c4546] block mb-1">Target Role</label>
              <input
                type="text"
                value={jobTitle}
                disabled
                className="w-full bg-[#eeedf3] border border-[#cfc4c5]/60 rounded-xl px-3.5 py-2 text-xs font-medium text-[#4c4546] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#4c4546] block mb-1.5">Writing Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'confident', label: 'Confident & Direct', icon: 'verified' },
                  { id: 'enthusiastic', label: 'Passionate / High Energy', icon: 'electric_bolt' },
                  { id: 'concise', label: 'Crisp & Compact', icon: 'short_text' },
                  { id: 'executive', label: 'Senior Executive', icon: 'workspace_premium' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id as any)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      tone === t.id
                        ? 'border-black bg-black text-white font-semibold'
                        : 'border-[#cfc4c5]/60 bg-[#faf9fe] text-[#4c4546] hover:bg-[#eeedf3]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] mb-1">{t.icon}</span>
                    <span className="text-[11px]">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#0058bc] hover:bg-[#004bb0] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isGenerating ? 'refresh' : 'auto_awesome'}
              </span>
              <span>{isGenerating ? 'Synthesizing with AI...' : 'Regenerate Cover Letter'}</span>
            </button>
          </div>

          <div className="bg-[#faf9fe] p-4 rounded-xl border border-[#cfc4c5]/60 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-black text-[11px] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[#0058bc] text-[16px]">lightbulb</span>
              Recruiter Best Practices
            </div>
            <p className="text-[11px] text-[#4c4546] leading-relaxed">
              Target 250–350 words. Recruiters spend an average of 15 seconds reviewing cover letters; front-load your strongest quantified metric in paragraph two.
            </p>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#cfc4c5]/60 shadow-xs">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#cfc4c5]/40 text-xs">
              <span className="font-bold text-black uppercase tracking-wider text-[11px]">Cover Letter Document Preview</span>
              <span className="text-[#4c4546] text-[11px] font-mono">~{coverLetter.split(/\s+/).length} words</span>
            </div>

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={18}
              className="w-full text-xs md:text-sm text-black leading-relaxed font-sans bg-transparent border-0 resize-none focus:outline-none focus:ring-0 whitespace-pre-wrap selection:bg-[#d8e2ff]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
