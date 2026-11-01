import React, { useState, useRef } from 'react';
import { ResumeData } from '../types';
import { GlassCard } from './ui/GlassCard';
import { GlassBadge } from './ui/GlassBadge';
import { GlassButton } from './ui/GlassButton';
import { DotMatrix } from './ui/DotMatrix';

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
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = jobDescription.length;
  const isJdValid = charCount >= 50;
  const isResumeReady = uploadedFile !== null || resumeFile !== null || manualResumeText.trim().length >= 50;
  const isReady = isResumeReady && isJdValid;

  const handleProcessFile = (file: File) => {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleResetFile = () => {
    setResumeFile(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!isReady || isLoading) return;

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
    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-10 flex flex-col gap-8 animate-entrance">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-[#15263c]/08">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15263c] tracking-tight">
            ATS Match & Optimization Scan
          </h1>
          <p className="text-[14.5px] text-[#15263c]/75 mt-1.5 font-normal max-w-2xl leading-relaxed">
            Supply your resume and target job requirements to generate deterministic keyword alignment, formatting audit, and auto-fixed documents.
          </p>
        </div>

        <GlassBadge variant="cyan" size="md" icon="verified">
          Deterministic Java Engine
        </GlassBadge>
      </div>

      {/* Main 2-Column Workbench with perfectly matched box heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* LEFT COLUMN: Resume Input */}
        <GlassCard className="flex flex-col h-full justify-between gap-6" dotMatrix={false}>
          <div className="flex items-center justify-between pb-3 border-b border-[#15263c]/08">
            <h2 className="text-lg font-bold text-[#15263c]">Your Resume</h2>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-full border border-black/[0.04]">
              <button
                type="button"
                onClick={() => setActiveResumeInputMode('upload')}
                className={`text-[12px] font-medium px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeResumeInputMode === 'upload'
                    ? 'bg-[#15263c] text-[#fbf9f4] shadow-xs'
                    : 'text-[#15263c]/70 hover:text-[#15263c]'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveResumeInputMode('text')}
                className={`text-[12px] font-medium px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeResumeInputMode === 'text'
                    ? 'bg-[#15263c] text-[#fbf9f4] shadow-xs'
                    : 'text-[#15263c]/70 hover:text-[#15263c]'
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {activeResumeInputMode === 'upload' ? (
              <div className="flex-1 flex flex-col justify-center">
                {uploadedFile || resumeFile ? (
                  /* Selected File Card */
                  <div className="p-6 rounded-2xl bg-white/70 border border-[#15263c]/12 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[24px]">description</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[14px] font-bold text-[#15263c] truncate block">
                          {uploadedFile?.name || resumeFile?.fileName}
                        </span>
                        <span className="font-mono text-[11px] text-[#15263c]/60 mt-0.5 block">
                          {uploadedFile
                            ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`
                            : resumeFile?.fileSize} · READY FOR ATS AUDIT
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetFile}
                      className="p-2 rounded-xl text-[#15263c]/60 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                ) : (
                  /* Drag & Drop Upload Zone */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3.5 flex-1 min-h-[350px] ${
                      isDragOver
                        ? 'border-[#15d6e6] bg-[#15d6e6]/10 scale-[1.01]'
                        : 'border-[#15263c]/15 hover:border-[#15263c]/35 bg-white/35 hover:bg-white/55'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".docx,.pdf,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-white/70 text-[#15263c] flex items-center justify-center shadow-xs border border-[#15263c]/10">
                      <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                    </div>
                    <div>
                      <strong className="text-[15px] font-bold text-[#15263c] block">
                        Click to browse or drag & drop your resume
                      </strong>
                      <span className="text-[13px] text-[#15263c]/60 block mt-1">
                        Supports Word (.docx), PDF (.pdf), and Plain Text (.txt) up to 10 MB
                      </span>
                    </div>
                    <GlassBadge variant="neutral" size="sm">
                      In-Memory Parse · Zero File Storage
                    </GlassBadge>
                  </div>
                )}
              </div>
            ) : (
              /* Paste Text Mode */
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[12.5px] font-semibold text-[#15263c]/80 block">
                  Paste Resume Text Content
                </label>
                <textarea
                  value={manualResumeText}
                  onChange={(e) => setManualResumeText(e.target.value)}
                  placeholder="Paste the full text of your resume here (experience, skills, summary, education)..."
                  className="w-full flex-1 min-h-[310px] glass-input rounded-2xl p-4 text-[13.5px] leading-relaxed custom-scrollbar resize-none"
                />
                <div className="flex justify-between items-center text-[11.5px] font-mono text-[#15263c]/60 px-1">
                  <span>{manualResumeText.length} CHARACTERS</span>
                  <span>{manualResumeText.length >= 50 ? '✓ READY' : 'MIN 50 CHARS'}</span>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* RIGHT COLUMN: Target Job Description */}
        <GlassCard className="flex flex-col h-full justify-between gap-6" dotMatrix={false}>
          <div className="flex items-center justify-between pb-3 border-b border-[#15263c]/08">
            <h2 className="text-lg font-bold text-[#15263c]">Target Job Description</h2>

            <span className="font-mono text-[11px] text-[#15263c]/60">
              {charCount} / 5000
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="text-[12.5px] font-semibold text-[#15263c]/80 block mb-1.5">
                Target Role / Job Title (Optional)
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full glass-input rounded-2xl px-4 py-3 text-[13.5px]"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-[12.5px] font-semibold text-[#15263c]/80 block mb-1.5">
                Job Requirements & Responsibilities
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
                placeholder="Paste the job description, required skills, preferred qualifications, and responsibilities..."
                className="w-full flex-1 min-h-[220px] glass-input rounded-2xl p-4 text-[13.5px] leading-relaxed custom-scrollbar resize-none"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              {isJdValid ? (
                <span className="text-[12px] font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  Job description ready for analysis
                </span>
              ) : (
                <span className="text-[12px] text-[#15263c]/50 font-mono">
                  Minimum 50 characters required ({charCount}/50)
                </span>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Action Submit Area: Just clean Analyze Match button without full banner box */}
      <div className="flex justify-end pt-2 pb-8">
        <GlassButton
          onClick={handleSubmit}
          disabled={!isReady || isLoading}
          loading={isLoading}
          size="lg"
          variant="primary"
          icon="radar"
          className="w-full sm:w-auto min-w-[200px]"
        >
          {isLoading ? 'Analyzing Match...' : 'Analyze Match'}
        </GlassButton>
      </div>
    </div>
  );
};
