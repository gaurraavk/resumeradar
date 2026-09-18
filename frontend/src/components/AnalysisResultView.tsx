import React, { useState } from 'react';
import { AnalysisResult, ResumeData } from '../types';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  resume: ResumeData;
  onNewScan: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  resume,
  onNewScan,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'critique'>('overview');
  const score = result.atsScore ?? 0;
  const critique = result.aiCritique;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#cfc4c5]/60">
        <div>
          <span className="text-xs font-bold text-[#0058bc] uppercase tracking-wider">Analysis Complete</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mt-1">
            ATS Match &amp; Resume Critique
          </h1>
          <p className="text-xs text-[#7e7576] mt-0.5">
            Evaluated document: <span className="font-semibold text-black">{resume.fileName || 'Candidate Resume'}</span>
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>New Analysis</span>
        </button>
      </div>

      {/* Hero Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7e7576] mb-4">ATS Match Score</span>
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-inner"
            style={{
              background: `conic-gradient(#0058bc ${score}%, #f4f3f8 0)`,
            }}
          >
            <div className="w-[110px] h-[110px] bg-white rounded-full flex items-center justify-center flex-col shadow-xs">
              <span className="text-3xl font-black text-black leading-none">{score}</span>
              <span className="text-[11px] text-[#7e7576] font-semibold mt-1">/ 100</span>
            </div>
          </div>
          <p className="text-xs text-[#4c4546] font-medium mt-4">
            {score >= 80 ? 'Strong ATS Alignment' : score >= 60 ? 'Moderate ATS Alignment' : 'Needs Optimization'}
          </p>
        </div>

        <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-700">Matched Keywords</span>
            <div className="text-3xl font-black text-black mt-2">{result.matchedKeywords?.length ?? 0}</div>
            <p className="text-xs text-[#7e7576] mt-1">Skills and terms found in your resume</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4 max-h-24 overflow-y-auto">
            {result.matchedKeywords?.slice(0, 10).map((kw, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-green-50 text-green-800 border border-green-200 font-medium">
                {kw}
              </span>
            ))}
            {(result.matchedKeywords?.length ?? 0) > 10 && (
              <span className="text-[11px] text-[#7e7576] py-1">+{result.matchedKeywords.length - 10} more</span>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ba1a1a]">Missing Keywords</span>
            <div className="text-3xl font-black text-black mt-2">{result.missingKeywords?.length ?? 0}</div>
            <p className="text-xs text-[#7e7576] mt-1">Job requirements absent from your resume</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4 max-h-24 overflow-y-auto">
            {result.missingKeywords?.slice(0, 10).map((kw, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 font-medium">
                {kw}
              </span>
            ))}
            {(result.missingKeywords?.length ?? 0) > 10 && (
              <span className="text-[11px] text-[#7e7576] py-1">+{result.missingKeywords.length - 10} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#cfc4c5]/60 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'overview' ? 'bg-black text-white shadow-xs' : 'bg-white text-[#7e7576] hover:text-black border border-[#cfc4c5]/60'
          }`}
        >
          Detailed Breakdown
        </button>
        <button
          onClick={() => setActiveTab('critique')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'critique' ? 'bg-black text-white shadow-xs' : 'bg-white text-[#7e7576] hover:text-black border border-[#cfc4c5]/60'
          }`}
        >
          AI Resume Critique {critique ? '✓' : ''}
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'keywords' ? 'bg-black text-white shadow-xs' : 'bg-white text-[#7e7576] hover:text-black border border-[#cfc4c5]/60'
          }`}
        >
          All Keywords ({((result.matchedKeywords?.length ?? 0) + (result.missingKeywords?.length ?? 0))})
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {critique?.overallReview && (
            <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700">psychology</span>
                <h3 className="text-sm font-bold text-black uppercase tracking-wider">Executive AI Summary</h3>
              </div>
              <p className="text-sm text-[#4c4546] leading-relaxed">{critique.overallReview}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-700">thumb_up</span>
                <h3 className="text-xs font-bold text-black uppercase tracking-wider">Strengths</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#4c4546]">
                {critique?.strengths?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-700 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                )) || <li className="text-[#7e7576]">No specific strengths recorded.</li>}
              </ul>
            </div>

            <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700">build</span>
                <h3 className="text-xs font-bold text-black uppercase tracking-wider">Areas for Improvement</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#4c4546]">
                {critique?.weaknesses?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                )) || <li className="text-[#7e7576]">No specific weaknesses recorded.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Critique */}
      {activeTab === 'critique' && (
        <div className="space-y-6">
          {result.aiError ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <p className="font-bold">AI Critic Notice:</p>
              <p>{result.aiError}</p>
            </div>
          ) : null}

          {critique ? (
            <div className="space-y-6">
              <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs space-y-2">
                <h3 className="text-xs font-bold text-black uppercase tracking-wider">Overall Assessment</h3>
                <p className="text-sm text-[#4c4546] leading-relaxed">{critique.overallReview}</p>
              </div>

              <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-black uppercase tracking-wider text-[#0058bc]">Actionable Suggestions</h3>
                <ul className="space-y-3 text-xs text-[#4c4546]">
                  {critique.suggestions?.map((sugg, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#faf9fe] border border-[#cfc4c5]/40">
                      <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed font-medium text-black">{sugg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-8 text-center text-xs text-[#7e7576]">
              No AI critique data available for this analysis.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Keywords */}
      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider text-green-700 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Matched In Resume ({result.matchedKeywords?.length ?? 0})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords?.map((kw, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-900 border border-green-200 font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider text-[#ba1a1a] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>Missing In Resume ({result.missingKeywords?.length ?? 0})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords?.map((kw, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-900 border border-red-200 font-medium">
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
