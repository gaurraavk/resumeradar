import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { LandingView } from './components/LandingView';
import { NewAnalysisView } from './components/NewAnalysisView';
import { AnalysisResultView } from './components/AnalysisResultView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { BestFitView } from './components/BestFitView';
import { Footer } from './components/Footer';

import {
  ResumeData,
  AnalysisResult,
  AnalysisFileResult,
} from './types';

import { apiFetch, apiUpload } from './lib/apiClient';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | AnalysisFileResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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

  // Text-only analysis (existing endpoint)
  const handleRunAnalysis = async (resume: ResumeData, jobDescription: string, jobTitle: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentResume(resume);

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

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ message: 'Analysis failed.' }));
        throw new Error(errJson.message || `Analysis failed with status ${response.status}`);
      }

      const resData = await response.json();
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

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ message: 'Analysis failed.' }));
        throw new Error(errJson.message || `Analysis failed with status ${response.status}`);
      }

      const resData = await response.json();
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] text-[#1d1d1f] antialiased selection:bg-[#1d1d1f] selection:text-white">
      <TopNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        isAdminLoggedIn={!!adminUser}
        onAdminLogout={handleAdminLogout}
      />

      <main className="flex-1 flex flex-col">
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
          />
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
