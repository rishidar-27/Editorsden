import { useState, useMemo } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { useApp } from '@/context';
import {
  BarChart2,
  Download,
  Users,
  Activity,
  Calendar,
  UserX,
  Search,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Zap,
  HardDrive,
  Clock,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { allSkills } from '@/data';
import { formatLastActive, isRecentlyActive, formatDateTime, getEditorLastActiveDate } from '@/lib/dateUtils';

interface ReportsProps {
  onNavigate: (route: string) => void;
}

export function Reports({ onNavigate }: ReportsProps) {
  const { editors, projects, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');

  const actualEditors = useMemo(() => {
    return editors.filter(
      (e) =>
        e.email !== 'admin@gogangs.com' &&
        (e as any).role !== 'admin' &&
        !e.fullName?.toLowerCase().includes('administrator')
    );
  }, [editors]);

  const totalEditors = actualEditors.length;
  const activeCount = actualEditors.filter((e) => e.active).length;
  const verifiedCount = actualEditors.filter((e) => e.verificationStatus === 'Verified').length;
  const inactiveCount = actualEditors.filter((e) => !e.active).length;

  // Dynamic turnaround velocity calculation from actual project submissions
  const turnaroundVelocity = useMemo(() => {
    const deliveryTimes: number[] = [];
    (projects || []).forEach((p) => {
      (p.subtasks || []).forEach((st) => {
        (st.deliverablesQueue || []).forEach((sub) => {
          if (sub.submittedAt && p.createdAt) {
            const start = new Date(p.createdAt).getTime();
            const end = new Date(sub.submittedAt).getTime();
            const diffHours = (end - start) / (1000 * 60 * 60);
            if (diffHours > 0) {
              deliveryTimes.push(diffHours);
            }
          }
        });
      });
    });

    if (deliveryTimes.length > 0) {
      const avg = (deliveryTimes.reduce((sum, val) => sum + val, 0) / deliveryTimes.length).toFixed(1);
      return {
        value: `${avg} hrs`,
        trend: `⚡ ${deliveryTimes.length} verified deliveries`,
        trendUp: true,
        subtext: `average v1 delivery across ${projects.length} projects`,
      };
    }

    // Default SLA fallback when no submissions are in the database yet
    return {
      value: '24h - 48h',
      trend: 'Standard SLA',
      trendUp: true,
      subtext: 'Awaiting first deliverable submission',
    };
  }, [projects]);

  // Live storage usage from Supabase
  const totalStorageBytes = useMemo(() => {
    return actualEditors.reduce((acc, e) => acc + (e.storageUsedBytes || 0), 0);
  }, [actualEditors]);
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(1);

  const verifiedPercent = totalEditors > 0 ? Math.round((verifiedCount / totalEditors) * 100) : 0;
  const activePercent = totalEditors > 0 ? Math.round((activeCount / totalEditors) * 100) : 0;

  const stats = [
    {
      label: 'Verified Creator Network',
      value: String(verifiedCount),
      trend: `${verifiedPercent}% verified`,
      trendUp: verifiedPercent >= 50,
      subtext: `${verifiedCount} of ${totalEditors} creators vetted`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
    {
      label: 'Turnaround Velocity',
      value: turnaroundVelocity.value,
      trend: turnaroundVelocity.trend,
      trendUp: turnaroundVelocity.trendUp,
      subtext: turnaroundVelocity.subtext,
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100/70',
    },
    {
      label: 'R2 Zero-Egress Storage',
      value: `${totalStorageMB} MB`,
      trend: '100% saved',
      trendUp: true,
      subtext: 'Cloudflare R2 active assets',
      icon: <HardDrive className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
    {
      label: 'Active Community Capacity',
      value: String(activeCount),
      trend: `${activePercent}% active`,
      trendUp: activePercent >= 50,
      subtext: `${activeCount} active of ${totalEditors} registered`,
      icon: <Activity className="w-5 h-5 text-gray-900" />,
      bg: 'bg-gray-100',
    },
  ];

  const filteredEditors = useMemo(() => {
    return actualEditors.filter((e) => {
      if (
        search &&
        !e.fullName.toLowerCase().includes(search.toLowerCase()) &&
        !e.email.toLowerCase().includes(search.toLowerCase()) &&
        !e.city.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (availabilityFilter !== 'All' && e.availability !== availabilityFilter) return false;
      if (skillFilter !== 'All' && !e.skills.includes(skillFilter as never)) return false;
      return true;
    });
  }, [actualEditors, search, availabilityFilter, skillFilter]);

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Name,Email,City,Skills,Experience,Availability,Hours,Status',
        ...filteredEditors.map(
          (e) =>
            `"${e.fullName}","${e.email}","${e.city}","${e.skills.join('; ')}",${e.experience},"${e.availability}",${e.hoursPerWeek},"${e.verificationStatus}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gogangs_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Analytics & telemetry exported to CSV successfully!', 'success');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <span>Analytics & Creator Telemetry</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
              Q3 Live Telemetry
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Turnaround velocity, Cloudflare R2 egress savings, skill coverage, and capacity metrics across your creator ecosystem
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-2xs transition-all hover:shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
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
              <span className={`text-xs font-bold ${s.trendUp ? 'text-emerald-600' : 'text-amber-500'}`}>
                {s.trend}
              </span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium block mt-1">{s.subtext}</span>
          </Card>
        ))}
      </div>

      {/* Search & Filters Bar */}
      <Card className="p-4 bg-white border border-gray-100 rounded-xl shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search creators in report by name, city, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
            >
              <option value="All">All Availabilities</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Weekends">Weekends</option>
            </select>

            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
            >
              <option value="All">All Skills</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {(search || availabilityFilter !== 'All' || skillFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setAvailabilityFilter('All');
                  setSkillFilter('All');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-gray-900 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Engagement Table Card */}
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">Editor Performance & Capacity Summary</h3>
          <span className="text-xs text-gray-400">
            {filteredEditors.length} of {totalEditors} creators shown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">CREATOR</th>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-4">PRIMARY DISCIPLINES</th>
                <th className="py-3 px-4">EXPERIENCE</th>
                <th className="py-3 px-4">AVAILABILITY</th>
                <th className="py-3 px-4">LAST ACTIVE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredEditors.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => onNavigate(`/admin/editor/${e.id}`)}
                  className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={e.avatarUrl}
                        alt={e.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-black transition-colors">{e.fullName}</p>
                        <p className="text-[11px] text-gray-400">{e.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-gray-600">{e.city}</td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {e.skills.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-[10.5px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-gray-800">{e.experience}y</td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-900">{e.availability}</span>
                    <span className="text-[10px] text-gray-400 block">{e.hoursPerWeek}h/wk</span>
                  </td>

                  <td className="py-3.5 px-4" title={`Exact time: ${formatDateTime(getEditorLastActiveDate(e))}`}>
                    {(() => {
                      const activeIso = getEditorLastActiveDate(e);
                      const isRecent = isRecentlyActive(activeIso);
                      const text = formatLastActive(activeIso);
                      return (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${isRecent ? 'bg-emerald-500 animate-pulse' : e.active ? 'bg-emerald-500/80' : 'bg-gray-300'}`} />
                            <span className={`font-bold text-xs ${isRecent ? 'text-emerald-600' : 'text-gray-900'}`}>{isRecent ? 'Active now' : text}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 block font-normal">
                            {activeIso ? formatDateTime(activeIso) : 'Never'}
                          </span>
                        </div>
                      );
                    })()}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        e.verificationStatus === 'Verified'
                          ? 'verified'
                          : e.verificationStatus === 'Pending'
                          ? 'pending'
                          : 'rejected'
                      }
                    >
                      {e.verificationStatus}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onNavigate(`/admin/editor/${e.id}`);
                      }}
                      className="text-xs font-bold text-gray-900 hover:text-black hover:underline"
                    >
                      View Studio Profile →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

