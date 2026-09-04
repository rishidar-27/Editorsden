import { useState, useMemo } from 'react';
import { Card, Checkbox, KebabMenu, Button, Badge } from '@/components/ui';
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
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import type { VerificationStatus, Editor } from '@/types';
import { allSkills, allSoftware } from '@/data';

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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Live metrics from context
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
      icon: <Users className="w-5 h-5 text-gray-900" />,
      bg: 'bg-gray-100',
    },
    {
      label: 'Verified',
      value: String(verifiedEditors),
      trend: '↑ 18%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
    {
      label: 'Pending Verification',
      value: String(pendingEditors),
      trend: '↓ 7%',
      trendUp: false,
      subtext: 'vs last 7 days',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100/70',
    },
    {
      label: 'Active',
      value: String(activeEditors),
      trend: '↑ 16%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <UserCheck className="w-5 h-5 text-gray-900" />,
      bg: 'bg-gray-100',
    },
    {
      label: 'Inactive',
      value: String(inactiveEditors),
      trend: '↓ 50%',
      trendUp: false,
      subtext: 'vs last 7 days',
      icon: <UserX className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-100/70',
    },
  ];

  // Dynamic filter logic
  const filtered = useMemo(() => {
    return editors.filter((e) => {
      if (
        search &&
        !e.fullName.toLowerCase().includes(search.toLowerCase()) &&
        !e.email.toLowerCase().includes(search.toLowerCase()) &&
        !e.city.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (activeStatusFilter !== 'All' && e.verificationStatus !== activeStatusFilter) return false;
      if (activeAvailabilityFilter !== 'All' && e.availability !== activeAvailabilityFilter) return false;
      if (activeSkillFilter !== 'All' && !e.skills.includes(activeSkillFilter as never)) return false;
      if (activeSoftwareFilter !== 'All' && !e.editingSoftware.includes(activeSoftwareFilter as never)) return false;
      return true;
    });
  }, [editors, search, activeStatusFilter, activeAvailabilityFilter, activeSkillFilter, activeSoftwareFilter]);

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

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Name,Email,City,Experience,Status,Availability", ...filtered.map(e => `"${e.fullName}","${e.email}","${e.city}",${e.experience},"${e.verificationStatus}","${e.availability}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gogangs_editors_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Editors exported to CSV successfully!', 'success');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Editor Community</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage, verify, and monitor all video editors and motion designers
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
        </div>
      </div>

      {/* 5 Top Stat Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-4 relative bg-white border border-gray-100 rounded-2xl shadow-2xs">
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

      {/* Search & Filters Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input Box */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search editors by name, email or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400 text-gray-800 shadow-2xs"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 shadow-2xs"
            >
              <option value="All">Status: All</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={activeAvailabilityFilter}
              onChange={(e) => setActiveAvailabilityFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 shadow-2xs"
            >
              <option value="All">Availability: All</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Weekends">Weekends</option>
            </select>

            <select
              value={activeSkillFilter}
              onChange={(e) => setActiveSkillFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 shadow-2xs"
            >
              <option value="All">Skill: All</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {(search || activeStatusFilter !== 'All' || activeAvailabilityFilter !== 'All' || activeSkillFilter !== 'All') && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-gray-900 hover:underline transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={toggleAll}
            />
            <span className="text-xs font-medium text-gray-600">
              {selected.length} selected
            </span>
          </div>

          <div className="text-xs text-gray-500">
            Showing {filtered.length} of {totalEditors} editors
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
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => onNavigate(`/admin/editor/${e.id}`)}
                  className="hover:bg-gray-50/70 transition-colors group cursor-pointer"
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4" onClick={(ev) => ev.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(e.id)}
                      onChange={() => toggleSelect(e.id)}
                    />
                  </td>

                  {/* Editor Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={e.avatarUrl}
                        alt={e.fullName}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900 group-hover:text-black transition-colors">
                            {e.fullName}
                          </span>
                          {e.verificationStatus === 'Verified' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-900" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400">{e.email}</p>
                        <p className="text-[10px] text-gray-400">{e.city}</p>
                      </div>
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1 max-w-[200px]">
                      {e.skills.slice(0, 2).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10.5px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {e.skills.length > 2 && (
                        <span className="text-[10.5px] font-medium text-gray-400">
                          +{e.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Software */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1 max-w-[180px]">
                      {e.editingSoftware.slice(0, 2).map((soft, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-[10px] font-semibold">
                          {soft.replace('Adobe ', '')}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="py-3.5 px-4 font-medium text-gray-800">
                    {e.experience} years
                  </td>

                  {/* Availability */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{e.availability}</p>
                      <p className="text-[10.5px] text-gray-400">{e.hoursPerWeek} hrs/week</p>
                    </div>
                  </td>

                  {/* Status */}
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

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(ev) => ev.stopPropagation()}>
                    <KebabMenu
                      items={[
                        {
                          label: 'View details',
                          onClick: () => onNavigate(`/admin/editor/${e.id}`),
                        },
                        {
                          label: e.verificationStatus === 'Verified' ? 'Mark as Pending' : 'Verify Editor',
                          onClick: () =>
                            setVerificationStatus(
                              e.id,
                              e.verificationStatus === 'Verified' ? 'Pending' : 'Verified'
                            ),
                        },
                        {
                          label: e.active ? 'Deactivate account' : 'Activate account',
                          onClick: () => toggleEditorActive(e.id),
                          variant: e.active ? 'destructive' : 'default',
                        },
                      ]}
                    />
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
