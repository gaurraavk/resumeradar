import React, { useState, useRef } from 'react';
import { ResumeData } from '../types';

interface NewAnalysisViewProps {
  onRunAnalysis: (resume: ResumeData, jobDescription: string, jobTitle: string) => void;
  isLoading: boolean;
}

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  onRunAnalysis,
  isLoading,
}) => {
  const [resumeFile, setResumeFile] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [manualResumeText, setManualResumeText] = useState<string>('');
  const [activeResumeInputMode, setActiveResumeInputMode] = useState<'upload' | 'text'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = jobDescription.length;
  const isJdValid = charCount >= 50;
  const isResumeReady = resumeFile !== null || manualResumeText.trim().length >= 50;
  const isReady = isResumeReady && isJdValid;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    };

    reader.readAsText(file);
  };

  const handleResetFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!isReady) return;

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
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-10">
      {/* Header & Step Progress */}
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-black tracking-tight leading-tight">
          New Analysis
        </h1>
        <p className="text-base md:text-[19px] text-[#4c4546] max-w-2xl leading-relaxed">
          Upload or paste your resume and provide the target job description to generate your ATS score and AI critique.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-4 max-w-md">
          <div className="flex-1 h-1 bg-[#0058bc] rounded-full"></div>
          <div className={`flex-1 h-1 rounded-full ${charCount > 0 ? 'bg-[#0058bc]' : 'bg-[#0058bc]/40'}`}></div>
          <div className="flex-1 h-1 bg-[#e3e2e7] rounded-full"></div>
        </div>

        <div className="flex justify-between max-w-md text-[#4c4546] text-[11px] font-semibold mt-1 uppercase tracking-wider">
          <span className="text-[#0058bc]">Resume</span>
          <span className={charCount > 0 ? 'text-[#0058bc]' : 'text-[#4c4546]'}>Job Description</span>
          <span className="opacity-50">Results</span>
        </div>
      </header>

      {/* Dual Pane Layout */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[520px]">
        {/* Left Pane: Resume Input */}
        <section className="flex-1 flex flex-col gap-5 bg-white border border-[#cfc4c5]/60 rounded-xl p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-black">1. Resume Content</h2>
            <div className="flex items-center gap-2 bg-[#f4f3f8] p-1 rounded-lg border border-[#cfc4c5]/40 text-xs">
              <button
                type="button"
                onClick={() => setActiveResumeInputMode('upload')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  activeResumeInputMode === 'upload' ? 'bg-black text-white' : 'text-[#4c4546] hover:text-black'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveResumeInputMode('text')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  activeResumeInputMode === 'text' ? 'bg-black text-white' : 'text-[#4c4546] hover:text-black'
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
                accept=".txt,.md,.pdf,.docx,.doc,.json"
                className="hidden"
              />

              {!resumeFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-grow border-2 border-dashed border-[#cfc4c5] hover:border-black/50 rounded-xl flex flex-col items-center justify-center p-8 gap-4 bg-[#f4f3f8] hover:bg-[#eeedf3] transition-all cursor-pointer group min-h-[280px]"
                >
                  <div className="w-16 h-16 rounded-full bg-[#e9e7ed] flex items-center justify-center text-black mb-1 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-4xl">upload_file</span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg text-black font-semibold">Select Resume File</p>
                    <p className="text-sm text-[#4c4546] mt-1">Supports TXT, MD, PDF, DOCX</p>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col justify-between min-h-[280px]">
                  <div className="flex items-center p-5 bg-[#f4f3f8] border border-[#cfc4c5]/80 rounded-xl gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#d8e2ff] flex items-center justify-center text-[#0058bc]">
                      <span className="material-symbols-outlined text-3xl icon-fill">description</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-black truncate">{resumeFile.fileName}</p>
                      <p className="text-xs text-[#4c4546]">{resumeFile.fileSize}</p>
                      <span className="inline-block mt-1 text-[11px] text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded">
                        ✓ Ready for analysis
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
                  {resumeFile.rawText && (
                    <div className="mt-4 p-4 rounded-lg bg-[#faf9fe] border border-neutral-200 text-xs text-[#4c4546] space-y-1">
                      <p className="font-semibold text-black">Preview:</p>
                      <p className="line-clamp-4 text-neutral-600 font-mono text-[11px]">{resumeFile.rawText.slice(0, 400)}...</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex-grow flex flex-col gap-1.5 min-h-[280px]">
              <textarea
                value={manualResumeText}
                onChange={(e) => setManualResumeText(e.target.value)}
                rows={12}
                placeholder="Paste the full text of your resume here..."
                className="w-full flex-grow resize-none border border-[#cfc4c5]/80 rounded-xl p-4 text-sm bg-[#f4f3f8] focus:bg-white focus:border-[#0058bc] focus:ring-1 focus:ring-[#0058bc] outline-none transition-all leading-relaxed custom-scrollbar font-normal"
              />
              <div className="flex justify-between items-center px-1 text-xs text-[#4c4546]">
                <span>{manualResumeText.trim().length >= 50 ? '✓ Ready' : 'Minimum 50 characters required.'}</span>
                <span>{manualResumeText.length} characters</span>
              </div>
            </div>
          )}
        </section>

        {/* Right Pane: Job Description */}
        <section className="flex-1 flex flex-col gap-5 bg-white border border-[#cfc4c5]/60 rounded-xl p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-black">2. Target Role</h2>
            <span className="text-xs font-semibold bg-[#0058bc] text-white px-3 py-1 rounded-full">
              Job Description
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Target Job Title (optional, e.g. Senior Backend Engineer)"
              className="w-full border border-[#cfc4c5]/80 rounded-lg p-3 text-sm bg-[#f4f3f8] focus:bg-white focus:border-[#0058bc] outline-none transition-all"
            />

            <div className="flex-grow flex flex-col gap-1.5 relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                maxLength={5000}
                placeholder="Paste the target job description here..."
                className="w-full min-h-[220px] resize-none border border-[#cfc4c5]/80 rounded-xl p-4 text-sm bg-[#f4f3f8] focus:bg-white focus:border-[#0058bc] focus:ring-1 focus:ring-[#0058bc] outline-none transition-all leading-relaxed custom-scrollbar font-normal"
              />

              <div className="flex justify-between items-center mt-1 px-1">
                <div className="flex items-center gap-1.5">
                  {isJdValid ? (
                    <span className="text-xs font-medium text-green-700">✓ Ready for scan</span>
                  ) : (
                    <span className="text-xs font-medium text-[#ba1a1a]">Minimum 50 characters required.</span>
                  )}
                </div>
                <span className="text-xs font-medium text-[#4c4546]">
                  <span className="font-semibold text-black">{charCount}</span> / 5000
                </span>
              </div>
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
              <span>Analyzing Match with Java Engine &amp; Gemini...</span>
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
