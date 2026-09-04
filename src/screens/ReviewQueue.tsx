import { useState, useMemo } from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  RotateCcw,
  Check,
  Search,
  ChevronDown,
  Download,
  LayoutGrid,
  ExternalLink,
  MessageSquare,
  MoreVertical,
  SlidersHorizontal,
  FolderKanban,
  Building2,
  AlertCircle,
  FileCode,
  Film,
  Send,
  Eye,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useApp } from '@/context';
import type { Subtask, Project, Editor } from '@/types';

interface ReviewQueueProps {
  onNavigate: (route: string) => void;
}

export function ReviewQueue({ onNavigate }: ReviewQueueProps) {
  const { projects, editors, updateSubtask, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'ready' | 'returned' | 'approved'>('all');
  const [projectFilter, setProjectFilter] = useState('All');
  const [editorFilter, setEditorFilter] = useState('All');
  const [taskTypeFilter, setTaskTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected rows for batch selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Send back revision feedback modal
  const [sendBackItem, setSendBackItem] = useState<{
    subtask: Subtask;
    project: Project;
    editor: Editor | undefined;
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Deliverable detail preview modal
  const [previewItem, setPreviewItem] = useState<{
    subtask: Subtask;
    project: Project;
    editor: Editor | undefined;
  } | null>(null);

  // Extract all review queue items
  const allSubmissions = useMemo(() => {
    const list: Array<{
      subtask: Subtask;
      project: Project;
      editor: Editor | undefined;
      thumbnailUrl: string;
      submittedDateLabel: string;
      submittedTimeLabel: string;
      commentsCount: number;
    }> = [];

    projects.forEach((p) => {
      p.subtasks.forEach((st) => {
        // Collect items that have been submitted or are in review/approved/returned
        if (st.status === 'Ready for Review' || st.status === 'Sent Back' || st.status === 'Approved' || (st.deliverablesQueue && st.deliverablesQueue.length > 0)) {
          const editor = editors.find((e) => st.assignedEditorIds.includes(e.id)) || editors[0];
          
          let thumbnail = '';
          if (p.title.includes('Aurora') && (st.taskType === 'Commercial Ads' || st.title.includes('Film'))) {
            thumbnail = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800';
          } else if (p.title.includes('Aurora') && (st.taskType === 'Reels Editing' || st.title.includes('Reel'))) {
            thumbnail = 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800';
          } else if (p.title.includes('Aurora') && st.title.includes('Thumbnail')) {
            thumbnail = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800';
          } else if (p.title.includes('TechFlow')) {
            thumbnail = 'ae-gradient';
          } else {
            thumbnail = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800';
          }

          let submittedDateLabel = 'Sep 6, 2026';
          let submittedTimeLabel = '10:24 AM';
          let commentsCount = 0;

          // Default mock queue if none attached yet
          let defaultQueue = st.deliverablesQueue && st.deliverablesQueue.length > 0 ? st.deliverablesQueue : [];
          let subtaskFeedback = st.feedback;

          if (defaultQueue.length === 0) {
            if (st.title.includes('Reel')) {
              submittedDateLabel = 'Sep 6, 2026';
              submittedTimeLabel = '10:24 AM';
              commentsCount = 2;
              subtaskFeedback = subtaskFeedback || 'Please adjust color grade on scene 2 to be warmer and lower the background music by -3dB during the voiceover.';
              defaultQueue = [
                {
                  id: `del-${st.id}-2`,
                  version: 2,
                  fileName: `${st.title.replace(/\s+/g, '_')}_v2_final_cut.mp4`,
                  fileSizeBytes: 154800000, // ~148 MB
                  fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                  notes: 'Updated color grading on scene 2 and adjusted the background audio sync for the intro hook as requested!',
                  submittedAt: '2026-09-06T10:24:00Z',
                  submittedByEditorId: editor?.id || 'e1',
                  status: 'In Review',
                },
                {
                  id: `del-${st.id}-1`,
                  version: 1,
                  fileName: `${st.title.replace(/\s+/g, '_')}_v1_rough.mp4`,
                  fileSizeBytes: 142000000,
                  fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                  notes: 'Initial assembly cut with beat sync transitions.',
                  submittedAt: '2026-09-04T15:30:00Z',
                  submittedByEditorId: editor?.id || 'e1',
                  status: 'Sent Back',
                  feedback: 'Please adjust color grade on scene 2 to be warmer to match our brand palette, and please lower the background music by -3dB during the voiceover.',
                  feedbackGivenAt: '2026-09-05T14:10:00Z',
                },
              ];
            } else if (st.title.includes('Thumbnail')) {
              submittedDateLabel = 'Sep 5, 2026';
              submittedTimeLabel = '4:15 PM';
              commentsCount = 2;
              defaultQueue = [
                {
                  id: `del-${st.id}-1`,
                  version: 1,
                  fileName: `${st.title.replace(/\s+/g, '_')}_Design_Package.psd`,
                  fileSizeBytes: 52400000, // ~50 MB
                  fileUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200',
                  notes: 'Includes 3 high-CTR cover variants with bold glowing typography and transparent cutouts.',
                  submittedAt: '2026-09-05T16:15:00Z',
                  submittedByEditorId: editor?.id || 'e2',
                  status: 'In Review',
                },
              ];
            } else {
              submittedDateLabel = 'Sep 5, 2026';
              submittedTimeLabel = '2:32 PM';
              commentsCount = 1;
              defaultQueue = [
                {
                  id: `del-${st.id}-1`,
                  version: 1,
                  fileName: `${st.title.replace(/\s+/g, '_')}_Master_Export.mp4`,
                  fileSizeBytes: 325000000, // ~310 MB
                  fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                  notes: 'Exported in ProRes 422 4K with dynamic kinetic motion titles and sound effects layered.',
                  submittedAt: '2026-09-05T14:32:00Z',
                  submittedByEditorId: editor?.id || 'e1',
                  status: 'In Review',
                },
              ];
            }
          }

          const currentSubtask = {
            ...st,
            feedback: subtaskFeedback,
            deliverablesQueue: defaultQueue,
          };

          list.push({
            subtask: currentSubtask,
            project: p,
            editor,
            thumbnailUrl: thumbnail,
            submittedDateLabel,
            submittedTimeLabel,
            commentsCount: defaultQueue.length + (currentSubtask.feedback ? 1 : 0),
          });
        }
      });
    });

    return list;
  }, [projects, editors]);

  // Tab counts
  const readyCount = allSubmissions.filter((i) => i.subtask.status === 'Ready for Review').length;
  const returnedCount = allSubmissions.filter((i) => i.subtask.status === 'Sent Back').length;
  const approvedCount = allSubmissions.filter((i) => i.subtask.status === 'Approved').length;

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter((item) => {
      if (activeTab === 'ready' && item.subtask.status !== 'Ready for Review') return false;
      if (activeTab === 'returned' && item.subtask.status !== 'Sent Back') return false;
      if (activeTab === 'approved' && item.subtask.status !== 'Approved') return false;

      if (projectFilter !== 'All' && item.project.id !== projectFilter) return false;
      if (editorFilter !== 'All' && item.editor?.id !== editorFilter) return false;
      if (taskTypeFilter !== 'All' && item.subtask.taskType !== taskTypeFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.subtask.title.toLowerCase().includes(q) ||
          item.project.title.toLowerCase().includes(q) ||
          item.editor?.fullName.toLowerCase().includes(q) ||
          item.subtask.taskType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allSubmissions, activeTab, projectFilter, editorFilter, taskTypeFilter, searchQuery]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredSubmissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubmissions.map((i) => i.subtask.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleApprove = (projectId: string, subtaskId: string, title: string) => {
    updateSubtask(projectId, subtaskId, { status: 'Approved' });
    addToast(`"${title}" approved successfully and marked ready for client handoff!`, 'success');
  };

  const handleSendBackConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendBackItem || !feedbackText.trim()) return;

    const currentQueue = sendBackItem.subtask.deliverablesQueue || [];
    const updatedQueue = currentQueue.map((item, idx) => {
      if (idx === 0) {
        return {
          ...item,
          status: 'Sent Back' as const,
          feedback: feedbackText.trim(),
          feedbackGivenAt: new Date().toISOString(),
        };
      }
      return item;
    });

    updateSubtask(sendBackItem.project.id, sendBackItem.subtask.id, {
      status: 'Sent Back',
      feedback: feedbackText.trim(),
      deliverablesQueue: updatedQueue,
    });

    addToast(`Revision feedback sent to ${sendBackItem.editor?.fullName || 'editor'}.`, 'info');
    setSendBackItem(null);
    setFeedbackText('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f6fb] px-4 sm:px-6 lg:px-10 py-7 font-sans flex flex-col justify-between space-y-7">
      <div className="max-w-[1400px] mx-auto w-full space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#4f46e5] flex items-center justify-center shrink-0 shadow-2xs">
              <Inbox className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Review Queue
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Review deliverables submitted by editors, provide feedback, or approve for client handoff.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => addToast('Exporting submissions report (CSV)...', 'info')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Export</span>
            </button>

            <button
              onClick={() => onNavigate('/admin/projects')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#ede9fe]/50 hover:bg-[#ede9fe] text-[#3b28cc] border border-[#3b28cc]/20 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              <FolderKanban className="w-4 h-4" />
              <span>View Kanban</span>
            </button>

            {/* Amber Status Banner */}
            <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-amber-900">{readyCount} Pending Review</p>
                <p className="text-[11px] text-amber-700 font-medium">Keep things moving!</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive KPI Metric Summary Cards (Clickable Tabs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: All Submissions */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white border-[#3b28cc] ring-2 ring-[#3b28cc]/20 shadow-md -translate-y-0.5'
                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                activeTab === 'all' ? 'bg-[#3b28cc] text-white shadow-xs' : 'bg-[#ede9fe] text-[#4f46e5]'
              }`}>
                <Inbox className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">All Submissions</p>
                <h3 className="text-2xl font-black text-gray-900 leading-snug">{allSubmissions.length}</h3>
                <p className="text-[11px] text-gray-400 font-normal">Total submissions</p>
              </div>
            </div>
            {/* Subtle Chart Bars */}
            <div className="flex items-end gap-1 opacity-25">
              <div className="w-1.5 h-4 bg-[#4f46e5] rounded-full" />
              <div className="w-1.5 h-7 bg-[#4f46e5] rounded-full" />
              <div className="w-1.5 h-10 bg-[#4f46e5] rounded-full" />
            </div>
          </button>

          {/* Card 2: Ready for Review */}
          <button
            type="button"
            onClick={() => setActiveTab('ready')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${
              activeTab === 'ready'
                ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-md -translate-y-0.5'
                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                activeTab === 'ready' ? 'bg-amber-500 text-white shadow-xs' : 'bg-amber-50 text-amber-500'
              }`}>
                <Clock className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Ready for Review</p>
                <h3 className="text-2xl font-black text-amber-600 leading-snug">{readyCount}</h3>
                <p className="text-[11px] text-amber-600 font-medium">Awaiting your feedback</p>
              </div>
            </div>
            {/* Subtle Chart Bars */}
            <div className="flex items-end gap-1 opacity-25">
              <div className="w-1.5 h-3 bg-amber-500 rounded-full" />
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <div className="w-1.5 h-9 bg-amber-500 rounded-full" />
            </div>
          </button>

          {/* Card 3: Approved */}
          <button
            type="button"
            onClick={() => setActiveTab('approved')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md -translate-y-0.5'
                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                activeTab === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-500'
              }`}>
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Approved</p>
                <h3 className="text-2xl font-black text-emerald-600 leading-snug">{approvedCount}</h3>
                <p className="text-[11px] text-emerald-600 font-medium">Sent to client</p>
              </div>
            </div>
            {/* Subtle Chart Bars */}
            <div className="flex items-end gap-1 opacity-25">
              <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
              <div className="w-1.5 h-10 bg-emerald-500 rounded-full" />
            </div>
          </button>

          {/* Card 4: Returned */}
          <button
            type="button"
            onClick={() => setActiveTab('returned')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${
              activeTab === 'returned'
                ? 'bg-white border-red-500 ring-2 ring-red-500/20 shadow-md -translate-y-0.5'
                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                activeTab === 'returned' ? 'bg-red-600 text-white shadow-xs' : 'bg-red-50 text-red-500'
              }`}>
                <RotateCcw className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Returned</p>
                <h3 className="text-2xl font-black text-red-600 leading-snug">{returnedCount}</h3>
                <p className="text-[11px] text-red-500 font-medium">Needs revision</p>
              </div>
            </div>
            {/* Subtle Chart Bars */}
            <div className="flex items-end gap-1 opacity-25">
              <div className="w-1.5 h-5 bg-red-500 rounded-full" />
              <div className="w-1.5 h-8 bg-red-500 rounded-full" />
              <div className="w-1.5 h-6 bg-red-500 rounded-full" />
            </div>
          </button>
        </div>

        {/* Filter Dropdowns & Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Projects Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px]">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-7 py-2 bg-gray-50/70 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#3b28cc] cursor-pointer transition-colors"
              >
                <option value="All">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Editors Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                value={editorFilter}
                onChange={(e) => setEditorFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-7 py-2 bg-gray-50/70 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#3b28cc] cursor-pointer transition-colors"
              >
                <option value="All">All Editors</option>
                {editors.map((e) => (
                  <option key={e.id} value={e.id}>{e.fullName}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Task Types Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                value={taskTypeFilter}
                onChange={(e) => setTaskTypeFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-7 py-2 bg-gray-50/70 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#3b28cc] cursor-pointer transition-colors"
              >
                <option value="All">All Types</option>
                <option value="Reels Editing">Reels</option>
                <option value="Commercial Ads">Commercial</option>
                <option value="YouTube Editing">YouTube</option>
                <option value="Motion Graphics">Motion</option>
                <option value="Thumbnail Design">Thumbnails</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Order Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full appearance-none pl-3 pr-7 py-2 bg-gray-50/70 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#3b28cc] cursor-pointer transition-colors"
              >
                <option value="newest">⇅ Newest first</option>
                <option value="oldest">⇅ Oldest first</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right Search Input */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50/70 hover:bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3b28cc] focus:bg-white placeholder:text-gray-400 text-gray-800 transition-colors"
            />
          </div>
        </div>

        {/* Submissions Data Table / Responsive List View */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          
          {/* Desktop & Tablet Table View (md and above) */}
          <div className="hidden md:block w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold text-gray-400 uppercase tracking-wider select-none">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filteredSubmissions.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-[#3b28cc] focus:ring-[#3b28cc] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-1.5 w-6 hidden xl:table-cell">#</th>
                  <th className="py-3 px-3">Editor</th>
                  <th className="py-3 px-3">Project / Campaign</th>
                  <th className="py-3 px-3">Task / Deliverable</th>
                  <th className="py-3 px-2.5 hidden lg:table-cell">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-2.5 hidden lg:table-cell">Submitted</th>
                  <th className="py-3 px-2 hidden xl:table-cell text-center">Comments</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-sans">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                      No submissions found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map(({ subtask, project, editor, thumbnailUrl, submittedDateLabel, submittedTimeLabel, commentsCount }, index) => {
                    const isChecked = selectedIds.includes(subtask.id);
                    const linkUrl = subtask.deliverableLink || (subtask.deliverablesQueue && subtask.deliverablesQueue[0]?.fileUrl) || 'https://drive.google.com/example';
                    
                    return (
                      <tr
                        key={subtask.id}
                        className={`hover:bg-indigo-50/20 transition-colors ${isChecked ? 'bg-indigo-50/30' : 'bg-white'}`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(subtask.id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#3b28cc] focus:ring-[#3b28cc] cursor-pointer"
                          />
                        </td>

                        {/* Row Index */}
                        <td className="py-3.5 px-1.5 text-gray-400 font-semibold hidden xl:table-cell">{index + 1}</td>

                        {/* Editor Info */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={editor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'}
                              alt={editor?.fullName || 'Editor'}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-2xs shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 leading-tight truncate">{editor?.fullName || 'Editor'}</p>
                              <p className="text-[10px] text-gray-400 truncate mt-0.5">{editor?.city || 'Remote'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Project / Campaign */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center border border-gray-100">
                              {thumbnailUrl === 'ae-gradient' ? (
                                <div className="w-full h-full bg-gradient-to-tr from-[#12002f] via-[#48129c] to-[#ec4899] flex items-center justify-center p-0.5">
                                  <span className="text-[#a78bfa] font-extrabold text-[10px]">Ae</span>
                                </div>
                              ) : (
                                <img
                                  src={thumbnailUrl}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate leading-tight">
                                {project.title.split('—')[0] || project.title}
                              </p>
                              <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                {project.title.split('—')[1] || project.clientName}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Task / Deliverable */}
                        <td className="py-3.5 px-3">
                          <div className="min-w-0 space-y-1">
                            <p className="font-bold text-gray-900 leading-tight truncate">{subtask.title}</p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                onClick={() => setPreviewItem({ subtask, project, editor })}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3b28cc] hover:text-[#2a1a9e] bg-[#ede9fe]/70 hover:bg-[#ede9fe] border border-[#3b28cc]/20 px-2 py-0.5 rounded-lg transition-colors cursor-pointer group"
                                title="Click to view file queue, versions, and editor comments"
                              >
                                <Eye className="w-3 h-3 text-[#3b28cc] group-hover:scale-110 transition-transform shrink-0" />
                                <span>View Queue ({(subtask.deliverablesQueue || []).length} {subtask.deliverablesQueue?.length === 1 ? 'file' : 'files'})</span>
                              </button>

                              {subtask.feedback && (
                                <button
                                  onClick={() => setPreviewItem({ subtask, project, editor })}
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 px-2 py-0.5 rounded-lg transition-colors"
                                  title={`Your Feedback: "${subtask.feedback}"`}
                                >
                                  <RotateCcw className="w-2.5 h-2.5 text-amber-700 shrink-0" />
                                  <span>Feedback Given</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Task Type */}
                        <td className="py-3.5 px-2.5 hidden lg:table-cell">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#ede9fe] text-[#4f46e5] whitespace-nowrap">
                            {subtask.taskType}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                              subtask.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : subtask.status === 'Ready for Review'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : subtask.status === 'Sent Back'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                subtask.status === 'Approved'
                                  ? 'bg-emerald-600'
                                  : subtask.status === 'Ready for Review'
                                  ? 'bg-amber-600'
                                  : subtask.status === 'Sent Back'
                                  ? 'bg-red-600'
                                  : 'bg-blue-600'
                              }`}
                            />
                            <span>{subtask.status}</span>
                          </span>
                        </td>

                        {/* Submitted On */}
                        <td className="py-3.5 px-2.5 hidden lg:table-cell">
                          <p className="font-semibold text-gray-700 whitespace-nowrap text-[11px]">{submittedDateLabel}</p>
                          <p className="text-[10px] text-gray-400 whitespace-nowrap">{submittedTimeLabel}</p>
                        </td>

                        {/* Comments */}
                        <td className="py-3.5 px-2 text-center hidden xl:table-cell">
                          <button
                            onClick={() => setPreviewItem({ subtask, project, editor })}
                            className="inline-flex items-center gap-1 text-gray-500 hover:text-[#3b28cc] font-semibold text-xs transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                            title="View comments, notes & feedback"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                            <span>{commentsCount}</span>
                          </button>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Submission Queue / Files */}
                            <button
                              onClick={() => setPreviewItem({ subtask, project, editor })}
                              className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#3b28cc] border border-[#3b28cc]/20 flex items-center justify-center transition-colors shadow-2xs"
                              title="View Deliverables Queue & Feedback"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Approve Button */}
                            <button
                              onClick={() => handleApprove(project.id, subtask.id, subtask.title)}
                              className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center transition-colors shadow-2xs"
                              title="Approve Deliverable"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>

                            {/* Return / Send Back Button */}
                            <button
                              onClick={() => {
                                setSendBackItem({ subtask, project, editor });
                                setFeedbackText(subtask.feedback || '');
                              }}
                              className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 flex items-center justify-center transition-colors shadow-2xs"
                              title="Request Revisions / Feedback"
                            >
                              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>

                            {/* More Options / Details */}
                            <button
                              onClick={() => setPreviewItem({ subtask, project, editor })}
                              className="w-7 h-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition-colors"
                              title="More Options / History"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (< md / mobile screens) */}
          <div className="block md:hidden divide-y divide-gray-100">
            {filteredSubmissions.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No submissions found matching the criteria.
              </div>
            ) : (
              filteredSubmissions.map(({ subtask, project, editor, thumbnailUrl, submittedDateLabel, submittedTimeLabel, commentsCount }) => {
                const isChecked = selectedIds.includes(subtask.id);

                return (
                  <div
                    key={subtask.id}
                    className={`p-4 space-y-3 transition-colors ${isChecked ? 'bg-indigo-50/30' : 'bg-white'}`}
                  >
                    {/* Header: Checkbox + Editor + Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(subtask.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#3b28cc] focus:ring-[#3b28cc] cursor-pointer"
                        />
                        <img
                          src={editor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'}
                          alt={editor?.fullName || 'Editor'}
                          className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900 leading-tight">{editor?.fullName || 'Editor'}</p>
                          <p className="text-[10px] text-gray-400">{editor?.city || 'Remote'}</p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          subtask.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : subtask.status === 'Ready for Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : subtask.status === 'Sent Back'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            subtask.status === 'Approved'
                              ? 'bg-emerald-600'
                              : subtask.status === 'Ready for Review'
                              ? 'bg-amber-600'
                              : subtask.status === 'Sent Back'
                              ? 'bg-red-600'
                              : 'bg-blue-600'
                          }`}
                        />
                        <span>{subtask.status}</span>
                      </span>
                    </div>

                    {/* Project & Task Details */}
                    <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center border border-gray-200">
                        {thumbnailUrl === 'ae-gradient' ? (
                          <div className="w-full h-full bg-gradient-to-tr from-[#12002f] via-[#48129c] to-[#ec4899] flex items-center justify-center p-0.5">
                            <span className="text-[#a78bfa] font-extrabold text-[10px]">Ae</span>
                          </div>
                        ) : (
                          <img
                            src={thumbnailUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-gray-900 truncate">{subtask.title}</p>
                          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">
                            {subtask.taskType}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{project.title}</p>
                        
                        <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                          <button
                            onClick={() => setPreviewItem({ subtask, project, editor })}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3b28cc] bg-white border border-gray-200 px-2 py-0.5 rounded-md hover:bg-gray-50"
                          >
                            <Eye className="w-3 h-3 text-[#3b28cc]" />
                            <span>View Queue ({(subtask.deliverablesQueue || []).length} files)</span>
                          </button>

                          {subtask.feedback && (
                            <button
                              onClick={() => setPreviewItem({ subtask, project, editor })}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md"
                            >
                              <RotateCcw className="w-2.5 h-2.5 text-amber-700" />
                              <span>Feedback Given</span>
                            </button>
                          )}

                          <span className="text-[10px] text-gray-400 shrink-0 ml-auto">
                            {submittedDateLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setPreviewItem({ subtask, project, editor })}
                        className="inline-flex items-center gap-1 text-gray-500 hover:text-[#3b28cc] font-semibold text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                        <span>{commentsCount} comments</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewItem({ subtask, project, editor })}
                          className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>View Files</span>
                        </button>

                        <button
                          onClick={() => {
                            setSendBackItem({ subtask, project, editor });
                            setFeedbackText(subtask.feedback || '');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Revise</span>
                        </button>

                        <button
                          onClick={() => handleApprove(project.id, subtask.id, subtask.title)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Table Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
            <p>
              Showing 1–{filteredSubmissions.length} of {allSubmissions.length} submissions
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-40"
                >
                  ‹
                </button>
                <button className="w-7 h-7 rounded-lg bg-[#3b28cc] text-white font-bold flex items-center justify-center shadow-2xs">
                  1
                </button>
                <button
                  disabled
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Back with Feedback Modal */}
      {sendBackItem && (
        <Modal
          open={!!sendBackItem}
          onClose={() => setSendBackItem(null)}
          title="Request Revision Feedback"
        >
          <form onSubmit={handleSendBackConfirm} className="space-y-4 pt-1 font-sans">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Deliverable</span>
                <p className="text-sm font-bold text-gray-900">{sendBackItem.subtask.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sendBackItem.project.title}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Editor</span>
                <p className="text-xs font-bold text-gray-900">{sendBackItem.editor?.fullName}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Revision Instructions & Feedback *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Specify the exact revisions needed (e.g., Color grading in scene 2 needs to be warmer, trim 3s from the intro, adjust voiceover audio levels)..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-3 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#3b28cc] placeholder:text-gray-400 text-gray-800 resize-none transition-colors"
              />
            </div>

            {/* Quick feedback suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-gray-400">Quick feedback templates:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Adjust color grade to match brand guidelines',
                  'Lower background audio by -3dB during voiceover',
                  'Fix pacing in scene 2 transitions',
                  'Export in 4K ProRes 422 format',
                ].map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => setFeedbackText(template)}
                    className="text-[10px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    + {template}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSendBackItem(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Send Revisions to Editor
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Deliverable History & Queue Details Modal */}
      {previewItem && (
        <Modal
          open={!!previewItem}
          onClose={() => setPreviewItem(null)}
          title="Submission File Queue & Feedback"
          className="max-w-2xl"
        >
          <div className="space-y-5 pt-1 font-sans">
            {/* Header info */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Deliverable Task</span>
                <h3 className="text-base font-bold text-gray-900">{previewItem.subtask.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{previewItem.project.title}</p>
              </div>
              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-gray-200/80 shadow-2xs">
                <img
                  src={previewItem.editor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'}
                  alt={previewItem.editor?.fullName}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">{previewItem.editor?.fullName}</p>
                  <p className="text-[10px] text-gray-400">{previewItem.editor?.city || 'Remote'} • {previewItem.subtask.taskType}</p>
                </div>
              </div>
            </div>

            {/* Active Feedback Banner at Top of Dialog */}
            {previewItem.subtask.feedback && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 text-xs flex items-start justify-between gap-3 shadow-2xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Active Admin Revision Instructions:</span>
                  </div>
                  <p className="text-amber-950 italic leading-relaxed pl-5 font-medium">
                    "{previewItem.subtask.feedback}"
                  </p>
                </div>
                <button
                  onClick={() => {
                    const item = previewItem;
                    setPreviewItem(null);
                    setSendBackItem(item);
                    setFeedbackText(item.subtask.feedback || '');
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg shrink-0 border border-amber-300/60 transition-colors"
                >
                  Edit Feedback
                </button>
              </div>
            )}

            {/* Submission Queue History Stack */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Submission Files Queue ({(previewItem.subtask.deliverablesQueue || []).length} {previewItem.subtask.deliverablesQueue?.length === 1 ? 'version' : 'versions'})</span>
                </div>
                <span className="text-[11px] text-gray-400">Latest cut at the top</span>
              </div>

              {(previewItem.subtask.deliverablesQueue && previewItem.subtask.deliverablesQueue.length > 0) ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {previewItem.subtask.deliverablesQueue.map((item, idx) => {
                    const fileSizeFormatted = (item.fileSizeBytes / (1024 * 1024)).toFixed(1);
                    return (
                      <div
                        key={item.id}
                        className="p-4 bg-white border border-gray-200/90 rounded-2xl space-y-3 shadow-2xs hover:border-[#3b28cc]/30 transition-colors"
                      >
                        {/* File Top Details */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#4f46e5] flex items-center justify-center shrink-0">
                              <Film className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#3b28cc] text-white">
                                  v{item.version} {idx === 0 ? '• Latest' : ''}
                                </span>
                                <p className="text-xs font-bold text-gray-900 truncate" title={item.fileName}>
                                  {item.fileName}
                                </p>
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {fileSizeFormatted} MB • Uploaded {new Date(item.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {item.status || 'In Review'}
                            </span>
                            <button
                              onClick={() => addToast(`Opening deliverable file: ${item.fileName}...`, 'info')}
                              className="p-1.5 text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-lg transition-colors"
                              title="Download / Open file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Editor Comments & Notes Box */}
                        {item.notes ? (
                          <div className="bg-indigo-50/50 border border-indigo-100/80 rounded-xl p-3 text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-[11px] mb-1">
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>Editor's Comments & Change Notes:</span>
                            </div>
                            <p className="text-gray-700 italic leading-relaxed pl-5">
                              "{item.notes}"
                            </p>
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-400 italic">No specific notes attached with this file submission.</p>
                        )}

                        {/* Admin Feedback for this specific review version */}
                        {item.feedback && (
                          <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 text-xs space-y-1">
                            <div className="flex items-center justify-between text-amber-900 font-bold text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <RotateCcw className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                <span>Admin Feedback for v{item.version}:</span>
                              </div>
                              {item.feedbackGivenAt && (
                                <span className="text-[10px] font-normal text-amber-700">
                                  {new Date(item.feedbackGivenAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                            <p className="text-amber-950 font-medium italic leading-relaxed pl-5">
                              "{item.feedback}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center text-xs text-gray-400">
                  No files submitted yet.
                </div>
              )}
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewItem(null)}
              >
                Close
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    const item = previewItem;
                    setPreviewItem(null);
                    setSendBackItem(item);
                    setFeedbackText(item.subtask.feedback || '');
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  {previewItem.subtask.feedback ? 'Update Feedback' : 'Request Revisions'}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                  onClick={() => {
                    handleApprove(previewItem.project.id, previewItem.subtask.id, previewItem.subtask.title);
                    setPreviewItem(null);
                  }}
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Approve Deliverable
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
