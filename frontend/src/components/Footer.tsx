import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-white py-10 px-6 md:px-12 mt-auto no-print text-neutral-400 text-[13px]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-neutral-900 text-white flex items-center justify-center text-[10px] font-black">
            RR
          </span>
          <span className="font-semibold text-neutral-900">ResumeRadar</span>
          <span className="text-neutral-200">·</span>
          <span>Deterministic ATS Matcher & Auto-Fix Engine</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <button onClick={() => onNavigate('landing')} className="hover:text-neutral-900 transition-colors duration-200 cursor-pointer">
            Home
          </button>
          <button onClick={() => onNavigate('new-analysis')} className="hover:text-neutral-900 transition-colors duration-200 cursor-pointer">
            ATS Scan
          </button>
          <button onClick={() => onNavigate('best-fit')} className="hover:text-neutral-900 transition-colors duration-200 cursor-pointer">
            Best Fit
          </button>
          <button
            onClick={() => onNavigate('admin-login')}
            className="flex items-center gap-1 hover:text-neutral-900 transition-colors duration-200 cursor-pointer"
            title="Admin Console"
          >
            <span className="material-symbols-outlined text-[13px]">shield_person</span>
            <span>Admin</span>
          </button>
        </div>

        <p className="text-[12px] text-neutral-300">
          © {new Date().getFullYear()} ResumeRadar
        </p>
      </div>
    </footer>
  );
};
