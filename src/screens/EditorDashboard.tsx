import { useMemo } from 'react';
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  MoreVertical,
  MapPin,
  Edit2,
  FolderKanban,
  ArrowRight,
  User as UserIcon,
} from 'lucide-react';
import { useApp } from '@/context';

interface EditorDashboardProps {
  onNavigate: (route: string) => void;
}

export function EditorDashboard({ onNavigate }: EditorDashboardProps) {
  const { getCurrentEditor, projects } = useApp();
  const editor = getCurrentEditor();

  const firstName = editor?.fullName ? editor.fullName.split(' ')[0] : 'Marcus';
  const now = new Date();

  // Extract all subtasks assigned to current editor
  const myAssignedTasks = useMemo(() => {
    if (!editor) return [];
    const list: Array<{
      subtaskId: string;
      title: string;
      taskType: string;
      deadline: string;
      status: string;
      projectId: string;
      projectTitle: string;
      clientName: string;
      deliverableLink?: string;
      thumbnailUrl?: string;
    }> = [];

    projects.forEach((p) => {
      p.subtasks.forEach((st) => {
        if (st.assignedEditorIds.includes(editor.id)) {
          let thumbnail = '';
          if (st.taskType === 'Commercial Ads' || st.title.toLowerCase().includes('brand') || st.title.toLowerCase().includes('skincare')) {
            thumbnail = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800';
          } else if (st.taskType === 'YouTube Editing' || st.title.toLowerCase().includes('tutorial')) {
            thumbnail = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800';
          } else if (st.taskType === 'Motion Graphics' || st.title.toLowerCase().includes('motion')) {
            thumbnail = 'ae-gradient';
          } else {
            thumbnail = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800';
          }

          list.push({
            subtaskId: st.id,
            title: st.title,
            taskType: st.taskType,
            deadline: st.deadline,
            status: st.status,
            projectId: p.id,
            projectTitle: p.title,
            clientName: p.clientName,
            deliverableLink: st.deliverableLink,
            thumbnailUrl: thumbnail,
          });
        }
      });
    });

    return list;
  }, [projects, editor]);

  const activeCount = myAssignedTasks.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').length || 3;
  const inReviewCount = myAssignedTasks.filter((t) => t.status === 'Ready for Review').length;
  const completedCount = myAssignedTasks.filter((t) => t.status === 'Approved').length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f6fb] px-4 sm:px-6 lg:px-10 py-7 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Welcome back, {firstName} <span className="text-2xl select-none">👋</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              You have <span className="font-bold text-gray-800">{activeCount} active tasks</span> currently assigned to you.
            </p>
          </div>

          <div className="flex flex-col sm:items-end items-start gap-1">
            <button
              onClick={() => onNavigate('/editor/projects')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all hover:shadow-sm"
            >
              <FolderKanban className="w-4 h-4" />
              <span>View All Tasks</span>
            </button>
            <span className="text-[11px] text-gray-400 font-normal">
              Stay on top of your work and deadlines.
            </span>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Status */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400">Status</p>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {editor?.verificationStatus || 'Verified'}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium">Eligible for assignments</p>
            </div>
          </div>

          {/* Card 2: Active Tasks */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400">Active Tasks</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-snug">{activeCount}</h3>
              <p className="text-[11px] text-gray-400 font-medium">In progress or assigned</p>
            </div>
          </div>

          {/* Card 3: In Review */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400">In Review</p>
              <h3 className="text-2xl font-bold text-amber-600 leading-snug">{inReviewCount}</h3>
              <p className="text-[11px] text-amber-600 font-medium">Submitted deliverables</p>
            </div>
          </div>

          {/* Card 4: Approved */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400">Approved</p>
              <h3 className="text-2xl font-bold text-emerald-600 leading-snug">{completedCount}</h3>
              <p className="text-[11px] text-emerald-600 font-medium">Delivered to clients</p>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Assigned Deliverables & Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Current Assigned Deliverables */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight">
                    Current Assigned Deliverables
                  </h3>
                  <p className="text-xs text-gray-400">Tasks assigned to you by project managers</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/editor/projects')}
                className="text-xs font-bold text-gray-900 hover:text-black flex items-center gap-1 transition-colors"
              >
                <span>View all tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Deliverables List */}
            <div className="space-y-3 pt-2">
              {myAssignedTasks.map((t) => {
                let days = 0;
                let overdue = false;
                let deadlineLabel = 'Due soon';

                if (t.deadline) {
                  const d = new Date(t.deadline);
                  if (!isNaN(d.getTime())) {
                    days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    overdue = days < 0;
                    deadlineLabel = overdue
                      ? `${Math.abs(days)}d overdue`
                      : days === 0
                      ? 'Due today'
                      : `${days}d left`;
                  }
                }

                return (
                  <div
                    key={t.subtaskId}
                    className="p-3.5 sm:p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    {/* Left: Thumbnail + Details */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Thumbnail */}
                      <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                        {t.thumbnailUrl === 'ae-gradient' ? (
                          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-zinc-800 to-black flex items-center justify-center relative p-1.5">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-zinc-700 flex items-center justify-center shadow-inner">
                              <span className="text-zinc-200 font-extrabold text-sm tracking-tighter">Ae</span>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={t.thumbnailUrl}
                            alt={t.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {t.title}
                          </h4>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                            {t.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 font-medium truncate">
                          {t.projectTitle}
                        </p>

                        <div className="flex items-center gap-2.5 text-xs pt-0.5">
                          <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-medium">
                            {t.taskType}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-[11px] font-medium ${
                              overdue ? 'text-red-500 font-semibold' : 'text-gray-400'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {deadlineLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onNavigate('/editor/projects')}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
                      >
                        <span>Manage Task</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>

                      <button
                        onClick={() => onNavigate('/editor/projects')}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: My Creator Profile */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-900 stroke-[2]" />
                <h3 className="font-bold text-gray-900 text-base">My Creator Profile</h3>
              </div>
              <button
                onClick={() => onNavigate('/editor/profile')}
                className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-3.5">
              <img
                src={editor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'}
                alt="Marcus Chen"
                className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-2xs"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-base leading-snug">
                  {editor?.fullName || 'Marcus Chen'}
                </h4>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span>{editor?.city || 'San Francisco, CA'}</span>
                </p>
              </div>
            </div>

            {/* Editing Skills */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-gray-400 block">Editing Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {(editor?.skills || ['Reels Editing', 'YouTube Editing', 'Motion Graphics', 'Color Grading']).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Software Stack */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-400 block">Software Stack</span>
              <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                {(editor?.editingSoftware || ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve']).join(', ')}
              </p>
            </div>

            {/* Manage Portfolio Button */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/editor/portfolio')}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Manage Public Portfolio</span>
                <span className="text-sm leading-none">↗</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
