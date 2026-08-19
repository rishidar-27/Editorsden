import { Card, Badge, Avatar } from '@/components/ui';
import { useApp } from '@/context';
import { Users, ShieldCheck, Clock, UserCheck, UserX, AlertTriangle, ArrowRight } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { editors, projects, activity } = useApp();

  const total = editors.length;
  const verified = editors.filter((e) => e.verificationStatus === 'Verified').length;
  const pending = editors.filter((e) => e.verificationStatus === 'Pending').length;
  const active = editors.filter((e) => e.active).length;
  const inactive = editors.filter((e) => !e.active).length;

  const now = new Date();
  const allSubtasks = projects.flatMap((p) => p.subtasks);
  const deadlinesAtRisk = allSubtasks.filter((st) => {
    const days = Math.ceil((new Date(st.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 5 && days >= 0 && st.status !== 'Approved';
  });

  const formatRelative = (timestamp: string) => {
    const diff = now.getTime() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const metrics = [
    { label: 'Total editors', value: total, icon: <Users className="w-[18px] h-[18px] text-gray-600" />, bg: 'bg-gray-100' },
    { label: 'Verified', value: verified, icon: <ShieldCheck className="w-[18px] h-[18px] text-mint-600" />, bg: 'bg-mint-050', dot: 'bg-mint-500' },
    { label: 'Pending verification', value: pending, icon: <Clock className="w-[18px] h-[18px] text-amber-600" />, bg: 'bg-amber-050', dot: 'bg-amber-500' },
    { label: 'Active editors', value: active, icon: <UserCheck className="w-[18px] h-[18px] text-gray-600" />, bg: 'bg-gray-100' },
    { label: 'Inactive editors', value: inactive, icon: <UserX className="w-[18px] h-[18px] text-gray-400" />, bg: 'bg-gray-100' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-h2 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of your editor community</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {metrics.map((m, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.bg}`}>
                {m.icon}
              </div>
              {m.dot && <span className={`w-2 h-2 rounded-full ${m.dot}`} />}
            </div>
            <p className="text-sm text-gray-600">{m.label}</p>
            <p className="text-2xl font-bold text-ink-900 tabular-nums mt-0.5" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
              {m.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadlines at risk */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-h3" style={{ fontSize: '16px' }}>Deadlines at risk</h3>
          </div>
          {deadlinesAtRisk.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No deadlines at risk.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {deadlinesAtRisk.map((st) => {
                const project = projects.find((p) => p.id === st.projectId);
                const days = Math.ceil((new Date(st.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={st.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-900 truncate">{st.title}</p>
                      <p className="text-xs text-gray-500">{project?.title}</p>
                    </div>
                    <span className={`text-xs font-medium shrink-0 ${
                      days <= 1 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {days === 0 ? 'Today' : days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={() => onNavigate('/admin/projects')}
            className="mt-4 flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 transition-colors"
          >
            View all projects
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        {/* Recent activity */}
        <Card className="p-6">
          <h3 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Recent activity</h3>
          <div className="flex flex-col gap-3">
            {activity.slice(0, 7).map((event) => (
              <div key={event.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className={`w-2 h-2 rounded-full ${
                    event.type === 'verify' ? 'bg-mint-500' :
                    event.type === 'reject' ? 'bg-red-500' :
                    event.type === 'approve' ? 'bg-mint-500' :
                    event.type === 'submit_review' ? 'bg-amber-500' :
                    event.type === 'create_project' ? 'bg-violet-500' :
                    'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{event.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatRelative(event.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
