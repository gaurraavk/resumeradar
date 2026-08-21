import React from 'react';
import { ResumeData } from '../types';

interface ResumesLibraryViewProps {
  resumes: ResumeData[];
  onSelectResumeForAnalysis: (resume: ResumeData) => void;
  onNewAnalysis: () => void;
}

export const ResumesLibraryView: React.FC<ResumesLibraryViewProps> = ({
  resumes,
  onSelectResumeForAnalysis,
  onNewAnalysis,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Resume Library</h1>
          <p className="text-sm text-[#4c4546] mt-1">
            Manage your baseline master resumes and role-specific variations.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          Upload New Resume
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="bg-white border border-[#cfc4c5]/60 hover:border-black rounded-xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#d8e2ff] flex items-center justify-center text-[#0058bc]">
                  <span className="material-symbols-outlined text-2xl icon-fill">description</span>
                </div>
                <span className="text-[11px] font-semibold text-[#7e7576] bg-[#f4f3f8] px-2.5 py-1 rounded-full">
                  {resume.fileSize || '1.2 MB'}
                </span>
              </div>

              <h3 className="font-bold text-black text-lg group-hover:text-[#0058bc] transition-colors">
                {resume.name}
              </h3>
              <p className="text-xs font-semibold text-[#0058bc] mt-0.5">{resume.title}</p>
              <p className="text-xs text-[#4c4546] mt-2 line-clamp-2 leading-relaxed">
                {resume.summary}
              </p>

              <div className="mt-4 pt-3 border-t border-neutral-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7576] block mb-1.5">
                  Core Skills ({resume.skills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {resume.skills.slice(0, 4).map((s, i) => (
                    <span key={i} className="text-[10px] bg-[#eeedf3] text-black px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                  {resume.skills.length > 4 && (
                    <span className="text-[10px] text-[#7e7576] px-1 py-0.5">
                      +{resume.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-[#7e7576]">Updated {resume.createdAt}</span>
              <button
                onClick={() => onSelectResumeForAnalysis(resume)}
                className="text-xs font-bold text-black group-hover:text-[#0058bc] flex items-center gap-1 cursor-pointer"
              >
                Analyze this
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
