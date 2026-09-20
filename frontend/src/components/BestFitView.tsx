import React, { useState } from 'react';
import { BestFitResult } from '../types';
import { apiFetch } from '../lib/apiClient';

interface JobEntry {
  id: string;
  title: string;
  text: string;
}

export const BestFitView: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobs, setJobs] = useState<JobEntry[]>([
    { id: 'job-1', title: '', text: '' },
    { id: 'job-2', title: '', text: '' },
  ]);
  const [results, setResults] = useState<BestFitResult[] | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const addJob = () => {
    const newId = 'job-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    setJobs(prev => [...prev, { id: newId, title: '', text: '' }]);
  };

  const removeJob = (id: string) => {
    if (jobs.length <= 1) {
      setValidationError('At least one job description is required for comparison.');
      return;
    }
    setJobs(prev => prev.filter(j => j.id !== id));
    setValidationError(null);
  };

  const updateJob = (id: string, field: 'title' | 'text', value: string) => {
    setJobs(prev =>
      prev.map(j => (j.id === id ? { ...j, [field]: value } : j))
    );
    if (validationError) setValidationError(null);
  };

  const handleLoadSample = () => {
    setResumeText(
      'Senior Software Engineer with 6+ years of experience building microservices using Java, Spring Boot, Docker, and Kubernetes on AWS. Strong background in PostgreSQL, REST APIs, CI/CD pipelines, and distributed architecture.'
    );
    setJobs([
      {
        id: 'job-sample-1',
        title: 'Senior Java Backend Engineer',
        text: 'Looking for a Senior Java Developer proficient in Java 17+, Spring Boot, Microservices, Docker, Kubernetes, AWS, and PostgreSQL to design and scale cloud-native services.',
      },
      {
        id: 'job-sample-2',
        title: 'Lead Python ML Engineer',
        text: 'Seeking an experienced Machine Learning Engineer with strong Python, PyTorch, TensorFlow, FastAPI, and data pipeline orchestration skills using Airflow and Snowflake.',
      },
    ]);
    setResults(null);
    setValidationError(null);
  };

  const handleClearAll = () => {
    setResumeText('');
    setJobs([
      { id: 'job-' + Date.now() + '-1', title: '', text: '' },
      { id: 'job-' + Date.now() + '-2', title: '', text: '' },
    ]);
    setResults(null);
    setValidationError(null);
  };

  const handleSubmit = async () => {
    setValidationError(null);

    const cleanResume = resumeText.trim();
    if (cleanResume.length < 50) {
      setValidationError('Resume text is too short. Please provide at least 50 characters of resume content.');
      return;
    }

    const validJobs = jobs.filter(j => j.text.trim().length > 0);
    if (validJobs.length === 0) {
      setValidationError('Please enter at least one job description to compare against.');
      return;
    }

    const tooShortJob = jobs.find(j => j.text.trim().length > 0 && j.text.trim().length < 20);
    if (tooShortJob) {
      setValidationError(`"${tooShortJob.title || 'Job description'}" is too short. Please provide at least 20 characters of job text.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch('/api/v1/best-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: cleanResume,
          jobDescriptions: validJobs.map((j, i) => ({
            title: j.title.trim() || `Job ${i + 1}`,
            text: j.text.trim(),
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Comparison failed.' }));
        throw new Error(err.message || `Comparison failed with status ${res.status}`);
      }

      const data = await res.json();
      const outputList: BestFitResult[] = data.data?.results ?? data.results ?? [];
      setResults(outputList);
      if (outputList.length > 0) {
        setExpandedIndex(0);
      }
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Comparison failed. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDetails = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-10 flex flex-col gap-10 animate-entrance">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-[12px] font-semibold text-blue-700 tracking-wide uppercase">
              Multi-Role Match
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight mt-1">
            Best Fit Comparison
          </h1>
          <p className="text-base text-neutral-500 mt-1 font-normal leading-relaxed">
            Cross-reference one resume against multiple job descriptions to find your strongest ATS match.
          </p>
        </div>

        {/* Quick helper buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-[13px] font-medium text-[#1d1d1f] bg-white hover:bg-[#f5f5f7] border border-black/[0.06] px-4 py-2 rounded-2xl shadow-2xs transition-all duration-300 cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
            title="Populate sample resume and jobs"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-600">sample</span>
            <span>Load Sample Data</span>
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[13px] font-medium text-neutral-400 hover:text-[#1d1d1f] px-3 py-2 rounded-2xl transition-colors duration-300 cursor-pointer active:scale-[0.98]"
            title="Reset form"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Validation Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/60 text-[13px] text-rose-700 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span className="leading-relaxed font-normal">{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="font-semibold underline cursor-pointer text-rose-800 active:scale-[0.98]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Resume Input Card */}
      <section className="macos-card rounded-3xl p-7 md:p-8 space-y-4 transition-all duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-neutral-500">description</span>
            Candidate Resume
          </h2>
          <span className="text-[12px] text-neutral-400 font-medium">
            {resumeText.trim().length >= 50 ? (
              <span className="text-emerald-700 font-semibold">✓ Ready ({resumeText.length} chars)</span>
            ) : (
              <span>{resumeText.length} / min 50 chars</span>
            )}
          </span>
        </div>
        <textarea
          value={resumeText}
          onChange={(e) => {
            setResumeText(e.target.value);
            if (validationError) setValidationError(null);
          }}
          rows={6}
          placeholder="Paste your full resume text here..."
          className="w-full resize-none rounded-2xl p-4 text-sm bg-[#f5f5f7] text-[#1d1d1f] placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black/[0.06] border border-black/[0.04] outline-none transition-all duration-300 leading-relaxed custom-scrollbar font-normal"
        />
      </section>

      {/* Job Descriptions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-500">work</span>
              Target Job Descriptions ({jobs.length})
            </h2>
            <p className="text-[13px] text-neutral-400 font-normal mt-0.5">Add 2 or more target roles to benchmark match scores</p>
          </div>
          <button
            type="button"
            onClick={addJob}
            className="text-[13px] font-medium text-[#1d1d1f] bg-white hover:bg-[#f5f5f7] border border-black/[0.06] px-4 py-2 rounded-2xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px] text-[#1d1d1f]">add</span>
            <span>Add Another Job</span>
          </button>
        </div>

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div
              key={job.id}
              className="macos-card rounded-3xl p-6 md:p-7 space-y-3.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black/[0.04] text-[#1d1d1f] text-[11px] font-semibold flex items-center justify-center border border-black/[0.04]">
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-semibold text-[#1d1d1f]">
                    {job.title.trim() || `Job Opportunity #${i + 1}`}
                  </span>
                </div>
                {jobs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeJob(job.id)}
                    className="text-[12px] font-medium text-neutral-400 hover:text-rose-600 px-2.5 py-1 rounded-xl hover:bg-rose-50 cursor-pointer transition-colors duration-300 flex items-center gap-1 active:scale-[0.98]"
                    title="Remove this job row"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <input
                type="text"
                value={job.title}
                onChange={(e) => updateJob(job.id, 'title', e.target.value)}
                placeholder="Target Job Title (e.g., Senior Java Backend Engineer)"
                className="w-full rounded-2xl px-4 py-2.5 text-sm bg-[#f5f5f7] text-[#1d1d1f] placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black/[0.06] border border-black/[0.04] outline-none transition-all duration-300 font-normal"
              />

              <div className="space-y-1">
                <textarea
                  value={job.text}
                  onChange={(e) => updateJob(job.id, 'text', e.target.value)}
                  rows={4}
                  placeholder="Paste the full job description or key requirements here..."
                  className="w-full resize-none rounded-2xl p-4 text-sm bg-[#f5f5f7] text-[#1d1d1f] placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black/[0.06] border border-black/[0.04] outline-none transition-all duration-300 leading-relaxed custom-scrollbar font-normal"
                />
                <div className="flex justify-between items-center px-1 text-[12px] text-neutral-400">
                  <span>
                    {job.text.trim().length >= 20 ? (
                      <span className="text-emerald-700 font-medium">✓ Ready ({job.text.length} chars)</span>
                    ) : (
                      <span>Minimum 20 characters required</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submit Action */}
      <div className="flex justify-end pt-2 pb-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-[15px] font-medium py-3.5 px-10 rounded-2xl transition-all duration-300 flex items-center gap-2.5 bg-[#1d1d1f] text-white cursor-pointer hover:bg-neutral-800 active:scale-[0.98] shadow-sm disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Computing Comparative ATS Scores...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              <span>Compare All Jobs</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <section className="space-y-5 animate-entrance">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                Ranked Comparison Results
              </h2>
              <p className="text-[13px] text-neutral-400 mt-0.5 font-normal">
                Sorted by highest deterministic ATS keyword match
              </p>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-black/[0.04] text-[#1d1d1f] text-[12px] font-medium border border-black/[0.04]">
              {results.length} Roles Compared
            </span>
          </div>

          <div className="space-y-4">
            {results.map((r, i) => {
              const isExpanded = expandedIndex === i;
              const isTopMatch = i === 0;

              return (
                <div
                  key={i}
                  className={`macos-card hover:macos-card-elevated rounded-3xl p-6 md:p-7 transition-all duration-300 ${
                    isTopMatch ? 'border-emerald-300/80 ring-1 ring-emerald-200/50' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-grow min-w-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-base shrink-0 ${
                          isTopMatch ? 'bg-emerald-600 text-white shadow-xs' : 'bg-black/[0.04] text-[#1d1d1f] border border-black/[0.04]'
                        }`}
                      >
                        #{i + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-[#1d1d1f] truncate">
                            {r.title}
                          </p>
                          {isTopMatch && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase tracking-wider">
                              Best Fit
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] text-neutral-400 mt-0.5 font-normal">
                          {r.missingKeywords.length === 0
                            ? 'All required keywords matched'
                            : `${r.missingKeywords.length} missing skill(s)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div
                            className={`text-2xl font-semibold ${
                              r.matchScore >= 70
                                ? 'text-emerald-700'
                                : r.matchScore >= 50
                                ? 'text-amber-700'
                                : 'text-[#1d1d1f]'
                            }`}
                          >
                            {r.matchScore}%
                          </div>
                          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                            Match Score
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-24 h-2 bg-black/[0.04] rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              r.matchScore >= 70
                                ? 'bg-emerald-600'
                                : r.matchScore >= 50
                                ? 'bg-amber-500'
                                : 'bg-[#1d1d1f]'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, r.matchScore))}%` }}
                          />
                        </div>
                      </div>

                      {/* Working View Details toggle button */}
                      <button
                        type="button"
                        onClick={() => toggleDetails(i)}
                        className="text-[12px] font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-black/[0.06] px-3.5 py-1.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1 shrink-0 active:scale-[0.98]"
                      >
                        <span>{isExpanded ? 'Hide' : 'Details'}</span>
                        <span className="material-symbols-outlined text-[16px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details Section */}
                  {isExpanded && (
                    <div className="mt-5 pt-4 border-t border-black/[0.04] space-y-3 animate-entrance">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium uppercase tracking-wider text-neutral-400">
                          Missing Keywords for this Role ({r.missingKeywords.length})
                        </span>
                      </div>
                      {r.missingKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {r.missingKeywords.map((kw, kwIdx) => (
                            <span
                              key={kwIdx}
                              className="text-[11px] px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-medium border border-rose-100/60"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[13px] text-emerald-700 font-medium flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          100% of keywords required for this role are present in your resume!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

