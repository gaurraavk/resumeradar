import React, { useState } from 'react';
import { LinkedInProfile, LinkedInJobMatch, ResumeData, InAppNotification } from '../types';

interface LinkedInRadarViewProps {
  linkedInProfile: LinkedInProfile | null;
  jobMatches: LinkedInJobMatch[];
  activeResume: ResumeData | null;
  notifications: InAppNotification[];
  onOpenLinkedInModal: () => void;
  onOptimizeForJob: (job: LinkedInJobMatch) => void;
  onImportProfileAsResume: (profile: LinkedInProfile) => void;
  onTriggerInstantMatchScan: () => void;
  onMarkNotificationRead: (id: string) => void;
}

export const LinkedInRadarView: React.FC<LinkedInRadarViewProps> = ({
  linkedInProfile,
  jobMatches,
  notifications,
  onOpenLinkedInModal,
  onOptimizeForJob,
  onImportProfileAsResume,
  onTriggerInstantMatchScan,
  onMarkNotificationRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'top_fits' | 'remote'>('all');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);

  const filteredJobs = jobMatches.filter((job) => {
    if (filter === 'top_fits') return job.matchScore >= 90;
    if (filter === 'remote') return job.location.toLowerCase().includes('remote');
    return true;
  });

  const handleScanClick = () => {
    setIsScanning(true);
    setTimeout(() => {
      onTriggerInstantMatchScan();
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header & LinkedIn Connection Status */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#cfc4c5]/60 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0a66c2] text-xs font-bold">
            <span className="font-black">in</span>
            <span>LinkedIn Job Radar</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight">
            Automated Job Match Radar
          </h1>
          <p className="text-xs md:text-sm text-[#4c4546] leading-relaxed">
            See how your resume scores against real tech job postings and optimize for a 90%+ ATS match in one click.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleScanClick}
            disabled={isScanning}
            className="flex items-center gap-2 bg-[#faf9fe] hover:bg-neutral-100 border border-[#cfc4c5] text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] text-[#0a66c2] ${isScanning ? 'animate-spin' : ''}`}>
              radar
            </span>
            <span>{isScanning ? 'Scanning Live Jobs...' : 'Check Matches'}</span>
          </button>

          <button
            onClick={onOpenLinkedInModal}
            className="flex items-center gap-2 bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              {linkedInProfile ? 'sync' : 'link'}
            </span>
            <span>{linkedInProfile ? 'Re-sync Profile' : 'Connect LinkedIn'}</span>
          </button>
        </div>
      </div>

      {/* 2. Simple 3-Step Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-2xs flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0a66c2] font-black flex items-center justify-center text-sm shrink-0">
            1
          </div>
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">Sync Profile</h3>
            <p className="text-xs text-[#4c4546] mt-0.5">
              Import verified skills & experience directly from LinkedIn.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-2xs flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-black flex items-center justify-center text-sm shrink-0">
            2
          </div>
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">Radar Scores Jobs</h3>
            <p className="text-xs text-[#4c4546] mt-0.5">
              Identifies matched skills and highlights keywords missing from your resume.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-2xs flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-black flex items-center justify-center text-sm shrink-0">
            3
          </div>
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">1-Click Optimize</h3>
            <p className="text-xs text-[#4c4546] mt-0.5">
              Auto-tailor bullet points to beat ATS filters for any target job.
            </p>
          </div>
        </div>
      </div>

      {/* 3. LinkedIn Account Bar (If Connected) */}
      {linkedInProfile && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cfc4c5]/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={
                linkedInProfile.profilePicture ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
              }
              alt={linkedInProfile.fullName}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#0a66c2]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-black">{linkedInProfile.fullName}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Connected
                </span>
              </div>
              <p className="text-xs text-[#4c4546] truncate max-w-md">{linkedInProfile.headline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onImportProfileAsResume(linkedInProfile)}
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>Use as Active Resume</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Live Matched Jobs List */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#cfc4c5]/60 shadow-xs space-y-6">
        {/* Filter & Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0a66c2]">radar</span>
              <span>Top Job Matches for Your Resume</span>
            </h2>
            <p className="text-xs text-[#4c4546]">
              Real-time match scores calculated against your active resume.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-black text-white shadow-2xs' : 'bg-[#faf9fe] text-[#4c4546] hover:text-black border border-[#cfc4c5]/60'
              }`}
            >
              All Matches ({jobMatches.length})
            </button>
            <button
              onClick={() => setFilter('top_fits')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'top_fits' ? 'bg-black text-white shadow-2xs' : 'bg-[#faf9fe] text-[#4c4546] hover:text-black border border-[#cfc4c5]/60'
              }`}
            >
              Top Matches (&ge;90%)
            </button>
            <button
              onClick={() => setFilter('remote')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'remote' ? 'bg-black text-white shadow-2xs' : 'bg-[#faf9fe] text-[#4c4546] hover:text-black border border-[#cfc4c5]/60'
              }`}
            >
              Remote
            </button>
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const isHighFit = job.matchScore >= 90;
            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-[#faf9fe] border border-[#cfc4c5]/60 hover:border-black/50 transition-all shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Job Title & Match Score Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-11 h-11 rounded-xl object-cover border border-[#cfc4c5]/50 bg-white p-0.5 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-black leading-tight">{job.jobTitle}</h3>
                        <span className="text-xs font-semibold text-[#0a66c2] block">{job.company}</span>
                        <span className="text-[11px] text-[#7e7576]">
                          {job.location} • {job.salary}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black font-mono ${
                          isHighFit
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isHighFit ? 'local_fire_department' : 'bolt'}
                        </span>
                        <span>{job.matchScore}% Match</span>
                      </div>
                      <span className="block text-[10px] font-semibold text-[#7e7576] mt-0.5">
                        {job.atsTier}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#4c4546] line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Clear Keywords Section */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        Matched:
                      </span>
                      {job.matchedKeywords.slice(0, 4).map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-semibold"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    {job.missingKeywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                          Missing:
                        </span>
                        {job.missingKeywords.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-semibold"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#7e7576]">
                    {job.postedDate} • {job.applicantCount} applicants
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white border border-[#cfc4c5] hover:bg-neutral-50 text-black text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>LinkedIn</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>

                    <button
                      onClick={() => onOptimizeForJob(job)}
                      className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px] text-amber-400">auto_awesome</span>
                      <span>Optimize Resume</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Simple Alert Preferences & Notifications Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#cfc4c5]/60 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0a66c2] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Automatic Match Alerts
            </h3>
            <p className="text-xs text-[#4c4546]">
              Get notified immediately in the header whenever a new job matches your resume with 85%+ score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center gap-2 text-xs font-semibold text-black cursor-pointer">
            <input
              type="checkbox"
              checked={alertsEnabled}
              onChange={(e) => setAlertsEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#0a66c2] cursor-pointer"
            />
            <span>Alerts Enabled</span>
          </label>
        </div>
      </div>
    </div>
  );
};
