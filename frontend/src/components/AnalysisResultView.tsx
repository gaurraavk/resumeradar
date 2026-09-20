import React, { useState } from 'react';
import { AnalysisResult, AnalysisFileResult, FormattingWarning, FixResumeResult, ResumeData } from '../types';
import { apiFetch } from '../lib/apiClient';

interface AnalysisResultViewProps {
  result: AnalysisResult | AnalysisFileResult;
  resume: ResumeData;
  onNewScan: () => void;
}

function isFileResult(r: AnalysisResult | AnalysisFileResult): r is AnalysisFileResult {
  return 'analysisId' in r;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  resume,
  onNewScan,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'autofix'>('overview');
  const [isFixing, setIsFixing] = useState(false);
  const [fixResult, setFixResult] = useState<FixResumeResult | null>(null);
  const [fixError, setFixError] = useState<string | null>(null);

  const score = result.atsScore ?? 0;
  const hasFileResult = isFileResult(result);
  const formattingWarnings: FormattingWarning[] = hasFileResult ? result.formattingWarnings || [] : [];
  const analysisId = hasFileResult ? result.analysisId : null;

  const handleAutoFix = async () => {
    if (!analysisId) return;
    setIsFixing(true);
    setFixError(null);
    try {
      const res = await apiFetch('/api/v1/generate-fixed-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Fix failed.' }));
        throw new Error(err.message || 'Fix failed');
      }
      const data = await res.json();
      setFixResult(data.data ?? data);
    } catch (err) {
      setFixError(err instanceof Error ? err.message : 'Auto-fix failed.');
    } finally {
      setIsFixing(false);
    }
  };

  const handleDownload = () => {
    if (!fixResult?.downloadUrl) return;
    const base = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
    window.open(`${base}${fixResult.downloadUrl}`, '_blank');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[12px] font-medium text-emerald-600 tracking-wide">Analysis Complete</span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight mt-1">
            ATS Match Results
          </h1>
          <p className="text-[13px] text-neutral-400 mt-0.5">
            {resume.fileName || 'Candidate Resume'}
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-neutral-700 transition-all duration-200 cursor-pointer active:scale-[0.97]"
        >
          <span className="material-symbols-outlined text-[15px]">refresh</span>
          <span>New Analysis</span>
        </button>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-[12px] font-medium text-neutral-400 mb-5">ATS Match Score</span>
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(#171717 ${score}%, #f5f5f5 0)`,
            }}
          >
            <div className="w-[96px] h-[96px] bg-white rounded-full flex items-center justify-center flex-col">
              <span className="text-3xl font-semibold text-neutral-900 leading-none">{score}</span>
              <span className="text-[11px] text-neutral-400 font-medium mt-0.5">/ 100</span>
            </div>
          </div>
          <p className="text-[13px] text-neutral-500 font-medium mt-4">
            {score >= 80 ? 'Strong Alignment' : score >= 60 ? 'Moderate Alignment' : 'Needs Optimization'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[12px] font-medium text-emerald-600">Matched Keywords</span>
            <div className="text-3xl font-semibold text-neutral-900 mt-2">{result.matchedKeywords?.length ?? 0}</div>
            <p className="text-[13px] text-neutral-400 mt-1">Skills found in your resume</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4 max-h-20 overflow-y-auto">
            {result.matchedKeywords?.slice(0, 8).map((kw, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-medium">
                {kw}
              </span>
            ))}
            {(result.matchedKeywords?.length ?? 0) > 8 && (
              <span className="text-[11px] text-neutral-400 py-1">+{result.matchedKeywords.length - 8} more</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[12px] font-medium text-red-500">Missing Keywords</span>
            <div className="text-3xl font-semibold text-neutral-900 mt-2">{result.missingKeywords?.length ?? 0}</div>
            <p className="text-[13px] text-neutral-400 mt-1">Requirements absent from resume</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4 max-h-20 overflow-y-auto">
            {result.missingKeywords?.slice(0, 8).map((kw, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-xl bg-red-50 text-red-600 font-medium">
                {kw}
              </span>
            ))}
            {(result.missingKeywords?.length ?? 0) > 8 && (
              <span className="text-[11px] text-neutral-400 py-1">+{result.missingKeywords.length - 8} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-0.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 ${
            activeTab === 'overview' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Detailed Breakdown
        </button>
        {hasFileResult && (
          <button
            onClick={() => setActiveTab('autofix')}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 ${
              activeTab === 'autofix' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Auto-Fix Resume
          </button>
        )}
        <button
          onClick={() => setActiveTab('keywords')}
          className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 ${
            activeTab === 'keywords' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          All Keywords ({((result.matchedKeywords?.length ?? 0) + (result.missingKeywords?.length ?? 0))})
        </button>
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {formattingWarnings.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-[13px] font-semibold text-neutral-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-500">warning</span>
                Formatting Warnings
              </h3>
              <div className="space-y-2">
                {formattingWarnings.map((w, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50 text-[13px]">
                    <span className="font-semibold text-amber-700">{w.issue}:</span>{' '}
                    <span className="text-amber-600">{w.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-[13px] font-semibold text-neutral-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">thumb_up</span>
                Strengths
              </h3>
              <ul className="space-y-2 text-[13px] text-neutral-600">
                {result.matchedKeywords?.length > 0 ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{result.matchedKeywords.length} keywords matched from job description</span>
                    </li>
                    {score >= 70 && (
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>Strong keyword coverage above 70%</span>
                      </li>
                    )}
                  </>
                ) : (
                  <li className="text-neutral-400">Upload to analyze strengths.</li>
                )}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-[13px] font-semibold text-neutral-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-500">build</span>
                Areas for Improvement
              </h3>
              <ul className="space-y-2 text-[13px] text-neutral-600">
                {result.missingKeywords?.length > 0 ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{result.missingKeywords.length} keywords missing from resume</span>
                    </li>
                    {formattingWarnings.length > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{formattingWarnings.length} formatting issue(s) detected</span>
                      </li>
                    )}
                  </>
                ) : (
                  <li className="text-neutral-400">All keywords matched.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Auto-Fix */}
      {activeTab === 'autofix' && hasFileResult && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-600">
                <span className="material-symbols-outlined text-[22px]">auto_fix_high</span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Auto-Fix Resume</h3>
                <p className="text-[13px] text-neutral-400">Standardize fonts, fix tables, strengthen verbs, add missing skills</p>
              </div>
            </div>

            {!fixResult && (
              <button
                onClick={handleAutoFix}
                disabled={isFixing}
                className={`text-[14px] font-medium py-3 px-8 rounded-2xl transition-all duration-200 flex items-center gap-2 ${
                  isFixing
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-900 text-white cursor-pointer hover:bg-neutral-700 active:scale-[0.97]'
                }`}
              >
                {isFixing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating fixed resume...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                    <span>Generate Fixed Resume</span>
                  </>
                )}
              </button>
            )}

            {fixError && (
              <div className="p-4 rounded-xl bg-red-50 text-[13px] text-red-600">
                {fixError}
              </div>
            )}

            {fixResult && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 text-[13px] text-emerald-700 space-y-2">
                  <p className="font-semibold">Fixes Applied:</p>
                  <ul className="space-y-1.5">
                    {fixResult.fixesApplied.map((fix, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleDownload}
                  className="text-[14px] font-medium py-3 px-8 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-700 transition-all duration-200 cursor-pointer active:scale-[0.97] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download Fixed Resume (.docx)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Keywords */}
      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-[13px] font-semibold text-emerald-600 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Matched In Resume ({result.matchedKeywords?.length ?? 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords?.map((kw, i) => (
                <span key={i} className="text-[12px] px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-[13px] font-semibold text-red-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">error</span>
              Missing In Resume ({result.missingKeywords?.length ?? 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords?.map((kw, i) => (
                <span key={i} className="text-[12px] px-3 py-1.5 rounded-xl bg-red-50 text-red-600 font-medium">
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
