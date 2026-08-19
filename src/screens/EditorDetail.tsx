import { useState } from 'react';
import { Card } from '@/components/ui';
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
  MessageSquare,
  Activity,
  Award,
  MoreHorizontal,
  Edit,
} from 'lucide-react';

interface EditorDetailProps {
  editorId: string;
  onNavigate: (route: string) => void;
}

export function EditorDetail({ editorId, onNavigate }: EditorDetailProps) {
  const { getEditor, setVerificationStatus, toggleEditorActive, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('Last 30 days');

  const editor = getEditor(editorId) || {
    id: editorId,
    fullName: 'Elena Rodriguez',
    email: 'elena.rodriguez@email.com',
    phone: '+1 212-555-0187',
    city: 'New York, NY, USA',
    joinedDate: 'May 12, 2025',
    verifiedDate: 'May 16, 2025',
    verifiedBy: 'Admin User',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena',
    bio: 'Passionate video editor with 4+ years of experience in crafting engaging content for brands, creators, and businesses. Specialized in Reels, YouTube content, and Commercial Ads. Love storytelling through clean cuts and strong pacing.',
    experience: '4+ years',
    availability: 'Part-Time (20–30 hrs/week)',
    languages: 'English, Spanish',
    timeZone: 'EST (UTC -5)',
    verificationStatus: 'Verified',
    active: true,
  };

  const navItems = [
    { name: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { name: 'Profile & Details', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Portfolio', icon: <Play className="w-4 h-4" /> },
    { name: 'Verification', icon: <Award className="w-4 h-4" /> },
    { name: 'Projects & Tasks', icon: <FileText className="w-4 h-4" /> },
    { name: 'Submissions', icon: <Activity className="w-4 h-4" /> },
    { name: 'Activity Log', icon: <Clock className="w-4 h-4" /> },
    { name: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const stats = [
    {
      label: 'Active Projects',
      value: '3',
      subtext: '2 in progress',
      icon: <Briefcase className="w-4 h-4 text-violet-600" />,
      bg: 'bg-violet-100/70',
    },
    {
      label: 'Completed Tasks',
      value: '18',
      subtext: '32 total tasks',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
    {
      label: 'Avg. Rating',
      value: '4.8/5',
      subtext: 'From 12 reviews',
      icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />,
      bg: 'bg-amber-100/70',
    },
    {
      label: 'On-time Delivery',
      value: '94%',
      subtext: '16 / 17 on time',
      icon: <Clock className="w-4 h-4 text-indigo-600" />,
      bg: 'bg-indigo-100/70',
    },
    {
      label: 'Response Time',
      value: '3h',
      subtext: 'Avg. first response',
      icon: <Activity className="w-4 h-4 text-purple-600" />,
      bg: 'bg-purple-100/70',
    },
  ];

  const portfolioItems = [
    {
      title: 'Skincare Brand Reel',
      category: 'Commercial Ad',
      duration: '00:45',
      thumbnail:
        'https://images.pexels.com/photos/3756879/pexels-photo-3756879.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Travel Vlog – Highlights',
      category: 'YouTube Video',
      duration: '01:02',
      thumbnail:
        'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Luxury Product Promo',
      category: 'Commercial Ad',
      duration: '00:30',
      thumbnail:
        'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const currentAssignments = [
    {
      project: 'Aurora Skincare — Q4 Launch',
      subtask: 'Instagram Reel Series (5x)',
      status: 'In Progress',
      due: 'Due May 19, 2025',
      statusColor: 'bg-violet-50 text-violet-700',
    },
    {
      project: 'TechFlow SaaS — Product Demo Series',
      subtask: 'Feature Walkthrough Video',
      status: 'In Progress',
      due: 'Due May 21, 2025',
      statusColor: 'bg-violet-50 text-violet-700',
    },
    {
      project: "The Founder's Journey — S2",
      subtask: 'Promo Reels (3x)',
      status: 'Ready for Review',
      due: 'Due May 23, 2025',
      statusColor: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Top Header & Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('/admin/editors')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editors</span>
        </button>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <Edit className="w-3.5 h-3.5 text-gray-500" />
            <span>Edit Editor</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors">
            <span>More actions</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Left Sidebar (Navigation & Quick Actions) - 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Navigation Card */}
          <Card className="p-2 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.name
                    ? 'bg-violet-50 text-violet-700 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className={activeTab === item.name ? 'text-violet-600' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </button>
            ))}
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Quick Actions
            </h4>
            <div className="space-y-2 text-xs">
              <button className="w-full flex items-center gap-2 text-gray-700 font-semibold hover:text-violet-600 transition-colors py-1">
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                <span>View Public Profile</span>
                <ExternalLink className="w-3 h-3 text-gray-300 ml-auto" />
              </button>
              <button className="w-full flex items-center gap-2 text-gray-700 font-semibold hover:text-violet-600 transition-colors py-1">
                <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                <span>Impersonate Editor</span>
              </button>
              <button
                onClick={() => {
                  toggleEditorActive(editor.id);
                  addToast(`${editor.fullName} status updated`, 'info');
                }}
                className="w-full flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors py-1"
              >
                <UserX className="w-3.5 h-3.5 text-red-500" />
                <span>Disable Editor</span>
              </button>
              <button className="w-full flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors py-1">
                <UserX className="w-3.5 h-3.5 text-red-500" />
                <span>Delete Editor</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Column 2: Main Center Content - 6 cols */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Profile Header Card */}
          <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={editor.avatarUrl}
                    alt={editor.fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0.5 right-0.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xl font-extrabold text-gray-900">{editor.fullName}</h2>
                    <CheckCircle2 className="w-4 h-4 text-violet-600 fill-violet-600/10" />
                  </div>
                  <p className="text-xs font-semibold text-gray-500">Video Editor</p>
                  <div className="space-y-1 pt-1 text-[11.5px] text-gray-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{editor.email}</span>
                      <Phone className="w-3.5 h-3.5 text-gray-400 ml-2" />
                      <span>{editor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{editor.city}</span>
                      <Calendar className="w-3.5 h-3.5 text-gray-400 ml-2" />
                      <span>Joined May 12, 2025</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                      <Linkedin className="w-3.5 h-3.5 text-sky-600" />
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Verification Status Box */}
              <div className="bg-gray-50/70 border border-gray-100 p-3.5 rounded-xl text-left space-y-1.5 shrink-0 min-w-[140px]">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  VERIFICATION STATUS
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  ● Verified
                </span>
                <div className="text-[10.5px] text-gray-400 pt-1 space-y-0.5">
                  <p>Verified on</p>
                  <p className="font-semibold text-gray-700">May 16, 2025</p>
                  <p className="pt-0.5">Verified by</p>
                  <p className="font-semibold text-gray-700">Admin User</p>
                </div>
              </div>
            </div>
          </Card>

          {/* 5 Stat Cards Row (Compact & Sleek) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {stats.map((s, idx) => (
              <Card key={idx} className="p-3 bg-white border border-gray-100 rounded-xl shadow-2xs">
                <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                  {s.icon}
                </div>
                <p className="text-[10px] font-semibold text-gray-500">{s.label}</p>
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight my-0.5">
                  {s.value}
                </h3>
                <p className="text-[10px] text-gray-400">{s.subtext}</p>
              </Card>
            ))}
          </div>

          {/* About, Skills & Software Card */}
          <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  About Elena
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">{editor.bio}</p>
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex justify-between py-0.5 border-b border-gray-50">
                    <span className="text-gray-400">Experience</span>
                    <span className="font-semibold text-gray-900">{editor.experience}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-50">
                    <span className="text-gray-400">Availability</span>
                    <span className="font-semibold text-gray-900">{editor.availability}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-50">
                    <span className="text-gray-400">Languages</span>
                    <span className="font-semibold text-gray-900">{editor.languages}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-400">Time Zone</span>
                    <span className="font-semibold text-gray-900">{editor.timeZone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Reels Editing',
                      'YouTube Editing',
                      'Commercial Ads',
                      'Motion Graphics',
                      'Color Grading',
                      'Corporate Videos',
                      'Thumbnail Design',
                    ].map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 text-[11px] font-semibold rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-lg">
                      +2 more
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                    Software
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-950 text-sky-400 font-bold text-xs flex items-center justify-center shadow-2xs">
                      Pr
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-purple-950 text-purple-300 font-bold text-xs flex items-center justify-center shadow-2xs">
                      Ae
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-pink-500 font-bold text-xs flex items-center justify-center shadow-2xs">
                      🎬
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-sky-950 text-sky-300 font-bold text-xs flex items-center justify-center shadow-2xs">
                      Ps
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-amber-950 text-amber-500 font-bold text-xs flex items-center justify-center shadow-2xs">
                      Ai
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center">
                      +2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Featured Portfolio (3/3) & Current Assignments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Featured Portfolio Card */}
            <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900">Featured Portfolio (3/3)</h3>
                <button className="text-[11px] font-semibold text-violet-600 hover:underline">
                  View all portfolio ↗
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {portfolioItems.map((item, idx) => (
                  <div key={idx} className="group cursor-pointer space-y-1">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/75 text-white text-[8px] font-medium rounded">
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-900 truncate">{item.title}</p>
                    <p className="text-[9px] text-gray-400">{item.category}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Current Assignments Card */}
            <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900">Current Assignments</h3>
                <button className="text-[11px] font-semibold text-violet-600 hover:underline">
                  View all projects ↗
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {currentAssignments.map((row, idx) => (
                  <div key={idx} className="space-y-0.5 pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-[11px] truncate">{row.project}</span>
                      <span className={`px-2 py-0.2 text-[9.5px] font-semibold rounded-full ${row.statusColor}`}>
                        ● {row.status}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-gray-500">{row.subtask} • <span className="text-gray-400">{row.due}</span></p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Reviews Card */}
          <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900">Recent Reviews</h3>
              <button className="text-[11px] font-semibold text-violet-600 hover:underline">
                View all reviews
              </button>
            </div>

            <div className="flex items-start gap-4 text-xs">
              <div className="shrink-0 space-y-0.5">
                <span className="text-xl font-extrabold text-gray-900">5.0</span>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="italic text-gray-600 text-xs">
                  "Elena delivered exceptional work! The edits were clean, on-brand, and perfectly captured the vibe we wanted."
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://i.pravatar.cc/150?u=marcus"
                      alt="Marcus"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block text-[11px]">Marcus Chen</span>
                      <span className="text-[10px] text-gray-400">Aurora Skincare</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">May 10, 2026</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Column 3: Right Sidebar (Activity Summary & Timeline) - 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Activity Summary Card */}
          <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900">Activity Summary</h4>
              <button className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                <span>{timeRange}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  Tasks Completed
                </span>
                <span className="font-bold text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-[10px]">
                    ⏱
                  </span>
                  Tasks In Progress
                </span>
                <span className="font-bold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 rounded bg-violet-100 text-violet-600 flex items-center justify-center text-[10px]">
                    📤
                  </span>
                  Submitted for Review
                </span>
                <span className="font-bold text-gray-900">4</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  Approved
                </span>
                <span className="font-bold text-gray-900">11</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center text-[10px]">
                    ↰
                  </span>
                  Returned
                </span>
                <span className="font-bold text-gray-900">1</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity Card */}
          <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900">Recent Activity</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Submitted "Instagram Reel Series (5x)" for review</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Task "Thumbnail Design Package" approved</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Started working on "Feature Walkthrough Video"</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Updated portfolio item "Luxury Product Promo"</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">3 days ago</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Last Active Card */}
          <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900">Last Active</h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                ● Online
              </span>
            </div>
            <p className="text-xs text-gray-700 font-semibold">May 18, 2026 at 10:24 AM (EST)</p>
            <p className="text-[10.5px] text-gray-400">IP: 192.168.1.24 • New York, USA</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

