import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/apiClient';
import { UnifiedAnalysisResult } from '../types';

interface DashboardViewProps {
  initialResumeText?: string;
  initialJobDescription?: string;
}

const DEFAULT_SAMPLE_RESUME = `Elena Rostova
elena.rostova@example.com | (415) 555-0142 | San Francisco, CA

PROFESSIONAL SUMMARY
Senior Software Engineer with 5+ years experience architecting cloud microservices in Java and Spring Boot.

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

const DEFAULT_SAMPLE_JD = `Senior Backend Engineer — Cloud Platform
Requirements:
- Must have 5+ years of experience with Java, Spring Boot, and REST API development.
- Education: Bachelor's degree in Computer Science or related engineering field.
- Mandatory experience with Docker containerization and Kubernetes orchestration.
- Relational database experience with PostgreSQL or MySQL.

Preferred Qualifications:
- Nice to have experience with AWS cloud infrastructure and Redis caching.
- Event streaming with Kafka or RabbitMQ is a strong plus.`;

export const DashboardView: React.FC<DashboardViewProps> = ({
  initialResumeText = '',
  initialJobDescription = '',
}) => {
  const [resumeText, setResumeText] = useState<string>(initialResumeText || DEFAULT_SAMPLE_RESUME);
  const [jobDescription, setJobDescription] = useState<string>(initialJobDescription || DEFAULT_SAMPLE_JD);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UnifiedAnalysisResult | null>(null);

  const runAnalysis = async (resume: string, jd: string) => {
    if (!resume.trim() || !jd.trim()) {
      setError('Please provide both resume text and a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch('/api/v1/unified-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resume,
          jobDescription: jd,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ message: 'Unified analysis failed.' }));
        throw new Error(errJson.message || `Request failed with status ${res.status}`);
      }

      const resData = await res.json();
      const payload: UnifiedAnalysisResult = resData.data ?? resData;
      setResult(payload);
    } catch (err) {
      console.error('Unified analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically run on mount with defaults or passed props
    runAnalysis(resumeText, jobDescription);
  }, []);

  const handleRunManual = () => {
    runAnalysis(resumeText, jobDescription);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Module 4
            </span>
            <span className="text-neutral-400 text-[12px]">·</span>
            <span className="text-[12px] text-neutral-500 font-medium">Unified Analysis Intelligence</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Unified Analysis Dashboard
          </h1>
          <p className="text-[14px] text-neutral-500 mt-1 max-w-3xl">
            The complete 360° overview uniting ATS keyword match, deterministic resume quality diagnostics, and target job criteria in one synchronized cockpit.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunManual}
          disabled={isLoading || !resumeText.trim() || !jobDescription.trim()}
          className="inline-flex items-center justify-center gap-2 bg-[#1d1d1f] text-white px-6 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-neutral-800 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-[0.98] self-start sm:self-auto"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Re-run Unified Dashboard</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-600 text-[13px] border border-rose-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Results Display */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Executive Overall Summary Banner */}
          <div className="macos-card-elevated rounded-3xl p-6 sm:p-8 border border-indigo-100/80 bg-gradient-to-r from-indigo-50/40 via-white to-purple-50/40 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[24px]">insights</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                    Executive Summary
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-[12px] text-neutral-400">100% Deterministic Evaluation</span>
                </div>
                <p className="text-[16px] font-medium text-[#1d1d1f] leading-relaxed">
                  {result.overallSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Top 3 Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ATS Match Score */}
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">
                    ATS Keyword Match
                  </span>
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">target</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold text-[#1d1d1f]">
                    {result.atsMatch.atsScore}%
                  </span>
                  <span className="text-[12px] text-neutral-400">compatibility</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-black/[0.04] text-[12px] text-neutral-500 flex justify-between">
                <span>{result.atsMatch.matchedKeywords.length} matched</span>
                <span className="text-rose-600">{result.atsMatch.missingKeywords.length} missing</span>
              </div>
            </div>

            {/* Resume Quality Score */}
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">
                    Resume Quality Audit
                  </span>
                  <span className="material-symbols-outlined text-purple-600 text-[20px]">workspace_premium</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold text-[#1d1d1f]">
                    {result.resumeQuality.qualityScore}
                  </span>
                  <span className="text-[12px] text-neutral-400">/ 100 points</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-black/[0.04] text-[12px] text-neutral-500 flex justify-between">
                <span>{result.resumeQuality.actionVerbUsageCount} action verbs</span>
                <span>{result.resumeQuality.measurableAchievementCount} metrics</span>
              </div>
            </div>

            {/* Job Criteria Requirements */}
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">
                    Job Requirements
                  </span>
                  <span className="material-symbols-outlined text-indigo-600 text-[20px]">assignment_turned_in</span>
                </div>
                <div className="mt-2 text-[14px] font-semibold text-[#1d1d1f]">
                  {result.jobRequirements.experienceRequired || 'Seniority not fixed'}
                </div>
                <div className="text-[12px] text-neutral-500 mt-0.5">
                  {result.jobRequirements.educationRequired || 'Standard experience path'}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-black/[0.04] text-[12px] text-neutral-500 flex justify-between">
                <span>{result.jobRequirements.requiredSkills.length} required</span>
                <span>{result.jobRequirements.preferredSkills.length} preferred</span>
              </div>
            </div>
          </div>

          {/* Deep Dive 3 Columns / Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: ATS Keyword Details */}
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                  1. ATS Keyword Alignment
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 block mb-2">
                    Verified Matches ({result.atsMatch.matchedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                    {result.atsMatch.matchedKeywords.map((kw, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 block mb-2">
                    Missing Target Terms ({result.atsMatch.missingKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                    {result.atsMatch.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-100 font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Resume Quality Breakdown */}
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                  2. Quality Diagnostics
                </h3>
              </div>

              <div className="space-y-3 flex-1">
                <div className="p-3 rounded-2xl bg-[#fafafa] border border-black/[0.04] text-[12px] flex items-center justify-between">
                  <span className="text-neutral-500">Contact Information</span>
                  <span className="font-semibold text-emerald-600">
                    {result.resumeQuality.hasContactInfo ? 'Verified' : 'Missing'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#fafafa] border border-black/[0.04] text-[12px] flex items-center justify-between">
                  <span className="text-neutral-500">Document Length</span>
                  <span className="font-semibold text-[#1d1d1f]">
                    {result.resumeQuality.estimatedLength} ({result.resumeQuality.wordCount} words)
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#fafafa] border border-black/[0.04] text-[12px] flex items-center justify-between">
                  <span className="text-neutral-500">Bullet Points</span>
                  <span className="font-semibold text-[#1d1d1f]">
                    {result.resumeQuality.bulletPointCount} points
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                    Key Recommendations
                  </span>
                  <div className="space-y-1.5">
                    {result.resumeQuality.improvementAreas.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-[12px] text-neutral-600 flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Job Requirements Breakdown */}
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                  3. Job Demands
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700 block mb-2">
                    Mandatory Skills ({result.jobRequirements.requiredSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.jobRequirements.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-100 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 block mb-2">
                    Preferred Skills ({result.jobRequirements.preferredSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.jobRequirements.preferredSkills.map((skill, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible / Expandable Text Editor Inputs */}
          <details className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs group">
            <summary className="text-[14px] font-semibold text-[#1d1d1f] cursor-pointer list-none flex items-center justify-between select-none">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-neutral-400 group-open:rotate-180 transition-transform">
                  expand_more
                </span>
                Edit Resume & Job Description Inputs
              </span>
              <span className="text-[12px] text-neutral-400 font-normal">Click to toggle text boxes</span>
            </summary>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-black/[0.04]">
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 mb-1.5">
                  Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={8}
                  className="w-full text-[12px] text-[#1d1d1f] bg-[#fafafa] border border-black/[0.08] rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-neutral-600 mb-1.5">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full text-[12px] text-[#1d1d1f] bg-[#fafafa] border border-black/[0.08] rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
