import { useState } from 'react';
import { Card, Checkbox, KebabMenu } from '@/components/ui';
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
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  MoreVertical,
} from 'lucide-react';
import type { VerificationStatus } from '@/types';

interface ReportsProps {
  onNavigate: (route: string) => void;
}

export function Reports({ onNavigate }: ReportsProps) {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'7days' | '30days' | 'inactive'>('7days');
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // 4 Top Stat Cards matching mock design
  const stats = [
    {
      label: 'Total Editors',
      value: '15',
      trend: '↑ 12%',
      trendUp: true,
      subtext: 'vs last 30 days',
      icon: <Users className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-100/70',
    },
    {
      label: 'Active (7 days)',
      value: '12',
      trend: '↑ 8%',
      trendUp: true,
      subtext: 'vs last 30 days',
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
    {
      label: 'Active (30 days)',
      value: '13',
      trend: '↑ 6%',
      trendUp: true,
      subtext: 'vs last 30 days',
      icon: <Calendar className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100/70',
    },
    {
      label: 'Inactive (30+ days)',
      value: '1',
      trend: '↓ 50%',
      trendUp: false,
      subtext: 'vs last 30 days',
      icon: <UserX className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-100/70',
    },
  ];

  // Editor Engagement Table Data matching mock design
  const editorsReport = [
    {
      id: 'r1',
      name: 'Marcus Chen',
      email: 'marcus.chen@email.com',
      city: 'San Francisco, CA',
      avatar: 'https://i.pravatar.cc/150?u=marcus',
      verified: true,
      skills: ['Reels Editing', 'YouTube Editing'],
      extraSkillsCount: 2,
      availability: 'Full-Time',
      hours: '40+ hrs/week',
      status: 'Verified' as VerificationStatus,
      lastLoginDate: 'Aug 18, 2026',
      lastLoginTime: '2h ago',
      engagementPercent: 92,
    },
    {
      id: 'r2',
      name: 'Elena Rodriguez',
      email: 'elena.rodriguez@email.com',
      city: 'New York, NY',
      avatar: 'https://i.pravatar.cc/150?u=elena',
      verified: true,
      skills: ['Reels Editing', 'Commercial Ads'],
      extraSkillsCount: 1,
      availability: 'Part-Time',
      hours: '20–30 hrs/week',
      status: 'Verified' as VerificationStatus,
      lastLoginDate: 'Aug 17, 2026',
      lastLoginTime: '1d ago',
      engagementPercent: 85,
    },
    {
      id: 'r3',
      name: 'David Park',
      email: 'david.park@email.com',
      city: 'Los Angeles, CA',
      avatar: 'https://i.pravatar.cc/150?u=david',
      verified: true,
      skills: ['YouTube Editing', 'Podcast Editing'],
      extraSkillsCount: 2,
      availability: 'Full-Time',
      hours: '40+ hrs/week',
      status: 'Verified' as VerificationStatus,
      lastLoginDate: 'Aug 18, 2026',
      lastLoginTime: '3h ago',
      engagementPercent: 88,
    },
    {
      id: 'r4',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      city: 'London, UK',
      avatar: 'https://i.pravatar.cc/150?u=priya',
      verified: false,
      skills: ['Wedding Videos', 'Motion Graphics'],
      extraSkillsCount: 1,
      availability: 'Weekends',
      hours: '10–15 hrs/week',
      status: 'Pending' as VerificationStatus,
      lastLoginDate: 'Aug 18, 2026',
      lastLoginTime: '5h ago',
      engagementPercent: 64,
    },
    {
      id: 'r5',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      city: 'Chicago, IL',
      avatar: 'https://i.pravatar.cc/150?u=james',
      verified: true,
      skills: ['Reels Editing', 'YouTube Editing'],
      extraSkillsCount: 1,
      availability: 'Full-Time',
      hours: '40+ hrs/week',
      status: 'Verified' as VerificationStatus,
      lastLoginDate: 'Aug 18, 2026',
      lastLoginTime: '1d ago',
      engagementPercent: 90,
    },
    {
      id: 'r6',
      name: 'Sofia Almeida',
      email: 'sofia.almeida@email.com',
      city: 'São Paulo, Brazil',
      avatar: 'https://i.pravatar.cc/150?u=sofia',
      verified: true,
      skills: ['Motion Graphics', 'Commercial Ads'],
      extraSkillsCount: 1,
      availability: 'Part-Time',
      hours: '20–30 hrs/week',
      status: 'Verified' as VerificationStatus,
      lastLoginDate: 'Aug 17, 2026',
      lastLoginTime: '1d ago',
      engagementPercent: 82,
    },
    {
      id: 'r7',
      name: "Liam O'Brien",
      email: 'liam.obrien@email.com',
      city: 'Dublin, Ireland',
      avatar: 'https://i.pravatar.cc/150?u=liam',
      verified: false,
      skills: ['Podcast Editing', 'YouTube Editing'],
      extraSkillsCount: 0,
      availability: 'Full-Time',
      hours: '40+ hrs/week',
      status: 'Pending' as VerificationStatus,
      lastLoginDate: 'Aug 18, 2026',
      lastLoginTime: '2d ago',
      engagementPercent: 71,
    },
    {
      id: 'r8',
      name: 'Aria Patel',
      email: 'aria.patel@email.com',
      city: 'Seattle, WA',
      avatar: 'https://i.pravatar.cc/150?u=aria',
      verified: false,
      skills: ['Color Grading', 'Wedding Videos'],
      extraSkillsCount: 1,
      availability: 'Part-Time',
      hours: '20–30 hrs/week',
      status: 'Rejected' as VerificationStatus,
      lastLoginDate: 'Aug 15, 2026',
      lastLoginTime: '3d ago',
      engagementPercent: 48,
    },
  ];

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === editorsReport.length) setSelected([]);
    else setSelected(editorsReport.map((e) => e.id));
  };

  const exportCSV = () => {
    const headers = [
      'Name',
      'City',
      'Skills',
      'Availability',
      'Status',
      'Last Login Date',
      'Engagement Percent',
    ];
    const rows = editorsReport.map((e) => [
      e.name,
      e.city,
      e.skills.join('; '),
      e.availability,
      e.status,
      e.lastLoginDate,
      `${e.engagementPercent}%`,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gogangs-reports-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Reports CSV exported successfully', 'success');
  };

  const clearFilters = () => {
    setSearch('');
    setAvailabilityFilter('All');
    setStatusFilter('All');
    setSkillFilter('All');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-violet-100/80 text-violet-600 flex items-center justify-center shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Editor activity and engagement reports
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Top Stat Cards Grid (Compact & Sleek) */}
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

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Top Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('7days')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === '7days'
                ? 'bg-violet-50 text-violet-700 border border-violet-100 shadow-2xs'
                : 'bg-gray-100/70 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active last 7 days (14)
          </button>
          <button
            onClick={() => setActiveTab('30days')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === '30days'
                ? 'bg-violet-50 text-violet-700 border border-violet-100 shadow-2xs'
                : 'bg-gray-100/70 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active last 30 days (13)
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'inactive'
                ? 'bg-violet-50 text-violet-700 border border-violet-100 shadow-2xs'
                : 'bg-gray-100/70 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Inactive 30+ days (1)
          </button>
        </div>

        {/* Search & Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search editors by name, email or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors placeholder:text-gray-400 text-gray-800 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
              <span>Availability: {availabilityFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
              <span>Status: {statusFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
              <span>Skill: {skillFilter}</span>
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
      </div>

      {/* Editor Engagement Table Card */}
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <Checkbox
                    checked={selected.length === editorsReport.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="py-3 px-4">EDITOR</th>
                <th className="py-3 px-4">SKILLS</th>
                <th className="py-3 px-4">AVAILABILITY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 cursor-pointer hover:text-gray-600 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>LAST LOGIN</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4">ENGAGEMENT</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {editorsReport.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onNavigate(`/admin/editor/${row.id}`)}
                  className="hover:bg-gray-50/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => toggleSelect(row.id)}
                    />
                  </td>

                  {/* Editor Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.avatar}
                        alt={row.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900">{row.name}</span>
                          {row.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 fill-violet-600/10" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400">{row.city}</p>
                      </div>
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1.5 max-w-[200px]">
                      {row.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {row.extraSkillsCount > 0 && (
                        <span className="text-[11px] font-medium text-gray-400">
                          +{row.extraSkillsCount}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Availability */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{row.availability}</p>
                      <p className="text-[10.5px] text-gray-400">{row.hours}</p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {row.status === 'Verified' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Verified
                      </span>
                    ) : row.status === 'Pending' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 text-xs font-semibold rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* Last Login */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{row.lastLoginDate}</p>
                      <p className="text-[10.5px] text-gray-400">{row.lastLoginTime}</p>
                    </div>
                  </td>

                  {/* Engagement Bar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-violet-600"
                          style={{ width: `${row.engagementPercent}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-900 text-xs w-8 text-right">
                        {row.engagementPercent}%
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <KebabMenu
                      items={[
                        {
                          label: 'View profile',
                          onClick: () => onNavigate(`/admin/editor/${row.id}`),
                        },
                        {
                          label: 'Export report',
                          onClick: exportCSV,
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>Showing 1 to 8 of 14 editors</span>

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
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

