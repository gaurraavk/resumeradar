import React, { useState } from 'react';
import { apiFetch } from '../lib/apiClient';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  plan: string;
  targetRole: string;
  scansRemaining: number;
  isGuest?: boolean;
}

interface Props {
  onLoginSuccess: (user: UserAccount, token: string) => void;
  onGuestLogin: () => void;
  onCancel: () => void;
  onSwitchToAdmin: () => void;
}

// Demo credentials — faculty can use these to log in with a real account
export const DEMO_EMAIL = 'demo@resumeradar.app';
export const DEMO_PASSWORD = 'Demo@1234';

const passwordMessage =
  'Password must contain at least 8 characters, including uppercase, lowercase, number and special character.';
const strongPassword = (value: string) =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9]/.test(value);

export const UserLoginView: React.FC<Props> = ({
  onLoginSuccess,
  onGuestLogin,
  onCancel,
  onSwitchToAdmin,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    targetRole: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const set =
    (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  // Pre-fill the demo credentials so faculty just has to click Login
  const fillDemoAccount = () => {
    setMode('signin');
    setError('');
    setSuccess('');
    setForm((f) => ({ ...f, email: DEMO_EMAIL, password: DEMO_PASSWORD }));
  };

  const validate = () => {
    if (mode === 'signup') {
      if (form.name.trim().length < 2 || !/[A-Za-z]/.test(form.name))
        return 'Please enter your full name.';
      if (!/^\S+@\S+\.\S+$/.test(form.email))
        return 'Please enter a valid email address.';
      if (!/^[A-Za-z0-9_]{4,}$/.test(form.username))
        return 'Username must contain at least 4 letters, numbers, or underscores and no spaces.';
      if (!/^\+?[0-9\s()-]{8,20}$/.test(form.mobile))
        return 'Please enter a valid mobile number.';
      if (!strongPassword(form.password)) return passwordMessage;
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    } else {
      if (!form.email.trim()) return 'Please enter your User ID or email.';
      if (!form.password) return 'Please enter your password.';
    }
    return '';
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    const issue = validate();
    if (issue) return setError(issue);
    setIsLoading(true);
    try {
      const payload =
        mode === 'signup'
          ? {
              name: form.name,
              email: form.email,
              username: form.username,
              mobile: form.mobile,
              password: form.password,
              targetRole: form.targetRole,
            }
          : { identifier: form.email, password: form.password };

      const response = await apiFetch(
        `/api/v1/auth/${mode === 'signup' ? 'register' : 'login'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to authenticate.');
      if (mode === 'signup') {
        setSuccess('Account created successfully. Please login.');
        setMode('signin');
        setForm((current) => ({ ...current, password: '', confirmPassword: '' }));
        return;
      }
      onLoginSuccess(result.data.user, result.data.token);
    } catch (err) {
      const raw = err instanceof Error ? err.message : '';
      const isNetworkError =
        raw.toLowerCase().includes('not valid json') ||
        raw.toLowerCase().includes('failed to fetch') ||
        raw.toLowerCase().includes('networkerror');
      setError(
        isNetworkError
          ? 'Cannot reach the server right now. Use the demo account or continue as a guest below.'
          : raw || 'Unable to authenticate.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const input = (
    key: keyof typeof form,
    label: string,
    type = 'text',
    placeholder = ''
  ) => (
    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-3">
      {label}
      <input
        type={type}
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
        className="mt-1.5 w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3.5 py-2.5 text-sm font-medium text-black focus:outline-none focus:border-black"
      />
    </label>
  );

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-[#faf9fe]">
      <div className="w-full max-w-md bg-white p-7 md:p-8 rounded-3xl border border-[#cfc4c5]/60 shadow-xl">

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xl mx-auto">
            RR
          </div>
          <h1 className="text-2xl font-black text-black">
            {mode === 'signin' ? 'Welcome Back to ResumeRadar' : 'Create Your Account'}
          </h1>
          <p className="text-xs text-[#7e7576]">
            {mode === 'signin'
              ? 'Sign in with your registered email or user ID.'
              : 'Create a secure account to start optimizing your resume.'}
          </p>
        </div>

        {/* Demo account quick-fill banner — visible on sign-in only */}
        {mode === 'signin' && (
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full mb-5 flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-400 hover:bg-amber-100 transition-all text-left group"
          >
            <span className="w-9 h-9 rounded-xl bg-amber-400 text-white flex items-center justify-center shrink-0 shadow-sm text-base font-black">
              D
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-amber-900 uppercase tracking-wide">
                Demo Account — Faculty Preview
              </p>
              <p className="text-[11px] text-amber-700 truncate mt-0.5">
                {DEMO_EMAIL} · click to pre-fill
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-amber-500 group-hover:text-amber-700 transition-colors shrink-0">
              arrow_forward
            </span>
          </button>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-1">
          {mode === 'signup' && (
            <>
              {input('name', 'Full Name', 'text', 'Jane Doe')}
              {input('email', 'Email Address', 'email', 'jane@example.com')}
              {input('username', 'Username / User ID', 'text', 'jane_doe')}
              {input('mobile', 'Mobile Number', 'tel', '+1 555 123 4567')}
              {input('targetRole', 'Target Role (optional)', 'text', 'Software Engineer')}
            </>
          )}
          {mode === 'signin' &&
            input('email', 'Username / User ID or Email', 'text', 'jane_doe or jane@example.com')}

          <label className="block text-xs font-bold text-black uppercase tracking-wider mb-3">
            Password
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3.5 py-2.5 pr-16 text-sm font-medium text-black focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-2.5 text-xs font-bold text-[#0058bc]"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {mode === 'signup' &&
            input('confirmPassword', 'Confirm Password', showPassword ? 'text' : 'password')}

          {error && (
            <p role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 bg-black hover:bg-neutral-800 text-white font-bold text-sm py-3 px-4 rounded-xl disabled:opacity-50"
          >
            {isLoading ? 'Please wait…' : mode === 'signin' ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#cfc4c5]/40" />
          <span className="text-[11px] text-[#7e7576] font-medium">or</span>
          <div className="flex-1 h-px bg-[#cfc4c5]/40" />
        </div>

        {/* Guest mode — no login required */}
        <button
          type="button"
          onClick={onGuestLogin}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#cfc4c5] hover:border-black text-black font-bold text-sm py-3 px-4 rounded-xl transition-all hover:bg-neutral-50 group"
        >
          <span className="material-symbols-outlined text-[18px] text-[#4c4546] group-hover:text-black transition-colors">
            play_circle
          </span>
          Explore as Guest — No Sign-up Needed
        </button>
        <p className="text-center text-[11px] text-[#7e7576] mt-2">
          Full demo with sample data. Nothing is saved.
        </p>

        {/* Footer links */}
        <div className="pt-5 mt-4 border-t border-[#cfc4c5]/40 text-center text-xs space-y-3">
          <button
            type="button"
            onClick={() => {
              setMode((v) => (v === 'signin' ? 'signup' : 'signin'));
              setError('');
              setSuccess('');
            }}
            className="text-[#0058bc] font-semibold hover:underline"
          >
            {mode === 'signin' ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="block mx-auto text-[#0058bc] font-semibold hover:underline"
          >
            Platform admin login
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="block mx-auto text-[#7e7576] hover:text-black"
          >
            Back to App Overview
          </button>
        </div>
      </div>
    </div>
  );
};
