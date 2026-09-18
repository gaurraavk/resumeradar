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
      <section className="py-16 md:py-24 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-black tracking-tight leading-[1.1] max-w-[900px] mb-6">
          Scan your resume against any job description.
        </h1>

        <p className="text-base sm:text-lg md:text-[19px] text-[#4c4546] max-w-[700px] mb-10 leading-relaxed">
          Deterministic ATS keyword matching coupled with Gemini AI resume critique. Discover missing skills, keyword gaps, and actionable recommendations in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onStartAnalysis}
            className="bg-black text-white hover:bg-neutral-800 px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
          >
            Start Analysis
          </button>
        </div>

        {/* Feature Badges Row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-14 text-[#4c4546] text-[11px] font-medium items-center uppercase tracking-widest opacity-80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black text-[18px]">verified</span>
            Deterministic ATS Scoring
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black text-[18px]">psychology</span>
            Gemini AI Resume Critic
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black text-[18px]">speed</span>
            Instant Feedback
          </div>
        </div>
      </section>

      {/* Bento Grid Process Section */}
      <section className="py-12 md:py-16 w-full max-w-6xl mx-auto px-4 md:px-8 mb-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-3">
            The 3-Step Precision Process
          </h2>
          <p className="text-base sm:text-lg text-[#4c4546]">
            From resume upload to actionable critique, a seamless workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Upload */}
          <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-8 hover:shadow-xl transition-all flex flex-col items-start relative overflow-hidden group">
            <div className="w-14 h-14 bg-[#eeedf3] rounded-xl flex items-center justify-center mb-6 text-black shadow-2xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px] icon-fill">upload_file</span>
            </div>
            <h3 className="text-2xl font-semibold text-black mb-3">1. Upload</h3>
            <p className="text-sm text-[#4c4546] leading-relaxed">
              Upload your resume (PDF, DOCX, or text) and paste the target job description.
            </p>
          </div>

          {/* Card 2: Match */}
          <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-8 hover:shadow-xl transition-all flex flex-col items-start relative overflow-hidden group">
            <div className="w-14 h-14 bg-[#eeedf3] rounded-xl flex items-center justify-center mb-6 text-black shadow-2xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px] icon-fill">radar</span>
            </div>
            <h3 className="text-2xl font-semibold text-black mb-3">2. ATS Match</h3>
            <p className="text-sm text-[#4c4546] leading-relaxed">
              Our deterministic Java engine cross-references keywords, skills, and industry terms to compute your real ATS match score.
            </p>
          </div>

          {/* Card 3: Critique */}
          <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-8 hover:shadow-xl transition-all flex flex-col items-start relative overflow-hidden group">
            <div className="w-14 h-14 bg-[#eeedf3] rounded-xl flex items-center justify-center mb-6 text-black shadow-2xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px] icon-fill">auto_awesome</span>
            </div>
            <h3 className="text-2xl font-semibold text-black mb-3">3. AI Critique</h3>
            <p className="text-sm text-[#4c4546] leading-relaxed">
              Get an objective, in-depth evaluation powered by Gemini AI highlighting strengths, weaknesses, and concrete recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
