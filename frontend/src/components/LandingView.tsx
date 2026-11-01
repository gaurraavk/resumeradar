import React from 'react';

interface LandingViewProps {
  onStartAnalysis: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStartAnalysis }) => {
  return (
    <div className="w-full flex flex-col items-center relative z-10">
      {/* Hero Section */}
      <section className="py-20 md:py-32 flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full animate-entrance">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#15263c] tracking-tight leading-[1.08] max-w-[800px] mb-6">
          Precision resume analysis.
          <br />
          <span className="text-[#15263c]/45">Instant results.</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-[#15263c]/70 max-w-[620px] mb-10 leading-relaxed font-normal">
          Deterministic ATS keyword matching, formatting detection, and automatic resume optimization — all in one scan.
        </p>

        <button
          onClick={onStartAnalysis}
          className="bg-[#15263c] text-[#fbf9f4] hover:bg-[#1f3757] px-8 py-3.5 rounded-full text-[15px] font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(21,38,60,0.18)]"
        >
          Start Analysis
        </button>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-14 text-[13px] font-medium items-center">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#15263c]/10 shadow-2xs text-[#15263c]">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
            <span>Deterministic ATS Scoring</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#15263c]/10 shadow-2xs text-[#15263c]">
            <span className="material-symbols-outlined text-[#15263c] text-[18px]">build</span>
            <span>Auto-Fix & Download</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#15263c]/10 shadow-2xs text-[#15263c]">
            <span className="material-symbols-outlined text-[#3da6f5] text-[18px]">speed</span>
            <span>Instant Feedback</span>
          </div>
        </div>
      </section>

      {/* Process Section: How it works */}
      <section className="py-16 w-full max-w-5xl mx-auto px-6 mb-20 animate-entrance">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#15263c] tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-base sm:text-lg text-[#15263c]/70 font-normal leading-relaxed">
            From upload to optimized resume, in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={onStartAnalysis}
            className="glass-card hover:-translate-y-1 rounded-3xl p-8 transition-all duration-300 flex flex-col items-start cursor-pointer active:scale-[0.99] group"
            title="Click to start analysis"
          >
            <div className="w-12 h-12 bg-white/70 border border-[#15263c]/10 rounded-2xl flex items-center justify-center mb-6 text-[#15263c] shadow-2xs group-hover:bg-[#15263c] group-hover:text-[#fbf9f4] transition-colors">
              <span className="material-symbols-outlined text-[24px]">upload_file</span>
            </div>
            <h3 className="text-lg font-bold text-[#15263c] mb-2 flex items-center gap-1.5">
              <span>1. Upload</span>
              <span className="material-symbols-outlined text-[16px] text-[#15263c]/40 group-hover:text-[#15263c] group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </h3>
            <p className="text-[14px] text-[#15263c]/70 leading-relaxed font-normal">
              Upload your resume (.pdf or .docx) and paste the target job description.
            </p>
          </div>

          <div
            onClick={onStartAnalysis}
            className="glass-card hover:-translate-y-1 rounded-3xl p-8 transition-all duration-300 flex flex-col items-start cursor-pointer active:scale-[0.99] group"
            title="Click to start analysis"
          >
            <div className="w-12 h-12 bg-white/70 border border-[#15263c]/10 rounded-2xl flex items-center justify-center mb-6 text-[#15263c] shadow-2xs group-hover:bg-[#15263c] group-hover:text-[#fbf9f4] transition-colors">
              <span className="material-symbols-outlined text-[24px]">radar</span>
            </div>
            <h3 className="text-lg font-bold text-[#15263c] mb-2 flex items-center gap-1.5">
              <span>2. ATS Match</span>
              <span className="material-symbols-outlined text-[16px] text-[#15263c]/40 group-hover:text-[#15263c] group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </h3>
            <p className="text-[14px] text-[#15263c]/70 leading-relaxed font-normal">
              Our deterministic engine cross-references keywords and skills to compute your real ATS match score.
            </p>
          </div>

          <div
            onClick={onStartAnalysis}
            className="glass-card hover:-translate-y-1 rounded-3xl p-8 transition-all duration-300 flex flex-col items-start cursor-pointer active:scale-[0.99] group"
            title="Click to start analysis"
          >
            <div className="w-12 h-12 bg-white/70 border border-[#15263c]/10 rounded-2xl flex items-center justify-center mb-6 text-[#15263c] shadow-2xs group-hover:bg-[#15263c] group-hover:text-[#fbf9f4] transition-colors">
              <span className="material-symbols-outlined text-[24px]">auto_fix_high</span>
            </div>
            <h3 className="text-lg font-bold text-[#15263c] mb-2 flex items-center gap-1.5">
              <span>3. Auto-Fix</span>
              <span className="material-symbols-outlined text-[16px] text-[#15263c]/40 group-hover:text-[#15263c] group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </h3>
            <p className="text-[14px] text-[#15263c]/70 leading-relaxed font-normal">
              Automatically fix formatting, strengthen action verbs, and add missing keywords — download the optimized .docx.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
