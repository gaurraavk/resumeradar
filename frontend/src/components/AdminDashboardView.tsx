import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/apiClient';
import { AdminAnalyticsData, UserProfile } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'activity' | 'system'>('overview');
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        adminFetch('/api/v1/admin/analytics'),
        adminFetch('/api/v1/admin/users'),
      ]);

      if (analyticsRes.status === 401 || analyticsRes.status === 403) {
        setError('Unauthorized or session expired. Please sign in again as admin.');
        setLoading(false);
        return;
      }

      if (analyticsRes.ok) {
        const analyticsJson = await analyticsRes.json();
        if (analyticsJson.success && analyticsJson.data) {
          setAnalytics(analyticsJson.data);
        }
      }

      if (usersRes.ok) {
        const usersJson = await usersRes.json();
        if (usersJson.success && Array.isArray(usersJson.data)) {
          setUsers(usersJson.data);
        }
      }
    } catch (err: any) {
      setError('Unable to load analytics data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    if (score >= 60) return 'bg-amber-50 text-amber-700 border-amber-200/60';
    return 'bg-rose-50 text-rose-700 border-rose-200/60';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-10 flex flex-col gap-6 animate-entrance">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-lg bg-[#1d1d1f] text-white text-[10px] font-semibold tracking-wide shadow-2xs">
              ADMIN
            </span>
            <span className="text-[13px] text-neutral-500 font-medium">{adminUser.role}</span>
            <span className="text-[13px] text-neutral-400">({adminUser.email})</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight mt-1">
            Platform Analytics & Control
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#1d1d1f] bg-white hover:bg-[#f5f5f7] border border-black/[0.06] px-3.5 py-2.5 rounded-2xl shadow-2xs transition-all duration-300 cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Refresh</span>
          </button>
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
      <div className="flex flex-wrap gap-1 bg-black/[0.03] p-1 rounded-2xl border border-black/[0.04] w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] ${
            activeTab === 'overview'
              ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
              : 'text-neutral-500 hover:text-[#1d1d1f]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">analytics</span>
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] ${
            activeTab === 'users'
              ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
              : 'text-neutral-500 hover:text-[#1d1d1f]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">group</span>
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] ${
            activeTab === 'activity'
              ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
              : 'text-neutral-500 hover:text-[#1d1d1f]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">history</span>
          Recent Activity
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

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="macos-card p-12 rounded-3xl text-center space-y-3 border border-black/[0.06]">
          <span className="material-symbols-outlined text-[32px] text-indigo-500 animate-spin">
            progress_activity
          </span>
          <p className="text-[14px] text-neutral-500 font-medium">Loading platform analytics...</p>
        </div>
      )}

      {/* ======================= OVERVIEW TAB ======================= */}
      {!loading && activeTab === 'overview' && analytics && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="macos-card p-6 rounded-3xl space-y-1.5 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Total Users</span>
                <span className="material-symbols-outlined text-[20px] text-indigo-600">group</span>
              </div>
              <div className="text-3xl font-semibold text-[#1d1d1f]">{analytics.totalUsers}</div>
              <p className="text-[12px] text-indigo-600 font-medium">
                +{analytics.newUsersLast7Days} new in last 7 days
              </p>
            </div>

            <div className="macos-card p-6 rounded-3xl space-y-1.5 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Total Analyses</span>
                <span className="material-symbols-outlined text-[20px] text-emerald-600">query_stats</span>
              </div>
              <div className="text-3xl font-semibold text-[#1d1d1f]">{analytics.totalAnalyses}</div>
              <p className="text-[12px] text-neutral-400">
                {analytics.inputTypeSplit?.text ?? 0} text · {analytics.inputTypeSplit?.file ?? 0} file
              </p>
            </div>

            <div className="macos-card p-6 rounded-3xl space-y-1.5 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Average ATS Score</span>
                <span className="material-symbols-outlined text-[20px] text-amber-600">speed</span>
              </div>
              <div className="text-3xl font-semibold text-[#1d1d1f]">{analytics.averageAtsScore}%</div>
              <p className="text-[12px] text-neutral-400">Across all candidate scans</p>
            </div>

            <div className="macos-card p-6 rounded-3xl space-y-1.5 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Top Template</span>
                <span className="material-symbols-outlined text-[20px] text-purple-600">style</span>
              </div>
              <div className="text-2xl font-semibold text-[#1d1d1f] truncate">
                {analytics.templateUsage?.find(t => t.count > 0)?.name || 'Classic'}
              </div>
              <p className="text-[12px] text-purple-600 font-medium">
                {analytics.templateUsage?.reduce((acc, t) => acc + Number(t.count), 0) || 0} total styled
              </p>
            </div>
          </div>

          {/* 7-Day Bar Chart & Score Distribution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 7-Day Chart */}
            <div className="macos-card p-6 rounded-3xl lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-[#1d1d1f]">7-Day Analysis Volume</h3>
                  <p className="text-[12px] text-neutral-400">Daily scans run over the last week</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider bg-black/[0.04] px-2.5 py-1 rounded-xl">
                  Last 7 Days
                </span>
              </div>

              {analytics.analysesLast7Days && analytics.analysesLast7Days.length > 0 ? (
                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.analysesLast7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0000000d" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(val) => val.slice(5)}
                        tick={{ fontSize: 11, fill: '#888' }}
                        axisLine={{ stroke: '#00000010' }}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#888' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1d1d1f',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                        labelFormatter={(lbl) => `Date: ${lbl}`}
                        formatter={(val: any) => [`${val} analyses`, 'Volume']}
                      />
                      <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-neutral-400 text-[13px]">
                  No 7-day trend data available yet.
                </div>
              )}
            </div>

            {/* Score Buckets */}
            <div className="macos-card p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f]">Score Distribution</h3>
                <p className="text-[12px] text-neutral-400">Candidate ATS score ranges</p>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { label: '80 - 100', key: '80-100', color: 'bg-emerald-500', text: 'text-emerald-700' },
                  { label: '60 - 79', key: '60-79', color: 'bg-amber-500', text: 'text-amber-700' },
                  { label: '40 - 59', key: '40-59', color: 'bg-orange-500', text: 'text-orange-700' },
                  { label: '0 - 39', key: '0-39', color: 'bg-rose-500', text: 'text-rose-700' },
                ].map((b) => {
                  const count = analytics.scoreBuckets?.[b.key] ?? 0;
                  const pct = analytics.totalAnalyses > 0 ? Math.round((count / analytics.totalAnalyses) * 100) : 0;
                  return (
                    <div key={b.key} className="space-y-1">
                      <div className="flex justify-between text-[12px] font-medium">
                        <span className="text-[#1d1d1f]">{b.label}</span>
                        <span className="text-neutral-400">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-black/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${b.color} transition-all duration-500 rounded-full`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Templates & Top Missing Keywords Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Template Usage */}
            <div className="macos-card p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f]">Resume Template Adoption</h3>
                <p className="text-[12px] text-neutral-400">Usage counts for database-backed templates</p>
              </div>

              {analytics.templateUsage && analytics.templateUsage.length > 0 ? (
                <div className="divide-y divide-black/[0.04]">
                  {analytics.templateUsage.map((tmpl) => (
                    <div key={tmpl.templateId} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-indigo-600">style</span>
                        <span className="text-[13px] font-semibold text-[#1d1d1f]">{tmpl.name}</span>
                        <span className="text-[10px] uppercase font-semibold text-neutral-400 bg-black/[0.04] px-2 py-0.5 rounded-md">
                          {tmpl.templateId}
                        </span>
                      </div>
                      <span className="text-[13px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-xl border border-indigo-200/50">
                        {tmpl.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-neutral-400 py-4 text-center">No template usage recorded yet.</p>
              )}
            </div>

            {/* Top Missing Keywords */}
            <div className="macos-card p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f]">Top Missing Keywords</h3>
                <p className="text-[12px] text-neutral-400">Aggregated from candidate ATS gap analysis</p>
              </div>

              {analytics.topMissingKeywords && analytics.topMissingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {analytics.topMissingKeywords.map((item, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#fbfbfd] border border-black/[0.08] text-[12px] shadow-2xs"
                    >
                      <span className="font-medium text-[#1d1d1f] capitalize">{item.keyword}</span>
                      <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center text-[10px]">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-neutral-400 py-4 text-center">No missing keyword data accumulated yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================= USERS TAB ======================= */}
      {!loading && activeTab === 'users' && (
        <div className="macos-card rounded-3xl border border-black/[0.06] overflow-hidden shadow-2xs animate-entrance">
          <div className="p-6 border-b border-black/[0.06] flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-[#1d1d1f]">Registered Users</h3>
              <p className="text-[12px] text-neutral-400">Latest 100 accounts registered on the platform</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-[12px] font-semibold border border-indigo-200/50">
              {users.length} Users Total
            </span>
          </div>

          {users.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <span className="material-symbols-outlined text-[32px] text-neutral-400">group_off</span>
              <p className="text-[14px] text-neutral-500 font-medium">No users registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-[#fbfbfd] text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    <th className="py-3 px-6">ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Created At</th>
                    <th className="py-3 px-6">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-[13px]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-black/[0.015] transition-colors">
                      <td className="py-3.5 px-6 font-mono text-neutral-400 text-[12px]">{u.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">{u.fullName}</td>
                      <td className="py-3.5 px-4 text-neutral-600">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide ${
                          u.role === 'ADMIN'
                            ? 'bg-[#1d1d1f] text-white'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/50'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                      <td className="py-3.5 px-6 text-neutral-500 whitespace-nowrap">{formatDate(u.lastLoginAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================= RECENT ACTIVITY TAB ======================= */}
      {!loading && activeTab === 'activity' && (
        <div className="macos-card rounded-3xl border border-black/[0.06] overflow-hidden shadow-2xs animate-entrance">
          <div className="p-6 border-b border-black/[0.06] flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-[#1d1d1f]">Recent Analyses Activity</h3>
              <p className="text-[12px] text-neutral-400">Last 10 ATS scans completed on ResumeRadar</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[12px] font-semibold border border-emerald-200/50">
              Live Feed
            </span>
          </div>

          {!analytics || analytics.recentAnalyses.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <span className="material-symbols-outlined text-[32px] text-neutral-400">history_toggle_off</span>
              <p className="text-[14px] text-neutral-500 font-medium">No recent analyses recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-[#fbfbfd] text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Timestamp</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-6">ATS Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-[13px]">
                  {analytics.recentAnalyses.map((item, idx) => (
                    <tr key={idx} className="hover:bg-black/[0.015] transition-colors">
                      <td className="py-3.5 px-6 text-neutral-500 whitespace-nowrap">{formatDate(String(item.date))}</td>
                      <td className="py-3.5 px-4 font-medium text-[#1d1d1f] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-neutral-400">
                          {item.userName === 'Guest' ? 'person_outline' : 'account_circle'}
                        </span>
                        <span>{item.userName}</span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700 font-medium">{item.jobTitle}</td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[12px] font-semibold border ${getScoreBadgeClass(item.score)}`}>
                          {item.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================= SYSTEM & ENGINE TAB (PRESERVED) ======================= */}
      {activeTab === 'system' && (
        <div className="space-y-4 animate-entrance">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="macos-card p-6 rounded-3xl space-y-2 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-neutral-400">Backend Runtime</span>
                <span className="material-symbols-outlined text-[18px] text-emerald-600">dns</span>
              </div>
              <div className="text-xl font-semibold text-[#1d1d1f]">Java 21 / Spring Boot 3.3</div>
              <p className="text-[12px] text-emerald-700 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                Active & Running
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
                <span className="text-[12px] font-medium text-neutral-400">Auth & Storage</span>
                <span className="material-symbols-outlined text-[18px] text-purple-600">database</span>
              </div>
              <div className="text-xl font-semibold text-[#1d1d1f]">JPA / H2 Embedded</div>
              <p className="text-[12px] text-neutral-400 font-normal">BCrypt + JWT Role Protection</p>
            </div>
          </div>

          <div className="macos-card p-7 rounded-3xl space-y-4 transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
              <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-1">
                <span className="font-semibold text-[#1d1d1f]">Backend Engine</span>
                <p className="text-neutral-500 font-normal leading-relaxed">
                  Spring Boot REST API with deterministic ATS keyword parsing, database-backed templates, and analytics aggregations.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-1">
                <span className="font-semibold text-[#1d1d1f]">Security Architecture</span>
                <p className="text-neutral-500 font-normal leading-relaxed">
                  Role-based access control protecting admin analytics while providing seamless guest and user scan tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
