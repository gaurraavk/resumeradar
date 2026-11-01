import React, { useState } from 'react';
import { apiFetch, safeJson } from '../lib/apiClient';

interface Props {
  onLoginSuccess: (user: { email: string; name: string; role: string }) => void;
  onCancel: () => void;
}

export const AdminLoginView: React.FC<Props> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password) return setError('Email and password are required.');
    setLoading(true);
    try {
      const response = await apiFetch('/api/v1/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const result = await safeJson(response);
      if (!response.ok || !result.success) throw new Error(result.message || 'Admin login failed.');
      localStorage.setItem('resumeradar_admin_token', result.data.token);
      onLoginSuccess({
        email: result.data.user.email,
        name: result.data.user.name,
        role: result.data.user.role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-6 py-12 animate-entrance">
      <div className="w-full max-w-md glass-card p-8 md:p-10 rounded-3xl shadow-[0_16px_48px_rgba(21,38,60,0.08)]">
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#15263c] text-[#fbf9f4] flex items-center justify-center font-mono font-bold text-base mx-auto shadow-xs">
            RR
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-[#15263c]/60 font-bold block">
            ADMIN // SECURE GATEWAY
          </span>
          <h1 className="text-2xl font-extrabold text-[#15263c] tracking-tight">Admin Portal</h1>
          <p className="text-[13.5px] text-[#15263c]/70 font-normal">Sign in with your administrator credentials.</p>
        </div>

        {error && (
          <p role="alert" className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-700 text-[13px] font-normal leading-relaxed">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#15263c]/60 font-bold">
            Admin Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full glass-input rounded-2xl px-4 py-3 text-sm font-normal"
            />
          </label>

          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#15263c]/60 font-bold">
            Password
            <div className="relative mt-1.5">
              <input
                type={show ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input rounded-2xl px-4 py-3 pr-16 text-sm font-normal"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-3 text-[13px] font-medium text-[#15263c]/50 hover:text-[#15263c] cursor-pointer transition-colors duration-200 active:scale-[0.98]"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button
            disabled={loading}
            className="w-full bg-[#15263c] text-[#fbf9f4] font-medium text-[14px] py-3.5 rounded-full disabled:opacity-50 hover:bg-[#1f3757] transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-[0_4px_16px_rgba(21,38,60,0.18)] mt-2"
          >
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full text-[13px] font-medium text-[#15263c]/60 hover:text-[#15263c] transition-colors duration-200 cursor-pointer mt-2 active:scale-[0.98]"
          >
            Return to Application
          </button>
        </form>
      </div>
    </div>
  );
};
