import React, { useState } from 'react';
import { apiFetch } from '../lib/apiClient';
import { CompareVersionsResult } from '../types';

const SAMPLE_A = `Alex Mercer
alex.mercer@example.com | (555) 234-5678

Summary:
Software developer with experience in Java web applications.

Experience:
Software Engineer at Acme Corp (2021 - Present)
- Worked on backend services in Java.
- Fixed bugs and maintained MySQL database tables.
- Wrote unit tests.

Skills:
Java, SQL, Git, HTML, CSS`;

const SAMPLE_B = `Alex Mercer
alex.mercer@example.com | (555) 234-5678 | San Francisco, CA

Professional Summary:
Performance-oriented Senior Java Engineer with 4+ years architecting scalable Spring Boot microservices, containerizing with Docker, and orchestrating Kubernetes clusters on AWS cloud.

Professional Experience:
Senior Software Engineer at Acme Corp (2021 - Present)
- Architected and deployed 14 high-throughput Spring Boot microservices using Docker and Kubernetes, reducing latency by 35%.
- Implemented automated CI/CD deployment pipelines on AWS EC2 and EKS.
- Optimized PostgreSQL database queries and integrated Redis caching, handling 15M daily requests.

Education:
Bachelor of Science in Computer Science

Technical Skills:
Java, Spring Boot, Docker, Kubernetes, AWS, PostgreSQL, Redis, REST APIs, Microservices, CI/CD, Git`;

const SAMPLE_JD = `Senior Backend Engineer — Cloud Platform
Requirements:
- Strong hands-on proficiency with Java, Spring Boot, and REST API development.
- Deep expertise in Docker, Kubernetes, and AWS cloud environments.
- Relational database experience with PostgreSQL or MySQL.
- Experience building scalable microservice architectures.`;

export const CompareView: React.FC = () => {
  const [resumeA, setResumeA] = useState<string>('');
  const [resumeB, setResumeB] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareVersionsResult | null>(null);

  const handleCompare = async () => {
    if (!resumeA.trim() || !resumeB.trim() || !jobDescription.trim()) {
      setError('Please provide Version A, Version B, and the target Job Description.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch('/api/v1/compare-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeTextA: resumeA,
          resumeTextB: resumeB,
          jobDescription,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ message: 'Comparison failed.' }));
        throw new Error(errJson.message || `Request failed with status ${res.status}`);
      }

      const resData = await res.json();
      const payload: CompareVersionsResult = resData.data ?? resData;
      setResult(payload);
    } catch (err) {
      console.error('Comparison error:', err);
      setError(err instanceof Error ? err.message : 'Comparison failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setResumeA(SAMPLE_A);
    setResumeB(SAMPLE_B);
    setJobDescription(SAMPLE_JD);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Module 2
            </span>
            <span className="text-neutral-400 text-[12px]">·</span>
            <span className="text-[12px] text-neutral-500 font-medium">A/B Testing & Optimization</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Resume Version Comparison
          </h1>
          <p className="text-[14px] text-neutral-500 mt-1 max-w-2xl">
            Compare two versions of your resume side-by-side against a target job description to verify newly gained keywords and score improvements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="self-start sm:self-auto text-[12px] font-medium text-neutral-600 hover:text-[#1d1d1f] bg-white border border-black/[0.08] px-3.5 py-1.5 rounded-xl hover:bg-neutral-50 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
        >
          Load Realistic A/B Sample
        </button>
      </div>

      {/* Target Job Description Card */}
      <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs mb-6">
        <label htmlFor="compare-jd" className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5">
          Target Job Description
        </label>
        <textarea
          id="compare-jd"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description to test both resume versions against..."
          rows={4}
          className="w-full text-[13px] text-[#1d1d1f] bg-[#fafafa] border border-black/[0.08] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all resize-y placeholder:text-neutral-400 font-mono"
        />
      </div>

      {/* Side-by-side Textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Version A */}
        <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 text-[11px] font-bold flex items-center justify-center">
                A
              </span>
              Resume Version A (Original)
            </span>
            <span className="text-[11px] text-neutral-400">
              {resumeA.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            value={resumeA}
            onChange={(e) => setResumeA(e.target.value)}
            placeholder="Paste your original resume text here..."
            rows={10}
            className="w-full text-[12.5px] text-[#1d1d1f] bg-[#fafafa] border border-black/[0.08] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-y placeholder:text-neutral-400 font-mono"
          />
        </div>

        {/* Version B */}
        <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                B
              </span>
              Resume Version B (Revised)
            </span>
            <span className="text-[11px] text-neutral-400">
              {resumeB.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            value={resumeB}
            onChange={(e) => setResumeB(e.target.value)}
            placeholder="Paste your updated or optimized resume text here..."
            rows={10}
            className="w-full text-[12.5px] text-[#1d1d1f] bg-[#fafafa] border border-black/[0.08] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all resize-y placeholder:text-neutral-400 font-mono"
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <p className="text-[12px] text-neutral-400">
          Runs ATS keyword matching deterministically on both versions simultaneously.
        </p>

        <button
          type="button"
          onClick={handleCompare}
          disabled={isLoading || !resumeA.trim() || !resumeB.trim() || !jobDescription.trim()}
          className="inline-flex items-center justify-center gap-2 bg-[#1d1d1f] text-white px-7 py-3 rounded-2xl text-[13px] font-medium hover:bg-neutral-800 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Comparing Versions...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>Compare Versions</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-8 p-3.5 rounded-2xl bg-rose-50 text-rose-600 text-[13px] border border-rose-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Winner Banner */}
          <div className="macos-card-elevated rounded-3xl p-6 sm:p-8 border border-black/[0.06] bg-gradient-to-r from-emerald-50/50 via-white to-indigo-50/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-sm ${
                  result.winner === 'B'
                    ? 'bg-emerald-600'
                    : result.winner === 'A'
                    ? 'bg-indigo-600'
                    : 'bg-neutral-600'
                }`}
              >
                {result.winner === 'tie' ? '=' : result.winner}
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-0.5">
                  Comparison Outcome
                </span>
                <h2 className="text-2xl font-bold text-[#1d1d1f]">
                  {result.winner === 'B'
                    ? 'Version B is the Winner!'
                    : result.winner === 'A'
                    ? 'Version A Scored Higher'
                    : "It's an Exact Tie"}
                </h2>
                <p className="text-[13px] text-neutral-500 mt-1">
                  {result.winner === 'B'
                    ? `Version B increased the ATS score from ${result.resultA.atsScore}% to ${result.resultB.atsScore}% (+${result.resultB.atsScore - result.resultA.atsScore}% gain).`
                    : result.winner === 'A'
                    ? `Version A scored ${result.resultA.atsScore}% vs ${result.resultB.atsScore}% for Version B.`
                    : `Both versions scored ${result.resultA.atsScore}% on keyword alignment.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 self-start sm:self-auto border-t sm:border-t-0 sm:border-l border-black/[0.06] pt-4 sm:pt-0 sm:pl-6">
              <div className="text-center">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Version A</span>
                <div className="text-3xl font-semibold text-[#1d1d1f] mt-0.5">
                  {result.resultA.atsScore}%
                </div>
              </div>
              <span className="text-neutral-300 text-xl font-light">vs</span>
              <div className="text-center">
                <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">Version B</span>
                <div className="text-3xl font-semibold text-emerald-600 mt-0.5">
                  {result.resultB.atsScore}%
                </div>
              </div>
            </div>
          </div>

          {/* Newly Added Keywords & Still Missing Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Newly Added Keywords */}
            <div className="macos-card rounded-3xl p-6 border border-emerald-100/80 bg-gradient-to-b from-emerald-50/20 to-white shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">add_circle</span>
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                    Newly Added in Version B
                  </h3>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  +{result.newlyAddedKeywords?.length ?? 0} keywords
                </span>
              </div>
              <p className="text-[12px] text-neutral-500 mb-4">
                Target keywords present in Version B that were missing in Version A.
              </p>
              {result.newlyAddedKeywords && result.newlyAddedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.newlyAddedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[12px] font-medium px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-900 shadow-2xs"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-neutral-400 italic">No new keywords added in Version B.</p>
              )}
            </div>

            {/* Still Missing Keywords */}
            <div className="macos-card rounded-3xl p-6 border border-rose-100/80 bg-gradient-to-b from-rose-50/20 to-white shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-500 text-[18px]">pending</span>
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                    Still Missing in Both
                  </h3>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {result.stillMissingKeywords?.length ?? 0} remaining
                </span>
              </div>
              <p className="text-[12px] text-neutral-500 mb-4">
                Critical terms absent from both Version A and Version B.
              </p>
              {result.stillMissingKeywords && result.stillMissingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.stillMissingKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[12px] font-medium px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-900 shadow-2xs"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-emerald-600 font-medium">All target keywords covered!</p>
              )}
            </div>
          </div>

          {/* Full Side-by-Side Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-semibold text-[#1d1d1f]">Version A Breakdown</span>
                <span className="text-[12px] text-neutral-500 font-medium">
                  {result.resultA.matchedKeywords.length} matched / {result.resultA.missingKeywords.length} missing
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 block mb-1.5">
                    Matched ({result.resultA.matchedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.resultA.matchedKeywords.map((kw, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 block mb-1.5">
                    Missing ({result.resultA.missingKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.resultA.missingKeywords.map((kw, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="macos-card rounded-3xl p-6 border border-black/[0.06] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-semibold text-[#1d1d1f]">Version B Breakdown</span>
                <span className="text-[12px] text-emerald-600 font-semibold">
                  {result.resultB.matchedKeywords.length} matched / {result.resultB.missingKeywords.length} missing
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 block mb-1.5">
                    Matched ({result.resultB.matchedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.resultB.matchedKeywords.map((kw, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 block mb-1.5">
                    Missing ({result.resultB.missingKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.resultB.missingKeywords.map((kw, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
