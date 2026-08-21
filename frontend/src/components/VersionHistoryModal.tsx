import React from 'react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: number;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  currentVersion,
}) => {
  if (!isOpen) return null;

  const versions = [
    {
      version: 3,
      label: 'Version 3 (Current)',
      score: 94,
      changes: 'Integrated Core Web Vitals, Tailwind CSS design system, and Architected power verb.',
      timestamp: 'Just now',
      active: true,
    },
    {
      version: 2,
      label: 'Version 2 (Initial Fixes)',
      score: 84,
      changes: 'Added missing TypeScript and React keywords to experience section.',
      timestamp: '2 mins ago',
      active: false,
    },
    {
      version: 1,
      label: 'Version 1 (Original Upload)',
      score: 72,
      changes: 'Raw baseline document before optimization.',
      timestamp: '5 mins ago',
      active: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#cfc4c5]/60 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black text-2xl">history</span>
            <h3 className="font-bold text-lg text-black">Resume Version History</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black p-1 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3">
          {versions.map((v) => (
            <div
              key={v.version}
              className={`p-4 rounded-xl border transition-all ${
                v.active
                  ? 'border-black bg-[#faf9fe] shadow-2xs'
                  : 'border-[#cfc4c5]/60 bg-white hover:bg-neutral-50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-black flex items-center gap-2">
                  {v.label}
                  {v.active && (
                    <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </span>
                <span className="text-xs font-black text-green-700 bg-green-50 px-2 py-0.5 rounded">
                  Score: {v.score}
                </span>
              </div>
              <p className="text-xs text-[#4c4546] leading-relaxed mt-1">{v.changes}</p>
              <span className="text-[10px] text-[#7e7576] block mt-2">{v.timestamp}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-neutral-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
