import { useState } from 'react';
import { Card, Badge } from '@/components/ui';
import { useApp } from '@/context';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Linkedin,
  Instagram,
  Link as LinkIcon,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  UserCheck,
  UserX,
  Play,
  Star,
  Clock,
  Briefcase,
  Layers,
  FileText,
  Activity,
  Award,
  Edit,
  ShieldCheck,
  ShieldX,
  Download,
  Check,
  RotateCcw,
  UploadCloud,
  Cpu,
  Zap,
  TrendingUp,
  FileVideo,
  MonitorPlay,
  Film,
  Sparkles,
  DollarSign,
  AlertCircle,
  Eye,
  CheckCheck,
  X,
  FolderSync,
  ArrowRight
} from 'lucide-react';

interface EditorDetailProps {
  editorId: string;
  onNavigate: (route: string) => void;
}

export function EditorDetail({ editorId, onNavigate }: EditorDetailProps) {
  const { getEditor, setVerificationStatus, toggleEditorActive, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [selectedVideoModal, setSelectedVideoModal] = useState<any | null>(null);

  const editor = getEditor(editorId) || {
    id: editorId,
    fullName: editorId === 'e1' ? 'Marcus Chen' : editorId === 'e3' ? 'David Park' : 'Elena Rodriguez',
    email: editorId === 'e1' ? 'marcus.chen@email.com' : editorId === 'e3' ? 'david.park@email.com' : 'elena.rodriguez@email.com',
    phone: '+1 212-555-0187',
    city: editorId === 'e1' ? 'San Francisco, CA, USA' : editorId === 'e3' ? 'Toronto, ON, Canada' : 'New York, NY, USA',
    joinedDate: 'May 12, 2025',
    verifiedDate: 'May 16, 2025',
    verifiedBy: 'Lead Studio Admin',
    avatarUrl: editorId === 'e1' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
      : editorId === 'e3'
      ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Senior creative editor & colorist with 5+ years of post-production mastery. Specialized in 4K commercial reels, ACES color pipelines, high-retention viral formats, and dynamic motion graphics. Certified in Apple ProRes and DaVinci Resolve Studio.',
    experience: '5+ years',
    availability: 'Full-Time (35–40 hrs/week)',
    languages: 'English, Spanish',
    timeZone: 'EST (UTC -5)',
    verificationStatus: 'Verified',
    active: true,
    hourlyRate: '$70/hr',
    storageUsed: '842 MB',
    storageTotal: '1,024 MB',
  };

  const navItems = [
    { name: 'Overview', icon: Layers, count: null },
    { name: 'Profile & Details', icon: Briefcase, count: null },
    { name: 'Portfolio', icon: Play, count: '6' },
    { name: 'Verification', icon: Award, count: '5/5' },
    { name: 'Projects & Tasks', icon: FileText, count: '3' },
    { name: 'Submissions', icon: Activity, count: '3' },
    { name: 'Activity Log', icon: Clock, count: '12' },
  ];

  const stats = [
    {
      label: 'Active Projects',
      value: '3',
      subtext: '2 in production • 1 review',
      icon: Briefcase,
      trend: '+1 this week',
      trendUp: true,
      color: 'text-gray-900 bg-gray-100',
    },
    {
      label: 'Completed Tasks',
      value: '24',
      subtext: '32 total lifetime milestones',
      icon: CheckCircle2,
      trend: '100% completion',
      trendUp: true,
      color: 'text-emerald-700 bg-emerald-50',
    },
    {
      label: 'Client Rating',
      value: '4.9/5',
      subtext: 'From 18 verified reviews',
      icon: Star,
      trend: 'Top 1% Tier',
      trendUp: true,
      color: 'text-gray-900 bg-gray-100',
    },
    {
      label: 'On-Time Velocity',
      value: '98.2%',
      subtext: 'Average 18.4h turnaround',
      icon: Zap,
      trend: 'Zero missed SLAs',
      trendUp: true,
      color: 'text-gray-900 bg-gray-100',
    },
    {
      label: 'R2 Cloud Workspace',
      value: '842 MB',
      subtext: 'of 1,024 MB allocated quota',
      icon: UploadCloud,
      trend: 'Zero Egress Fees',
      trendUp: true,
      color: 'text-gray-900 bg-gray-100',
    },
  ];

  const portfolioItems = [
    {
      id: 'p-1',
      title: 'Nike Athletic Master Commercial 4K',
      category: 'Commercial Ad',
      duration: '00:45',
      resolution: '3840x2160 • 60fps',
      codec: 'Apple ProRes 422 HQ',
      thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
      views: '12.4K',
    },
    {
      id: 'p-2',
      title: 'Vogue Haute Couture Autumn Cut',
      category: 'Fashion & Luxury',
      duration: '01:02',
      resolution: '4K DCI • 24fps',
      codec: 'ProRes 4444 XQ',
      thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      views: '8.1K',
    },
    {
      id: 'p-3',
      title: 'Fintech 3D Mobile App Product Launch',
      category: '3D Motion Graphics',
      duration: '00:30',
      resolution: '3840x2160 • 60fps',
      codec: 'ProRes 4444 + Alpha',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      views: '19.8K',
    },
    {
      id: 'p-4',
      title: 'Cinematic Feature Film 8K Color Grade',
      category: 'DaVinci ACES Grading',
      duration: '02:15',
      resolution: '8K DCI • 24fps',
      codec: 'DNxHR HQX 12-bit',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      views: '15.2K',
    },
    {
      id: 'p-5',
      title: '10M+ Views TikTok Series Retention Cut',
      category: 'Viral Shorts / Reels',
      duration: '00:35',
      resolution: '1080x1920 • 9:16',
      codec: 'H.265 / HEVC 10-bit',
      thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      views: '340K',
    },
    {
      id: 'p-6',
      title: 'Wild Earth Expedition Series Episode 4',
      category: 'Documentary Film',
      duration: '01:45',
      resolution: '3840x2160 • 30fps',
      codec: 'Apple ProRes 422 HQ',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
      views: '6.4K',
    },
  ];

  const currentAssignments = [
    {
      id: 'proj-1',
      project: 'Aurora Skincare — Q4 Global Campaign',
      subtask: 'Instagram Reel Series (5x Master Cuts)',
      status: 'Ready for Review',
      due: 'May 20, 2025 (18h remaining)',
      progress: 90,
      escrowBudget: '$1,200',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      id: 'proj-2',
      project: 'TechFlow SaaS — Product Demo Master',
      subtask: '3D Motion Walkthrough & Kinetic Titles',
      status: 'In Production',
      due: 'May 22, 2025',
      progress: 65,
      escrowBudget: '$950',
      statusColor: 'bg-gray-100 text-gray-900 border-gray-200',
    },
    {
      id: 'proj-3',
      project: "The Founder's Journey — S2 Episode 3",
      subtask: 'Color Science & ACES Sound Mixing',
      status: 'In Production',
      due: 'May 24, 2025',
      progress: 40,
      escrowBudget: '$750',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    },
  ];

  const editorSubmissions = [
    {
      id: 'sub-1',
      title: 'Instagram Reel Series (5x Deliverables)',
      campaign: 'Aurora Skincare — Q4 Launch',
      version: 'v2 Final Cut',
      submitted: '1 hour ago',
      fileSize: '842.5 MB',
      resolution: '1080x1920 • 60fps',
      codec: 'Apple ProRes 422 HQ',
      status: 'Ready for Review',
      r2Path: 'r2://editor-e1-workspace/cuts/aurora_reels_v2_master.mov',
      reviewPinsCount: 3,
      approved: false,
    },
    {
      id: 'sub-2',
      title: 'Commercial Ads Brand Master 4K',
      campaign: 'TechFlow SaaS — Product Demo Series',
      version: 'v1 Master Approval',
      submitted: '1 day ago',
      fileSize: '1.42 GB',
      resolution: '3840x2160 • 24fps',
      codec: 'ProRes 4444 XQ',
      status: 'Approved & Escrow Released',
      r2Path: 'r2://editor-e1-workspace/cuts/techflow_master_4k_v1.mov',
      reviewPinsCount: 0,
      approved: true,
    },
    {
      id: 'sub-3',
      title: 'Social Teasers Pack (4x Cutdowns)',
      campaign: "The Founder's Journey — S2",
      version: 'v1 Rough Cut',
      submitted: '3 days ago',
      fileSize: '412.0 MB',
      resolution: '1080x1080 • 30fps',
      codec: 'H.264 Master',
      status: 'In Progress Revision',
      r2Path: 'r2://editor-e1-workspace/cuts/founders_teasers_v1.mov',
      reviewPinsCount: 2,
      approved: false,
    },
  ];

  const vettingCheckpoints = [
    {
      step: '01',
      title: 'Showreel & Storytelling Audit',
      status: 'Passed (Score: 99/100)',
      auditedBy: 'Chief Creative Director',
      date: 'May 14, 2025',
      note: 'Exceptional pacing cadence, strong sound design layering, and immaculate dynamic match cuts.',
    },
    {
      step: '02',
      title: 'Raw Codec & Bitrate Screening',
      status: 'Passed (Score: 100/100)',
      auditedBy: 'Lead Video Engineer',
      date: 'May 14, 2025',
      note: 'Zero dropped frames, correct Apple ProRes 422/4444 color metadata tags, and seamless proxy ingestion.',
    },
    {
      step: '03',
      title: 'ACES & HDR Color Science Screen',
      status: 'Passed (Score: 98/100)',
      auditedBy: 'Senior DaVinci Colorist',
      date: 'May 15, 2025',
      note: 'Accurate skin-tone protection curves under multi-stop overexposure, proper ACES transforms.',
    },
    {
      step: '04',
      title: '3D Motion Graphics & Typography',
      status: 'Passed (Score: 96/100)',
      auditedBy: 'Lead VFX Supervisor',
      date: 'May 15, 2025',
      note: 'Clean keyframe easing curves, tight camera tracking solves in After Effects and Blender.',
    },
    {
      step: '05',
      title: 'Turnaround SLA & Client Comms',
      status: 'Top 1% Certified (SLA Agreed)',
      auditedBy: 'Platform Operations Lead',
      date: 'May 16, 2025',
      note: 'Guaranteed 24h milestone turnaround commitment with 2 structured revision rounds.',
    },
  ];

  const fullActivityLog = [
    {
      event: 'Submitted "Instagram Reel Series (5x)" v2 Final Cut to Cloudflare R2',
      timestamp: '1 hour ago',
      user: editor.fullName,
      tag: 'Submission',
      color: 'bg-gray-900',
    },
    {
      event: 'Milestone "Commercial Ads Brand Master 4K" Approved by Admin ($1,200 Released)',
      timestamp: '1 day ago',
      user: 'Studio Admin',
      tag: 'Escrow Release',
      color: 'bg-emerald-600',
    },
    {
      event: 'Uploaded 4K ProRes master deliverable (1.42 GB) with zero-egress speed of 124 MB/s',
      timestamp: '1 day ago',
      user: editor.fullName,
      tag: 'R2 Storage Sync',
      color: 'bg-zinc-700',
    },
    {
      event: 'Assigned to new high-ticket campaign "Aurora Skincare — Q4 Global Launch"',
      timestamp: '2 days ago',
      user: 'System Dispatch',
      tag: 'Assignment',
      color: 'bg-gray-800',
    },
    {
      event: 'Updated 4K Portfolio showreel "Nike Athletic Master Commercial 4K"',
      timestamp: '3 days ago',
      user: editor.fullName,
      tag: 'Portfolio',
      color: 'bg-amber-500',
    },
    {
      event: 'Passed 5-Stage Technical Vetting with 99.2% Platform Confidence Score',
      timestamp: 'May 16, 2025',
      user: 'Admin Review Team',
      tag: 'Certification',
      color: 'bg-emerald-600',
    },
    {
      event: 'Dedicated 1GB Cloudflare R2 Workspace provisioned with S3 presigned credentials',
      timestamp: 'May 12, 2025',
      user: 'Cloudflare Engine',
      tag: 'Workspace',
      color: 'bg-gray-400',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* 1. TOP EDITORIAL BANNER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('/admin/editors')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs transition-all w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Editors</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => onNavigate(`/editor/${editor.id}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            <span>Public Portfolio View</span>
          </button>
          <button 
            onClick={() => {
              if (addToast) addToast(`Editor ${editor.fullName} profile updated`, 'success');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Editor</span>
          </button>
        </div>
      </div>

      {/* 2. HERO PROFILE HEADER CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Avatar, Name, Badges & Contact */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-22 h-22 rounded-2xl p-1 bg-gradient-to-b from-gray-700 to-gray-900 shadow-md ring-2 ring-gray-200">
                <img
                  src={editor.avatarUrl}
                  alt={editor.fullName}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1 shadow-xs animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{editor.fullName}</h1>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-black shadow-2xs">
                  TOP 1% SPECIALIST
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Available for Projects
                </span>
              </div>

              <p className="text-xs font-semibold text-gray-500">
                Lead Commercial Video Editor & Senior DaVinci Colorist
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  {editor.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {editor.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {editor.timeZone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Rates Box */}
          <div className="flex items-center gap-4 sm:gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-200 shrink-0">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hourly Rate</span>
              <span className="text-xl font-black text-gray-900 mt-0.5 block">{editor.hourlyRate}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Fixed Escrow Eligible</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Client Rating</span>
              <div className="flex items-center gap-1 text-amber-500 text-base font-black mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">18 Reviews</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">R2 Storage</span>
              <span className="text-base font-black text-gray-900 mt-0.5 block">842 MB</span>
              <span className="text-[10px] text-gray-400 font-medium">1GB Quota</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. MAIN WORKSPACE: LEFT TAB NAVIGATION + RIGHT TAB PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Tab Menu & Quick Actions (3 cols) */}
        <div className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
          
          {/* Nav Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-2 shadow-2xs space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.count && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs space-y-3">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
              Quick Administrative Actions
            </h4>
            <div className="space-y-1 text-xs font-bold">
              <button 
                onClick={() => onNavigate(`/editor/${editor.id}`)}
                className="w-full flex items-center justify-between p-2 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  <span>Public Portfolio</span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </button>

              <button 
                onClick={() => {
                  onNavigate('/admin/review');
                  if (addToast) addToast(`Opened review queue for ${editor.fullName}`, 'info');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span>Inspect Review Queue</span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </button>

              <button
                onClick={() => {
                  toggleEditorActive(editor.id);
                  if (addToast) addToast(`${editor.fullName} availability toggled`, 'info');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserX className="w-3.5 h-3.5" />
                  <span>Toggle Active Status</span>
                </div>
                <span className="text-[10px] font-mono">LIVE</span>
              </button>

              <button
                onClick={() => {
                  if (addToast) addToast(`Editor ${editor.fullName} account restricted`, 'error');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserX className="w-3.5 h-3.5" />
                  <span>Disable Editor</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Tab Screens (9 cols) */}
        <div className="lg:col-span-9 space-y-6">

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              
              {/* 5 Stats Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {stats.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-sm transition-all space-y-2">
                      <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</div>
                        <div className="text-xl font-black text-gray-900 mt-0.5">{s.value}</div>
                        <div className="text-[10px] text-gray-500 truncate mt-0.5">{s.subtext}</div>
                      </div>
                      <div className="text-[9px] font-bold text-emerald-700 pt-1 border-t border-gray-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{s.trend}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Middle Row: R2 Cloud Storage & Software Mastery */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* R2 Cloudflare Workspace Engine */}
                <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-gray-900" />
                      <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider">Cloudflare R2 Workspace</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      100% Zero-Egress
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-700">Storage Consumption</span>
                      <span className="font-mono text-gray-900">842.5 MB / 1,024 MB (82%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div className="h-full bg-gray-900 rounded-full w-[82%]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">DIRECT S3 BUCKET</span>
                      <span className="font-mono font-bold text-gray-800 text-[10px]">r2://editor-e1/</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">DELIVERABLES</span>
                      <span className="font-bold text-gray-800">18 Active Cuts</span>
                    </div>
                  </div>
                </div>

                {/* Software & Codec Mastery */}
                <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-gray-900" />
                      <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider">NLE Software Mastery</h3>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">PRO SUITE</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'DaVinci Resolve Studio 19', tag: 'Master Tier', color: 'bg-gray-900 text-white border-gray-900' },
                      { name: 'Adobe Premiere Pro 2025', tag: 'Top 1%', color: 'bg-gray-100 text-gray-900 border-gray-200' },
                      { name: 'After Effects & Blender VFX', tag: 'Pro Motion', color: 'bg-zinc-100 text-zinc-900 border-zinc-200' },
                      { name: 'ACES 1.3 & HDR Grading', tag: 'Certified', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
                      { name: 'Apple ProRes 422/4444', tag: 'Lossless', color: 'bg-gray-100 text-gray-900 border-gray-200' },
                    ].map((item, i) => (
                      <div key={i} className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${item.color}`}>
                        <span>{item.name}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-white/60">{item.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Active Assignments & Review Queue */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-900" />
                    <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider">
                      Current Active Projects & Milestones ({currentAssignments.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('Projects & Tasks')}
                    className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {currentAssignments.map((row) => (
                    <div key={row.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xs text-gray-900">{row.project}</h4>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${row.statusColor}`}>
                            ● {row.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{row.subtask}</p>
                        <p className="text-[10px] text-gray-400">{row.due}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block font-bold">LOCKED ESCROW</span>
                          <span className="text-sm font-black text-gray-900">{row.escrowBudget}</span>
                        </div>
                        <button
                          onClick={() => {
                            onNavigate('/admin/review');
                            if (addToast) addToast(`Navigated to review queue for ${row.project}`, 'info');
                          }}
                          className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
                        >
                          Review Cut
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROFILE & DETAILS */}
          {activeTab === 'Profile & Details' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Editor Profile & Hardware Specification</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Comprehensive background, verified studio specs, and client SLAs.</p>
                </div>
                <span className="text-[10px] font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-xl font-bold">
                  VERIFIED_ID_{editor.id.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Personal & Studio Details */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="font-black text-gray-900 uppercase tracking-wider text-[11px]">Personal & Studio Details</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-400">Full Name</span>
                      <span className="font-bold text-gray-900">{editor.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-400">Email Address</span>
                      <span className="font-bold text-gray-900">{editor.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-400">Studio Location</span>
                      <span className="font-bold text-gray-900">{editor.city}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-400">Timezone</span>
                      <span className="font-bold text-gray-900">{editor.timeZone}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Languages</span>
                      <span className="font-bold text-gray-900">{editor.languages}</span>
                    </div>
                  </div>
                </div>

                {/* Workstation & Hardware Specifications */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="font-black text-gray-900 uppercase tracking-wider text-[11px]">Hardware & Workstation Specs</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-400">Primary Workstation</span>
                      <span className="font-bold text-gray-900">Apple Mac Studio M2 Ultra (128GB Unified)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-400">Color Reference Monitor</span>
                      <span className="font-bold text-gray-900">ASUS ProArt PA32UCG 4K HDR 1600nits</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-400">Network Bandwidth</span>
                      <span className="font-bold text-gray-900">1.0 Gbps Symmetrical Fiber</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-400">Local High-Speed Storage</span>
                      <span className="font-bold text-gray-900">16TB NVMe RAID Array (7,000 MB/s)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Audio Mastering Setup</span>
                      <span className="font-bold text-gray-900">Genelec 8030C Monitors + iZotope RX 11</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bio & Capability Statement */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <h4 className="font-black text-gray-900 uppercase tracking-wider text-[11px]">Professional Bio & Creative Philosophy</h4>
                <p className="text-gray-600 leading-relaxed">
                  {editor.bio}
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: PORTFOLIO GALLERY */}
          {activeTab === 'Portfolio' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Verified Master Portfolio ({portfolioItems.length})</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Click any reel to inspect codec details and playback.</p>
                </div>
                <button
                  onClick={() => {
                    if (addToast) addToast('Opened Add Portfolio Item modal', 'info');
                  }}
                  className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  + Add Master Reel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedVideoModal(item)}
                    className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-900 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white border border-white/20">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-white">
                          {item.duration}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-xl">
                          <Play className="w-5 h-5 fill-gray-900 ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-black text-xs text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-200/80">
                        <span className="font-mono">{item.resolution}</span>
                        <span className="font-bold text-gray-900">{item.codec}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VERIFICATION INSPECTION */}
          {activeTab === 'Verification' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">5-Stage Vetting Pipeline Checkpoints</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Detailed audit records, benchmark scores, and compliance certification.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ● TOP 1% CERTIFIED
                </span>
              </div>

              <div className="space-y-3">
                {vettingCheckpoints.map((cp, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-xl bg-gray-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {cp.step}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-gray-900">{cp.title}</h4>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {cp.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px] leading-relaxed">{cp.note}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 text-[11px] text-gray-400">
                      <span className="block font-semibold text-gray-700">Audited by {cp.auditedBy}</span>
                      <span>{cp.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Certification ID: <span className="font-mono font-bold text-gray-900">CERT-2025-VET-TOP1-042</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setVerificationStatus(editor.id, 'Verified');
                      if (addToast) addToast(`Re-affirmed verification for ${editor.fullName}`, 'success');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Re-Verify Status
                  </button>
                  <button
                    onClick={() => {
                      if (addToast) addToast('Verification certificate downloaded', 'info');
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Certificate</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: PROJECTS & TASKS */}
          {activeTab === 'Projects & Tasks' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Active Campaigns & Milestone Subtasks</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Live production milestones, locked escrow funds, and deliverable deadlines.</p>
                </div>
                <button
                  onClick={() => onNavigate('/admin/projects')}
                  className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Projects Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {currentAssignments.map((row) => (
                  <div key={row.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-gray-900">{row.project}</h4>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${row.statusColor}`}>
                            ● {row.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{row.subtask}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 uppercase font-bold block">Escrow Budget</span>
                          <span className="text-base font-black text-gray-900">{row.escrowBudget}</span>
                        </div>
                        <button
                          onClick={() => {
                            onNavigate('/admin/review');
                            if (addToast) addToast(`Navigated to review queue for ${row.project}`, 'info');
                          }}
                          className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
                        >
                          Review Deliverable
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-gray-200/80">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-gray-500">Milestone Progress</span>
                        <span className="font-mono text-gray-900">{row.progress}% Complete</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${row.progress}%` }} />
                      </div>
                      <div className="text-[10px] text-gray-400 pt-0.5">{row.due}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SUBMISSIONS (HIGH-TECH FRAME-ACCURATE VIDEO SUBMISSIONS) */}
          {activeTab === 'Submissions' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Editor Deliverable Submissions ({editorSubmissions.length})</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Frame-accurate master cuts synced directly to Cloudflare R2 buckets.</p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl font-bold border border-emerald-200">
                  ZERO-EGRESS S3 PRESIGNED
                </span>
              </div>

              <div className="space-y-4">
                {editorSubmissions.map((row) => (
                  <div key={row.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                    
                    {/* Top Row: Title, Version, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-gray-900">{row.title}</h4>
                          <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded bg-gray-900 text-white">
                            {row.version}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{row.campaign}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                          row.approved 
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-200' 
                            : 'bg-amber-100 text-amber-900 border-amber-200'
                        }`}>
                          ● {row.status}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">{row.submitted}</span>
                      </div>
                    </div>

                    {/* Technical Metadata Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-white p-3 rounded-xl border border-gray-200">
                      <div>
                        <span className="text-gray-400 text-[10px] block uppercase font-bold">File Size</span>
                        <span className="font-mono font-bold text-gray-900">{row.fileSize}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block uppercase font-bold">Resolution</span>
                        <span className="font-mono font-bold text-gray-900">{row.resolution}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block uppercase font-bold">Codec</span>
                        <span className="font-bold text-gray-900">{row.codec}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block uppercase font-bold">Revision Pins</span>
                        <span className="font-bold text-gray-900">{row.reviewPinsCount} Markers</span>
                      </div>
                    </div>

                    {/* Action Bar & R2 Direct Path */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-200/80 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px] truncate">
                        <UploadCloud className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{row.r2Path}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            if (addToast) addToast(`Streaming 4K cut: ${row.title}`, 'info');
                          }}
                          className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-gray-800" />
                          <span>Inspect Frames</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('/admin/review');
                            if (addToast) addToast(`Opened Review Queue for ${row.title}`, 'success');
                          }}
                          className="bg-gray-900 hover:bg-black text-white font-bold px-4 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                        >
                          Review & Approve
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ACTIVITY LOG (CHRONOLOGICAL AUDIT TRAIL) */}
          {activeTab === 'Activity Log' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Complete Chronological Audit Trail</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Immutable record of deliverable submissions, milestone releases, and system events.</p>
                </div>
                <span className="text-[10px] font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-xl font-bold">
                  7 EVENTS LOGGED
                </span>
              </div>

              <div className="space-y-3">
                {fullActivityLog.map((log, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-start gap-3.5 text-xs">
                    <span className={`w-2.5 h-2.5 rounded-full ${log.color} mt-1.5 shrink-0`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">{log.event}</span>
                        <span className="text-[10px] font-mono text-gray-400">{log.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <span className="font-semibold text-gray-700">Actor: {log.user}</span>
                        <span>•</span>
                        <span className="px-2 py-0.2 rounded bg-white text-gray-600 border border-gray-200 text-[9px] font-bold">
                          {log.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 4. MODAL VIDEO PLAYER FOR PORTFOLIO */}
      {selectedVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-gray-900 uppercase">{selectedVideoModal.title}</h3>
                <p className="text-[11px] text-gray-500">{selectedVideoModal.category} • {selectedVideoModal.resolution}</p>
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

            <div className="p-6 flex items-center justify-between">
              <div className="text-xs text-gray-600">
                Master Codec: <strong className="text-gray-900">{selectedVideoModal.codec}</strong>
              </div>
              <button
                onClick={() => setSelectedVideoModal(null)}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
