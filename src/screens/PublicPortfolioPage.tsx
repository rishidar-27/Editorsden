import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Linkedin,
  Instagram,
  Globe,
  Star,
  Play,
  Pause,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  Briefcase,
  Award,
  Layers,
  Sparkles,
  Camera,
  Film,
  Download,
  Share2,
  Calendar,
  DollarSign,
  ChevronRight,
  Send,
  X,
  Volume2,
  UploadCloud,
  Check,
  Cpu,
  MonitorPlay,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '@/context';

interface PublicPortfolioPageProps {
  editorId: string;
  onNavigate: (route: string) => void;
}

export function PublicPortfolioPage({ editorId, onNavigate }: PublicPortfolioPageProps) {
  const { getEditor, addToast, darkMode, toggleDarkMode } = useApp();
  const rawEditor = getEditor(editorId);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideoModal, setSelectedVideoModal] = useState<any | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Instant Quote Wizard State for this specific Editor
  const [quoteFormat, setQuoteFormat] = useState<'commercial' | 'shorts' | 'youtube' | '3d'>('commercial');
  const [quoteResolution, setQuoteResolution] = useState<'1080p' | '4k' | '8k'>('4k');
  const [quoteSpeed, setQuoteSpeed] = useState<'rush' | 'standard'>('standard');

  // Fallback enriched data for any editor
  const editor = useMemo(() => {
    if (rawEditor) {
      return {
        ...rawEditor,
        role: rawEditor.id === 'e1' ? 'Lead Commercial Reel Specialist & Finisher' 
            : rawEditor.id === 'e2' ? 'Commercial & Fashion Content Director' 
            : rawEditor.id === 'e3' ? 'Senior DaVinci Colorist & 8K Finisher'
            : rawEditor.id === 'e4' ? '3D Motion Graphics & VFX Supervisor'
            : rawEditor.id === 'e5' ? 'Viral Shorts & High-Retention Strategist'
            : 'Senior Creative Video Editor',
        hourlyRate: rawEditor.id === 'e1' ? '$65/hr' : rawEditor.id === 'e2' ? '$70/hr' : rawEditor.id === 'e3' ? '$85/hr' : rawEditor.id === 'e4' ? '$80/hr' : '$55/hr',
        rating: '4.9',
        reviewsCount: 48,
        completedProjects: 142,
        turnaround: '18h - 24h',
        hardware: 'Apple Mac Studio M2 Ultra (128GB Unified) • ASUS ProArt 4K HDR 1600nits • 1Gbps Fiber • 16TB NVMe RAID',
        avatarUrl: rawEditor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      };
    }

    return {
      id: editorId,
      fullName: editorId === 'e1' ? 'Marcus Chen' : editorId === 'e3' ? 'David Park' : 'Elena Rodriguez',
      role: 'Lead Commercial Reel Specialist & Colorist',
      email: `${editorId}@gogangs.com`,
      city: editorId === 'e1' ? 'San Francisco, CA, USA' : editorId === 'e3' ? 'Los Angeles, CA, USA' : 'New York, NY, USA',
      bio: 'Award-winning video editor and post-production director with 6+ years of mastery across high-ticket commercials, YouTube narrative pacing, ACES color science, and dynamic motion graphics. Certified Apple ProRes master deliverer.',
      experience: 6,
      availability: 'Full-Time (35-40 hrs/week)',
      hourlyRate: '$70/hr',
      rating: '4.9',
      reviewsCount: 52,
      completedProjects: 156,
      turnaround: '18.4h Avg',
      verificationStatus: 'Verified',
      avatarUrl: editorId === 'e1' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
        : editorId === 'e3'
        ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      skills: ['Commercial Ads', 'Reels Editing', 'Color Grading', 'Motion Graphics', 'Sound Design'],
      editingSoftware: ['DaVinci Resolve Studio', 'Adobe Premiere Pro', 'After Effects', 'Blender'],
      hardware: 'Apple Mac Studio M2 Ultra (128GB Unified) • ASUS ProArt 4K HDR 1600nits • 1Gbps Symmetrical Fiber',
      linkedin: 'linkedin.com/in/creator',
      instagram: '@creator.edits',
      portfolioLink: 'creator.studio',
      portfolio: [],
    };
  }, [rawEditor, editorId]);

  // Curated Master Portfolio Items
  const masterPortfolio = useMemo(() => {
    return [
      {
        id: 'p-1',
        title: 'Nike Athletic Master Commercial 4K',
        category: 'commercial',
        categoryLabel: 'Commercial Ad',
        duration: '00:45',
        resolution: '3840x2160 • 60fps',
        codec: 'Apple ProRes 422 HQ',
        aspect: '16:9 4K UHD',
        software: ['Premiere Pro', 'After Effects', 'DaVinci'],
        thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1000&auto=format&fit=crop&q=80',
        views: '124.5K',
        description: 'High-octane commercial brand deliverable edited for international broadcast and digital campaign channels with custom speed ramps and sound FX.',
        featured: true,
      },
      {
        id: 'p-2',
        title: 'Vogue Haute Couture Autumn Cut',
        category: 'commercial',
        categoryLabel: 'Fashion Film',
        duration: '01:02',
        resolution: '4K DCI • 24fps',
        codec: 'ProRes 4444 XQ',
        aspect: '16:9 Cinema',
        software: ['DaVinci Resolve', 'Final Cut'],
        thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80',
        views: '88.1K',
        description: 'Atmospheric fashion campaign master with rich textured 35mm film halation, skin-tone exposure isolation, and bespoke orchestral mix.',
        featured: true,
      },
      {
        id: 'p-3',
        title: '10M+ Views TikTok Series Retention Cut',
        category: 'shorts',
        categoryLabel: 'Viral Shorts',
        duration: '00:35',
        resolution: '1080x1920 • 9:16',
        codec: 'H.265 10-bit',
        aspect: '9:16 Vertical',
        software: ['Premiere Pro', 'CapCut Pro'],
        thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&auto=format&fit=crop&q=80',
        views: '1.2M',
        description: 'High-retention short form pacing with animated typography, sound interrupts, dynamic zooms, and 88% average retention curve.',
        featured: true,
      },
      {
        id: 'p-4',
        title: 'Fintech 3D Mobile App Product Launch',
        category: 'motion',
        categoryLabel: '3D & Motion',
        duration: '00:40',
        resolution: '3840x2160 • 60fps',
        codec: 'ProRes 4444 + Alpha',
        aspect: '16:9 4K UHD',
        software: ['After Effects', 'Cinema 4D', 'Blender'],
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
        views: '45.0K',
        description: 'Kinetic 3D device tracking, glassmorphism UI interactions, and particle physics animations for Silicon Valley SaaS launch.',
        featured: false,
      },
      {
        id: 'p-5',
        title: 'Cinematic Feature Film 8K Color Grade',
        category: 'doc',
        categoryLabel: 'ACES Color Grade',
        duration: '02:15',
        resolution: '8K DCI • 24fps',
        codec: 'DNxHR HQX 12-bit',
        aspect: '2.39:1 Anamorphic',
        software: ['DaVinci Resolve Studio', 'ACES 1.3'],
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
        views: '62.3K',
        description: 'Feature-length color finishing in ACES color space with custom node tree architecture and natural highlight rolloff.',
        featured: false,
      },
      {
        id: 'p-6',
        title: 'Wild Earth Expedition Series Episode 4',
        category: 'doc',
        categoryLabel: 'Documentary',
        duration: '01:45',
        resolution: '3840x2160 • 30fps',
        codec: 'Apple ProRes 422 HQ',
        aspect: '16:9 4K UHD',
        software: ['Avid Media Composer', 'iZotope RX'],
        thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000&auto=format&fit=crop&q=80',
        views: '94.2K',
        description: 'Wildlife expedition narrative master syncing multi-camera 4K REDCODE RAW footage with high dynamic range audio mastering.',
        featured: false,
      }
    ];
  }, []);

  // Filtered Portfolio
  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'all') return masterPortfolio;
    return masterPortfolio.filter(item => item.category === selectedCategory);
  }, [masterPortfolio, selectedCategory]);

  // Instant Quote Calculation for this Editor
  const calculatedQuote = useMemo(() => {
    let base = 420;
    let turnHours = 24;

    if (quoteFormat === 'shorts') {
      base = 180;
      turnHours = 14;
    } else if (quoteFormat === 'youtube') {
      base = 310;
      turnHours = 28;
    } else if (quoteFormat === '3d') {
      base = 580;
      turnHours = 44;
    }

    if (quoteResolution === '4k') base *= 1.2;
    if (quoteResolution === '8k') base *= 1.45;
    if (quoteSpeed === 'rush') {
      base *= 1.35;
      turnHours = Math.round(turnHours * 0.5);
    }

    return {
      price: Math.round(base),
      hours: Math.max(12, turnHours),
    };
  }, [quoteFormat, quoteResolution, quoteSpeed]);

  const testimonials = [
    {
      quote: `${editor.fullName} transformed our raw footage into a commercial that generated 3.4x higher conversion on Meta ads. Incredible pacing, crisp sound design, and delivered 6 hours ahead of deadline.`,
      author: 'Sarah Jenkins',
      role: 'Head of Creative, Aurora Skincare',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'May 2026',
    },
    {
      quote: `The ACES color science and DaVinci grading were television broadcast ready on v1. The direct 1GB Cloudflare R2 submission saved our team days of file transfer headaches.`,
      author: 'Liam Vance',
      role: 'Executive Producer, TechFlow Studios',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'April 2026',
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#09090B] text-gray-900 dark:text-zinc-100 font-sans selection:bg-gray-900 selection:text-white transition-colors">
      
      {/* 1. STICKY TOP BRAND & BACK HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-200/80 dark:border-zinc-800 px-4 sm:px-8 py-3.5 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 focus:outline-none group hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                Gogangs<span className="text-pink-500 font-black text-2xl leading-none">.</span>
              </span>
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for Hire
            </span>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
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
              onClick={() => setBookingModalOpen(true)}
              className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book {editor.fullName.split(' ')[0]}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. CINEMATIC HERO PORTFOLIO PROFILE BANNER */}
      <section className="relative pt-10 pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm relative overflow-hidden">
          
          {/* Ambient Decorative Gradient in Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gray-100/60 via-zinc-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* Left: Avatar, Badges, Name, Bio */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Large Creator Avatar */}
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-b from-gray-700 via-gray-900 to-black shadow-xl ring-4 ring-gray-100">
                    <img
                      src={editor.avatarUrl}
                      alt={editor.fullName}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  </div>
                  <span className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1 shadow-md animate-pulse" />
                </div>

                {/* Name, Verified Badges & Role */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight">
                      {editor.fullName}
                    </h1>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-black shadow-2xs">
                      TOP 1% SPECIALIST
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Pro
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-gray-700">
                    {editor.role}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {editor.city}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {editor.turnaround} First-Cut
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>4.9</span>
                      <span className="text-gray-400 font-normal">({editor.reviewsCount} reviews)</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Bio Statement */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal max-w-3xl">
                {editor.bio}
              </p>

              {/* Social Channels & Credentials */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold">
                <a 
                  href={`mailto:${editor.email}`}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{editor.email}</span>
                </a>
                <span className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-gray-900" />
                  <span>linkedin.com/in/{editor.fullName.toLowerCase().replace(' ', '')}</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-gray-900" />
                  <span>@{editor.fullName.toLowerCase().replace(' ', '')}.edits</span>
                </span>
              </div>

            </div>

            {/* Right: Booking Summary & Rate Card */}
            <div className="lg:col-span-4 bg-gray-50 rounded-3xl p-6 border border-gray-200 space-y-5">
              
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Production Terms</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded">
                  ESCROW PROTECTED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Starting Rate</span>
                  <span className="text-2xl font-black text-gray-900 mt-0.5 block">{editor.hourlyRate}</span>
                  <span className="text-[10px] text-gray-500">Fixed Milestones</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Deliverables</span>
                  <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{editor.completedProjects}+</span>
                  <span className="text-[10px] text-gray-500">100% On-Time</span>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct <strong>1GB Cloudflare R2</strong> Browser Uploads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Frame-accurate review queue with 2 revisions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Broadcast ProRes 422 / 4444 Master exports</span>
                </div>
              </div>

              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hire {editor.fullName.split(' ')[0]} Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* Bottom Highlights Strip */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">NLE Software</span>
                <span className="text-xs font-black text-gray-900">DaVinci • Premiere • AE</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Cloud Workspace</span>
                <span className="text-xs font-black text-gray-900">Dedicated 1GB R2 Bucket</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Vetting Score</span>
                <span className="text-xs font-black text-gray-900">99.4% Top 1% Certified</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Color Pipeline</span>
                <span className="text-xs font-black text-gray-900">ACES 1.3 • Rec.709 / 2020</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HERO SHOWREEL SPOTLIGHT (FEATURED VIDEO PLAYER) */}
      <section className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <Play className="w-3.5 h-3.5 fill-gray-800" />
                <span>Featured Master Showreel</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {masterPortfolio[0].title}
              </h2>
            </div>

            <span className="text-xs font-mono font-bold text-gray-500">
              {masterPortfolio[0].resolution} • {masterPortfolio[0].codec}
            </span>
          </div>

          {/* Big Cinematic Showcase Player */}
          <div 
            onClick={() => setSelectedVideoModal(masterPortfolio[0])}
            className="relative aspect-video rounded-2xl overflow-hidden bg-black group cursor-pointer shadow-xl"
          >
            <img
              src={masterPortfolio[0].thumbnail}
              alt={masterPortfolio[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white font-mono text-xs border border-white/20">
                PRORES 422 HQ • 4K UHD
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-500 text-black font-extrabold text-xs">
                ACES CINE GRADE
              </span>
            </div>

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-gray-900 ml-1" />
              </div>
            </div>

            {/* Timeline Scrub Indicator */}
            <div className="absolute bottom-4 left-6 right-6 z-10 flex items-center justify-between text-xs text-gray-300">
              <span className="font-mono">00:00 / {masterPortfolio[0].duration}</span>
              <span className="font-bold text-white">Click to watch in Full 4K</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CURATED WORK & PORTFOLIO SHOWCASE */}
      <section className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm space-y-8">
          
          {/* Section Header & Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <Film className="w-3.5 h-3.5" />
                <span>Selected Works & Commercials</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Master Deliverables Portfolio ({masterPortfolio.length})
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Works' },
                { id: 'commercial', label: 'Commercial Ads' },
                { id: 'shorts', label: 'Viral Shorts / 9:16' },
                { id: 'motion', label: '3D Motion & VFX' },
                { id: 'doc', label: 'Color & Narrative' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedVideoModal(item)}
                className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-900 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white border border-white/20">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-black/60 text-gray-300">
                      {item.aspect}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-white">
                      {item.duration}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 fill-gray-900 ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-black text-sm text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.software.map(sw => (
                      <span key={sw} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                        {sw}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-gray-200/80">
                    <span className="font-mono">{item.resolution}</span>
                    <span className="font-bold text-gray-900">{item.codec}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. HARDWARE, WORKSTATION & SLA GUARANTEES */}
      <section className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Studio Hardware & Production Specs */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-gray-900" />
                <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider">Studio Workstation & Hardware</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                CALIBRATED PRO SETUP
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span className="text-gray-500">Primary Render Rig</span>
                <span className="font-bold text-gray-900">Apple Mac Studio M2 Ultra (128GB Unified)</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span className="text-gray-500">Color Reference Display</span>
                <span className="font-bold text-gray-900">ASUS ProArt PA32UCG 4K HDR (1600 nits)</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span className="text-gray-500">High-Speed Storage</span>
                <span className="font-bold text-gray-900">16TB NVMe RAID Array (7,000 MB/s)</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span className="text-gray-500">Bandwidth & Egress</span>
                <span className="font-bold text-gray-900">1.0 Gbps Symmetrical Fiber</span>
              </div>
            </div>
          </div>

          {/* Turnaround SLAs & Escrow Guarantees */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-900" />
                <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider">Production SLAs & Guarantees</h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400 font-bold">100% GOGANGS SLA</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span className="text-gray-500">First-Cut Turnaround</span>
                <span className="font-bold text-emerald-700">18 - 24 Hours Guaranteed</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span className="text-gray-500">Revision Rounds</span>
                <span className="font-bold text-gray-900">2 Structured Frame-Accurate Rounds</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span className="text-gray-500">Milestone Payment Protection</span>
                <span className="font-bold text-gray-900">Locked Escrow until Final Approval</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span className="text-gray-500">Deliverable Format</span>
                <span className="font-bold text-gray-900">Full 4K ProRes 422 HQ + Clean Masters</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CLIENT REVIEWS & TESTIMONIALS */}
      <section className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Verified Client Feedback</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                What Studios Say About {editor.fullName.split(' ')[0]}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-gray-900">4.9 / 5.0</span>
              <span className="text-xs text-gray-400 block">100% On-Time Delivery</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4 flex flex-col justify-between">
                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "{t.quote}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200/80">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.author} className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-900" />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{t.author}</span>
                      <span className="text-[11px] text-gray-500">{t.role}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400 text-xs font-bold">★★★★★</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. INSTANT PROJECT CALCULATOR & BOTTOM LAUNCHPAD */}
      <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/90 shadow-sm space-y-8">
          
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Instant Milestone Estimator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Ready to Produce with {editor.fullName.split(' ')[0]}?
            </h2>
            <p className="text-xs text-gray-500">
              Configure your deliverable format to view estimated milestone budget and turnaround velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Options */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1.5 uppercase tracking-wider text-[11px]">Format</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'commercial', label: 'Commercial' },
                    { id: 'shorts', label: 'Viral Shorts' },
                    { id: 'youtube', label: 'YouTube Cut' },
                    { id: '3d', label: '3D Motion' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setQuoteFormat(f.id as any)}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        quoteFormat === f.id
                          ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5 uppercase tracking-wider text-[11px]">Master Resolution</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1080p', label: '1080p Web HD' },
                    { id: '4k', label: '4K ProRes Master' },
                    { id: '8k', label: '8K RAW Cinema' },
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setQuoteResolution(r.id as any)}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        quoteResolution === r.id
                          ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5 uppercase tracking-wider text-[11px]">Delivery Speed</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'rush', label: '⚡ Rush Priority (< 16h)' },
                    { id: 'standard', label: '⏱️ Standard (24h - 48h)' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setQuoteSpeed(s.id as any)}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        quoteSpeed === s.id
                          ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Box */}
            <div className="lg:col-span-5 bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase">Estimated Milestone</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  GUARANTEED RATE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Milestone Budget</span>
                  <span className="text-2xl font-black text-gray-900 mt-0.5 block">${calculatedQuote.price}</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Turnaround</span>
                  <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{calculatedQuote.hours} Hours</span>
                </div>
              </div>

              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Project with {editor.fullName.split(' ')[0]}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 8. MODAL VIDEO PLAYER FOR PORTFOLIO ITEMS */}
      {selectedVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
            
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-gray-900 uppercase">{selectedVideoModal.title}</h3>
                <p className="text-[11px] text-gray-500">{selectedVideoModal.categoryLabel} • {selectedVideoModal.resolution}</p>
              </div>
              <button
                onClick={() => setSelectedVideoModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
              <img
                src={selectedVideoModal.thumbnail}
                alt={selectedVideoModal.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="relative z-10 w-16 h-16 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-2xl">
                <Play className="w-6 h-6 fill-gray-900 ml-1" />
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                {selectedVideoModal.description}
              </p>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-bold">RESOLUTION</span>
                  <span className="font-bold text-gray-900 mt-0.5">{selectedVideoModal.resolution}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-bold">CODEC</span>
                  <span className="font-bold text-gray-900 mt-0.5">{selectedVideoModal.codec}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-bold">WORKFLOW</span>
                  <span className="font-bold text-gray-900 mt-0.5">R2 1GB Cloud</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setSelectedVideoModal(null);
                    setBookingModalOpen(true);
                  }}
                  className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Book {editor.fullName.split(' ')[0]} for This Style
                </button>
                <button
                  onClick={() => setSelectedVideoModal(null)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 9. INTERACTIVE DIRECT BOOKING & BRIEF MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gray-900" />
                <h3 className="font-black text-sm text-gray-900 uppercase">Book {editor.fullName}</h3>
              </div>
              <button
                onClick={() => {
                  setBookingModalOpen(false);
                  setBookingSubmitted(false);
                }}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {bookingSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-black text-sm text-gray-900">Project Brief Dispatched!</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  {editor.fullName} has received your brief and 1GB Cloudflare R2 bucket invitation.
                </p>
                <button
                  onClick={() => {
                    setBookingModalOpen(false);
                    setBookingSubmitted(false);
                    onNavigate('/login');
                  }}
                  className="bg-gray-900 text-white text-xs font-bold px-5 py-2 rounded-xl mt-2 cursor-pointer"
                >
                  Go to Project Dashboard
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBookingSubmitted(true);
                  if (addToast) addToast(`Project request sent to ${editor.fullName}!`, 'success');
                }}
                className="space-y-3.5 text-xs text-left"
              >
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Project Campaign Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Global Brand Film"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Format</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900">
                      <option>Commercial 4K</option>
                      <option>Reels / Shorts (9:16)</option>
                      <option>YouTube Video</option>
                      <option>3D Motion Graphics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Target Delivery</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900">
                      <option>Under 24 Hours (Rush)</option>
                      <option>2 - 3 Days</option>
                      <option>1 Week</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="director@studio.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Dispatch Creative Brief</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 10. MULTI-COLUMN COMPACT FOOTER */}
      <footer className="bg-white text-gray-600 pt-10 pb-8 px-4 sm:px-8 border-t border-gray-200/80 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-black text-gray-900">gogangs.</span>
            <span className="text-gray-400">Verified Talent Network</span>
          </div>
          <div className="text-gray-500 text-[11px]">
            © 2026 Gogangs Platform. 1GB Cloudflare R2 Cloud Workspaces.
          </div>
        </div>
      </footer>

    </div>
  );
}
