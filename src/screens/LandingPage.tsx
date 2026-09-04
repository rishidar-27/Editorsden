import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Layers,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
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
  DollarSign,
  Palette,
  Scissors,
  CheckCheck,
  Radio,
  Share2,
  RefreshCw,
  HelpCircle,
  BarChart3,
  Flame,
  Filter,
  MessageSquare,
  FileVideo,
  Shield,
  CreditCard,
  FolderSync,
  SlidersHorizontal,
  Send,
  Lock,
  DownloadCloud
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
  const { editors, addToast } = useApp();
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedShowreel, setSelectedShowreel] = useState<any | null>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultFormSubmitted, setConsultFormSubmitted] = useState(false);
  
  // Onboarding Step Switcher & Interactive Simulator State
  const [onboardingTab, setOnboardingTab] = useState<'studio' | 'editor'>('studio');
  const [activeOnboardingStep, setActiveOnboardingStep] = useState<number>(0);

  // Interactive Simulator States
  // Studio Step 1 (Brief Simulator)
  const [briefSubtasks, setBriefSubtasks] = useState<{ [key: string]: boolean }>({
    roughCut: true,
    motionGfx: true,
    colorGrade: true,
    soundDesign: false,
  });

  // Studio Step 3 (R2 Upload Simulator)
  const [uploadSimProgress, setUploadSimProgress] = useState<number>(84);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  // Studio Step 4 / Studio Suite (Split Screen Diff)
  const [diffSliderPos, setDiffSliderPos] = useState<number>(50);

  // Interactive Studio Workstation Playground State
  const [activeLut, setActiveLut] = useState<'raw' | 'cine' | 'commercial' | 'moody'>('cine');
  const [activeTimelinePin, setActiveTimelinePin] = useState<number>(0);
  const [isPlayingMock, setIsPlayingMock] = useState(true);

  // Interactive Project Matcher / Quote Wizard State
  const [wizardFormat, setWizardFormat] = useState<'commercial' | 'shorts' | 'youtube' | '3d' | 'doc'>('commercial');
  const [wizardResolution, setWizardResolution] = useState<'1080p' | '4k' | '8k'>('4k');
  const [wizardSpeed, setWizardSpeed] = useState<'rush' | 'standard' | 'relaxed'>('standard');
  const [wizardAddons, setWizardAddons] = useState<{ sound: boolean; captions: boolean; vfx: boolean }>({
    sound: true,
    captions: false,
    vfx: false,
  });

  // 5-Stage Vetting Pipeline Selected Stage
  const [activeVettingStage, setActiveVettingStage] = useState<number>(0);

  // Interactive ROI Calculator State
  const [monthlyVideos, setMonthlyVideos] = useState<number>(12);
  const [currentTurnaroundDays, setCurrentTurnaroundDays] = useState<number>(6);
  
  // FAQ Category and Accordion State
  const [faqCategory, setFaqCategory] = useState<'all' | 'storage' | 'review' | 'pricing'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const timer = setTimeout(() => setHeroRevealed(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Upload simulator ticker
  useEffect(() => {
    let interval: any;
    if (isSimulatingUpload) {
      interval = setInterval(() => {
        setUploadSimProgress(prev => {
          if (prev >= 100) {
            setIsSimulatingUpload(false);
            if (addToast) addToast('Upload complete: Master_4K_ProRes422HQ.mov synced to R2 bucket', 'success');
            return 100;
          }
          return prev + 4;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulatingUpload, addToast]);

  // Calculated Brief Milestone Budget in Simulator
  const simulatedBriefBudget = useMemo(() => {
    let total = 0;
    if (briefSubtasks.roughCut) total += 350;
    if (briefSubtasks.motionGfx) total += 220;
    if (briefSubtasks.colorGrade) total += 180;
    if (briefSubtasks.soundDesign) total += 120;
    return total;
  }, [briefSubtasks]);

  // Calculated ROI Metrics
  const estimatedHoursSaved = useMemo(() => {
    return monthlyVideos * 14;
  }, [monthlyVideos]);

  const estimatedTurnaroundVelocity = useMemo(() => {
    const newTurnaround = Math.max(1, Math.round(currentTurnaroundDays * 0.28));
    return {
      days: newTurnaround,
      multiplier: (currentTurnaroundDays / newTurnaround).toFixed(1),
      percentFaster: Math.round(((currentTurnaroundDays - newTurnaround) / currentTurnaroundDays) * 100),
    };
  }, [currentTurnaroundDays]);

  const estimatedCostSavings = useMemo(() => {
    return monthlyVideos * 240;
  }, [monthlyVideos]);

  // Project Matcher Live Calculation
  const wizardEstimate = useMemo(() => {
    let basePrice = 450;
    let turnHours = 24;
    let recommendedSpecialist = 'Marcus Chen';
    let specialistRole = 'Lead Commercial Reel Specialist';
    let specialistAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
    let editorId = 'e1';

    if (wizardFormat === 'shorts') {
      basePrice = 180;
      turnHours = 14;
      recommendedSpecialist = 'James Wilson';
      specialistRole = 'Viral Shorts & Pacing Strategist';
      specialistAvatar = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80';
      editorId = 'e5';
    } else if (wizardFormat === 'youtube') {
      basePrice = 320;
      turnHours = 28;
      recommendedSpecialist = 'Elena Rodriguez';
      specialistRole = 'Commercial & Content Director';
      specialistAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';
      editorId = 'e2';
    } else if (wizardFormat === '3d') {
      basePrice = 650;
      turnHours = 48;
      recommendedSpecialist = 'Priya Sharma';
      specialistRole = '3D Motion Graphics & VFX Lead';
      specialistAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80';
      editorId = 'e4';
    } else if (wizardFormat === 'doc') {
      basePrice = 580;
      turnHours = 40;
      recommendedSpecialist = 'David Park';
      specialistRole = 'Senior DaVinci Colorist & Finisher';
      specialistAvatar = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80';
      editorId = 'e3';
    }

    if (wizardResolution === '4k') basePrice *= 1.2;
    if (wizardResolution === '8k') basePrice *= 1.45;

    if (wizardSpeed === 'rush') {
      basePrice *= 1.35;
      turnHours = Math.round(turnHours * 0.5);
    } else if (wizardSpeed === 'relaxed') {
      basePrice *= 0.9;
      turnHours = Math.round(turnHours * 1.8);
    }

    if (wizardAddons.sound) basePrice += 80;
    if (wizardAddons.captions) basePrice += 50;
    if (wizardAddons.vfx) basePrice += 140;

    return {
      price: Math.round(basePrice),
      turnHours: Math.max(12, turnHours),
      recommendedSpecialist,
      specialistRole,
      specialistAvatar,
      editorId,
    };
  }, [wizardFormat, wizardResolution, wizardSpeed, wizardAddons]);

  // Roster of Vetted Editors
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
        sampleTitle: 'Nike Athletic Master Commercial 4K',
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
        sampleTitle: 'Vogue Haute Couture Autumn Cut',
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
        sampleTitle: 'Cinematic Feature Film 8K Color Grade',
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
        sampleTitle: 'Fintech 3D Mobile App Product Launch',
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
        sampleTitle: '10M+ Views TikTok Series Retention Cut',
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
        sampleTitle: 'Wild Earth Expedition Series Episode 4',
      }
    ];
  }, [editors]);

  // Filtered roster
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

  // Showreels with rich metadata
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
      description: 'High-octane automotive and lifestyle reel graded in ACES color space with custom sound design and dynamic speed ramps.'
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
      description: 'Television broadcast master deliverable with multi-format cutdowns for web, digital billboards, and social channels.'
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
      description: 'Deep emotional narrative with natural skin tone protection, textured 35mm film halation, and organic grain curves.'
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
      description: 'Seamless kinetic typography, 3D product renders, and UI mockups animated with particle simulations and physics engines.'
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
      description: 'Pattern interrupts, animated subtitles, dynamic zooms, and sound SFX engineered for 85%+ audience retention curves.'
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

  // Timeline Markers for the Hero Studio Preview
  const timelineMarkers = [
    { time: '00:14', title: 'Macro B-Roll Cut', note: 'Swapped raw shot with 60fps high-speed macro angle.' },
    { time: '00:32', title: 'ACES Color Correction', note: 'Matched skin tone exposure and highlight rolloff.' },
    { time: '00:54', title: 'Audio Ducking & SFX', note: 'Ducked background score by -4.5dB under voiceover.' },
  ];

  // Competitive Comparison Matrix Data
  const comparisonRows = [
    { feature: 'Dedicated 1GB Cloudflare R2 Workspace', gogangs: true, freelance: false, agency: false, drive: 'Manual' },
    { feature: 'Frame-Accurate Versioning (v1, v2) & Diffing', gogangs: true, freelance: false, agency: 'Slow', drive: false },
    { feature: 'Vetted Top 1% Editing Specialists', gogangs: true, freelance: 'Hit or Miss', agency: true, drive: false },
    { feature: 'Zero-Egress Direct S3 Browser Uploads', gogangs: true, freelance: false, agency: false, drive: false },
    { feature: 'Granular Multi-Task Milestones', gogangs: true, freelance: 'Manual', agency: true, drive: false },
    { feature: 'Average Turnaround Time', gogangs: '18 - 24 Hours', freelance: '3 - 7 Days', agency: '1 - 2 Weeks', drive: 'Unpredictable' },
  ];

  // 4-Step Onboarding Architecture Definitions
  const studioOnboardingSteps = [
    { 
      step: '01', 
      title: 'Post Brief & Milestones', 
      desc: 'Define campaign subtasks (Rough Cut, Motion GFX, Color Grade) and lock milestone escrow budgets.',
      icon: FolderSync,
      badge: 'Escrow Protected',
    },
    { 
      step: '02', 
      title: 'Smart Specialist Matching', 
      desc: 'Our engine matches your creative brief to top-rated editors based on software mastery and velocity.',
      icon: Cpu,
      badge: '99.4% Match Rate',
    },
    { 
      step: '03', 
      title: '1GB Cloud Collaboration', 
      desc: 'Editors stream 4K deliverables straight to dedicated Cloudflare R2 buckets without egress limits.',
      icon: UploadCloud,
      badge: 'Zero-Egress Cloud',
    },
    { 
      step: '04', 
      title: 'Frame-Accurate Approvals', 
      desc: 'Review frame cuts, compare v1 vs v2 revisions, drop timestamped pins, and approve master exports.',
      icon: CheckCircle2,
      badge: 'Version Diffing',
    },
  ];

  const editorOnboardingSteps = [
    { 
      step: '01', 
      title: 'Portfolio & Skill Screen', 
      desc: 'Submit your best showreel and clear our 5-stage pacing, color science, and codec proficiency tests.',
      icon: Award,
      badge: 'Top 1% Standards',
    },
    { 
      step: '02', 
      title: 'Instant 1GB R2 Workspace', 
      desc: 'Receive your dedicated high-speed Cloudflare R2 cloud storage with instant S3 presigned credentials.',
      icon: UploadCloud,
      badge: 'Instant Provisioning',
    },
    { 
      step: '03', 
      title: 'Receive High-Ticket Tasks', 
      desc: 'Get matched with top creators, creative agencies, and production studios aligned with your style.',
      icon: Zap,
      badge: 'Direct Matching',
    },
    { 
      step: '04', 
      title: 'Guaranteed Escrow Payouts', 
      desc: 'Deliver master cuts, receive structured review notes, and get paid instantly upon client approval.',
      icon: DollarSign,
      badge: 'Instant Release',
    },
  ];

  // 5-Stage Vetting Pipeline Data
  const vettingStages = [
    {
      step: '01',
      title: 'Showreel & Portfolio Audit',
      rate: '< 4.2% Pass',
      desc: 'Deep manual evaluation of storytelling, pacing cadence, visual rhythm, and sound mixing balance across past deliverables.',
      specs: ['Minimum 3 commercial projects', 'Broadcast resolution compliance', 'Audio mastering at -14 LUFS standard'],
    },
    {
      step: '02',
      title: 'Raw Codec & Bitrate Screening',
      rate: '< 2.8% Pass',
      desc: 'Real-world speed benchmark testing ingestion, proxy workflows, and exporting in Apple ProRes 422 HQ and DNxHR.',
      specs: ['Zero frame-drop compliance', 'Correct color space tags', 'Alpha channel transparency test'],
    },
    {
      step: '03',
      title: 'ACES & HDR Color Science Screen',
      rate: '< 1.8% Pass',
      desc: 'Rigorous color grading test checking skin-tone retention under extreme exposure, ACES transforms, and CST node structures.',
      specs: ['DaVinci Resolve node grading', 'Highlight roll-off protection', 'Rec.709 vs Rec.2020 conformity'],
    },
    {
      step: '04',
      title: 'Dynamic Motion & Typography Test',
      rate: '< 1.4% Pass',
      desc: 'Assessing kinetic typography ease curves, 3D tracking precision, roto accuracy, and modern motion graphics pacing.',
      specs: ['After Effects & Blender mastery', 'Custom keyframe easing', 'Vector asset sharpness'],
    },
    {
      step: '05',
      title: 'Turnaround SLA & Client Comms',
      rate: 'Top 1.0% Certified',
      desc: 'Strict vetting of adherence to 24-hour turnaround commitments, revision turnarounds, and professional communication standards.',
      specs: ['Under 2-hour response SLA', 'Clear version logging', 'Escrow contract agreement'],
    },
  ];

  // Categorized FAQ Dataset
  const allFaqItems = [
    {
      category: 'storage',
      categoryLabel: 'Storage & Cloud',
      q: 'How does the 1GB Cloudflare R2 Cloud Workspace work?',
      a: 'Every editor receives a high-speed, dedicated 1GB Cloudflare R2 workspace. Uploads are streamed directly from the browser using S3 presigned URLs without bogging down servers, ensuring lightning-fast uploads with zero egress fees.'
    },
    {
      category: 'review',
      categoryLabel: 'Review & Versioning',
      q: 'How do direct file submissions and review versioning work?',
      a: 'Instead of sharing unorganized external links, editors submit MP4/MOV cuts directly to the task queue. The system automatically tags versions (v1, v2) with file sizes in MB, allowing admins to inspect frames, compare revisions, and log specific feedback.'
    },
    {
      category: 'storage',
      categoryLabel: 'Codecs & Formats',
      q: 'What video codecs and file resolutions are supported?',
      a: 'Gogangs natively handles Apple ProRes 422/4444, Avid DNxHR, H.264/H.265 (HEVC 10-bit), BRAW, REDCODE, and standard web formats from 1080p up to 8K DCI.'
    },
    {
      category: 'review',
      categoryLabel: 'Vetting & Quality',
      q: 'How are video editors vetted and verified?',
      a: 'Every editor undergoes a rigorous 5-stage assessment including portfolio verification, pacing and typography evaluation, color science proficiency tests, and client communication standards before receiving their verified badge.'
    },
    {
      category: 'pricing',
      categoryLabel: 'Milestones & Escrow',
      q: 'Can agencies create multi-task project milestones?',
      a: 'Yes! Agency admins can break down complex campaigns into granular subtasks (e.g. Rough Cut, Sound Design, 3D Intro, Master Color Grade), assigning distinct specialists to each milestone with separate deadlines and tracking.'
    },
    {
      category: 'pricing',
      categoryLabel: 'Payments & Guarantees',
      q: 'How are client payments and editor payouts handled?',
      a: 'Payments are held securely in project milestone escrow. Once the admin or client approves the final deliverable version, funds are released immediately with automated invoicing.'
    }
  ];

  // Filtered FAQ items based on selected category tab
  const filteredFaqs = useMemo(() => {
    if (faqCategory === 'all') return allFaqItems;
    return allFaqItems.filter(item => item.category === faqCategory);
  }, [faqCategory]);

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-gray-900 font-sans selection:bg-gray-900 selection:text-white overflow-x-hidden">
      
      {/* 1. TOP ANNOUNCEMENT & LIVE STATUS TICKER */}
      <div className="bg-gray-900 text-white text-[11px] font-medium py-1.5 px-4 text-center border-b border-gray-800 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE PIPELINE
        </span>
        <span className="hidden sm:inline text-gray-300">
          Over 1,420+ 4K master deliverables completed this month.
        </span>
        <span className="text-gray-400">• Average editor turnaround: <strong className="text-white">18.4 Hours</strong></span>
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

            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-600">
              <a href="#onboarding-flow" className="hover:text-gray-900 transition-colors">Onboarding Flow</a>
              <a href="#studio" className="hover:text-gray-900 transition-colors">Studio Suite</a>
              <a href="#estimator" className="hover:text-gray-900 transition-colors">Instant Match</a>
              <a href="#vetting" className="hover:text-gray-900 transition-colors">5-Stage Vetting</a>
              <a href="#roster" className="hover:text-gray-900 transition-colors">Talent Directory</a>
              <a href="#comparison" className="hover:text-gray-900 transition-colors">Comparison</a>
              <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ Hub</a>
            </nav>
          </div>

          {/* Quick Demo Switchers & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2">
              <button 
                onClick={() => onNavigate('/admin/dashboard')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-gray-200 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gray-700" />
                <span>Admin Demo</span>
              </button>
              <button 
                onClick={() => onNavigate('/editor/dashboard')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-gray-200 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <MonitorPlay className="w-3.5 h-3.5 text-gray-700" />
                <span>Editor Demo</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/login')}
                className="text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('/login')}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
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
                  className="absolute right-2 top-2 bg-gray-900 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
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
                    className="px-2.5 py-0.5 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors cursor-pointer"
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
                  const el = document.getElementById('onboarding-flow');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>How Onboarding Works</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => {
                  const el = document.getElementById('studio');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold px-6 py-3.5 rounded-xl hover:border-gray-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Interactive Studio Demo</span>
                <Play className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Right Column: 3D Interactive Floating Editors Deck (3 PURE EDITOR CARDS ONLY) */}
          <div className={`lg:col-span-6 relative flex items-center justify-center min-h-[460px] transition-all duration-700 delay-150 ease-out-soft ${
            heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="relative w-full max-w-[520px] h-[420px] flex items-center justify-center perspective-[1000px]">
              
              {/* Card 1 (Left Tilted): Elena Rodriguez */}
              <div 
                onClick={() => onNavigate(`/editor/e2`)}
                className="absolute left-0 top-6 z-10 w-52 rounded-3xl bg-white border border-gray-200 p-4 shadow-xl transform -rotate-12 -translate-x-4 hover:rotate-0 hover:scale-110 hover:z-40 transition-all duration-500 cursor-pointer flex flex-col items-center text-center group animate-float-card-2"
              >
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[8px] font-black px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                    COMMERCIAL
                  </span>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                    Available
                  </span>
                </div>

                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-b from-amber-400 to-amber-600 shadow-md ring-2 ring-gray-200 group-hover:scale-105 transition-transform my-1">
                  <img src={rosterEditors[1].avatar} alt="Elena" className="w-full h-full rounded-full object-cover" />
                </div>

                <div className="space-y-0.5 my-1.5">
                  <div className="text-xs font-black text-gray-900 uppercase group-hover:text-gray-700 transition-colors">ELENA RODRIGUEZ</div>
                  <div className="text-[10px] text-gray-500 font-medium">Commercial & Content Lead</div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 text-[10px] font-bold pt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                    <span className="text-gray-400 font-normal">(39)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 my-1">
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">DaVinci</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">Final Cut</span>
                </div>

                <div className="w-full pt-2.5 mt-1 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-gray-900">$70/hr</span>
                  <span className="text-gray-600 group-hover:text-gray-900 flex items-center gap-0.5 text-[10px]">
                    View <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>

              {/* Card 2 (Center Hero Main): David Park */}
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

              {/* Card 3 (Right Tilted): Marcus Chen */}
              <div 
                onClick={() => onNavigate(`/editor/e1`)}
                className="absolute right-0 top-6 z-10 w-52 rounded-3xl bg-white border border-gray-200 p-4 shadow-xl transform rotate-12 translate-x-4 hover:rotate-0 hover:scale-110 hover:z-40 transition-all duration-500 cursor-pointer flex flex-col items-center text-center group animate-float-card-1"
              >
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[8px] font-black px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                    TOP 1% REEL
                  </span>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                    Available
                  </span>
                </div>

                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-b from-blue-400 to-indigo-600 shadow-md ring-2 ring-gray-200 group-hover:scale-105 transition-transform my-1">
                  <img src={rosterEditors[0].avatar} alt="Marcus" className="w-full h-full rounded-full object-cover" />
                </div>

                <div className="space-y-0.5 my-1.5">
                  <div className="text-xs font-black text-gray-900 uppercase group-hover:text-gray-700 transition-colors">MARCUS CHEN</div>
                  <div className="text-[10px] text-gray-500 font-medium">Lead Reel Specialist</div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 text-[10px] font-bold pt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                    <span className="text-gray-400 font-normal">(48)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 my-1">
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">Premiere</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">After Effects</span>
                </div>

                <div className="w-full pt-2.5 mt-1 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-gray-900">$65/hr</span>
                  <span className="text-gray-600 group-hover:text-gray-900 flex items-center gap-0.5 text-[10px]">
                    View <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Real-Time Platform Counters */}
        <Reveal delay={200}>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-gray-200/80 pt-8 max-w-5xl">
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Vetted Specialists</div>
              <div className="text-2xl font-black text-gray-900 mt-1">250+</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Top 1% Acceptance Rate</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Master Deliverables</div>
              <div className="text-2xl font-black text-gray-900 mt-1">1,420+</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">100% On-Time Delivery</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Agency Hours Saved</div>
              <div className="text-2xl font-black text-gray-900 mt-1">15,000+</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Zero Transfer Latency</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Client Approval Rate</div>
              <div className="text-2xl font-black text-gray-900 mt-1">99.4%</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Across 40+ Top Agencies</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. DEDICATED VISUAL ONBOARDING STEPPER WITH LIVE INTERACTIVE PIPELINE SIMULATOR */}
      <section id="onboarding-flow" className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.1}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            {/* Header & Tab Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                  <FolderSync className="w-3.5 h-3.5" />
                  <span>Onboarding & Architecture</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  How Onboarding Works on Gogangs
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Click any stage below to test the live simulated interactive pipeline.
                </p>
              </div>

              {/* Persona Tab Switcher */}
              <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                <button
                  onClick={() => {
                    setOnboardingTab('studio');
                    setActiveOnboardingStep(0);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    onboardingTab === 'studio'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>For Studios & Agencies</span>
                </button>
                <button
                  onClick={() => {
                    setOnboardingTab('editor');
                    setActiveOnboardingStep(0);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    onboardingTab === 'editor'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>For Video Editors</span>
                </button>
              </div>
            </div>

            {/* 4 Clickable Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
              {(onboardingTab === 'studio' ? studioOnboardingSteps : editorOnboardingSteps).map((step, idx) => {
                const isActive = activeOnboardingStep === idx;
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveOnboardingStep(idx)}
                    className={`rounded-2xl p-5 border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 group ${
                      isActive
                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-[1.02]'
                        : 'bg-gray-50/90 hover:bg-white text-gray-900 border-gray-200/90 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-black w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${
                          isActive ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                        }`}>
                          {step.step}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-200/70 text-gray-600'
                        }`}>
                          {step.badge}
                        </span>
                      </div>
                      <h3 className={`font-bold text-sm mb-1.5 ${isActive ? 'text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs leading-relaxed font-normal ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>
                        {step.desc}
                      </p>
                    </div>

                    <div className={`pt-3 border-t flex items-center justify-between text-[11px] font-semibold ${
                      isActive ? 'border-gray-800 text-emerald-400' : 'border-gray-200 text-emerald-700'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span>Interactive Simulator</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold">{isActive ? 'Active Demo' : 'Click to test'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LIVE INTERACTIVE SIMULATOR WIDGET FOR THE ACTIVE ONBOARDING STEP */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Interactive Step {activeOnboardingStep + 1} Simulation: {(onboardingTab === 'studio' ? studioOnboardingSteps : editorOnboardingSteps)[activeOnboardingStep].title}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-500">GOGANGS_ENGINE_V2_DEMO</span>
              </div>

              {/* STUDIO STEP 1 SIMULATOR: Interactive Brief & Milestone Escrow Builder */}
              {onboardingTab === 'studio' && activeOnboardingStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <div className="text-xs font-bold text-gray-800">Select Milestone Subtasks to Include in Brief:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'roughCut', label: '1. Rough Cut & Pacing', price: '$350', time: '12h' },
                        { id: 'motionGfx', label: '2. 3D Motion & Titles', price: '$220', time: '8h' },
                        { id: 'colorGrade', label: '3. ACES Color Grade', price: '$180', time: '6h' },
                        { id: 'soundDesign', label: '4. Sound Design & Mix', price: '$120', time: '4h' },
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setBriefSubtasks(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            briefSubtasks[item.id]
                              ? 'bg-white border-gray-900 shadow-xs text-gray-900 font-bold'
                              : 'bg-gray-100/70 border-gray-200 text-gray-500'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                              briefSubtasks[item.id] ? 'bg-gray-900 text-white' : 'border border-gray-300'
                            }`}>
                              {briefSubtasks[item.id] && <Check className="w-3 h-3" />}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          <span className="text-xs font-mono">{item.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Total Milestone Escrow</span>
                      <span className="text-xl font-black text-gray-900">${simulatedBriefBudget} USD</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Funds are held in secure project escrow and released per milestone approval.
                    </div>
                    <button
                      onClick={() => onNavigate('/login')}
                      className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Create Project Brief</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STUDIO STEP 2 SIMULATOR: Smart Matchmaking Radar */}
              {onboardingTab === 'studio' && activeOnboardingStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-6 space-y-2">
                    <div className="text-xs font-bold text-gray-900">AI Specialist Routing Algorithm</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Matches your genre parameters with editors having verified mastery in your target NLE software and active turnaround bandwidth.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold pt-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Match Quality: 99.4% (Based on 1,420+ past deliverables)</span>
                    </div>
                  </div>

                  <div className="md:col-span-6 bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                    <img
                      src={rosterEditors[2].avatar}
                      alt="David"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-900 shrink-0"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900">DAVID PARK</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">12h Avg Turnaround</span>
                      </div>
                      <div className="text-[11px] text-gray-500">DaVinci Studio • ACES • 8K Finisher</div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-bold text-gray-900">$85/hr</span>
                        <button
                          onClick={() => onNavigate('/editor/e3')}
                          className="text-[11px] font-bold text-gray-900 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          View Profile <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STUDIO STEP 3 SIMULATOR: 1GB Cloudflare R2 Upload Simulation */}
              {onboardingTab === 'studio' && activeOnboardingStep === 2 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-gray-900">Cloudflare R2 Bucket: </span>
                      <span className="font-mono text-gray-600">bucket-editor-e3-workspace/cuts/</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-gray-500">
                      <span className="text-emerald-600 font-bold">124 MB/s Zero-Egress</span>
                      <span>•</span>
                      <span>S3 Presigned Authenticated</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-700">Master_4K_ProRes422HQ_v2.mov</span>
                      <span className="font-mono text-gray-900">{uploadSimProgress}% ({Math.round(uploadSimProgress * 8.6)} MB / 860 MB)</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-900 transition-all duration-300 rounded-full"
                        style={{ width: `${uploadSimProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        setUploadSimProgress(10);
                        setIsSimulatingUpload(true);
                      }}
                      className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingUpload ? 'animate-spin' : ''}`} />
                      <span>Re-simulate 4K Master Upload</span>
                    </button>
                    <span className="text-[11px] text-gray-500">Direct-to-S3 without server bottleneck</span>
                  </div>
                </div>
              )}

              {/* STUDIO STEP 4 SIMULATOR: Frame-Accurate Review & Diff */}
              {onboardingTab === 'studio' && activeOnboardingStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <div className="text-xs font-bold text-gray-900">Version Diffing & Timestamped Feedback Inspector</div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">00:14:22</span>
                          <span className="text-gray-700 font-medium">B-Roll Cut Revision (Applied in v2)</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">00:32:00</span>
                          <span className="text-gray-700 font-medium">ACES Color Match (Applied in v2)</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-white p-4 rounded-xl border border-gray-200 space-y-3 text-center">
                    <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span>Ready for 1-Click Master Approval</span>
                    </div>
                    <button
                      onClick={() => onNavigate('/admin/review')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Inspect Review Queue
                    </button>
                  </div>
                </div>
              )}

              {/* EDITOR ONBOARDING SIMULATORS */}
              {onboardingTab === 'editor' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-2">
                    <div className="text-xs font-bold text-gray-900">
                      {activeOnboardingStep === 0 && 'Editor Verification: Submit Showreel for Top 1% Certification'}
                      {activeOnboardingStep === 1 && 'Workspace Allocation: Automatic 1GB High-Speed R2 Bucket'}
                      {activeOnboardingStep === 2 && 'Project Dispatch Queue: Direct Match to Premium Agencies'}
                      {activeOnboardingStep === 3 && 'Instant Escrow Settlement: Zero Payment Delays'}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {activeOnboardingStep === 0 && 'Our senior post-production leads evaluate your master showreel on pacing, sound mix, and color fidelity within 24 hours.'}
                      {activeOnboardingStep === 1 && 'Your dedicated Cloudflare R2 bucket is provisioned with browser S3 credentials for instant client deliverable sharing.'}
                      {activeOnboardingStep === 2 && 'Receive notifications for high-ticket commercial, YouTube, and 3D motion gigs matched directly to your hourly rate.'}
                      {activeOnboardingStep === 3 && 'Funds held in milestone escrow are disbursed to your account the moment a master cut version is approved.'}
                    </p>
                  </div>

                  <div className="md:col-span-4 bg-white p-4 rounded-xl border border-gray-200 text-center space-y-3">
                    <div className="text-xs font-bold text-gray-900">Get Verified as an Editor</div>
                    <button
                      onClick={() => onNavigate('/login')}
                      className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Start Application</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Stepper CTA */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500">
                Ready to experience the streamlined workflow?
              </div>
              <button
                onClick={() => onNavigate('/login')}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{onboardingTab === 'studio' ? 'Create Agency Account' : 'Apply as an Editor'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </Reveal>
      </section>

      {/* 5. INTERACTIVE STUDIO WORKSPACE PLAYGROUND */}
      <section id="studio" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.1}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                  <MonitorPlay className="w-3.5 h-3.5" />
                  <span>Interactive Studio Preview</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Frame-Accurate Video Operations Suite
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Test the real-time timeline scrubber, switch between ACES color grade LUTs, and inspect pinned revision feedback.
                </p>
              </div>

              {/* Color LUT Switcher Controls */}
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 px-2 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" /> LUT Grade:
                </span>
                {[
                  { id: 'raw', label: 'Raw S-Log3' },
                  { id: 'cine', label: 'Teal & Orange Cine' },
                  { id: 'commercial', label: 'Commercial Neutral' },
                  { id: 'moody', label: 'Moody 35mm' },
                ].map(lut => (
                  <button
                    key={lut.id}
                    onClick={() => setActiveLut(lut.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeLut === lut.id
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {lut.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mock NLE Studio Workstation */}
            <div className="rounded-2xl border border-gray-200 bg-gray-950 text-white overflow-hidden shadow-2xl">
              
              {/* Top Studio Bar */}
              <div className="px-4 py-2.5 bg-gray-900 border-b border-gray-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-gray-400 text-[11px]">PROJECT_MASTER_COMMERCIAL_V2.PRPROJ</span>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    R2 Cloudflare Sync: 100%
                  </span>
                  <span>3840x2160 • 60.00 fps</span>
                </div>
              </div>

              {/* Main Viewport & Video Player Mockup */}
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Video Monitor */}
                <div className="lg:col-span-8 relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80"
                    alt="Monitor"
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      activeLut === 'raw' ? 'contrast-75 brightness-125 saturate-50' :
                      activeLut === 'cine' ? 'contrast-125 saturate-125 hue-rotate-15' :
                      activeLut === 'commercial' ? 'contrast-105 brightness-105 saturate-110' :
                      'contrast-140 brightness-90 saturate-85 sepia-[0.2]'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Monitor Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[10px] font-mono border border-white/10 text-white">
                      REC 709 • {activeLut.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-red-600 text-[10px] font-black tracking-wider text-white">
                      PLAYING MASTER
                    </span>
                  </div>

                  {/* Center Playback Indicator */}
                  <button
                    onClick={() => setIsPlayingMock(!isPlayingMock)}
                    className="relative z-10 w-16 h-16 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                  >
                    {isPlayingMock ? (
                      <Pause className="w-6 h-6 fill-gray-900 text-gray-900" />
                    ) : (
                      <Play className="w-6 h-6 fill-gray-900 ml-1" />
                    )}
                  </button>

                  {/* Pinned Feedback Indicators on the Video */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs z-10">
                    <div className="bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-[11px] font-medium">
                        {timelineMarkers[activeTimelinePin]?.note || 'Click timeline markers below to inspect feedback.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Inspector & Feedback Feed */}
                <div className="lg:col-span-4 p-5 bg-gray-900 border-l border-gray-800 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Timestamped Revisions</span>
                      <span className="text-[10px] font-bold text-gray-400">3 Markers</span>
                    </div>

                    <div className="space-y-2.5">
                      {timelineMarkers.map((marker, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveTimelinePin(idx)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            activeTimelinePin === idx
                              ? 'bg-gray-800 border-white text-white shadow-md'
                              : 'bg-gray-950/60 border-gray-800 hover:border-gray-700 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span>{marker.title}</span>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                              {marker.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400">{marker.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Assigned Editor</span>
                      <span className="font-bold text-white">David Park (DaVinci Specialist)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Deliverable State</span>
                      <span className="text-emerald-400 font-bold">Ready for Approval (v2)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Multi-Track NLE Timeline Visualizer */}
              <div className="p-4 bg-gray-950 border-t border-gray-800 space-y-2">
                
                {/* Track 1: Video A-Roll */}
                <div className="flex items-center gap-3">
                  <span className="w-12 text-[10px] font-mono text-gray-500 uppercase">V2 B-ROLL</span>
                  <div className="flex-1 h-7 bg-gray-900 rounded-lg flex items-center p-1 gap-1 border border-gray-800">
                    <div 
                      onClick={() => setActiveTimelinePin(0)}
                      className="h-full bg-blue-900/60 hover:bg-blue-800/80 border border-blue-600/40 rounded px-2 flex items-center text-[9px] font-bold text-blue-200 w-1/4 cursor-pointer transition-colors"
                    >
                      Macro_Cut_01.mov (00:14)
                    </div>
                    <div 
                      onClick={() => setActiveTimelinePin(1)}
                      className="h-full bg-blue-900/60 hover:bg-blue-800/80 border border-blue-600/40 rounded px-2 flex items-center text-[9px] font-bold text-blue-200 w-1/3 cursor-pointer transition-colors"
                    >
                      Kinetic_3D_Type.mov
                    </div>
                  </div>
                </div>

                {/* Track 2: Video Base A-Roll */}
                <div className="flex items-center gap-3">
                  <span className="w-12 text-[10px] font-mono text-gray-500 uppercase">V1 A-ROLL</span>
                  <div className="flex-1 h-7 bg-gray-900 rounded-lg flex items-center p-1 gap-1 border border-gray-800">
                    <div 
                      onClick={() => setActiveTimelinePin(1)}
                      className="h-full bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-600/40 rounded px-2 flex items-center text-[9px] font-bold text-emerald-200 w-full cursor-pointer transition-colors"
                    >
                      Interview_Master_4K_ProRes422HQ.mov [{activeLut.toUpperCase()} LUT]
                    </div>
                  </div>
                </div>

                {/* Track 3: Audio Dialogue & SFX */}
                <div className="flex items-center gap-3">
                  <span className="w-12 text-[10px] font-mono text-gray-500 uppercase">A1 AUDIO</span>
                  <div className="flex-1 h-6 bg-gray-900 rounded-lg flex items-center p-1 gap-1 border border-gray-800">
                    <div 
                      onClick={() => setActiveTimelinePin(2)}
                      className="h-full bg-amber-900/60 hover:bg-amber-800/80 border border-amber-600/40 rounded px-2 flex items-center text-[9px] font-bold text-amber-200 w-2/3 cursor-pointer transition-colors"
                    >
                      Dialog_Master_iZotope_Denoised.wav
                    </div>
                    <div 
                      onClick={() => setActiveTimelinePin(2)}
                      className="h-full bg-amber-900/60 hover:bg-amber-800/80 border border-amber-600/40 rounded px-2 flex items-center text-[9px] font-bold text-amber-200 w-1/3 cursor-pointer transition-colors"
                    >
                      Whoosh_Riser_SFX.wav
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </Reveal>
      </section>

      {/* 6. INSTANT PROJECT MATCHER & ESTIMATOR */}
      <section id="estimator" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            <div className="max-w-3xl mx-auto text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant Pipeline Configurator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Configure Your Production & Match in Seconds
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Select your deliverable style, resolution, and speed. Our algorithm routes your brief to the perfect verified specialist.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Interactive Wizard Controls */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Step 1: Format Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                    1. Deliverable Genre & Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'commercial', label: 'Commercial & Brand', icon: Film },
                      { id: 'shorts', label: 'Viral Shorts / TikTok', icon: Wand2 },
                      { id: 'youtube', label: 'YouTube / Podcast', icon: MonitorPlay },
                      { id: '3d', label: '3D Motion & VFX', icon: Layers },
                      { id: 'doc', label: 'Documentary Film', icon: Camera },
                    ].map(item => {
                      const Icon = item.icon;
                      const active = wizardFormat === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setWizardFormat(item.id as any)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            active
                              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-2 ${active ? 'text-white' : 'text-gray-600'}`} />
                          <span className="text-xs font-bold leading-tight">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Resolution & Codec */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                    2. Resolution & Master Codec
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: '1080p', label: '1080p Full HD', desc: 'Standard Web H.264' },
                      { id: '4k', label: '4K ProRes Master', desc: 'Broadcast ProRes 422' },
                      { id: '8k', label: '8K RAW Cinema', desc: 'ACES / RED / BRAW' },
                    ].map(res => (
                      <button
                        key={res.id}
                        onClick={() => setWizardResolution(res.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          wizardResolution === res.id
                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{res.label}</div>
                        <div className={`text-[10px] mt-0.5 ${wizardResolution === res.id ? 'text-gray-300' : 'text-gray-400'}`}>
                          {res.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Turnaround Speed */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                    3. Turnaround Velocity
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'rush', label: '⚡ Rush Priority', desc: 'Under 18h Delivery' },
                      { id: 'standard', label: '⏱️ Standard', desc: '24 - 48h Delivery' },
                      { id: 'relaxed', label: '🌱 Extended', desc: '3 - 5 Days' },
                    ].map(speed => (
                      <button
                        key={speed.id}
                        onClick={() => setWizardSpeed(speed.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          wizardSpeed === speed.id
                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{speed.label}</div>
                        <div className={`text-[10px] mt-0.5 ${wizardSpeed === speed.id ? 'text-gray-300' : 'text-gray-400'}`}>
                          {speed.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 4: Optional Production Add-ons */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                    4. Optional Add-ons & Mastering
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'sound', label: 'Sound FX & Mix', price: '+$80' },
                      { id: 'captions', label: 'Animated Captions', price: '+$50' },
                      { id: 'vfx', label: '3D VFX / Roto', price: '+$140' },
                    ].map(addon => (
                      <button
                        key={addon.id}
                        onClick={() => setWizardAddons(prev => ({ ...prev, [addon.id]: !(prev as any)[addon.id] }))}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          (wizardAddons as any)[addon.id]
                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{addon.label}</div>
                        <div className={`text-[10px] font-mono mt-0.5 ${(wizardAddons as any)[addon.id] ? 'text-emerald-300' : 'text-gray-400'}`}>
                          {addon.price}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Live Matched Specialist Card */}
              <div className="lg:col-span-5 bg-gray-50 rounded-3xl p-6 border border-gray-200 space-y-6">
                
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Project Match</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    MATCH CONFIDENCE: 99.4%
                  </span>
                </div>

                {/* Matched Editor Preview */}
                <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-gray-200">
                  <img
                    src={wizardEstimate.specialistAvatar}
                    alt={wizardEstimate.recommendedSpecialist}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-900 shrink-0"
                  />
                  <div>
                    <div className="text-sm font-black text-gray-900 uppercase">{wizardEstimate.recommendedSpecialist}</div>
                    <div className="text-[11px] text-gray-500 font-medium">{wizardEstimate.specialistRole}</div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                      <Star className="w-3 h-3 fill-amber-400" /> 4.9 (Verified Pro Specialist)
                    </div>
                  </div>
                </div>

                {/* Price & Turnaround Summary */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Estimated Budget</div>
                    <div className="text-2xl font-black text-gray-900 mt-0.5">${wizardEstimate.price}</div>
                    <div className="text-[9px] text-gray-500">Fixed Milestone Escrow</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Turnaround Time</div>
                    <div className="text-2xl font-black text-emerald-600 mt-0.5">{wizardEstimate.turnHours} Hours</div>
                    <div className="text-[9px] text-gray-500">First-cut delivery</div>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Includes <strong>1GB Cloudflare R2 Workspace</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Frame-accurate review queue with 2 revision rounds</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(`/editor/${wizardEstimate.editorId}`)}
                  className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book {wizardEstimate.recommendedSpecialist}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>
        </Reveal>
      </section>

      {/* 7. 5-STAGE VETTING PIPELINE INTERACTIVE SHOWCASE */}
      <section id="vetting" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quality & Compliance Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Our 5-Stage Vetting Pipeline
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Only the top 1% of video editors pass our technical screening tests. Click each stage to inspect the criteria.
              </p>
            </div>

            {/* Vetting Stages Interactive Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
              {vettingStages.map((stage, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVettingStage(idx)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeVettingStage === idx
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold">STAGE {stage.step}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                      activeVettingStage === idx ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {stage.rate}
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate">{stage.title}</div>
                </button>
              ))}
            </div>

            {/* Active Vetting Stage Details Panel */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-1 rounded bg-gray-900 text-white">
                    STAGE {vettingStages[activeVettingStage].step}
                  </span>
                  <h3 className="text-base font-black text-gray-900">
                    {vettingStages[activeVettingStage].title}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {vettingStages[activeVettingStage].desc}
                </p>
              </div>

              <div className="md:col-span-5 bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Testing Criteria & Benchmarks:
                </div>
                {vettingStages[activeVettingStage].specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Reveal>
      </section>

      {/* 8. INTERACTIVE ROI & VELOCITY CALCULATOR */}
      <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Production Economics</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Calculate Your Studio's Velocity & ROI
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Drag the sliders to see how eliminating storage bottlenecks and unvetted revisions scales your output.
                  </p>
                </div>

                {/* Slider 1: Monthly Video Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-700">Monthly Video Deliverables</span>
                    <span className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded border">{monthlyVideos} Videos/mo</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={50}
                    step={1}
                    value={monthlyVideos}
                    onChange={(e) => setMonthlyVideos(Number(e.target.value))}
                    className="w-full accent-gray-900 cursor-pointer"
                  />
                </div>

                {/* Slider 2: Current Turnaround Days */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-700">Current Turnaround Cycle Time</span>
                    <span className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded border">{currentTurnaroundDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={14}
                    step={1}
                    value={currentTurnaroundDays}
                    onChange={(e) => setCurrentTurnaroundDays(Number(e.target.value))}
                    className="w-full accent-gray-900 cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Side: Calculated ROI Badges */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Turnaround Velocity</div>
                  <div className="text-3xl font-black text-emerald-600 mt-1">{estimatedTurnaroundVelocity.multiplier}x Faster</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Reduced to ~{estimatedTurnaroundVelocity.days} days</div>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Monthly Hours Saved</div>
                  <div className="text-3xl font-black text-gray-900 mt-1">+{estimatedHoursSaved}h</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Zero file transfer delays</div>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 col-span-2 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Estimated Monthly Cost Savings</div>
                    <div className="text-2xl font-black text-gray-900 mt-0.5">${estimatedCostSavings.toLocaleString()} USD</div>
                  </div>
                  <button
                    onClick={() => onNavigate('/login')}
                    className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Start Saving
                  </button>
                </div>
              </div>
            </div>

          </div>
        </Reveal>
      </section>

      {/* 9. COMPETITIVE COMPARISON MATRIX */}
      <section id="comparison" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider mb-2">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>The Direct Comparison</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Why Modern Creators Choose Gogangs
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                See how Gogangs eliminates file management chaos and provides structured creative velocity.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold text-gray-500">
                    <th className="py-3.5 px-4">Feature & Workflow Capability</th>
                    <th className="py-3.5 px-4 bg-gray-900 text-white rounded-t-xl text-center">Gogangs Platform</th>
                    <th className="py-3.5 px-4 text-center">Freelance Marketplaces</th>
                    <th className="py-3.5 px-4 text-center">Traditional Post-Houses</th>
                    <th className="py-3.5 px-4 text-center">Raw Google Drive / Slack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">{row.feature}</td>
                      
                      <td className="py-3.5 px-4 bg-gray-900/5 text-center font-black text-gray-900">
                        {typeof row.gogangs === 'boolean' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-emerald-700 font-bold">{row.gogangs}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center text-gray-500">
                        {typeof row.freelance === 'boolean' ? (
                          row.freelance ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                        ) : (
                          row.freelance
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center text-gray-500">
                        {typeof row.agency === 'boolean' ? (
                          row.agency ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                        ) : (
                          row.agency
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center text-gray-500">
                        {typeof row.drive === 'boolean' ? (
                          row.drive ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                        ) : (
                          row.drive
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </Reveal>
      </section>

      {/* 10. TALENT DIRECTORY WITH CATEGORY FILTERS */}
      <section id="roster" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
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
                  Browse verified creators across pacing, color grading, motion graphics, and audio mastering.
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

          </div>
        </Reveal>
      </section>

      {/* 11. 4K SHOWREELS GALLERY */}
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
                className="text-xs font-bold text-gray-900 hover:text-gray-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto group px-3 py-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
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

      {/* 12. REDESIGNED HIGH-END FAQ HUB (2-COLUMN MODERN UI) */}
      <section id="faq" className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal threshold={0.15}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Heading, Category Filters, and Live Contact Card */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Knowledge & Support Base</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Everything you need to know about 1GB Cloudflare R2 workspaces, frame-accurate approvals, and talent matching.
                  </p>
                </div>

                {/* FAQ Category Selector Tabs */}
                <div className="space-y-1.5">
                  {[
                    { id: 'all', label: 'All Questions', icon: HelpCircle },
                    { id: 'storage', label: 'Storage & Codecs', icon: UploadCloud },
                    { id: 'review', label: 'Reviews & Quality', icon: CheckCheck },
                    { id: 'pricing', label: 'Milestones & Payments', icon: CreditCard },
                  ].map(tab => {
                    const Icon = tab.icon;
                    const active = faqCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setFaqCategory(tab.id as any);
                          setOpenFaq(0);
                        }}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} />
                          <span>{tab.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          active ? 'bg-white/20 text-white' : 'bg-white text-gray-500 border border-gray-200'
                        }`}>
                          {tab.id === 'all' ? allFaqItems.length : allFaqItems.filter(f => f.category === tab.id).length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Pipeline Consultation Card */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <MessageSquare className="w-4 h-4 text-gray-700" />
                    <span>Have Custom Studio Requirements?</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Need custom ACES color setups, 8K REDCODE pipelines, or high-volume agency SLA guarantees?
                  </p>
                  <button
                    onClick={() => setConsultModalOpen(true)}
                    className="w-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded-xl transition-colors shadow-2xs cursor-pointer"
                  >
                    Speak with Post-Production Lead
                  </button>
                </div>

              </div>

              {/* Right Column: Sleek Accordion Cards */}
              <div className="lg:col-span-7 space-y-3">
                {filteredFaqs.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                        isOpen
                          ? 'border-gray-900 bg-white shadow-md'
                          : 'border-gray-200 bg-gray-50/60 hover:border-gray-300'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 shrink-0">
                            {item.categoryLabel}
                          </span>
                          <span className="leading-snug">{item.q}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gray-900' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3.5 space-y-2">
                          <p>{item.a}</p>
                          <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Verified under Gogangs Production SLA</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </Reveal>
      </section>

      {/* 13. "JOIN AS AN EDITOR / HIRE TALENT" BOTTOM LAUNCHPAD */}
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
                    className="bg-gray-900 hover:bg-black text-white font-extrabold text-xs px-6 py-3.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                  >
                    <span>Join as an Editor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('/login')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs px-6 py-3.5 rounded-full border border-gray-200 transition-all cursor-pointer"
                  >
                    <span>Hire Video Talent</span>
                  </button>
                </div>
              </div>

              {/* Right Mini Avatar Deck */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[180px]">
                <div className="relative w-full max-w-[320px] h-[160px] flex items-center justify-center">
                  <div 
                    onClick={() => onNavigate('/editor/e2')}
                    className="absolute left-2 w-20 h-28 rounded-xl bg-white border border-gray-200 p-1 transform -rotate-12 shadow-md hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer"
                  >
                    <img src={rosterEditors[1].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div 
                    onClick={() => onNavigate('/editor/e3')}
                    className="relative z-10 w-24 h-32 rounded-xl bg-white border-2 border-gray-800 p-1 shadow-xl animate-float-hero hover:scale-110 transition-all duration-300 cursor-pointer"
                  >
                    <img src={rosterEditors[2].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div 
                    onClick={() => onNavigate('/editor/e4')}
                    className="absolute right-12 w-20 h-28 rounded-xl bg-white border border-gray-200 p-1 transform rotate-6 shadow-md hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer"
                  >
                    <img src={rosterEditors[3].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div 
                    onClick={() => onNavigate('/editor/e5')}
                    className="absolute right-0 w-18 h-24 rounded-xl bg-white border border-gray-200 p-1 transform rotate-14 shadow-md hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer"
                  >
                    <img src={rosterEditors[4].avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </section>

      {/* 14. INTERACTIVE SHOWREEL PREVIEW MODAL */}
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
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
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
                  className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Book {selectedShowreel.editorName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSelectedShowreel(null)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 15. CUSTOM STUDIO CONSULTATION MODAL */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-900" />
                <h3 className="font-black text-sm text-gray-900 uppercase">Post-Production Consultation</h3>
              </div>
              <button
                onClick={() => {
                  setConsultModalOpen(false);
                  setConsultFormSubmitted(false);
                }}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {consultFormSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-black text-sm text-gray-900">Consultation Request Received</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Our post-production director will reach out within 2 hours with customized SLA terms and specialist matches.
                </p>
                <button
                  onClick={() => {
                    setConsultModalOpen(false);
                    setConsultFormSubmitted(false);
                  }}
                  className="bg-gray-900 text-white text-xs font-bold px-5 py-2 rounded-xl mt-2 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setConsultFormSubmitted(true);
                  if (addToast) addToast('Consultation request submitted! Lead will contact you shortly.', 'success');
                }}
                className="space-y-3.5 text-xs text-left"
              >
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Studio / Agency Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Creative Studios"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="lead@apexstudios.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estimated Monthly Production Volume</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900">
                    <option>5 - 15 Deliverables / month</option>
                    <option>15 - 40 Deliverables / month</option>
                    <option>40+ High-Volume Agency SLA</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 16. COMPREHENSIVE MULTI-COLUMN FOOTER */}
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
                <li><a href="#onboarding-flow" className="hover:text-gray-900 transition-colors">Onboarding Flow</a></li>
                <li><a href="#studio" className="hover:text-gray-900 transition-colors">Interactive Studio</a></li>
                <li><a href="#estimator" className="hover:text-gray-900 transition-colors">Instant Match Wizard</a></li>
                <li><a href="#vetting" className="hover:text-gray-900 transition-colors">5-Stage Vetting</a></li>
                <li><a href="#roster" className="hover:text-gray-900 transition-colors">Talent Directory</a></li>
                <li><button onClick={() => onNavigate('/admin/dashboard')} className="hover:text-gray-900 transition-colors cursor-pointer">Admin Portal</button></li>
              </ul>
            </div>

            {/* Column 3: For Video Editors */}
            <div>
              <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Creators & Editors</div>
              <ul className="space-y-2 text-xs font-medium text-gray-500">
                <li><button onClick={() => onNavigate('/login')} className="hover:text-gray-900 transition-colors cursor-pointer">Join as an Editor</button></li>
                <li><button onClick={() => onNavigate('/editor/dashboard')} className="hover:text-gray-900 transition-colors cursor-pointer">Editor Workspace</button></li>
                <li><a href="#onboarding-flow" className="hover:text-gray-900 transition-colors">Editor Onboarding</a></li>
                <li><a href="#comparison" className="hover:text-gray-900 transition-colors">Platform Benefits</a></li>
              </ul>
            </div>

            {/* Column 4: Company & Legal */}
            <div>
              <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Company & Trust</div>
              <ul className="space-y-2 text-xs font-medium text-gray-500">
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">Security & Privacy</a></li>
                <li><a href="#comparison" className="hover:text-gray-900 transition-colors">Competitive Matrix</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">FAQ Hub</a></li>
                <li><button onClick={() => setConsultModalOpen(true)} className="hover:text-gray-900 transition-colors cursor-pointer text-left">Post-Production Support</button></li>
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
