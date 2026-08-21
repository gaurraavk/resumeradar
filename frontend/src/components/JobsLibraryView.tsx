import React from 'react';
import { JobDescriptionData } from '../types';

interface JobsLibraryViewProps {
  jobs: JobDescriptionData[];
  onSelectJobForAnalysis: (job: JobDescriptionData) => void;
  onNewAnalysis: () => void;
}

export const JobsLibraryView: React.FC<JobsLibraryViewProps> = ({
  jobs,
  onSelectJobForAnalysis,
  onNewAnalysis,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Target Jobs Library</h1>
          <p className="text-sm text-[#4c4546] mt-1">
            Saved job postings and key ATS requirements for matching.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Target Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-[#cfc4c5]/60 hover:border-black rounded-xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#eeedf3] flex items-center justify-center text-black">
                  <span className="material-symbols-outlined text-2xl icon-fill">work</span>
                </div>
                <span className="text-[11px] font-semibold text-[#0058bc] bg-[#d8e2ff] px-2.5 py-1 rounded-full">
                  Target Role
                </span>
              </div>

              <h3 className="font-bold text-black text-lg group-hover:text-[#0058bc] transition-colors">
                {job.title}
              </h3>
              <p className="text-xs text-[#7e7576] font-medium mt-0.5">
                {job.company} • {job.location}
              </p>
              <p className="text-xs text-[#4c4546] mt-3 line-clamp-3 leading-relaxed">
                {job.description}
              </p>

              {job.extractedKeywords && (
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7576] block mb-1.5">
                    Target Keywords ({job.extractedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {job.extractedKeywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="text-[10px] bg-[#eeedf3] text-black px-2 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                    {job.extractedKeywords.length > 3 && (
                      <span className="text-[10px] text-[#7e7576] px-1 py-0.5">
                        +{job.extractedKeywords.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-[#7e7576]">Saved {job.createdAt}</span>
              <button
                onClick={() => onSelectJobForAnalysis(job)}
                className="text-xs font-bold text-black group-hover:text-[#0058bc] flex items-center gap-1 cursor-pointer"
              >
                Match with Resume
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
