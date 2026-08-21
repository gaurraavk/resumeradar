import React, { useState } from 'react';
import { UserAccount } from './UserLoginView';
import { InAppNotification, LinkedInJobMatch } from '../types';

interface TopNavProps {
  currentTab: string;
  user?: UserAccount | null;
  notifications?: InAppNotification[];
  linkedInConnected?: boolean;
  onNavigate: (tab: string) => void;
  onOpenSettings: () => void;
  onLogoutUser?: () => void;
  onOptimizeForJob?: (job: LinkedInJobMatch) => void;
  onMarkNotificationRead?: (id: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  user,
  notifications = [],
  linkedInConnected = false,
  onNavigate,
  onOpenSettings,
  onLogoutUser,
  onOptimizeForJob,
  onMarkNotificationRead,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center w-full px-4 sm:px-6 md:px-8 h-16 bg-[#faf9fe]/95 backdrop-blur-md border-b border-[#cfc4c5]/60">
      {/* Brand & Left Navigation Links */}
      <div className="flex items-center gap-6 md:gap-8">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 font-bold text-xl md:text-2xl text-black tracking-tight hover:opacity-85 transition-opacity cursor-pointer shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm font-black shadow-sm">
            RR
          </span>
          <span className="hidden sm:inline">ResumeRadar</span>
        </button>

        <div className="hidden md:flex items-center gap-5 lg:gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className={`text-xs lg:text-sm font-medium transition-colors px-1.5 py-1 cursor-pointer ${
              currentTab === 'landing' ? 'text-black font-semibold' : 'text-[#4c4546] hover:text-black'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`text-xs lg:text-sm font-medium transition-colors px-1.5 py-1 cursor-pointer ${
              currentTab === 'dashboard' ||
              currentTab === 'new-analysis' ||
              currentTab === 'analysis-result' ||
              currentTab === 'optimization' ||
              currentTab === 'cover-letter' ||
              currentTab === 'ats-simulator' ||
              currentTab === 'bullet-studio' ||
              currentTab === 'interview-prep' ||
              currentTab === 'template-studio'
                ? 'text-black font-semibold border-b-2 border-black'
                : 'text-[#4c4546] hover:text-black'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('linkedin-radar')}
            className={`text-xs lg:text-sm font-medium transition-colors px-1.5 py-1 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'linkedin-radar'
                ? 'text-[#0a66c2] font-bold border-b-2 border-[#0a66c2]'
                : 'text-[#4c4546] hover:text-[#0a66c2]'
            }`}
          >
            <span className="font-serif font-black text-xs text-[#0a66c2]">in</span>
            <span>Job Radar</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`text-xs lg:text-sm font-medium transition-colors px-1.5 py-1 cursor-pointer ${
              currentTab === 'history'
                ? 'text-black font-semibold border-b-2 border-black'
                : 'text-[#4c4546] hover:text-black'
            }`}
          >
            History
          </button>
          <button
            onClick={() => onNavigate('resources')}
            className={`text-xs lg:text-sm font-medium transition-colors px-1.5 py-1 cursor-pointer ${
              currentTab === 'resources'
                ? 'text-black font-semibold border-b-2 border-black'
                : 'text-[#4c4546] hover:text-black'
            }`}
          >
            Resources
          </button>
        </div>
      </div>

      {/* Right-side Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick LinkedIn Radar Action */}
        <button
          onClick={() => onNavigate('linkedin-radar')}
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-[#0a66c2] hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer"
          title="Live LinkedIn ATS Job Matches"
        >
          <span className="material-symbols-outlined text-[15px]">radar</span>
          <span>Radar Active</span>
        </button>

        {/* New Analysis Button */}
        {currentTab !== 'new-analysis' && (
          <button
            onClick={() => onNavigate('new-analysis')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-full hover:bg-neutral-800 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>New Scan</span>
          </button>
        )}

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserDropdownOpen(false);
            }}
            className="text-[#4c4546] hover:text-black transition-colors p-1.5 rounded-full hover:bg-black/5 cursor-pointer relative"
            title="LinkedIn Match & ATS Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 bg-[#0058bc] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#cfc4c5]/60 rounded-2xl shadow-xl p-4 z-50 text-sm space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-black uppercase tracking-wider">
                    Live Alerts & Job Radar
                  </span>
                </div>
                <span className="text-[10px] text-[#0a66c2] font-semibold">
                  {unreadCount} unread
                </span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (onMarkNotificationRead) onMarkNotificationRead(notif.id);
                      }}
                      className={`p-3 rounded-xl border transition-colors cursor-pointer text-left ${
                        notif.read
                          ? 'bg-neutral-50/60 border-neutral-200 opacity-80'
                          : 'bg-blue-50/60 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5">
                          {notif.type === 'linkedin_match' ? (
                            <span className="w-5 h-5 rounded-md bg-[#0a66c2] text-white font-serif font-black text-[10px] flex items-center justify-center shrink-0">
                              in
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[16px] text-[#0058bc]">
                              auto_awesome
                            </span>
                          )}
                          <p className="text-xs font-bold text-black leading-tight">{notif.title}</p>
                        </div>
                        {notif.matchScore && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono shrink-0">
                            {notif.matchScore}% Match
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#4c4546] mt-1 leading-snug">{notif.message}</p>
                      
                      <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-neutral-200/50 text-[10px] text-[#7e7576]">
                        <span>{notif.time}</span>
                        {notif.linkedInJob && onOptimizeForJob && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotificationsOpen(false);
                              if (notif.linkedInJob) onOptimizeForJob(notif.linkedInJob);
                            }}
                            className="text-[#0a66c2] font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>Optimize ATS Resume</span>
                            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-[#7e7576]">
                    No notifications right now.
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-[11px]">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    onNavigate('linkedin-radar');
                  }}
                  className="text-[#0a66c2] font-bold hover:underline"
                >
                  View All Live Matches →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="text-[#4c4546] hover:text-black transition-colors p-1.5 rounded-full hover:bg-black/5 cursor-pointer"
          title="Settings & ATS Parameters"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>

        {/* Candidate User Sign In / Profile Avatar */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-black/5 transition-all cursor-pointer border border-[#cfc4c5]/60"
              title="Candidate Profile & Settings"
            >
              <img
                src={
                  user.avatarUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGk6RIz7xVTQf8V6aPSiciReTIFq7WHfYpb2dvvScvF_xnaIgpX9TJl2p-L3xtxJR83Lt0Lk5uPxnglGGL7fA8MRtm2JGMjR9cWLAsxvFw833r-4hnxYuRyHVguG4oqkepEg0INPDriJPrxFRJ2LlxGbg7620QOv4OqszftGZRZ7deUSCESAZIiFySYxJZ-BS0r7d6_9_M1AjYl6TWJxDowsI0r6wVrFdYbxPQGIoZKFEqZdxoEtr6Q'
                }
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-[#cfc4c5] shadow-2xs"
              />
              <span className="text-xs font-semibold text-black hidden sm:inline">{user.name.split(' ')[0]}</span>
              <span className="material-symbols-outlined text-[16px] text-[#4c4546]">expand_more</span>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#cfc4c5]/60 rounded-2xl shadow-xl p-4 z-50 text-xs space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-sm text-black">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-black truncate">{user.name}</p>
                    <p className="text-[11px] text-[#7e7576] truncate">{user.email}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-neutral-100 text-[10px] font-bold text-neutral-800 rounded-full">
                      {user.plan}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 p-2.5 rounded-xl bg-[#faf9fe] border border-[#cfc4c5]/40">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#7e7576]">Available Scans:</span>
                    <span className="font-bold text-black">{user.scansRemaining} / 50</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#7e7576]">LinkedIn Sync:</span>
                    <span className={`font-bold ${linkedInConnected ? 'text-emerald-700' : 'text-neutral-500'}`}>
                      {linkedInConnected ? 'Connected ✓' : 'Not Connected'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('linkedin-radar');
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-blue-50 text-[#0a66c2] rounded-lg font-semibold cursor-pointer text-left"
                  >
                    <span className="font-serif font-black text-xs">in</span>
                    <span>LinkedIn Radar & Sync</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('dashboard');
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-[#faf9fe] rounded-lg text-[#4c4546] hover:text-black font-semibold cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-[16px]">space_dashboard</span>
                    <span>My Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('user-login');
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-[#faf9fe] rounded-lg text-[#4c4546] hover:text-black font-semibold cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-[16px]">switch_account</span>
                    <span>Switch Candidate Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onLogoutUser) onLogoutUser();
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-red-50 text-red-700 rounded-lg font-semibold cursor-pointer text-left transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onNavigate('user-login')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border border-black hover:bg-black hover:text-white transition-all shadow-2xs cursor-pointer ${
              currentTab === 'user-login' ? 'bg-black text-white' : 'text-black bg-white'
            }`}
            title="Candidate User Sign In"
          >
            <span className="material-symbols-outlined text-[15px]">person</span>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};
