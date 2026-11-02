import React, { useEffect, useState } from 'react';
import { apiFetch, safeJson } from '../lib/apiClient';
import { HistoryRecord } from '../types';

interface HistoryViewProps {
  onNavigateToScanner: () => void;
  onNavigateToAuth: () => void;
  userEmail?: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onNavigateToScanner,
  onNavigateToAuth,
  userEmail,
}) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/v1/history/me');
      if (res.status === 401 || res.status === 403) {
        setError('Your session expired. Please sign in again.');
        onNavigateToAuth();
        return;
      }
      const data = await safeJson(res);
      if (data.success && Array.isArray(data.data)) {
        setHistory(data.data);
      } else {
        setError(data.message || 'Failed to load analysis history');
      }
    } catch (err: any) {
      setError('Unable to reach server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#15263c]/08">
        <div>
          {userEmail && (
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[12px] text-[#15263c]/60 font-medium">{userEmail}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15263c] tracking-tight">
            Analysis History
          </h1>
          <p className="text-[14.5px] text-[#15263c]/75 font-normal mt-1">
            View your past resume scans, score trends, and matched keyword records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#15263c] bg-white/70 hover:bg-white border border-[#15263c]/12 px-4 py-2 rounded-full shadow-2xs backdrop-blur-md transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Refresh</span>
          </button>
          <button
            onClick={onNavigateToScanner}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#fbf9f4] bg-[#15263c] hover:bg-[#1f3757] px-4 py-2 rounded-full shadow-[0_4px_16px_rgba(21,38,60,0.18)] transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-[13px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {error.includes('expired') || error.includes('sign in') ? (
              <button
                onClick={onNavigateToAuth}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-medium rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Sign In Again
              </button>
            ) : (
              <button
                onClick={fetchHistory}
                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[12px] font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="macos-card p-12 rounded-3xl text-center space-y-3">
          <span className="material-symbols-outlined text-[32px] text-indigo-500 animate-spin">
            progress_activity
          </span>
          <p className="text-[14px] text-neutral-500 font-medium">Loading your scan history...</p>
        </div>
      )}

      {/* Error State Card */}
      {!loading && error && history.length === 0 && (
        <div className="macos-card p-12 rounded-3xl text-center space-y-4 border border-black/[0.06]">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-rose-50 text-rose-500">
            <span className="material-symbols-outlined text-[28px]">cloud_off</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#1d1d1f]">Unable to Load Scan History</h3>
            <p className="text-[13px] text-neutral-500 max-w-md mx-auto">{error}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={fetchHistory}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-black transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Retry Connection</span>
            </button>
            <button
              onClick={onNavigateToScanner}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-[#15263c]/12 text-[#15263c] text-[13px] font-medium hover:bg-neutral-50 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Scan Resume Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && history.length === 0 && (
        <div className="macos-card p-12 rounded-3xl text-center space-y-4 border border-black/[0.06]">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-neutral-100 text-neutral-400">
            <span className="material-symbols-outlined text-[28px]">history</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#1d1d1f]">No Scan History Yet</h3>
            <p className="text-[13px] text-neutral-500 max-w-md mx-auto">
              Scan your first resume against a job description. Your score results, keyword matches, and generated templates will automatically appear here.
            </p>
          </div>
          <button
            onClick={onNavigateToScanner}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-black transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>Scan Resume Now</span>
          </button>
        </div>
      )}

      {/* Table view */}
      {!loading && !error && history.length > 0 && (
        <div className="macos-card rounded-3xl border border-black/[0.06] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] bg-[#fbfbfd] text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-4">Job Title</th>
                  <th className="py-3.5 px-4">ATS Score</th>
                  <th className="py-3.5 px-4">Keywords</th>
                  <th className="py-3.5 px-4">Template</th>
                  <th className="py-3.5 px-6">Input</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-[13px]">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-black/[0.015] transition-colors">
                    {/* Date */}
                    <td className="py-4 px-6 text-neutral-600 whitespace-nowrap font-medium">
                      {formatDate(record.createdAt)}
                    </td>

                    {/* Job Title */}
                    <td className="py-4 px-4 font-semibold text-[#1d1d1f] max-w-[200px] truncate">
                      {record.jobTitle || 'Target Role'}
                    </td>

                    {/* Score */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[12px] font-semibold border ${getScoreBadgeClass(record.atsScore)}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {record.atsScore >= 80 ? 'verified' : record.atsScore >= 60 ? 'trending_up' : 'warning'}
                        </span>
                        {record.atsScore}%
                      </span>
                    </td>

                    {/* Matched / Missing counts */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          {record.matchedCount}
                        </span>
                        <span className="text-neutral-300">/</span>
                        <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                          <span className="material-symbols-outlined text-[14px]">cancel</span>
                          {record.missingCount}
                        </span>
                      </div>
                      {record.topMissingKeywords && (
                        <p className="text-[11px] text-neutral-400 truncate max-w-[220px] mt-0.5" title={record.topMissingKeywords}>
                          Missing: {record.topMissingKeywords}
                        </p>
                      )}
                    </td>

                    {/* Template */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {record.templateUsed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 text-[11px] font-medium border border-purple-200/50 capitalize">
                          <span className="material-symbols-outlined text-[13px]">style</span>
                          {record.templateUsed}
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-[12px]">—</span>
                      )}
                    </td>

                    {/* Input Type */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-black/[0.04] text-neutral-600 text-[11px] font-medium uppercase tracking-wider">
                        {record.inputType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
