import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Zap, 
  UserCheck, 
  MonitorPlay,
  ArrowLeft,
  UploadCloud,
  Star
} from 'lucide-react';
import { useApp } from '@/context';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, register, addToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.success) {
          if (addToast) addToast(`Welcome back!`, 'success');
          if (result.userType === 'admin') {
            onNavigate('/admin/dashboard');
          } else {
            onNavigate('/editor/dashboard');
          }
        } else {
          setError(result.error || 'Invalid email or password.');
        }
      } else {
        const result = await register(email, password);
        if (result.success) {
          if (addToast) addToast('Account created! Welcome to the Gogangs network.', 'success');
          onNavigate('/editor/profile');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch {
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login Shortcuts
  const handleQuickDemo = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');
    try {
      const result = await login(demoEmail, demoPass);
      if (result.success) {
        if (result.userType === 'admin') {
          if (addToast) addToast('Logged in as Agency Admin Demo', 'success');
          onNavigate('/admin/dashboard');
        } else {
          if (addToast) addToast('Logged in as Video Editor Demo', 'success');
          onNavigate('/editor/dashboard');
        }
      }
    } catch {
      setError('Demo authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col justify-between font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
      
      {/* Top Header */}
      <header className="px-6 sm:px-12 py-5 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1.5 focus:outline-none group hover:scale-105 transition-transform cursor-pointer"
        >
          <span className="text-xl font-black tracking-tight text-gray-900 flex items-center">
            gogangs<span className="text-pink-500 font-black text-2xl leading-none">.</span>
          </span>
        </button>

        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-200 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>
      </header>

      {/* Main Authentication Grid */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
          
          {/* Left Column: Form & Quick Demo Logins (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-12 space-y-6">
            
            {/* Header / Mode Switcher */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Production Security Escrow</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {mode === 'login' ? 'Access Your Workspace' : 'Apply as a Video Specialist'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {mode === 'login' 
                  ? 'Sign in to manage active production milestones and 1GB Cloudflare R2 cloud buckets.' 
                  : 'Submit your profile to join the top 1% verified video editor talent network.'}
              </p>
            </div>

            {/* Persona Mode Tabs */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In to Platform
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Create Editor Account
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account & Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* 1-Click Quick Demo Switchers */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                ⚡ Quick 1-Click Interactive Demo Logins:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin@gogangs.com', 'admin1234')}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <ShieldCheck className="w-4 h-4 text-gray-700" />
                    <span>Agency Admin Demo</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('marcus@gogangs.com', 'demo1234')}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <MonitorPlay className="w-4 h-4 text-gray-700" />
                    <span>Marcus Chen Demo</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">Editor</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Cinematic Showcase & Platform Highlights (5 cols) */}
          <div className="lg:col-span-5 bg-gray-900 text-white p-8 sm:p-10 flex flex-col justify-between space-y-6 h-full min-h-[480px]">
            
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CLOUDFLARE R2 POWERED
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                The Video Production & Talent Operating System.
              </h3>

              <div className="space-y-3 text-xs text-gray-300 font-medium">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dedicated 1GB high-speed R2 cloud workspace per editor</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Frame-accurate versioning (v1, v2) with zero transfer bottlenecks</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>5-stage verified top 1% video editing specialists</span>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
              <p className="text-xs text-gray-300 italic">
                "Gogangs eliminated all Google Drive file chaos for our agency. Milestones are delivered 3.5x faster."
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Reviewer" 
                  className="w-6 h-6 rounded-full object-cover" 
                />
                <span className="font-bold text-white">Creative Lead, Apex Studios</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Simple Footer */}
      <footer className="px-6 py-4 text-center text-xs text-gray-400">
        © 2026 Gogangs Platform, Inc. All rights reserved.
      </footer>

    </div>
  );
}
