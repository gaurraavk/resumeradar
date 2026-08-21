import React, { useState } from 'react';
import { ResumeData, JobDescriptionData } from '../types';

interface InterviewPredictorProps {
  resume: ResumeData;
  jobTitle?: string;
  jobDescription?: string;
}

export const InterviewPredictor: React.FC<InterviewPredictorProps> = ({
  resume,
  jobTitle = 'Senior Frontend Developer',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'technical' | 'behavioral' | 'system_design'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('q-1');

  const questions = [
    {
      id: 'q-1',
      category: 'technical',
      categoryLabel: 'Technical Deep-Dive',
      question: 'How do you diagnose and resolve Core Web Vitals performance bottlenecks in large React single-page applications?',
      whyAsked: 'Your resume highlights a 40% reduction in initial load times; interviewers will verify your exact profiling methodology.',
      starBlueprint: {
        situation: 'Our e-commerce portal suffered from sluggish Largest Contentful Paint (LCP > 3.8s) and excessive JavaScript execution blocking the main thread.',
        task: 'Diagnose runtime scripting costs, bundle size inflation, and unnecessary tree re-renders.',
        action: 'Used Chrome DevTools Performance profiler & Lighthouse CI to pinpoint bloated CSS-in-JS runtimes and un-memoized heavy data tables. Introduced code-splitting with dynamic imports and Tailwind CSS.',
        result: 'Reduced bundle payload by 40%, brought LCP down to 1.1s, and improved conversion rates by 14%.',
      },
    },
    {
      id: 'q-2',
      category: 'behavioral',
      categoryLabel: 'Behavioral & Leadership',
      question: 'Tell me about a time you faced conflicting architecture priorities between rapid feature delivery and strict technical debt refactoring.',
      whyAsked: 'Assesses executive prioritization and engineering communication with non-technical product owners.',
      starBlueprint: {
        situation: 'Product leadership required launching three complex checkout flows in two weeks while our state store had critical race condition bugs.',
        task: 'Deliver the business-critical milestone without compounding technical instability.',
        action: 'Created a risk-matrix spreadsheet showing revenue at risk versus sprint velocity. Negotiated an incremental migration strategy using adapter facades.',
        result: 'Shipped features on schedule while safely refactoring 80% of legacy actions with zero downtime.',
      },
    },
    {
      id: 'q-3',
      category: 'system_design',
      categoryLabel: 'System Design & Scalability',
      question: 'How would you architect an offline-first real-time collaborative workspace supporting 10,000 concurrent active users?',
      whyAsked: 'Target role emphasizes scalable distributed state and resilient client-side architecture.',
      starBlueprint: {
        situation: 'Enterprise users experienced latency and data conflicts when collaborating simultaneously during unstable network sessions.',
        task: 'Design a conflict-free, low-latency synchronizer between local browser storage and cloud WebSockets.',
        action: 'Implemented CRDTs (Conflict-free Replicated Data Types) paired with an IndexedDB persistent cache and optimistic UI mutations with rollback guards.',
        result: 'Achieved sub-50ms peer-to-peer sync latency with 100% offline data integrity guarantee.',
      },
    },
    {
      id: 'q-4',
      category: 'technical',
      categoryLabel: 'Technical Depth',
      question: 'What are the trade-offs between Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and Client-Side Hydration?',
      whyAsked: 'Tests architectural maturity for modern frontend infrastructure choices.',
      starBlueprint: {
        situation: 'Evaluating architecture migration for a high-traffic content and dashboard portal.',
        task: 'Balance SEO indexing, TTFB (Time to First Byte), and server compute costs.',
        action: 'Architected a hybrid topology utilizing ISR for marketing/blog pages, SSR for authenticated user dashboards, and edge caching for static assets.',
        result: 'Maintained <100ms TTFB globally with 60% cloud infrastructure cost reduction.',
      },
    },
  ];

  const filtered = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#cfc4c5]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0058bc]"></span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
              Interview Question Predictor
            </h1>
          </div>
          <p className="text-xs text-[#4c4546] mt-1">
            Predicted interview questions and STAR-method answer blueprints mapped directly to your resume bullet claims and target role requirements.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#cfc4c5]/80 text-xs font-semibold text-black">
          <span className="material-symbols-outlined text-[16px] text-[#0058bc]">psychology</span>
          <span>Role: {jobTitle}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Questions (4)' },
          { id: 'technical', label: 'Technical Deep-Dive' },
          { id: 'behavioral', label: 'Behavioral & Leadership' },
          { id: 'system_design', label: 'System Design & Scale' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-black text-white'
                : 'bg-white text-[#4c4546] border border-[#cfc4c5]/60 hover:bg-[#faf9fe]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Questions Accordion */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#cfc4c5]/60 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-5 text-left flex justify-between items-start gap-4 hover:bg-[#faf9fe] transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058bc] bg-[#d8e2ff] px-2 py-0.5 rounded-md">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-black pt-1">
                    "{item.question}"
                  </h3>
                  <p className="text-xs text-[#4c4546]">{item.whyAsked}</p>
                </div>

                <span className="material-symbols-outlined text-[#4c4546] text-[20px] transition-transform shrink-0">
                  {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-neutral-100 bg-[#faf9fe] space-y-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-black uppercase tracking-wider text-[11px]">
                    <span className="material-symbols-outlined text-[#0058bc] text-[16px]">stars</span>
                    Recommended STAR Answer Blueprint
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-white p-3.5 rounded-xl border border-[#cfc4c5]/40 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#eeedf3] px-2 py-0.5 rounded">
                        Situation &amp; Context
                      </span>
                      <p className="text-xs text-[#4c4546] pt-1">{item.starBlueprint.situation}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#cfc4c5]/40 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#eeedf3] px-2 py-0.5 rounded">
                        Task &amp; Objective
                      </span>
                      <p className="text-xs text-[#4c4546] pt-1">{item.starBlueprint.task}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#cfc4c5]/40 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#eeedf3] px-2 py-0.5 rounded">
                        Action &amp; Technique
                      </span>
                      <p className="text-xs text-[#4c4546] pt-1">{item.starBlueprint.action}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-green-200 bg-green-50/50 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-900 bg-green-200 px-2 py-0.5 rounded">
                        Quantified Result
                      </span>
                      <p className="text-xs text-green-900 pt-1 font-medium">{item.starBlueprint.result}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
