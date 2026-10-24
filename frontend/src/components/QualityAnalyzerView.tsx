import React, { useState } from 'react';
import { apiFetch } from '../lib/apiClient';
import { ResumeQualityResult } from '../types';

const SAMPLE_MEDIOCRE_RESUME = `Bob Smith

Summary:
Responsible for various development duties and helped the team make software.

Work History:
Software Developer at TechCorp
- Was responsible for writing code in Java and helping teammates.
- Assisted with bug fixes and had duties regarding database management.
- Worked on many different things as assigned by the engineering manager and participated in daily standups and sprint planning meetings with the cross functional team.

Education:
State University`;

const SAMPLE_STRONG_RESUME = `Elena Rostova
elena.rostova@example.com | (415) 555-0142 | San Francisco, CA

PROFESSIONAL SUMMARY
Senior Backend Engineer with 6+ years specializing in distributed systems, high-throughput microservices, and cloud optimization.

EXPERIENCE
Senior Software Engineer — CloudScale Inc (2021 - Present)
- Architected and deployed 14 Spring Boot microservices, driving a 42% decrease in API latency across 25M daily transactions.
- Accelerated CI/CD release cycles by 60% through automated pipeline testing, saving 15 engineering hours weekly.
- Optimized PostgreSQL database indexes and Redis cache layers, cutting AWS RDS infrastructure expenses by $18,000 annually.
- Spearheaded team transition to Kubernetes and Docker containers across 8 production environments.

EDUCATION
Bachelor of Science in Computer Science — University of California, Berkeley

TECHNICAL SKILLS
Java, Spring Boot, Docker, Kubernetes, AWS, PostgreSQL, Redis, REST APIs, Microservices, CI/CD, Git

PROJECTS
- Distributed Task Orchestrator: Built an open-source Kafka event worker handling 50,000 jobs per second with 99.99% uptime.`;

export const QualityAnalyzerView: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeQualityResult | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please provide resume text to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch('/api/v1/analyze-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ message: 'Quality analysis failed.' }));
        throw new Error(errJson.message || `Request failed with status ${res.status}`);
      }

      const resData = await res.json();
      const payload: ResumeQualityResult = resData.data ?? resData;
      setResult(payload);
    } catch (err) {
      console.error('Quality analysis error:', err);
      setError(err instanceof Error ? err.message : 'Quality analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreTheme = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Excellent Quality',
        color: '#10b981',
        textClass: 'text-emerald-700',
        bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        ring: '#10b981',
      };
    }
    if (score >= 60) {
      return {
        label: 'Good Foundation',
        color: '#3b82f6',
        textClass: 'text-blue-700',
        bgClass: 'bg-blue-50 text-blue-800 border-blue-200',
        ring: '#3b82f6',
      };
    }
    if (score >= 40) {
      return {
        label: 'Needs Improvement',
        color: '#f59e0b',
        textClass: 'text-amber-700',
        bgClass: 'bg-amber-50 text-amber-800 border-amber-200',
        ring: '#f59e0b',
      };
    }
    return {
      label: 'Critical Gaps',
      color: '#ef4444',
      textClass: 'text-rose-700',
      bgClass: 'bg-rose-50 text-rose-800 border-rose-200',
      ring: '#ef4444',
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              Module 3
            </span>
            <span className="text-neutral-400 text-[12px]">·</span>
            <span className="text-[12px] text-neutral-500 font-medium">Deterministic Resume Audit</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Resume Quality Analyzer
          </h1>
          <p className="text-[14px] text-neutral-500 mt-1 max-w-2xl">
            Evaluate structure, action verbs, measurable metrics, length estimation, and section completeness without any AI hallucination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setResumeText(SAMPLE_MEDIOCRE_RESUME);
              setError(null);
            }}
            className="text-[12px] font-medium text-amber-700 hover:text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            Load Mediocre Sample
          </button>
          <button
            type="button"
            onClick={() => {
              setResumeText(SAMPLE_STRONG_RESUME);
              setError(null);
            }}
            className="text-[12px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            Load Strong Sample
          </button>
        </div>
      </div>

      {/* Input Card */}
      <div className="macos-card rounded-3xl p-6 sm:p-8 mb-8 border border-black/[0.06] shadow-xs">
        <label htmlFor="quality-textarea" className="block text-[13px] font-semibold text-[#1d1d1f] mb-2">
          Paste Resume Text for Quality Audit
        </label>
        <textarea
          id="quality-textarea"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste full resume text here to evaluate bullet points, verbs, structure, and metrics..."
          rows={9}
          className="w-full text-[13px] text-[#1d1d1f] bg-[#fafafa] border border-black/[0.08] rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all resize-y placeholder:text-neutral-400 font-mono"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <span className="text-[12px] text-neutral-400">
            {resumeText.length} characters · {resumeText.trim().split(/\s+/).filter(Boolean).length} words
          </span>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading || !resumeText.trim()}
            className="inline-flex items-center justify-center gap-2 bg-[#1d1d1f] text-white px-6 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-neutral-800 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Auditing Resume Quality...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Analyze Resume Quality</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 text-rose-600 text-[13px] border border-rose-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Score Banner & Checklist Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Ring Card */}
            <div className="macos-card-elevated rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-black/[0.06] shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                Overall Quality Score
              </span>
              <div
                className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-inner transition-all duration-700"
                style={{
                  background: `conic-gradient(${getScoreTheme(result.qualityScore).ring} ${result.qualityScore}%, #f1f5f9 0)`,
                }}
              >
                <div className="w-[116px] h-[116px] bg-white rounded-full flex items-center justify-center flex-col shadow-xs">
                  <span className={`text-4xl font-bold tracking-tight leading-none ${getScoreTheme(result.qualityScore).textClass}`}>
                    {result.qualityScore}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium mt-1">/ 100</span>
                </div>
              </div>
              <div className={`mt-4 px-3.5 py-1 rounded-full text-[12px] font-semibold border ${getScoreTheme(result.qualityScore).bgClass}`}>
                {getScoreTheme(result.qualityScore).label}
              </div>
            </div>

            {/* Core Metrics Summary */}
            <div className="md:col-span-2 macos-card rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-4">
                  Deterministic Quality Scorecard
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#fafafa] border border-black/[0.04]">
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold block mb-1">
                      Contact Info
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          result.hasContactInfo ? 'text-emerald-600' : 'text-rose-500'
                        }`}
                      >
                        {result.hasContactInfo ? 'check_circle' : 'cancel'}
                      </span>
                      <span className="text-[14px] font-semibold text-[#1d1d1f]">
                        {result.hasContactInfo ? 'Detected' : 'Missing'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#fafafa] border border-black/[0.04]">
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold block mb-1">
                      Length Estimate
                    </span>
                    <div className="text-[14px] font-semibold text-[#1d1d1f]">
                      {result.estimatedLength}
                    </div>
                    <span className="text-[11px] text-neutral-400">{result.wordCount} words</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#fafafa] border border-black/[0.04]">
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold block mb-1">
                      Action Verbs
                    </span>
                    <div className="text-[18px] font-semibold text-indigo-600">
                      {result.actionVerbUsageCount}
                    </div>
                    <span className="text-[11px] text-neutral-400">strong openings</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#fafafa] border border-black/[0.04]">
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold block mb-1">
                      Measurable Data
                    </span>
                    <div className="text-[18px] font-semibold text-emerald-600">
                      {result.measurableAchievementCount}
                    </div>
                    <span className="text-[11px] text-neutral-400">metrics / stats</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-black/[0.06] flex items-center justify-between text-[12px] text-neutral-400">
                <span>Total bullet points parsed: {result.bulletPointCount}</span>
                <span>Section health: {result.missingSections.length === 0 ? 'All present' : `${result.missingSections.length} absent`}</span>
              </div>
            </div>
          </div>

          {/* Actionable Improvement Areas */}
          <div className="macos-card rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-indigo-600 text-[20px]">checklist</span>
              <h3 className="text-[16px] font-semibold text-[#1d1d1f]">
                Prioritized Improvement Checklist
              </h3>
            </div>

            <div className="space-y-3">
              {result.improvementAreas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#fafafa] border border-black/[0.04] flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100">
                    {idx + 1}
                  </span>
                  <span className="text-[13px] text-[#1d1d1f] font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings & Missing Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Long Paragraph Warnings */}
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-semibold text-[#1d1d1f] flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-[18px]">notes</span>
                  Long Paragraph Warnings
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                  {result.longParagraphWarnings.length}
                </span>
              </div>
              {result.longParagraphWarnings.length > 0 ? (
                <div className="space-y-2 mt-3">
                  {result.longParagraphWarnings.map((warning, i) => (
                    <div key={i} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[12px] text-amber-900 leading-snug">
                      "{warning}"
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-neutral-400 italic mt-2">
                  No verbose blocks detected. Bullet points are concise and readable!
                </p>
              )}
            </div>

            {/* Missing Sections */}
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-semibold text-[#1d1d1f] flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-500 text-[18px]">view_column</span>
                  Missing Sections
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                  {result.missingSections.length}
                </span>
              </div>
              {result.missingSections.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.missingSections.map((sec, i) => (
                    <span key={i} className="text-[12px] font-medium px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
                      Missing {sec}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-emerald-600 font-medium mt-2">
                  All standard resume sections (Experience, Education, Skills, Projects) detected!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
