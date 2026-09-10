import { useState, useMemo } from 'react';
import { useApp } from '@/context';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  Layers,
  FileText,
  Activity,
  Award,
  Edit,
  ShieldCheck,
  ShieldX,
  Play,
  Star,
  Zap,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  Cpu,
  ArrowRight,
  X,
  UserPlus,
  HardDrive,
  Tv,
  Wifi,
} from 'lucide-react';

interface EditorDetailProps {
  editorId: string;
  onNavigate: (route: string) => void;
}

export function EditorDetail({ editorId, onNavigate }: EditorDetailProps) {
  const { getEditor, projects, activity, setVerificationStatus, toggleEditorActive, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedVideoModal, setSelectedVideoModal] = useState<any | null>(null);

  // Retrieve live editor from Supabase-backed state
  const liveEditor = getEditor(editorId);

  const editor = liveEditor || {
    id: editorId,
    fullName: 'Editor',
    email: '',
    phone: '',
    city: 'Remote',
    avatarUrl: `https://i.pravatar.cc/150?u=${editorId}`,
    bio: 'No bio provided yet.',
    experience: 0,
    availability: 'Part-Time' as const,
    hoursPerWeek: 20,
    editingSoftware: [] as any[],
    skills: [] as any[],
    portfolio: [],
    verificationStatus: 'Pending' as const,
    verificationFeedback: undefined as string | undefined,
    verificationDocs: { sampleWorkLinks: [], portfolioLinks: [] },
    active: true,
    storageUsedBytes: 0,
    storageLimitBytes: 1073741824,
    storageTier: 'Free',
    rating: 5.0,
    reviewsCount: 0,
    completedProjects: 0,
    hardware: 'Standard Post-Production Rig',
    turnaround: '24h - 48h',
    lastLogin: new Date().toISOString(),
    lastProfileUpdate: new Date().toISOString(),
    lastPortfolioUpdate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  // Real projects & subtasks assigned to this editor
  const editorSubtasks = useMemo(() => {
    return projects.flatMap((p) =>
      (p.subtasks || [])
        .filter((st) => st.assignedEditorIds?.includes(editor.id))
        .map((st) => ({
          ...st,
          projectName: p.title,
          clientName: p.clientName,
        }))
    );
  }, [projects, editor.id]);

  const activeAssignments = useMemo(() => {
    return editorSubtasks.filter((st) => st.status !== 'Approved');
  }, [editorSubtasks]);

  const completedSubtasks = useMemo(() => {
    return editorSubtasks.filter((st) => st.status === 'Approved');
  }, [editorSubtasks]);

  // Real submissions uploaded by this editor
  const editorSubmissions = useMemo(() => {
    return editorSubtasks.flatMap((st) =>
      (st.deliverablesQueue || [])
        .filter((sub) => sub.submittedByEditorId === editor.id)
        .map((sub) => ({
          ...sub,
          subtaskTitle: st.title,
          projectName: st.projectName,
        }))
    );
  }, [editorSubtasks, editor.id]);

  // Real activity events for this editor, anchored by account creation
  const editorActivity = useMemo(() => {
    const list = (activity || []).filter(
      (a) =>
        Boolean(editor.fullName && a.message?.toLowerCase().includes(editor.fullName.toLowerCase()))
    );

    // Initial account creation audit event
    const creationTime =
      editor.createdAt ||
      (editor as any).joinedDate ||
      editor.lastLogin ||
      new Date().toISOString();

    const creationEvent = {
      id: `account-created-${editor.id}`,
      type: 'account',
      message: `Account created — Joined Gogangs as an editor`,
      timestamp: creationTime,
    };

    const hasCreation = list.some(
      (a) =>
        a.message?.toLowerCase().includes('joined') ||
        a.message?.toLowerCase().includes('account created')
    );

    const merged = hasCreation ? list : [...list, creationEvent];
    return merged.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [activity, editor.fullName, editor.id, editor.createdAt, editor.lastLogin]);

  // Parse user-specified hardware configuration
  const parsedHardware = useMemo(() => {
    if (!editor.hardware) return null;
    try {
      const parsed = JSON.parse(editor.hardware);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          workstation: parsed.workstation || '',
          displays: parsed.displays || '',
          storage: parsed.storage || '',
          audioConnectivity: parsed.audioConnectivity || parsed.connectivity || '',
        };
      }
    } catch {
      return { workstation: editor.hardware, displays: '', storage: '', audioConnectivity: '' };
    }
    return null;
  }, [editor.hardware]);

  // Storage calculations
  const usedBytes = editor.storageUsedBytes || 0;
  const limitBytes = editor.storageLimitBytes || 1073741824;
  const usedMB = (usedBytes / (1024 * 1024)).toFixed(1);
  const totalMB = Math.round(limitBytes / (1024 * 1024));
  const storagePercent = Math.min(100, Math.round((usedBytes / limitBytes) * 100));

  const navItems = [
    { name: 'Overview', icon: Layers, count: null },
    { name: 'Profile & Details', icon: Briefcase, count: null },
    { name: 'Portfolio', icon: Play, count: String(editor.portfolio?.length || 0) },
    { name: 'Verification', icon: Award, count: editor.verificationStatus },
    { name: 'Projects & Tasks', icon: FileText, count: String(editorSubtasks.length) },
    { name: 'Submissions', icon: Activity, count: String(editorSubmissions.length) },
    { name: 'Activity Log', icon: Clock, count: String(editorActivity.length) },
  ];

  const stats = [
    {
      label: 'Active Projects',
      value: String(new Set(activeAssignments.map((a) => a.projectId)).size),
      subtext: `${activeAssignments.length} assigned subtasks`,
      icon: Briefcase,
      color: 'bg-gray-100 text-gray-900',
      trend: activeAssignments.length > 0 ? 'In Production' : 'Available',
    },
    {
      label: 'Completed Tasks',
      value: String(completedSubtasks.length),
      subtext: `${editorSubtasks.length} total milestones`,
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-700',
      trend: `${editorSubtasks.length > 0 ? Math.round((completedSubtasks.length / editorSubtasks.length) * 100) : 100}% completion`,
    },
    {
      label: 'Client Rating',
      value: `${editor.rating || 5.0}/5`,
      subtext: `${editor.reviewsCount || 0} reviews`,
      icon: Star,
      color: 'bg-amber-100 text-amber-600',
      trend: Number(editor.rating || 5.0) >= 4.8 ? 'Top Rated' : 'Verified Pro',
    },
    {
      label: 'Turnaround SLA',
      value: editor.turnaround || '24h - 48h',
      subtext: 'Fast-track delivery',
      icon: Zap,
      color: 'bg-blue-100 text-blue-700',
      trend: 'Standard SLA',
    },
    {
      label: 'R2 Cloud Storage',
      value: `${usedMB} MB`,
      subtext: `of ${totalMB} MB quota`,
      icon: UploadCloud,
      color: 'bg-purple-100 text-purple-700',
      trend: 'Zero Egress Fees',
    },
  ];

  const softwareList = useMemo(() => {
    const combined = [...(editor.editingSoftware || []), ...(editor.skills || [])];
    if (combined.length === 0) return ['Premiere Pro', 'DaVinci Resolve'];
    return Array.from(new Set(combined));
  }, [editor.editingSoftware, editor.skills]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* 1. TOP EDITORIAL BANNER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('/admin/editors')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xs transition-all w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Editors</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => onNavigate(`/editor/${editor.id}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-700 dark:text-zinc-300 shadow-2xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            <span>Public Portfolio View</span>
          </button>
          <button 
            onClick={() => {
              if (addToast) addToast(`Editor ${editor.fullName} profile verified`, 'success');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Profile Verified</span>
          </button>
        </div>
      </div>

      {/* 2. HERO PROFILE HEADER CARD */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-zinc-800 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Avatar, Name, Badges & Contact */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-22 h-22 rounded-2xl p-1 bg-gradient-to-b from-gray-700 to-gray-900 shadow-md ring-2 ring-gray-200 dark:ring-zinc-700">
                <img
                  src={editor.avatarUrl}
                  alt={editor.fullName}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <span className={`w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 absolute -bottom-1 -right-1 shadow-xs ${editor.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{editor.fullName}</h1>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  editor.verificationStatus === 'Verified'
                    ? 'bg-emerald-500 text-white'
                    : editor.verificationStatus === 'Rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-amber-400 text-black'
                } shadow-2xs`}>
                  {editor.verificationStatus.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {editor.availability || 'Available for Projects'}
                </span>
              </div>

              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
                {editor.skills?.length ? editor.skills.join(' • ') : 'Video Editor & Colorist'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-zinc-400 pt-1">
                {editor.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {editor.email}
                  </span>
                )}
                {editor.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {editor.city}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {editor.hoursPerWeek ? `${editor.hoursPerWeek} hrs/week` : 'Flexible Capacity'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics (NO dollar amounts mentioned) */}
          <div className="flex items-center gap-4 sm:gap-6 bg-gray-50 dark:bg-zinc-850 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 shrink-0">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Availability</span>
              <span className="text-sm font-black text-gray-900 dark:text-white mt-0.5 block">{editor.availability || 'Available'}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{editor.hoursPerWeek ? `${editor.hoursPerWeek} hrs/week` : 'Full Bandwidth'}</span>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-zinc-700" />
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Client Rating</span>
              <div className="flex items-center gap-1 text-amber-500 text-base font-black mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{editor.rating || '5.0'}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">{editor.reviewsCount || 0} Reviews</span>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-zinc-700" />
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">R2 Storage</span>
              <span className="text-base font-black text-gray-900 dark:text-white mt-0.5 block">{usedMB} MB</span>
              <span className="text-[10px] text-gray-400 font-medium">{totalMB} MB Quota</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. MAIN WORKSPACE: LEFT TAB NAVIGATION + RIGHT TAB PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Tab Menu & Quick Actions (3 cols) */}
        <div className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
          
          {/* Nav Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/90 dark:border-zinc-800 p-2 shadow-2xs space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                      : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-zinc-950' : 'text-gray-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white dark:bg-zinc-950/20 dark:text-zinc-950' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/90 dark:border-zinc-800 p-4 shadow-2xs space-y-3">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
              Quick Administrative Actions
            </h4>
            <div className="space-y-1 text-xs font-bold">
              <button 
                onClick={() => onNavigate(`/editor/${editor.id}`)}
                className="w-full flex items-center justify-between p-2 rounded-xl text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  <span>Public Portfolio</span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </button>

              <button 
                onClick={() => {
                  onNavigate('/admin/reviews');
                  if (addToast) addToast(`Opened review queue`, 'info');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>Inspect Review Queue</span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </button>

              <button 
                onClick={() => {
                  toggleEditorActive(editor.id);
                  if (addToast) addToast(`${editor.fullName} status updated`, 'info');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Toggle Active Status</span>
                </div>
                <span className="text-[10px] font-black">{editor.active ? 'LIVE' : 'INACTIVE'}</span>
              </button>

              <button 
                onClick={() => {
                  setVerificationStatus(editor.id, editor.verificationStatus === 'Verified' ? 'Rejected' : 'Verified');
                  if (addToast) addToast(`Updated verification for ${editor.fullName}`, 'info');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldX className="w-3.5 h-3.5 text-red-500" />
                  <span>{editor.verificationStatus === 'Verified' ? 'Revoke Verification' : 'Verify Account'}</span>
                </div>
                <span className="text-[10px] font-black uppercase">{editor.verificationStatus}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Tab Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              
              {/* 5 KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {stats.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200/90 dark:border-zinc-800 shadow-2xs hover:shadow-sm transition-all space-y-2">
                      <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</div>
                        <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{s.value}</div>
                        <div className="text-[10px] text-gray-500 dark:text-zinc-400 truncate mt-0.5">{s.subtext}</div>
                      </div>
                      <div className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 pt-1 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-1">
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
                <div className="md:col-span-6 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-200/90 dark:border-zinc-800 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-gray-900 dark:text-white" />
                      <h3 className="font-black text-xs text-gray-900 dark:text-white uppercase tracking-wider">Cloudflare R2 Workspace</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      100% Zero-Egress
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-700 dark:text-zinc-300">Storage Consumption</span>
                      <span className="font-mono text-gray-900 dark:text-white">{usedMB} MB / {totalMB} MB ({storagePercent}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700">
                      <div className="h-full bg-gray-900 dark:bg-white rounded-full" style={{ width: `${storagePercent}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-gray-50 dark:bg-zinc-850 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800">
                      <span className="text-gray-400 block text-[10px]">STORAGE TIER</span>
                      <span className="font-mono font-bold text-gray-800 dark:text-zinc-200 text-[10px]">{editor.storageTier || 'Free (1GB)'}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-850 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800">
                      <span className="text-gray-400 block text-[10px]">DELIVERABLES</span>
                      <span className="font-bold text-gray-800 dark:text-zinc-200">{editorSubmissions.length} Uploaded Cuts</span>
                    </div>
                  </div>
                </div>

                {/* Software & Codec Mastery */}
                <div className="md:col-span-6 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-200/90 dark:border-zinc-800 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-gray-900 dark:text-white" />
                      <h3 className="font-black text-xs text-gray-900 dark:text-white uppercase tracking-wider">Software Proficiency</h3>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">VERIFIED</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {softwareList.map((name, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 flex items-center gap-2">
                        <span>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Active Assignments (NO BUDGET MENTIONED) */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-200/90 dark:border-zinc-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-900 dark:text-white" />
                    <h3 className="font-black text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                      Current Active Projects & Milestones ({activeAssignments.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('Projects & Tasks')}
                    className="text-xs font-bold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {activeAssignments.length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-400 dark:text-zinc-500">
                      No active project assignments currently assigned to this editor.
                    </div>
                  ) : (
                    activeAssignments.map((row) => (
                      <div key={row.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-850 border border-gray-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-xs text-gray-900 dark:text-white">{row.projectName}</h4>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                              ● {row.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-zinc-400 font-medium">{row.title}</p>
                          <p className="text-[10px] text-gray-400 dark:text-zinc-500">{row.deadline ? `Deadline: ${new Date(row.deadline).toLocaleDateString()}` : 'No deadline set'}</p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 block font-bold">TASK CATEGORY</span>
                            <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">{row.taskType}</span>
                          </div>
                          <button
                            onClick={() => {
                              onNavigate('/admin/reviews');
                            }}
                            className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
                          >
                            Review Queue
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROFILE & DETAILS */}
          {activeTab === 'Profile & Details' && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-zinc-800 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Editor Profile & Hardware Specification</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Database verified credentials, availability, and hardware configuration.</p>
                </div>
                <span className="text-[10px] font-mono bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2.5 py-1 rounded-xl font-bold">
                  ID_{editor.id.slice(0, 8).toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Personal Details */}
                <div className="bg-gray-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-3">
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Personal & Account Details</h4>
                  <div className="space-y-2 text-gray-700 dark:text-zinc-300">
                    <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                      <span className="text-gray-400">Full Name</span>
                      <span className="font-bold text-gray-900 dark:text-white">{editor.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                      <span className="text-gray-400">Email Address</span>
                      <span className="font-bold text-gray-900 dark:text-white">{editor.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                      <span className="text-gray-400">Location</span>
                      <span className="font-bold text-gray-900 dark:text-white">{editor.city || 'Remote'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                      <span className="text-gray-400">Availability</span>
                      <span className="font-bold text-gray-900 dark:text-white">{editor.availability}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Experience</span>
                      <span className="font-bold text-gray-900 dark:text-white">{editor.experience ? `${editor.experience} years` : 'Entry to Mid'}</span>
                    </div>
                  </div>
                </div>

                {/* Workstation & Hardware Specs */}
                <div className="bg-gray-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-gray-900 dark:text-white" />
                      Hardware & Rig Specs
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200/70 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300">
                      {parsedHardware ? 'Editor Configured' : 'Unspecified'}
                    </span>
                  </div>

                  <div className="space-y-2 text-gray-700 dark:text-zinc-300 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                      <span className="text-gray-400">Primary Workstation</span>
                      <span className="font-bold text-gray-900 dark:text-white text-right max-w-[250px] truncate">
                        {parsedHardware?.workstation || 'Not specified yet'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                      <span className="text-gray-400">Displays / Monitors</span>
                      <span className="font-bold text-gray-900 dark:text-white text-right max-w-[250px] truncate">
                        {parsedHardware?.displays || 'Not specified yet'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                      <span className="text-gray-400">Local Scratch Disks</span>
                      <span className="font-bold text-gray-900 dark:text-white text-right max-w-[250px] truncate">
                        {parsedHardware?.storage || 'Not specified yet'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                      <span className="text-gray-400">Monitoring & Network</span>
                      <span className="font-bold text-gray-900 dark:text-white text-right max-w-[250px] truncate">
                        {parsedHardware?.audioConnectivity || 'Not specified yet'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">R2 Storage Allocated</span>
                      <span className="font-bold text-gray-900 dark:text-white">{totalMB} MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-gray-50 dark:bg-zinc-850 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2 text-xs">
                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Professional Bio</h4>
                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed">
                  {editor.bio || 'No bio provided yet.'}
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: PORTFOLIO */}
          {activeTab === 'Portfolio' && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-zinc-800 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Verified Master Portfolio ({editor.portfolio?.length || 0})</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Showcase items saved in Supabase for this creator.</p>
                </div>
              </div>

              {(!editor.portfolio || editor.portfolio.length === 0) ? (
                <div className="py-12 text-center text-xs text-gray-400 dark:text-zinc-500">
                  No portfolio reels added yet by this creator.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editor.portfolio.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedVideoModal(item)}
                      className="group bg-gray-50 dark:bg-zinc-850 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:border-gray-900 dark:hover:border-white transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img
                          src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-xl">
                            <Play className="w-5 h-5 fill-gray-900 ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-black text-xs text-gray-900 dark:text-white line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-zinc-400 pt-1 border-t border-gray-200/80 dark:border-zinc-700">
                          <span>{item.type || 'Video'}</span>
                          {item.featured && <span className="font-bold text-amber-500">Featured</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VERIFICATION */}
          {activeTab === 'Verification' && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-zinc-800 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Verification Status & Audit</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Current account compliance and verification review.</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full border ${
                  editor.verificationStatus === 'Verified'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ● {editor.verificationStatus.toUpperCase()}
                </span>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-zinc-850 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                  <span className="text-gray-500">Current Status</span>
                  <span className="font-bold text-gray-900 dark:text-white">{editor.verificationStatus}</span>
                </div>
                {editor.verificationFeedback && (
                  <div className="py-1 border-b border-gray-200/60 dark:border-zinc-700/60">
                    <span className="text-gray-500 block">Feedback Note:</span>
                    <span className="font-medium text-gray-900 dark:text-white mt-1 block">{editor.verificationFeedback}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Storage Allocation</span>
                  <span className="font-bold text-gray-900 dark:text-white">{totalMB} MB Quota</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setVerificationStatus(editor.id, 'Verified');
                    if (addToast) addToast(`Verified account for ${editor.fullName}`, 'success');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Mark Verified
                </button>
                <button
                  onClick={() => {
                    setVerificationStatus(editor.id, 'Rejected', 'Revisions requested on credentials.');
                    if (addToast) addToast(`Verification set to Rejected for ${editor.fullName}`, 'error');
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Request Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS & TASKS (NO BUDGET MENTIONED) */}
          {activeTab === 'Projects & Tasks' && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-zinc-800 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Campaigns & Assigned Subtasks ({editorSubtasks.length})</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Live deliverables assigned to this editor.</p>
                </div>
                <button
                  onClick={() => onNavigate('/admin/projects')}
                  className="text-xs font-bold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Projects Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {editorSubtasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400 dark:text-zinc-500">
                  No projects or tasks currently assigned to this editor.
                </div>
              ) : (
                <div className="space-y-3">
                  {editorSubtasks.map((row) => (
                    <div key={row.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-850 border border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xs text-gray-900 dark:text-white">{row.projectName}</h4>
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200">
                            {row.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-zinc-400 font-medium">{row.title}</p>
                        <p className="text-[10px] text-gray-400">{row.deadline ? `Deadline: ${new Date(row.deadline).toLocaleDateString()}` : 'No deadline'}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-gray-400 block font-bold">CATEGORY</span>
                        <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">{row.taskType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SUBMISSIONS */}
          {activeTab === 'Submissions' && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-zinc-800 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Deliverable Submissions ({editorSubmissions.length})</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Files uploaded by this creator.</p>
                </div>
              </div>

              {editorSubmissions.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400 dark:text-zinc-500">
                  No deliverables submitted yet by this editor.
                </div>
              ) : (
                <div className="space-y-3">
                  {editorSubmissions.map((row) => (
                    <div key={row.id} className="p-4 bg-gray-50 dark:bg-zinc-850 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">{row.fileName}</span>
                        <span className="font-mono text-gray-500">{Math.round((row.fileSizeBytes || 0) / (1024 * 1024))} MB</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>{row.subtaskTitle}</span>
                        <span>{new Date(row.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ACTIVITY LOG */}
          {activeTab === 'Activity Log' && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-zinc-800 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Activity Log ({editorActivity.length})</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Audit events recorded for this editor.</p>
                </div>
              </div>

              {editorActivity.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400 dark:text-zinc-500">
                  No recent activity recorded for this editor.
                </div>
              ) : (
                <div className="space-y-3">
                  {editorActivity.map((log) => {
                    const isAccountCreated = log.type === 'account' || log.id.startsWith('account-created');
                    return (
                      <div
                        key={log.id}
                        className={`p-4 rounded-2xl border flex items-start gap-3.5 text-xs transition-all ${
                          isAccountCreated
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/90 dark:border-emerald-800/40'
                            : 'bg-gray-50 dark:bg-zinc-850 border-gray-200 dark:border-zinc-800'
                        }`}
                      >
                        {isAccountCreated ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <UserPlus className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-900 dark:bg-zinc-100 mt-2 shrink-0" />
                        )}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-bold text-xs ${
                                isAccountCreated
                                  ? 'text-emerald-900 dark:text-emerald-300'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {log.message}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 shrink-0">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {isAccountCreated && (
                            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                              Initial studio registration and profile initialization
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* 4. MODAL VIDEO PLAYER FOR PORTFOLIO */}
      {selectedVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 animate-scale-up">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase">{selectedVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setSelectedVideoModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-600 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
              <img
                src={selectedVideoModal.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'}
                alt={selectedVideoModal.title}
                className="w-full h-full object-cover opacity-80"
              />
              <a
                href={selectedVideoModal.link}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 w-16 h-16 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
              >
                <Play className="w-6 h-6 fill-gray-900 ml-1" />
              </a>
            </div>

            <div className="p-6 flex items-center justify-end">
              <button
                onClick={() => setSelectedVideoModal(null)}
                className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
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
