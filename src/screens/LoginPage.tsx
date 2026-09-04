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
  Star,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Film,
  Layers,
  HelpCircle,
  FolderLock
} from 'lucide-react';
import { useApp } from '@/context';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, register, addToast, darkMode, toggleDarkMode } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('DaVinci Colorist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
          if (addToast) addToast(`Welcome back to Gogangs!`, 'success');
          if (email.includes('admin')) {
            onNavigate('/admin/dashboard');
          } else {
            onNavigate('/editor/dashboard');
          }
        } else {
          setError(result.error || 'Invalid credentials. Please verify your email and password.');
        }
      } else {
        const result = await register(email, password);
        if (result.success) {
          if (addToast) addToast(`Welcome ${fullName || 'Editor'}! Your Gogangs workspace is ready.`, 'success');
          onNavigate('/editor/dashboard');
        } else {
          setError(result.error || 'Registration could not be completed.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] flex flex-col justify-between font-sans text-gray-900 dark:text-zinc-100 selection:bg-gray-900 selection:text-white transition-colors duration-300">
      
      {/* Top Navbar Header */}
      <header className="px-6 sm:px-12 py-5 flex items-center justify-between border-b border-gray-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-30">
        <button 
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1.5 focus:outline-none group hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
            Gogangs<span className="text-pink-500 font-black text-2xl leading-none">.</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/80 dark:border-zinc-700/80 transition-all cursor-pointer shadow-2xs"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-700" />
            )}
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-zinc-200 hover:text-black dark:hover:text-white bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 transition-all shadow-2xs cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
          
          {/* Left Column: Form & Interaction Area (7 Columns) */}
          <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Badge & Heading */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 text-[10px] font-extrabold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Secure Workspace Portal</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Join as a Video Editor'}
                </h1>
                
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {mode === 'login' 
                    ? 'Access your frame-accurate review queue and 1GB Cloudflare R2 storage.' 
                    : 'Create your editor profile to get hired by global creators and brand studios.'}
                </p>
              </div>

              {/* Persona Mode Switcher Tabs */}
              <div className="flex items-center p-1 bg-gray-100 dark:bg-zinc-800/90 rounded-2xl border border-gray-200/80 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'login' 
                      ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs' 
                      : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'register' 
                      ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs' 
                      : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Alert Box */}
              {error && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl text-xs text-red-700 dark:text-red-300 font-medium flex items-start gap-2.5 animate-fade-in">
                  <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">!</div>
                  <div className="leading-snug">{error}</div>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Additional Registration Fields */}
                {mode === 'register' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider text-[10px]">
                        Full Name / Studio Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl px-3.5 py-3 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider text-[10px]">
                        Primary Editing Specialty
                      </label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl px-3.5 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                      >
                        <option>DaVinci Resolve Colorist</option>
                        <option>Commercial & Brand Editor</option>
                        <option>Shorts & Viral Reels Specialist</option>
                        <option>3D Motion Graphics & VFX</option>
                        <option>Documentary & Long-Form</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider text-[10px]">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="editor@studio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl pl-10 pr-3.5 py-3 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                    />
                    <Mail className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Password Input with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider text-[10px]">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (addToast) addToast('Password reset link sent to your email (if registered).', 'info');
                        }}
                        className="text-[10px] text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl pl-10 pr-10 py-3 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                    />
                    <Lock className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 p-0.5 rounded cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-gray-900 dark:accent-white cursor-pointer"
                    />
                    <span>Remember this device</span>
                  </label>
                  
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
                    256-bit SSL
                  </span>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-bold text-xs py-3.5 rounded-xl shadow-md hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Editor Account & Continue'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Test Helper (Discreet Sample Fill) */}
            <div className="pt-5 border-t border-gray-100 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                <span>Quick Test Credentials:</span>
                <span className="text-[9px] font-normal text-emerald-600 dark:text-emerald-400">Auto-fill 1-Click</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@gogangs.com', 'admin1234')}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/80 dark:border-zinc-700 text-left transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">Admin Portal</div>
                    <div className="text-[9px] text-gray-500 dark:text-zinc-400">admin@gogangs.com</div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('marcus@gogangs.com', 'demo1234')}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/80 dark:border-zinc-700 text-left transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">Editor Portal</div>
                    <div className="text-[9px] text-gray-500 dark:text-zinc-400">marcus@gogangs.com</div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: High-End Feature Deck & Visuals (5 Columns) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8 sm:p-10 flex flex-col justify-between space-y-6 h-full border-t lg:border-t-0 lg:border-l border-gray-800 relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Deck Content */}
            <div className="space-y-6 relative z-10">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-[10px] font-mono font-bold border border-white/10 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>CLOUDFLARE R2 POWERED</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  Accelerate Your Video Post-Production.
                </h2>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Join hundreds of top video creators delivering cinematic cuts with zero transfer latency.
                </p>
              </div>

              {/* Value Props Checklist */}
              <div className="space-y-3.5 text-xs text-gray-300 font-medium">
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <UploadCloud className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-[11px]">1GB High-Speed R2 Storage</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Zero upload bottlenecks for 4K ProRes & RAW cuts.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-[11px]">Frame-Accurate Approvals</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Timestamped marker reviews with client escrow protection.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-[11px]">Verified Pro Creator Status</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Direct client inquiries routed to your vetted profile.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial Banner */}
            <div className="relative z-10 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[11px] text-gray-300 italic leading-relaxed">
                "Gogangs is the standard operating system for video creators. File management is effortless."
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400">
                <span className="font-bold text-white">Apex Creative Studios</span>
                <span>Verified Client</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Clean Footer */}
      <footer className="px-6 py-5 text-center text-xs text-gray-400 dark:text-zinc-600 border-t border-gray-200/60 dark:border-zinc-800/60">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px]">
          <span>© 2026 Gogangs Platform, Inc. All rights reserved.</span>
          <span className="hidden sm:inline">•</span>
          <span>Encrypted Video Operations Network</span>
        </div>
      </footer>

    </div>
  );
}

