import React, { useState } from 'react';
import { apiFetch } from '../lib/apiClient';

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
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Admin login failed.');
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
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-6 py-12 bg-[#f5f5f7] animate-entrance">
      <div className="w-full max-w-md macos-card-elevated p-8 md:p-10 rounded-3xl">
        <div className="text-center space-y-2 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center font-semibold text-base mx-auto shadow-2xs">
            RR
          </div>
          <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">Admin Portal</h1>
          <p className="text-[13px] text-neutral-400 font-normal">Sign in with your administrator credentials.</p>
        </div>

        {error && (
          <p role="alert" className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-700 text-[13px] font-normal leading-relaxed">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-[13px] font-medium text-neutral-600">
            Admin Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full bg-[#f5f5f7] text-[#1d1d1f] placeholder:text-neutral-400 focus:bg-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/[0.06] border border-black/[0.04] transition-all duration-300 font-normal"
            />
          </label>

          <label className="block text-[13px] font-medium text-neutral-600">
            Password
            <div className="relative mt-1.5">
              <input
                type={show ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f5f5f7] text-[#1d1d1f] placeholder:text-neutral-400 focus:bg-white rounded-2xl px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-black/[0.06] border border-black/[0.04] transition-all duration-300 font-normal"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-3 text-[13px] font-medium text-neutral-400 hover:text-[#1d1d1f] cursor-pointer transition-colors duration-300 active:scale-[0.98]"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button
            disabled={loading}
            className="w-full bg-[#1d1d1f] text-white font-medium text-[14px] py-3.5 rounded-2xl disabled:opacity-50 hover:bg-neutral-800 transition-all duration-300 cursor-pointer active:scale-[0.98] shadow-sm mt-2"
          >
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full text-[13px] font-medium text-neutral-400 hover:text-[#1d1d1f] transition-colors duration-300 cursor-pointer mt-2 active:scale-[0.98]"
          >
            Return to Application
          </button>
        </form>
      </div>
    </div>
  );
};
