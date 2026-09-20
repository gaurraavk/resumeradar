import React from 'react';

interface LandingViewProps {
  onStartAnalysis: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartAnalysis,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="py-20 md:py-32 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#1d1d1f] tracking-tight leading-[1.08] max-w-[800px] mb-6">
          Precision resume analysis.
          <br />
          <span className="text-neutral-400">Instant results.</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-neutral-500 max-w-[620px] mb-12 leading-relaxed font-normal">
          Deterministic ATS keyword matching, formatting detection, and automatic resume optimization — all in one scan.
        </p>

        <button
          onClick={onStartAnalysis}
          className="bg-[#1d1d1f] text-white hover:bg-neutral-800 px-8 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
        >
          Start Analysis
        </button>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-16 text-neutral-500 text-[13px] font-medium items-center">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/[0.04] shadow-2xs">
            <span className="material-symbols-outlined text-emerald-600 text-[17px]">verified</span>
            <span>Deterministic ATS Scoring</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/[0.04] shadow-2xs">
            <span className="material-symbols-outlined text-neutral-600 text-[17px]">build</span>
            <span>Auto-Fix & Download</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/[0.04] shadow-2xs">
            <span className="material-symbols-outlined text-blue-600 text-[17px]">speed</span>
            <span>Instant Feedback</span>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 w-full max-w-5xl mx-auto px-6 mb-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-base sm:text-lg text-neutral-500 font-normal leading-relaxed">
            From upload to optimized resume, in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="macos-card hover:macos-card-elevated rounded-3xl p-8 transition-all duration-300 flex flex-col items-start">
            <div className="w-12 h-12 bg-black/[0.03] border border-black/[0.04] rounded-2xl flex items-center justify-center mb-6 text-[#1d1d1f]">
              <span className="material-symbols-outlined text-[22px] icon-fill">upload_file</span>
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">1. Upload</h3>
            <p className="text-[14px] text-neutral-500 leading-relaxed font-normal">
              Upload your resume (.pdf or .docx) and paste the target job description.
            </p>
          </div>

          <div className="macos-card hover:macos-card-elevated rounded-3xl p-8 transition-all duration-300 flex flex-col items-start">
            <div className="w-12 h-12 bg-black/[0.03] border border-black/[0.04] rounded-2xl flex items-center justify-center mb-6 text-[#1d1d1f]">
              <span className="material-symbols-outlined text-[22px] icon-fill">radar</span>
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">2. ATS Match</h3>
            <p className="text-[14px] text-neutral-500 leading-relaxed font-normal">
              Our deterministic engine cross-references keywords and skills to compute your real ATS match score.
            </p>
          </div>

          <div className="macos-card hover:macos-card-elevated rounded-3xl p-8 transition-all duration-300 flex flex-col items-start">
            <div className="w-12 h-12 bg-black/[0.03] border border-black/[0.04] rounded-2xl flex items-center justify-center mb-6 text-[#1d1d1f]">
              <span className="material-symbols-outlined text-[22px] icon-fill">auto_fix_high</span>
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">3. Auto-Fix</h3>
            <p className="text-[14px] text-neutral-500 leading-relaxed font-normal">
              Automatically fix formatting, strengthen action verbs, and add missing keywords — download the optimized .docx.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
