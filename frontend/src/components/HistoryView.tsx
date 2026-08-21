import React, { useState } from 'react';
import { AnalysisHistoryItem } from '../types';

interface HistoryViewProps {
  history: AnalysisHistoryItem[];
  onOpenAnalysis: (item: AnalysisHistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onNewAnalysis: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onOpenAnalysis,
  onDeleteHistoryItem,
  onNewAnalysis,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'Optimized' | 'Analyzed'>('all');

  const filtered = history.filter((item) => {
    const matchSearch =
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filter === 'all' || item.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Analysis History</h1>
          <p className="text-sm text-[#4c4546] mt-1">
            Access past ATS scores, optimization reports, and exported versions.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Analysis
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-xl border border-[#cfc4c5]/60">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#7e7576] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by job or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f4f3f8] rounded-lg border border-transparent focus:border-black focus:bg-white outline-none"
          />
        </div>

        <div className="flex gap-1.5 w-full sm:w-auto">
          {(['all', 'Optimized', 'Analyzed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-black text-white'
                  : 'bg-[#f4f3f8] text-[#4c4546] hover:bg-[#e9e7ed]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#cfc4c5]/60 rounded-xl p-12 text-center text-[#4c4546]">
          <span className="material-symbols-outlined text-4xl text-[#7e7576] mb-2">folder_open</span>
          <p className="font-semibold text-black">No analyses found</p>
          <p className="text-xs mt-1">Start a new analysis to see your optimization records here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#cfc4c5]/60 hover:border-black/50 rounded-xl p-5 transition-all shadow-2xs hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#eeedf3] flex items-center justify-center text-black group-hover:scale-105 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-2xl icon-fill">
                    {item.status === 'Optimized' ? 'auto_awesome' : 'radar'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-black text-base group-hover:text-[#0058bc] transition-colors">
                    {item.jobTitle}
                  </h3>
                  <p className="text-xs text-[#4c4546] mt-0.5">
                    {item.company} • {item.resumeFileName} • {item.date}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Optimized'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right score indicator & actions */}
              <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#7e7576] block">ATS Score</span>
                  <div className="flex items-center gap-1 font-extrabold text-sm text-black">
                    <span>{item.initialScore}</span>
                    {item.finalScore && (
                      <>
                        <span className="material-symbols-outlined text-[14px] text-green-700">
                          trending_up
                        </span>
                        <span className="text-green-700 font-black">{item.finalScore}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAnalysis(item)}
                    className="bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="text-[#7e7576] hover:text-[#ba1a1a] p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
