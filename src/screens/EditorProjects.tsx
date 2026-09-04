import { useState, useMemo, useRef } from 'react';
import { useApp } from '@/context';
import {
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  Send,
  Building2,
  AlertCircle,
  MoreVertical,
  Plus,
  SlidersHorizontal,
  FileText,
  RotateCcw,
  UploadCloud,
  File,
  Film,
  FileCode,
  Archive,
  X,
  Eye,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';
import { Modal, Button, EmptyState } from '@/components/ui';
import type { Subtask, Project, DeliverableSubmission } from '@/types';

export function EditorProjects() {
  const { getCurrentEditor, projects, updateSubtask, addToast, addEditorAsset } = useApp();
  const editor = getCurrentEditor();

  const [activeFilter, setActiveFilter] = useState<'All' | 'In Progress' | 'Assigned' | 'Ready for Review' | 'Sent Back' | 'Approved'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected task for submission queue modal
  const [activeSubtaskId, setActiveSubtaskId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // File upload state (File Upload ONLY)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNewTaskNotice, setShowNewTaskNotice] = useState(false);

  if (!editor) return null;

  const now = new Date();

  // Find active modal subtask live from state
  const modalData = useMemo(() => {
    if (!activeSubtaskId || !activeProjectId) return null;
    const project = projects.find((p) => p.id === activeProjectId);
    const subtask = project?.subtasks.find((st) => st.id === activeSubtaskId);
    if (!project || !subtask) return null;
    return { project, subtask };
  }, [projects, activeSubtaskId, activeProjectId]);

  // Extract all subtasks assigned to current editor
  const myAssignedItems = useMemo(() => {
    const items: Array<{
      subtask: Subtask;
      project: Project;
      thumbnailUrl: string;
      dueDateLabel: string;
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

          let dueDateLabel = 'Due Sep 8, 2026';
          if (st.deadline) {
            const d = new Date(st.deadline);
            if (!isNaN(d.getTime())) {
              dueDateLabel = `Due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            }
          }

          items.push({
            subtask: st,
            project: p,
            thumbnailUrl: thumbnail,
            dueDateLabel,
          });
        }
      });
    });

    return items;
  }, [projects, editor.id]);

  // Counts
  const inProgressCount = myAssignedItems.filter((i) => i.subtask.status === 'In Progress').length;
  const assignedCount = myAssignedItems.filter((i) => i.subtask.status === 'Assigned').length;
  const reviewCount = myAssignedItems.filter((i) => i.subtask.status === 'Ready for Review').length;
  const approvedCount = myAssignedItems.filter((i) => i.subtask.status === 'Approved').length;
  const revisionsCount = myAssignedItems.filter((i) => i.subtask.status === 'Sent Back').length;

  const filteredItems = useMemo(() => {
    return myAssignedItems.filter(({ subtask, project }) => {
      if (activeFilter === 'In Progress' && subtask.status !== 'In Progress') return false;
      if (activeFilter === 'Assigned' && subtask.status !== 'Assigned') return false;
      if (activeFilter === 'Ready for Review' && subtask.status !== 'Ready for Review') return false;
      if (activeFilter === 'Sent Back' && subtask.status !== 'Sent Back') return false;
      if (activeFilter === 'Approved' && subtask.status !== 'Approved') return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          subtask.title.toLowerCase().includes(q) ||
          project.title.toLowerCase().includes(q) ||
          subtask.taskType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [myAssignedItems, activeFilter, searchQuery]);

  const handleStartWorking = (projectId: string, subtaskId: string, title: string) => {
    updateSubtask(projectId, subtaskId, { status: 'In Progress' });
    addToast(`Started working on "${title}"!`, 'info');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'mkv', 'avi', 'webm'].includes(ext || '')) return <Film className="w-5 h-5 text-gray-900" />;
    if (['prproj', 'aep', 'drp', 'psd'].includes(ext || '')) return <FileCode className="w-5 h-5 text-zinc-700" />;
    if (['zip', 'rar', '7z', 'tar'].includes(ext || '')) return <Archive className="w-5 h-5 text-gray-600" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleUploadAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData || !selectedFile) {
      addToast('Please select a deliverable file to upload.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const currentQueue = modalData.subtask.deliverablesQueue || [];
      const newVersionNumber = currentQueue.length + 1;
      const submissionId = `sub-${modalData.subtask.id}-v${newVersionNumber}-${Date.now()}`;
      const fakeUrl = URL.createObjectURL(selectedFile);

      const newSubmission: DeliverableSubmission = {
        id: submissionId,
        version: newVersionNumber,
        fileName: selectedFile.name,
        fileSizeBytes: selectedFile.size,
        fileUrl: fakeUrl,
        mimeType: selectedFile.type || 'video/mp4',
        notes: submissionNotes.trim() || undefined,
        submittedAt: new Date().toISOString(),
        submittedByEditorId: editor.id,
        status: 'In Review',
      };

      const updatedQueue = [newSubmission, ...currentQueue];

      updateSubtask(modalData.project.id, modalData.subtask.id, {
        status: 'Ready for Review',
        deliverableLink: fakeUrl,
        deliverablesQueue: updatedQueue,
      });

      addEditorAsset({
        id: `asset-${Date.now()}`,
        editorId: editor.id,
        subtaskId: modalData.subtask.id,
        fileName: selectedFile.name,
        fileSizeBytes: selectedFile.size,
        mimeType: selectedFile.type || 'video/mp4',
        r2Key: `deliverables/${modalData.subtask.id}/${selectedFile.name}`,
        publicUrl: fakeUrl,
        createdAt: new Date().toISOString(),
      });

      addToast(`Deliverable v${newVersionNumber} (${selectedFile.name}) added on top of the queue!`, 'success');

      setIsUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setSubmissionNotes('');
    }, 900);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f6fb] px-4 sm:px-6 lg:px-10 py-7 font-sans flex flex-col justify-between space-y-8">
      <div className="max-w-[1400px] mx-auto w-full space-y-6">
        
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Projects & Tasks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your active editing assignments and submit deliverables for client review.
          </p>
        </div>

        {/* 4 KPI Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Tasks */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Total Tasks</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-snug">{myAssignedItems.length}</h3>
                <p className="text-[11px] text-gray-400 font-normal">Assigned across all projects</p>
              </div>
            </div>
            {/* Subtle Chart Bars */}
            <div className="flex items-end gap-1 opacity-25">
              <div className="w-1.5 h-4 bg-gray-900 rounded-full" />
              <div className="w-1.5 h-7 bg-gray-900 rounded-full" />
              <div className="w-1.5 h-10 bg-gray-900 rounded-full" />
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
                <Play className="w-6 h-6 stroke-[2] fill-gray-800/20" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">In Progress</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-snug">{inProgressCount}</h3>
                <p className="text-[11px] text-gray-400 font-normal">Currently editing</p>
              </div>
            </div>
            {/* Subtle Chart Bars */}
            <div className="flex items-end gap-1 opacity-25">
              <div className="w-1.5 h-5 bg-gray-700 rounded-full" />
              <div className="w-1.5 h-8 bg-gray-700 rounded-full" />
              <div className="w-1.5 h-6 bg-gray-700 rounded-full" />
            </div>
          </div>

          {/* Card 3: Awaiting Review */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Awaiting Review</p>
                <h3 className="text-2xl font-bold text-amber-600 leading-snug">{reviewCount}</h3>
                <p className="text-[11px] text-amber-600 font-medium">Submitted to admin</p>
              </div>
            </div>
            {/* Subtle Chart Bars */}
            <div className="flex items-end gap-1 opacity-25">
              <div className="w-1.5 h-3 bg-amber-500 rounded-full" />
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <div className="w-1.5 h-9 bg-amber-500 rounded-full" />
            </div>
          </div>

          {/* Card 4: Approved */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Approved</p>
                <h3 className="text-2xl font-bold text-emerald-600 leading-snug">{approvedCount}</h3>
                <p className="text-[11px] text-emerald-600 font-medium">Completed & accepted</p>
              </div>
            </div>
            {/* Subtle Chart Bars */}
            <div className="flex items-end gap-1 opacity-25">
              <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
              <div className="w-1.5 h-10 bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar Row */}
        <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'All', label: `All (${myAssignedItems.length})` },
              { id: 'In Progress', label: `In Progress (${inProgressCount})` },
              { id: 'Assigned', label: `Assigned (${assignedCount})` },
              { id: 'Ready for Review', label: `In Review (${reviewCount})` },
              { id: 'Sent Back', label: `Revisions (${revisionsCount})` },
              { id: 'Approved', label: `Approved (${approvedCount})` },
            ].map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                    active
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right: Search & Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search my tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 placeholder:text-gray-400 text-gray-800 transition-colors"
              />
            </div>

            <button
              onClick={() => {}}
              className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shrink-0"
              title="Filter Options"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3-Column Task Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-12 bg-white border border-gray-100 rounded-2xl text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <EmptyState
              icon={<FileText className="w-10 h-10 text-gray-400" />}
              title="No tasks match criteria"
              description="You have no assigned tasks matching the selected filter."
            />
            <button
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl inline-flex items-center gap-1.5 transition-colors"
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>View all tasks</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(({ subtask, project, thumbnailUrl, dueDateLabel }) => {
              let days = 0;
              let overdue = false;
              let deadlineLabel = 'Due soon';

              if (subtask.deadline) {
                const d = new Date(subtask.deadline);
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

              const submissionCount = subtask.deliverablesQueue?.length || 0;

              return (
                <div
                  key={subtask.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  {/* Top Thumbnail Image Banner */}
                  <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                    {thumbnailUrl === 'ae-gradient' ? (
                      <div className="w-full h-full bg-gradient-to-tr from-gray-900 via-zinc-800 to-black flex items-center justify-center relative p-2">
                        <div className="w-16 h-16 rounded-2xl bg-black/70 border border-zinc-700 flex items-center justify-center shadow-lg">
                          <span className="text-white font-extrabold text-2xl tracking-tighter">Ae</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={thumbnailUrl}
                        alt={subtask.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Top Left Badge on image */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-xs text-gray-900 font-semibold text-xs rounded-lg shadow-2xs">
                        {subtask.taskType}
                      </span>
                    </div>

                    {/* Top Right Badge on image */}
                    <div className="absolute top-3.5 right-3.5">
                      <span
                        className={`px-3 py-1 bg-white/95 backdrop-blur-xs font-semibold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 ${
                          overdue ? 'text-red-500' : 'text-gray-600'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{deadlineLabel}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900 text-base leading-snug">
                          {subtask.title}
                        </h3>
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{project.title}</span>
                      </div>

                      {/* Status Badge & Queue Tag */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            subtask.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : subtask.status === 'Ready for Review'
                              ? 'bg-amber-50 text-amber-700'
                              : subtask.status === 'In Progress'
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              subtask.status === 'Approved'
                                ? 'bg-emerald-600'
                                : subtask.status === 'Ready for Review'
                                ? 'bg-amber-600'
                                : subtask.status === 'In Progress'
                                ? 'bg-gray-900'
                                : 'bg-gray-500'
                            }`}
                          />
                          {subtask.status}
                        </span>

                        {submissionCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                            <Layers className="w-3 h-3 text-gray-700" />
                            {submissionCount} file{submissionCount !== 1 ? 's' : ''} in queue
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Action Row */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{dueDateLabel}</span>
                      </div>

                      <div>
                        {subtask.status === 'Assigned' ? (
                          <button
                            onClick={() => handleStartWorking(project.id, subtask.id, subtask.title)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Start Working</span>
                          </button>
                        ) : subtask.status === 'In Progress' || subtask.status === 'Sent Back' || subtask.status === 'Ready for Review' ? (
                          <button
                            onClick={() => {
                              setActiveProjectId(project.id);
                              setActiveSubtaskId(subtask.id);
                              setSelectedFile(null);
                              setSubmissionNotes('');
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Deliverable</span>
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <footer className="max-w-[1400px] mx-auto w-full pt-8 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
        <div>
          © 2026 <strong className="text-gray-600 font-semibold">Gogangs.</strong> All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-gray-600 transition-colors">Help</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
        </div>
      </footer>

      {/* Submit Deliverable File Upload Queue Modal */}
      {modalData && (
        <Modal
          open={!!modalData}
          onClose={() => {
            if (!isUploading) {
              setActiveProjectId(null);
              setActiveSubtaskId(null);
              setSelectedFile(null);
              setSubmissionNotes('');
            }
          }}
          title="Submit Deliverable for Review"
          className="max-w-2xl"
        >
          <div className="space-y-5 pt-1 font-sans">
            {/* Task Info Summary */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Assignment</span>
                <p className="text-sm font-bold text-gray-900">{modalData.subtask.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{modalData.project.title}</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-900 text-xs font-semibold shrink-0">
                {modalData.subtask.taskType}
              </span>
            </div>

            {/* Admin Feedback Section (Prominently displayed when feedback exists) */}
            {modalData.subtask.feedback && (
              <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-amber-900">
                      Admin Feedback & Revision Instructions
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed pl-8 font-medium">
                  {modalData.subtask.feedback}
                </p>
                <div className="pl-8 pt-0.5">
                  <span className="text-[11px] text-amber-700 font-medium">
                    💡 Please review and upload your updated cut below to queue the next revision.
                  </span>
                </div>
              </div>
            )}

            {/* Submission Queue Section (ALWAYS VISIBLE) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    Submission Queue & History ({(modalData.subtask.deliverablesQueue || []).length})
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {(modalData.subtask.deliverablesQueue || []).length > 0 ? 'Latest cut at the top' : 'Queue ready for v1'}
                </span>
              </div>

              {(modalData.subtask.deliverablesQueue && modalData.subtask.deliverablesQueue.length > 0) ? (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {modalData.subtask.deliverablesQueue.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white border border-gray-200 rounded-xl shadow-2xs flex items-center justify-between gap-3 hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          {getFileIcon(item.fileName)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gray-900 text-white">
                              v{item.version || (modalData.subtask.deliverablesQueue!.length - idx)}
                            </span>
                            <p className="text-xs font-bold text-gray-900 truncate">{item.fileName}</p>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {formatBytes(item.fileSizeBytes)} • {new Date(item.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {item.notes && (
                            <p className="text-[11px] text-gray-600 italic mt-0.5 line-clamp-1">"{item.notes}"</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {item.status || 'In Review'}
                        </span>
                        {item.fileUrl && (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Preview / Download file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center space-y-1">
                  <p className="text-xs font-semibold text-gray-700">No deliverable files in queue yet</p>
                  <p className="text-[11px] text-gray-400">Upload your file below to add <strong className="text-gray-900">version 1 (v1)</strong> to the review queue.</p>
                </div>
              )}
            </div>

            {/* Direct File Upload Form (File Upload ONLY) */}
            <form onSubmit={handleUploadAndSubmit} className="space-y-4 pt-2 border-t border-gray-100">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-gray-900" />
                    <span>Upload New File (Appends on Top of Queue) *</span>
                  </label>
                  <span className="text-[11px] text-gray-700 font-semibold bg-gray-100 px-2 py-0.5 rounded-md">
                    Direct File Upload Only
                  </span>
                </div>

                {/* Drag and Drop Zone */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".mp4,.mov,.mkv,.avi,.webm,.prproj,.aep,.drp,.zip,.rar,.7z,.wav,.mp3"
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-gray-900 bg-gray-100'
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/70 bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                      <UploadCloud className="w-6 h-6 stroke-[2]" />
                    </div>
                    <p className="text-xs font-bold text-gray-800">
                      Drag and drop your deliverable video/file here, or <span className="text-gray-900 font-bold underline">Browse</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Supports MP4, MOV, MKV, PRPROJ, AEP, DRP, ZIP up to 5GB
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-2xs shrink-0">
                        {getFileIcon(selectedFile.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{selectedFile.name}</p>
                        <p className="text-[11px] text-gray-500">
                          {formatBytes(selectedFile.size)} • Will queue as <strong>v{(modalData.subtask.deliverablesQueue?.length || 0) + 1}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => setSelectedFile(null)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                      title="Remove selected file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Version Changelog / Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Submission Notes / Changelog (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Color grade updated, audio normalized to -14 LUFS, fixed transition at 00:42..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  disabled={isUploading}
                  className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 placeholder:text-gray-400 text-gray-800 resize-none transition-colors"
                />
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-1.5 p-3 bg-gray-100 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gray-900 animate-spin" />
                      Uploading deliverable to queue...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => {
                    setActiveProjectId(null);
                    setActiveSubtaskId(null);
                    setSelectedFile(null);
                    setSubmissionNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!selectedFile || isUploading}
                  className="bg-gray-900 hover:bg-black text-white disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  {isUploading ? 'Uploading...' : `Upload & Queue Deliverable (v${(modalData.subtask.deliverablesQueue?.length || 0) + 1})`}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* New Project / Task Info Modal */}
      {showNewTaskNotice && (
        <Modal
          open={showNewTaskNotice}
          onClose={() => setShowNewTaskNotice(false)}
          title="Create New Project / Task"
        >
          <div className="space-y-4 pt-2 font-sans text-xs text-gray-600">
            <p>
              Client projects are automatically assigned by project managers according to your verified skills and availability.
            </p>
            <p>
              To request new assignments or update your bandwidth, please update your creator profile settings.
            </p>
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="bg-gray-900 hover:bg-black text-white"
                onClick={() => setShowNewTaskNotice(false)}
              >
                Got it
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
