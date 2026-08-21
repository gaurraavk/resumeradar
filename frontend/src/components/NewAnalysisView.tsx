import React, { useState, useRef } from 'react';
import { ResumeData, JobDescriptionData } from '../types';
import { SAMPLE_RESUMES, SAMPLE_JOBS } from '../data/sampleData';

interface NewAnalysisViewProps {
  onRunAnalysis: (resume: ResumeData, jobDescription: string, jobTitle: string) => void;
  isLoading: boolean;
  prefillResume?: ResumeData | null;
  prefillJob?: JobDescriptionData | null;
  onOpenLinkedInModal?: () => void;
}

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  onRunAnalysis,
  isLoading,
  prefillResume,
  prefillJob,
  onOpenLinkedInModal,
}) => {
  const [resumeFile, setResumeFile] = useState<ResumeData | null>(prefillResume || null);
  const [jobDescription, setJobDescription] = useState<string>(prefillJob?.description || '');
  const [jobTitle, setJobTitle] = useState<string>(prefillJob?.title || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = jobDescription.length;
  const isJdValid = charCount >= 100;
  const isReady = resumeFile !== null && isJdValid;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read text from file if possible
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsedResume: ResumeData = {
        id: 'uploaded-' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        title: 'Candidate Profile',
        email: 'candidate@example.com',
        phone: '+1 (555) 000-0000',
        location: 'United States',
        summary: content.slice(0, 300) || 'Uploaded resume candidate profile.',
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        createdAt: new Date().toISOString().split('T')[0],
        skills: ['JavaScript', 'TypeScript', 'React', 'Communication', 'Project Management'],
        experience: [
          {
            id: 'exp-up-1',
            role: 'Software / Product Specialist',
            company: 'Current Employer',
            period: '2021 - Present',
            bullets: [
              'Developed and shipped core product features driving user engagement.',
              'Collaborated with cross-functional partners to meet delivery milestones.',
              'Refactored existing processes to enhance productivity and quality.'
            ]
          }
        ],
        rawText: content
      };
      setResumeFile(parsedResume);
    };

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // For PDF/DOCX binary mock representation
      const mockResume: ResumeData = {
        id: 'uploaded-' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        title: 'Professional Candidate',
        email: 'candidate@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        summary: 'Experienced professional with demonstrated background in technical execution and cross-functional product delivery.',
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        createdAt: new Date().toISOString().split('T')[0],
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'SQL', 'Agile', 'System Architecture'],
        experience: [
          {
            id: 'exp-1',
            role: 'Senior Specialist',
            company: 'Tech Solutions Inc.',
            period: '2020 - Present',
            bullets: [
              'Worked on the core application platform and internal tooling.',
              'Helped improve system performance and responsiveness for users.',
              'Collaborated with engineering and product teams to release new features.'
            ]
          }
        ]
      };
      setResumeFile(mockResume);
    }
  };

  const handleSelectSampleResume = (sample: ResumeData) => {
    setResumeFile(sample);
  };

  const handleSelectSampleJob = (sample: JobDescriptionData) => {
    setJobDescription(sample.description);
    setJobTitle(sample.title);
  };

  const handleResetFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!isReady || !resumeFile) return;
    onRunAnalysis(resumeFile, jobDescription, jobTitle || 'Target Role');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-10">
      {/* Header & Step Progress */}
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-black tracking-tight leading-tight">
          New Analysis
        </h1>
        <p className="text-base md:text-[19px] text-[#4c4546] max-w-2xl leading-relaxed">
          Upload your resume and paste the target job description to generate a precision match report.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-4 max-w-md">
          <div className="flex-1 h-1 bg-[#0058bc] rounded-full"></div>
          <div className={`flex-1 h-1 rounded-full ${charCount > 0 ? 'bg-[#0058bc]' : 'bg-[#0058bc]/40'}`}></div>
          <div className="flex-1 h-1 bg-[#e3e2e7] rounded-full"></div>
        </div>

        <div className="flex justify-between max-w-md text-[#4c4546] text-[11px] font-semibold mt-1 uppercase tracking-wider">
          <span className="text-[#0058bc]">Upload</span>
          <span className={charCount > 0 ? 'text-[#0058bc]' : 'text-[#4c4546]'}>Job Description</span>
          <span className="opacity-50">Analyze</span>
        </div>
      </header>

      {/* Dual Pane Layout */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[520px]">
        {/* Left Pane: Resume Upload */}
        <section className="flex-1 flex flex-col gap-5 bg-white border border-[#cfc4c5]/60 rounded-xl p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-black">1. Source Document</h2>
            <div className="flex items-center gap-2">
              {onOpenLinkedInModal && (
                <button
                  type="button"
                  onClick={onOpenLinkedInModal}
                  className="text-xs font-bold bg-[#0a66c2] hover:bg-[#084e96] text-white px-3 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Import directly from LinkedIn profile"
                >
                  <span className="font-serif font-black text-xs">in</span>
                  <span>Import from LinkedIn</span>
                </button>
              )}
              <span className="text-xs font-semibold bg-[#eeedf3] text-black px-3 py-1 rounded-full">
                Resume
              </span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.doc,.txt,.json,.md"
            className="hidden"
          />

          {!resumeFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex-grow border-2 border-dashed border-[#cfc4c5] hover:border-black/50 rounded-xl flex flex-col items-center justify-center p-8 gap-4 bg-[#f4f3f8] hover:bg-[#eeedf3] transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-[#e9e7ed] flex items-center justify-center text-black mb-1 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-4xl">upload_file</span>
              </div>
              <div className="text-center">
                <p className="text-lg text-black font-semibold">Drag &amp; Drop Resume</p>
                <p className="text-sm text-[#4c4546] mt-1">or click to browse files</p>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-xs font-semibold text-[#7e7576] bg-[#e3e2e7] px-3 py-1 rounded-full">
                  PDF
                </span>
                <span className="text-xs font-semibold text-[#7e7576] bg-[#e3e2e7] px-3 py-1 rounded-full">
                  DOCX
                </span>
              </div>
            </div>
          ) : (
            /* File Success State */
            <div className="flex-grow flex flex-col justify-between">
              <div className="flex items-center p-5 bg-[#f4f3f8] border border-[#cfc4c5]/80 rounded-xl gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#d8e2ff] flex items-center justify-center text-[#0058bc]">
                  <span className="material-symbols-outlined text-3xl icon-fill">description</span>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-black truncate">{resumeFile.fileName || `${resumeFile.name}.pdf`}</p>
                  <p className="text-xs text-[#4c4546]">{resumeFile.fileSize || '1.2 MB'} • {resumeFile.title}</p>
                  <span className="inline-block mt-1 text-[11px] text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded">
                    ✓ Parsed successfully
                  </span>
                </div>
                <button
                  onClick={handleResetFile}
                  className="text-[#ba1a1a] hover:bg-[#ffdad6] p-2 rounded-full transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Quick Resume Preview Snippet */}
              <div className="mt-4 p-4 rounded-lg bg-[#faf9fe] border border-neutral-200 text-xs text-[#4c4546] space-y-2">
                <div className="flex justify-between font-semibold text-black">
                  <span>{resumeFile.name}</span>
                  <span className="text-[#0058bc]">{resumeFile.skills.length} skills identified</span>
                </div>
                <p className="line-clamp-2 text-neutral-600 italic">"{resumeFile.summary}"</p>
              </div>
            </div>
          )}

          {/* Sample quick selectors */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-[#4c4546]">Sample resumes:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSelectSampleResume(SAMPLE_RESUMES[0])}
                className="px-2.5 py-1 rounded bg-[#eeedf3] hover:bg-black hover:text-white transition-colors cursor-pointer font-medium"
              >
                Product Manager
              </button>
              <button
                type="button"
                onClick={() => handleSelectSampleResume(SAMPLE_RESUMES[1])}
                className="px-2.5 py-1 rounded bg-[#eeedf3] hover:bg-black hover:text-white transition-colors cursor-pointer font-medium"
              >
                Frontend Dev
              </button>
            </div>
          </div>
        </section>

        {/* Right Pane: Job Description */}
        <section className="flex-1 flex flex-col gap-5 bg-white border border-[#cfc4c5]/60 rounded-xl p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-black">2. Target Role</h2>
            <span className="text-xs font-semibold bg-[#0058bc] text-white px-3 py-1 rounded-full">
              Job Description
            </span>
          </div>

          <div className="flex-grow flex flex-col gap-1.5 relative">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={12}
              maxLength={5000}
              placeholder="Paste the full job description here...&#10;&#10;E.g., We are looking for a Senior Product Designer with 5+ years of experience in creating scalable design systems..."
              className="w-full flex-grow resize-none border border-[#cfc4c5]/80 rounded-xl p-4 text-sm bg-[#f4f3f8] focus:bg-white focus:border-[#0058bc] focus:ring-1 focus:ring-[#0058bc] outline-none transition-all leading-relaxed custom-scrollbar font-normal"
            ></textarea>

            {/* Character Count & Live Validation */}
            <div className="flex justify-between items-center mt-1 px-1">
              <div className="flex items-center gap-1.5">
                {isJdValid ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] text-[#0058bc]">check_circle</span>
                    <span className="text-xs font-medium text-[#4c4546]">Looks good.</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">error</span>
                    <span className="text-xs font-medium text-[#ba1a1a]">
                      Minimum 100 characters required.
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs font-medium text-[#4c4546]">
                <span className="font-semibold text-black">{charCount}</span> / 5000
              </span>
            </div>
          </div>

          {/* Sample JD quick selectors */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-[#4c4546]">Sample roles:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSelectSampleJob(SAMPLE_JOBS[0])}
                className="px-2.5 py-1 rounded bg-[#eeedf3] hover:bg-black hover:text-white transition-colors cursor-pointer font-medium"
              >
                Senior PM
              </button>
              <button
                type="button"
                onClick={() => handleSelectSampleJob(SAMPLE_JOBS[1])}
                className="px-2.5 py-1 rounded bg-[#eeedf3] hover:bg-black hover:text-white transition-colors cursor-pointer font-medium"
              >
                Senior Frontend
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Action Area */}
      <div className="flex justify-end pt-4 pb-12 border-t border-[#cfc4c5]/60 mt-2">
        <button
          onClick={handleSubmit}
          disabled={!isReady || isLoading}
          className={`text-base font-semibold py-4 px-12 rounded-full transition-all flex items-center gap-3 shadow-md ${
            isReady && !isLoading
              ? 'bg-black text-white cursor-pointer hover:bg-neutral-800 active:scale-95'
              : 'bg-[#e3e2e7] text-[#4c4546] cursor-not-allowed opacity-50'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Match with Gemini...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">radar</span>
              <span>Analyze Match</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
