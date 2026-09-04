import { useState, useMemo } from 'react';
import { Card, Button, Avatar, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import {
  ArrowLeft,
  Search,
  Plus,
  Check,
  Filter,
  Sparkles,
  ExternalLink,
  Clock,
  Briefcase,
  Star,
  Users,
  CheckCircle2,
  X,
  RotateCcw,
  Film,
  Building2,
  Zap,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { allSkills } from '@/data';
import type { Editor } from '@/types';

interface AssignEditorsProps {
  projectId: string;
  subtaskId: string;
  onNavigate: (route: string) => void;
}

export function AssignEditors({ projectId, subtaskId, onNavigate }: AssignEditorsProps) {
  const { projects, editors, assignEditors, addToast } = useApp();
  const project = projects.find((p) => p.id === projectId);
  const subtask = project?.subtasks.find((st) => st.id === subtaskId);

  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
  const [onlyBestMatches, setOnlyBestMatches] = useState(false);

  const assignedIds = subtask?.assignedEditorIds || [];

  // Calculate active tasks count for each editor across all projects
  const editorTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      p.subtasks.forEach((st) => {
        if (st.status !== 'Approved') {
          st.assignedEditorIds.forEach((edId) => {
            counts[edId] = (counts[edId] || 0) + 1;
          });
        }
      });
    });
    return counts;
  }, [projects]);

  const availableEditors = useMemo(() => {
    return editors.filter((e) => {
      if (e.verificationStatus !== 'Verified') return false;
      if (!e.active) return false;
      if (search && !e.fullName.toLowerCase().includes(search.toLowerCase()) && !e.city.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (onlyBestMatches && !e.skills.includes(subtask?.taskType as never)) {
        return false;
      }
      if (skillFilter && !e.skills.includes(skillFilter as never)) {
        return false;
      }
      if (availabilityFilter && e.availability !== availabilityFilter) {
        return false;
      }
      return true;
    });
  }, [editors, search, skillFilter, availabilityFilter, onlyBestMatches, subtask?.taskType]);

  // Sort editors: Assigned first, then Best Skill Matches, then others
  const sortedEditors = useMemo(() => {
    return [...availableEditors].sort((a, b) => {
      const aAssigned = assignedIds.includes(a.id);
      const bAssigned = assignedIds.includes(b.id);
      if (aAssigned && !bAssigned) return -1;
      if (!aAssigned && bAssigned) return 1;

      const aMatches = subtask ? a.skills.includes(subtask.taskType as never) : false;
      const bMatches = subtask ? b.skills.includes(subtask.taskType as never) : false;
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;

      return a.fullName.localeCompare(b.fullName);
    });
  }, [availableEditors, assignedIds, subtask]);

  const assignedEditors = assignedIds
    .map((id) => editors.find((e) => e.id === id))
    .filter(Boolean) as Editor[];

  if (!project || !subtask) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Subtask not found</h2>
        <p className="text-sm text-gray-500 mb-6">The subtask or project you are looking for could not be located.</p>
        <Button onClick={() => onNavigate('/admin/projects')} variant="primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to projects
        </Button>
      </div>
    );
  }

  const assign = (editorId: string) => {
    assignEditors(projectId, subtaskId, [...assignedIds, editorId]);
    const editor = editors.find((e) => e.id === editorId);
    addToast(`${editor?.fullName} assigned to "${subtask.title}"`, 'success');
  };

  const unassign = (editorId: string) => {
    assignEditors(projectId, subtaskId, assignedIds.filter((id) => id !== editorId));
    const editor = editors.find((e) => e.id === editorId);
    addToast(`${editor?.fullName} removed from "${subtask.title}"`, 'info');
  };

  const clearFilters = () => {
    setSearch('');
    setSkillFilter('');
    setAvailabilityFilter('');
    setOnlyBestMatches(false);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 space-y-6 font-sans">
      {/* Breadcrumb Navigation & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => onNavigate('/admin/projects')}
            className="font-medium text-gray-600 hover:text-violet-700 transition-colors py-1 px-2 rounded-lg hover:bg-violet-50"
          >
            Projects
          </button>
          <span className="text-gray-300">/</span>
          <button
            onClick={() => onNavigate(`/admin/projects/${projectId}`)}
            className="font-medium text-gray-600 hover:text-violet-700 transition-colors py-1 px-2 rounded-lg hover:bg-violet-50 truncate max-w-[200px]"
          >
            {project.title}
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-900 truncate">Assign Creators</span>
        </div>

        <button
          onClick={() => onNavigate(`/admin/projects/${projectId}`)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-all hover:shadow-sm"
        >
          <Check className="w-4 h-4" />
          <span>Done & Back to Campaign</span>
        </button>
      </div>

      {/* Subtask Context Banner */}
      <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-100 uppercase tracking-wider">
                {subtask.taskType}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                {project.clientName}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Cloudflare R2 Workspace Enabled
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              {subtask.title}
            </h1>

            <p className="text-xs text-gray-500">
              Campaign: <span className="font-semibold text-gray-700">{project.title}</span>
            </p>
          </div>

          {/* Assignment Status Pill */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl shrink-0">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">
                {assignedEditors.length} Creator{assignedEditors.length !== 1 ? 's' : ''} Assigned
              </div>
              <p className="text-[11px] text-gray-500">
                {assignedEditors.length > 0 ? 'Work assigned to deliverable queue' : 'Deliverable currently unassigned'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main 2-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Bar & Editor Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search and Filters Bar */}
          <Card className="p-4 bg-white border border-gray-100 rounded-xl shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search verified editors by name, software, or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white transition-colors text-gray-800"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 font-semibold text-gray-700"
                >
                  <option value="">All Skills</option>
                  {allSkills.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 font-semibold text-gray-700"
                >
                  <option value="">Any Availability</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Weekends">Weekends</option>
                </select>
              </div>
            </div>

            {/* Quick Match Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-50 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setOnlyBestMatches(!onlyBestMatches)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    onlyBestMatches
                      ? 'bg-violet-600 text-white shadow-2xs'
                      : 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Show Best Skill Matches ({subtask.taskType})</span>
                </button>

                {(search || skillFilter || availabilityFilter || onlyBestMatches) && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              <span className="text-gray-400 text-[11px] font-medium">
                Showing {sortedEditors.length} vetted creators
              </span>
            </div>
          </Card>

          {/* Editors List */}
          {sortedEditors.length === 0 ? (
            <Card className="p-8 bg-white border border-gray-100 rounded-xl text-center">
              <EmptyState
                icon={<Filter className="w-8 h-8 text-gray-400" />}
                title="No matching editors found"
                description="Try clearing your search query or selecting a different skill filter."
              />
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset all filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {sortedEditors.map((e) => {
                const isAssigned = assignedIds.includes(e.id);
                const isSkillMatch = e.skills.includes(subtask.taskType as never);
                const activeTasks = editorTaskCounts[e.id] || 0;
                const matchScore = isSkillMatch ? 98 : 84;

                return (
                  <Card
                    key={e.id}
                    className={`p-4 sm:p-5 bg-white border rounded-2xl shadow-2xs transition-all ${
                      isAssigned
                        ? 'border-violet-300 bg-violet-50/20 shadow-xs ring-1 ring-violet-200'
                        : 'border-gray-100 hover:border-violet-200 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      {/* Left: Avatar & Profile Info */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className="relative shrink-0 mt-0.5">
                          <Avatar src={e.avatarUrl} alt={e.fullName} size="lg" />
                          {isAssigned && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center ring-2 ring-white">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              onClick={() => onNavigate(`/admin/editor/${e.id}`)}
                              className="text-sm font-bold text-gray-900 hover:text-violet-600 cursor-pointer transition-colors"
                            >
                              {e.fullName}
                            </h3>

                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-extrabold bg-violet-50 text-violet-700 border border-violet-100">
                              <Sparkles className="w-3 h-3 text-violet-600" />
                              {matchScore}% AI Match
                            </span>

                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              5.0 ({e.experience}y exp)
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                            <span>{e.city}</span>
                            <span className="text-gray-300">•</span>
                            <span className="font-semibold text-gray-700">{e.availability}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-600 font-medium">
                              {activeTasks === 0 ? '🟢 Available now (0 tasks)' : `🟡 ${activeTasks} active task${activeTasks > 1 ? 's' : ''}`}
                            </span>
                          </p>

                          {/* Skills badges */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {e.skills.map((skill) => {
                              const isTaskSkill = skill === subtask.taskType;
                              return (
                                <span
                                  key={skill}
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                                    isTaskSkill
                                      ? 'bg-violet-100 text-violet-800 font-bold ring-1 ring-violet-300'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {skill}
                                </span>
                              );
                            })}
                          </div>

                          {/* Software stack preview */}
                          {e.editingSoftware && e.editingSoftware.length > 0 && (
                            <p className="text-[11px] text-gray-400 pt-0.5 flex items-center gap-1.5">
                              <Cpu className="w-3 h-3 text-gray-400" />
                              <span>Tools: {e.editingSoftware.join(', ')}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        {isAssigned ? (
                          <button
                            onClick={() => unassign(e.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-red-50 text-emerald-700 hover:text-red-700 border border-emerald-200 hover:border-red-200 text-xs font-bold rounded-xl transition-all group"
                          >
                            <Check className="w-4 h-4 group-hover:hidden text-emerald-600" />
                            <X className="w-4 h-4 hidden group-hover:inline text-red-600" />
                            <span className="group-hover:hidden">Assigned</span>
                            <span className="hidden group-hover:inline">Remove</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => assign(e.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-2xs hover:shadow-sm transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Assign Creator</span>
                          </button>
                        )}

                        <button
                          onClick={() => onNavigate(`/admin/editor/${e.id}`)}
                          className="text-[11px] text-gray-400 hover:text-violet-600 font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <span>View Studio Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Assignment Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          {/* Currently Assigned Card */}
          <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Assigned Team ({assignedEditors.length})
                </h3>
              </div>
              <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                {assignedEditors.length > 0 ? 'Active' : 'Empty'}
              </span>
            </div>

            {assignedEditors.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-gray-400">No creators currently assigned to this task.</p>
                <p className="text-[11px] text-gray-400">
                  Select creators from the list on the left to assign them.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {assignedEditors.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar src={e.avatarUrl} alt={e.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{e.fullName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{e.skills[0] || 'Editor'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => unassign(e.id)}
                      title="Remove editor"
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => onNavigate(`/admin/projects/${projectId}`)}
                className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all text-center flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Back to Campaign</span>
              </button>
            </div>
          </Card>

          {/* Subtask Brief & Requirement Details */}
          <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h4 className="font-bold text-gray-900">Deliverable Scope</h4>
              <span className="text-gray-400 text-[11px]">ID: {subtask.id}</span>
            </div>

            <div>
              <span className="text-gray-400 block font-medium mb-0.5">Required Format</span>
              <p className="font-semibold text-gray-900">{subtask.taskType}</p>
            </div>

            <div>
              <span className="text-gray-400 block font-medium mb-0.5">Client</span>
              <p className="font-semibold text-gray-900">{project.clientName}</p>
            </div>

            <div>
              <span className="text-gray-400 block font-medium mb-0.5">Target Status</span>
              <span className="inline-block font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px]">
                {subtask.status}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

