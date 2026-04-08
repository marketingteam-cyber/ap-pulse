import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Navigation,
} from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = signup({ name, email, password, role });
      if (result.success) {
        navigate(result.user.role === 'employer' ? '/employer' : '/employee', { replace: true });
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-blue-dark flex">
      {/* Left – branding panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative z-10 max-w-md px-12 text-center">
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
            Join your workplace's smart navigation platform
          </p>

          <div className="mt-12 space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Navigation className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-white font-semibold">Employee Portal</div>
              </div>
              <ul className="space-y-1.5 text-sm text-blue-200/70 ml-12">
                <li>Find fastest routes inside the office</li>
                <li>Check meeting room availability</li>
                <li>Search for rooms and colleagues</li>
              </ul>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-white font-semibold">Employer Portal</div>
              </div>
              <ul className="space-y-1.5 text-sm text-blue-200/70 ml-12">
                <li>View movement heatmaps &amp; analytics</li>
                <li>Manage ad placement zones</li>
                <li>Monitor room utilization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right – signup form */}
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
              <h2 className="text-xl font-bold text-slate-800">Create your account</h2>
              <p className="text-sm text-slate-500 mt-1">Get started with AP Pulse in seconds</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">I am an</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('employee')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                      role === 'employee'
                        ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-sm'
                        : 'border-surface-200 bg-white text-slate-500 hover:border-surface-300'
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                    Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                      role === 'employer'
                        ? 'border-slate-800 bg-slate-50 text-slate-800 shadow-sm'
                        : 'border-surface-200 bg-white text-slate-500 hover:border-surface-300'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Employer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-surface-200 rounded-xl bg-surface-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    autoComplete="name"
                  />
                </div>
              </div>

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
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-11 py-3 text-sm border border-surface-200 rounded-xl bg-surface-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    autoComplete="new-password"
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
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
