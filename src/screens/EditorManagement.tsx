import { useState, useMemo } from 'react';
import { Card, Checkbox, Button, Badge } from '@/components/ui';
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
  Check,
  CheckCircle2,
} from 'lucide-react';
import type { VerificationStatus, Editor } from '@/types';
import { allSkills, allSoftware } from '@/data';
import { formatLastActive, isRecentlyActive, formatDateTime, getEditorLastActiveDate } from '@/lib/dateUtils';

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

  // Exclude admin accounts from the editor directory roster and metrics
  const editorList = useMemo(() => {
    return editors.filter(
      (e) =>
        e.email !== 'admin@gogangs.com' &&
        (e as any).role !== 'admin' &&
        !e.fullName?.toLowerCase().includes('administrator')
    );
  }, [editors]);

  // Live metrics from context
  const totalEditors = editorList.length;
  const verifiedEditors = editorList.filter((e) => e.verificationStatus === 'Verified').length;
  const pendingEditors = editorList.filter((e) => e.verificationStatus === 'Pending').length;
  const activeEditors = editorList.filter((e) => e.active).length;
  const inactiveEditors = editorList.filter((e) => !e.active).length;

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
    return editorList.filter((e) => {
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
  }, [editorList, search, activeStatusFilter, activeAvailabilityFilter, activeSkillFilter, activeSoftwareFilter]);

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
      ["Name,Email,City,Experience,Status,Availability,LastActive", ...filtered.map(e => {
        const lastActive = formatLastActive(getEditorLastActiveDate(e));
        return `"${e.fullName}","${e.email}","${e.city}",${e.experience},"${e.verificationStatus}","${e.availability}","${lastActive}"`;
      })].join("\n");
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
    <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Editor Community</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
            Manage, verify, and monitor all video editors and motion designers
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-zinc-300 shadow-2xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 5 Top Stat Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-4 relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 truncate pr-2">{m.label}</span>
              <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
                {m.icon}
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {m.value}
              </h2>
              <div className="flex items-center gap-1 text-[11px]">
                <span className={`font-bold ${m.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
                  {m.trend}
                </span>
                <span className="text-gray-400 dark:text-zinc-500 font-medium hidden xl:inline">{m.subtext}</span>
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
            <Search className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search editors by name, email or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-colors placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-gray-800 dark:text-zinc-100 shadow-2xs"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-gray-400 dark:focus:border-zinc-600 shadow-2xs cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={activeAvailabilityFilter}
              onChange={(e) => setActiveAvailabilityFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-gray-400 dark:focus:border-zinc-600 shadow-2xs cursor-pointer"
            >
              <option value="All">Availability: All</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Weekends">Weekends</option>
            </select>

            <select
              value={activeSkillFilter}
              onChange={(e) => setActiveSkillFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-gray-400 dark:focus:border-zinc-600 shadow-2xs cursor-pointer"
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
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-gray-900 dark:text-zinc-200 hover:underline transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-2xl shadow-2xs overflow-visible">
        {/* Table Top Toolbar */}
        <div className="px-5 py-3.5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={toggleAll}
            />
            <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">
              {selected.length} selected
            </span>
          </div>

          <div className="text-xs text-gray-500 dark:text-zinc-400">
            Showing {filtered.length} of {totalEditors} editors
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[360px] pb-16">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-850/50 text-[10px] font-bold text-gray-400 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center"></th>
                <th className="py-3 px-4 min-w-[240px]">EDITOR</th>
                <th className="py-3 px-4 min-w-[160px]">SKILLS</th>
                <th className="py-3 px-4 min-w-[160px]">SOFTWARE</th>
                <th className="py-3 px-4 min-w-[110px]">EXPERIENCE</th>
                <th className="py-3 px-4 min-w-[140px]">AVAILABILITY</th>
                <th className="py-3 px-4 min-w-[150px]">LAST ACTIVE</th>
                <th className="py-3 px-4 min-w-[120px]">STATUS</th>
                <th className="py-3 px-4 w-32 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs text-gray-700 dark:text-zinc-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400 dark:text-zinc-500">
                    No creators found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => onNavigate(`/admin/editor/${e.id}`)}
                    className="hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                  >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4 text-center align-middle" onClick={(ev) => ev.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(e.id)}
                      onChange={() => toggleSelect(e.id)}
                    />
                  </td>

                  {/* Editor Info */}
                  <td className="py-3.5 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={e.avatarUrl}
                        alt={e.fullName}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200 dark:border-zinc-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-zinc-100 transition-colors">
                            {e.fullName}
                          </span>
                          {e.verificationStatus === 'Verified' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500">{e.email}</p>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500">{e.city || 'Remote'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-3.5 px-4 align-middle">
                    <div className="flex flex-wrap items-center gap-1 max-w-[220px]">
                      {e.skills.slice(0, 2).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-md text-[10.5px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {e.skills.length > 2 && (
                        <span className="text-[10.5px] font-medium text-gray-400 dark:text-zinc-500">
                          +{e.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Software */}
                  <td className="py-3.5 px-4 align-middle">
                    <div className="flex flex-wrap items-center gap-1 max-w-[180px]">
                      {e.editingSoftware.slice(0, 2).map((soft, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded text-[10px] font-semibold">
                          {soft.replace('Adobe ', '')}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-zinc-200 align-middle">
                    {e.experience} years
                  </td>

                  {/* Availability */}
                  <td className="py-3.5 px-4 align-middle">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{e.availability}</p>
                      <p className="text-[10.5px] text-gray-400 dark:text-zinc-500">{e.hoursPerWeek} hrs/week</p>
                    </div>
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-4 align-middle" title={`Exact time: ${formatDateTime(getEditorLastActiveDate(e))}`}>
                    {(() => {
                      const activeIso = getEditorLastActiveDate(e);
                      const isRecent = isRecentlyActive(activeIso);
                      const text = formatLastActive(activeIso);
                      return (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${isRecent ? 'bg-emerald-500 animate-pulse' : e.active ? 'bg-emerald-500/80' : 'bg-gray-300 dark:bg-zinc-600'}`} />
                            <span className="font-bold text-gray-900 dark:text-white text-xs">{text}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 dark:text-zinc-500 block font-medium mt-0.5">
                            {activeIso ? formatDateTime(activeIso) : 'Never'}
                          </span>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 align-middle">
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

                  {/* Actions: 2 icons alone (tick for approve, wrong for deactivate) */}
                  <td className="py-3.5 px-4 text-center align-middle" onClick={(ev) => ev.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2" onClick={(ev) => ev.stopPropagation()}>
                      {/* Approve / Verify (Tick) */}
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          if (e.verificationStatus === 'Verified') {
                            setVerificationStatus(e.id, 'Pending');
                            addToast(`${e.fullName} marked as Pending`, 'info');
                          } else {
                            setVerificationStatus(e.id, 'Verified');
                            if (!e.active) toggleEditorActive(e.id);
                            addToast(`${e.fullName} approved and verified!`, 'success');
                          }
                        }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          e.verificationStatus === 'Verified'
                            ? 'bg-emerald-500 text-white shadow-2xs hover:bg-emerald-600'
                            : 'text-gray-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-gray-200 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-800'
                        }`}
                        title={e.verificationStatus === 'Verified' ? 'Approved (click to set Pending)' : 'Approve & Verify'}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      {/* Deactivate / Reject (Wrong / Cross) */}
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          if (e.active) {
                            toggleEditorActive(e.id);
                            setVerificationStatus(e.id, 'Rejected');
                            addToast(`${e.fullName} account deactivated`, 'info');
                          } else {
                            toggleEditorActive(e.id);
                            setVerificationStatus(e.id, 'Pending');
                            addToast(`${e.fullName} account reactivated`, 'success');
                          }
                        }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          !e.active || e.verificationStatus === 'Rejected'
                            ? 'bg-red-500 text-white shadow-2xs hover:bg-red-600'
                            : 'text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-gray-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-800'
                        }`}
                        title={e.active ? 'Deactivate account' : 'Reactivate account'}
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
