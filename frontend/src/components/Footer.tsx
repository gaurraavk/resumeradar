import React from 'react';
import { DotMatrix } from './ui/DotMatrix';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#fbf9f4]/65 backdrop-blur-xl border-t border-[#15263c]/10 py-12 px-6 md:px-12 mt-auto no-print text-[#15263c]/70 text-[13px] relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#15263c]/08">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center font-mono text-[10px] font-bold shadow-xs">
              RR
            </div>
            <div>
              <span className="font-bold text-[#15263c] text-[15px] tracking-tight block">
                ResumeRadar
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#15263c]/50">
                Deterministic ATS Engine · In-Memory Architecture
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-[13px]">
            <button
              onClick={() => onNavigate('landing')}
              className="text-[#15263c]/80 hover:text-[#15263c] transition-colors duration-200 cursor-pointer active:scale-[0.98]"
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('new-analysis')}
              className="text-[#15263c]/80 hover:text-[#15263c] transition-colors duration-200 cursor-pointer active:scale-[0.98]"
            >
              ATS Scan
            </button>
            <button
              onClick={() => onNavigate('best-fit')}
              className="text-[#15263c]/80 hover:text-[#15263c] transition-colors duration-200 cursor-pointer active:scale-[0.98]"
            >
              Best Fit
            </button>
            <button
              onClick={() => onNavigate('compare-versions')}
              className="text-[#15263c]/80 hover:text-[#15263c] transition-colors duration-200 cursor-pointer active:scale-[0.98]"
            >
              Compare
            </button>
            <button
              onClick={() => onNavigate('quality-analyzer')}
              className="text-[#15263c]/80 hover:text-[#15263c] transition-colors duration-200 cursor-pointer active:scale-[0.98]"
            >
              Quality
            </button>
            <button
              onClick={() => onNavigate('admin-login')}
              className="inline-flex items-center gap-1.5 text-[#15263c]/60 hover:text-[#15263c] transition-colors duration-200 cursor-pointer active:scale-[0.98]"
              title="Admin Portal"
            >
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              <span>Admin Console</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-[#15263c]/50">
          <div className="flex items-center gap-3">
            <DotMatrix rows={2} cols={4} />
            <span>ID.2025 // PROD · SERENE EDITORIAL GLASS EDITION</span>
          </div>
          <div className="flex items-center gap-4">
            <span>ZERO AI HALLUCINATIONS</span>
            <span>·</span>
            <span>100% REPRODUCIBLE ATS ALGORITHMS</span>
            <span>·</span>
            <span>© {new Date().getFullYear()} RESUMERADAR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
