import React, { useState } from 'react';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: string;
  targetRole: string;
  scansRemaining: number;
}

interface UserLoginViewProps {
  onLoginSuccess: (user: UserAccount) => void;
  onCancel: () => void;
  onSwitchToAdmin: () => void;
}

export const UserLoginView: React.FC<UserLoginViewProps> = ({
  onLoginSuccess,
  onCancel,
  onSwitchToAdmin,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('alex.morgan@domain.com');
  const [password, setPassword] = useState('candidate2026');
  const [name, setName] = useState('Alex Morgan');
  const [targetRole, setTargetRole] = useState('Senior Frontend Developer');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'signin') {
        if (email.trim() && password.length >= 4) {
          onLoginSuccess({
            id: 'usr-' + Math.random().toString(36).substring(2, 8),
            name: name || email.split('@')[0],
            email: email.trim(),
            avatarUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGk6RIz7xVTQf8V6aPSiciReTIFq7WHfYpb2dvvScvF_xnaIgpX9TJl2p-L3xtxJR83Lt0Lk5uPxnglGGL7fA8MRtm2JGMjR9cWLAsxvFw833r-4hnxYuRyHVguG4oqkepEg0INPDriJPrxFRJ2LlxGbg7620QOv4OqszftGZRZ7deUSCESAZIiFySYxJZ-BS0r7d6_9_M1AjYl6TWJxDowsI0r6wVrFdYbxPQGIoZKFEqZdxoEtr6Q',
            plan: 'Individual Pro',
            targetRole: targetRole || 'Senior Frontend Developer',
            scansRemaining: 48,
          });
        } else {
          setError('Please provide a valid email and password.');
        }
      } else {
        // Sign Up mode
        if (name.trim() && email.trim() && password.length >= 6) {
          onLoginSuccess({
            id: 'usr-' + Math.random().toString(36).substring(2, 8),
            name: name.trim(),
            email: email.trim(),
            avatarUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGk6RIz7xVTQf8V6aPSiciReTIFq7WHfYpb2dvvScvF_xnaIgpX9TJl2p-L3xtxJR83Lt0Lk5uPxnglGGL7fA8MRtm2JGMjR9cWLAsxvFw833r-4hnxYuRyHVguG4oqkepEg0INPDriJPrxFRJ2LlxGbg7620QOv4OqszftGZRZ7deUSCESAZIiFySYxJZ-BS0r7d6_9_M1AjYl6TWJxDowsI0r6wVrFdYbxPQGIoZKFEqZdxoEtr6Q',
            plan: 'Free Candidate Plan',
            targetRole: targetRole || 'Software Engineer',
            scansRemaining: 10,
          });
        } else {
          setError('Please fill in all fields with at least 6 characters for the password.');
        }
      }
      setIsLoading(false);
    }, 500);
  };

  const handleQuickDemo = (demoUser: { name: string; email: string; role: string; plan: string; quota: number }) => {
    setName(demoUser.name);
    setEmail(demoUser.email);
    setPassword('candidate2026');
    setTargetRole(demoUser.role);
    onLoginSuccess({
      id: 'usr-demo-' + demoUser.name.toLowerCase().replace(/\s+/g, '-'),
      name: demoUser.name,
      email: demoUser.email,
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGk6RIz7xVTQf8V6aPSiciReTIFq7WHfYpb2dvvScvF_xnaIgpX9TJl2p-L3xtxJR83Lt0Lk5uPxnglGGL7fA8MRtm2JGMjR9cWLAsxvFw833r-4hnxYuRyHVguG4oqkepEg0INPDriJPrxFRJ2LlxGbg7620QOv4OqszftGZRZ7deUSCESAZIiFySYxJZ-BS0r7d6_9_M1AjYl6TWJxDowsI0r6wVrFdYbxPQGIoZKFEqZdxoEtr6Q',
      plan: demoUser.plan,
      targetRole: demoUser.role,
      scansRemaining: demoUser.quota,
    });
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Please enter your email address to reset password.');
      return;
    }
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-[#faf9fe]">
      <div className="w-full max-w-md bg-white p-7 md:p-8 rounded-3xl border border-[#cfc4c5]/60 shadow-xl relative">
        {/* Logo & Headline */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xl mx-auto shadow-sm">
            RR
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            {mode === 'signin' ? 'Welcome Back to ResumeRadar' : 'Create Candidate Account'}
          </h1>
          <p className="text-xs text-[#7e7576]">
            {mode === 'signin'
              ? 'Access your resume scans, optimized versions, and ATS benchmarks.'
              : 'Start tailoring your resume to score 90+ on enterprise ATS algorithms.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex bg-[#faf9fe] rounded-xl p-1 border border-[#cfc4c5]/60 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signin' ? 'bg-black text-white shadow-xs' : 'text-[#4c4546] hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup' ? 'bg-black text-white shadow-xs' : 'text-[#4c4546] hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Candidate Profiles */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#faf9fe] border border-[#cfc4c5]/60 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-black uppercase tracking-wider">
              Quick 1-Click Candidate Login
            </span>
            <span className="text-[10px] text-green-700 font-semibold bg-green-100 px-2 py-0.5 rounded-full">
              Demo Ready
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                handleQuickDemo({
                  name: 'Alex Morgan',
                  email: 'alex.morgan@domain.com',
                  role: 'Senior Frontend Developer',
                  plan: 'Individual Pro',
                  quota: 48,
                })
              }
              className="p-2 bg-white hover:bg-neutral-50 rounded-xl border border-[#cfc4c5]/60 text-left transition-colors cursor-pointer group"
            >
              <span className="block font-bold text-xs text-black group-hover:text-[#0058bc]">
                Alex Morgan
              </span>
              <span className="block text-[10px] text-[#7e7576]">Frontend • 48 Scans</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickDemo({
                  name: 'Samantha Vance',
                  email: 'samantha.v@cloudcorp.io',
                  role: 'Full Stack Engineer',
                  plan: 'Enterprise Pro',
                  quota: 150,
                })
              }
              className="p-2 bg-white hover:bg-neutral-50 rounded-xl border border-[#cfc4c5]/60 text-left transition-colors cursor-pointer group"
            >
              <span className="block font-bold text-xs text-black group-hover:text-[#0058bc]">
                Samantha Vance
              </span>
              <span className="block text-[10px] text-[#7e7576]">Full Stack • Enterprise</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {forgotSent && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
            <span>Password reset instructions dispatched to {email}.</span>
          </div>
        )}

        {/* Login / Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-medium text-black focus:outline-none focus:border-black transition-colors"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#7e7576] text-[18px]">
                  badge
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@domain.com"
                className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-medium text-black focus:outline-none focus:border-black transition-colors"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#7e7576] text-[18px]">
                mail
              </span>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Primary Target Role
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-medium text-black focus:outline-none focus:border-black transition-colors"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#7e7576] text-[18px]">
                  work
                </span>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-black uppercase tracking-wider">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-semibold text-[#0058bc] hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs font-medium text-black focus:outline-none focus:border-black transition-colors"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#7e7576] text-[18px]">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#7e7576] hover:text-black cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#4c4546]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-black rounded cursor-pointer"
              />
              <span>Remember this browser</span>
            </label>
            <span className="text-[11px] text-[#7e7576]">256-Bit Encrypted</span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isLoading ? 'progress_activity' : mode === 'signin' ? 'login' : 'person_add'}
              </span>
              <span>
                {isLoading
                  ? 'Authenticating...'
                  : mode === 'signin'
                  ? 'Sign In to ResumeRadar'
                  : 'Complete Registration & Start'}
              </span>
            </button>
          </div>

          {/* Social Sign In Options */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#cfc4c5]/60"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-[#7e7576] font-semibold">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                handleQuickDemo({
                  name: 'Alex Morgan (Google)',
                  email: 'alex.morgan@gmail.com',
                  role: 'Senior Software Engineer',
                  plan: 'Individual Pro',
                  quota: 50,
                })
              }
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#cfc4c5]/80 bg-white hover:bg-[#faf9fe] text-xs font-semibold text-black transition-colors cursor-pointer"
            >
              <span className="font-bold text-sm">G</span>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickDemo({
                  name: 'Alex Morgan (GitHub)',
                  email: 'alex.morgan@github.com',
                  role: 'Frontend Architect',
                  plan: 'Individual Pro',
                  quota: 50,
                })
              }
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#cfc4c5]/80 bg-white hover:bg-[#faf9fe] text-xs font-semibold text-black transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>GitHub</span>
            </button>
          </div>

          {/* Switch to Admin portal link */}
          <div className="pt-3 border-t border-[#cfc4c5]/40 flex flex-col items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="text-[#0058bc] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              <span>Are you a platform admin? Switch to Admin Console</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-[#7e7576] hover:text-black font-semibold cursor-pointer transition-colors"
            >
              ← Back to App Overview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
