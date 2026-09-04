import { useState, useMemo } from 'react';
import { Card, Badge, Button, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import {
  Search,
  Plus,
  Download,
  ChevronDown,
  RotateCcw,
  Calendar,
  Folder,
  ShieldCheck,
  Clock,
  AlertCircle,
  FolderKanban,
  List,
  CheckCircle2,
  ChevronRight,
  Bookmark,
  Building2,
  Users,
  HardDrive,
  Sparkles,
  DollarSign,
} from 'lucide-react';

interface ProjectsOverviewProps {
  onNavigate: (route: string) => void;
}

export function ProjectsOverview({ onNavigate }: ProjectsOverviewProps) {
  const { projects, editors, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const now = new Date();

  // Metrics computed dynamically from live context projects
  const totalProjectsCount = projects.length;
  const totalSubtasksCount = projects.reduce((acc, p) => acc + p.subtasks.length, 0);
  const approvedSubtasksCount = projects.reduce(
    (acc, p) => acc + p.subtasks.filter((st) => st.status === 'Approved').length,
    0
  );
  const pendingReviewSubtasksCount = projects.reduce(
    (acc, p) => acc + p.subtasks.filter((st) => st.status === 'Ready for Review').length,
    0
  );

  const stats = [
    {
      label: 'Active Campaigns',
      value: String(totalProjectsCount),
      trend: '↗ 20%',
      trendUp: true,
      subtext: 'vs last 30 days',
      icon: <Folder className="w-5 h-5 text-gray-900" />,
      bg: 'bg-gray-100',
    },
    {
      label: 'Deliverables in Flight',
      value: String(totalSubtasksCount),
      trend: '↗ 14%',
      trendUp: true,
      subtext: 'across all projects',
      icon: <List className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
    {
      label: 'Awaiting Admin Review',
      value: String(pendingReviewSubtasksCount),
      trend: '● Live',
      trendUp: pendingReviewSubtasksCount === 0,
      subtext: 'ready for client handoff',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100/70',
    },
    {
      label: 'Approved & Completed',
      value: String(approvedSubtasksCount),
      trend: '↗ 33%',
      trendUp: true,
      subtext: 'R2 masters verified',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesClient = p.clientName.toLowerCase().includes(q);
        const matchesSubtask = p.subtasks.some((st) => st.title.toLowerCase().includes(q));
        if (!matchesTitle && !matchesClient && !matchesSubtask) return false;
      }

      if (statusFilter !== 'All') {
        if (statusFilter === 'Ready for Review') {
          return p.subtasks.some((st) => st.status === 'Ready for Review');
        }
        if (statusFilter === 'Completed') {
          return p.subtasks.length > 0 && p.subtasks.every((st) => st.status === 'Approved');
        }
        if (statusFilter === 'In Progress') {
          return p.subtasks.some((st) => st.status === 'In Progress' || st.status === 'Assigned');
        }
      }

      return true;
    });
  }, [projects, search, statusFilter]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Project Title,Client,Subtasks Count,Approved Count,Created Date',
        ...filteredProjects.map(
          (p) =>
            `"${p.title}","${p.clientName}",${p.subtasks.length},${
              p.subtasks.filter((st) => st.status === 'Approved').length
            },"${p.createdAt || '2026-08-10'}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gogangs_projects_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Projects exported successfully!', 'success');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header & Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <span>Campaign Projects</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
              {projects.length} Active
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all video campaigns, client deliverables, Cloudflare R2 storage workspaces, and creator teams
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/projects/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-2xs transition-all hover:shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign Project</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((s, idx) => (
          <Card key={idx} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">{s.label}</span>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                {s.icon}
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{s.value}</h2>
              <div className="flex items-center gap-1 text-[11px]">
                <span className={`font-bold ${s.trendUp ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {s.trend}
                </span>
                <span className="text-gray-400 font-medium hidden sm:inline">{s.subtext}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <Card className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects by name, client, or deliverable..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Ready for Review', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === tab
                    ? 'bg-gray-900 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}

            {(search || statusFilter !== 'All') && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-900 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Projects Cards List */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 bg-white border border-gray-100 rounded-2xl text-center shadow-2xs">
          <EmptyState
            icon={<FolderKanban className="w-10 h-10 text-gray-400" />}
            title="No projects match criteria"
            description="Try changing your search keywords or clear your status filters."
          />
          <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset all filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredProjects.map((p) => {
            const subtasksCount = p.subtasks.length;
            const approvedCount = p.subtasks.filter((st) => st.status === 'Approved').length;
            const reviewCount = p.subtasks.filter((st) => st.status === 'Ready for Review').length;
            const progressPercent = subtasksCount > 0 ? Math.round((approvedCount / subtasksCount) * 100) : 0;

            const assignedEditorIds = Array.from(new Set(p.subtasks.flatMap((st) => st.assignedEditorIds)));
            const assignedAvatars = assignedEditorIds
              .map((id) => editors.find((e) => e.id === id)?.avatarUrl)
              .filter(Boolean) as string[];

            return (
              <Card
                key={p.id}
                onClick={() => onNavigate(`/admin/projects/${p.id}`)}
                className="p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs hover:border-gray-300 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Left Column: Project Info & Meta (4 cols) */}
                  <div className="lg:col-span-4 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:scale-105 transition-transform">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-black transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {p.clientName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-medium text-gray-500">
                          {subtasksCount} deliverable{subtasksCount !== 1 ? 's' : ''}
                        </span>
                        <span className="text-gray-300">•</span>
                        {reviewCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {reviewCount} to review
                          </span>
                        ) : progressPercent === 100 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700">
                            Completed
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-500 font-medium">
                            {approvedCount}/{subtasksCount} approved
                          </span>
                        )}
                        <span className="text-gray-300">•</span>
                        <span className="text-[10px] font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200 flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          R2 Bucket
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Subtasks List Preview (4 cols) */}
                  <div className="lg:col-span-4 space-y-2 border-y lg:border-y-0 lg:border-x border-gray-100 py-3 lg:py-0 lg:px-6">
                    {p.subtasks.slice(0, 3).map((st) => (
                      <div key={st.id} className="flex items-center justify-between text-xs gap-2">
                        <span className="text-gray-700 text-[11.5px] truncate flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0" />
                          {st.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                            st.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : st.status === 'Ready for Review'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {st.status}
                        </span>
                      </div>
                    ))}
                    {p.subtasks.length > 3 && (
                      <span className="text-[10px] text-gray-400 block pt-0.5 font-medium">
                        +{p.subtasks.length - 3} more deliverables
                      </span>
                    )}
                  </div>

                  {/* Right Column: Assigned Editors & Progress (4 cols) */}
                  <div className="lg:col-span-4 flex items-center justify-between gap-4">
                    {/* Assigned Editors Stack */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        TEAM ASSIGNED
                      </p>
                      {assignedAvatars.length === 0 ? (
                        <span className="text-xs text-gray-400 italic">Unassigned</span>
                      ) : (
                        <div className="flex items-center -space-x-2">
                          {assignedAvatars.slice(0, 3).map((avatar, i) => (
                            <img
                              key={i}
                              src={avatar}
                              alt="Editor"
                              className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-2xs"
                            />
                          ))}
                          {assignedAvatars.length > 3 && (
                            <span className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white text-[10px] font-bold text-gray-600 flex items-center justify-center">
                              +{assignedAvatars.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="text-right flex-1 max-w-[140px]">
                      <div className="flex items-center justify-end gap-1 text-xs mb-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          PROGRESS
                        </span>
                        <span className="font-extrabold text-gray-900 text-xs">{progressPercent}%</span>
                      </div>

                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progressPercent === 100 ? 'bg-emerald-500' : 'bg-gray-900'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

