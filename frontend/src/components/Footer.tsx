import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#f5f5f7] border-t border-black/[0.05] py-10 px-6 md:px-12 mt-auto no-print text-neutral-500 text-[13px]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-[#1d1d1f] text-white flex items-center justify-center text-[10px] font-semibold shadow-2xs">
            RR
          </span>
          <span className="font-semibold text-[#1d1d1f]">ResumeRadar</span>
          <span className="text-black/[0.1]">·</span>
          <span className="font-normal text-neutral-400">Deterministic ATS Matcher & Auto-Fix Engine</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <button onClick={() => onNavigate('landing')} className="hover:text-[#1d1d1f] transition-colors duration-300 cursor-pointer active:scale-[0.98]">
            Home
          </button>
          <button onClick={() => onNavigate('new-analysis')} className="hover:text-[#1d1d1f] transition-colors duration-300 cursor-pointer active:scale-[0.98]">
            ATS Scan
          </button>
          <button onClick={() => onNavigate('best-fit')} className="hover:text-[#1d1d1f] transition-colors duration-300 cursor-pointer active:scale-[0.98]">
            Best Fit
          </button>
          <button
            onClick={() => onNavigate('admin-login')}
            className="flex items-center gap-1 hover:text-[#1d1d1f] transition-colors duration-300 cursor-pointer active:scale-[0.98]"
            title="Admin Console"
          >
            <span className="material-symbols-outlined text-[13px]">shield_person</span>
            <span>Admin</span>
          </button>
        </div>

        <p className="text-[12px] text-neutral-400 font-normal">
          © {new Date().getFullYear()} ResumeRadar
        </p>
      </div>
    </footer>
  );
};
