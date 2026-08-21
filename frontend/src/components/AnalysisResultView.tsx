import React, { useState } from 'react';
import { MatchResult, ResumeData, Recommendation } from '../types';
import { KeywordFrequencyComparisonChart } from './KeywordFrequencyComparisonChart';

interface AnalysisResultViewProps {
  matchResult: MatchResult;
  resume: ResumeData;
  onApplyRecommendations: (selectedRecs: Recommendation[]) => void;
  onEditResume: (updatedResume: ResumeData) => void;
  isOptimizing: boolean;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  matchResult,
  resume,
  onApplyRecommendations,
  onEditResume,
  isOptimizing,
}) => {
  const [activeTab, setActiveTab] = useState<'matched' | 'missing' | 'actions'>('missing');
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    matchResult.recommendations || []
  );
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [editableResume, setEditableResume] = useState<ResumeData>(resume);
  const [addedKeywords, setAddedKeywords] = useState<string[]>([]);

  const toggleRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, selected: !rec.selected } : rec))
    );
  };

  const handleAddKeywordToResume = (keyword: string) => {
    if (addedKeywords.includes(keyword)) return;
    setAddedKeywords([...addedKeywords, keyword]);
    const updated = {
      ...editableResume,
      skills: [...editableResume.skills, keyword],
    };
    setEditableResume(updated);
    onEditResume(updated);
  };

  const handleSaveResumeEdit = () => {
    setIsEditingResume(false);
    onEditResume(editableResume);
  };

  const handleApply = () => {
    const selected = recommendations.filter((r) => r.selected);
    onApplyRecommendations(selected);
  };

  const score = matchResult.overallScore;

  return (
    <div className="w-full flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Pane: Source Resume Viewer & Editor */}
      <section className="flex-1 bg-white border border-[#cfc4c5]/60 rounded-xl shadow-xs flex flex-col min-h-[680px] overflow-hidden">
        {/* Header bar */}
        <div className="px-5 py-3.5 border-b border-[#cfc4c5]/60 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058bc] text-lg icon-fill">description</span>
            <h2 className="text-xs font-semibold text-black">{resume.fileName || 'Source Resume.pdf'}</h2>
          </div>
          <button
            onClick={() => setIsEditingResume(!isEditingResume)}
            className="flex items-center gap-1 text-xs text-[#4c4546] hover:text-black font-medium transition-colors cursor-pointer px-2 py-1 rounded hover:bg-neutral-100"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>{isEditingResume ? 'Done Editing' : 'Edit Resume'}</span>
          </button>
        </div>

        {/* Resume Content View */}
        <div className="p-8 flex-1 overflow-y-auto text-sm text-[#4c4546] leading-relaxed custom-scrollbar">
          {isEditingResume ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Full Name</label>
                <input
                  type="text"
                  value={editableResume.name}
                  onChange={(e) => setEditableResume({ ...editableResume, name: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Target Title</label>
                <input
                  type="text"
                  value={editableResume.title}
                  onChange={(e) => setEditableResume({ ...editableResume, title: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Summary</label>
                <textarea
                  value={editableResume.summary}
                  onChange={(e) => setEditableResume({ ...editableResume, summary: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-neutral-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editableResume.skills.join(', ')}
                  onChange={(e) =>
                    setEditableResume({
                      ...editableResume,
                      skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full p-2 border border-neutral-300 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={handleSaveResumeEdit}
                className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-1">
                {editableResume.name}
              </h3>
              <p className="text-sm font-medium text-black mb-6">
                {editableResume.title} | {editableResume.location || 'San Francisco, CA'}
              </p>

              {/* Experience Section */}
              <h4 className="text-[11px] font-bold text-black mt-8 mb-3 uppercase tracking-widest border-b border-[#cfc4c5]/60 pb-2">
                Experience
              </h4>

              <div className="space-y-6">
                {editableResume.experience?.map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <div>
                      <strong className="text-black font-semibold text-sm">{exp.role}</strong>
                      <span className="text-[#7e7576] text-xs ml-2">
                        - {exp.company} ({exp.period})
                      </span>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[#4c4546]">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {bullet.includes('15%') ? (
                            <>
                              Led cross-functional teams to deliver enterprise software solutions.{' '}
                              <span className="bg-[#eeedf3] px-1.5 py-0.5 rounded font-medium text-black">
                                Increased user retention by 15%
                              </span>{' '}
                              through data-driven feature prioritization.
                            </>
                          ) : (
                            bullet
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Skills Section */}
              <h4 className="text-[11px] font-bold text-black mt-8 mb-3 uppercase tracking-widest border-b border-[#cfc4c5]/60 pb-2">
                Skills
              </h4>
              <p className="text-sm text-[#4c4546] leading-relaxed">
                {editableResume.skills.join(', ')}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Right Pane: Analysis Dashboard */}
      <section className="w-full lg:w-[480px] flex flex-col gap-5">
        {/* Score Card with Circular Gradient Meter */}
        <div className="bg-white border border-[#cfc4c5]/60 rounded-xl shadow-xs p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black tracking-tight mb-1">
              Analysis Complete
            </h2>
            <p className="text-xs text-[#4c4546]">
              Target Job: <span className="font-semibold text-black">{matchResult.jobTitle}</span>
            </p>
          </div>

          {/* Radial Circular Progress Gauge */}
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-xs"
            style={{
              background: `conic-gradient(#000000 ${score}%, #f4f3f8 0)`,
            }}
          >
            <div className="w-[86px] h-[86px] bg-white rounded-full flex items-center justify-center flex-col">
              <span className="text-2xl font-extrabold text-black leading-none">{score}</span>
              <span className="text-[10px] text-[#7e7576] font-semibold mt-0.5">/ 100</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white rounded-xl p-1 border border-[#cfc4c5]/60 shadow-2xs">
          <button
            onClick={() => setActiveTab('matched')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'matched' ? 'bg-black text-white' : 'text-[#4c4546] hover:bg-[#f4f3f8]'
            }`}
          >
            Matched ({matchResult.foundSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('missing')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'missing' ? 'bg-black text-white' : 'text-[#4c4546] hover:bg-[#f4f3f8]'
            }`}
          >
            Missing ({matchResult.missingKeywords.length})
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'actions' ? 'bg-black text-white' : 'text-[#4c4546] hover:bg-[#f4f3f8]'
            }`}
          >
            Actions ({recommendations.length})
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 space-y-4">
          {/* Missing Keywords Block */}
          {(activeTab === 'missing' || activeTab === 'actions') && (
            <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-5 shadow-xs">
              <div className="flex justify-between items-start mb-3.5">
                <h4 className="text-xs font-bold text-black flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">warning</span>
                  Missing Keywords
                </h4>
                <span className="text-[11px] font-semibold text-[#0058bc] bg-[#d8e2ff] px-2.5 py-0.5 rounded-full">
                  High Impact
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingKeywords.map((kw, i) => {
                  const isAdded = addedKeywords.includes(kw.term);
                  return (
                    <button
                      key={i}
                      onClick={() => handleAddKeywordToResume(kw.term)}
                      className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-green-100 text-green-800 border border-green-300 font-semibold'
                          : 'border border-dashed border-[#7e7576] hover:border-black text-[#4c4546] hover:text-black bg-transparent'
                      }`}
                      title="Click to add to resume skills"
                    >
                      <span>{kw.term}</span>
                      <span className="material-symbols-outlined text-[14px]">
                        {isAdded ? 'check' : 'add_circle'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Found Skills Block */}
          {(activeTab === 'matched' || activeTab === 'missing') && (
            <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-5 shadow-xs">
              <div className="flex justify-between items-start mb-3.5">
                <h4 className="text-xs font-bold text-black flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="material-symbols-outlined text-green-700 text-[18px]">check_circle</span>
                  Found Skills
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchResult.foundSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-[#f4f3f8] text-black text-xs font-medium px-3 py-1.5 rounded-full border border-neutral-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Recommendations Block */}
          <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-black mb-3.5 uppercase tracking-wide">
              Actionable Recommendations
            </h4>
            <ul className="space-y-3.5 text-xs text-[#4c4546]">
              {recommendations.map((rec) => (
                <li key={rec.id} className="flex items-start gap-3 group">
                  <input
                    type="checkbox"
                    checked={rec.selected}
                    onChange={() => toggleRecommendation(rec.id)}
                    className="mt-0.5 w-4 h-4 rounded border-[#cfc4c5] text-black focus:ring-0 focus:ring-offset-0 cursor-pointer accent-black"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-black group-hover:text-[#0058bc] transition-colors leading-relaxed block">
                      {rec.description}
                    </span>
                    {rec.suggestedText && (
                      <span className="text-[11px] text-neutral-500 mt-1 block italic border-l-2 border-[#0058bc] pl-2">
                        Rewrite: "{rec.suggestedText}"
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleApply}
          disabled={isOptimizing}
          className="w-full bg-black hover:bg-neutral-800 text-white font-semibold text-xs py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isOptimizing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Rewriting Resume with Gemini...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Apply Selected Recommendations</span>
            </>
          )}
        </button>
      </section>
    </div>

    {/* Visual Keyword Frequency & Gap Comparison Component (Recharts / D3) */}
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-8">
      <KeywordFrequencyComparisonChart
        matchResult={matchResult}
        resume={editableResume}
      />
    </div>
  </div>
  );
};
