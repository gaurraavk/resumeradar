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
    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-10 flex flex-col gap-6 animate-entrance">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-lg bg-[#1d1d1f] text-white text-[10px] font-semibold tracking-wide shadow-2xs">
              ADMIN
            </span>
            <span className="text-[13px] text-neutral-400">{adminUser.role}</span>
            <span className="text-[13px] text-neutral-300">({adminUser.email})</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight mt-1">
            Platform Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToApp}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#1d1d1f] bg-white hover:bg-[#f5f5f7] border border-black/[0.06] px-4 py-2.5 rounded-2xl shadow-2xs transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            <span>View Scanner</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-[13px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-4 py-2.5 rounded-2xl border border-rose-200/50 transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-black/[0.03] p-1 rounded-2xl border border-black/[0.04] w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] ${
            activeTab === 'overview'
              ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
              : 'text-neutral-500 hover:text-[#1d1d1f]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">dashboard</span>
          Overview
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] ${
            activeTab === 'system'
              ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
              : 'text-neutral-500 hover:text-[#1d1d1f]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">memory</span>
          System & Engine
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="macos-card p-6 rounded-3xl space-y-2 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-neutral-400">Backend Runtime</span>
                <span className="material-symbols-outlined text-[18px] text-emerald-600">dns</span>
              </div>
              <div className="text-xl font-semibold text-[#1d1d1f]">Java 21 / Spring Boot</div>
              <p className="text-[12px] text-emerald-700 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                Active
              </p>
            </div>

            <div className="macos-card p-6 rounded-3xl space-y-2 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-neutral-400">ATS Engine</span>
                <span className="material-symbols-outlined text-[18px] text-blue-600">radar</span>
              </div>
              <div className="text-xl font-semibold text-[#1d1d1f]">Deterministic</div>
              <p className="text-[12px] text-neutral-400 font-normal">Exact & stemmed token matching</p>
            </div>

            <div className="macos-card p-6 rounded-3xl space-y-2 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-neutral-400">Auth Security</span>
                <span className="material-symbols-outlined text-[18px] text-emerald-600">security</span>
              </div>
              <div className="text-xl font-semibold text-[#1d1d1f]">JWT Auth</div>
              <p className="text-[12px] text-neutral-400 font-normal">Admin Protected Endpoints</p>
            </div>
          </div>

          <div className="macos-card p-7 rounded-3xl space-y-4 transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
              <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-1">
                <span className="font-semibold text-[#1d1d1f]">Backend Engine</span>
                <p className="text-neutral-500 font-normal leading-relaxed">Spring Boot 3.3 REST API with deterministic ATS keyword parsing, formatting analysis, and auto-fix engine.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-1">
                <span className="font-semibold text-[#1d1d1f]">Frontend Client</span>
                <p className="text-neutral-500 font-normal leading-relaxed">React 19 + TypeScript single-page application with responsive layouts and file upload support.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="macos-card p-7 rounded-3xl space-y-4 transition-all duration-300">
          <h3 className="text-sm font-semibold text-[#1d1d1f]">Endpoints & Services</h3>
          <div className="space-y-2 text-[13px]">
            {[
              { method: 'POST', path: '/api/v1/analyze', desc: 'Text-based ATS keyword scan' },
              { method: 'POST', path: '/api/v1/analyze-file', desc: 'File upload analysis with formatting detection' },
              { method: 'POST', path: '/api/v1/generate-fixed-resume', desc: 'Generate auto-fixed .docx resume' },
              { method: 'GET', path: '/api/v1/download/fixed-resume/{id}', desc: 'Download fixed resume file' },
              { method: 'POST', path: '/api/v1/best-fit', desc: 'Multi-job comparison ranking' },
              { method: 'POST', path: '/api/v1/auth/admin-login', desc: 'Admin authentication (JWT)' },
              { method: 'GET', path: '/healthz', desc: 'Service liveness probe' },
            ].map((ep, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#f5f5f7] border border-black/[0.04] gap-1 sm:gap-4">
                <span className="font-mono font-semibold text-blue-600 text-[12px]">{ep.method} {ep.path}</span>
                <span className="text-neutral-400 text-[12px] font-normal">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
