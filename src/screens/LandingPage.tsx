import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Briefcase,
  ChevronDown,
  X,
  Sliders,
  TrendingUp,
  Cpu,
  MonitorPlay,
  Users,
  Check,
  ExternalLink,
  Volume2,
  FileCheck2,
  Activity,
  DollarSign
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
  threshold = 0.1,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedShowreel, setSelectedShowreel] = useState<any | null>(null);
  
  // Interactive ROI Calculator State
  const [monthlyVideos, setMonthlyVideos] = useState<number>(8);
  const [currentTurnaroundDays, setCurrentTurnaroundDays] = useState<number>(6);
  
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const timer = setTimeout(() => setHeroRevealed(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Calculated ROI Metrics
  const estimatedHoursSaved = useMemo(() => {
    // Average 11 hours saved per video with Gogangs R2 cloud and review workflows
    return monthlyVideos * 11;
  }, [monthlyVideos]);

  const estimatedTurnaroundVelocity = useMemo(() => {
    const newTurnaround = Math.max(1, Math.round(currentTurnaroundDays * 0.35));
    return {
      days: newTurnaround,
      percentFaster: Math.round(((currentTurnaroundDays - newTurnaround) / currentTurnaroundDays) * 100),
    };
  }, [currentTurnaroundDays]);

  const estimatedCostSavings = useMemo(() => {
    return monthlyVideos * 180;
  }, [monthlyVideos]);

  // Featured Editors with rich metadata
  const rosterEditors = useMemo(() => {
    return [
      {
        id: editors[0]?.id || 'e1',
        fullName: 'MARCUS CHEN',
        role: 'Lead Commercial Reel Specialist',
        category: 'commercial',
        rating: '4.9',
        reviewsCount: 48,
        completedProjects: 142,
        turnaround: '24h Avg',
        hourlyRate: '$65/hr',
        tools: ['Premiere Pro', 'After Effects', 'DaVinci'],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        available: true,
        badge: 'TOP 1%',
        badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200',
        sampleTitle: 'Nike Athletic Master Commercial 4K'
      },
      {
        id: editors[1]?.id || 'e2',
        fullName: 'ELENA RODRIGUEZ',
        role: 'Commercial & Fashion Director',
        category: 'commercial',
        rating: '4.8',
        reviewsCount: 39,
        completedProjects: 98,
        turnaround: '18h Avg',
        hourlyRate: '$70/hr',
        tools: ['DaVinci Resolve', 'Final Cut', 'Color Match'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        available: true,
        badge: 'PRO',
        badgeBg: 'bg-gray-100 text-gray-700 border border-gray-200',
        sampleTitle: 'Vogue Haute Couture Autumn Cut'
      },
      {
        id: editors[2]?.id || 'e3',
        fullName: 'DAVID PARK',
        role: 'Senior DaVinci Colorist & Finisher',
        category: 'colorist',
        rating: '4.9',
        reviewsCount: 62,
        completedProjects: 185,
        turnaround: '12h Avg',
        hourlyRate: '$85/hr',
        tools: ['DaVinci Studio', 'ACES', 'HDR Grading'],
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
        available: true,
        badge: 'MASTER',
        badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200',
        sampleTitle: 'Cinematic Feature Film 8K Color Grade'
      },
      {
        id: editors[3]?.id || 'e4',
        fullName: 'PRIYA SHARMA',
        role: '3D Motion Graphics & VFX Lead',
        category: 'motion',
        rating: '4.9',
        reviewsCount: 54,
        completedProjects: 116,
        turnaround: '36h Avg',
        hourlyRate: '$80/hr',
        tools: ['After Effects', 'Cinema 4D', 'Blender'],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        available: false,
        badge: 'PRO',
        badgeBg: 'bg-gray-100 text-gray-700 border border-gray-200',
        sampleTitle: 'Fintech 3D Mobile App Product Launch'
      },
      {
        id: editors[4]?.id || 'e5',
        fullName: 'JAMES WILSON',
        role: 'Viral Shorts & YouTube Pacing Strategist',
        category: 'shorts',
        rating: '4.7',
        reviewsCount: 71,
        completedProjects: 240,
        turnaround: '14h Avg',
        hourlyRate: '$55/hr',
        tools: ['Premiere Pro', 'CapCut Pro', 'Sound Design'],
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
        available: true,
        badge: 'VIRAL LEAD',
        badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        sampleTitle: '10M+ Views TikTok Series Retention Cut'
      },
      {
        id: 'e6',
        fullName: 'SOPHIA LAURENT',
        role: 'Documentary & Long-Form Narrative',
        category: 'documentary',
        rating: '4.9',
        reviewsCount: 33,
        completedProjects: 64,
        turnaround: '48h Avg',
        hourlyRate: '$75/hr',
        tools: ['Avid Media Composer', 'Premiere Pro', 'iZotope RX'],
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        available: true,
        badge: 'FEATURE',
        badgeBg: 'bg-gray-100 text-gray-700 border border-gray-200',
        sampleTitle: 'Wild Earth Expedition Series Episode 4'
      }
    ];
  }, [editors]);

  // Filtered roster based on category and search query
  const filteredEditors = useMemo(() => {
    return rosterEditors.filter(editor => {
      const matchesCategory = selectedCategory === 'all' || editor.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        editor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        editor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        editor.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [rosterEditors, selectedCategory, searchQuery]);

  // Showreels with rich metadata & modal preview data
  const showreels = [
    {
      id: 'sr-1',
      title: 'Cinematic Showreel 4K UHD',
      genre: 'Cinematic',
      duration: '01:45',
      resolution: '3840x2160 • 60fps',
      codec: 'Apple ProRes 422 HQ',
      editorName: 'Marcus Chen',
      editorId: 'e1',
      aspect: '16:9',
      icon: Play,
      bgImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
      description: 'High-octane automotive and lifestyle reel graded in ACES color space with custom sound design.'
    },
    {
      id: 'sr-2',
      title: 'Commercial Ads Brand Master',
      genre: 'Commercial',
      duration: '00:60',
      resolution: '4K DCI • 24fps',
      codec: 'ProRes 4444 XQ',
      editorName: 'Elena Rodriguez',
      editorId: 'e2',
      aspect: '16:9',
      icon: Maximize2,
      bgImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
      description: 'Television broadcast master deliverable with multi-format cutdowns for web and social distribution.'
    },
    {
      id: 'sr-3',
      title: 'Documentary Grade & Narrative 4K',
      genre: 'Documentary',
      duration: '02:15',
      resolution: '3840x2160 • 24fps',
      codec: 'DNxHR HQX 12-bit',
      editorName: 'David Park',
      editorId: 'e3',
      aspect: '16:9',
      icon: UploadCloud,
      bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      description: 'Deep emotional narrative with natural skin tone protection and textured 35mm film grain emulation.'
    },
    {
      id: 'sr-4',
      title: '3D Motion Graphics & Visuals Pack',
      genre: '3D & Motion',
      duration: '00:45',
      resolution: '3840x2160 • 60fps',
      codec: 'ProRes 4444 + Alpha',
      editorName: 'Priya Sharma',
      editorId: 'e4',
      aspect: '16:9',
      icon: Layers,
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      description: 'Seamless kinetic typography, 3D product renders, and UI mockups animated with fluid dynamics.'
    },
    {
      id: 'sr-5',
      title: 'Viral Shorts High-Retention Pacing',
      genre: 'Shorts & Reels',
      duration: '00:30',
      resolution: '1080x1920 • 9:16',
      codec: 'H.265 / HEVC 10-bit',
      editorName: 'James Wilson',
      editorId: 'e5',
      aspect: '9:16',
      icon: Wand2,
      bgImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      description: 'Pattern interrupts, animated subtitles, dynamic zooms, and sound SFX optimized for 85%+ retention.'
    },
    {
      id: 'sr-6',
      title: 'Fashion & Luxury Brand Film',
      genre: 'Fashion',
      duration: '01:10',
      resolution: '4K DCI • 48fps',
      codec: 'ProRes 422 HQ',
      editorName: 'Elena Rodriguez',
      editorId: 'e2',
      aspect: '16:9',
      icon: Camera,
      bgImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      description: 'High-contrast studio lighting, match cuts, and rhythmic audio sync tailored for global luxury campaigns.'
    },
    {
      id: 'sr-7',
      title: 'Corporate Keynote & Narrative 4K',
      genre: 'Corporate',
      duration: '02:00',
      resolution: '3840x2160 • 30fps',
      codec: 'ProRes 422 HQ',
      editorName: 'Sophia Laurent',
      editorId: 'e6',
      aspect: '16:9',
      icon: Film,
      bgImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
      description: 'Multi-cam synced corporate keynote with graphic overlays, lower thirds, and crystal clear audio mastering.'
    }
  ];

  // Testimonials from Studio Heads and Creators
  const testimonials = [
    {
      quote: "Gogangs eliminated our 4-day revision bottlenecks. Direct R2 uploads and timestamped versioning reduced our turnaround from a week to under 24 hours.",
      author: "Sarah Jenkins",
      role: "Head of Creative Production",
      company: "Apex Media Agency",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      stats: "75+ Delivered Projects"
    },
    {
      quote: "The review queue and file inspector make client feedback effortless. No more broken Google Drive links or lost WhatsApp revisions.",
      author: "Alex Rivera",
      role: "YouTube Creator (2.4M Subs)",
      company: "Rivera Digital",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      stats: "99.2% Retention Rate"
    },
    {
      quote: "As a senior DaVinci colorist, having a dedicated 1GB cloud workspace with frame-accurate approvals lets me focus on the craft rather than managing storage.",
      author: "David Park",
      role: "Master Colorist",
      company: "Park Grading Studio",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      stats: "Top 1% Rated Editor"
    }
  ];

  // Supported Professional Software & Codecs
  const softwareSuite = [
    { name: 'Adobe Premiere Pro', tag: 'Pr', desc: 'Timeline & Multi-cam Masters' },
    { name: 'DaVinci Resolve Studio', tag: 'Resolve', desc: 'Color Grading & ACES Finishes' },
    { name: 'Adobe After Effects', tag: 'Ae', desc: 'Motion Graphics & Dynamic VFX' },
    { name: 'Cinema 4D / Blender', tag: '3D', desc: 'Product Renders & Simulation' },
    { name: 'Final Cut Pro', tag: 'FCP', desc: 'Fast Cutdowns & Social Reels' },
    { name: 'Avid Media Composer', tag: 'Avid', desc: 'Long-form Narrative & Broadcast' }
  ];

  // FAQ Items
  const faqItems = [
    {
      q: 'How does the 1GB Cloudflare R2 Cloud Workspace work?',
      a: 'Every editor receives a high-speed, dedicated 1GB Cloudflare R2 workspace. Uploads are streamed directly from the browser using S3 presigned URLs without bogging down servers, ensuring lightning-fast uploads with zero egress fees.'
    },
    {
      q: 'How do direct file submissions and review versioning work?',
      a: 'Instead of sharing unorganized external links, editors submit MP4/MOV cuts directly to the task queue. The system automatically tags versions (v1, v2) with file sizes in MB, allowing admins to inspect frames, compare revisions, and log specific feedback.'
    },
    {
      q: 'How are video editors vetted and verified?',
      a: 'Every editor undergoes a rigorous multi-step assessment including portfolio verification, pacing and typography evaluation, color science proficiency tests, and client communication standards before receiving their verified badge.'
    },
    {
      q: 'Can agencies create multi-task project milestones?',
      a: 'Yes! Agency admins can break down complex campaigns into granular subtasks (e.g. Rough Cut, Sound Design, 3D Intro, Master Color Grade), assigning distinct specialists to each milestone with separate deadlines and tracking.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-gray-900 font-sans selection:bg-gray-900 selection:text-white overflow-x-hidden">
      
      {/* 1. TOP ANNOUNCEMENT & LIVE STATUS TICKER */}
      <div className="bg-gray-900 text-white text-[11px] font-medium py-1.5 px-4 text-center border-b border-gray-800 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE PIPELINE
        </span>
        <span className="hidden sm:inline text-gray-300">
          Over 1,400+ 4K master deliverables completed this month.
        </span>
        <span className="text-gray-400">• Average editor turnaround: <strong>18.4 Hours</strong></span>
      </div>

      {/* 2. STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 transition-all shadow-2xs">
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
              <a href="#roster" className="hover:text-gray-900 transition-colors">Find Editors</a>
              <a href="#showreels" className="hover:text-gray-900 transition-colors">Showreels</a>
              <a href="#workflow" className="hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#calculator" className="hover:text-gray-900 transition-colors">ROI Calculator</a>
              <a href="#software" className="hover:text-gray-900 transition-colors">Tech Stack</a>
              <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
            </nav>
          </div>

          {/* Quick Demo Switchers & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2">
              <button 
                onClick={() => onNavigate('/admin/dashboard')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-gray-200 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gray-700" />
                <span>Admin Demo</span>
              </button>
              <button 
                onClick={() => onNavigate('/editor/dashboard')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-gray-200 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <MonitorPlay className="w-3.5 h-3.5 text-gray-700" />
                <span>Editor Demo</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/login')}
                className="text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('/login')}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION WITH 3D WORKSPACE PREVIEW & LIVE METRIC CHIPS */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gray-200/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Hero Copy, Badges, Search Bar & Quick CTAs */}
          <div className={`lg:col-span-6 space-y-6 text-left transition-all duration-700 ease-out-soft ${
            heroRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            
            {/* Live Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] font-extrabold tracking-wider text-gray-700 uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-gray-700" />
              <span>Next-Gen Video Operations Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-gray-900 tracking-tight leading-[1.08]">
              High-Velocity Video Production for <span className="text-gray-900 underline decoration-gray-300">Modern Studios</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-600 max-w-xl font-normal leading-relaxed">
              Match with vetted video editors, collaborate inside <strong>1GB high-speed cloud workspaces</strong>, and approve master deliverables with frame-accurate version history.
            </p>

            {/* Search Input Bar with Quick Filter Tags */}
            <div className="space-y-3 pt-2 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by skill, software (e.g. DaVinci, 3D, Reels)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-xs text-gray-900 placeholder:text-gray-400 rounded-2xl pl-10 pr-24 py-3.5 border border-gray-200 shadow-sm focus:outline-none focus:border-gray-400 transition-colors"
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <button
                  onClick={() => {
                    const el = document.getElementById('roster');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="absolute right-2 top-2 bg-gray-900 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                >
                  Find Match
                </button>
              </div>

              {/* Quick Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-gray-500">
                <span className="text-gray-400">Popular:</span>
                {['Commercial Ads', 'DaVinci Resolve', 'Viral Shorts', '3D Motion'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      const el = document.getElementById('roster');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 py-0.5 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => {
                  const el = document.getElementById('roster');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
              >
                <span>Explore Vetted Roster</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => {
                  const el = document.getElementById('showreels');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold px-6 py-3.5 rounded-xl hover:border-gray-300 shadow-2xs transition-all flex items-center gap-2"
              >
                <span>Watch 4K Showreels</span>
                <Play className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Right Column: 3D Interactive Floating Studio Deck */}
          <div className={`lg:col-span-6 relative flex items-center justify-center min-h-[460px] transition-all duration-700 delay-150 ease-out-soft ${
            heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="relative w-full max-w-[500px] h-[420px] flex items-center justify-center perspective-[1000px]">
              
              {/* Backing Card: Live Deliverable Cut Inspection */}
              <div className="absolute left-2 top-2 z-10 w-56 rounded-2xl bg-white border border-gray-200 p-3.5 shadow-lg transform -rotate-6 -translate-x-6 hover:rotate-0 hover:scale-105 hover:z-40 transition-all duration-500 cursor-pointer">
                <div className="flex items-center justify-between text-[9px] font-bold text-gray-500 mb-2">
                  <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SUBMISSION V2
                  </span>
                  <span>245 MB</span>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 mb-2">
                  <img 
                    src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&auto=format&fit=crop&q=80" 
                    alt="Cut preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-bold text-white px-1.5 py-0.5 rounded">
                    4K ProRes
                  </div>
                </div>
                <div className="text-[11px] font-bold text-gray-900 truncate">Nike_Commercial_Cut_v2.mp4</div>
                <div className="text-[9px] text-gray-500 mt-0.5">Admin: "Audio mix approved, color grade locked."</div>
              </div>

              {/* Main Center Card: Senior Colorist Live Profile */}
              <div 
                onClick={() => onNavigate(`/editor/e3`)}
                className="relative z-30 w-60 rounded-3xl bg-white border-2 border-gray-900 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.14)] cursor-pointer hover:scale-105 transition-all duration-500 flex flex-col items-center justify-between text-center animate-float-hero group"
              >
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-400 text-black tracking-wider">
                    TOP 1% COLORIST
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Available
                  </span>
                </div>

                {/* Avatar with Pro Ring */}
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-b from-gray-700 to-gray-900 shadow-md ring-3 ring-gray-300 group-hover:scale-105 transition-transform my-1">
                  <img src={rosterEditors[2].avatar} alt="David" className="w-full h-full rounded-full object-cover" />
                </div>

                <div className="space-y-1 my-2">
                  <div className="text-sm font-black text-gray-900 uppercase group-hover:text-gray-700 transition-colors">DAVID PARK</div>
                  <div className="text-[11px] text-gray-500 font-medium">DaVinci Resolve Specialist</div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold pt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                    <span className="text-[10px] text-gray-400 font-normal">(62 reviews)</span>
                  </div>
                </div>

                {/* Software Chips */}
                <div className="flex items-center justify-center gap-1 my-1">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">DaVinci</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">ACES</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">8K Finisher</span>
                </div>

                <div className="w-full pt-3 mt-1 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-900">$85/hr</span>
                  <span className="text-gray-700 flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform">
                    View Portfolio <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Floating Widget: 1GB Storage & Speed Radar */}
              <div className="absolute right-2 bottom-4 z-20 w-52 rounded-2xl bg-white border border-gray-200 p-3.5 shadow-lg transform rotate-6 translate-x-4 hover:rotate-0 hover:scale-105 hover:z-40 transition-all duration-500 cursor-pointer">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5 text-gray-800" />
                    Cloudflare R2 Quota
                  </span>
                  <span className="text-gray-500 font-semibold">625 / 1024 MB</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gray-900 rounded-full w-[61%]" />
                </div>
                <div className="flex items-center justify-between text-[9px] text-gray-500">
                  <span>Direct Presigned S3</span>
                  <span className="font-bold text-emerald-600">Zero Egress</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4. THREE LIVE METRIC KPI SUMMARY PILLS */}
        <Reveal delay={200}>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-gray-200/80 pt-8 max-w-4xl">
            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold shrink-0">
                <Award className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">250+</div>
                <div className="text-[11px] text-gray-500 font-medium">Vetted Video Specialists</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold shrink-0">
                <Briefcase className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">1,400+</div>
                <div className="text-[11px] text-gray-500 font-medium">Delivered Master Projects</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">99.4%</div>
                <div className="text-[11px] text-gray-500 font-medium">On-Time Client Approval</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 5. INTERACTIVE FEATURED EDITOR ROSTER WITH DYNAMIC FILTER TABS */}
      <section id="roster" className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.1}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            {/* Header & Specialty Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>Verified Talent Directory</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Featured Video Specialists
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Discover top creators vetted across pacing, color grading, motion graphics, and audio mastering.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Specialties' },
                  { id: 'commercial', label: 'Commercials' },
                  { id: 'colorist', label: 'DaVinci Colorists' },
                  { id: 'motion', label: '3D & VFX' },
                  { id: 'shorts', label: 'Shorts & Reels' },
                  { id: 'documentary', label: 'Documentary' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Roster Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEditors.map((editor, idx) => (
                <Reveal key={editor.id} delay={idx * 70} threshold={0.1}>
                  <div
                    onClick={() => onNavigate(`/editor/${editor.id}`)}
                    className="rounded-2xl p-5 bg-gray-50/70 hover:bg-white border border-gray-200/90 hover:border-gray-300 hover:shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Row: Availability & Rating */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200 shadow-2xs">
                          {editor.badge}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-2xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{editor.rating}</span>
                          <span className="text-[10px] text-gray-400 font-normal">({editor.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Avatar, Name & Role */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-14 h-14 rounded-full p-0.5 bg-white ring-2 ring-gray-200 group-hover:ring-gray-400 group-hover:scale-105 transition-all duration-300 shadow-sm shrink-0">
                          <img
                            src={editor.avatar}
                            alt={editor.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-sm text-gray-900 uppercase group-hover:text-gray-700 transition-colors truncate">
                            {editor.fullName}
                          </h3>
                          <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                            {editor.role}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-600">
                            <span className="font-semibold text-gray-900">{editor.completedProjects} Projects</span>
                            <span>•</span>
                            <span>{editor.turnaround}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tool Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {editor.tools.map(tool => (
                          <span key={tool} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white text-gray-600 border border-gray-200">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between">
                      <div className="text-xs font-bold text-gray-900">{editor.hourlyRate}</div>
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>View Portfolio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {filteredEditors.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-xs font-medium">
                No video editors found matching your search. Try resetting filters.
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* 6. VERIFIED SHOWREELS GALLERY & INTERACTIVE PREVIEW MODAL */}
      <section id="showreels" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.1}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 fill-gray-800 text-gray-800" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Verified Editor Showreels
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Click any master cut to inspect technical codecs, frame resolutions, and pacing styles.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('/login')}
                className="text-xs font-bold text-gray-900 hover:text-gray-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto group px-3 py-1.5 rounded-xl hover:bg-gray-100"
              >
                <span>Explore All 80+ Reels</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Showreel Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {showreels.map((sr, idx) => {
                const IconComponent = sr.icon;
                return (
                  <Reveal key={sr.id} delay={idx * 60} threshold={0.1}>
                    <div
                      onClick={() => setSelectedShowreel(sr)}
                      className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] border border-gray-200 hover:border-gray-400 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between p-3 text-center shadow-2xs"
                    >
                      {/* Background Thumbnail Image with Gradient Overlay */}
                      <img
                        src={sr.bgImage}
                        alt={sr.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Top Genre & Duration Chip */}
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white border border-white/20">
                          {sr.genre}
                        </span>
                        <span className="text-[8px] font-bold text-gray-300">
                          {sr.duration}
                        </span>
                      </div>

                      {/* Icon & Title */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white mb-2 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                          {sr.title}
                        </span>
                        <span className="text-[9px] text-gray-300 mt-0.5">By {sr.editorName}</span>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 7. INTERACTIVE ROI & VELOCITY CALCULATOR */}
      <section id="calculator" className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Time & Cost Calculator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Calculate Your Agency's Video Velocity
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                See how much time and operational overhead your team saves using Gogangs 1GB Cloud Workspaces and Review Queues.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Sliders */}
              <div className="lg:col-span-7 space-y-6 bg-gray-50/70 p-6 rounded-2xl border border-gray-200">
                {/* Slider 1: Monthly Deliverables */}
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs font-bold">
                    <span className="text-gray-700">Monthly Videos Needed:</span>
                    <span className="text-sm font-black text-gray-900">{monthlyVideos} Videos / mo</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    step="1"
                    value={monthlyVideos}
                    onChange={(e) => setMonthlyVideos(Number(e.target.value))}
                    className="w-full accent-gray-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>2 Videos</span>
                    <span>20 Videos</span>
                    <span>40 Videos</span>
                  </div>
                </div>

                {/* Slider 2: Current Revision Turnaround */}
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs font-bold">
                    <span className="text-gray-700">Current Turnaround Time:</span>
                    <span className="text-sm font-black text-gray-900">{currentTurnaroundDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="14"
                    step="1"
                    value={currentTurnaroundDays}
                    onChange={(e) => setCurrentTurnaroundDays(Number(e.target.value))}
                    className="w-full accent-gray-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>2 Days</span>
                    <span>7 Days</span>
                    <span>14 Days</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Calculations based on 1,400+ delivered projects across 40 creative agencies.</span>
                </div>
              </div>

              {/* Right Column: Calculated Savings KPI Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="bg-gray-900 text-white p-5 rounded-2xl col-span-2 shadow-md">
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Monthly Production Hours Saved</div>
                  <div className="text-3xl font-black text-white mt-1 flex items-baseline gap-1">
                    {estimatedHoursSaved} <span className="text-sm font-semibold text-gray-300">Hours</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Equivalent to ~{(estimatedHoursSaved / 40).toFixed(1)} full-time editor work weeks.</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Estimated Savings</div>
                  <div className="text-xl font-black text-gray-900 mt-1">${estimatedCostSavings.toLocaleString()}</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">Per month</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Faster Approvals</div>
                  <div className="text-xl font-black text-emerald-600 mt-1">+{estimatedTurnaroundVelocity.percentFaster}%</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">Speed improvement</div>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </section>

      {/* 8. 4-PILLAR BENTO GRID: HOW GOGANGS WORKS */}
      <section id="workflow" className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Target className="w-4 h-4" />
                <span>The Gogangs Operating System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Built for Speed, Quality, & Absolute Trust
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                From brief to master export — a seamless workflow replacing messy Drive links and email chaos.
              </p>
            </div>

            {/* 4 Bento Architecture Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Bento 1: Cloudflare R2 Workspace */}
              <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-6 border border-gray-200/90 hover:border-gray-300 hover:shadow-lg transition-all duration-300 space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-black group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900">1GB Dedicated Cloud Workspaces</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Editors upload 4K raw footage and master exports directly to Cloudflare R2 storage using S3 presigned URLs with zero egress costs and instant team sync.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-gray-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>S3 Direct-to-Browser Uploads</span>
                </div>
              </div>

              {/* Bento 2: Frame-Accurate Review Queue */}
              <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-6 border border-gray-200/90 hover:border-gray-300 hover:shadow-lg transition-all duration-300 space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-black group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Frame-Accurate Review Queue</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Inspect submitted video cuts inside an interactive modal. View file sizes in MB, compare version histories (v1 vs v2), and log timestamped feedback notes.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-gray-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>One-Click Approve / Revision Actions</span>
                </div>
              </div>

              {/* Bento 3: Multi-Task Project Builder */}
              <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-6 border border-gray-200/90 hover:border-gray-300 hover:shadow-lg transition-all duration-300 space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-black group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Granular Subtask Milestones</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Break campaigns down into independent subtasks (Rough Cut, Motion Graphics, DaVinci Grade) and assign distinct specialists to each milestone with automated deadlines.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-gray-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Multi-Editor Team Synchronization</span>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </section>

      {/* 9. SUPPORTED EDITING SOFTWARE & CODEC COMPATIBILITY */}
      <section id="software" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Native Compatibility with Industry Standards
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Our talent pool masters the industry standard NLEs, color grading suites, and motion tools.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {softwareSuite.map((sw) => (
                <div key={sw.name} className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-center hover:border-gray-400 hover:shadow-xs transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white font-black text-xs flex items-center justify-center mx-auto mb-2.5">
                    {sw.tag}
                  </div>
                  <div className="font-bold text-xs text-gray-900">{sw.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{sw.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 10. SOCIAL PROOF & TESTIMONIALS */}
      <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Client & Creator Stories</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Trusted by Top Agencies & YouTubers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-normal italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{t.author}</div>
                      <div className="text-[10px] text-gray-500">{t.role} • {t.company}</div>
                      <div className="text-[9px] font-semibold text-emerald-600 mt-0.5">{t.stats}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 11. INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="py-8 px-4 sm:px-8 max-w-4xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Everything you need to know about Gogangs cloud workspaces, review queues, and talent matching.
              </p>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden transition-colors">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 12. "JOIN AS AN EDITOR / HIRE TALENT" BOTTOM LAUNCHPAD */}
      <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-12 border border-gray-200/90 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200 text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                  JOIN OUR GLOBAL NETWORK
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  Start Your <span className="text-gray-900">Video Editing Journey</span> Today.
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-gray-700 font-medium">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Verified portfolio badge and client ranking</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free 1GB high-speed Cloudflare R2 storage</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct client matching & guaranteed payouts</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Frame-accurate review approval pipeline</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('/login')}
                    className="bg-gray-900 hover:bg-black text-white font-extrabold text-xs px-6 py-3.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-wider"
                  >
                    <span>Join as an Editor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('/login')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs px-6 py-3.5 rounded-full border border-gray-200 transition-all"
                  >
                    <span>Hire Video Talent</span>
                  </button>
                </div>
              </div>

              {/* Right Mini Avatar Deck */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[180px]">
                <div className="relative w-full max-w-[320px] h-[160px] flex items-center justify-center">
                  <div className="absolute left-2 w-20 h-28 rounded-xl bg-white border border-gray-200 p-1 transform -rotate-12 shadow-md hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer">
                    <img src={rosterEditors[1].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div className="relative z-10 w-24 h-32 rounded-xl bg-white border-2 border-gray-800 p-1 shadow-xl animate-float-hero hover:scale-110 transition-all duration-300 cursor-pointer">
                    <img src={rosterEditors[2].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div className="absolute right-12 w-20 h-28 rounded-xl bg-white border border-gray-200 p-1 transform rotate-6 shadow-md hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer">
                    <img src={rosterEditors[3].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div className="absolute right-0 w-18 h-24 rounded-xl bg-white border border-gray-200 p-1 transform rotate-14 shadow-md hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer">
                    <img src={rosterEditors[4].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </section>

      {/* 13. INTERACTIVE SHOWREEL PREVIEW MODAL */}
      {selectedShowreel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-gray-900 uppercase tracking-tight">{selectedShowreel.title}</h3>
                <p className="text-[11px] text-gray-500">Editor: {selectedShowreel.editorName} • {selectedShowreel.genre}</p>
              </div>
              <button
                onClick={() => setSelectedShowreel(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Mockup Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
              <img
                src={selectedShowreel.bgImage}
                alt={selectedShowreel.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              
              {/* Play Button Overlay */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-6 h-6 fill-gray-900 text-gray-900 ml-1" />
              </div>

              {/* Timeline Scrub Simulator */}
              <div className="absolute bottom-3 left-4 right-4 z-10 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gray-300 font-mono">
                  <span>00:14</span>
                  <span>{selectedShowreel.duration}</span>
                </div>
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-1/3 rounded-full" />
                </div>
              </div>
            </div>

            {/* Technical Metadata & Actions */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                {selectedShowreel.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="text-gray-400 font-semibold text-[10px]">RESOLUTION</div>
                  <div className="font-bold text-gray-900 mt-0.5">{selectedShowreel.resolution}</div>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="text-gray-400 font-semibold text-[10px]">CODEC / FORMAT</div>
                  <div className="font-bold text-gray-900 mt-0.5">{selectedShowreel.codec}</div>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 col-span-2 sm:col-span-1">
                  <div className="text-gray-400 font-semibold text-[10px]">STORAGE ENGINE</div>
                  <div className="font-bold text-gray-900 mt-0.5">Cloudflare R2</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setSelectedShowreel(null);
                    onNavigate(`/editor/${selectedShowreel.editorId}`);
                  }}
                  className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>Book {selectedShowreel.editorName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSelectedShowreel(null)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 14. COMPREHENSIVE MULTI-COLUMN FOOTER */}
      <footer className="bg-white text-gray-600 pt-16 pb-10 px-4 sm:px-8 border-t border-gray-200/80 mt-12 shadow-2xs">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: Brand & Status */}
            <div className="space-y-4">
              <div className="text-xl font-black tracking-tight text-gray-900 flex items-center">
                gogangs<span className="text-pink-500 font-black text-2xl leading-none">.</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                The modern video production and talent operating system. 1GB Cloudflare R2 storage, verified talent rosters, and frame-accurate review queues.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </div>
            </div>

            {/* Column 2: Platform Solutions */}
            <div>
              <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Platform</div>
              <ul className="space-y-2 text-xs font-medium text-gray-500">
                <li><a href="#roster" className="hover:text-gray-900 transition-colors">Talent Directory</a></li>
                <li><a href="#showreels" className="hover:text-gray-900 transition-colors">4K Showreels</a></li>
                <li><a href="#workflow" className="hover:text-gray-900 transition-colors">Review Queue OS</a></li>
                <li><a href="#calculator" className="hover:text-gray-900 transition-colors">ROI Calculator</a></li>
                <li><button onClick={() => onNavigate('/admin/dashboard')} className="hover:text-gray-900 transition-colors">Admin Portal</button></li>
              </ul>
            </div>

            {/* Column 3: For Video Editors */}
            <div>
              <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Creators & Editors</div>
              <ul className="space-y-2 text-xs font-medium text-gray-500">
                <li><button onClick={() => onNavigate('/login')} className="hover:text-gray-900 transition-colors">Join as an Editor</button></li>
                <li><button onClick={() => onNavigate('/editor/dashboard')} className="hover:text-gray-900 transition-colors">Editor Workspace</button></li>
                <li><a href="#software" className="hover:text-gray-900 transition-colors">Supported NLEs</a></li>
                <li><a href="#workflow" className="hover:text-gray-900 transition-colors">1GB Storage Info</a></li>
              </ul>
            </div>

            {/* Column 4: Company & Legal */}
            <div>
              <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Company & Trust</div>
              <ul className="space-y-2 text-xs font-medium text-gray-500">
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">Security & Privacy</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">Terms of Service</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">Community Guidelines</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">Support & Contact</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
            <div>© 2026 Gogangs, Inc. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Cookie Settings</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
