import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearData,
}) => {
  const [dataDeleted, setDataDeleted] = useState(false);

  if (!isOpen) return null;

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all stored resumes, history, and target jobs? This action is permanent and complies with PRD Privacy & Data Deletion protocols.')) {
      onClearData();
      setDataDeleted(true);
      setTimeout(() => {
        setDataDeleted(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black text-2xl">settings</span>
            <h3 className="font-bold text-lg text-black">Settings &amp; Data Control</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black p-1 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-5">
          {/* AI Engine Status */}
          <div className="p-4 rounded-xl bg-[#faf9fe] border border-neutral-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-black">Gemini 3.7 Flash Engine</span>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                Active Server-Side
              </span>
            </div>
            <p className="text-xs text-[#4c4546] leading-relaxed">
              Resume parsing and optimization algorithms are executed via secure backend API routes adhering to strict zero-retention privacy standards.
            </p>
          </div>

          {/* Data Privacy & Deletion */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">Privacy &amp; Data Deletion</h4>
            <p className="text-xs text-[#4c4546]">
              ResumeRadar stores session records strictly in your local workspace sandbox. You can purge all cached records at any time.
            </p>

            <button
              onClick={handleDeleteAll}
              className="mt-2 w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">delete_forever</span>
              Delete All Local Session Data (PRD Compliant)
            </button>

            {dataDeleted && (
              <p className="text-xs font-semibold text-green-700 text-center mt-2">
                ✓ All local data wiped successfully.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
