import React from 'react';

export const InsightsView: React.FC = () => {
  const topKeywords = [
    { name: 'Cloud Infrastructure / AWS', demand: 94, freq: '88% of tech postings' },
    { name: 'Go-to-market Strategy', demand: 89, freq: '74% of PM postings' },
    { name: 'TypeScript & React Architecture', demand: 92, freq: '82% of frontend roles' },
    { name: 'Core Web Vitals & Optimization', demand: 84, freq: '69% of UI engineering' },
    { name: 'Machine Learning Pipelines (PyTorch/MLOps)', demand: 96, freq: '91% of AI roles' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">ATS Insights &amp; Market Intelligence</h1>
        <p className="text-sm text-[#4c4546] mt-1">
          Real-time analysis benchmarks and keyword demand across modern ATS screening systems.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-6 shadow-xs">
          <span className="text-xs font-semibold text-[#7e7576] uppercase tracking-wider block">
            Avg Score Improvement
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-black">+22 pts</span>
            <span className="text-xs text-green-700 font-bold">72 → 94</span>
          </div>
          <p className="text-xs text-[#4c4546] mt-2">
            Candidates scoring 90+ see a 3.8x higher recruiter callback rate.
          </p>
        </div>

        <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-6 shadow-xs">
          <span className="text-xs font-semibold text-[#7e7576] uppercase tracking-wider block">
            ATS Parsing Accuracy
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-black">99.4%</span>
            <span className="text-xs text-[#0058bc] font-bold">High Fidelity</span>
          </div>
          <p className="text-xs text-[#4c4546] mt-2">
            Validated against Workday, Greenhouse, Lever, and iCIMS parser schemas.
          </p>
        </div>

        <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-6 shadow-xs">
          <span className="text-xs font-semibold text-[#7e7576] uppercase tracking-wider block">
            Action Verb Density
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-black">100%</span>
            <span className="text-xs text-green-700 font-bold">Lead Impact</span>
          </div>
          <p className="text-xs text-[#4c4546] mt-2">
            Every bullet point rewritten follows the XYZ Formula (Accomplished [X] measured by [Y] by doing [Z]).
          </p>
        </div>
      </div>

      {/* Top Missing Keywords in Industry */}
      <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-6 md:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-black mb-1">Highest Impact ATS Screening Keywords (2026)</h2>
        <p className="text-xs text-[#4c4546] mb-6">
          Keywords currently carrying the highest rejection weights in applicant filtering algorithms.
        </p>

        <div className="space-y-4">
          {topKeywords.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-black">{item.name}</span>
                <span className="text-[#0058bc]">{item.freq}</span>
              </div>
              <div className="w-full h-2.5 bg-[#f4f3f8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${item.demand}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
