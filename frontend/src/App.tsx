import React, { useState, useEffect } from 'react';
import { ShaderBackground } from './components/ShaderBackground';
import { TopNav } from './components/TopNav';
import { LandingView } from './components/LandingView';
import { NewAnalysisView } from './components/NewAnalysisView';
import { AnalysisResultView } from './components/AnalysisResultView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { BestFitView } from './components/BestFitView';
import { CompareView } from './components/CompareView';
import { QualityAnalyzerView } from './components/QualityAnalyzerView';
import { AuthView } from './components/AuthView';
import { HistoryView } from './components/HistoryView';
import { Footer } from './components/Footer';

import {
  ResumeData,
  AnalysisResult,
  AnalysisFileResult,
  UserSummary,
} from './types';

import {
  apiFetch,
  apiUpload,
  safeJson,
  getUserToken,
  clearUserToken,
  wakeUpServer,
} from './lib/apiClient';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | AnalysisFileResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // User auth state
  const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);

  useEffect(() => {
    // 1. Send immediate wake-up request to Render free tier
    wakeUpServer();

    // 2. Hydrate authenticated user if token exists
    const token = getUserToken();
    if (token) {
      apiFetch('/api/v1/auth/me')
        .then(async (res) => {
          if (res.ok) {
            const json = await safeJson(res);
            if (json.success && json.data) {
              setCurrentUser({
                id: json.data.id,
                fullName: json.data.fullName,
                email: json.data.email,
                role: json.data.role,
              });
            }
          } else {
            clearUserToken();
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleAuthSuccess = (user: UserSummary) => {
    setCurrentUser(user);
    setCurrentTab('new-analysis');
  };

  const handleUserLogout = () => {
    clearUserToken();
    setCurrentUser(null);
    setCurrentTab('landing');
  };

  // Admin state
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(() => {
    const token = localStorage.getItem('resumeradar_admin_token');
    if (!token) return null;
    return { email: 'admin@resumeradar.io', name: 'Administrator', role: 'Super Administrator' };
  });

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (user: { email: string; name: string; role: string }) => {
    setAdminUser(user);
    setCurrentTab('admin-dashboard');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('resumeradar_admin_token');
    setAdminUser(null);
    setCurrentTab('landing');
  };

  // Store last analysis inputs for resilient session re-hydration
  const [lastInputs, setLastInputs] = useState<{
    mode: 'text' | 'file';
    resume?: ResumeData;
    file?: File;
    jobDescription: string;
    jobTitle: string;
  } | null>(null);

  // Text-only analysis (existing endpoint)
  const handleRunAnalysis = async (resume: ResumeData, jobDescription: string, jobTitle: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentResume(resume);
    setLastInputs({ mode: 'text', resume, jobDescription, jobTitle });

    try {
      const resumeText = resume.rawText || [
        resume.summary || '',
        resume.skills?.join(' ') || '',
        ...(resume.experience || []).map(e => `${e.role} ${e.company} ${e.bullets.join(' ')}`),
      ].join('\n');

      const response = await apiFetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          jobTitle: jobTitle || 'Target Role',
        }),
      });

      const resData = await safeJson(response);

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || `Analysis failed with status ${response.status}`);
      }

      const payload: AnalysisResult = resData.data ?? resData;

      setAnalysisResult(payload);
      setCurrentTab('analysis-result');
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisError(err instanceof Error ? err.message : 'Analysis failed. Please check backend status.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // File upload analysis (new endpoint)
  const handleRunFileAnalysis = async (file: File, jobDescription: string, jobTitle: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setLastInputs({ mode: 'file', file, jobDescription, jobTitle });
    setCurrentResume({
      id: 'file-' + Date.now(),
      name: file.name.replace(/\.[^/.]+$/, ''),
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

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);
      formData.append('jobTitle', jobTitle || 'Target Role');

      const response = await apiUpload('/api/v1/analyze-file', formData);
      const resData = await safeJson(response);

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || `Analysis failed with status ${response.status}`);
      }

      const payload: AnalysisFileResult = resData.data ?? resData;

      setAnalysisResult(payload);
      setCurrentTab('analysis-result');
    } catch (err) {
      console.error('File analysis error:', err);
      setAnalysisError(err instanceof Error ? err.message : 'File analysis failed. Please check backend status.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReRunAnalysis = async (): Promise<string | null> => {
    if (!lastInputs) return null;
    try {
      if (lastInputs.mode === 'text' && lastInputs.resume) {
        const resumeText = lastInputs.resume.rawText || [
          lastInputs.resume.summary || '',
          lastInputs.resume.skills?.join(' ') || '',
          ...(lastInputs.resume.experience || []).map(e => `${e.role} ${e.company} ${e.bullets.join(' ')}`),
        ].join('\n');

        const response = await apiFetch('/api/v1/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText,
            jobDescription: lastInputs.jobDescription,
            jobTitle: lastInputs.jobTitle || 'Target Role',
          }),
        });
        const resData = await safeJson(response);
        if (!response.ok || !resData.success) return null;
        const payload: AnalysisResult = resData.data ?? resData;
        setAnalysisResult(payload);
        return payload.analysisId || null;
      } else if (lastInputs.mode === 'file' && lastInputs.file) {
        const formData = new FormData();
        formData.append('file', lastInputs.file);
        formData.append('jobDescription', lastInputs.jobDescription);
        formData.append('jobTitle', lastInputs.jobTitle || 'Target Role');

        const response = await apiUpload('/api/v1/analyze-file', formData);
        const resData = await safeJson(response);
        if (!response.ok || !resData.success) return null;
        const payload: AnalysisFileResult = resData.data ?? resData;
        setAnalysisResult(payload);
        return payload.analysisId || null;
      }
    } catch {
      return null;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4] text-[#15263c] antialiased selection:bg-[#15263c] selection:text-[#fbf9f4] relative">
      <ShaderBackground />
      <TopNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        isAdminLoggedIn={!!adminUser}
        onAdminLogout={handleAdminLogout}
        currentUser={currentUser}
        onUserLogout={handleUserLogout}
      />

      <main className="flex-1 flex flex-col relative z-10">
        {analysisError && (
          <div className="max-w-4xl mx-auto mt-4 px-6 w-full">
            <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-[13px] flex items-center justify-between">
              <span>{analysisError}</span>
              <button onClick={() => setAnalysisError(null)} className="font-semibold underline cursor-pointer">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {currentTab === 'landing' && (
          <LandingView onStartAnalysis={() => handleNavigate('new-analysis')} />
        )}

        {currentTab === 'new-analysis' && (
          <NewAnalysisView
            onRunAnalysis={handleRunAnalysis}
            onRunFileAnalysis={handleRunFileAnalysis}
            isLoading={isAnalyzing}
          />
        )}

        {currentTab === 'analysis-result' && analysisResult && currentResume && (
          <AnalysisResultView
            result={analysisResult}
            resume={currentResume}
            onNewScan={() => handleNavigate('new-analysis')}
            isLoggedIn={!!currentUser}
            onNavigateToAuth={() => handleNavigate('auth')}
            onReRunAnalysis={handleReRunAnalysis}
          />
        )}

        {currentTab === 'auth' && (
          <AuthView
            onAuthSuccess={handleAuthSuccess}
            onNavigateHome={() => handleNavigate('landing')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            onNavigateToScanner={() => handleNavigate('new-analysis')}
            onNavigateToAuth={() => handleNavigate('auth')}
            userEmail={currentUser?.email}
          />
        )}

        {currentTab === 'compare-versions' && (
          <CompareView />
        )}

        {currentTab === 'quality-analyzer' && (
          <QualityAnalyzerView />
        )}

        {currentTab === 'best-fit' && (
          <BestFitView />
        )}

        {currentTab === 'admin-login' && (
          <AdminLoginView
            onLoginSuccess={handleAdminLogin}
            onCancel={() => handleNavigate('landing')}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardView
            adminUser={adminUser || undefined}
            onLogout={handleAdminLogout}
            onNavigateToApp={() => handleNavigate('new-analysis')}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
