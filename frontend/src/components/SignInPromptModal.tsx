import React from 'react';
import type { UserAccount } from './UserLoginView';

interface Props { isOpen: boolean; onClose: () => void; onLoginSuccess: (user: UserAccount) => void; onNavigateToFullLogin: () => void; onOpenLinkedInConnect?: () => void; }
export const SignInPromptModal: React.FC<Props> = ({ isOpen, onClose, onNavigateToFullLogin }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"><div role="dialog" aria-modal="true" aria-labelledby="sign-in-required" className="bg-white rounded-3xl border border-[#cfc4c5]/80 shadow-2xl max-w-md w-full p-7 text-center"><div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-lg mx-auto mb-4">RR</div><h2 id="sign-in-required" className="text-2xl font-black text-black">Sign in required</h2><p className="mt-2 text-sm text-[#4c4546]">Create an account or log in with your registered credentials to continue.</p><button type="button" onClick={onNavigateToFullLogin} className="mt-6 w-full bg-black text-white font-bold text-sm py-3 rounded-xl">Go to Login</button><button type="button" onClick={onClose} className="mt-3 text-xs font-semibold text-[#7e7576] hover:text-black">Cancel</button></div></div>;
};
