import React from 'react';
import { SAMPLE_RESUMES, SAMPLE_JOBS } from '../data/sampleData';

interface LandingViewProps {
  onStartAnalysis: () => void;
  onLoadQuickDemo: (resumeIdx: number, jobIdx: number) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartAnalysis,
  onLoadQuickDemo,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="py-16 md:py-24 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-black tracking-tight leading-[1.1] max-w-[900px] mb-6">
          Optimize your resume for any job.
        </h1>

        <p className="text-base sm:text-lg md:text-[19px] text-[#4c4546] max-w-[700px] mb-10 leading-relaxed">
          Precision analysis powered by advanced algorithms to ensure your resume beats the ATS and lands in human hands. Get actionable insights in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onStartAnalysis}
            className="bg-black text-white hover:bg-neutral-800 px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
          >
            Start Analysis
          </button>

          {/* Quick Demo Preloads */}
          <div className="flex items-center gap-2 text-xs text-[#4c4546]">
            <span>or try sample:</span>
            <button
              onClick={() => onLoadQuickDemo(1, 1)}
              className="px-3 py-1.5 rounded-full bg-white border border-[#cfc4c5] hover:border-black text-black font-medium transition-colors cursor-pointer shadow-2xs"
            >
              Frontend Dev
            </button>
            <button
              onClick={() => onLoadQuickDemo(0, 0)}
              className="px-3 py-1.5 rounded-full bg-white border border-[#cfc4c5] hover:border-black text-black font-medium transition-colors cursor-pointer shadow-2xs"
            >
              Product Manager
            </button>
          </div>
        </div>

        {/* Feature Badges Row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-14 text-[#4c4546] text-[11px] font-medium items-center uppercase tracking-widest opacity-80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black text-[18px]">verified</span>
            ATS-Friendly
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black text-[18px]">shield</span>
            Privacy-First
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
            From upload to optimization, a seamless workflow.
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
              Securely upload your current resume and the target job description. We parse formats with high fidelity.
            </p>
          </div>

          {/* Card 2: Analyze */}
          <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-8 hover:shadow-xl transition-all flex flex-col items-start relative overflow-hidden group">
            <div className="w-14 h-14 bg-[#eeedf3] rounded-xl flex items-center justify-center mb-6 text-black shadow-2xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px] icon-fill">radar</span>
            </div>
            <h3 className="text-2xl font-semibold text-black mb-3">2. Analyze</h3>
            <p className="text-sm text-[#4c4546] leading-relaxed">
              Our engine cross-references your skills against the job requirements, identifying critical gaps and keyword matches.
            </p>
          </div>

          {/* Card 3: Optimize */}
          <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-8 hover:shadow-xl transition-all flex flex-col items-start relative overflow-hidden group">
            <div className="w-14 h-14 bg-[#eeedf3] rounded-xl flex items-center justify-center mb-6 text-black shadow-2xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px] icon-fill">auto_awesome</span>
            </div>
            <h3 className="text-2xl font-semibold text-black mb-3">3. Optimize</h3>
            <p className="text-sm text-[#4c4546] leading-relaxed">
              Receive targeted recommendations to adjust phrasing, add missing skills, and perfectly align your profile for impact.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
