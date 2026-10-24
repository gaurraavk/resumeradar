import React, { useState } from 'react';
import { apiFetch } from '../lib/apiClient';
import { JobAnalysisResult } from '../types';

const SAMPLE_JD = `Senior Software Engineer — Backend Platform
Location: San Francisco, CA (Hybrid)

About the Role:
We are seeking a Senior Backend Engineer to design high-throughput distributed systems.

Requirements:
- Must have 5+ years of experience with Java, Spring Boot, and relational databases (PostgreSQL/MySQL).
- Required proficiency in building RESTful APIs and microservice architectures.
- Experience with unit testing, integration testing, and CI/CD pipelines is mandatory.
- Education: Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.

Preferred Qualifications:
- Nice to have hands-on experience with Docker, Kubernetes, and AWS cloud services.
- Experience with Redis caching, Kafka event streaming, and GraphQL is a strong plus.
- Master's degree is a bonus.`;

export const JobAnalyzerView: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch('/api/v1/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ message: 'Job analysis failed.' }));
        throw new Error(errJson.message || `Request failed with status ${res.status}`);
      }

      const resData = await res.json();
      const payload: JobAnalysisResult = resData.data ?? resData;
      setResult(payload);
    } catch (err) {
      console.error('Job analysis error:', err);
      setError(err instanceof Error ? err.message : 'Job analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setJobDescription(SAMPLE_JD);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Module 1
            </span>
            <span className="text-neutral-400 text-[12px]">·</span>
            <span className="text-[12px] text-neutral-500 font-medium">Standalone Intelligence</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Job Description Analyzer
          </h1>
          <p className="text-[14px] text-neutral-500 mt-1 max-w-2xl">
            Extract ATS keywords, separate mandatory requirements from preferred qualifications, and detect education and experience criteria automatically.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="self-start sm:self-auto text-[12px] font-medium text-neutral-600 hover:text-[#1d1d1f] bg-white border border-black/[0.08] px-3.5 py-1.5 rounded-xl hover:bg-neutral-50 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
        >
          Load Sample Posting
        </button>
      </div>

      {/* Input Card */}
      <div className="macos-card rounded-3xl p-6 sm:p-8 mb-8 border border-black/[0.06] shadow-xs">
        <label htmlFor="jd-textarea" className="block text-[13px] font-semibold text-[#1d1d1f] mb-2">
          Paste Target Job Description
        </label>
        <textarea
          id="jd-textarea"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job posting text here (including requirements, qualifications, and about role)..."
          rows={9}
          className="w-full text-[13px] text-[#1d1d1f] bg-[#fafafa] border border-black/[0.08] rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-y placeholder:text-neutral-400 font-mono"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <span className="text-[12px] text-neutral-400">
            {jobDescription.length} characters · {jobDescription.trim().split(/\s+/).filter(Boolean).length} words
          </span>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading || !jobDescription.trim()}
            className="inline-flex items-center justify-center gap-2 bg-[#1d1d1f] text-white px-6 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-neutral-800 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Analyzing Posting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">manage_search</span>
                <span>Analyze Job Description</span>
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
          {/* Key Criteria Cards: Experience & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60 shadow-2xs">
                <span className="material-symbols-outlined text-[24px]">history_edu</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                  Experience Required
                </span>
                <p className="text-[17px] font-semibold text-[#1d1d1f] leading-snug">
                  {result.experienceRequired || 'No specific years specified'}
                </p>
                <p className="text-[12px] text-neutral-400 mt-1">
                  Extracted via deterministic seniority patterns
                </p>
              </div>
            </div>

            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/60 shadow-2xs">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                  Education Requirement
                </span>
                <p className="text-[17px] font-semibold text-[#1d1d1f] leading-snug">
                  {result.educationRequired || 'No strict degree requirement specified'}
                </p>
                <p className="text-[12px] text-neutral-400 mt-1">
                  Extracted via academic credential pattern matching
                </p>
              </div>
            </div>
          </div>

          {/* Required vs Preferred Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required Skills */}
            <div className="macos-card rounded-3xl p-6 border border-rose-100/80 bg-gradient-to-b from-rose-50/20 to-white shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                    Required Skills
                  </h3>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800">
                  {result.requiredSkills?.length ?? 0} mandatory
                </span>
              </div>
              <p className="text-[12px] text-neutral-500 mb-4">
                Identified in "must have", "requirements", and minimum qualifications sections.
              </p>
              {result.requiredSkills && result.requiredSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[12px] font-medium px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-900 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-neutral-400 italic">No explicit required skills isolated.</p>
              )}
            </div>

            {/* Preferred Skills */}
            <div className="macos-card rounded-3xl p-6 border border-indigo-100/80 bg-gradient-to-b from-indigo-50/20 to-white shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                    Preferred Skills
                  </h3>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100/70 text-indigo-800">
                  {result.preferredSkills?.length ?? 0} nice-to-have
                </span>
              </div>
              <p className="text-[12px] text-neutral-500 mb-4">
                Identified in "nice to have", "plus", "preferred", and bonus sections.
              </p>
              {result.preferredSkills && result.preferredSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.preferredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[12px] font-medium px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-900 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-neutral-400 italic">No explicit preferred skills isolated.</p>
              )}
            </div>
          </div>

          {/* All Top Extracted Keywords */}
          <div className="macos-card rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                  All Extracted ATS Keywords
                </h3>
                <p className="text-[12px] text-neutral-400 mt-0.5">
                  Complete dictionary extraction via AtsKeywordService
                </p>
              </div>
              <span className="text-[12px] font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                {result.topKeywords?.length ?? 0} total terms
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-3">
              {result.topKeywords?.map((kw, idx) => (
                <span
                  key={idx}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-xl bg-neutral-100/80 text-neutral-800 border border-black/[0.04]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
