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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: string) => {
    onNavigate(tab);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'new-analysis', label: 'ATS Scan', match: ['new-analysis', 'analysis-result'] },
    { id: 'best-fit', label: 'Best Fit' },
    { id: 'compare-versions', label: 'Compare' },
    { id: 'quality-analyzer', label: 'Quality' },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between w-full px-4 sm:px-8 md:px-12 h-16 transition-all duration-300 ${
          isScrolled ? 'glass-nav-scrolled' : 'glass-nav'
        }`}
      >
        <div className="flex items-center gap-6 md:gap-10">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 text-[#15263c] hover:opacity-85 transition-opacity duration-200 cursor-pointer active:scale-[0.98] group"
            aria-label="ResumeRadar Home"
          >
            <div className="w-8 h-8 rounded-xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center font-mono text-[11px] font-bold shadow-[0_2px_10px_rgba(21,38,60,0.2)] relative overflow-hidden">
              <span className="relative z-10">RR</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#15d6e6]/30 via-transparent to-[#f2b6a7]/20 pointer-events-none" />
            </div>
            <span className="font-bold text-[16px] tracking-tight text-[#15263c]">
              ResumeRadar
            </span>
          </button>

          {/* Editorial Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/45 backdrop-blur-md p-1 rounded-full border border-[#15263c]/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
            {navItems.map((item) => {
              const isActive = item.match
                ? item.match.includes(currentTab)
                : currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                    isActive
                      ? 'text-[#fbf9f4] bg-[#15263c] shadow-[0_2px_8px_rgba(21,38,60,0.18)]'
                      : 'text-[#15263c]/70 hover:text-[#15263c] hover:bg-black/[0.04]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('new-analysis')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#15263c] text-[#fbf9f4] text-[13px] font-medium px-4 py-2 rounded-full hover:bg-[#1f3757] transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_4px_16px_rgba(21,38,60,0.18)] border border-[#15263c]/20"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>New Scan</span>
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md p-1 rounded-full border border-[#15263c]/10">
              <span className="text-[12.5px] font-medium text-[#15263c] px-3 py-1 hidden lg:inline truncate max-w-[140px]">
                {currentUser.fullName}
              </span>
              <button
                onClick={() => onNavigate('history')}
                className={`text-[12.5px] font-medium px-3 py-1 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center gap-1 ${
                  currentTab === 'history'
                    ? 'bg-[#15263c] text-[#fbf9f4] shadow-xs'
                    : 'text-[#15263c]/80 hover:text-[#15263c] hover:bg-black/[0.04]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">history</span>
                <span>History</span>
              </button>
              <button
                onClick={onUserLogout}
                className="text-[12px] font-medium text-rose-700 hover:text-rose-900 px-2.5 py-1 transition-colors duration-200 cursor-pointer active:scale-[0.98]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className={`text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                currentTab === 'auth'
                  ? 'bg-[#15263c] text-[#fbf9f4] shadow-sm'
                  : 'text-[#15263c] bg-white/60 hover:bg-white/85 border border-[#15263c]/12 shadow-2xs backdrop-blur-md'
              }`}
            >
              Sign in
            </button>
          )}

          {/* Admin Login Section */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1.5 border-l border-[#15263c]/12 pl-2">
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`text-[12.5px] font-medium px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                  currentTab === 'admin-dashboard'
                    ? 'bg-[#15263c] text-[#fbf9f4] shadow-sm'
                    : 'text-[#15263c]/80 hover:bg-black/[0.04]'
                }`}
              >
                Admin
              </button>
              <button
                onClick={onAdminLogout}
                className="text-[12px] font-medium text-rose-700 hover:text-rose-900 px-2 py-1 transition-colors duration-200 cursor-pointer active:scale-[0.98]"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('admin-login')}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                currentTab === 'admin-login'
                  ? 'bg-[#15263c] text-[#fbf9f4]'
                  : 'text-[#15263c]/50 hover:text-[#15263c] hover:bg-black/[0.04]'
              }`}
              title="Admin Login"
            >
              <span className="material-symbols-outlined text-[16px]">shield_person</span>
            </button>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-white/60 border border-[#15263c]/12 text-[#15263c] hover:bg-white/90 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#fbf9f4]/95 backdrop-blur-2xl border-b border-[#15263c]/10 px-6 py-5 shadow-2xl flex flex-col gap-2 animate-entrance">
          <button
            onClick={() => handleNavClick('landing')}
            className={`text-left text-[14px] font-medium px-4 py-2.5 rounded-xl cursor-pointer ${
              currentTab === 'landing' ? 'bg-[#15263c] text-[#fbf9f4]' : 'text-[#15263c]/80 hover:text-[#15263c]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick('new-analysis')}
            className={`text-left text-[14px] font-medium px-4 py-2.5 rounded-xl cursor-pointer ${
              currentTab === 'new-analysis' || currentTab === 'analysis-result'
                ? 'bg-[#15263c] text-[#fbf9f4]'
                : 'text-[#15263c]/80 hover:text-[#15263c]'
            }`}
          >
            ATS Scan
          </button>
          <button
            onClick={() => handleNavClick('best-fit')}
            className={`text-left text-[14px] font-medium px-4 py-2.5 rounded-xl cursor-pointer ${
              currentTab === 'best-fit' ? 'bg-[#15263c] text-[#fbf9f4]' : 'text-[#15263c]/80 hover:text-[#15263c]'
            }`}
          >
            Best Fit
          </button>
          <button
            onClick={() => handleNavClick('compare-versions')}
            className={`text-left text-[14px] font-medium px-4 py-2.5 rounded-xl cursor-pointer ${
              currentTab === 'compare-versions'
                ? 'bg-[#15263c] text-[#fbf9f4]'
                : 'text-[#15263c]/80 hover:text-[#15263c]'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => handleNavClick('quality-analyzer')}
            className={`text-left text-[14px] font-medium px-4 py-2.5 rounded-xl cursor-pointer ${
              currentTab === 'quality-analyzer'
                ? 'bg-[#15263c] text-[#fbf9f4]'
                : 'text-[#15263c]/80 hover:text-[#15263c]'
            }`}
          >
            Quality
          </button>
          {currentUser && (
            <button
              onClick={() => handleNavClick('history')}
              className={`text-left text-[14px] font-medium px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 ${
                currentTab === 'history' ? 'bg-[#15263c] text-[#fbf9f4]' : 'text-[#15263c]/80 hover:text-[#15263c]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>My History</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};
