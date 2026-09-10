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
  ShieldCheck,
} from 'lucide-react';
import type { TaskType, Project } from '@/types';
import { allTaskTypes } from '@/data';
import { generateUuid } from '@/lib/supabase';

interface CreateProjectProps {
  onNavigate: (route: string) => void;
}

export function CreateProject({ onNavigate }: CreateProjectProps) {
  const { addProject, addToast } = useApp();
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [subtasks, setSubtasks] = useState<
    { id: string; title: string; description?: string; taskType: TaskType; deadline: string }[]
  >([
    {
      id: generateUuid(),
      title: 'Hero Brand Commercial (60s)',
      description: 'Create high energy 60s cut with dynamic typography and sound design.',
      taskType: 'Commercial Ads',
      deadline: '2026-09-10',
    },
    {
      id: generateUuid(),
      title: 'Instagram Reels & TikTok Cutdowns (4x)',
      description: 'Vertical 9:16 cuts highlighting best moments with viral pacing.',
      taskType: 'Reels Editing',
      deadline: '2026-09-08',
    },
  ]);

  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      {
        id: generateUuid(),
        title: '',
        description: '',
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
    field: 'title' | 'description' | 'taskType' | 'deadline',
    value: string
  ) => {
    setSubtasks(subtasks.map((st) => (st.id === id ? { ...st, [field]: value } : st)));
  };

  // Quick Preset Templates
  const applyPreset = (preset: 'social' | 'youtube' | 'full' | 'podcast') => {
    if (preset === 'social') {
      setTitle('Summer Viral Social Media Campaign');
      setClientName('Aurora Skincare');
      setSubtasks([
        { id: generateUuid(), title: 'Viral Instagram Reels (5x Hook Variations)', taskType: 'Reels Editing', deadline: '2026-09-08' },
        { id: generateUuid(), title: 'High-CTR Thumbnail Graphic Package', taskType: 'Thumbnail Design', deadline: '2026-09-05' },
        { id: generateUuid(), title: 'TikTok Trending Audio Cutdown (3x)', taskType: 'Reels Editing', deadline: '2026-09-09' },
      ]);
    } else if (preset === 'youtube') {
      setTitle('YouTube Episodic Documentary Series — Season 1');
      setClientName('Creator Studios');
      setSubtasks([
        { id: generateUuid(), title: 'Episode 1 & 2 Main 4K Video Cut', taskType: 'YouTube Editing', deadline: '2026-09-14' },
        { id: generateUuid(), title: 'Custom YouTube Thumbnails (2x Variations)', taskType: 'Thumbnail Design', deadline: '2026-09-10' },
        { id: generateUuid(), title: 'YouTube Shorts Teaser Clips (4x)', taskType: 'Reels Editing', deadline: '2026-09-12' },
        { id: generateUuid(), title: 'Color Grade & Audio Normalization (-14 LUFS)', taskType: 'Color Grading', deadline: '2026-09-15' },
      ]);
    } else if (preset === 'podcast') {
      setTitle('Weekly Video Podcast & Multi-Platform Syndication');
      setClientName('FinTech Weekly');
      setSubtasks([
        { id: generateUuid(), title: 'Full 60-min Multi-Cam Switcher Edit', taskType: 'Podcast Editing', deadline: '2026-09-11' },
        { id: generateUuid(), title: 'Bite-sized Highlight Reels with Animated Subtitles (5x)', taskType: 'Reels Editing', deadline: '2026-09-09' },
        { id: generateUuid(), title: 'Episode Cover Art & YouTube Thumbnail', taskType: 'Thumbnail Design', deadline: '2026-09-08' },
      ]);
    } else {
      setTitle('Global Brand Re-launch & Broadcast Campaign');
      setClientName('Enterprise Partner Inc.');
      setSubtasks([
        { id: generateUuid(), title: 'Hero Cinematic Commercial Film (60s & 90s)', taskType: 'Commercial Ads', deadline: '2026-09-16' },
        { id: generateUuid(), title: 'DaVinci Resolve HDR Color Grade & 5.1 Mix', taskType: 'Color Grading', deadline: '2026-09-18' },
        { id: generateUuid(), title: '3D Motion Graphics Intro & Lower Thirds', taskType: 'Motion Graphics', deadline: '2026-09-14' },
        { id: generateUuid(), title: 'Multi-platform Paid Ad Cutdowns (6x)', taskType: 'Reels Editing', deadline: '2026-09-17' },
      ]);
    }
    addToast('Campaign template applied successfully!', 'info');
  };

  const handleCreate = () => {
    if (!title.trim() || !clientName.trim() || subtasks.length === 0) return;
    const projectId = generateUuid();
    const project: Project = {
      id: projectId,
      title: title.trim(),
      clientName: clientName.trim(),
      createdAt: new Date().toISOString(),
      subtasks: subtasks.map((st) => ({
        id: st.id,
        projectId,
        title: st.title || 'Untitled deliverable',
        description: st.description?.trim() || undefined,
        taskType: st.taskType,
        deadline: new Date(st.deadline).toISOString(),
        assignedEditorIds: [],
        status: 'Assigned' as const,
      })),
    };
    addProject(project);
    addToast(`"${title.trim()}" created successfully!`, 'success');
    onNavigate(`/admin/projects/${projectId}`);
  };

  return (
    <div className="max-w-[1060px] mx-auto px-4 lg:px-8 py-6 space-y-6 font-sans">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => onNavigate('/admin/projects')}
          className="inline-flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-gray-100"
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
            Create Campaign Project
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure campaign deliverables and editor deadlines
          </p>
        </div>
      </div>

      {/* Quick Template Presets Bar */}
      <Card className="p-4 bg-gray-50 border border-gray-200 rounded-2xl shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gray-800 shrink-0" />
            <span className="text-xs font-bold text-gray-900">
              1-Click Campaign Presets:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyPreset('social')}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Social Media Suite
            </button>
            <button
              type="button"
              onClick={() => applyPreset('youtube')}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              YouTube Video Series
            </button>
            <button
              type="button"
              onClick={() => applyPreset('podcast')}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Podcast & Clips
            </button>
            <button
              type="button"
              onClick={() => applyPreset('full')}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Enterprise Brand Film
            </button>
          </div>
        </div>
      </Card>

      {/* Project Meta Card */}
      <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Building2 className="w-4 h-4 text-gray-900" />
          Project Overview & Client Brief
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aurora Skincare — Q4 Nationwide Launch Campaign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 shadow-2xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Client / Enterprise Partner Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aurora Cosmetics Inc."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 shadow-2xs font-medium"
            />
          </div>
        </div>
      </Card>

      {/* Subtasks Definition Card */}
      <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-900" />
            <h2 className="text-base font-bold text-gray-900">
              Deliverables & Subtasks ({subtasks.length})
            </h2>
          </div>
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
                className="flex flex-col gap-2.5 p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-900 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>

                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Deliverable title (e.g. Hero Commercial 60s Cut)"
                      value={st.title}
                      onChange={(e) => updateSubtaskField(st.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 font-medium text-gray-900"
                    />
                  </div>

                  <div className="w-full sm:w-48">
                    <select
                      value={st.taskType}
                      onChange={(e) =>
                        updateSubtaskField(st.id, 'taskType', e.target.value as TaskType)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 font-semibold text-gray-700"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 font-medium text-gray-700"
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

                <div className="pl-0 sm:pl-9">
                  <input
                    type="text"
                    placeholder="Brief / Description for editor (optional: e.g. Keep intro punchy, use motion text overlays)"
                    value={st.description || ''}
                    onChange={(e) => updateSubtaskField(st.id, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 placeholder:text-gray-400 text-gray-700"
                  />
                </div>
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
          className="bg-gray-900 hover:bg-black text-white font-bold"
        >
          <FolderPlus className="w-4 h-4 mr-1.5" />
          Create Campaign & Assign Creators
        </Button>
      </div>
    </div>
  );
}

