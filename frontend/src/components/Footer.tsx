import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#fbf9f4]/65 backdrop-blur-xl border-t border-[#15263c]/10 py-8 px-6 md:px-12 mt-auto no-print text-[#15263c]/70 text-[13px] relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-[#15263c] text-[#fbf9f4] flex items-center justify-center font-mono text-[10px] font-bold shadow-2xs">
            RR
          </span>
          <span className="font-bold text-[#15263c]">ResumeRadar</span>
          <span className="text-[#15263c]/20">·</span>
          <span className="font-normal text-[#15263c]/60 hidden md:inline">Deterministic ATS Matcher & Auto-Fix Engine</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-[13px]">
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
            className="inline-flex items-center gap-1 text-[#15263c]/60 hover:text-[#15263c] transition-colors duration-200 cursor-pointer active:scale-[0.98]"
            title="Admin Console"
          >
            <span className="material-symbols-outlined text-[14px]">shield_person</span>
            <span>Admin</span>
          </button>
        </div>

        <p className="text-[12px] text-[#15263c]/50 font-normal">
          © {new Date().getFullYear()} ResumeRadar
        </p>
      </div>
    </footer>
  );
};
