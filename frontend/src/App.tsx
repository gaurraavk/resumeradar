import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { SidebarNav } from './components/SidebarNav';
import { LandingView } from './components/LandingView';
import { NewAnalysisView } from './components/NewAnalysisView';
import { AnalysisResultView } from './components/AnalysisResultView';
import { OptimizationComparisonView } from './components/OptimizationComparisonView';
import { HistoryView } from './components/HistoryView';
import { ResumesLibraryView } from './components/ResumesLibraryView';
import { JobsLibraryView } from './components/JobsLibraryView';
import { InsightsView } from './components/InsightsView';
import { ResourcesView } from './components/ResourcesView';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { AtsParserSimulator } from './components/AtsParserSimulator';
import { BulletRewriteStudio } from './components/BulletRewriteStudio';
import { InterviewPredictor } from './components/InterviewPredictor';
import { AtsTemplateSwitcher } from './components/AtsTemplateSwitcher';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { UserLoginView, UserAccount } from './components/UserLoginView';
import { LinkedInRadarView } from './components/LinkedInRadarView';
import { LinkedInAuthModal } from './components/LinkedInAuthModal';
import { SignInPromptModal } from './components/SignInPromptModal';
import { ExportModal } from './components/ExportModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';

import {
  ResumeData,
  JobDescriptionData,
  MatchResult,
  OptimizationResult,
  AnalysisHistoryItem,
  Recommendation,
  LinkedInProfile,
  LinkedInJobMatch,
  InAppNotification,
} from './types';

import {
  SAMPLE_RESUMES,
  SAMPLE_JOBS,
  INITIAL_MATCH_RESULT,
  INITIAL_OPTIMIZATION_RESULT,
  INITIAL_HISTORY,
} from './data/sampleData';

const INITIAL_LINKEDIN_PROFILE: LinkedInProfile = {
  id: 'li-alex-morgan',
  fullName: 'Alex Morgan',
  headline: 'Senior Full Stack Engineer | React, TypeScript, Next.js, Cloud Architecture',
  location: 'San Francisco, CA (Open to Remote)',
  email: 'alex.morgan@domain.com',
  summary: 'Full-stack software engineer with 6+ years of production experience architecting high-throughput SaaS web applications and modern design systems. Specialized in TypeScript, React, Node.js, and automated CI/CD pipelines.',
  profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  skills: [
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Tailwind CSS',
    'GraphQL',
    'PostgreSQL',
    'AWS Cloud',
    'Docker',
    'REST APIs',
    'Jest & Cypress',
    'CI/CD Pipelines'
  ],
  positions: [
    {
      id: 'pos-1',
      title: 'Senior Frontend Engineer',
      company: 'TechFlow Systems',
      location: 'San Francisco, CA',
      startDate: '2022',
      isCurrent: true,
      summary: 'Architected micro-frontend architecture supporting 1.4M daily active users. Reduced Web Vitals bundle load times by 42% through lazy evaluation and Vite build optimizations.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'GraphQL']
    },
    {
      id: 'pos-2',
      title: 'Software Engineer',
      company: 'DataStream Analytics',
      location: 'Austin, TX',
      startDate: '2019',
      endDate: '2022',
      isCurrent: false,
      summary: 'Built full-stack telemetry dashboards and scalable real-time query engines in Node.js and PostgreSQL, decreasing API response latency by 35%.',
      skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS Cloud']
    }
  ],
  educations: [
    {
      id: 'edu-1',
      schoolName: 'University of California, Berkeley',
      degreeName: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startYear: '2015',
      endYear: '2019'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Associate',
      issuingAuthority: 'Amazon Web Services',
      issueDate: '2023'
    },
    {
      id: 'cert-2',
      name: 'Meta Certified Front-End Developer Specialization',
      issuingAuthority: 'Meta',
      issueDate: '2022'
    }
  ],
  connectedAt: new Date().toISOString()
};

const INITIAL_JOB_MATCHES: LinkedInJobMatch[] = [
  {
    id: 'li-job-1',
    jobTitle: 'Senior Frontend Engineer - Developer Experience',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100',
    location: 'San Francisco, CA / Remote',
    salary: '$185,000 - $240,000 + Equity',
    description: 'We are seeking a Senior Frontend Engineer to build world-class dashboard interfaces for millions of global businesses. Strong expertise in TypeScript, React, Web Vitals performance, and modern build tooling required.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=stripe+senior+frontend',
    matchedKeywords: ['TypeScript', 'React', 'Next.js', 'Performance', 'Vite', 'GraphQL'],
    missingKeywords: ['Rust', 'WASM'],
    matchScore: 94,
    atsTier: 'Top 1% Fit',
    applicantCount: 28,
    postedDate: '3 hours ago'
  },
  {
    id: 'li-job-2',
    jobTitle: 'Staff UI Software Engineer',
    company: 'Netflix',
    companyLogo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=100',
    location: 'Los Gatos, CA / Remote',
    salary: '$220,000 - $310,000',
    description: 'Join the Studio Engineering team building next-generation creative tooling. Requires deep mastery of React component systems, state management, and real-time collaborative applications.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=netflix+staff+ui',
    matchedKeywords: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'REST APIs'],
    missingKeywords: ['WebSockets', 'RxJS'],
    matchScore: 91,
    atsTier: 'Top 5% Fit',
    applicantCount: 42,
    postedDate: '5 hours ago'
  },
  {
    id: 'li-job-3',
    jobTitle: 'Full Stack AI Platform Engineer',
    company: 'OpenAI Ecosystem Partner',
    companyLogo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=100',
    location: 'Remote (US)',
    salary: '$190,000 - $260,000',
    description: 'Help engineer generative AI interfaces, streaming token renderers, and scalable Node.js API backends. Experience with LLM integrations, TypeScript, and modern vector databases a plus.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=openai+full+stack',
    matchedKeywords: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
    missingKeywords: ['Python', 'Pinecone'],
    matchScore: 89,
    atsTier: 'Top 5% Fit',
    applicantCount: 65,
    postedDate: '1 day ago'
  },
  {
    id: 'li-job-4',
    jobTitle: 'Lead Frontend Architect',
    company: 'Airbnb',
    companyLogo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=100',
    location: 'Remote',
    salary: '$210,000 - $290,000',
    description: 'Leading design system unification across mobile web and desktop applications. Focus on accessibility (a11y), internationalization, and ultra-fast page speed metrics.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=airbnb+lead+frontend',
    matchedKeywords: ['React', 'TypeScript', 'Tailwind CSS', 'Accessibility', 'Testing'],
    missingKeywords: ['Figma API', 'Design Tokens'],
    matchScore: 86,
    atsTier: 'Top 10% Fit',
    applicantCount: 84,
    postedDate: '2 days ago'
  }
];

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    type: 'linkedin_match',
    title: 'LinkedIn Job Match Alert (94%)',
    message: 'Your resume is a Top 1% Fit for Senior Frontend Engineer at Stripe!',
    time: 'Just now',
    read: false,
    matchScore: 94,
    linkedInJob: INITIAL_JOB_MATCHES[0]
  },
  {
    id: 'notif-2',
    type: 'linkedin_match',
    title: 'LinkedIn Job Match Alert (91%)',
    message: 'New high match posted: Staff UI Software Engineer at Netflix.',
    time: '2h ago',
    read: false,
    matchScore: 91,
    linkedInJob: INITIAL_JOB_MATCHES[1]
  }
];

export function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Core Data Stores
  const [resumes, setResumes] = useState<ResumeData[]>(SAMPLE_RESUMES);
  const [jobs, setJobs] = useState<JobDescriptionData[]>(SAMPLE_JOBS);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(INITIAL_HISTORY);

  // LinkedIn Integration State
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(INITIAL_LINKEDIN_PROFILE);
  const [linkedInMatches, setLinkedInMatches] = useState<LinkedInJobMatch[]>(INITIAL_JOB_MATCHES);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isLinkedInAuthOpen, setIsLinkedInAuthOpen] = useState<boolean>(false);
  const [toastAlert, setToastAlert] = useState<{ title: string; message: string; type?: 'info' | 'success' } | null>(null);

  // Active Workflow State
  const [activeResume, setActiveResume] = useState<ResumeData | null>(SAMPLE_RESUMES[0]);
  const [activeJobDescription, setActiveJobDescription] = useState<string>('');
  const [activeJobTitle, setActiveJobTitle] = useState<string>('');
  const [activeMatchResult, setActiveMatchResult] = useState<MatchResult | null>(INITIAL_MATCH_RESULT);
  const [activeOptimizationResult, setActiveOptimizationResult] = useState<OptimizationResult | null>(
    INITIAL_OPTIMIZATION_RESULT
  );

  // Pre-fill state for starting analysis from library
  const [prefillResume, setPrefillResume] = useState<ResumeData | null>(null);
  const [prefillJob, setPrefillJob] = useState<JobDescriptionData | null>(null);

  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Modal States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSignInPromptOpen, setIsSignInPromptOpen] = useState(false);

  // User Authentication State (defaults to null for new visitors)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(null);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (toastAlert) {
      const timer = setTimeout(() => setToastAlert(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toastAlert]);

  useEffect(() => {
    const token = localStorage.getItem('resumeradar_token');
    if (!token) { setAuthReady(true); return; }
    fetch('/api/v1/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => response.ok ? response.json() : Promise.reject())
      .then(result => setCurrentUser(result.data.user))
      .catch(() => localStorage.removeItem('resumeradar_token'))
      .finally(() => setAuthReady(true));
  }, []);

  // Handlers
  const handleNavigate = (tab: string) => {
    const publicTabs = new Set(['landing', 'user-login', 'admin-login']);
    if (!publicTabs.has(tab) && !currentUser && tab !== 'admin') {
      setIsSignInPromptOpen(true);
      return;
    }

    if (tab === 'admin') {
      if (adminUser) {
        setCurrentTab('admin-dashboard');
      } else {
        setCurrentTab('admin-login');
      }
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserLogin = (user: UserAccount, token: string) => {
    localStorage.setItem('resumeradar_token', token);
    setCurrentUser(user);
    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInPromptSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsSignInPromptOpen(false);
    setCurrentTab('new-analysis');
    setToastAlert({
      title: `Welcome, ${user.name}!`,
      message: 'Signed in successfully. Ready to start your ATS resume scan.',
      type: 'success',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserLogout = () => {
    localStorage.removeItem('resumeradar_token');
    setCurrentUser(null);
    setCurrentTab('user-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (user: { email: string; name: string; role: string }) => {
    setAdminUser(user);
    setCurrentTab('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('resumeradar_admin_token');
    setAdminUser(null);
    setCurrentTab('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    (window as any)._navigateToTab = handleNavigate;
  }, [currentUser]);

  useEffect(() => {
    if (authReady && !currentUser && !['landing', 'user-login', 'admin-login'].includes(currentTab)) setCurrentTab('user-login');
  }, [authReady, currentUser, currentTab]);

  const handleStartNewAnalysis = () => {
    setPrefillResume(null);
    setPrefillJob(null);
    if (!currentUser) {
      setIsSignInPromptOpen(true);
      return;
    }
    setCurrentTab('new-analysis');
  };

  const handleLoadQuickDemo = (resumeIdx: number, jobIdx: number) => {
    const r = SAMPLE_RESUMES[resumeIdx] || SAMPLE_RESUMES[0];
    const j = SAMPLE_JOBS[jobIdx] || SAMPLE_JOBS[0];
    setPrefillResume(r);
    setPrefillJob(j);
    if (!currentUser) {
      setIsSignInPromptOpen(true);
      return;
    }
    setCurrentTab('new-analysis');
  };

  const handleSelectResumeForAnalysis = (resume: ResumeData) => {
    setPrefillResume(resume);
    setPrefillJob(null);
    if (!currentUser) {
      setIsSignInPromptOpen(true);
      return;
    }
    setCurrentTab('new-analysis');
  };

  const handleSelectJobForAnalysis = (job: JobDescriptionData) => {
    setPrefillJob(job);
    setPrefillResume(null);
    if (!currentUser) {
      setIsSignInPromptOpen(true);
      return;
    }
    setCurrentTab('new-analysis');
  };

  const handleLinkedInProfileImported = (profile: LinkedInProfile, generatedResume: ResumeData) => {
    setLinkedInProfile(profile);
    setActiveResume(generatedResume);
    setResumes((prev) => [generatedResume, ...prev.filter((r) => r.id !== generatedResume.id)]);

    // Create Notification
    const newNotif: InAppNotification = {
      id: 'notif-sync-' + Date.now(),
      type: 'linkedin_match',
      title: 'LinkedIn Profile Connected',
      message: `Imported ${profile.positions.length} roles and ${profile.skills.length} verified skills for ${profile.fullName}.`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setToastAlert({
      title: 'LinkedIn Profile Synced!',
      message: `${profile.fullName}'s profile and verified skills loaded into ResumeRadar.`,
      type: 'success',
    });

    setIsLinkedInAuthOpen(false);
  };

  const handleImportProfileAsResume = (profile: LinkedInProfile) => {
    const genResume: ResumeData = {
      id: 'resume-li-' + Date.now(),
      name: profile.fullName,
      title: profile.headline.split('|')[0]?.trim() || 'Software Engineer',
      email: profile.email,
      phone: '+1 (555) 438-9921',
      location: profile.location,
      summary: profile.summary,
      fileName: `${profile.fullName.replace(/\s+/g, '_')}_LinkedIn.pdf`,
      fileSize: '1.2 MB',
      createdAt: new Date().toISOString().split('T')[0],
      skills: profile.skills,
      experience: profile.positions.map((pos) => ({
        id: pos.id,
        role: pos.title,
        company: pos.company,
        period: `${pos.startDate} - ${pos.isCurrent ? 'Present' : pos.endDate || '2023'}`,
        bullets: [pos.summary],
      })),
      education: profile.educations.map((edu) => ({
        id: edu.id,
        degree: `${edu.degreeName} in ${edu.fieldOfStudy}`,
        institution: edu.schoolName,
        year: `${edu.startYear || '2015'} - ${edu.endYear || '2019'}`,
      })),
    };

    setActiveResume(genResume);
    setPrefillResume(genResume);
    setToastAlert({
      title: 'Active Resume Updated',
      message: `Set LinkedIn Profile as active resume for ATS scans and job matching.`,
      type: 'info',
    });
    setCurrentTab('new-analysis');
  };

  const handleOptimizeForLinkedInJob = (job: LinkedInJobMatch) => {
    const jobData: JobDescriptionData = {
      id: job.id,
      title: job.jobTitle,
      company: job.company,
      location: job.location,
      description: `${job.jobTitle} at ${job.company} (${job.location})\n\nSalary: ${job.salary}\n\nKey Requirements & Responsibilities:\n${job.description}\n\nTarget Technical Competencies: ${job.matchedKeywords.concat(job.missingKeywords).join(', ')}`,
      createdAt: 'Today',
    };

    setPrefillJob(jobData);
    if (!prefillResume && activeResume) {
      setPrefillResume(activeResume);
    }
    setCurrentTab('new-analysis');
  };

  const handleTriggerInstantMatchScan = async () => {
    try {
      const skillsToMatch = activeResume?.skills || linkedInProfile?.skills || ['React', 'TypeScript', 'Node.js'];
      const res = await fetch('/api/linkedin/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsToMatch }),
      });
      const data = await res.json();

      if (data.success && data.matches) {
        setLinkedInMatches(data.matches);
        const topMatch = data.matches[0];

        if (topMatch) {
          const matchNotif: InAppNotification = {
            id: 'notif-match-' + Date.now(),
            type: 'linkedin_match',
            title: `LinkedIn Match Alert (${topMatch.matchScore}%)`,
            message: `Your resume matches ${topMatch.jobTitle} at ${topMatch.company}!`,
            time: 'Just now',
            read: false,
            matchScore: topMatch.matchScore,
            linkedInJob: topMatch,
          };
          setNotifications((prev) => [matchNotif, ...prev]);

          setToastAlert({
            title: `High Match Alert: ${topMatch.matchScore}%`,
            message: `Your profile is a top match for ${topMatch.jobTitle} at ${topMatch.company}!`,
            type: 'success',
          });
        }
      }
    } catch (err) {
      console.warn('Live match error:', err);
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleRunAnalysis = async (
    resume: ResumeData,
    jobDescription: string,
    jobTitle: string
  ) => {
    setIsAnalyzing(true);
    setActiveResume(resume);
    setActiveJobDescription(jobDescription);
    setActiveJobTitle(jobTitle);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resume.rawText || `${resume.name}\n${resume.title}\n${resume.summary}\n${resume.skills.join(', ')}`,
          jobDescription,
          resumeName: resume.name,
          jobTitle,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setActiveMatchResult(result.data);

          // Add to history
          const newHistItem: AnalysisHistoryItem = {
            id: 'hist-' + Date.now(),
            jobTitle: result.data.jobTitle || jobTitle,
            company: result.data.companyName || 'Target Company',
            resumeFileName: resume.fileName || `${resume.name}.pdf`,
            initialScore: result.data.overallScore,
            date: new Date().toISOString().split('T')[0],
            status: 'Analyzed',
            matchResult: result.data,
          };
          setHistory((prev) => [newHistItem, ...prev]);

          // Trigger LinkedIn match scan in the background
          handleTriggerInstantMatchScan();

          setCurrentTab('analysis-result');
          return;
        }
      }
    } catch (e) {
      console.warn('API error, falling back to instant local match result:', e);
    } finally {
      setIsAnalyzing(false);
    }

    // Fallback if API fails
    const fallbackMatch = {
      ...INITIAL_MATCH_RESULT,
      jobTitle: jobTitle || 'Target Role',
    };
    setActiveMatchResult(fallbackMatch);
    setCurrentTab('analysis-result');
  };

  const handleApplyRecommendations = async (selectedRecs: Recommendation[]) => {
    if (!activeResume) return;
    setIsOptimizing(true);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: activeResume,
          jobDescription: activeJobDescription,
          jobTitle: activeJobTitle || activeMatchResult?.jobTitle || 'Target Role',
          originalScore: activeMatchResult?.overallScore || 72,
          selectedRecommendations: selectedRecs,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setActiveOptimizationResult(result.data);

          // Update History with final optimized score
          setHistory((prev) =>
            prev.map((item, idx) =>
              idx === 0
                ? {
                    ...item,
                    finalScore: result.data.optimizedScore,
                    status: 'Optimized',
                    optimizationResult: result.data,
                  }
                : item
            )
          );

          setCurrentTab('optimization');
          return;
        }
      }
    } catch (e) {
      console.warn('Optimization error, fallback to demo optimization:', e);
    } finally {
      setIsOptimizing(false);
    }

    // Fallback optimization
    setActiveOptimizationResult(INITIAL_OPTIMIZATION_RESULT);
    setCurrentTab('optimization');
  };

  const handleOpenHistoryItem = (item: AnalysisHistoryItem) => {
    if (item.optimizationResult) {
      setActiveOptimizationResult(item.optimizationResult);
      setCurrentTab('optimization');
    } else if (item.matchResult) {
      setActiveMatchResult(item.matchResult);
      setCurrentTab('analysis-result');
    } else {
      setCurrentTab('analysis-result');
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllData = () => {
    setHistory([]);
    setResumes(SAMPLE_RESUMES);
    setJobs(SAMPLE_JOBS);
  };

  // Determine if sidebar should be displayed
  const showSidebar = currentTab !== 'landing' && currentTab !== 'user-login' && currentTab !== 'admin-login';

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9fe] text-[#1a1b1f] relative">
      {/* Real-time LinkedIn Match / ATS Notification Toast */}
      {toastAlert && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 bg-white border border-[#0a66c2]/40 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0a66c2] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            in
          </div>
          <div className="space-y-0.5 flex-1 pr-2">
            <h4 className="text-xs font-bold text-black">{toastAlert.title}</h4>
            <p className="text-[11px] text-[#4c4546] leading-snug">{toastAlert.message}</p>
            <div className="pt-1.5 flex gap-3 text-[11px]">
              <button
                onClick={() => {
                  setToastAlert(null);
                  setCurrentTab('linkedin-radar');
                }}
                className="text-[#0a66c2] font-bold hover:underline"
              >
                Open Job Radar →
              </button>
            </div>
          </div>
          <button
            onClick={() => setToastAlert(null)}
            className="text-neutral-400 hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Top Header Navigation */}
      <TopNav
        currentTab={currentTab}
        user={currentUser}
        notifications={notifications}
        linkedInConnected={!!linkedInProfile}
        onNavigate={handleNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogoutUser={handleUserLogout}
        onOptimizeForJob={handleOptimizeForLinkedInJob}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex w-full">
        {/* Left Pro Navigation Sidebar (desktop) */}
        {showSidebar && (
          <SidebarNav
            currentTab={currentTab}
            user={currentUser}
            onNavigate={handleNavigate}
            onOpenSupport={() => handleNavigate('resources')}
            onOpenPrivacy={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Dynamic Route Container */}
        <main
          className={`flex-1 flex flex-col min-w-0 transition-all ${
            showSidebar ? 'lg:pl-64' : ''
          }`}
        >
          {(currentTab === 'landing' || (currentTab === 'dashboard' && currentUser)) && (
            <LandingView
              onStartAnalysis={handleStartNewAnalysis}
              onLoadQuickDemo={handleLoadQuickDemo}
            />
          )}

          {currentTab === 'new-analysis' && (
            <NewAnalysisView
              onRunAnalysis={handleRunAnalysis}
              isLoading={isAnalyzing}
              prefillResume={prefillResume}
              prefillJob={prefillJob}
              onOpenLinkedInModal={() => setIsLinkedInAuthOpen(true)}
            />
          )}

          {currentTab === 'linkedin-radar' && (
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
              <LinkedInRadarView
                linkedInProfile={linkedInProfile}
                jobMatches={linkedInMatches}
                activeResume={activeResume}
                notifications={notifications}
                onOpenLinkedInModal={() => setIsLinkedInAuthOpen(true)}
                onOptimizeForJob={handleOptimizeForLinkedInJob}
                onImportProfileAsResume={handleImportProfileAsResume}
                onTriggerInstantMatchScan={handleTriggerInstantMatchScan}
                onMarkNotificationRead={handleMarkNotificationRead}
              />
            </div>
          )}

          {currentTab === 'analysis-result' && activeMatchResult && activeResume && (
            <AnalysisResultView
              matchResult={activeMatchResult}
              resume={activeResume}
              onApplyRecommendations={handleApplyRecommendations}
              onEditResume={(updated) => setActiveResume(updated)}
              isOptimizing={isOptimizing}
            />
          )}

          {currentTab === 'optimization' && activeOptimizationResult && (
            <OptimizationComparisonView
              optimizationResult={activeOptimizationResult}
              onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
              onOpenExport={() => setIsExportOpen(true)}
              onNewAnalysis={handleStartNewAnalysis}
            />
          )}

          {currentTab === 'history' && (
            <HistoryView
              history={history}
              onOpenAnalysis={handleOpenHistoryItem}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onNewAnalysis={handleStartNewAnalysis}
            />
          )}

          {currentTab === 'resumes' && (
            <ResumesLibraryView
              resumes={resumes}
              onSelectResumeForAnalysis={handleSelectResumeForAnalysis}
              onNewAnalysis={handleStartNewAnalysis}
            />
          )}

          {currentTab === 'jobs' && (
            <JobsLibraryView
              jobs={jobs}
              onSelectJobForAnalysis={handleSelectJobForAnalysis}
              onNewAnalysis={handleStartNewAnalysis}
            />
          )}

          {currentTab === 'insights' && <InsightsView />}

          {currentTab === 'resources' && <ResourcesView />}

          {currentTab === 'cover-letter' && activeResume && (
            <CoverLetterGenerator
              resume={activeOptimizationResult?.optimizedResume || activeResume}
              jobTitle={activeJobTitle || activeMatchResult?.jobTitle || 'Senior Frontend Developer'}
              jobDescription={activeJobDescription}
            />
          )}

          {currentTab === 'ats-simulator' && activeResume && (
            <AtsParserSimulator
              resume={activeOptimizationResult?.optimizedResume || activeResume}
              jobDescription={activeJobDescription}
            />
          )}

          {currentTab === 'bullet-studio' && (
            <BulletRewriteStudio />
          )}

          {currentTab === 'interview-prep' && activeResume && (
            <InterviewPredictor
              resume={activeOptimizationResult?.optimizedResume || activeResume}
              jobTitle={activeJobTitle || activeMatchResult?.jobTitle || 'Senior Frontend Developer'}
              jobDescription={activeJobDescription}
            />
          )}

          {currentTab === 'template-studio' && activeResume && (
            <AtsTemplateSwitcher
              resume={activeOptimizationResult?.optimizedResume || activeResume}
            />
          )}

          {currentTab === 'user-login' && (
            <UserLoginView
              onLoginSuccess={handleUserLogin}
              onCancel={() => handleNavigate('landing')}
              onSwitchToAdmin={() => handleNavigate('admin-login')}
            />
          )}

          {currentTab === 'admin-login' && (
            <AdminLoginView
              onLoginSuccess={handleAdminLogin}
              onCancel={() => handleNavigate('landing')}
            />
          )}

          {currentTab === 'admin-dashboard' && adminUser && (
            <AdminDashboardView
              adminUser={adminUser}
              history={history}
              resumes={resumes}
              jobs={jobs}
              onLogout={handleAdminLogout}
              onNavigateToApp={() => handleNavigate('dashboard')}
              onClearLogs={() => setHistory([])}
            />
          )}

          {/* Persistent Pro Footer */}
          <Footer onNavigate={handleNavigate} />
        </main>
      </div>

      {/* LinkedIn Auth Modal */}
      <LinkedInAuthModal
        isOpen={isLinkedInAuthOpen}
        onClose={() => setIsLinkedInAuthOpen(false)}
        onProfileImported={handleLinkedInProfileImported}
        existingProfile={linkedInProfile}
      />

      {/* Modals */}
      <SignInPromptModal
        isOpen={isSignInPromptOpen}
        onClose={() => setIsSignInPromptOpen(false)}
        onLoginSuccess={handleSignInPromptSuccess}
        onNavigateToFullLogin={() => {
          setIsSignInPromptOpen(false);
          handleNavigate('user-login');
        }}
        onOpenLinkedInConnect={() => {
          setIsSignInPromptOpen(false);
          setIsLinkedInAuthOpen(true);
        }}
      />

      {activeOptimizationResult && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          resume={activeOptimizationResult.optimizedResume}
          score={activeOptimizationResult.optimizedScore}
        />
      )}

      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        currentVersion={3}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearData={handleClearAllData}
      />
    </div>
  );
}

export default App;
