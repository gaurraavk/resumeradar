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
    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-lg bg-neutral-900 text-white text-[10px] font-semibold tracking-wide">
              ADMIN
            </span>
            <span className="text-[13px] text-neutral-400">{adminUser.role}</span>
            <span className="text-[13px] text-neutral-300">({adminUser.email})</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight mt-1">
            Platform Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToApp}
            className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600 bg-white hover:bg-neutral-50 px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            <span>View Scanner</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-[13px] font-medium text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-0.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer ${
            activeTab === 'overview' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">dashboard</span>
          Overview
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer ${
            activeTab === 'system' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
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
            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-neutral-400">Backend Runtime</span>
                <span className="material-symbols-outlined text-[18px] text-emerald-500">dns</span>
              </div>
              <div className="text-xl font-semibold text-neutral-900">Java 21 / Spring Boot</div>
              <p className="text-[12px] text-emerald-500 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                Active
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-neutral-400">ATS Engine</span>
                <span className="material-symbols-outlined text-[18px] text-blue-500">radar</span>
              </div>
              <div className="text-xl font-semibold text-neutral-900">Deterministic</div>
              <p className="text-[12px] text-neutral-400">Exact & stemmed token matching</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-neutral-400">Auth Security</span>
                <span className="material-symbols-outlined text-[18px] text-emerald-500">security</span>
              </div>
              <div className="text-xl font-semibold text-neutral-900">JWT Auth</div>
              <p className="text-[12px] text-neutral-400">Admin Protected Endpoints</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[14px] font-semibold text-neutral-900">Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
              <div className="p-4 rounded-xl bg-neutral-50 space-y-1">
                <span className="font-semibold text-neutral-900">Backend Engine</span>
                <p className="text-neutral-500">Spring Boot 3.3 REST API with deterministic ATS keyword parsing, formatting analysis, and auto-fix engine.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 space-y-1">
                <span className="font-semibold text-neutral-900">Frontend Client</span>
                <p className="text-neutral-500">React 19 + TypeScript single-page application with responsive layouts and file upload support.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-[14px] font-semibold text-neutral-900">Endpoints & Services</h3>
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
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                <span className="font-mono font-semibold text-blue-600">{ep.method} {ep.path}</span>
                <span className="text-neutral-400">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
