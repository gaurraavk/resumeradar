import React, { useState } from 'react';
import { apiFetch, setUserToken } from '../lib/apiClient';
import { UserSummary } from '../types';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  onAuthSuccess: (user: UserSummary) => void;
  onNavigateHome: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onNavigateHome,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name');
        return;
      }
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters long');
        return;
      }
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/api/v1/auth/register' : '/api/v1/auth/login';
      const payload = mode === 'register'
        ? { fullName: fullName.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 409) {
          setErrorMessage('An account with this email already exists. Try signing in.');
        } else if (response.status === 401) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else {
          setErrorMessage(data.message || 'Something went wrong. Please check your details.');
        }
        setLoading(false);
        return;
      }

      if (data.data?.token && data.data?.user) {
        setUserToken(data.data.token);
        onAuthSuccess(data.data.user);
      } else {
        setErrorMessage('Unexpected response format from server.');
      }
    } catch (err: any) {
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-12 animate-entrance">
      <div className="macos-card p-8 rounded-3xl space-y-6 shadow-sm border border-black/[0.06]">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
            <span className="material-symbols-outlined text-[24px]">
              {mode === 'login' ? 'lock_open' : 'person_add'}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-[13px] text-neutral-500 font-normal">
            {mode === 'login'
              ? 'Sign in to access your saved resume scan history'
              : 'Save your ATS match history and unlock candidate insights'}
          </p>
        </div>

        {/* Toggle Pills */}
        <div className="flex p-1 bg-black/[0.04] rounded-2xl border border-black/[0.04]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-[13px] font-medium rounded-xl transition-all duration-200 cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#1d1d1f] shadow-xs'
                : 'text-neutral-500 hover:text-[#1d1d1f]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-[13px] font-medium rounded-xl transition-all duration-200 cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#1d1d1f] shadow-xs'
                : 'text-neutral-500 hover:text-[#1d1d1f]'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-700 text-[13px] flex items-start gap-2">
            <span className="material-symbols-outlined text-[17px] shrink-0 mt-0.5">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-neutral-600 tracking-wide uppercase">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jane Doe"
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-[#fbfbfd] text-[#1d1d1f] text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-neutral-600 tracking-wide uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-[#fbfbfd] text-[#1d1d1f] text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-neutral-600 tracking-wide uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Minimum 8 characters' : 'Your password'}
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-[#fbfbfd] text-[#1d1d1f] text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-[#1d1d1f] hover:bg-black text-white text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99] shadow-sm"
          >
            {loading ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-[13px] text-neutral-400 hover:text-neutral-600 font-medium cursor-pointer transition-colors"
          >
            ← Back to scanner
          </button>
        </div>
      </div>
    </div>
  );
};
