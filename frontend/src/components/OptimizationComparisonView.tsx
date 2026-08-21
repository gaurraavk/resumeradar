import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { OptimizationResult, ResumeData } from '../types';

interface OptimizationComparisonViewProps {
  optimizationResult: OptimizationResult;
  onOpenVersionHistory: () => void;
  onOpenExport: () => void;
  onNewAnalysis: () => void;
}

export const OptimizationComparisonView: React.FC<OptimizationComparisonViewProps> = ({
  optimizationResult,
  onOpenVersionHistory,
  onOpenExport,
  onNewAnalysis,
}) => {
  const [showHighlights, setShowHighlights] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeResumeVersion, setActiveResumeVersion] = useState<ResumeData>(
    optimizationResult.optimizedResume
  );

  useEffect(() => {
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0058bc', '#000000', '#d8e2ff'],
      });
    } catch {
      // ignore in test runners
    }
  }, []);

  const handleCopyPlainText = () => {
    const text = `
${activeResumeVersion.name}
${activeResumeVersion.title} | ${activeResumeVersion.location}
${activeResumeVersion.email} | ${activeResumeVersion.phone}

SUMMARY
${activeResumeVersion.summary}

EXPERIENCE
${activeResumeVersion.experience
  ?.map(
    (exp) => `${exp.role} - ${exp.company} (${exp.period})\n` + exp.bullets.map((b) => `• ${b}`).join('\n')
  )
  .join('\n\n')}

SKILLS
${activeResumeVersion.skills.join(', ')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const origResume = optimizationResult.originalResume;
  const optResume = activeResumeVersion;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      {/* Header Section matching Image 5 */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#cfc4c5]/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
            Optimization Complete
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
            <span className="font-semibold text-black">Role: {optimizationResult.jobTitle}</span>
            <span className="text-[#cfc4c5]">•</span>
            <div className="flex items-center gap-1.5 font-bold text-black bg-[#eeedf3] px-3 py-1 rounded-full text-xs">
              <span>Score: {optimizationResult.originalScore}</span>
              <span className="material-symbols-outlined text-[16px] text-green-700">trending_up</span>
              <span className="text-green-700">{optimizationResult.optimizedScore}</span>
            </div>
            <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full">
              {optimizationResult.matchRank || 'Top 5% Match'}
            </span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={onOpenVersionHistory}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4c4546] hover:text-black px-3.5 py-2.5 rounded-xl border border-[#cfc4c5]/80 bg-white hover:bg-[#f4f3f8] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            Version History
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 text-xs font-semibold bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Optimized Resume
          </button>
        </div>
      </header>

      {/* Tool Extension Quick Action Banner */}
      <div className="bg-[#faf9fe] p-4 rounded-2xl border border-[#cfc4c5]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0058bc]"></span>
          <span className="font-bold text-black">Next Recommended Application Steps:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => (window as any)._navigateToTab?.('cover-letter')}
            className="flex items-center gap-1.5 bg-white border border-[#cfc4c5]/80 hover:bg-[#eeedf3] text-black px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0058bc]">mail</span>
            Generate Cover Letter
          </button>
          <button
            onClick={() => (window as any)._navigateToTab?.('interview-prep')}
            className="flex items-center gap-1.5 bg-white border border-[#cfc4c5]/80 hover:bg-[#eeedf3] text-black px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0058bc]">psychology</span>
            Interview Q&amp;A
          </button>
          <button
            onClick={() => (window as any)._navigateToTab?.('ats-simulator')}
            className="flex items-center gap-1.5 bg-white border border-[#cfc4c5]/80 hover:bg-[#eeedf3] text-black px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0058bc]">developer_board</span>
            ATS Parser Check
          </button>
          <button
            onClick={() => (window as any)._navigateToTab?.('template-studio')}
            className="flex items-center gap-1.5 bg-white border border-[#cfc4c5]/80 hover:bg-[#eeedf3] text-black px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0058bc]">view_quilt</span>
            ATS Template Studio
          </button>
        </div>
      </div>

      {/* Control Bar: Highlights Toggle & Copy Tool */}
      <div className="flex justify-between items-center bg-white px-5 py-3 rounded-xl border border-[#cfc4c5]/60 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-black">Visual Highlights:</span>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showHighlights}
              onChange={(e) => setShowHighlights(e.target.checked)}
              className="w-4 h-4 rounded border-[#cfc4c5] text-black focus:ring-0 cursor-pointer accent-black"
            />
            <span className="text-[#4c4546]">Highlight changes &amp; additions</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyPlainText}
            className="flex items-center gap-1 text-[#4c4546] hover:text-black font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied to clipboard!' : 'Copy text'}</span>
          </button>
          <button
            onClick={onNewAnalysis}
            className="text-[#0058bc] hover:underline font-semibold cursor-pointer"
          >
            + Optimize another role
          </button>
        </div>
      </div>

      {/* Split Comparison View Matching Image 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Original Draft */}
        <div className="bg-white border border-[#cfc4c5]/60 rounded-xl overflow-hidden shadow-xs flex flex-col min-h-[580px]">
          <div className="px-6 py-3.5 border-b border-[#cfc4c5]/60 bg-[#f4f3f8] flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7e7576]">
              Original Draft (Score: {optimizationResult.originalScore})
            </span>
            <span className="text-[11px] text-[#7e7576]">Initial upload</span>
          </div>

          <div className="p-8 flex-1 text-sm text-[#4c4546] leading-relaxed custom-scrollbar overflow-y-auto">
            <h2 className="text-2xl font-bold text-black">{origResume.name}</h2>
            <p className="text-xs text-[#7e7576] mb-6 font-medium">
              {origResume.title} | {origResume.location}
            </p>

            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-black uppercase tracking-widest border-b border-neutral-200 pb-1.5 mb-3">
                Experience
              </h3>

              <div className="space-y-4">
                {origResume.experience?.map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <p className="font-semibold text-black text-xs">
                      {exp.role} <span className="text-[#7e7576] font-normal">({exp.period})</span>
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#4c4546]">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-black uppercase tracking-widest border-b border-neutral-200 pb-1.5 mb-3">
                Skills
              </h3>
              <p className="text-xs text-[#4c4546]">{origResume.skills.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Optimized For Target Role */}
        <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-md flex flex-col min-h-[580px] relative">
          {/* Header with Legend */}
          <div className="px-6 py-3.5 border-b border-[#cfc4c5]/60 bg-black text-white flex flex-wrap justify-between items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Optimized for Target Role (Score: {optimizationResult.optimizedScore})
            </span>

            {/* Floating Legend */}
            <div className="flex items-center gap-2">
              <span className="bg-[#e2dfff] text-[#001a41] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Keywords Added
              </span>
              <span className="bg-[#d8e2ff] text-[#0058bc] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Action Verbs Enhanced
              </span>
            </div>
          </div>

          {/* Optimized Content */}
          <div className="p-8 flex-1 text-sm text-[#4c4546] leading-relaxed custom-scrollbar overflow-y-auto bg-white">
            <h2 className="text-2xl font-bold text-black">{optResume.name}</h2>
            <p className="text-xs text-[#0058bc] font-semibold mb-6">
              {optResume.title} | {optResume.location}
            </p>

            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-black uppercase tracking-widest border-b border-black pb-1.5 mb-3">
                Experience
              </h3>

              <div className="space-y-4">
                {optResume.experience?.map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <p className="font-bold text-black text-xs">
                      {exp.role} <span className="text-[#7e7576] font-normal">({exp.period})</span>
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-xs text-[#1a1b1f]">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="leading-relaxed">
                          {showHighlights ? (
                            <span>
                              {b.includes('Architected') ? (
                                <>
                                  <span className="bg-[#d8e2ff] text-[#0058bc] font-bold px-1 rounded">
                                    Architected
                                  </span>{' '}
                                  and deployed scalable UI components for the core enterprise
                                  application using{' '}
                                  <span className="bg-[#e2dfff] text-[#001a41] font-bold px-1 rounded">
                                    React.js
                                  </span>{' '}
                                  and{' '}
                                  <span className="bg-[#e2dfff] text-[#001a41] font-bold px-1 rounded">
                                    TypeScript
                                  </span>
                                  .
                                </>
                              ) : b.includes('Optimized') ? (
                                <>
                                  <span className="bg-[#d8e2ff] text-[#0058bc] font-bold px-1 rounded">
                                    Optimized
                                  </span>{' '}
                                  application performance, resulting in a{' '}
                                  <span className="bg-[#e2dfff] text-[#001a41] font-bold px-1 rounded">
                                    40% reduction
                                  </span>{' '}
                                  in initial load time and improving{' '}
                                  <span className="bg-[#e2dfff] text-[#001a41] font-bold px-1 rounded">
                                    Core Web Vitals
                                  </span>
                                  .
                                </>
                              ) : b.includes('Spearheaded') ? (
                                <>
                                  <span className="bg-[#d8e2ff] text-[#0058bc] font-bold px-1 rounded">
                                    Spearheaded
                                  </span>{' '}
                                  the migration to a modern{' '}
                                  <span className="bg-[#e2dfff] text-[#001a41] font-bold px-1 rounded">
                                    Tailwind CSS
                                  </span>{' '}
                                  design system, ensuring cross-browser consistency and responsive design.
                                </>
                              ) : (
                                b
                              )}
                            </span>
                          ) : (
                            b
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-black uppercase tracking-widest border-b border-black pb-1.5 mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {optResume.skills.map((skill, idx) => {
                  const isNewlyAdded =
                    optimizationResult.highlightedKeywords.includes(skill) ||
                    !origResume.skills.includes(skill);

                  return (
                    <span
                      key={idx}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                        showHighlights && isNewlyAdded
                          ? 'bg-[#e2dfff] text-[#001a41] font-bold'
                          : 'bg-[#eeedf3] text-black'
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
