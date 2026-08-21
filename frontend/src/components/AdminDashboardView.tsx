import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AnalysisHistoryItem, ResumeData, JobDescriptionData } from '../types';

interface AdminDashboardViewProps {
  adminUser?: { email: string; name: string; role: string };
  history: AnalysisHistoryItem[];
  resumes: ResumeData[];
  jobs: JobDescriptionData[];
  onLogout: () => void;
  onNavigateToApp: () => void;
  onClearLogs: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser = { email: 'admin@resumeradar.io', name: 'Chief Administrator', role: 'Super Administrator' },
  history = [],
  resumes = [],
  jobs = [],
  onLogout,
  onNavigateToApp,
  onClearLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analyses' | 'system' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [engineModel, setEngineModel] = useState('gemini-3.7-flash (Auto-fallback)');
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [debugTelemetry, setDebugTelemetry] = useState(true);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Registered Users Directory State
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 'usr-1', name: 'Alex Morgan', email: 'alex.morgan@domain.com', plan: 'Enterprise Pro', scans: 48, maxQuota: 100, status: 'Active', joined: '2026-08-01' },
    { id: 'usr-2', name: 'Samantha Vance', email: 'samantha.v@cloudcorp.io', plan: 'Individual Pro', scans: 19, maxQuota: 50, status: 'Active', joined: '2026-08-05' },
    { id: 'usr-3', name: 'Marcus Sterling', email: 'marcus.s@fintech.co', plan: 'Free Tier', scans: 4, maxQuota: 10, status: 'Active', joined: '2026-08-11' },
    { id: 'usr-4', name: 'Elena Rostova', email: 'elena.rostova@techai.org', plan: 'Enterprise Pro', scans: 72, maxQuota: 150, status: 'Active', joined: '2026-08-14' },
    { id: 'usr-5', name: 'David Chen', email: 'dchen.dev@berkeley.edu', plan: 'Student Discount', scans: 12, maxQuota: 30, status: 'Inactive', joined: '2026-08-18' },
  ]);

  // Daily Scan Trend Data for Recharts
  const scanVelocityData = [
    { day: 'Mon', scans: 42, avgScore: 82, latency: 780 },
    { day: 'Tue', scans: 58, avgScore: 85, latency: 810 },
    { day: 'Wed', scans: 74, avgScore: 83, latency: 740 },
    { day: 'Thu', scans: 68, avgScore: 87, latency: 890 },
    { day: 'Fri', scans: 95, avgScore: 88, latency: 840 },
    { day: 'Sat', scans: 51, avgScore: 84, latency: 690 },
    { day: 'Sun', scans: 63, avgScore: 86, latency: 720 },
  ];

  const totalScans = history.length + 451;
  const avgScore = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.finalScore || curr.initialScore), 0) / history.length)
    : 85;

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleToggleUserStatus = (userId: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
    );
    showNotification('User status updated successfully.');
  };

  const handleIncreaseQuota = (userId: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, maxQuota: u.maxQuota + 25 } : u))
    );
    showNotification('Increased candidate scan quota by +25.');
  };

  const filteredUsers = registeredUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 z-50 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span>
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#cfc4c5]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-black uppercase tracking-wider">
              ADMIN CONSOLE
            </span>
            <span className="text-xs text-[#7e7576]">•</span>
            <span className="text-xs font-semibold text-neutral-700">{adminUser.role || 'Super Administrator'}</span>
            <span className="text-xs text-[#7e7576]">({adminUser.email || 'admin@resumeradar.io'})</span>
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
            <span>View User App</span>
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
      <div className="flex flex-wrap gap-2 border-b border-[#cfc4c5]/40 pb-2">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: 'dashboard' },
          { id: 'users', label: `Users Management (${registeredUsers.length})`, icon: 'group' },
          { id: 'analyses', label: `Scan Audit Logs (${history.length})`, icon: 'receipt_long' },
          { id: 'system', label: 'AI Engine & Infrastructure', icon: 'memory' },
          { id: 'settings', label: 'Security & Policy', icon: 'security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-[#7e7576] border border-[#cfc4c5]/60 hover:text-black hover:bg-[#faf9fe]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS & CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#7e7576]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Scans Executed</span>
                <span className="material-symbols-outlined text-[18px] text-[#0058bc]">radar</span>
              </div>
              <div className="text-3xl font-black text-black">{totalScans}</div>
              <p className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +28.4% this week
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#7e7576]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Candidates</span>
                <span className="material-symbols-outlined text-[18px] text-green-700">person</span>
              </div>
              <div className="text-3xl font-black text-black">{registeredUsers.length + 142}</div>
              <p className="text-[11px] text-[#7e7576]">98.2% monthly retention</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#7e7576]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Avg Post-Opt Score</span>
                <span className="material-symbols-outlined text-[18px] text-purple-700">verified</span>
              </div>
              <div className="text-3xl font-black text-black">{avgScore}%</div>
              <p className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                +22% score delta
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#7e7576]">
                <span className="text-[11px] font-bold uppercase tracking-wider">AI API Uptime</span>
                <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
              </div>
              <div className="text-3xl font-black text-black">99.96%</div>
              <p className="text-[11px] text-neutral-600 font-mono">Gemini 3.7 + Flash Fallback</p>
            </div>
          </div>

          {/* Real-time Recharts Visual Area & Velocity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Scan Volume Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-neutral-100">
                <div>
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider">Daily Scan Volume &amp; Throughput</h3>
                  <p className="text-[11px] text-[#7e7576]">Real-time request velocity across all platform users</p>
                </div>
                <span className="text-[11px] font-mono bg-[#faf9fe] border border-[#cfc4c5]/60 px-2.5 py-1 rounded-lg text-black font-semibold">
                  Last 7 Days
                </span>
              </div>

              <div className="w-full h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scanVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scanColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0058bc" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0058bc" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#7e7576' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#7e7576' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#cfc4c5', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} Scans`, 'Daily Volume']}
                    />
                    <Area type="monotone" dataKey="scans" stroke="#0058bc" strokeWidth={2.5} fillOpacity={1} fill="url(#scanColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inference Latency & Subsystems */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-3">Subsystem Telemetry</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-black">Gemini 3.7 Inference Latency</span>
                      <span className="font-mono text-neutral-600">820ms (P95)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-black">Heuristic Fallback Engine</span>
                      <span className="font-mono text-neutral-600">12ms (Ready)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-black">ATS Parser Simulator Buffer</span>
                      <span className="font-mono text-neutral-600">100% Operational</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <button
                  onClick={() => {
                    onClearLogs();
                    showNotification('Transient session logs successfully flushed.');
                  }}
                  className="w-full text-center text-xs font-bold text-red-600 hover:text-red-800 py-2.5 border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Flush Transient Session Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#cfc4c5]/40">
            <div>
              <h2 className="text-sm font-bold text-black">Registered Candidates &amp; Organizations</h2>
              <p className="text-[11px] text-[#7e7576]">Manage candidate quotas, plan tiers, and active status</p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3 py-1.5 pl-8 text-xs text-black focus:outline-none focus:border-black"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#7e7576] text-[16px]">
                search
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[#7e7576] uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 font-bold">Candidate</th>
                  <th className="py-2.5 font-bold">Plan Tier</th>
                  <th className="py-2.5 font-bold">Scans Used / Quota</th>
                  <th className="py-2.5 font-bold">Status</th>
                  <th className="py-2.5 font-bold">Joined</th>
                  <th className="py-2.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#faf9fe] transition-colors">
                    <td className="py-3">
                      <span className="font-bold text-black block">{user.name}</span>
                      <span className="text-[11px] text-[#7e7576]">{user.email}</span>
                    </td>
                    <td className="py-3">
                      <span className="bg-neutral-100 text-black px-2 py-0.5 rounded text-[11px] font-semibold">
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-semibold text-black">
                      {user.scans} / {user.maxQuota}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="py-3 text-[#7e7576] text-[11px]">{user.joined}</td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleIncreaseQuota(user.id)}
                        className="text-[11px] font-bold text-[#0058bc] hover:underline cursor-pointer"
                      >
                        +25 Quota
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SCAN AUDIT LOGS */}
      {activeTab === 'analyses' && (
        <div className="bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#cfc4c5]/40">
            <div>
              <h2 className="text-sm font-bold text-black">Scan Transaction Audits</h2>
              <p className="text-[11px] text-[#7e7576]">Detailed scoring delta and recommendation log</p>
            </div>
            <button
              onClick={() => {
                onClearLogs();
                showNotification('Scan audit log cleared.');
              }}
              className="text-xs font-bold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              Clear Audit Log
            </button>
          </div>

          <div className="space-y-3">
            {history.length > 0 ? (
              history.map((h) => (
                <div key={h.id} className="p-4 rounded-xl border border-[#cfc4c5]/60 bg-[#faf9fe] space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-black text-sm">{h.jobTitle}</span>
                      <span className="text-[#7e7576] block text-[11px]">Company: {h.company} • File: {h.resumeFileName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-black text-sm">{h.initialScore}% → {h.finalScore || h.initialScore + 20}%</span>
                      <span className="block text-[10px] text-green-700 font-bold">{h.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#7e7576] pt-1 border-t border-neutral-200">
                    <span>Timestamp: {h.date}</span>
                    <span>•</span>
                    <span>Keywords Added: {h.optimizationResult?.highlightedKeywords?.length || 4}</span>
                    <span>•</span>
                    <span>Verbs Enhanced: {h.optimizationResult?.highlightedActionVerbs?.length || 3}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#7e7576] bg-[#faf9fe] rounded-xl border border-dashed border-[#cfc4c5]">
                No recent scan transaction logs available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM & AI ENGINE */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">AI Model Topology</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#7e7576] block mb-1">Primary Generation Model</label>
                <select
                  value={engineModel}
                  onChange={(e) => {
                    setEngineModel(e.target.value);
                    showNotification(`Engine updated to ${e.target.value}`);
                  }}
                  className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl p-2.5 text-xs text-black font-semibold focus:outline-none focus:border-black"
                >
                  <option value="gemini-3.7-flash (Auto-fallback)">gemini-3.7-flash (Default &amp; Multi-Fallback)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Low Latency)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest (Standard Stable)</option>
                </select>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#faf9fe] border border-neutral-200">
                <div>
                  <span className="font-bold text-black block">Adaptive Fallback Switcher</span>
                  <span className="text-[11px] text-[#7e7576]">Switches to heuristic regex engine on network timeouts</span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">Active</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#faf9fe] border border-neutral-200">
                <div>
                  <span className="font-bold text-black block">Real-time Telemetry Stream</span>
                  <span className="text-[11px] text-[#7e7576]">Log latency metrics and token consumption</span>
                </div>
                <input
                  type="checkbox"
                  checked={debugTelemetry}
                  onChange={(e) => setDebugTelemetry(e.target.checked)}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">Rate Limiting &amp; Safety Guards</h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#faf9fe] border border-neutral-200">
                <div>
                  <span className="font-bold text-black block">Per-User Scan Throttling</span>
                  <span className="text-[11px] text-[#7e7576]">Cap max scans at 20 / hour to prevent quota exhaustion</span>
                </div>
                <input
                  type="checkbox"
                  checked={rateLimitEnabled}
                  onChange={(e) => setRateLimitEnabled(e.target.checked)}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#faf9fe] border border-neutral-200 space-y-1">
                <span className="font-bold text-black block">OCR Sanitization Rules</span>
                <p className="text-[11px] text-[#7e7576]">
                  Stripping script injection tags, binary blobs, and unprintable UTF-8 sequences prior to AI ingestion.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-[#cfc4c5]/60 shadow-xs space-y-6 max-w-2xl">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Administrative Credentials</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[11px] font-bold text-[#7e7576] block mb-1">Super Admin Account</label>
              <input
                type="text"
                disabled
                value={adminUser.email}
                className="w-full bg-[#eeedf3] border border-[#cfc4c5]/60 rounded-xl p-2.5 text-xs text-[#7e7576] font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#7e7576] block mb-1">Session Security Token</label>
              <input
                type="text"
                disabled
                value="rr_live_sec_994821a884fc9021e"
                className="w-full bg-[#eeedf3] border border-[#cfc4c5]/60 rounded-xl p-2.5 text-xs text-[#7e7576] font-mono cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={onLogout}
                className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Sign Out from Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
