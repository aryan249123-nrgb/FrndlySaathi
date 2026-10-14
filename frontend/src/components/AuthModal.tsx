'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';
import { X, Mail, User, Lock, AlertCircle, ArrowLeftRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export default function AuthModal({ isOpen, initialMode = 'login', onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('FREELANCER');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-xl border border-[#e6ddce] text-[#221814]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#f7f2eb] hover:bg-[#ede4d8] text-[#6e5e54] hover:text-[#221814] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] text-[#b45309] mx-auto mb-3 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-[#221814] tracking-tight">
            {isRegister ? 'Join the Community' : 'Welcome to Frndly Saathi'}
          </h2>
          <p className="text-xs text-[#6e5e54] mt-1.5">
            {isRegister
              ? 'Exchange skills, swap expertise, and collaborate for mutual benefit'
              : 'Sign in to access your parallel dashboard, tasks, and barter contracts'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#f7f2eb] rounded-xl border border-[#e6ddce] mb-5">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              !isRegister
                ? 'bg-white text-[#221814] shadow-xs'
                : 'text-[#6e5e54] hover:text-[#221814]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              isRegister
                ? 'bg-white text-[#221814] shadow-xs'
                : 'text-[#6e5e54] hover:text-[#221814]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#8c796b]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] placeholder-[#a69788] focus:outline-none focus:border-[#b45309]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8c796b]" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] placeholder-[#a69788] focus:outline-none focus:border-[#b45309]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8c796b]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] placeholder-[#a69788] focus:outline-none focus:border-[#b45309]"
              />
            </div>
          </div>

          {isRegister && (
            <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#e6ddce] flex items-center gap-2.5 text-xs text-[#6e5e54]">
              <ArrowLeftRight className="w-4 h-4 text-[#b45309] shrink-0" />
              <span>Full parallel access to both <strong>Task Gigs</strong> &amp; <strong>Barter Swaps</strong>.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl text-xs font-bold text-white bg-[#b45309] hover:bg-[#9a4408] transition-all shadow-sm"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Join Network' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
