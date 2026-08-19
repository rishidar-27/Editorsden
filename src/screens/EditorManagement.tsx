import { useState, useMemo } from 'react';
import { Card, Checkbox, KebabMenu } from '@/components/ui';
import { useApp } from '@/context';
import {
  Search,
  Users,
  ShieldCheck,
  Clock,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  X,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';
import type { VerificationStatus } from '@/types';

interface EditorManagementProps {
  onNavigate: (route: string) => void;
}

export function EditorManagement({ onNavigate }: EditorManagementProps) {
  const { editors, setVerificationStatus, toggleEditorActive, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [activeAvailabilityFilter, setActiveAvailabilityFilter] = useState('All');
  const [activeSkillFilter, setActiveSkillFilter] = useState('All');
  const [activeSoftwareFilter, setActiveSoftwareFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 5 Top Stat Cards Data
  const metrics = [
    {
      label: 'Total Editors',
      value: '15',
      trend: '↑ 12%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <Users className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-100/70',
    },
    {
      label: 'Verified',
      value: '9',
      trend: '↑ 18%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
    {
      label: 'Pending Verification',
      value: '5',
      trend: '↓ 7%',
      trendUp: false,
      subtext: 'vs last 7 days',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100/70',
    },
    {
      label: 'Active',
      value: '14',
      trend: '↑ 16%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <UserCheck className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-100/70',
    },
    {
      label: 'Inactive',
      value: '1',
      trend: '↓ 50%',
      trendUp: false,
      subtext: 'vs last 7 days',
      icon: <UserX className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-100/70',
    },
  ];

  // Extended Editor List matching design mock
  const tableData = [
    {
      id: 'e1',
      name: 'Marcus Chen',
      email: 'marcus.chen@email.com',
      city: 'San Francisco, CA',
      avatar: 'https://i.pravatar.cc/150?u=marcus',
      verified: true,
      skills: ['Reels Editing', 'YouTube Editing'],
      extraSkillsCount: 2,
      software: ['Pr', 'Ae', 'DaVinci'],
      extraSoftwareCount: 1,
      experience: '5+ years',
      availability: 'Full-Time',
      hours: '40+ hrs/week',
      status: 'Verified' as VerificationStatus,
      lastActiveTime: '2h ago',
      lastActiveDate: 'May 18, 2025',
    },
    {
      id: 'e2',
      name: 'Elena Rodriguez',
      email: 'elena.rodriguez@email.com',
      city: 'New York, NY',
      avatar: 'https://i.pravatar.cc/150?u=elena',
      verified: true,
      skills: ['Reels Editing', 'Commercial Ads'],
      extraSkillsCount: 1,
      software: ['Pr', 'Ae', 'DaVinci'],
      extraSoftwareCount: 1,
      experience: '4+ years',
      availability: 'Part-Time',
      hours: '20–30 hrs/week',
      status: 'Verified' as VerificationStatus,
      lastActiveTime: '1h ago',
      lastActiveDate: 'May 18, 2025',
    },
    {
      id: 'e3',
      name: 'David Park',
      email: 'david.park@email.com',
      city: 'Los Angeles, CA',
      avatar: 'https://i.pravatar.cc/150?u=david',
      verified: true,
      skills: ['YouTube Editing', 'Podcast Editing'],
      extraSkillsCount: 2,
      software: ['Pr', 'DaVinci'],
      extraSoftwareCount: 0,
      experience: '3+ years',
      availability: 'Full-Time',
      hours: '40+ hrs/week',
      status: 'Verified' as VerificationStatus,
      lastActiveTime: '3h ago',
      lastActiveDate: 'May 18, 2025',
    },
    {
      id: 'e4',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      city: 'London, UK',
      avatar: 'https://i.pravatar.cc/150?u=priya',
      verified: false,
      skills: ['Wedding Videos', 'Motion Graphics'],
      extraSkillsCount: 1,
      software: ['Ae', 'DaVinci'],
      extraSoftwareCount: 0,
      experience: '6+ years',
      availability: 'Weekends',
      hours: '10–15 hrs/week',
      status: 'Pending' as VerificationStatus,
      lastActiveTime: '5h ago',
      lastActiveDate: 'May 18, 2025',
    },
    {
      id: 'e5',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      city: 'Chicago, IL',
      avatar: 'https://i.pravatar.cc/150?u=james',
      verified: true,
      skills: ['Reels Editing', 'YouTube Editing'],
      extraSkillsCount: 1,
      software: ['Pr', 'Ae', 'DaVinci'],
      extraSoftwareCount: 1,
      experience: '4+ years',
      availability: 'Full-Time',
      hours: '40+ hrs/week',
      status: 'Verified' as VerificationStatus,
      lastActiveTime: '1d ago',
      lastActiveDate: 'May 17, 2025',
    },
  ];

  const filtered = useMemo(() => {
    return tableData.filter((e) => {
      if (
        search &&
        !e.name.toLowerCase().includes(search.toLowerCase()) &&
        !e.email.toLowerCase().includes(search.toLowerCase()) &&
        !e.city.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (activeStatusFilter !== 'All' && e.status !== activeStatusFilter) return false;
      if (activeAvailabilityFilter !== 'All' && e.availability !== activeAvailabilityFilter)
        return false;
      return true;
    });
  }, [search, activeStatusFilter, activeAvailabilityFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((e) => e.id));
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setActiveStatusFilter('All');
    setActiveAvailabilityFilter('All');
    setActiveSkillFilter('All');
    setActiveSoftwareFilter('All');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Editors</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all editors in your community
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Editor</span>
          </button>
        </div>
      </div>

      {/* 5 Top Stat Metric Cards Grid (Compact & Sleek) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-3.5 relative bg-white border border-gray-100 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 truncate pr-4">{m.label}</span>
              <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                {m.icon}
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {m.value}
              </h2>
              <div className="flex items-center gap-1 text-[10.5px]">
                <span className={`font-bold ${m.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {m.trend}
                </span>
                <span className="text-gray-400 font-medium hidden xl:inline">{m.subtext}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Filters Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input Box */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search editors by name, email or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors placeholder:text-gray-400 text-gray-800 shadow-2xs"
            />
          </div>

          {/* Filter Dropdown Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
              <span>Filters</span>
              <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </button>

            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
              <span>Skill</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
              <span>Software</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
              <span>Availability</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
              <span>Status</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-violet-700 hover:text-violet-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          </div>
        </div>

        {/* Active Filter Pills */}
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 border border-violet-100 text-xs font-medium rounded-full">
            <span>Status: All</span>
            <button onClick={() => setActiveStatusFilter('All')} className="hover:text-violet-900">
              <X className="w-3 h-3" />
            </button>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 border border-violet-100 text-xs font-medium rounded-full">
            <span>Availability: All</span>
            <button onClick={() => setActiveAvailabilityFilter('All')} className="hover:text-violet-900">
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={toggleAll}
            />
            <span className="text-xs font-medium text-gray-600">
              {selected.length} selected
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              disabled={selected.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <span>Bulk actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>1-10 of 15</span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">EDITOR</th>
                <th className="py-3 px-4">SKILLS</th>
                <th className="py-3 px-4">SOFTWARE</th>
                <th className="py-3 px-4">EXPERIENCE</th>
                <th className="py-3 px-4">AVAILABILITY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 cursor-pointer hover:text-gray-600 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>LAST ACTIVE</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors group">
                  {/* Checkbox */}
                  <td className="py-3.5 px-4">
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
                        <p className="text-[11px] text-gray-400">{row.email}</p>
                        <p className="text-[10px] text-gray-400">{row.city}</p>
                      </div>
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1.5 max-w-[220px]">
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

                  {/* Software */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {row.software.includes('Pr') && (
                        <span className="px-1.5 py-0.5 bg-[#00005B] text-[#9999FF] font-bold text-[10px] rounded">
                          Pr
                        </span>
                      )}
                      {row.software.includes('Ae') && (
                        <span className="px-1.5 py-0.5 bg-[#00005B] text-[#D699FF] font-bold text-[10px] rounded">
                          Ae
                        </span>
                      )}
                      {row.software.includes('DaVinci') && (
                        <span className="w-5 h-5 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center text-[9px] text-white font-bold">
                          Dv
                        </span>
                      )}
                      {row.extraSoftwareCount > 0 && (
                        <span className="text-[11px] font-medium text-gray-400">
                          +{row.extraSoftwareCount}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="py-3.5 px-4 font-medium text-gray-800">
                    {row.experience}
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
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{row.lastActiveTime}</p>
                      <p className="text-[10.5px] text-gray-400">{row.lastActiveDate}</p>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <KebabMenu
                      items={[
                        {
                          label: 'View profile',
                          onClick: () => onNavigate(`/admin/editor/${row.id}`),
                        },
                        {
                          label: 'Edit details',
                          onClick: () => onNavigate(`/admin/editor/${row.id}`),
                        },
                        row.status !== 'Verified'
                          ? {
                              label: 'Verify editor',
                              onClick: () => {
                                setVerificationStatus(row.id, 'Verified');
                                addToast(`${row.name} verified`, 'success');
                              },
                            }
                          : {
                              label: 'Reject editor',
                              onClick: () => {
                                setVerificationStatus(
                                  row.id,
                                  'Rejected',
                                  'Please review and resubmit.'
                                );
                                addToast(`${row.name} rejected`, 'error');
                              },
                            },
                        {
                          label: 'Disable account',
                          onClick: () => {
                            toggleEditorActive(row.id);
                            addToast(`${row.name} disabled`, 'info');
                          },
                          variant: 'destructive',
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Bar */}
        <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

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

