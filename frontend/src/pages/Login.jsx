import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    // Simulate brief network delay
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate(result.user.role === 'employer' ? '/employer' : '/employee', { replace: true });
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 400);
  };

  const fillDemo = (role) => {
    if (role === 'employee') {
      setEmail('employee@appulse.io');
      setPassword('password');
    } else {
      setEmail('admin@appulse.io');
      setPassword('password');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-blue-dark flex">
      {/* Left – branding panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative z-10 max-w-md px-12 text-center">
          {/* Logo */}
          <div className="mb-8 inline-block">
            <svg viewBox="0 0 32 32" className="w-20 h-20">
              <path d="M16 3 L5 28 L11 28 L16 16 L21 28 L27 28 Z" fill="#3B82F6" />
              <path d="M5 28 L11 28 L16 16 L13 16 Z" fill="#DC2626" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            AP <span className="text-blue-400">Pulse</span>
          </h1>
          <p className="text-blue-200/80 text-lg font-light leading-relaxed">
            Smart indoor navigation &amp; engagement for modern workplaces
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 text-left">
            {[
              { label: 'Navigation', desc: 'Fastest routes inside your office' },
              { label: 'Room Booking', desc: 'Live availability & schedules' },
              { label: 'Analytics', desc: 'Movement heatmaps & insights' },
              { label: 'Ad Zones', desc: 'Engagement & monetization' },
            ].map((f) => (
              <div key={f.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-sm font-semibold text-white">{f.label}</div>
                <div className="text-xs text-blue-200/60 mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right – login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <svg viewBox="0 0 32 32" className="w-14 h-14 mx-auto mb-3">
              <path d="M16 3 L5 28 L11 28 L16 16 L21 28 L27 28 Z" fill="#3B82F6" />
              <path d="M5 28 L11 28 L16 16 L13 16 Z" fill="#DC2626" />
            </svg>
            <h1 className="text-2xl font-extrabold text-white">
              AP <span className="text-blue-400">Pulse</span>
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-surface-200 rounded-xl bg-surface-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 text-sm border border-surface-200 rounded-xl bg-surface-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <span className="text-sm text-slate-500">Don't have an account? </span>
              <Link to="/signup" className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors">
                Sign up <ArrowRight className="inline w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Demo accounts */}
            <div className="mt-6 pt-5 border-t border-surface-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">Quick Demo Access</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('employee')}
                  className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all group"
                >
                  <span className="text-xs font-bold text-brand-blue">Employee</span>
                  <span className="text-[10px] text-blue-400 group-hover:text-blue-500">employee@appulse.io</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('employer')}
                  className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group"
                >
                  <span className="text-xs font-bold text-slate-700">Employer</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-500">admin@appulse.io</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
