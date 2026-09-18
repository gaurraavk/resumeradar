import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-[#cfc4c5]/60 bg-[#faf9fe] py-8 px-6 md:px-8 mt-auto no-print text-[#7e7576] text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-black text-white flex items-center justify-center text-[10px] font-black">
            RR
          </span>
          <span className="font-bold text-black">ResumeRadar</span>
          <span className="text-[#cfc4c5]">•</span>
          <span>Deterministic ATS Keyword Matcher &amp; AI Critic</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 font-medium">
          <button onClick={() => onNavigate('landing')} className="hover:text-black transition-colors cursor-pointer">
            Home
          </button>
          <button onClick={() => onNavigate('new-analysis')} className="hover:text-black transition-colors cursor-pointer">
            ATS Scan
          </button>
          <button
            onClick={() => onNavigate('admin-login')}
            className="flex items-center gap-1 hover:text-black transition-colors font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300/80 px-2.5 py-1 rounded-md text-[11px] cursor-pointer"
            title="Admin Console"
          >
            <span className="material-symbols-outlined text-[13px]">shield_person</span>
            <span>Admin</span>
          </button>
        </div>

        <p className="text-[11px]">
          © {new Date().getFullYear()} ResumeRadar. Open source ATS and AI critic.
        </p>
      </div>
    </footer>
  );
};
