import React, { useState } from 'react';
import { ResumeData } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  score: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  resume,
  score,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const markdown = `# ${resume.name}
**${resume.title}** | ${resume.location}  
${resume.email} | ${resume.phone}

---

### Professional Summary
${resume.summary}

---

### Experience
${resume.experience
  ?.map(
    (exp) => `#### ${exp.role} — ${exp.company} (${exp.period})
${exp.bullets.map((b) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

---

### Skills
${resume.skills.join(', ')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.name.replace(/\s+/g, '_')}_Optimized_Resume.md`;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleDownloadText = () => {
    const text = `${resume.name.toUpperCase()}
${resume.title} - ${resume.location}
Contact: ${resume.email} | ${resume.phone}

SUMMARY:
${resume.summary}

EXPERIENCE:
${resume.experience
  ?.map(
    (exp) => `${exp.role.toUpperCase()}
${exp.company} | ${exp.period}
${exp.bullets.map((b) => `* ${b}`).join('\n')}`
  )
  .join('\n\n')}

SKILLS:
${resume.skills.join(', ')}
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.name.replace(/\s+/g, '_')}_ATS_Optimized.txt`;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black text-2xl">download</span>
            <h3 className="font-bold text-lg text-black">Export Optimized Resume</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black p-1 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-[#4c4546]">
            Select your preferred export format. All formats are generated with standard ATS typography and parsing hierarchy.
          </p>

          <div className="space-y-2.5 pt-2">
            {/* Print / PDF Option */}
            <div
              onClick={handlePrintPDF}
              className="flex items-center justify-between p-3.5 rounded-xl border border-[#cfc4c5]/80 hover:border-black bg-[#faf9fe] hover:bg-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-black group-hover:text-[#0058bc] transition-colors">
                    Standard PDF (Print to PDF)
                  </p>
                  <p className="text-[11px] text-[#4c4546]">
                    Clean single-page ATS layout with standard margins
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-black text-lg">arrow_forward</span>
            </div>

            {/* Markdown Export */}
            <div
              onClick={handleDownloadMarkdown}
              className="flex items-center justify-between p-3.5 rounded-xl border border-[#cfc4c5]/80 hover:border-black bg-[#faf9fe] hover:bg-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0058bc] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">code</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-black group-hover:text-[#0058bc] transition-colors">
                    Markdown (.md)
                  </p>
                  <p className="text-[11px] text-[#4c4546]">Ideal for developer portfolios and GitHub readmes</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-black text-lg">download</span>
            </div>

            {/* Plain Text Export */}
            <div
              onClick={handleDownloadText}
              className="flex items-center justify-between p-3.5 rounded-xl border border-[#cfc4c5]/80 hover:border-black bg-[#faf9fe] hover:bg-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#eeedf3] text-black flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">text_fields</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-black group-hover:text-[#0058bc] transition-colors">
                    Plain Text (.txt)
                  </p>
                  <p className="text-[11px] text-[#4c4546]">100% universal copy-paste for enterprise text boxes</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-black text-lg">download</span>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 bg-green-50 text-green-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Resume downloaded successfully!
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#4c4546] hover:text-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
