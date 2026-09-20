import React, { useState } from 'react';
import { AnalysisResult, AnalysisFileResult, FormattingWarning, FixResumeResult, ResumeData } from '../types';
import { apiFetch } from '../lib/apiClient';

interface AnalysisResultViewProps {
  result: AnalysisResult | AnalysisFileResult;
  resume: ResumeData;
  onNewScan: () => void;
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
  const analysisId = result.analysisId || null;
  const isPdf = resume.fileName?.toLowerCase().endsWith('.pdf') ?? false;
  const formattingWarnings: FormattingWarning[] = result.formattingWarnings || [];

  // Determine score color zone (muted macOS tones)
  const getScoreZone = (val: number) => {
    if (val >= 80) {
      return {
        label: 'Strong Alignment',
        color: '#10b981',
        textClass: 'text-emerald-700',
        bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
        ringColor: '#10b981',
      };
    }
    if (val >= 60) {
      return {
        label: 'Moderate Alignment',
        color: '#f59e0b',
        textClass: 'text-amber-700',
        bgBadge: 'bg-amber-50 text-amber-800 border-amber-200/60',
        ringColor: '#f59e0b',
      };
    }
    return {
      label: 'Needs Optimization',
      color: '#f43f5e',
      textClass: 'text-rose-700',
      bgBadge: 'bg-rose-50 text-rose-800 border-rose-200/60',
      ringColor: '#f43f5e',
    };
  };

  const zone = getScoreZone(score);

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
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-10 flex flex-col gap-8 animate-entrance">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[12px] font-semibold text-emerald-700 tracking-wide uppercase">
              Analysis Complete
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mt-1">
            ATS Match Results
          </h1>
          <p className="text-[13px] text-neutral-500 mt-0.5">
            {resume.fileName || 'Candidate Resume'}
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="flex items-center gap-2 bg-[#1d1d1f] text-white px-5 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-neutral-800 transition-all duration-300 cursor-pointer active:scale-[0.98] shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>New Analysis</span>
        </button>
      </div>

      {/* Prominent Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Score Gauge */}
        <div className="macos-card-elevated rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400 mb-5">
            ATS Match Score
          </span>
          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-inner transition-all duration-700"
            style={{
              background: `conic-gradient(${zone.ringColor} ${score}%, #f1f5f9 0)`,
            }}
          >
            <div className="w-[116px] h-[116px] bg-white rounded-full flex items-center justify-center flex-col shadow-xs">
              <span className={`text-4xl font-semibold tracking-tight leading-none ${zone.textClass}`}>
                {score}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium mt-1">/ 100</span>
            </div>
          </div>
          <div className={`mt-5 px-3.5 py-1 rounded-full text-[12px] font-semibold border ${zone.bgBadge}`}>
            {zone.label}
          </div>
        </div>

        {/* Matched Keywords */}
        <div
          onClick={() => setActiveTab('keywords')}
          className="macos-card hover:macos-card-elevated rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer group"
          title="Click to view all keywords"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-emerald-700">
                Matched Keywords
              </span>
              <span className="material-symbols-outlined text-[18px] text-neutral-300 group-hover:text-neutral-500 transition-colors">
                arrow_forward
              </span>
            </div>
            <div className="text-4xl font-semibold text-[#1d1d1f] mt-2">
              {result.matchedKeywords?.length ?? 0}
            </div>
            <p className="text-[13px] text-neutral-400 mt-1">Skills verified in your resume</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-5 max-h-24 overflow-y-auto custom-scrollbar">
            {result.matchedKeywords?.slice(0, 8).map((kw, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-medium border border-emerald-100/60">
                {kw}
              </span>
            ))}
            {(result.matchedKeywords?.length ?? 0) > 8 && (
              <span className="text-[11px] text-neutral-400 py-1 font-medium">
                +{result.matchedKeywords.length - 8} more
              </span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div
          onClick={() => setActiveTab('keywords')}
          className="macos-card hover:macos-card-elevated rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer group"
          title="Click to view all keywords"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-rose-600">
                Missing Keywords
              </span>
              <span className="material-symbols-outlined text-[18px] text-neutral-300 group-hover:text-neutral-500 transition-colors">
                arrow_forward
              </span>
            </div>
            <div className="text-4xl font-semibold text-[#1d1d1f] mt-2">
              {result.missingKeywords?.length ?? 0}
            </div>
            <p className="text-[13px] text-neutral-400 mt-1">Key requirements absent from resume</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-5 max-h-24 overflow-y-auto custom-scrollbar">
            {result.missingKeywords?.slice(0, 8).map((kw, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-medium border border-rose-100/60">
                {kw}
              </span>
            ))}
            {(result.missingKeywords?.length ?? 0) > 8 && (
              <span className="text-[11px] text-neutral-400 py-1 font-medium">
                +{result.missingKeywords.length - 8} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Segmented Control */}
      <div className="flex gap-1 bg-black/[0.03] p-1 rounded-2xl border border-black/[0.04] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-300 active:scale-[0.98] ${
            activeTab === 'overview'
              ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
              : 'text-neutral-500 hover:text-[#1d1d1f]'
          }`}
        >
          Detailed Breakdown
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('autofix')}
          className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-300 active:scale-[0.98] flex items-center gap-1.5 ${
            activeTab === 'autofix'
              ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
              : 'text-neutral-500 hover:text-[#1d1d1f]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_fix_high</span>
          <span>Auto-Fix Resume</span>
          {fixResult && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('keywords')}
          className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-300 active:scale-[0.98] ${
            activeTab === 'keywords'
              ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
              : 'text-neutral-500 hover:text-[#1d1d1f]'
          }`}
        >
          All Keywords ({(result.matchedKeywords?.length ?? 0) + (result.missingKeywords?.length ?? 0)})
        </button>
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Feature 3: Missing Section Detector */}
          {result.missingSections && result.missingSections.length > 0 && (
            <div className="bg-rose-50/70 rounded-3xl p-6 border border-rose-200/50 flex items-start gap-3.5 text-[13px] transition-all duration-300">
              <span className="material-symbols-outlined text-[20px] text-rose-600 mt-0.5 shrink-0">error</span>
              <div>
                <span className="font-semibold text-rose-900 block mb-1">Missing Standard Resume Sections</span>
                <span className="text-rose-700 leading-relaxed font-normal">
                  Your resume appears to be missing these common sections:{' '}
                  <strong className="font-semibold">{result.missingSections.join(', ')}</strong>
                </span>
              </div>
            </div>
          )}

          {formattingWarnings.length > 0 ? (
            <div className="macos-card rounded-3xl p-7 space-y-4 transition-all duration-300">
              <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-600">warning</span>
                Formatting Warnings ({formattingWarnings.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formattingWarnings.map((w, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/40 text-[13px]">
                    <span className="font-semibold text-amber-900 block mb-1">{w.issue}</span>
                    <span className="text-amber-800 leading-relaxed font-normal">{w.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="macos-card rounded-3xl p-6 flex items-start gap-3 text-[13px] text-neutral-500 transition-all duration-300">
              <span className="material-symbols-outlined text-[18px] text-neutral-400 mt-0.5">info</span>
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Formatting Verification Note</span>
                <span className="leading-relaxed font-normal">
                  {result.formattingNote ||
                    'Visual formatting inspection (fonts, margins, tables) is calibrated for .docx uploads. For text-paste inputs, your ATS keyword alignment has been fully evaluated and you can generate an optimized .docx file via Auto-Fix.'}
                </span>
              </div>
            </div>
          )}

          {/* Feature 1: Keyword Balance ("keyword stuffing") */}
          {result.repeatedKeywordWarnings && result.repeatedKeywordWarnings.length > 0 && (
            <div className="macos-card rounded-3xl p-7 space-y-4 transition-all duration-300">
              <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-600">repeat</span>
                Keyword Balance ({result.repeatedKeywordWarnings.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.repeatedKeywordWarnings.map((warning, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/40 text-[13px]">
                    <span className="font-semibold text-amber-900 block mb-1">Keyword Stuffing Risk</span>
                    <span className="text-amber-800 leading-relaxed font-normal">{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feature 2: Weak Sentence Count */}
          {(result.totalSentenceCount ?? 0) > 0 && (
            <div className="macos-card rounded-3xl p-7 space-y-4 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-blue-600">record_voice_over</span>
                  Language Impact & Action Verbs
                </h3>
                <span className="text-[12px] font-medium px-3 py-1 rounded-full bg-black/[0.04] text-[#1d1d1f] border border-black/[0.04] w-fit">
                  {result.weakSentenceCount ?? 0} of {result.totalSentenceCount} sentences use weak language
                </span>
              </div>
              <p className="text-[13px] text-neutral-600 leading-relaxed font-normal">
                <strong className="font-semibold text-[#1d1d1f]">{result.weakSentenceCount ?? 0} of {result.totalSentenceCount} sentences use weak language</strong>. Strengthening passive or repetitive verbs makes bullet points more compelling to recruiters.
              </p>
              {result.weakSentenceExamples && result.weakSentenceExamples.length > 0 && (
                <div className="space-y-2 mt-1">
                  <span className="text-[12px] font-medium text-neutral-400 block">Sentences using weak language:</span>
                  <div className="space-y-1.5">
                    {result.weakSentenceExamples.map((ex, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.04] text-[12px] text-[#1d1d1f] flex items-start gap-2">
                        <span className="text-neutral-400 font-mono text-[11px] mt-0.5">#{idx + 1}</span>
                        <span className="italic leading-relaxed font-normal">{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="macos-card rounded-3xl p-7 space-y-4 transition-all duration-300">
              <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">thumb_up</span>
                Strengths
              </h3>
              <ul className="space-y-2.5 text-[13px] text-neutral-600">
                {result.matchedKeywords?.length > 0 ? (
                  <>
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                      <span className="leading-relaxed">
                        <strong className="font-semibold text-[#1d1d1f]">{result.matchedKeywords.length} keywords</strong> matched from job description
                      </span>
                    </li>
                    {score >= 70 && (
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                        <span className="leading-relaxed">High keyword alignment (score {score}/100) passes baseline ATS threshold</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                      <span className="leading-relaxed">Deterministic analysis completed with zero hallucinated recommendations</span>
                    </li>
                  </>
                ) : (
                  <li className="text-neutral-400">No matching keywords detected in current scan.</li>
                )}
              </ul>
            </div>

            <div className="macos-card rounded-3xl p-7 space-y-4 transition-all duration-300">
              <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-600">build</span>
                Areas for Improvement
              </h3>
              <ul className="space-y-2.5 text-[13px] text-neutral-600">
                {result.missingKeywords?.length > 0 ? (
                  <>
                    <li className="flex items-start gap-2.5">
                      <span className="text-amber-600 mt-0.5 font-bold">!</span>
                      <span className="leading-relaxed">
                        <strong className="font-semibold text-[#1d1d1f]">{result.missingKeywords.length} required skill(s)</strong> absent from resume
                      </span>
                    </li>
                    {formattingWarnings.length > 0 && (
                      <li className="flex items-start gap-2.5">
                        <span className="text-amber-600 mt-0.5 font-bold">!</span>
                        <span className="leading-relaxed">{formattingWarnings.length} formatting structure issue(s) detected</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2.5">
                      <span className="text-neutral-400 mt-0.5 font-bold">→</span>
                      <span className="leading-relaxed">Use Auto-Fix in the next tab to automatically incorporate missing skills into a clean .docx</span>
                    </li>
                  </>
                ) : (
                  <li className="text-neutral-400">All target keywords are present in your resume.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Auto-Fix */}
      {activeTab === 'autofix' && (
        <div className="space-y-6">
          <div className="macos-card-elevated rounded-3xl p-8 md:p-10 space-y-6 transition-all duration-300">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-200/40 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">auto_fix_high</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1d1d1f]">Auto-Fix & Optimization Engine</h3>
                <p className="text-[13px] text-neutral-400 mt-0.5 font-normal leading-relaxed">
                  Standardize typography, convert tables to plain paragraphs, substitute weak action verbs, and inject missing skills.
                </p>
              </div>
            </div>

            {isPdf ? (
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-[13px] text-amber-800 space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  PDF Upload Detected
                </p>
                <p className="leading-relaxed font-normal">
                  PDF files cannot be reconstructed reliably into formatted Word documents. To use the Auto-Fix and Word export feature, please either upload a .docx version or paste your resume text in a new scan.
                </p>
                <button
                  type="button"
                  onClick={onNewScan}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-200/80 text-amber-900 font-medium text-[12px] hover:bg-amber-300 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  Start New Scan (Docx or Paste)
                </button>
              </div>
            ) : !fixResult ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] text-[13px] text-neutral-600 space-y-1.5">
                  <p className="font-semibold text-[#1d1d1f]">What Auto-Fix will do:</p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-500 font-normal leading-relaxed">
                    <li>Standardize font family to Calibri 11pt across all document runs</li>
                    <li>Convert ATS-unfriendly tables into readable bullet/paragraph blocks</li>
                    <li>Upgrade passive phrases into strong action verbs (e.g. &quot;helped&quot; → &quot;contributed to&quot;)</li>
                    <li>Append missing keywords into a dedicated Skills section and recalculate score</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFix}
                  disabled={isFixing || !analysisId}
                  className={`text-[14px] font-medium py-3.5 px-8 rounded-2xl transition-all duration-300 flex items-center gap-2.5 ${
                    isFixing || !analysisId
                      ? 'bg-black/[0.06] text-neutral-400 cursor-not-allowed'
                      : 'bg-[#1d1d1f] text-white cursor-pointer hover:bg-neutral-800 active:scale-[0.98] shadow-sm'
                  }`}
                >
                  {isFixing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Optimizing & Rescoring Resume...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                      <span>Generate Fixed Resume (.docx)</span>
                    </>
                  )}
                </button>
              </div>
            ) : null}

            {fixError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/60 text-[13px] text-rose-700">
                {fixError}
              </div>
            )}

            {/* Before/after comparison card */}
            {fixResult && (
              <div className="space-y-6 pt-2">
                <div className="bg-gradient-to-br from-emerald-50/50 via-white to-white border border-emerald-200/60 rounded-3xl p-6 md:p-8 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-100/70">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold tracking-wider uppercase">
                        <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                        Optimization Complete
                      </span>
                      <h4 className="text-xl font-semibold text-[#1d1d1f] mt-2">Score Improvement</h4>
                      <p className="text-[13px] text-neutral-500 font-normal">Rescored on newly generated document content</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl shadow-2xs border border-emerald-200/50">
                      <div className="text-center">
                        <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium block">
                          Before
                        </span>
                        <span className="text-2xl font-semibold text-neutral-500">
                          {fixResult.originalScore !== undefined ? fixResult.originalScore : score}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-emerald-600 text-2xl font-semibold">
                        arrow_forward
                      </span>
                      <div className="text-center">
                        <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold block">
                          After
                        </span>
                        <span className="text-3xl font-semibold text-emerald-700">
                          {fixResult.improvedScore !== undefined ? fixResult.improvedScore : score}
                        </span>
                      </div>
                      {fixResult.improvedScore !== undefined && fixResult.originalScore !== undefined && (
                        <div className="ml-2 pl-3 border-l border-black/[0.06] text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[12px] font-semibold shadow-2xs">
                            +{Math.max(0, fixResult.improvedScore - fixResult.originalScore)} pts
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fixes list */}
                  <div className="space-y-3">
                    <p className="text-[13px] font-semibold text-[#1d1d1f]">Changes Applied to Document:</p>
                    <ul className="space-y-2 text-[13px]">
                      {fixResult.fixesApplied.map((fix, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-neutral-700 bg-white p-3 rounded-xl border border-black/[0.04] shadow-2xs">
                          <span className="material-symbols-outlined text-[18px] text-emerald-600 mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span className="leading-relaxed font-normal">{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Download Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="text-[14px] font-medium py-3.5 px-8 rounded-2xl bg-[#1d1d1f] text-white hover:bg-neutral-800 transition-all duration-300 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      <span>Download Fixed Resume (.docx)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoFix}
                      disabled={isFixing}
                      className="text-[13px] font-medium py-3 px-5 rounded-2xl bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] border border-black/[0.06] transition-all duration-300 cursor-pointer text-center active:scale-[0.98]"
                    >
                      Re-run Fix
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Keywords */}
      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="macos-card rounded-3xl p-7 space-y-4 transition-all duration-300">
            <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Matched In Resume ({result.matchedKeywords?.length ?? 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords?.length ? (
                result.matchedKeywords.map((kw, i) => (
                  <span key={i} className="text-[12px] px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium border border-emerald-100/60">
                    {kw}
                  </span>
                ))
              ) : (
                <p className="text-[13px] text-neutral-400">No keywords matched.</p>
              )}
            </div>
          </div>

          <div className="macos-card rounded-3xl p-7 space-y-4 transition-all duration-300">
            <h3 className="text-sm font-semibold text-rose-600 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">cancel</span>
              Missing In Resume ({result.missingKeywords?.length ?? 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords?.length ? (
                result.missingKeywords.map((kw, i) => (
                  <span key={i} className="text-[12px] px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-medium border border-rose-100/60">
                    {kw}
                  </span>
                ))
              ) : (
                <p className="text-[13px] text-neutral-400">No missing keywords! Complete match.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

