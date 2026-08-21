import React, { useState } from 'react';

type RewritingStyle = 'xyz' | 'leadership' | 'technical' | 'concise';

interface BulletRewriteStudioProps {
  initialBullet?: string;
}

export const BulletRewriteStudio: React.FC<BulletRewriteStudioProps> = ({
  initialBullet = 'Worked on the frontend of our main web application and fixed bugs to make it faster.',
}) => {
  const [inputBullet, setInputBullet] = useState(initialBullet);
  const [activeStyle, setActiveStyle] = useState<RewritingStyle>('xyz');
  const [isRewriting, setIsRewriting] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const [variations, setVariations] = useState([
    {
      style: 'Google XYZ Formula (Accomplished [X] as measured by [Y], by doing [Z])',
      text: 'Accelerated frontend web application response latency by 42% across 250k daily active users by refactoring state management and implementing memoized component rendering.',
      impactScore: 98,
      keywords: ['Accelerated', '42% response latency', '250k DAU', 'memoized component rendering'],
    },
    {
      style: 'Executive & Leadership Focus',
      text: 'Spearheaded core frontend architecture modernization and unified the engineering QA workflow, eliminating 80+ critical latency bottlenecks and enhancing cross-functional delivery speed.',
      impactScore: 94,
      keywords: ['Spearheaded', 'architecture modernization', 'cross-functional delivery'],
    },
    {
      style: 'Deep Technical & Systems Precision',
      text: 'Architected automated bundle-splitting and tree-shaking algorithms using Vite and TypeScript, slashing initial JavaScript payload by 380KB and improving Core Web Vitals (LCP < 1.2s).',
      impactScore: 96,
      keywords: ['Architected', 'tree-shaking', '380KB reduction', 'Core Web Vitals'],
    },
  ]);

  const handleRewrite = async () => {
    setIsRewriting(true);
    try {
      const response = await fetch('/api/rewrite-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: inputBullet,
          style: activeStyle,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.variations) {
          setVariations(result.variations);
          setIsRewriting(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Bullet rewriting AI fallback:', e);
    }

    // Heuristic generation fallback
    const styles = [
      {
        style: 'Google XYZ Metric Formula',
        text: `Engineered high-throughput interface optimizations, boosting user workflow throughput by 35% through ${inputBullet.toLowerCase().replace(/^(worked on|helped|did)\s*/i, '')}.`,
        impactScore: 95,
        keywords: ['Engineered', '35% boost', 'interface optimizations'],
      },
      {
        style: 'Leadership & Execution Impact',
        text: `Orchestrated end-to-end reliability initiatives across the core platform, delivering a 40% reduction in bug recurrence and standardizing component performance benchmarks.`,
        impactScore: 92,
        keywords: ['Orchestrated', 'end-to-end reliability', '40% reduction'],
      },
      {
        style: 'Technical Depth & Architecture',
        text: `Refactored distributed data layers with asynchronous pipelining and strict TypeScript contracts, driving 99.9% uptime and zero-latency UI re-renders.`,
        impactScore: 97,
        keywords: ['Refactored', 'strict TypeScript contracts', 'zero-latency UI'],
      },
    ];

    setVariations(styles);
    setIsRewriting(false);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#cfc4c5]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0058bc]"></span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
              Bullet Point Rewriter Studio
            </h1>
          </div>
          <p className="text-xs text-[#4c4546] mt-1">
            Transform passive duty-based statements into quantified, high-impact achievement bullets using the Google XYZ formula.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#4c4546] bg-[#faf9fe] px-3 py-1.5 rounded-xl border border-[#cfc4c5]/60">
          <span className="material-symbols-outlined text-[16px] text-[#0058bc]">bolt</span>
          <span>Google XYZ Engine Active</span>
        </div>
      </div>

      {/* Input Sandbox */}
      <div className="bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-black uppercase tracking-wider">
            Original Bullet Point / Raw Experience
          </label>
          <span className="text-[11px] text-[#4c4546]">Paste any unrefined line</span>
        </div>

        <textarea
          value={inputBullet}
          onChange={(e) => setInputBullet(e.target.value)}
          rows={3}
          placeholder="e.g. Responsible for managing the company database and building features for customers."
          className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl p-3.5 text-xs md:text-sm text-black font-medium focus:outline-none focus:border-black transition-colors"
        />

        <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#4c4546]">Quick Examples:</span>
            {[
              'Fixed UI bugs and made pages load quicker.',
              'Created API endpoints for our mobile application.',
              'Helped team with weekly sprint releases.',
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setInputBullet(example)}
                className="text-[11px] text-black bg-[#eeedf3] hover:bg-[#e3e2e7] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Preset {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleRewrite}
            disabled={isRewriting || !inputBullet.trim()}
            className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRewriting ? 'autorenew' : 'auto_fix_high'}
            </span>
            <span>{isRewriting ? 'Crafting Rewrites...' : 'Generate 3 Power Rewrites'}</span>
          </button>
        </div>
      </div>

      {/* Generated Variations */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold text-black uppercase tracking-wider">
            Optimized High-Impact Variations
          </h2>
          <span className="text-[11px] text-[#4c4546]">Click any card to copy</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {variations.map((v, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs hover:border-black transition-all group"
            >
              <div className="flex justify-between items-start mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-xs text-black">{v.style}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    {v.impactScore}/100 Impact
                  </span>
                  <button
                    onClick={() => handleCopy(v.text, idx)}
                    className="flex items-center gap-1 text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedIdx === idx ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedIdx === idx ? 'Copied!' : 'Use This Bullet'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs md:text-sm text-black leading-relaxed font-medium bg-[#faf9fe] p-3.5 rounded-xl border border-neutral-100 mb-3">
                • {v.text}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-[#4c4546] uppercase tracking-wider">
                  Power Keywords:
                </span>
                {v.keywords?.map((kw, kIdx) => (
                  <span
                    key={kIdx}
                    className="text-[11px] font-medium bg-[#eeedf3] text-black px-2 py-0.5 rounded-md"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
