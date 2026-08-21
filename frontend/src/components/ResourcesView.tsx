import React, { useState } from 'react';

export const ResourcesView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'verbs' | 'formula' | 'ats_rules'>('verbs');

  const actionVerbs = {
    Engineering: ['Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Refactored', 'Deployed', 'Automated', 'Scaled'],
    Leadership: ['Pioneered', 'Orchestrated', 'Directed', 'Mobilized', 'Formulated', 'Governed', 'Championed'],
    Product: ['Conceptualized', 'Prioritized', 'Validated', 'Iterated', 'Launched', 'Monetized', 'Standardized'],
    Impact: ['Maximized', 'Accelerated', 'Elevated', 'Curtailed', 'Augmented', 'Surpassed', 'Amplified'],
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">Resume &amp; ATS Knowledge Base</h1>
        <p className="text-sm text-[#4c4546] mt-1">
          Master the mechanics of applicant tracking systems and high-conversion bullet point formulas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#cfc4c5]/60 pb-3">
        <button
          onClick={() => setActiveCategory('verbs')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeCategory === 'verbs' ? 'bg-black text-white' : 'bg-[#f4f3f8] text-[#4c4546] hover:bg-[#e9e7ed]'
          }`}
        >
          High-Impact Action Verbs
        </button>
        <button
          onClick={() => setActiveCategory('formula')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeCategory === 'formula' ? 'bg-black text-white' : 'bg-[#f4f3f8] text-[#4c4546] hover:bg-[#e9e7ed]'
          }`}
        >
          The Google "XYZ" Formula
        </button>
        <button
          onClick={() => setActiveCategory('ats_rules')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeCategory === 'ats_rules' ? 'bg-black text-white' : 'bg-[#f4f3f8] text-[#4c4546] hover:bg-[#e9e7ed]'
          }`}
        >
          ATS Parsing Golden Rules
        </button>
      </div>

      {activeCategory === 'verbs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(actionVerbs).map(([category, words]) => (
            <div key={category} className="bg-white border border-[#cfc4c5]/60 rounded-xl p-5 shadow-xs">
              <h3 className="font-bold text-sm text-black mb-3 pb-2 border-b border-neutral-100 flex items-center justify-between">
                <span>{category}</span>
                <span className="text-[10px] text-[#0058bc] bg-[#d8e2ff] px-2 py-0.5 rounded-full font-bold">
                  Power Verbs
                </span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {words.map((w, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#f4f3f8] hover:bg-black hover:text-white transition-colors text-black px-2.5 py-1 rounded-md font-medium cursor-pointer"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCategory === 'formula' && (
        <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-black mb-2">The Laszlo Bock "XYZ" Formula</h3>
            <p className="text-sm text-[#4c4546] leading-relaxed">
              Standardized by Google's former VP of People Operations: 
              <strong className="text-black font-semibold"> "Accomplished [X], as measured by [Y], by doing [Z]."</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-5">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider block mb-2">
                ❌ Weak (Unquantified &amp; Passive)
              </span>
              <p className="text-sm text-neutral-800 italic">
                "Worked on the frontend of the main application and helped improve loading times for users."
              </p>
              <p className="text-xs text-neutral-500 mt-3">
                Issue: Lacks ownership verb, metrics, and technical methodology.
              </p>
            </div>

            <div className="bg-green-50/50 border border-green-200 rounded-xl p-5">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">
                ✓ ResumeRadar Optimized (Top 5% Match)
              </span>
              <p className="text-sm text-neutral-900 font-medium">
                "Optimized application performance, resulting in a <span className="text-green-800 font-bold">40% reduction</span> in initial load time and improving <span className="text-green-800 font-bold">Core Web Vitals</span>."
              </p>
              <p className="text-xs text-neutral-600 mt-3">
                Strength: Led with "Optimized", measured with "40% reduction", applied "Core Web Vitals".
              </p>
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'ats_rules' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-black mb-2">Standard Section Headers</h3>
            <p className="text-xs text-[#4c4546] leading-relaxed">
              Never use creative titles like "Where I've Been" or "Capabilities". Use exact headers: Experience, Skills, Education.
            </p>
          </div>

          <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-black mb-2">No Multi-Column Tables</h3>
            <p className="text-xs text-[#4c4546] leading-relaxed">
              Complex floating table layouts scramble left-to-right reading order in legacy enterprise parsers (e.g. Workday).
            </p>
          </div>

          <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-black mb-2">Exact Keyword Stemming</h3>
            <p className="text-xs text-[#4c4546] leading-relaxed">
              If the job posting explicitly asks for "React.js" and "TypeScript", make sure both exact acronyms appear in your skills list.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
