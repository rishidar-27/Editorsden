import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Layers,
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  Star,
  Film,
  UploadCloud,
  ShieldCheck,
  Zap,
  Target,
  Maximize2,
  Wand2,
  Camera,
  Award,
  Clock,
  Briefcase
} from 'lucide-react';
import { useApp } from '@/context';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

// Lightweight Scroll-Reveal Animation Wrapper Component
function Reveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out-soft transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-[0.98] pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { editors } = useApp();
  const [heroRevealed, setHeroRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroRevealed(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Map our 5 main featured editors
  const rosterEditors = [
    {
      id: editors[0]?.id || 'e1',
      fullName: 'MARCUS CHEN',
      role: 'Lead Reel Specialist',
      rating: '4.9',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      badgeBg: 'bg-violet-50 text-violet-700 border border-violet-200'
    },
    {
      id: editors[1]?.id || 'e2',
      fullName: 'ELENA RODRIGUEZ',
      role: 'Commercial Director',
      rating: '4.8',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200'
    },
    {
      id: editors[2]?.id || 'e3',
      fullName: 'DAVID PARK',
      role: 'DaVinci Specialist',
      rating: '4.9',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
      badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: editors[3]?.id || 'e4',
      fullName: 'PRIYA SHARMA',
      role: 'After Effects Lead',
      rating: '4.9',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      badgeBg: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    },
    {
      id: editors[4]?.id || 'e5',
      fullName: 'JAMES WILSON',
      role: 'Pacing Strategist',
      rating: '4.7',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      badgeBg: 'bg-blue-50 text-blue-700 border border-blue-200'
    }
  ];

  // 7 Showreel Categories
  const showreels = [
    {
      id: 'sr-1',
      title: 'Cinematic Showreel 4K',
      icon: Play,
      editorId: 'e1',
      bgImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'sr-2',
      title: 'Commercial Ads Master',
      icon: Maximize2,
      editorId: 'e2',
      bgImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'sr-3',
      title: 'Documentary Grade 4K',
      icon: UploadCloud,
      editorId: 'e3',
      bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'sr-4',
      title: '3D Motion Package',
      icon: Layers,
      editorId: 'e4',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'sr-5',
      title: 'Viral Shorts & Pacing',
      icon: Wand2,
      editorId: 'e5',
      bgImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'sr-6',
      title: 'Fashion & Brand Films',
      icon: Camera,
      editorId: 'e1',
      bgImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'sr-7',
      title: 'Corporate Narrative 4K',
      icon: Film,
      editorId: 'e3',
      bgImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-gray-900 font-sans selection:bg-[#3b28cc] selection:text-white overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Main Nav Links */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 focus:outline-none group hover:scale-105 transition-transform"
            >
              <span className="text-xl font-black tracking-tight text-gray-900 flex items-center">
                gogangs<span className="text-pink-500 font-black text-2xl leading-none">.</span>
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600">
              <a href="#packs" className="hover:text-[#3b28cc] transition-colors">Top Editors</a>
              <a href="#cards" className="hover:text-[#3b28cc] transition-colors">Showreels</a>
              <a href="#how-it-works" className="hover:text-[#3b28cc] transition-colors">How It Works</a>
              <a href="#benefits" className="hover:text-[#3b28cc] transition-colors">For Editors</a>
              <button 
                onClick={() => onNavigate('/admin/dashboard')}
                className="bg-[#ede9fe]/70 hover:bg-[#ede9fe] text-[#3b28cc] text-[11px] font-bold px-3 py-1 rounded-xl border border-[#3b28cc]/20 transition-colors shadow-2xs"
              >
                Admin Demo
              </button>
            </nav>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block w-64">
              <input
                type="text"
                placeholder="Search editors & skills..."
                className="w-full bg-gray-50 hover:bg-gray-100/80 text-xs text-gray-900 placeholder:text-gray-400 rounded-full pl-8 pr-4 py-2 border border-gray-200 focus:outline-none focus:border-[#3b28cc] focus:bg-white transition-colors shadow-2xs"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate('/login')}
                className="text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('/login')}
                className="bg-[#3b28cc] hover:bg-[#2e1dae] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Glowing Cards Deck */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Hero Title, Subtitle, CTAs */}
          <div className={`lg:col-span-6 space-y-6 text-left transition-all duration-700 ease-out-soft ${
            heroRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede9fe] border border-[#3b28cc]/20 text-[11px] font-extrabold tracking-wider text-[#3b28cc] uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#3b28cc]" />
              <span>Vetted • Verified • Professional</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-gray-900 tracking-tight leading-[1.1]">
              Discover & Book<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b28cc] via-[#6366f1] to-[#8b5cf6]">
                Top Video Editors
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-lg font-normal leading-relaxed">
              Access a global network of verified video editors and motion designers. Collaborate in 1GB cloud workspaces and deliver exceptional content, faster.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => {
                  const el = document.getElementById('packs');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#3b28cc] hover:bg-[#2e1dae] text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
              >
                <span>Explore Editors</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => {
                  const el = document.getElementById('cards');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200/90 text-xs font-bold px-6 py-3.5 rounded-xl hover:border-gray-300 shadow-2xs transition-all flex items-center gap-2"
              >
                <span>View Showreels</span>
                <Play className="w-3.5 h-3.5 fill-[#3b28cc] text-[#3b28cc]" />
              </button>
            </div>
          </div>

          {/* Right Column: 3D Fanned-Out Floating Cards Deck */}
          <div className={`lg:col-span-6 relative flex items-center justify-center min-h-[420px] transition-all duration-700 delay-150 ease-out-soft ${
            heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="relative w-full max-w-[480px] h-[380px] flex items-center justify-center perspective-[1000px]">
              
              {/* Card 1: Elena Rodriguez (Left Tilted) */}
              <div 
                onClick={() => onNavigate(`/editor/e2`)}
                className="absolute left-0 top-6 z-10 w-44 h-64 rounded-2xl bg-white border border-amber-200/90 p-3 shadow-xl transform -rotate-12 -translate-x-6 cursor-pointer hover:rotate-0 hover:scale-110 hover:z-50 hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-between text-center group"
              >
                <div className="w-full flex justify-end">
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">PRO</span>
                </div>
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-b from-amber-400 to-amber-600 shadow-md ring-2 ring-amber-400/40 group-hover:scale-105 transition-transform duration-300">
                  <img src={rosterEditors[1].avatar} alt="Elena" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Commercial Director</div>
                  <div className="text-xs font-bold text-gray-900 uppercase mt-0.5 group-hover:text-amber-600 transition-colors">ELENA RODRIGUEZ</div>
                  <div className="text-[10px] text-amber-500 font-bold mt-1 flex items-center justify-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> 4.8
                  </div>
                </div>
              </div>

              {/* Card 2: David Park (Center - Glowing Purple Neon Frame with Smooth Float) */}
              <div 
                onClick={() => onNavigate(`/editor/e3`)}
                className="relative z-30 w-52 h-76 rounded-2xl bg-white border-2 border-[#3b28cc] p-4 shadow-[0_15px_40px_rgba(59,40,204,0.18)] cursor-pointer hover:scale-110 hover:shadow-[0_20px_50px_rgba(59,40,204,0.25)] transition-all duration-500 flex flex-col items-center justify-between text-center animate-float-hero group"
              >
                <div className="w-full flex justify-start">
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-[#EAB308] text-black tracking-wider shadow-xs">
                    TOP 1%
                  </span>
                </div>

                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-b from-violet-500 to-indigo-600 shadow-lg ring-3 ring-[#3b28cc]/50 group-hover:scale-105 transition-transform duration-300">
                  <img src={rosterEditors[2].avatar} alt="David" className="w-full h-full rounded-full object-cover" />
                </div>

                <div className="space-y-1">
                  <div className="text-base font-extrabold text-gray-900 tracking-wide uppercase group-hover:text-[#3b28cc] transition-colors">DAVID PARK</div>
                  <div className="text-xs text-[#3b28cc] font-semibold">DaVinci Specialist</div>
                  <div className="text-xs text-amber-500 font-bold flex items-center justify-center gap-1 pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9
                  </div>
                </div>
              </div>

              {/* Card 3: Priya Sharma (Right Tilted 1) */}
              <div 
                onClick={() => onNavigate(`/editor/e4`)}
                className="absolute right-8 top-4 z-20 w-44 h-64 rounded-2xl bg-white border border-emerald-200/90 p-3 shadow-xl transform rotate-6 translate-x-4 cursor-pointer hover:rotate-0 hover:scale-110 hover:z-50 hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-between text-center group"
              >
                <div className="w-full flex justify-end">
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">PRO</span>
                </div>
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-b from-emerald-400 to-teal-600 shadow-md ring-2 ring-emerald-400/40 group-hover:scale-105 transition-transform duration-300">
                  <img src={rosterEditors[3].avatar} alt="Priya" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 uppercase mt-0.5 group-hover:text-emerald-600 transition-colors">PRIYA SHARMA</div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">3D Motion Designer</div>
                  <div className="text-[10px] text-amber-500 font-bold mt-1 flex items-center justify-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> 4.9
                  </div>
                </div>
              </div>

              {/* Card 4: James Wilson (Right Tilted 2) */}
              <div 
                onClick={() => onNavigate(`/editor/e5`)}
                className="absolute right-0 top-10 z-10 w-40 h-60 rounded-2xl bg-white border border-blue-200/90 p-2.5 shadow-xl transform rotate-14 translate-x-12 cursor-pointer hover:rotate-0 hover:scale-110 hover:z-50 hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-between text-center group"
              >
                <div className="w-full flex justify-end">
                  <span className="text-[7px] font-extrabold px-1 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">PRO</span>
                </div>
                <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-b from-blue-400 to-indigo-600 shadow-md ring-2 ring-blue-400/40 group-hover:scale-105 transition-transform duration-300">
                  <img src={rosterEditors[4].avatar} alt="James" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-900 uppercase group-hover:text-blue-600 transition-colors">JAMES WILSON</div>
                  <div className="text-[9px] text-gray-400">Pacing Strategist</div>
                  <div className="text-[9px] text-amber-500 font-bold mt-0.5 flex items-center justify-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> 4.7
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3 Metric Pills under Hero */}
        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-left border-t border-gray-200/80 pt-8 max-w-4xl">
            <div className="flex items-center gap-3.5 bg-white px-4 py-3 rounded-2xl border border-gray-200/80 shadow-2xs group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#3b28cc] flex items-center justify-center font-bold group-hover:scale-110 transition-all duration-300">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">150+</div>
                <div className="text-[11px] text-gray-500 font-medium">Vetted Editors</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white px-4 py-3 rounded-2xl border border-gray-200/80 shadow-2xs group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#3b28cc] flex items-center justify-center font-bold group-hover:scale-110 transition-all duration-300">
                <Briefcase className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">500+</div>
                <div className="text-[11px] text-gray-500 font-medium">Delivered Projects</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white px-4 py-3 rounded-2xl border border-gray-200/80 shadow-2xs group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#3b28cc] flex items-center justify-center font-bold group-hover:scale-110 transition-all duration-300">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">98%</div>
                <div className="text-[11px] text-gray-500 font-medium">On-Time Approval</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Featured Editor Roster Container */}
      <section id="packs" className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.1}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#3b28cc] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Featured Editor Roster
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Top rated video creators with verified experience and proven client results.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('/login')}
                className="text-xs font-bold text-[#3b28cc] hover:text-[#2818a7] flex items-center gap-1.5 transition-colors self-start sm:self-auto group px-3 py-1.5 rounded-xl hover:bg-[#ede9fe]/50"
              >
                <span>View All 150+ Editors</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 5 Vertical Editor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {rosterEditors.map((editor, idx) => (
                <Reveal key={editor.id} delay={idx * 90} threshold={0.1}>
                  <div
                    onClick={() => onNavigate(`/editor/${editor.id}`)}
                    className="rounded-2xl p-5 bg-gray-50/70 hover:bg-white border border-gray-200/80 hover:border-[#3b28cc]/50 hover:shadow-[0_12px_30px_rgba(59,40,204,0.08)] cursor-pointer transition-all duration-500 hover:-translate-y-2 flex flex-col items-center justify-between text-center min-h-[290px] group relative overflow-hidden"
                  >
                    {/* Top Pro Badge */}
                    <div className="w-full flex justify-end">
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200 shadow-2xs">
                        PRO
                      </span>
                    </div>

                    {/* Circular Avatar in Ring */}
                    <div className="w-20 h-20 rounded-full p-1 bg-white ring-2 ring-gray-200 group-hover:ring-[#3b28cc] group-hover:scale-105 transition-all duration-300 shadow-sm">
                      <img
                        src={editor.avatar}
                        alt={editor.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    {/* Name, Role & Star Rating */}
                    <div className="space-y-1 w-full">
                      <h3 className="font-extrabold text-sm text-gray-900 tracking-wide uppercase group-hover:text-[#3b28cc] transition-colors truncate">
                        {editor.fullName}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-medium truncate">
                        {editor.role}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold pt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{editor.rating}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Verified Editor Showreels Container */}
      <section id="cards" className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.1}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#3b28cc] flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 fill-[#3b28cc] text-[#3b28cc]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Verified Editor Showreels
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Explore curated showreels by style, platform, and expertise.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('/login')}
                className="text-xs font-bold text-[#3b28cc] hover:text-[#2818a7] flex items-center gap-1.5 transition-colors self-start sm:self-auto group px-3 py-1.5 rounded-xl hover:bg-[#ede9fe]/50"
              >
                <span>Browse All Showreels</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 7 Horizontal Thumbnail Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {showreels.map((sr, idx) => {
                const IconComponent = sr.icon;
                return (
                  <Reveal key={sr.id} delay={idx * 70} threshold={0.1}>
                    <div
                      onClick={() => onNavigate(`/editor/${sr.editorId}`)}
                      className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] border border-gray-200 hover:border-[#3b28cc] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(59,40,204,0.15)] flex flex-col justify-end p-3 text-center shadow-2xs"
                    >
                      {/* Background Thumbnail Image with Gradient Overlay */}
                      <img
                        src={sr.bgImage}
                        alt={sr.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                      {/* Icon & Title */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white mb-2 group-hover:scale-110 group-hover:bg-[#3b28cc] transition-all duration-300">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                          {sr.title}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* How Gogangs Works Section */}
      <section id="how-it-works" className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Section Title */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede9fe] text-[#3b28cc] text-xs font-bold uppercase tracking-wider mb-3">
              <Target className="w-4 h-4" />
              <span>How Gogangs Works</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Speed, Quality, & Trust
            </h2>
            <p className="text-xs text-gray-500 max-w-xl mx-auto mb-10 mt-1">
              From booking to delivery — a seamless workflow built for creators and brands.
            </p>

            {/* 3 Step Connected Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative text-left">
              {/* Step 1 */}
              <Reveal delay={100} threshold={0.1}>
                <div className="bg-gray-50/70 hover:bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-[#3b28cc]/50 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 space-y-4 group h-full">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#ede9fe] text-[#3b28cc] flex items-center justify-center text-xs font-black group-hover:bg-[#3b28cc] group-hover:text-white transition-colors">
                      1
                    </div>
                    <div className="text-[#3b28cc] group-hover:scale-110 transition-transform">
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#3b28cc] transition-colors">Match & Book</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Browse verified editors and auto-match based on your project needs. Book the perfect fit in minutes.
                  </p>
                </div>
              </Reveal>

              {/* Step 2 */}
              <Reveal delay={200} threshold={0.1}>
                <div className="bg-gray-50/70 hover:bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 space-y-4 group h-full">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      2
                    </div>
                    <div className="text-emerald-600 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">1GB Cloud Workspace</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Upload raw footage to dedicated Cloudflare R2 storage with live tracking and instant sync across your team.
                  </p>
                </div>
              </Reveal>

              {/* Step 3 */}
              <Reveal delay={300} threshold={0.1}>
                <div className="bg-gray-50/70 hover:bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-amber-500/50 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 space-y-4 group h-full">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-black group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      3
                    </div>
                    <div className="text-amber-600 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-700 transition-colors">Review & Approve</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Review frame-accurate submissions, request tweaks, and approve master deliverables with confidence.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>

      {/* "Start Your Video Editing Journey" Bottom Banner */}
      <section id="benefits" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ede9fe]/90 via-[#e0e7ff]/80 to-[#f5f3ff]/90 p-8 sm:p-12 border border-[#3b28cc]/20 shadow-md">
            {/* Subtle Glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#3b28cc] border border-[#3b28cc]/20 text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                  JOIN OUR NETWORK
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  Start Your <span className="text-[#3b28cc]">Video Editing Journey</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-gray-700 font-medium">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3b28cc] shrink-0" />
                    <span>Showcase your verified portfolio</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3b28cc] shrink-0" />
                    <span>Free 1GB high-speed workspace</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3b28cc] shrink-0" />
                    <span>Get matched with top clients</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3b28cc] shrink-0" />
                    <span>Guaranteed payments & structured reviews</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/login')}
                    className="bg-[#3b28cc] hover:bg-[#2e1dae] text-white font-extrabold text-xs px-6 py-3.5 rounded-full shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-wider"
                  >
                    <span>Join as an Editor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Deck Mini Avatar Cards */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[180px]">
                <div className="relative w-full max-w-[320px] h-[160px] flex items-center justify-center">
                  <div className="absolute left-2 w-20 h-28 rounded-xl bg-white border border-amber-300 p-1 transform -rotate-12 shadow-md hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer">
                    <img src={rosterEditors[1].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div className="relative z-10 w-24 h-32 rounded-xl bg-white border-2 border-[#3b28cc] p-1 shadow-xl animate-float-hero hover:scale-110 transition-all duration-300 cursor-pointer">
                    <img src={rosterEditors[2].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div className="absolute right-12 w-20 h-28 rounded-xl bg-white border border-emerald-300 p-1 transform rotate-6 shadow-md hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer">
                    <img src={rosterEditors[3].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div className="absolute right-0 w-18 h-24 rounded-xl bg-white border border-blue-300 p-1 transform rotate-14 shadow-md hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer">
                    <img src={rosterEditors[4].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Clean Light Footer */}
      <footer className="bg-white text-gray-600 pt-12 pb-8 px-4 sm:px-8 border-t border-gray-200/80 mt-12 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
          <div className="text-xl font-black tracking-tight text-gray-900 flex items-center hover:scale-105 transition-transform">
            gogangs<span className="text-pink-500 font-black text-2xl leading-none">.</span>
          </div>

          <div className="w-full max-w-4xl border-t border-gray-100" />

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-semibold text-gray-500">
            <a href="#packs" className="hover:text-[#3b28cc] transition-colors">Directory</a>
            <a href="#packs" className="hover:text-[#3b28cc] transition-colors">Top Editors</a>
            <button onClick={() => onNavigate('/login')} className="hover:text-[#3b28cc] transition-colors">Editor Login</button>
            <a href="#cards" className="hover:text-[#3b28cc] transition-colors">Showreels</a>
            <a href="#how-it-works" className="hover:text-[#3b28cc] transition-colors">Workflow</a>
            <button onClick={() => onNavigate('/admin/dashboard')} className="hover:text-[#3b28cc] transition-colors">Admin Portal</button>
            <a href="#terms" className="hover:text-[#3b28cc] transition-colors">Terms of Service</a>
            <a href="#privacy" className="hover:text-[#3b28cc] transition-colors">Privacy Policy</a>
          </div>

          <p className="text-[11px] text-gray-400 pt-2">
            © 2026 Gogangs, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
