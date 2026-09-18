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
    <nav className="sticky top-0 z-50 flex items-center justify-between w-full px-4 sm:px-6 md:px-8 h-16 bg-[#faf9fe]/95 backdrop-blur-md border-b border-[#cfc4c5]/60">
      {/* Brand & Left Links */}
      <div className="flex items-center gap-6 md:gap-8">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 font-bold text-xl md:text-2xl text-black tracking-tight hover:opacity-85 transition-opacity cursor-pointer shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm font-black shadow-sm">
            RR
          </span>
          <span>ResumeRadar</span>
        </button>

        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className={`text-xs sm:text-sm font-medium transition-colors px-2 py-1 cursor-pointer ${
              currentTab === 'landing' ? 'text-black font-semibold border-b-2 border-black' : 'text-[#4c4546] hover:text-black'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('new-analysis')}
            className={`text-xs sm:text-sm font-medium transition-colors px-2 py-1 cursor-pointer ${
              currentTab === 'new-analysis' || currentTab === 'analysis-result' ? 'text-black font-semibold border-b-2 border-black' : 'text-[#4c4546] hover:text-black'
            }`}
          >
            ATS Scan
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('new-analysis')}
          className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-neutral-800 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Scan</span>
        </button>

        {isAdminLoggedIn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                currentTab === 'admin-dashboard' ? 'bg-black text-white border-black' : 'text-black border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={onAdminLogout}
              className="text-xs font-medium text-red-600 hover:text-red-800 px-2 py-1 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('admin-login')}
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentTab === 'admin-login' ? 'bg-black text-white font-semibold' : 'text-[#4c4546] hover:text-black hover:bg-neutral-100'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">shield_person</span>
            <span>Admin</span>
          </button>
        )}
      </div>
    </nav>
  );
};
