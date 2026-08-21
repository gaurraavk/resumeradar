import React, { useState } from 'react';
import { ResumeData } from '../types';

interface AtsTemplateSwitcherProps {
  resume: ResumeData;
  onPrint?: () => void;
}

type TemplateTheme = 'corporate' | 'modern' | 'minimal' | 'executive';

export const AtsTemplateSwitcher: React.FC<AtsTemplateSwitcherProps> = ({
  resume,
}) => {
  const [theme, setTheme] = useState<TemplateTheme>('modern');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [fontSize, setFontSize] = useState<'compact' | 'normal' | 'spacious'>('normal');

  const handlePrint = () => {
    window.print();
  };

  const getFontClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  const getSpacingClass = () => {
    switch (fontSize) {
      case 'compact':
        return 'text-[11px] leading-tight space-y-3';
      case 'spacious':
        return 'text-sm leading-relaxed space-y-6';
      default:
        return 'text-xs leading-normal space-y-4';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#cfc4c5]/60 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0058bc]"></span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
              ATS-Compliant Template Studio
            </h1>
          </div>
          <p className="text-xs text-[#4c4546] mt-1">
            Toggle 100% ATS-verified single-column templates engineered for maximum OCR parsing score and visual clarity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs font-semibold bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print / Save to PDF
          </button>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#cfc4c5]/60 shadow-xs flex flex-wrap justify-between items-center gap-4 no-print text-xs">
        {/* Template Themes */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-black uppercase tracking-wider text-[11px]">Template:</span>
          {[
            { id: 'modern', label: 'Modern Tech' },
            { id: 'corporate', label: 'Classic Corporate' },
            { id: 'minimal', label: 'Executive Minimal' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as TemplateTheme)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                theme === t.id
                  ? 'bg-black text-white'
                  : 'bg-[#faf9fe] text-[#4c4546] hover:bg-[#eeedf3]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Font Family */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-black uppercase tracking-wider text-[11px]">Typography:</span>
          {[
            { id: 'sans', label: 'Inter / Sans' },
            { id: 'serif', label: 'Merriweather / Serif' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFontFamily(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                fontFamily === f.id
                  ? 'bg-[#eeedf3] text-black font-bold'
                  : 'text-[#4c4546] hover:text-black'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Spacing */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-black uppercase tracking-wider text-[11px]">Density:</span>
          {[
            { id: 'compact', label: 'Compact (1 Page)' },
            { id: 'normal', label: 'Standard' },
            { id: 'spacious', label: 'Expanded' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setFontSize(s.id as any)}
              className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                fontSize === s.id
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-[#4c4546] hover:bg-[#faf9fe]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rendered Resume Document Canvas */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-[#cfc4c5]/60 shadow-md max-w-4xl mx-auto w-full print:border-0 print:shadow-none print:p-0">
        <div className={`${getFontClass()} ${getSpacingClass()} text-black`}>
          {/* Header */}
          <div className={`pb-4 ${theme === 'corporate' ? 'text-center border-b-2 border-black' : theme === 'modern' ? 'border-b border-[#cfc4c5]' : 'border-b-2 border-neutral-200'}`}>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase text-black">
              {resume.name}
            </h1>
            <p className="text-sm font-semibold text-[#4c4546] mt-1">{resume.title}</p>
            <div className={`flex flex-wrap items-center gap-3 text-xs text-[#4c4546] mt-2 ${theme === 'corporate' ? 'justify-center' : ''}`}>
              <span>{resume.email}</span>
              <span>•</span>
              <span>{resume.phone}</span>
              <span>•</span>
              <span>{resume.location}</span>
            </div>
          </div>

          {/* Professional Summary */}
          {resume.summary && (
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-1">
                Professional Summary
              </h2>
              <p className="text-xs text-neutral-800 leading-relaxed pt-1">
                {resume.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-4 pt-1">
              {resume.experience?.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                    <span className="font-bold text-xs text-black">{exp.role}</span>
                    <span className="text-[11px] font-semibold text-[#4c4546]">{exp.period}</span>
                  </div>
                  <div className="text-xs font-medium text-neutral-700 italic">{exp.company}</div>
                  <ul className="list-disc list-inside space-y-1 pt-1 text-xs text-neutral-800">
                    {exp.bullets?.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed pl-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-1">
                Technical &amp; Professional Skills
              </h2>
              <p className="text-xs text-neutral-800 pt-1 leading-relaxed">
                <span className="font-bold">Core Competencies: </span>
                {resume.skills.join(' • ')}
              </p>
            </div>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-1">
                Education
              </h2>
              <div className="space-y-2 pt-1">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-black">{edu.degree} — {edu.institution}</span>
                    <span className="text-[11px] text-[#4c4546]">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
