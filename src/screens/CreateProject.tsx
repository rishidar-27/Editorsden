import { useState } from 'react';
import { Card, Button, Input, Select, EmptyState, Badge } from '@/components/ui';
import { useApp } from '@/context';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Layers,
  CheckCircle2,
  FolderPlus,
  Building2,
  Film,
  Video,
  Clock,
} from 'lucide-react';
import type { TaskType, Project } from '@/types';
import { allTaskTypes } from '@/data';

interface CreateProjectProps {
  onNavigate: (route: string) => void;
}

export function CreateProject({ onNavigate }: CreateProjectProps) {
  const { addProject, addToast } = useApp();
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [subtasks, setSubtasks] = useState<
    { id: string; title: string; taskType: TaskType; deadline: string }[]
  >([
    {
      id: `st-1`,
      title: 'Hero Brand Commercial (60s)',
      taskType: 'Commercial Ads',
      deadline: '2026-09-10',
    },
    {
      id: `st-2`,
      title: 'Instagram Reels & TikTok Cutdowns (4x)',
      taskType: 'Reels Editing',
      deadline: '2026-09-08',
    },
  ]);

  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      {
        id: `st-${Date.now()}`,
        title: '',
        taskType: 'Reels Editing' as TaskType,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      },
    ]);
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const updateSubtaskField = (
    id: string,
    field: 'title' | 'taskType' | 'deadline',
    value: string
  ) => {
    setSubtasks(subtasks.map((st) => (st.id === id ? { ...st, [field]: value } : st)));
  };

  // Quick Preset Templates
  const applyPreset = (preset: 'social' | 'youtube' | 'full') => {
    if (preset === 'social') {
      setTitle('Summer Social Media Campaign');
      setClientName('Brand Client');
      setSubtasks([
        { id: `st-${Date.now()}-1`, title: 'Viral Instagram Reels (5x)', taskType: 'Reels Editing', deadline: '2026-09-05' },
        { id: `st-${Date.now()}-2`, title: 'Thumbnail Graphic Package', taskType: 'Thumbnail Design', deadline: '2026-09-03' },
      ]);
    } else if (preset === 'youtube') {
      setTitle('YouTube Episodic Series — Season 1');
      setClientName('Creator Channel');
      setSubtasks([
        { id: `st-${Date.now()}-1`, title: 'Episode 1 & 2 Main Video Cut', taskType: 'YouTube Editing', deadline: '2026-09-12' },
        { id: `st-${Date.now()}-2`, title: 'Custom YouTube Thumbnails (2x)', taskType: 'Thumbnail Design', deadline: '2026-09-10' },
        { id: `st-${Date.now()}-3`, title: 'Shorts Teasers (3x)', taskType: 'Reels Editing', deadline: '2026-09-11' },
      ]);
    } else {
      setTitle('Global Brand Re-launch Campaign');
      setClientName('Enterprise Partner');
      setSubtasks([
        { id: `st-${Date.now()}-1`, title: 'Hero Cinematic Film (90s)', taskType: 'Commercial Ads', deadline: '2026-09-15' },
        { id: `st-${Date.now()}-2`, title: 'Color Grade & Audio Master', taskType: 'Color Grading', deadline: '2026-09-18' },
        { id: `st-${Date.now()}-3`, title: 'Motion Graphics Intro Package', taskType: 'Motion Graphics', deadline: '2026-09-14' },
        { id: `st-${Date.now()}-4`, title: 'Multi-platform Cutdowns (6x)', taskType: 'Reels Editing', deadline: '2026-09-16' },
      ]);
    }
    addToast('Template applied successfully!', 'info');
  };

  const handleCreate = () => {
    if (!title.trim() || !clientName.trim() || subtasks.length === 0) return;
    const projectId = `proj-${Date.now()}`;
    const project: Project = {
      id: projectId,
      title: title.trim(),
      clientName: clientName.trim(),
      createdAt: new Date().toISOString(),
      subtasks: subtasks.map((st) => ({
        id: st.id,
        projectId,
        title: st.title || 'Untitled subtask',
        taskType: st.taskType,
        deadline: new Date(st.deadline).toISOString(),
        assignedEditorIds: [],
        status: 'Assigned' as const,
      })),
    };
    addProject(project);
    addToast('New project created and ready for assignment!', 'success');
    onNavigate(`/admin/projects/${projectId}`);
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => onNavigate('/admin/projects')}
          className="inline-flex items-center gap-1.5 font-medium text-gray-600 hover:text-violet-700 transition-colors py-1 px-2.5 rounded-lg hover:bg-violet-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Projects
        </button>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-gray-900">New Campaign Project</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Create New Project
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Set up campaign deliverables, deadlines, and requirements for editors
          </p>
        </div>
      </div>

      {/* Quick Template Presets Bar */}
      <Card className="p-4 bg-violet-50/50 border border-violet-100 rounded-2xl shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
            <span className="text-xs font-bold text-violet-900">
              Quick Campaign Templates:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyPreset('social')}
              className="px-3 py-1.5 bg-white hover:bg-violet-100/60 border border-violet-200 text-violet-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Social Media Suite
            </button>
            <button
              type="button"
              onClick={() => applyPreset('youtube')}
              className="px-3 py-1.5 bg-white hover:bg-violet-100/60 border border-violet-200 text-violet-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              YouTube Video Series
            </button>
            <button
              type="button"
              onClick={() => applyPreset('full')}
              className="px-3 py-1.5 bg-white hover:bg-violet-100/60 border border-violet-200 text-violet-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Full Brand Campaign
            </button>
          </div>
        </div>
      </Card>

      {/* Project Meta Card */}
      <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Building2 className="w-4 h-4 text-violet-600" />
          Project Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aurora Skincare — Q4 Launch Campaign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Client / Organization Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aurora Cosmetics Inc."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 shadow-2xs"
            />
          </div>
        </div>
      </Card>

      {/* Subtasks Definition Card */}
      <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-600" />
            Deliverables & Subtasks ({subtasks.length})
          </h2>
          <Button variant="outline" size="sm" onClick={addSubtask} className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Deliverable
          </Button>
        </div>

        {subtasks.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-8 h-8 text-gray-400" />}
            title="No deliverables added"
            description="Add subtasks to define the specific video edits required."
            action={
              <Button variant="outline" size="sm" onClick={addSubtask}>
                <Plus className="w-4 h-4 mr-1" /> Add First Deliverable
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {subtasks.map((st, i) => (
              <div
                key={st.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 bg-gray-50/80 rounded-xl border border-gray-100"
              >
                <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Deliverable title (e.g. Hero Commercial Video)"
                    value={st.title}
                    onChange={(e) => updateSubtaskField(st.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 font-medium"
                  />
                </div>

                <div className="w-full sm:w-48">
                  <select
                    value={st.taskType}
                    onChange={(e) =>
                      updateSubtaskField(st.id, 'taskType', e.target.value as TaskType)
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 font-semibold text-gray-700"
                  >
                    {allTaskTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-40">
                  <input
                    type="date"
                    value={st.deadline}
                    onChange={(e) => updateSubtaskField(st.id, 'deadline', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 font-medium text-gray-700"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeSubtask(st.id)}
                  title="Remove deliverable"
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => onNavigate('/admin/projects')}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={!title.trim() || !clientName.trim() || subtasks.length === 0}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold"
        >
          <FolderPlus className="w-4 h-4 mr-1.5" />
          Create & Assign Team
        </Button>
      </div>
    </div>
  );
}
