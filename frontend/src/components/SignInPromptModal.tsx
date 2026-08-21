import React, { useState } from 'react';
import { UserAccount } from './UserLoginView';

interface SignInPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onNavigateToFullLogin: () => void;
  onOpenLinkedInConnect?: () => void;
}

export const SignInPromptModal: React.FC<SignInPromptModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onNavigateToFullLogin,
  onOpenLinkedInConnect,
}) => {
  const [email, setEmail] = useState('alex.morgan@domain.com');
  const [password, setPassword] = useState('candidate2026');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('Alex Morgan');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        id: 'usr-demo-alex',
        name: 'Alex Morgan',
        email: 'alex.morgan@domain.com',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGk6RIz7xVTQf8V6aPSiciReTIFq7WHfYpb2dvvScvF_xnaIgpX9TJl2p-L3xtxJR83Lt0Lk5uPxnglGGL7fA8MRtm2JGMjR9cWLAsxvFw833r-4hnxYuRyHVguG4oqkepEg0INPDriJPrxFRJ2LlxGbg7620QOv4OqszftGZRZ7deUSCESAZIiFySYxJZ-BS0r7d6_9_M1AjYl6TWJxDowsI0r6wVrFdYbxPQGIoZKFEqZdxoEtr6Q',
        plan: 'Individual Pro',
        targetRole: 'Senior Frontend Developer',
        scansRemaining: 48,
      });
      setIsLoading(false);
    }, 300);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
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
            targetRole: 'Senior Software Engineer',
            scansRemaining: 48,
          });
        } else {
          setError('Please enter a valid email and password.');
        }
      } else {
        if (name.trim() && email.trim() && password.length >= 6) {
          onLoginSuccess({
            id: 'usr-' + Math.random().toString(36).substring(2, 8),
            name: name.trim(),
            email: email.trim(),
            avatarUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGk6RIz7xVTQf8V6aPSiciReTIFq7WHfYpb2dvvScvF_xnaIgpX9TJl2p-L3xtxJR83Lt0Lk5uPxnglGGL7fA8MRtm2JGMjR9cWLAsxvFw833r-4hnxYuRyHVguG4oqkepEg0INPDriJPrxFRJ2LlxGbg7620QOv4OqszftGZRZ7deUSCESAZIiFySYxJZ-BS0r7d6_9_M1AjYl6TWJxDowsI0r6wVrFdYbxPQGIoZKFEqZdxoEtr6Q',
            plan: 'Free Candidate Plan',
            targetRole: 'Software Engineer',
            scansRemaining: 10,
          });
        } else {
          setError('Please fill in all fields with at least 6 characters for the password.');
        }
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#cfc4c5]/80 shadow-2xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-black p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Close modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Badge & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-lg mx-auto shadow-sm">
            RR
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight">
            Sign In to Start Your Scan
          </h2>
          <p className="text-xs text-[#4c4546] leading-relaxed max-w-xs mx-auto">
            Please sign in or create a free account to upload your resume, match job requirements, and get precision ATS optimization.
          </p>
        </div>

        {/* 1-Click Fast Demo Login Option (Highest Convenience) */}
        <div className="mb-5 p-3.5 rounded-2xl bg-[#faf9fe] border border-[#cfc4c5]/60 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-black uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-amber-600">bolt</span>
              Fast 1-Click Demo Access
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              No Password Needed
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">rocket_launch</span>
            <span>Sign In Instantly as Alex Morgan (Demo)</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-neutral-200"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-[#7e7576] uppercase tracking-wider">
            or sign in with email
          </span>
          <div className="flex-grow border-t border-neutral-200"></div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#faf9fe] rounded-xl p-1 border border-[#cfc4c5]/60 my-3">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup' ? 'bg-black text-white shadow-xs' : 'text-[#4c4546] hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3 py-2 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.morgan@domain.com"
              className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3 py-2 text-xs font-medium text-black focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3 py-2 text-xs font-medium text-black focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-neutral-50 text-black border border-black text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-50 mt-2"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>{mode === 'signin' ? 'Sign In & Continue to Scan' : 'Register & Start Scan'}</span>
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-[#7e7576]">
          <button
            type="button"
            onClick={onNavigateToFullLogin}
            className="text-black font-semibold hover:underline cursor-pointer"
          >
            Go to Full Sign In Page →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-black cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
