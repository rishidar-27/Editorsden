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

  const metrics = [
    {
      label: 'Total Editors',
      value: String(totalEditors),
      trend: '↑ 12%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <Users className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-100/70',
      route: '/admin/editors',
    },
    {
      label: 'Verified Editors',
      value: String(verifiedEditors),
      trend: '↑ 18%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
      route: '/admin/editors',
    },
    {
      label: 'Pending Verification',
      value: String(pendingEditors),
      trend: '↓ 7%',
      trendUp: false,
      subtext: 'vs last 7 days',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100/70',
      route: '/admin/editors',
    },
    {
      label: 'Active Editors',
      value: String(activeEditors),
      trend: '↑ 16%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <UserCheck className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-100/70',
      route: '/admin/editors',
    },
    {
      label: 'Inactive Editors',
      value: String(inactiveEditors),
      trend: '↓ 50%',
      trendUp: false,
      subtext: 'vs last 7 days',
      icon: <UserX className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-100/70',
      route: '/admin/editors',
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
      color: i === 0 ? 'bg-violet-600' : i === 1 ? 'bg-violet-500' : i === 2 ? 'bg-violet-400' : 'bg-violet-300',
    }));
  }, [editors]);

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time overview of your editor community, client projects, and active deliverables
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 5 Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {metrics.map((m, idx) => (
          <Card
            key={idx}
            onClick={() => onNavigate(m.route)}
            className="p-4 relative bg-white border border-gray-100 rounded-2xl shadow-2xs hover:shadow-xs cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 truncate pr-2">{m.label}</span>
              <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
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

      {/* Middle Grid: Deadlines at risk & Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deadlines at risk (Left) */}
        <Card className="lg:col-span-7 p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-gray-900 text-base">Deadlines at Risk</h3>
              </div>
              <button
                onClick={() => onNavigate('/admin/projects')}
                className="text-xs font-semibold text-violet-700 hover:text-violet-800 transition-colors flex items-center gap-1"
              >
                View all projects <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
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
                        <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold text-violet-700 bg-violet-50 rounded-full border border-violet-100">
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

          <div className="pt-3 mt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Showing priority upcoming deadlines</span>
            <button
              onClick={() => onNavigate('/admin/projects')}
              className="font-bold text-violet-600 hover:underline"
            >
              Open projects →
            </button>
          </div>
        </Card>

        {/* Recent activity (Right) */}
        <Card className="lg:col-span-5 p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">Recent Activity</h3>
              <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                Live Feed
              </span>
            </div>

            <div className="space-y-3">
              {activity.slice(0, 7).map((act) => (
                <div key={act.id} className="flex items-center justify-between text-xs gap-3 p-1.5 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-gray-800 text-[11.5px] truncate">
                      {act.message}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-center">
            <button
              onClick={() => onNavigate('/admin/review')}
              className="text-xs font-bold text-violet-700 hover:text-violet-800 transition-colors"
            >
              Review all pending items →
            </button>
          </div>
        </Card>
      </div>

      {/* Bottom Analytics 3-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Editors by status */}
        <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-4">Editors by Verification</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-gray-700 font-medium">Verified Editors</span>
                </div>
                <span className="font-bold text-gray-900">{verifiedEditors} ({Math.round((verifiedEditors / totalEditors) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-gray-700 font-medium">Pending Verification</span>
                </div>
                <span className="font-bold text-gray-900">{pendingEditors} ({Math.round((pendingEditors / totalEditors) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                  <span className="text-gray-700 font-medium">Active Accounts</span>
                </div>
                <span className="font-bold text-gray-900">{activeEditors} ({Math.round((activeEditors / totalEditors) * 100)}%)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin/editors')}
            className="text-xs font-bold text-violet-700 hover:underline pt-4 flex items-center gap-1"
          >
            Manage all editors <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        {/* Card 2: Top Skills in Demand */}
        <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs flex flex-col justify-between md:col-span-2">
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-4">Top Skills in Community</h3>

            <div className="space-y-3">
              {topSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs gap-3">
                  <span className="text-gray-700 font-medium text-[11.5px] w-36 shrink-0">{skill.name}</span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${skill.color}`}
                      style={{ width: skill.width }}
                    />
                  </div>
                  <span className="font-bold text-gray-900 text-[11.5px] w-8 text-right">
                    {skill.count} eds
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin/reports')}
            className="text-xs font-bold text-violet-700 hover:underline pt-4 flex items-center gap-1"
          >
            View detailed skill reports <ArrowRight className="w-3 h-3" />
          </button>
        </Card>
      </div>
    </div>
  );
}
