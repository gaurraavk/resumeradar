import React, { useState } from 'react';
import { apiFetch, safeJson, setUserToken } from '../lib/apiClient';
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const normalizedEmail = email.trim().toLowerCase();

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

    if (!normalizedEmail || !password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/api/v1/auth/register' : '/api/v1/auth/login';
      const payload = mode === 'register'
        ? { fullName: fullName.trim(), email: normalizedEmail, password }
        : { email: normalizedEmail, password };

      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(response);

      if (!response.ok || !data.success) {
        if (response.status === 409) {
          setErrorMessage(data.message || 'An account with this email already exists - try signing in.');
        } else if (response.status === 401) {
          setErrorMessage(data.message || 'Invalid email or password. Please try again.');
        } else {
          setErrorMessage(data.message || 'Something went wrong. Please check your details.');
        }
        setLoading(false);
        return;
      }

      if (data.data?.token && data.data?.user) {
        // Auto sign-in on both register and login
        setUserToken(data.data.token);
        onAuthSuccess(data.data.user);
      } else {
        setErrorMessage('Unexpected response format from server.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-12 animate-entrance">
      <div className="glass-card p-8 sm:p-10 rounded-3xl space-y-6 shadow-[0_16px_48px_rgba(21,38,60,0.08)]">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#15263c] text-[#fbf9f4] mb-2 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">
              {mode === 'login' ? 'lock_open' : 'person_add'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#15263c] tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-[13.5px] text-[#15263c]/70 font-normal">
            {mode === 'login'
              ? 'Sign in to access your saved resume scan history'
              : 'Save your ATS match history and unlock candidate insights'}
          </p>
        </div>

        {/* Toggle Pills */}
        <div className="flex p-1 bg-white/45 backdrop-blur-md rounded-full border border-[#15263c]/10">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-[13px] font-medium rounded-full transition-all duration-200 cursor-pointer ${
              mode === 'login'
                ? 'bg-[#15263c] text-[#fbf9f4] shadow-xs'
                : 'text-[#15263c]/70 hover:text-[#15263c]'
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
            className={`flex-1 py-2 text-[13px] font-medium rounded-full transition-all duration-200 cursor-pointer ${
              mode === 'register'
                ? 'bg-[#15263c] text-[#fbf9f4] shadow-xs'
                : 'text-[#15263c]/70 hover:text-[#15263c]'
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
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#15263c]/60 block font-bold">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jane Doe"
                autoComplete="name"
                required
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-[14px]"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#15263c]/60 block font-bold">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-[14px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#15263c]/60 block font-bold">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Minimum 8 characters' : 'Your password'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                required
                className="w-full pl-4 pr-11 py-2.5 rounded-2xl glass-input text-[14px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 text-[#15263c]/50 hover:text-[#15263c] cursor-pointer p-1 rounded-lg focus:outline-none"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={`w-full mt-2 py-3 rounded-full bg-[#15263c] text-[#fbf9f4] text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(21,38,60,0.18)] ${
              loading
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-black cursor-pointer active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
              </>
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
