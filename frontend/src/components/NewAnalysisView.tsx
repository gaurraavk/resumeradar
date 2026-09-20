import React, { useState, useRef } from 'react';
import { ResumeData } from '../types';

interface NewAnalysisViewProps {
  onRunAnalysis: (resume: ResumeData, jobDescription: string, jobTitle: string) => void;
  onRunFileAnalysis: (file: File, jobDescription: string, jobTitle: string) => void;
  isLoading: boolean;
}

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  onRunAnalysis,
  onRunFileAnalysis,
  isLoading,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [manualResumeText, setManualResumeText] = useState<string>('');
  const [activeResumeInputMode, setActiveResumeInputMode] = useState<'upload' | 'text'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = jobDescription.length;
  const isJdValid = charCount >= 50;
  const isResumeReady = uploadedFile !== null || resumeFile !== null || manualResumeText.trim().length >= 50;
  const isReady = isResumeReady && isJdValid;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.toLowerCase();
    const isBinary = ext.endsWith('.pdf') || ext.endsWith('.docx');

    if (isBinary) {
      setUploadedFile(file);
      setResumeFile({
        id: 'uploaded-' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        title: 'Uploaded Candidate',
        email: '',
        phone: '',
        location: '',
        summary: '',
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        createdAt: new Date().toISOString().split('T')[0],
        skills: [],
        experience: [],
        rawText: '',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      const parsedResume: ResumeData = {
        id: 'uploaded-' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        title: 'Uploaded Candidate',
        email: '',
        phone: '',
        location: '',
        summary: content.slice(0, 300),
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        createdAt: new Date().toISOString().split('T')[0],
        skills: [],
        experience: [],
        rawText: content,
      };
      setResumeFile(parsedResume);
      setUploadedFile(null);
    };
    reader.readAsText(file);
  };

  const handleResetFile = () => {
    setResumeFile(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!isReady) return;

    // If we have a binary file (.pdf/.docx), use file upload endpoint
    if (uploadedFile) {
      onRunFileAnalysis(uploadedFile, jobDescription, jobTitle || 'Target Role');
      return;
    }

    let finalResume = resumeFile;
    if (activeResumeInputMode === 'text' || !finalResume) {
      finalResume = {
        id: 'pasted-' + Date.now(),
        name: 'Candidate Resume',
        title: 'Candidate',
        email: '',
        phone: '',
        location: '',
        summary: manualResumeText.slice(0, 200),
        fileName: 'Pasted-Resume.txt',
        fileSize: `${(manualResumeText.length / 1024).toFixed(1)} KB`,
        createdAt: new Date().toISOString().split('T')[0],
        skills: [],
        experience: [],
        rawText: manualResumeText,
      };
    }

    onRunAnalysis(finalResume, jobDescription, jobTitle || 'Target Role');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-10 flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
          New Analysis
        </h1>
        <p className="text-base sm:text-lg text-neutral-500 max-w-2xl leading-relaxed font-normal">
          Upload or paste your resume and provide the target job description to generate your ATS score.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[480px]">
        {/* Left Pane: Resume Input */}
        <section className="flex-1 flex flex-col gap-5 macos-card rounded-3xl p-7 md:p-8 transition-all duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1d1d1f]">1. Resume Content</h2>
            <div className="flex items-center gap-1 bg-black/[0.03] p-1 rounded-2xl border border-black/[0.04] text-[13px]">
              <button
                type="button"
                onClick={() => setActiveResumeInputMode('upload')}
                className={`px-3.5 py-1 rounded-xl font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                  activeResumeInputMode === 'upload'
                    ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
                    : 'text-neutral-500 hover:text-[#1d1d1f]'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveResumeInputMode('text')}
                className={`px-3.5 py-1 rounded-xl font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                  activeResumeInputMode === 'text'
                    ? 'bg-white text-[#1d1d1f] shadow-xs border border-black/[0.04]'
                    : 'text-neutral-500 hover:text-[#1d1d1f]'
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {activeResumeInputMode === 'upload' ? (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.pdf,.docx,.doc"
                className="hidden"
              />

              {!resumeFile && !uploadedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-grow rounded-2xl flex flex-col items-center justify-center p-10 gap-4 bg-[#f5f5f7]/80 hover:bg-white border border-dashed border-black/[0.08] hover:border-black/[0.2] transition-all duration-300 cursor-pointer min-h-[280px]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-neutral-600 border border-black/[0.04]">
                    <span className="material-symbols-outlined text-3xl">upload_file</span>
                  </div>
                  <div className="text-center">
                    <p className="text-base text-[#1d1d1f] font-medium">Select Resume File</p>
                    <p className="text-[13px] text-neutral-400 mt-1">Supports PDF, DOCX, TXT</p>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col justify-between min-h-[280px]">
                  <div className="flex items-center p-5 bg-[#f5f5f7] rounded-2xl gap-4 border border-black/[0.04]">
                    <div className="w-11 h-11 rounded-xl bg-white shadow-2xs flex items-center justify-center text-[#1d1d1f] border border-black/[0.04]">
                      <span className="material-symbols-outlined text-2xl icon-fill">description</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-semibold text-[#1d1d1f] truncate">{resumeFile?.fileName || uploadedFile?.name}</p>
                      <p className="text-[13px] text-neutral-400">{resumeFile?.fileSize || (uploadedFile ? (uploadedFile.size / (1024 * 1024)).toFixed(2) + ' MB' : '')}</p>
                      <span className="inline-block mt-1 text-[12px] text-emerald-600 font-medium">
                        ✓ Ready for analysis
                      </span>
                    </div>
                    <button
                      onClick={handleResetFile}
                      className="text-neutral-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                      title="Remove file"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                  {resumeFile?.rawText && (
                    <div className="mt-4 p-4 rounded-xl bg-[#f5f5f7] text-[13px] text-neutral-500 border border-black/[0.04]">
                      <p className="font-medium text-[#1d1d1f] mb-1">Preview:</p>
                      <p className="line-clamp-3 font-mono text-[12px] leading-relaxed">{resumeFile.rawText.slice(0, 400)}...</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex-grow flex flex-col gap-2 min-h-[280px]">
              <textarea
                value={manualResumeText}
                onChange={(e) => setManualResumeText(e.target.value)}
                rows={12}
                placeholder="Paste the full text of your resume here..."
                className="w-full flex-grow resize-none rounded-2xl p-4 text-sm bg-[#f5f5f7] text-[#1d1d1f] placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black/[0.06] border border-black/[0.04] outline-none transition-all duration-300 leading-relaxed custom-scrollbar font-normal"
              />
              <div className="flex justify-between items-center px-1 text-[13px] text-neutral-400">
                <span>{manualResumeText.trim().length >= 50 ? '✓ Ready' : 'Minimum 50 characters required.'}</span>
                <span>{manualResumeText.length} characters</span>
              </div>
            </div>
          )}
        </section>

        {/* Right Pane: Job Description */}
        <section className="flex-1 flex flex-col gap-5 macos-card rounded-3xl p-7 md:p-8 transition-all duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1d1d1f]">2. Target Role</h2>
            <span className="text-[12px] font-medium bg-[#1d1d1f] text-white px-3 py-1 rounded-full shadow-2xs">
              Job Description
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Target Job Title (optional)"
              className="w-full rounded-2xl px-4 py-3 text-sm bg-[#f5f5f7] text-[#1d1d1f] placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black/[0.06] border border-black/[0.04] outline-none transition-all duration-300 font-normal"
            />

            <div className="flex-grow flex flex-col gap-2 relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                maxLength={5000}
                placeholder="Paste the target job description here..."
                className="w-full min-h-[220px] resize-none rounded-2xl p-4 text-sm bg-[#f5f5f7] text-[#1d1d1f] placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black/[0.06] border border-black/[0.04] outline-none transition-all duration-300 leading-relaxed custom-scrollbar font-normal"
              />

              <div className="flex justify-between items-center mt-1 px-1">
                <div className="flex items-center gap-1.5">
                  {isJdValid ? (
                    <span className="text-[13px] font-medium text-emerald-600">✓ Ready for scan</span>
                  ) : (
                    <span className="text-[13px] font-medium text-neutral-400">Minimum 50 characters required.</span>
                  )}
                </div>
                <span className="text-[13px] font-medium text-neutral-400">
                  <span className="text-[#1d1d1f]">{charCount}</span> / 5000
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Action Area */}
      <div className="flex justify-end pt-2 pb-12">
        <button
          onClick={handleSubmit}
          disabled={!isReady || isLoading}
          className={`text-[15px] font-medium py-3.5 px-10 rounded-2xl transition-all duration-300 flex items-center gap-2.5 ${
            isReady && !isLoading
              ? 'bg-[#1d1d1f] text-white cursor-pointer hover:bg-neutral-800 active:scale-[0.98] shadow-[0_2px_12px_rgba(0,0,0,0.12)]'
              : 'bg-black/[0.06] text-neutral-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Match with Java Engine...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">radar</span>
              <span>Analyze Match</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
