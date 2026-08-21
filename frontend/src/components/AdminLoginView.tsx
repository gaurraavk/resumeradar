import React, { useState } from 'react';

interface AdminLoginViewProps {
  onLoginSuccess: (user: { email: string; name: string; role: string }) => void;
  onCancel: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState('admin@resumeradar.io');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials (demo admin)
      if (email.trim() === 'admin@resumeradar.io' && password === 'admin123') {
        onLoginSuccess({
          email: 'admin@resumeradar.io',
          name: 'Chief Admin',
          role: 'Super Administrator',
        });
      } else if (email.trim().length > 3 && password.length >= 6) {
        // Allow flexible admin access for testing
        onLoginSuccess({
          email: email.trim(),
          name: email.split('@')[0].toUpperCase(),
          role: 'Administrator',
        });
      } else {
        setError('Invalid admin credentials. Please use admin@resumeradar.io / admin123');
      }
      setIsLoading(false);
    }, 600);
  };

  const handleDemoFill = () => {
    setEmail('admin@resumeradar.io');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-[#faf9fe]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#cfc4c5]/60 shadow-lg relative">
        {/* Top Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-extrabold text-xl mx-auto shadow-sm">
            RR
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">Admin Portal</h1>
          <p className="text-xs text-[#7e7576]">
            Secure administrative console for platform management, user activity, and API telemetry.
          </p>
        </div>

        {/* Demo Credential Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-[#faf9fe] border border-[#cfc4c5]/60 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-black block text-[11px] uppercase tracking-wider">Demo Credentials</span>
            <span className="text-[#4c4546] text-[11px] font-mono">admin@resumeradar.io / admin123</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-xs font-bold text-[#0058bc] hover:underline cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@resumeradar.io"
                className="w-full bg-[#faf9fe] border border-[#cfc4c5]/80 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-medium text-black focus:outline-none focus:border-black transition-colors"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#7e7576] text-[18px]">
                mail
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-black uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-[#7e7576]">Required</span>
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isLoading ? 'progress_activity' : 'shield_person'}
              </span>
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Admin Console'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-full text-center text-xs font-semibold text-[#7e7576] hover:text-black py-2 cursor-pointer transition-colors"
          >
            ← Return to Application
          </button>
        </form>
      </div>
    </div>
  );
};
