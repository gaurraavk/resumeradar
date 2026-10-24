import React, { useState, useEffect } from 'react';
import { UserSummary } from '../types';

interface TopNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isAdminLoggedIn?: boolean;
  onAdminLogout?: () => void;
  currentUser?: UserSummary | null;
  onUserLogout?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onNavigate,
  isAdminLoggedIn = false,
  onAdminLogout,
  currentUser = null,
  onUserLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between w-full px-6 sm:px-8 md:px-12 h-14 transition-all duration-300 ${
        isScrolled ? 'macos-glass-scrolled' : 'macos-glass'
      }`}
    >
      <div className="flex items-center gap-6 md:gap-8">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 font-semibold text-base text-[#1d1d1f] tracking-tight hover:opacity-80 transition-opacity duration-300 cursor-pointer active:scale-[0.98]"
        >
          <span className="w-6 h-6 rounded-lg bg-[#1d1d1f] text-white flex items-center justify-center text-[10px] font-semibold tracking-tight shadow-sm">
            RR
          </span>
          <span className="font-semibold tracking-tight">ResumeRadar</span>
        </button>

        <div className="hidden md:flex items-center gap-1 bg-black/[0.03] p-1 rounded-2xl border border-black/[0.04]">
          <button
            onClick={() => onNavigate('landing')}
            className={`text-[13px] font-medium px-3.5 py-1 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${
              currentTab === 'landing'
                ? 'text-[#1d1d1f] bg-white shadow-sm border border-black/[0.04]'
                : 'text-neutral-500 hover:text-[#1d1d1f]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('new-analysis')}
            className={`text-[13px] font-medium px-3.5 py-1 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${
              currentTab === 'new-analysis' || currentTab === 'analysis-result'
                ? 'text-[#1d1d1f] bg-white shadow-sm border border-black/[0.04]'
                : 'text-neutral-500 hover:text-[#1d1d1f]'
            }`}
          >
            ATS Scan
          </button>
          <button
            onClick={() => onNavigate('best-fit')}
            className={`text-[13px] font-medium px-3.5 py-1 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${
              currentTab === 'best-fit'
                ? 'text-[#1d1d1f] bg-white shadow-sm border border-black/[0.04]'
                : 'text-neutral-500 hover:text-[#1d1d1f]'
            }`}
          >
            Best Fit
          </button>
          <button
            onClick={() => onNavigate('compare-versions')}
            className={`text-[13px] font-medium px-3.5 py-1 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${
              currentTab === 'compare-versions'
                ? 'text-[#1d1d1f] bg-white shadow-sm border border-black/[0.04]'
                : 'text-neutral-500 hover:text-[#1d1d1f]'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => onNavigate('quality-analyzer')}
            className={`text-[13px] font-medium px-3.5 py-1 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${
              currentTab === 'quality-analyzer'
                ? 'text-[#1d1d1f] bg-white shadow-sm border border-black/[0.04]'
                : 'text-neutral-500 hover:text-[#1d1d1f]'
            }`}
          >
            Quality
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          onClick={() => onNavigate('new-analysis')}
          className="hidden sm:inline-flex items-center gap-1.5 bg-[#1d1d1f] text-white text-[13px] font-medium px-3.5 py-1.5 rounded-2xl hover:bg-neutral-800 transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[15px]">add</span>
          <span>New Scan</span>
        </button>

        {/* User Auth Section */}
        {currentUser ? (
          <div className="flex items-center gap-1.5 bg-black/[0.03] p-1 rounded-2xl border border-black/[0.04]">
            <span className="text-[13px] font-medium text-[#1d1d1f] px-2.5 py-1 hidden lg:inline">
              {currentUser.fullName}
            </span>
            <button
              onClick={() => onNavigate('history')}
              className={`text-[13px] font-medium px-3 py-1 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] flex items-center gap-1 ${
                currentTab === 'history'
                  ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
                  : 'text-neutral-600 hover:text-[#1d1d1f]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">history</span>
              <span>My History</span>
            </button>
            <button
              onClick={onUserLogout}
              className="text-[13px] font-medium text-rose-600 hover:text-rose-700 px-2 py-1 transition-colors duration-300 cursor-pointer active:scale-[0.98]"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('auth')}
            className={`text-[13px] font-medium px-3.5 py-1.5 rounded-2xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${
              currentTab === 'auth'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#1d1d1f] bg-black/[0.04] hover:bg-black/[0.08]'
            }`}
          >
            Sign in
          </button>
        )}

        {/* Admin Login Section */}
        {isAdminLoggedIn ? (
          <div className="flex items-center gap-1.5 border-l border-black/[0.08] pl-2">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`text-[13px] font-medium px-3 py-1.5 rounded-2xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                currentTab === 'admin-dashboard'
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-black/[0.04]'
              }`}
            >
              Admin
            </button>
            <button
              onClick={onAdminLogout}
              className="text-[13px] font-medium text-rose-600 hover:text-rose-700 px-2 py-1 transition-colors duration-300 cursor-pointer active:scale-[0.98]"
            >
              Exit
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('admin-login')}
            className={`flex items-center gap-1 text-[13px] font-medium px-2.5 py-1.5 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${
              currentTab === 'admin-login'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-neutral-400 hover:text-[#1d1d1f]'
            }`}
            title="Admin Login"
          >
            <span className="material-symbols-outlined text-[15px]">shield_person</span>
          </button>
        )}
      </div>
    </nav>
  );
};
