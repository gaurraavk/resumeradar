import React from 'react';
import { UserAccount } from './UserLoginView';

interface SidebarNavProps {
  currentTab: string;
  user?: UserAccount | null;
  onNavigate: (tab: string) => void;
  onOpenSupport?: () => void;
  onOpenPrivacy?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  user,
  onNavigate,
  onOpenSupport,
  onOpenPrivacy,
}) => {
  const navItems = [
    { id: 'analyze', label: 'Analyze', icon: 'radar', targetTab: 'new-analysis' },
    { id: 'linkedin-radar', label: 'LinkedIn Radar', icon: 'person_search', targetTab: 'linkedin-radar' },
    { id: 'bullet-studio', label: 'Bullet Studio', icon: 'auto_fix_high', targetTab: 'bullet-studio' },
    { id: 'cover-letter', label: 'Cover Letter', icon: 'mail', targetTab: 'cover-letter' },
    { id: 'ats-simulator', label: 'ATS Simulator', icon: 'developer_board', targetTab: 'ats-simulator' },
    { id: 'interview-prep', label: 'Interview Prep', icon: 'psychology', targetTab: 'interview-prep' },
    { id: 'template-studio', label: 'ATS Templates', icon: 'view_quilt', targetTab: 'template-studio' },
    { id: 'resumes', label: 'Resumes', icon: 'description', targetTab: 'resumes' },
    { id: 'jobs', label: 'Jobs', icon: 'work', targetTab: 'jobs' },
    { id: 'insights', label: 'Insights', icon: 'analytics', targetTab: 'insights' },
  ];

  return (
    <aside className="hidden lg:flex flex-col h-[calc(100vh-4rem)] p-4 space-y-4 bg-[#f4f3f8] border-r border-[#cfc4c5]/60 w-64 fixed left-0 top-16 z-40 select-none">
      {/* Header section */}
      <div className="px-2 pt-1">
        <h2 className="font-extrabold text-xl text-black tracking-tight">ResumeRadar</h2>
        <p className="text-[11px] font-semibold text-[#4c4546] uppercase tracking-widest mt-0.5">
          Optimization Suite
        </p>
      </div>

      {/* New Analysis Button */}
      <button
        onClick={() => onNavigate('new-analysis')}
        className="w-full bg-black text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        New Analysis
      </button>

      {/* Main Nav Items */}
      <nav className="flex-1 space-y-1 pt-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            currentTab === item.targetTab ||
            (item.id === 'analyze' && (currentTab === 'analysis-result' || currentTab === 'optimization' || currentTab === 'new-analysis'));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.targetTab)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-[#e3e2e7] text-black shadow-xs font-bold'
                  : 'text-[#4c4546] hover:bg-[#e9e7ed] hover:text-black'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom User Card & Utility links */}
      <div className="mt-auto pt-3 border-t border-[#cfc4c5]/60 space-y-1.5">
        {user ? (
          <button
            onClick={() => onNavigate('user-login')}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-neutral-100 border border-[#cfc4c5]/60 transition-colors text-left cursor-pointer"
            title="Manage account"
          >
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <span className="font-bold text-black text-xs block truncate">{user.name}</span>
              <span className="text-[10px] text-[#7e7576] block truncate">{user.plan}</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#7e7576]">swap_horiz</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('user-login')}
            className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'user-login'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black/80 hover:bg-neutral-50'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            <span>Candidate Sign In</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-1 pt-1">
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
              currentTab === 'admin' || currentTab === 'admin-login' || currentTab === 'admin-dashboard'
                ? 'bg-black text-white font-bold'
                : 'text-[#4c4546] hover:bg-[#e9e7ed] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">shield_person</span>
            <span>Admin</span>
          </button>
          <button
            onClick={onOpenSupport || (() => onNavigate('resources'))}
            className="flex items-center justify-center gap-1 py-1.5 text-[#4c4546] hover:bg-[#e9e7ed] hover:text-black rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">help</span>
            <span>Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
