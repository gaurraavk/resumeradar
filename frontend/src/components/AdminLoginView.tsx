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
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-6 py-12 bg-neutral-50">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm">
        <div className="text-center space-y-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-lg mx-auto">
            RR
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900">Admin Portal</h1>
          <p className="text-[13px] text-neutral-400">Sign in with your administrator account.</p>
        </div>

        {error && (
          <p role="alert" className="mb-5 p-3 rounded-xl bg-red-50 text-red-600 text-[13px]">
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
              className="mt-1.5 w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all duration-200 border-0"
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
                className="w-full bg-neutral-50 rounded-xl px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all duration-200 border-0"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-3 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors duration-200"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button
            disabled={loading}
            className="w-full bg-neutral-900 text-white font-medium text-[14px] py-3 rounded-2xl disabled:opacity-50 hover:bg-neutral-700 transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full text-[13px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors duration-200 cursor-pointer mt-2"
          >
            Return to Application
          </button>
        </form>
      </div>
    </div>
  );
};
