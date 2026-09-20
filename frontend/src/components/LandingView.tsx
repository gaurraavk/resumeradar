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
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-neutral-900 tracking-tight leading-[1.08] max-w-[800px] mb-6">
          Precision resume analysis.
          <br />
          <span className="text-neutral-400">Instant results.</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-500 max-w-[600px] mb-12 leading-relaxed font-normal">
          Deterministic ATS keyword matching, formatting detection, and automatic resume optimization — all in one scan.
        </p>

        <button
          onClick={onStartAnalysis}
          className="bg-neutral-900 text-white hover:bg-neutral-700 px-8 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-200 active:scale-[0.97] cursor-pointer"
        >
          Start Analysis
        </button>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-neutral-400 text-[13px] font-medium items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-300 text-[18px]">verified</span>
            Deterministic ATS Scoring
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-300 text-[18px]">build</span>
            Auto-Fix & Download
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-300 text-[18px]">speed</span>
            Instant Feedback
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 w-full max-w-5xl mx-auto px-6 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-lg text-neutral-500 font-normal">
            From upload to optimized resume, in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-8 hover:shadow-lg shadow-sm transition-shadow duration-300 flex flex-col items-start">
            <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6 text-neutral-600">
              <span className="material-symbols-outlined text-[24px] icon-fill">upload_file</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">1. Upload</h3>
            <p className="text-[15px] text-neutral-500 leading-relaxed">
              Upload your resume (.pdf or .docx) and paste the target job description.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 hover:shadow-lg shadow-sm transition-shadow duration-300 flex flex-col items-start">
            <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6 text-neutral-600">
              <span className="material-symbols-outlined text-[24px] icon-fill">radar</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">2. ATS Match</h3>
            <p className="text-[15px] text-neutral-500 leading-relaxed">
              Our deterministic engine cross-references keywords and skills to compute your real ATS match score.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 hover:shadow-lg shadow-sm transition-shadow duration-300 flex flex-col items-start">
            <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6 text-neutral-600">
              <span className="material-symbols-outlined text-[24px] icon-fill">auto_fix_high</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">3. Auto-Fix</h3>
            <p className="text-[15px] text-neutral-500 leading-relaxed">
              Automatically fix formatting, strengthen action verbs, and add missing keywords — download the optimized .docx.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
