import { useState } from 'react';
import { Card, Badge, AvatarStack, Avatar, Button, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import {
  ArrowLeft,
  Clock,
  UserPlus,
  Calendar,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  Users,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  Video,
  Film,
  FileText,
  Building2,
  X,
  Share2,
} from 'lucide-react';
import type { ProjectStatus, TaskType, Subtask, Editor } from '@/types';

interface ProjectDetailProps {
  projectId: string;
  onNavigate: (route: string) => void;
}

export function ProjectDetail({ projectId, onNavigate }: ProjectDetailProps) {
  const { projects, editors, updateSubtask, addToast } = useApp();
  const project = projects.find((p) => p.id === projectId);

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reviewModalSubtask, setReviewModalSubtask] = useState<Subtask | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Add Subtask Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>('Reels Editing');
  const [newDeadline, setNewDeadline] = useState('');
  const [newEditorId, setNewEditorId] = useState('');

  if (!project) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FolderKanban className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Project not found</h2>
        <p className="text-sm text-gray-500 mb-6">The project you are looking for does not exist or has been removed.</p>
        <Button onClick={() => onNavigate('/admin/projects')} variant="primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to projects
        </Button>
      </div>
    );
  }

  const now = new Date();

  // Helper for safe date parsing
  const formatCreatedDate = (dateStr?: string) => {
    if (!dateStr) return 'Aug 10, 2026';
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime())
      ? 'Aug 10, 2026'
      : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusVariant = (status: ProjectStatus): 'neutral' | 'info' | 'pending' | 'verified' | 'rejected' => {
    if (status === 'Approved') return 'verified';
    if (status === 'Ready for Review') return 'pending';
    if (status === 'In Progress') return 'info';
    if (status === 'Sent Back') return 'rejected';
    return 'neutral';
  };

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'Reels Editing':
        return <Film className="w-4 h-4 text-pink-600" />;
      case 'Commercial Ads':
        return <Sparkles className="w-4 h-4 text-violet-600" />;
      case 'YouTube Editing':
        return <Video className="w-4 h-4 text-red-600" />;
      case 'Motion Graphics':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case 'Thumbnail Design':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      default:
        return <Video className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTaskIconBg = (type: TaskType) => {
    switch (type) {
      case 'Reels Editing':
        return 'bg-pink-50 border-pink-100';
      case 'Commercial Ads':
        return 'bg-violet-50 border-violet-100';
      case 'YouTube Editing':
        return 'bg-red-50 border-red-100';
      case 'Motion Graphics':
        return 'bg-indigo-50 border-indigo-100';
      case 'Thumbnail Design':
        return 'bg-emerald-50 border-emerald-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  // Metrics calculations
  const totalSubtasks = project.subtasks.length;
  const approvedCount = project.subtasks.filter((s) => s.status === 'Approved').length;
  const reviewCount = project.subtasks.filter((s) => s.status === 'Ready for Review').length;
  const inProgressCount = project.subtasks.filter((s) => s.status === 'In Progress').length;
  const assignedCount = project.subtasks.filter((s) => s.status === 'Assigned').length;

  const progressPercent = totalSubtasks > 0 ? Math.round((approvedCount / totalSubtasks) * 100) : 0;

  // Distinct assigned editors across all subtasks in this project
  const allAssignedEditorIds = Array.from(new Set(project.subtasks.flatMap((st) => st.assignedEditorIds)));
  const assignedEditorsList = allAssignedEditorIds
    .map((id) => editors.find((e) => e.id === id))
    .filter(Boolean) as Editor[];

  // Filtering subtasks
  const filteredSubtasks = project.subtasks.filter((st) => {
    const matchesFilter = statusFilter === 'All' || st.status === statusFilter;
    const matchesSearch =
      st.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.taskType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSubtaskObj: Subtask = {
      id: `st-${Date.now()}`,
      projectId: project.id,
      title: newTitle.trim(),
      taskType: newTaskType,
      deadline: newDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignedEditorIds: newEditorId ? [newEditorId] : [],
      status: newEditorId ? 'Assigned' : 'Assigned',
    };

    project.subtasks.push(newSubtaskObj);
    addToast('Subtask created successfully!', 'success');
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDeadline('');
    setNewEditorId('');
  };

  const handleApproveSubtask = (stId: string) => {
    updateSubtask(project.id, stId, { status: 'Approved' });
    addToast('Subtask approved successfully!', 'success');
    if (reviewModalSubtask?.id === stId) setReviewModalSubtask(null);
  };

  const handleSendBackSubtask = (stId: string) => {
    updateSubtask(project.id, stId, { status: 'Sent Back', feedback: reviewFeedback });
    addToast('Subtask sent back with feedback.', 'info');
    setReviewModalSubtask(null);
    setReviewFeedback('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Project link copied to clipboard!', 'success');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => onNavigate('/admin/projects')}
            className="inline-flex items-center gap-1.5 font-medium text-gray-600 hover:text-violet-700 transition-colors py-1 px-2.5 rounded-lg hover:bg-violet-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Projects
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-900 truncate max-w-[280px] sm:max-w-md">
            {project.title}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-gray-500" />
            <span>Share</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-all hover:shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subtask</span>
          </button>
        </div>
      </div>

      {/* Project Banner Header Card */}
      <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-100">
                Campaign Project
              </span>
              <Badge variant={reviewCount > 0 ? 'pending' : progressPercent === 100 ? 'verified' : 'info'}>
                {reviewCount > 0 ? `${reviewCount} Awaiting Review` : progressPercent === 100 ? 'Completed' : 'In Progress'}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 pt-1">
              <span className="flex items-center gap-1.5 text-gray-700 font-semibold">
                <Building2 className="w-4 h-4 text-violet-500" />
                {project.clientName}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                Created on {formatCreatedDate(project.createdAt)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                {assignedEditorsList.length} Editors Assigned
              </span>
            </div>
          </div>

          {/* Quick Progress Indicator Block */}
          <div className="flex items-center gap-5 p-4 bg-gray-50/80 border border-gray-100 rounded-xl min-w-[280px]">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">Project Progress</span>
                <span className="font-extrabold text-violet-700 text-sm">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-violet-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500">
                {approvedCount} of {totalSubtasks} subtasks approved
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Stat Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-white border border-gray-100 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500">Total Subtasks</span>
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{totalSubtasks}</div>
          <span className="text-[11px] text-gray-400 font-medium">Across all media formats</span>
        </Card>

        <Card className="p-4 bg-white border border-gray-100 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500">In Progress</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600">{inProgressCount}</div>
          <span className="text-[11px] text-gray-400 font-medium">Currently being edited</span>
        </Card>

        <Card className="p-4 bg-white border border-gray-100 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500">Needs Review</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{reviewCount}</div>
          <span className="text-[11px] text-amber-600 font-medium">Submissions waiting</span>
        </Card>

        <Card className="p-4 bg-white border border-gray-100 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500">Approved</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{approvedCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for delivery</span>
        </Card>
      </div>

      {/* Main Content: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Subtasks List & Filters (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Subtask Controls Header */}
          <Card className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Ready for Review', 'In Progress', 'Assigned', 'Approved'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      statusFilter === tab
                        ? 'bg-violet-600 text-white shadow-2xs'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                    {tab === 'All' && ` (${totalSubtasks})`}
                    {tab === 'Ready for Review' && reviewCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-gray-900 rounded-full text-[10px] font-bold">
                        {reviewCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Quick Search */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter subtasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </Card>

          {/* Subtasks List */}
          {filteredSubtasks.length === 0 ? (
            <Card className="p-8 bg-white border border-gray-100 rounded-xl text-center">
              <EmptyState
                icon={<Calendar className="w-8 h-8 text-gray-400" />}
                title="No subtasks match criteria"
                description="Try selecting a different status filter or clear your search."
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredSubtasks.map((st) => {
                const assignedEditors = st.assignedEditorIds
                  .map((id) => editors.find((e) => e.id === id))
                  .filter(Boolean) as (typeof editors)[0][];

                let days = 0;
                let overdue = false;
                let urgent = false;
                let deadlineLabel = 'No date';

                if (st.deadline) {
                  const deadlineDate = new Date(st.deadline);
                  if (!isNaN(deadlineDate.getTime())) {
                    days = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    overdue = days < 0;
                    urgent = days <= 3 && days >= 0;
                    deadlineLabel = overdue
                      ? `${Math.abs(days)}d overdue`
                      : days === 0
                      ? 'Due today'
                      : `${days}d left`;
                  }
                }

                return (
                  <Card
                    key={st.id}
                    className="p-4 sm:p-5 bg-white border border-gray-100 rounded-xl shadow-2xs hover:border-gray-200 hover:shadow-xs transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      {/* Left: Task Identity */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getTaskIconBg(
                            st.taskType
                          )}`}
                        >
                          {getTaskIcon(st.taskType)}
                        </div>

                        <div className="min-w-0 space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900 tracking-tight truncate">
                              {st.title}
                            </h3>
                            <Badge variant={statusVariant(st.status)}>{st.status}</Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">
                              {st.taskType}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                                overdue
                                  ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded-md'
                                  : urgent
                                  ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md'
                                  : 'text-gray-500'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              {deadlineLabel}
                            </span>

                            {st.deliverableLink && (
                              <a
                                href={st.deliverableLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 font-semibold hover:underline text-[11px]"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View Deliverable
                              </a>
                            )}
                          </div>

                          {/* Feedback / note snippet if present */}
                          {st.feedback && (
                            <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-lg text-xs text-amber-800 mt-2">
                              <span className="font-bold">Feedback:</span> {st.feedback}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Assigned Editors & Actions */}
                      <div className="flex flex-wrap sm:flex-col items-end justify-between sm:justify-start gap-3 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        {/* Editor Avatars */}
                        <div className="flex items-center gap-2">
                          {assignedEditors.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <AvatarStack editors={assignedEditors} />
                              <div className="text-right">
                                <p className="text-xs font-semibold text-gray-900 leading-tight">
                                  {assignedEditors.length === 1
                                    ? assignedEditors[0].fullName
                                    : `${assignedEditors.length} assigned`}
                                </p>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {assignedEditors[0].skills[0] || 'Editor'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-gray-400 italic bg-gray-50 px-2.5 py-1 rounded-md">
                              Unassigned
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {st.status === 'Ready for Review' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                setReviewModalSubtask(st);
                                setReviewFeedback('');
                              }}
                              className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Review
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onNavigate(`/admin/projects/${project.id}/subtasks/${st.id}/assign`)
                            }
                            className="text-xs"
                          >
                            <UserPlus className="w-3.5 h-3.5 mr-1" />
                            {assignedEditors.length > 0 ? 'Manage' : 'Assign'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Project Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Project Details Card */}
          <Card className="p-5 bg-white border border-gray-100 rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Project Overview
              </h3>
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                ID: {project.id}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium mb-0.5">Client</span>
                <p className="font-bold text-gray-900 text-sm">{project.clientName}</p>
              </div>

              <div>
                <span className="text-gray-400 block font-medium mb-0.5">Campaign Objective</span>
                <p className="text-gray-600 leading-relaxed">
                  Full multi-channel video content suite for nationwide brand launch across YouTube, Instagram Reels, and TikTok.
                </p>
              </div>

              <div>
                <span className="text-gray-400 block font-medium mb-0.5">Shared Asset Drive</span>
                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 font-semibold hover:underline"
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  drive.google.com/campaign-assets
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>

          {/* Assigned Team Card */}
          <Card className="p-5 bg-white border border-gray-100 rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Assigned Team ({assignedEditorsList.length})
              </h3>
            </div>

            {assignedEditorsList.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2 text-center">
                No editors assigned to any subtask yet.
              </p>
            ) : (
              <div className="space-y-3">
                {assignedEditorsList.map((ed) => {
                  const tasksForEditor = project.subtasks.filter((st) =>
                    st.assignedEditorIds.includes(ed.id)
                  );
                  return (
                    <div
                      key={ed.id}
                      onClick={() => onNavigate(`/admin/editor/${ed.id}`)}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar src={ed.avatarUrl} alt={ed.fullName} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{ed.fullName}</p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {ed.skills.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full shrink-0">
                        {tasksForEditor.length} tasks
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Quick Review Queue Summary Card */}
          {reviewCount > 0 && (
            <Card className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-900">
                    {reviewCount} Subtask{reviewCount > 1 ? 's' : ''} Ready for Review
                  </h4>
                  <p className="text-[11px] text-amber-700">
                    Editors have submitted their deliverables and are awaiting admin approval.
                  </p>
                  <button
                    onClick={() => setStatusFilter('Ready for Review')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline pt-1"
                  >
                    Review submissions now →
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Add Subtask Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Add New Subtask</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubtask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subtask Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. YouTube Video Edit (10 mins)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Task Category / Skill</label>
                <select
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value as TaskType)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500"
                >
                  <option value="Reels Editing">Reels Editing</option>
                  <option value="YouTube Editing">YouTube Editing</option>
                  <option value="Commercial Ads">Commercial Ads</option>
                  <option value="Motion Graphics">Motion Graphics</option>
                  <option value="Podcast Editing">Podcast Editing</option>
                  <option value="Thumbnail Design">Thumbnail Design</option>
                  <option value="Color Grading">Color Grading</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assign Editor (Optional)</label>
                <select
                  value={newEditorId}
                  onChange={(e) => setNewEditorId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500"
                >
                  <option value="">-- Unassigned --</option>
                  {editors.map((ed) => (
                    <option key={ed.id} value={ed.id}>
                      {ed.fullName} ({ed.skills.slice(0, 2).join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Subtask
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalSubtask && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Review Deliverable</h3>
              </div>
              <button
                onClick={() => setReviewModalSubtask(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Subtask</span>
                <p className="text-sm font-bold text-gray-900">{reviewModalSubtask.title}</p>
              </div>

              {reviewModalSubtask.deliverableLink && (
                <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-xl">
                  <span className="text-xs font-bold text-violet-900 block mb-1">
                    Submitted Deliverable Link:
                  </span>
                  <a
                    href={reviewModalSubtask.deliverableLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-violet-700 hover:underline flex items-center gap-1.5 break-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    {reviewModalSubtask.deliverableLink}
                  </a>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Feedback (Required if sending back for revisions)
                </label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="e.g. Great edit! Please adjust the background music volume at 0:45..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleSendBackSubtask(reviewModalSubtask.id)}
              >
                Send Back for Revisions
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReviewModalSubtask(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => handleApproveSubtask(reviewModalSubtask.id)}
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Approve Deliverable
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
