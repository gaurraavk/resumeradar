import React, { useState } from 'react';

interface AdminDashboardViewProps {
  adminUser?: { email: string; name: string; role: string };
  onLogout: () => void;
  onNavigateToApp: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser = { email: 'admin@resumeradar.io', name: 'Chief Administrator', role: 'Super Administrator' },
  onLogout,
  onNavigateToApp,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'system'>('overview');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#cfc4c5]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-black uppercase tracking-wider">
              ADMIN CONSOLE
            </span>
            <span className="text-xs text-[#7e7576]">•</span>
            <span className="text-xs font-semibold text-neutral-700">{adminUser.role}</span>
            <span className="text-xs text-[#7e7576]">({adminUser.email})</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight mt-1">
            Platform Governance &amp; Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToApp}
            className="flex items-center gap-1.5 text-xs font-semibold text-black bg-white hover:bg-[#faf9fe] px-4 py-2.5 rounded-xl border border-[#cfc4c5]/80 shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>View Scanner</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl border border-red-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#cfc4c5]/40 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-black text-white shadow-xs'
              : 'bg-white text-[#7e7576] border border-[#cfc4c5]/60 hover:text-black hover:bg-[#faf9fe]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'system'
              ? 'bg-black text-white shadow-xs'
              : 'bg-white text-[#7e7576] border border-[#cfc4c5]/60 hover:text-black hover:bg-[#faf9fe]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">memory</span>
          <span>System &amp; Engine</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#7e7576]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Backend Runtime</span>
                <span className="material-symbols-outlined text-[18px] text-green-700">dns</span>
              </div>
              <div className="text-2xl font-black text-black">Java 21 / Spring Boot</div>
              <p className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Active on port 8080
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#7e7576]">
                <span className="text-[11px] font-bold uppercase tracking-wider">ATS Engine</span>
                <span className="material-symbols-outlined text-[18px] text-[#0058bc]">radar</span>
              </div>
              <div className="text-2xl font-black text-black">Deterministic</div>
              <p className="text-[11px] text-[#7e7576]">Exact &amp; stemmed token matching</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#7e7576]">
                <span className="text-[11px] font-bold uppercase tracking-wider">AI Resume Critic</span>
                <span className="material-symbols-outlined text-[18px] text-purple-700">auto_awesome</span>
              </div>
              <div className="text-2xl font-black text-black">Gemini 2.5 Flash</div>
              <p className="text-[11px] text-neutral-600 font-mono">Structured JSON Output</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#7e7576]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Auth Security</span>
                <span className="material-symbols-outlined text-[18px] text-emerald-600">security</span>
              </div>
              <div className="text-2xl font-black text-black">BCrypt + JWT</div>
              <p className="text-[11px] text-[#7e7576]">Admin Protected Endpoints</p>
            </div>
          </div>

          {/* System Status Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Architecture State</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#faf9fe] border border-neutral-200 space-y-2">
                <span className="font-bold text-black text-sm">Backend Engine</span>
                <p className="text-[#4c4546]">Spring Boot 3.3.x REST API with strict rate limiting, deterministic ATS keyword parsing, and Google Gemini AI client integration.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#faf9fe] border border-neutral-200 space-y-2">
                <span className="font-bold text-black text-sm">Frontend Client</span>
                <p className="text-[#4c4546]">React 19 + TypeScript single-page application with responsive layouts, real-time keyword gap charts, and zero bloat.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM & INFRASTRUCTURE */}
      {activeTab === 'system' && (
        <div className="bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider">Endpoints &amp; Services</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <span className="font-mono font-bold text-blue-700">POST /api/v1/analyze</span>
              <span className="text-[#4c4546]">Public ATS keyword scan + AI resume critique</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <span className="font-mono font-bold text-blue-700">POST /api/v1/auth/admin-login</span>
              <span className="text-[#4c4546]">Admin authentication endpoint (returns JWT)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <span className="font-mono font-bold text-blue-700">GET /api/v1/admin/overview</span>
              <span className="text-[#4c4546]">Admin telemetry &amp; system status</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <span className="font-mono font-bold text-green-700">GET /healthz</span>
              <span className="text-[#4c4546]">Service liveness probe</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
