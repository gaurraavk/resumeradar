import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { GlassBadge } from './ui/GlassBadge';
import { GlassButton } from './ui/GlassButton';
import { DotMatrix } from './ui/DotMatrix';

interface LandingViewProps {
  onStartAnalysis: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStartAnalysis }) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'skills' | 'autofix'>('overview');

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative z-10">
      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-28 md:pb-32 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">
        {/* Editorial Index / Kicker Capsule */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/55 backdrop-blur-md border border-[#15263c]/10 shadow-[0_2px_12px_rgba(21,38,60,0.04)] mb-8 animate-entrance">
          <span className="w-2 h-2 rounded-full bg-[#15d6e6] animate-pulse" />
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-[#15263c] font-bold">
            INDEX // 2025 · SERENE EDITORIAL ATS ENGINE
          </span>
          <span className="text-[#15263c]/20">|</span>
          <span className="text-[11px] font-medium text-[#15263c]/70 hidden sm:inline">
            100% Deterministic · Zero Hallucinations
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#15263c] tracking-[-0.035em] leading-[1.05] max-w-4xl mb-6 animate-entrance">
          Your resume deserves more than a{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-[#15263c] via-[#1f75d1] to-[#15d6e6] bg-clip-text text-transparent">
              quick scan.
            </span>
            <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-[#15d6e6]/40 -rotate-1 rounded-full pointer-events-none" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#15263c]/75 max-w-2xl mb-10 leading-relaxed font-normal animate-entrance">
          Understand how applicant tracking systems parse your credentials. Discover critical skill gaps, inspect formatting pitfalls, and export recruiter-ready resumes.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 animate-entrance">
          <GlassButton
            onClick={onStartAnalysis}
            size="lg"
            variant="primary"
            icon="radar"
            className="w-full sm:w-auto shadow-[0_8px_24px_rgba(21,38,60,0.22)]"
          >
            Start Precision Analysis
          </GlassButton>
          <GlassButton
            onClick={scrollToHowItWorks}
            size="lg"
            variant="secondary"
            icon="arrow_downward"
            className="w-full sm:w-auto"
          >
            Explore How It Works
          </GlassButton>
        </div>

        {/* Technical Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl w-full pt-4 border-t border-[#15263c]/08 text-left animate-entrance">
          <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-[#15263c]/08">
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#15263c]/50 block">
              ALGORITHM
            </span>
            <span className="font-bold text-[13.5px] text-[#15263c] mt-0.5 block">
              100% Deterministic
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-[#15263c]/08">
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#15263c]/50 block">
              PRIVACY
            </span>
            <span className="font-bold text-[13.5px] text-[#15263c] mt-0.5 block">
              In-Memory Only
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-[#15263c]/08">
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#15263c]/50 block">
              VERIFICATION
            </span>
            <span className="font-bold text-[13.5px] text-[#15263c] mt-0.5 block">
              Exact Phrase Match
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-[#15263c]/08">
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#15263c]/50 block">
              AUTO-FIX
            </span>
            <span className="font-bold text-[13.5px] text-[#15263c] mt-0.5 block">
              3 Layout Templates
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Product Preview Section */}
      <section className="w-full max-w-6xl mx-auto px-6 mb-24 md:mb-36">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#15263c]/60 font-bold block mb-1">
            DEMONSTRATION // LIVE PREVIEW
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#15263c] tracking-tight">
            Designed for uncompromising visual and technical clarity
          </h2>
        </div>

        {/* Floating Glass Dashboard Preview Window */}
        <div className="relative rounded-[32px] p-2 sm:p-4 bg-white/40 backdrop-blur-2xl border border-white/80 shadow-[0_24px_64px_rgba(21,38,60,0.12)] overflow-hidden">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#15263c]/08 bg-white/35 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#e98f7b]/80 border border-[#e98f7b]" />
              <span className="w-3 h-3 rounded-full bg-[#f2b6a7]/80 border border-[#f2b6a7]" />
              <span className="w-3 h-3 rounded-full bg-[#9ec9c4]/80 border border-[#9ec9c4]" />
              <span className="ml-3 font-mono text-[11px] text-[#15263c]/60 hidden sm:inline">
                resumeradar://analysis/senior-software-engineer.docx
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/[0.04] p-1 rounded-xl">
              <button
                onClick={() => setActivePreviewTab('overview')}
                className={`text-[12px] font-medium px-3 py-1 rounded-lg transition-all ${
                  activePreviewTab === 'overview'
                    ? 'bg-[#15263c] text-[#fbf9f4] shadow-xs'
                    : 'text-[#15263c]/70 hover:text-[#15263c]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActivePreviewTab('skills')}
                className={`text-[12px] font-medium px-3 py-1 rounded-lg transition-all ${
                  activePreviewTab === 'skills'
                    ? 'bg-[#15263c] text-[#fbf9f4] shadow-xs'
                    : 'text-[#15263c]/70 hover:text-[#15263c]'
                }`}
              >
                Keywords
              </button>
              <button
                onClick={() => setActivePreviewTab('autofix')}
                className={`text-[12px] font-medium px-3 py-1 rounded-lg transition-all ${
                  activePreviewTab === 'autofix'
                    ? 'bg-[#15263c] text-[#fbf9f4] shadow-xs'
                    : 'text-[#15263c]/70 hover:text-[#15263c]'
                }`}
              >
                Auto-Fix
              </button>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-white/30 to-white/60 rounded-b-2xl">
            {activePreviewTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {/* Score Card */}
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#15263c]/60 block">
                        OVERALL MATCH
                      </span>
                      <h3 className="text-lg font-bold text-[#15263c] mt-0.5">ATS Compatibility</h3>
                    </div>
                    <GlassBadge variant="cyan" size="sm">High Match</GlassBadge>
                  </div>

                  <div className="py-6 flex items-baseline gap-2">
                    <span className="text-6xl font-extrabold text-[#15263c] tracking-tight font-mono">
                      84
                    </span>
                    <span className="text-xl font-medium text-[#15263c]/40 font-mono">/100</span>
                  </div>

                  <div className="w-full bg-black/[0.06] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#15d6e6] via-[#3da6f5] to-[#15263c] h-full rounded-full"
                      style={{ width: '84%' }}
                    />
                  </div>
                  <span className="text-[12px] text-[#15263c]/70 mt-3 block">
                    Passes automated ATS filtering threshold for Tier-1 technology companies.
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#15263c]/60 block">
                      SKILL ALIGNMENT
                    </span>
                    <h3 className="text-lg font-bold text-[#15263c] mt-0.5">Coverage Breakdown</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#15263c]/70 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Matched Required Skills
                      </span>
                      <span className="font-mono font-bold text-[#15263c]">12 / 14</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#15263c]/70 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f2b6a7]" />
                        Missing High-Priority
                      </span>
                      <span className="font-mono font-bold text-[#e98f7b]">2 skills</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#15263c]/70 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#9ec9c4]" />
                        Formatting Health
                      </span>
                      <span className="font-mono font-bold text-emerald-700">100% ATS-Safe</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#15263c]/08 text-[12px] text-[#15263c]/60">
                    Target Role: <strong>Senior Backend Engineer (Java / Distributed Systems)</strong>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#15263c]/60 block">
                      IMMEDIATE OPTIMIZATION
                    </span>
                    <h3 className="text-lg font-bold text-[#15263c] mt-0.5">Quick Actions</h3>
                  </div>

                  <ul className="space-y-2 text-[12.5px] text-[#15263c]/80">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 mt-0.5">
                        check_circle
                      </span>
                      <span>Convert multi-column table in Experience section to linear blocks.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#e98f7b] mt-0.5">
                        add_circle
                      </span>
                      <span>Inject missing required keywords: <strong>Kubernetes</strong> and <strong>Kafka</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#3da6f5] mt-0.5">
                        upgrade
                      </span>
                      <span>Upgrade 4 passive verbs (e.g. &quot;helped with&quot; → &quot;architected&quot;).</span>
                    </li>
                  </ul>

                  <button
                    onClick={onStartAnalysis}
                    className="w-full py-2.5 rounded-xl bg-[#15263c] text-[#fbf9f4] text-[13px] font-medium hover:bg-[#1f3757] transition-all cursor-pointer text-center"
                  >
                    Scan Your Resume
                  </button>
                </div>
              </div>
            )}

            {activePreviewTab === 'skills' && (
              <div className="space-y-4">
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-[#15263c] uppercase tracking-wide">
                    Matched Skills in Document (12 Detected)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker', 'REST API', 'Unit Testing', 'CI/CD', 'Git', 'Agile', 'Maven', 'Redis'].map((s) => (
                      <GlassBadge key={s} variant="teal" icon="check">
                        {s}
                      </GlassBadge>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-[#15263c] uppercase tracking-wide">
                    Missing Keywords from Job Description (Incorporate via Auto-Fix)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Kubernetes', 'Apache Kafka', 'Distributed Caching', 'Prometheus'].map((s) => (
                      <GlassBadge key={s} variant="peach" icon="warning">
                        {s}
                      </GlassBadge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'autofix' && (
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-bold text-[#15263c]">Auto-Fix & Template Engine</h4>
                    <p className="text-[13px] text-[#15263c]/70">
                      Standardize fonts, inject missing keywords, and download formatted .docx directly.
                    </p>
                  </div>
                  <GlassBadge variant="cyan" size="sm">3 Templates Available</GlassBadge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-xl border-2 border-[#15263c] bg-white/70 shadow-xs">
                    <span className="font-mono text-[10px] text-[#15263c]/50 uppercase block">TEMPLATE 01</span>
                    <strong className="text-[14px] text-[#15263c] block mt-1">Classic Professional</strong>
                    <span className="text-[12px] text-[#15263c]/70 block mt-1">ATS-safe single column with ruled dividers.</span>
                  </div>
                  <div className="p-4 rounded-xl border border-[#15263c]/15 bg-white/40">
                    <span className="font-mono text-[10px] text-[#15263c]/50 uppercase block">TEMPLATE 02</span>
                    <strong className="text-[14px] text-[#15263c] block mt-1">Modern Sidebar</strong>
                    <span className="text-[12px] text-[#15263c]/70 block mt-1">Slate navy sidebar for contact & skills.</span>
                  </div>
                  <div className="p-4 rounded-xl border border-[#15263c]/15 bg-white/40">
                    <span className="font-mono text-[10px] text-[#15263c]/50 uppercase block">TEMPLATE 03</span>
                    <strong className="text-[14px] text-[#15263c] block mt-1">Compact Banner</strong>
                    <span className="text-[12px] text-[#15263c]/70 block mt-1">Full-width teal header for early-career roles.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process Section: How It Works */}
      <section id="how-it-works" className="w-full max-w-6xl mx-auto px-6 mb-24 md:mb-36">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DotMatrix rows={2} cols={3} />
              <span className="font-mono text-[10.5px] uppercase tracking-widest text-[#15263c]/60 font-bold">
                WORKFLOW // 03 STEPS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#15263c] tracking-tight">
              Deterministic precision from upload to export
            </h2>
          </div>
          <p className="text-[14px] text-[#15263c]/70 max-w-md font-normal leading-relaxed">
            Every step is transparent and testable. No hidden black-box prompts or hallucinated buzzwords.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <GlassCard className="flex flex-col justify-between" dotMatrix>
            <div>
              <span className="font-mono text-[12px] font-bold text-[#15d6e6] tracking-wider block mb-4">
                01 // UPLOAD
              </span>
              <div className="w-12 h-12 rounded-2xl bg-white/60 border border-[#15263c]/10 flex items-center justify-center text-[#15263c] mb-6 shadow-2xs">
                <span className="material-symbols-outlined text-[24px]">upload_file</span>
              </div>
              <h3 className="text-xl font-bold text-[#15263c] mb-2.5">
                Supply Resume & Target Job
              </h3>
              <p className="text-[14px] text-[#15263c]/70 leading-relaxed font-normal">
                Upload your document (.docx or .pdf) or paste raw text. Paste the target job description to establish the baseline requirement set.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#15263c]/08 font-mono text-[11px] text-[#15263c]/50">
              ACCEPTED: DOCX, PDF, RAW TEXT
            </div>
          </GlassCard>

          {/* Step 2 */}
          <GlassCard className="flex flex-col justify-between" dotMatrix>
            <div>
              <span className="font-mono text-[12px] font-bold text-[#3da6f5] tracking-wider block mb-4">
                02 // ATS MATCH
              </span>
              <div className="w-12 h-12 rounded-2xl bg-white/60 border border-[#15263c]/10 flex items-center justify-center text-[#15263c] mb-6 shadow-2xs">
                <span className="material-symbols-outlined text-[24px]">radar</span>
              </div>
              <h3 className="text-xl font-bold text-[#15263c] mb-2.5">
                Deterministic Cross-Reference
              </h3>
              <p className="text-[14px] text-[#15263c]/70 leading-relaxed font-normal">
                Our Java engine parses keywords with exact multi-token matching, inspects document formatting runs, detects keyword stuffing, and audits action verbs.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#15263c]/08 font-mono text-[11px] text-[#15263c]/50">
              JAVA ATS PARSER · 100% DETERMINISTIC
            </div>
          </GlassCard>

          {/* Step 3 */}
          <GlassCard className="flex flex-col justify-between" dotMatrix>
            <div>
              <span className="font-mono text-[12px] font-bold text-[#e98f7b] tracking-wider block mb-4">
                03 // AUTO-FIX & EXPORT
              </span>
              <div className="w-12 h-12 rounded-2xl bg-white/60 border border-[#15263c]/10 flex items-center justify-center text-[#15263c] mb-6 shadow-2xs">
                <span className="material-symbols-outlined text-[24px]">auto_fix_high</span>
              </div>
              <h3 className="text-xl font-bold text-[#15263c] mb-2.5">
                Select Template & Download
              </h3>
              <p className="text-[14px] text-[#15263c]/70 leading-relaxed font-normal">
                Pick an ATS-optimized layout template, automatically inject missing required skills, fix weak verbs, and download the ready-to-submit .docx file.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#15263c]/08 font-mono text-[11px] text-[#15263c]/50">
              RE-SCORED DOCUMENT · INSTANT .DOCX
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl mx-auto px-6 mb-24 md:mb-36">
        <div className="text-center mb-14">
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-[#15263c]/60 font-bold block mb-1">
            CAPABILITIES // PRODUCT MATRIX
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#15263c] tracking-tight">
            Engineered for candidates who demand certainty
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <h3 className="text-lg font-bold text-[#15263c] mb-2">Zero AI Hallucinations</h3>
            <p className="text-[13.5px] text-[#15263c]/70 leading-relaxed">
              Every keyword match and missing skill is derived using strict dictionary token matching, not LLM probabilistic guessing.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">style</span>
            </div>
            <h3 className="text-lg font-bold text-[#15263c] mb-2">3 Resume Templates</h3>
            <p className="text-[13.5px] text-[#15263c]/70 leading-relaxed">
              Generate fixed resumes in Classic Professional (single-column ruled), Modern Sidebar (two-column slate), or Compact Banner layouts.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">leaderboard</span>
            </div>
            <h3 className="text-lg font-bold text-[#15263c] mb-2">Multi-Job Best Fit</h3>
            <p className="text-[13.5px] text-[#15263c]/70 leading-relaxed">
              Compare 1 resume against up to 5 target job descriptions simultaneously to determine your highest-probability application.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">compare</span>
            </div>
            <h3 className="text-lg font-bold text-[#15263c] mb-2">Side-by-Side Comparison</h3>
            <p className="text-[13.5px] text-[#15263c]/70 leading-relaxed">
              Benchmark two resume versions against the same job description to verify exactly which edits increased your score.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">spellcheck</span>
            </div>
            <h3 className="text-lg font-bold text-[#15263c] mb-2">Resume Quality Inspection</h3>
            <p className="text-[13.5px] text-[#15263c]/70 leading-relaxed">
              Standalone quality audit evaluating weak sentence ratios, active verb frequency, bullet length, and readability.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-10 h-10 rounded-xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <h3 className="text-lg font-bold text-[#15263c] mb-2">In-Memory Privacy</h3>
            <p className="text-[13.5px] text-[#15263c]/70 leading-relaxed">
              Resume files and job text are processed in volatile memory. We never store your resume document or train models on your career history.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Privacy and Trust Section */}
      <section className="w-full max-w-4xl mx-auto px-6 mb-24 md:mb-32">
        <GlassCard className="p-8 md:p-12 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-white/70 border border-[#15263c]/12 flex items-center justify-center text-[#15263c] mb-6 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">shield</span>
          </div>

          <span className="font-mono text-[10px] uppercase tracking-widest text-[#15263c]/60 font-bold block mb-2">
            INTEGRITY & PRIVACY COMMITMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#15263c] tracking-tight mb-4">
            Your career data is strictly yours
          </h2>
          <p className="text-[14.5px] text-[#15263c]/75 leading-relaxed max-w-2xl font-normal mb-8">
            ResumeRadar operates on an in-memory architecture: uploaded documents are parsed in transient Java heap during analysis and discarded immediately. We do not store resume content, sell candidate information, or build advertising profiles.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-[12.5px] text-[#15263c]/80 font-medium">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/50 border border-[#15263c]/10">
              <span className="text-emerald-600">✓</span>
              <span>No AI training on user resumes</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/50 border border-[#15263c]/10">
              <span className="text-emerald-600">✓</span>
              <span>In-memory byte-stream processing</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/50 border border-[#15263c]/10">
              <span className="text-emerald-600">✓</span>
              <span>Audit logs store scores only (never text)</span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Final Call to Action */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-24">
        <div className="relative rounded-[32px] p-10 md:p-16 bg-[#15263c] text-[#fbf9f4] shadow-[0_24px_64px_rgba(21,38,60,0.28)] overflow-hidden text-center flex flex-col items-center">
          {/* Subtle aurora glow overlay inside CTA */}
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[80px] opacity-35 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #15d6e6 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[80px] opacity-25 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #f2b6a7 0%, transparent 70%)' }}
          />

          <span className="font-mono text-[10.5px] uppercase tracking-widest text-[#15d6e6] font-bold block mb-4 relative z-10">
            START NOW // ZERO REGISTRATION REQUIRED
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl mb-6 relative z-10">
            Ready to test your resume with surgical precision?
          </h2>

          <p className="text-[15px] sm:text-base text-[#fbf9f4]/80 max-w-xl mb-10 leading-relaxed font-normal relative z-10">
            Scan your resume against any job description in seconds. Uncover missing keywords, format errors, and download an optimized .docx file.
          </p>

          <GlassButton
            onClick={onStartAnalysis}
            size="lg"
            variant="secondary"
            icon="radar"
            className="relative z-10 font-bold !bg-white !text-[#15263c] hover:!bg-[#fbf9f4] shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          >
            Launch ResumeRadar Scanner
          </GlassButton>
        </div>
      </section>
    </div>
  );
};
