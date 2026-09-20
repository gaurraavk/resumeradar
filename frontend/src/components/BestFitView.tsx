import React, { useState } from 'react';
import { BestFitResult } from '../types';
import { apiFetch } from '../lib/apiClient';

interface BestFitViewProps {}

export const BestFitView: React.FC<BestFitViewProps> = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobs, setJobs] = useState<{ title: string; text: string }[]>([{ title: '', text: '' }]);
  const [results, setResults] = useState<BestFitResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addJob = () => {
    setJobs([...jobs, { title: '', text: '' }]);
  };

  const removeJob = (index: number) => {
    if (jobs.length <= 1) return;
    setJobs(jobs.filter((_, i) => i !== index));
  };

  const updateJob = (index: number, field: 'title' | 'text', value: string) => {
    const updated = [...jobs];
    updated[index] = { ...updated[index], [field]: value };
    setJobs(updated);
  };

  const isReady = resumeText.trim().length >= 50 && jobs.every(j => j.text.trim().length >= 20);

  const handleSubmit = async () => {
    if (!isReady) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/v1/best-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescriptions: jobs.map((j, i) => ({
            title: j.title || `Job ${i + 1}`,
            text: j.text,
          })),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Comparison failed.' }));
        throw new Error(err.message || 'Comparison failed');
      }
      const data = await res.json();
      setResults(data.data?.results ?? data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight">
          Best Fit Comparison
        </h1>
        <p className="text-base md:text-lg text-neutral-500 mt-2 font-normal">
          Compare your resume against multiple job descriptions to find the best match.
        </p>
      </header>

      {/* Resume Input */}
      <div className="bg-white rounded-2xl p-8 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900">Resume Text</h2>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={6}
          placeholder="Paste your full resume text here..."
          className="w-full resize-none rounded-2xl p-4 text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 outline-none transition-all duration-200 leading-relaxed border-0"
        />
        <p className="text-[13px] text-neutral-400 px-1">
          {resumeText.trim().length >= 50 ? '✓ Ready' : 'Minimum 50 characters required.'}
        </p>
      </div>

      {/* Job Descriptions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Job Descriptions</h2>
          <button
            onClick={addJob}
            className="text-[13px] font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            Add Job
          </button>
        </div>

        {jobs.map((job, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-neutral-400">Job {i + 1}</span>
              {jobs.length > 1 && (
                <button
                  onClick={() => removeJob(i)}
                  className="text-[13px] text-neutral-400 hover:text-red-500 cursor-pointer transition-colors duration-200"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="text"
              value={job.title}
              onChange={(e) => updateJob(i, 'title', e.target.value)}
              placeholder="Job title (optional)"
              className="w-full rounded-xl p-3 text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 outline-none transition-all duration-200 border-0"
            />
            <textarea
              value={job.text}
              onChange={(e) => updateJob(i, 'text', e.target.value)}
              rows={4}
              placeholder="Paste job description..."
              className="w-full resize-none rounded-xl p-3 text-sm bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 outline-none transition-all duration-200 leading-relaxed border-0"
            />
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!isReady || isLoading}
          className={`text-[15px] font-medium py-3.5 px-10 rounded-2xl transition-all duration-200 flex items-center gap-3 ${
            isReady && !isLoading
              ? 'bg-neutral-900 text-white cursor-pointer hover:bg-neutral-700 active:scale-[0.97]'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Comparing...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              <span>Compare Jobs</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-[13px] text-red-600">{error}</div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Results — Ranked by Match Score</h2>
          {results.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-grow min-w-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-lg ${
                  i === 0 ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  #{i + 1}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-base font-semibold text-neutral-900 truncate">{r.title}</p>
                  <p className="text-[13px] text-neutral-400">{r.missingKeywords.length} missing keywords</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-semibold text-neutral-900">{r.matchScore}%</div>
                  <div className="text-[12px] text-neutral-400">match</div>
                </div>
                <div className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                    style={{ width: `${r.matchScore}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
