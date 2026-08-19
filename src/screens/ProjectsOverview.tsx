import { useState } from 'react';
import { Card } from '@/components/ui';
import {
  Search,
  Plus,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar,
  Folder,
  ShieldCheck,
  Clock,
  AlertCircle,
  Bookmark,
  Megaphone,
  Mic,
  Plane,
  List,
  CheckCircle2,
} from 'lucide-react';

interface ProjectsOverviewProps {
  onNavigate: (route: string) => void;
}

export function ProjectsOverview({ onNavigate }: ProjectsOverviewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deadlineFilter, setDeadlineFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // 4 Top Stat Cards
  const stats = [
    {
      label: 'Total Projects',
      value: '12',
      trend: '↗ 20%',
      trendUp: true,
      subtext: 'vs last 30 days',
      icon: <Folder className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-100/70',
    },
    {
      label: 'On Track',
      value: '7',
      trend: '↗ 14%',
      trendUp: true,
      subtext: 'vs last 30 days',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
    {
      label: 'At Risk',
      value: '3',
      trend: '↘ 25%',
      trendUp: false,
      subtext: 'vs last 30 days',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100/70',
    },
    {
      label: 'Overdue',
      value: '2',
      trend: '↘ 33%',
      trendUp: false,
      subtext: 'vs last 30 days',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-100/70',
    },
  ];

  // Projects Campaign Cards List
  const projectList = [
    {
      id: 'p1',
      title: 'Aurora Skincare — Q4 Launch Campaign',
      client: 'Aurora Cosmetics Inc.',
      iconBg: 'bg-violet-100/80 text-violet-600',
      icon: <Bookmark className="w-5 h-5" />,
      subtasksCount: 4,
      approvedCount: 0,
      deadlinePill: '1d to deadline',
      deadlinePillType: 'warning',
      subtasks: [
        { title: 'Hero Brand Film (60s)', status: 'In Progress', variant: 'purple' },
        { title: 'Instagram Reel Series (5x)', status: 'Ready for Review', variant: 'amber' },
        { title: 'Product Tutorial Videos (3x)', status: 'Assigned', variant: 'gray' },
        { title: 'Thumbnail Design Package', status: 'Ready for Review', variant: 'amber' },
      ],
      editors: [
        'https://i.pravatar.cc/150?u=marcus',
        'https://i.pravatar.cc/150?u=elena',
        'https://i.pravatar.cc/150?u=david',
        'https://i.pravatar.cc/150?u=zara',
      ],
      extraEditors: 2,
      deadlineDate: 'May 19, 2025',
      deadlineStatus: 'At Risk',
      progressPercent: 25,
      progressColor: 'bg-amber-400',
    },
    {
      id: 'p2',
      title: 'TechFlow SaaS — Product Demo Series',
      client: 'TechFlow Inc.',
      iconBg: 'bg-violet-100/80 text-violet-600',
      icon: <Megaphone className="w-5 h-5" />,
      subtasksCount: 3,
      approvedCount: 0,
      deadlinePill: '3d to deadline',
      deadlinePillType: 'warning',
      subtasks: [
        { title: 'Motion Graphics Intro Package', status: 'In Progress', variant: 'purple' },
        { title: 'Feature Walkthrough Video', status: 'In Progress', variant: 'purple' },
        { title: 'Social Teasers (4x)', status: 'Ready for Review', variant: 'amber' },
      ],
      editors: [
        'https://i.pravatar.cc/150?u=elena',
        'https://i.pravatar.cc/150?u=marcus',
        'https://i.pravatar.cc/150?u=priya',
      ],
      extraEditors: 1,
      deadlineDate: 'May 21, 2025',
      deadlineStatus: 'At Risk',
      progressPercent: 33,
      progressColor: 'bg-amber-400',
    },
    {
      id: 'p3',
      title: "The Founder's Journey — Podcast S2",
      client: 'Growth Lab Media',
      iconBg: 'bg-red-50 text-red-500',
      icon: <Mic className="w-5 h-5" />,
      subtasksCount: 3,
      approvedCount: 0,
      deadlinePill: '5d to deadline',
      deadlinePillType: 'warning',
      subtasks: [
        { title: 'Episode 1–5 Edit Suite', status: 'Assigned', variant: 'gray' },
        { title: 'YouTube Visualizer Clips', status: 'In Progress', variant: 'purple' },
        { title: 'Promo Reels (3x)', status: 'Ready for Review', variant: 'amber' },
      ],
      editors: [
        'https://i.pravatar.cc/150?u=david',
        'https://i.pravatar.cc/150?u=marcus',
        'https://i.pravatar.cc/150?u=james',
      ],
      extraEditors: 0,
      deadlineDate: 'May 23, 2025',
      deadlineStatus: 'At Risk',
      progressPercent: 66,
      progressColor: 'bg-amber-400',
    },
    {
      id: 'p4',
      title: 'Discover Dubai — Tourism Campaign 2026',
      client: 'Dubai Tourism Board',
      iconBg: 'bg-emerald-50 text-emerald-600',
      icon: <Plane className="w-5 h-5" />,
      subtasksCount: 5,
      approvedCount: 0,
      deadlinePill: '15d overdue',
      deadlinePillType: 'danger',
      subtasks: [
        { title: 'Cinematic Hero Film 2026', status: 'Assigned', variant: 'gray' },
        { title: 'Color Grade & Finishing', status: 'Assigned', variant: 'gray' },
        { title: 'Social Cutdowns (6x)', status: 'Assigned', variant: 'gray' },
      ],
      editors: [
        'https://i.pravatar.cc/150?u=zara',
        'https://i.pravatar.cc/150?u=elena',
        'https://i.pravatar.cc/150?u=marcus',
      ],
      extraEditors: 2,
      deadlineDate: 'May 3, 2025',
      deadlineStatus: 'Overdue',
      progressPercent: 20,
      progressColor: 'bg-red-500',
    },
  ];

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setDeadlineFilter('All');
    setClientFilter('All');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header & Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all projects and campaigns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/projects/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New project</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects by name or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors placeholder:text-gray-400 text-gray-800 shadow-2xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <span>Status: {statusFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>Deadline: {deadlineFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <span>Client</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-violet-700 hover:text-violet-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Grid (Compact & Sleek) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((s, idx) => (
          <Card key={idx} className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">{s.label}</span>
              <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                {s.icon}
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {s.value}
              </h2>
              <div className="flex items-center gap-1 text-[11px]">
                <span className={`font-bold ${s.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {s.trend}
                </span>
                <span className="text-gray-400 font-medium">{s.subtext}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Projects Cards List (Compact & Sleek) */}
      <div className="space-y-3">
        {projectList.map((item) => (
          <Card
            key={item.id}
            onClick={() => onNavigate(`/admin/projects/${item.id}`)}
            className="p-3.5 sm:p-4 bg-white border border-gray-100 rounded-xl shadow-2xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Left Column: Project Info & Meta */}
              <div className="lg:col-span-4 flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.client}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <List className="w-3 h-3 text-gray-400" />
                      {item.subtasksCount} subtasks
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <CheckCircle2 className="w-3 h-3 text-gray-400" />
                      {item.approvedCount}/{item.subtasksCount} approved
                    </span>
                    <span className="text-gray-300">•</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${
                        item.deadlinePillType === 'danger'
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.deadlinePillType === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      {item.deadlinePill}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Subtasks List with Status Badges */}
              <div className="lg:col-span-4 space-y-2 border-y lg:border-y-0 lg:border-x border-gray-100 py-3 lg:py-0 lg:px-6">
                {item.subtasks.map((st, i) => (
                  <div key={i} className="flex items-center justify-between text-xs gap-2">
                    <span className="text-gray-700 text-[11.5px] truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                      {st.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                        st.variant === 'purple'
                          ? 'bg-violet-50 text-violet-700'
                          : st.variant === 'amber'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Column: Assigned Editors, Deadline, Progress */}
              <div className="lg:col-span-4 flex items-center justify-between gap-4">
                {/* Assigned Editors Stack */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    ASSIGNED EDITORS
                  </p>
                  <div className="flex items-center -space-x-2">
                    {item.editors.map((avatar, i) => (
                      <img
                        key={i}
                        src={avatar}
                        alt="Editor"
                        className="w-7 h-7 rounded-full object-cover border-2 border-white"
                      />
                    ))}
                    {item.extraEditors > 0 && (
                      <span className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white text-[10px] font-bold text-gray-600 flex items-center justify-center">
                        +{item.extraEditors}
                      </span>
                    )}
                  </div>
                </div>

                {/* Deadline & Progress Bar */}
                <div className="text-right flex-1 max-w-[140px]">
                  <div className="flex items-center justify-end gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      DEADLINE
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-xs mb-2">
                    <span className="font-bold text-gray-900 text-[11px]">{item.deadlineDate}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        item.deadlineStatus === 'Overdue'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      ● {item.deadlineStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.progressColor}`}
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-900">
                      {item.progressPercent}%
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-gray-500">
        <span>Showing 1 to 4 of 12 projects</span>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
              currentPage === 1
                ? 'bg-violet-50 text-violet-700 border border-violet-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
              currentPage === 2
                ? 'bg-violet-50 text-violet-700 border border-violet-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
              currentPage === 3
                ? 'bg-violet-50 text-violet-700 border border-violet-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            3
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

