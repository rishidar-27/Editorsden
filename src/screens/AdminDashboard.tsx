import { useState, useMemo } from 'react';
import { Card } from '@/components/ui';
import { useApp } from '@/context';
import {
  Users,
  ShieldCheck,
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronDown,
  Briefcase,
  ExternalLink,
  Film,
  Sparkles,
  DollarSign,
  Layers,
  CheckCircle2,
  TrendingUp,
  HardDrive,
  Activity,
  Filter,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { editors, projects, activity } = useApp();
  const [selectedRange] = useState('Aug 20 – Aug 28, 2026');

  // Dynamic stat metrics from context
  const totalEditors = editors.length;
  const verifiedEditors = editors.filter((e) => e.verificationStatus === 'Verified').length;
  const pendingEditors = editors.filter((e) => e.verificationStatus === 'Pending').length;
  const activeEditors = editors.filter((e) => e.active).length;
  const inactiveEditors = editors.filter((e) => !e.active).length;

  const totalSubtasks = projects.reduce((acc, p) => acc + p.subtasks.length, 0);
  const pendingReviewSubtasks = projects.reduce(
    (acc, p) => acc + p.subtasks.filter((st) => st.status === 'Ready for Review').length,
    0
  );
  const approvedSubtasks = projects.reduce(
    (acc, p) => acc + p.subtasks.filter((st) => st.status === 'Approved').length,
    0
  );

  const metrics = [
    {
      label: 'Total Creators',
      value: String(totalEditors),
      trend: '↑ 14%',
      trendUp: true,
      subtext: 'vs last 30d',
      icon: <Users className="w-5 h-5 text-gray-900" />,
      bg: 'bg-gray-100',
      route: '/admin/editors',
    },
    {
      label: 'Verified Pros',
      value: String(verifiedEditors),
      trend: '↑ 18%',
      trendUp: true,
      subtext: '94% pass rate',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
      route: '/admin/editors',
    },
    {
      label: 'Pending Review',
      value: String(pendingReviewSubtasks),
      trend: pendingReviewSubtasks > 0 ? '● Live' : '0 queue',
      trendUp: pendingReviewSubtasks === 0,
      subtext: 'deliverables waiting',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100/70',
      route: '/admin/review',
    },
    {
      label: 'Active Projects',
      value: String(projects.length),
      trend: `${totalSubtasks} tasks`,
      trendUp: true,
      subtext: 'across enterprise',
      icon: <Layers className="w-5 h-5 text-gray-900" />,
      bg: 'bg-gray-100',
      route: '/admin/projects',
    },
    {
      label: 'Active Escrow',
      value: '$24,850',
      trend: '100% secured',
      trendUp: true,
      subtext: 'R2 zero-egress',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
      route: '/admin/projects',
    },
  ];

  const now = new Date();

  // Deadlines at risk list dynamically extracted from active projects
  const deadlinesAtRisk = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      client: string;
      projectId: string;
      subtasksCount: number;
      daysLeft: string;
      dueDate: string;
      status: 'warning' | 'danger';
      thumbnail: string;
    }> = [];

    projects.forEach((p) => {
      p.subtasks.forEach((st) => {
        if (st.status !== 'Approved') {
          let days = 3;
          let label = 'Due in 3d';
          let isDanger = false;

          if (st.deadline) {
            const d = new Date(st.deadline);
            if (!isNaN(d.getTime())) {
              days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              isDanger = days <= 1;
              label = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`;
            }
          }

          list.push({
            id: st.id,
            title: st.title,
            client: p.title,
            projectId: p.id,
            subtasksCount: p.subtasks.length,
            daysLeft: label,
            dueDate: st.deadline ? new Date(st.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Aug 30',
            status: isDanger ? 'danger' : 'warning',
            thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
          });
        }
      });
    });

    return list.slice(0, 5);
  }, [projects]);

  // Top skills count dynamically computed from editors
  const topSkills = useMemo(() => {
    const skillCounts: Record<string, number> = {};
    editors.forEach((e) => {
      e.skills.forEach((s) => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });

    const entries = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxVal = entries[0]?.[1] || 1;

    return entries.map(([name, count], i) => ({
      name,
      count,
      width: `${Math.round((count / maxVal) * 100)}%`,
      color: i === 0 ? 'bg-gray-900' : i === 1 ? 'bg-gray-700' : i === 2 ? 'bg-gray-600' : 'bg-gray-500',
    }));
  }, [editors]);

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <span>Admin Control Center</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Pipeline
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time telemetry of creator capacity, client deliverables, Cloudflare R2 assets, and active escrow.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            onClick={() => onNavigate('/admin/projects/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-2xs transition-all hover:shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* 5 Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {metrics.map((m, idx) => (
          <Card
            key={idx}
            onClick={() => onNavigate(m.route)}
            className="p-4 relative bg-white border border-gray-100 rounded-2xl shadow-2xs hover:border-gray-300 hover:shadow-xs cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 truncate pr-2 group-hover:text-gray-900 transition-colors">
                {m.label}
              </span>
              <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center shrink-0 shadow-2xs`}>
                {m.icon}
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {m.value}
              </h2>
              <div className="flex items-center gap-1 text-[11px]">
                <span className={`font-bold ${m.trendUp ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {m.trend}
                </span>
                <span className="text-gray-400 font-medium hidden xl:inline">{m.subtext}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pipeline Status Banner */}
      <div className="p-4 bg-gradient-to-r from-gray-900 via-zinc-900 to-black text-white rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5 text-gray-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Cloudflare R2 Direct Production Storage</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Zero Egress Active
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              1,024 MB dedicated workspace per editor • Unlimited 4K frame-accurate client playback & auto-versioning.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/admin/review')}
            className="px-4 py-2 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition-colors shadow-2xs"
          >
            Open Review Queue ({pendingReviewSubtasks})
          </button>
          <button
            onClick={() => onNavigate('/admin/projects')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
          >
            All Deliverables
          </button>
        </div>
      </div>

      {/* Middle Grid: Deadlines at risk & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deadlines at risk (Left - 7 cols) */}
        <Card className="lg:col-span-7 p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-gray-900 text-base">Deadlines at Risk</h3>
              </div>
              <button
                onClick={() => onNavigate('/admin/projects')}
                className="text-xs font-semibold text-gray-900 hover:text-black transition-colors flex items-center gap-1"
              >
                View all projects <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {deadlinesAtRisk.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate(`/admin/projects/${item.projectId}`)}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-14 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold text-gray-800 bg-gray-100 rounded-full border border-gray-200">
                          {item.subtasksCount} subtasks
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {item.client}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end">
                    <span
                      className={`text-xs font-bold ${
                        item.status === 'danger' ? 'text-red-600' : 'text-amber-600'
                      }`}
                    >
                      {item.daysLeft}
                    </span>
                    <span className="text-[10px] text-gray-400">Due {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Showing high-priority upcoming campaign milestones</span>
            <button
              onClick={() => onNavigate('/admin/projects')}
              className="font-bold text-gray-900 hover:underline flex items-center gap-1"
            >
              Open projects <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* Live Activity Feed (Right - 5 cols) */}
        <Card className="lg:col-span-5 p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-900" />
                <h3 className="font-bold text-gray-900 text-base">Live Activity Feed</h3>
              </div>
              <span className="text-xs font-semibold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                Real-Time
              </span>
            </div>

            <div className="space-y-3">
              {activity.slice(0, 6).map((act) => (
                <div key={act.id} className="flex items-start justify-between text-xs gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-800 text-[11.5px] font-medium leading-snug line-clamp-2">
                        {act.message}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 mt-0.5 whitespace-nowrap">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-center">
            <button
              onClick={() => onNavigate('/admin/review')}
              className="text-xs font-bold text-gray-900 hover:text-black transition-colors flex items-center justify-center gap-1 w-full"
            >
              Review all pending items <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>
      </div>

      {/* Bottom Analytics 3-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Community Verification Breakdown */}
        <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3">Creator Community Vetting</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-gray-700 font-semibold">Verified Editors</span>
                </div>
                <span className="font-extrabold text-gray-900">{verifiedEditors} ({Math.round((verifiedEditors / (totalEditors || 1)) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-gray-700 font-semibold">Pending Review</span>
                </div>
                <span className="font-extrabold text-gray-900">{pendingEditors} ({Math.round((pendingEditors / (totalEditors || 1)) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                  <span className="text-gray-700 font-semibold">Active Capacity</span>
                </div>
                <span className="font-extrabold text-gray-900">{activeEditors} ({Math.round((activeEditors / (totalEditors || 1)) * 100)}%)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin/editors')}
            className="text-xs font-bold text-gray-900 hover:underline pt-2 flex items-center gap-1"
          >
            Manage creator network <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        {/* Card 2: Top Skills in Demand */}
        <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs flex flex-col justify-between md:col-span-2 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-sm">Top Editing Disciplines in Network</h3>
              <span className="text-xs text-gray-400">Coverage across {totalEditors} editors</span>
            </div>

            <div className="space-y-3">
              {topSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs gap-3">
                  <span className="text-gray-700 font-semibold text-[11.5px] w-36 shrink-0 truncate">{skill.name}</span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${skill.color}`}
                      style={{ width: skill.width }}
                    />
                  </div>
                  <span className="font-bold text-gray-900 text-[11.5px] w-12 text-right">
                    {skill.count} eds
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin/reports')}
            className="text-xs font-bold text-gray-900 hover:underline pt-2 flex items-center gap-1"
          >
            View detailed skill telemetry <ArrowRight className="w-3 h-3" />
          </button>
        </Card>
      </div>
    </div>
  );
}

