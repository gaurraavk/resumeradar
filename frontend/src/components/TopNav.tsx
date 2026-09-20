import React from 'react';

interface TopNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isAdminLoggedIn?: boolean;
  onAdminLogout?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onNavigate,
  isAdminLoggedIn = false,
  onAdminLogout,
}) => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between w-full px-6 sm:px-8 md:px-12 h-14 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 font-semibold text-lg text-neutral-900 tracking-tight hover:opacity-70 transition-opacity duration-200 cursor-pointer"
        >
          <span className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-[11px] font-black">
            RR
          </span>
          <span>ResumeRadar</span>
        </button>

        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => onNavigate('landing')}
            className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              currentTab === 'landing' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('new-analysis')}
            className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              currentTab === 'new-analysis' || currentTab === 'analysis-result' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            ATS Scan
          </button>
          <button
            onClick={() => onNavigate('best-fit')}
            className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              currentTab === 'best-fit' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            Best Fit
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('new-analysis')}
          className="inline-flex items-center gap-1.5 bg-neutral-900 text-white text-[13px] font-medium px-4 py-2 rounded-2xl hover:bg-neutral-700 transition-all duration-200 active:scale-[0.97] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">add</span>
          <span>New Scan</span>
        </button>

        {isAdminLoggedIn ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`text-[13px] font-medium px-3 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                currentTab === 'admin-dashboard' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={onAdminLogout}
              className="text-[13px] font-medium text-red-500 hover:text-red-700 px-2 py-1 transition-colors duration-200 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('admin-login')}
            className={`flex items-center gap-1 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              currentTab === 'admin-login' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">shield_person</span>
            <span>Admin</span>
          </button>
        )}
      </div>
    </nav>
  );
};
