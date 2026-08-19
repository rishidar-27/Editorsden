import { useState } from 'react';
import { Card, Button, Input, Select, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import { ArrowLeft, Plus, Trash2, Calendar } from 'lucide-react';
import type { TaskType, Project } from '@/types';
import { allTaskTypes } from '@/data';

interface CreateProjectProps {
  onNavigate: (route: string) => void;
}

export function CreateProject({ onNavigate }: CreateProjectProps) {
  const { addProject, addToast } = useApp();
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; taskType: TaskType; deadline: string }[]>([]);

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

  const updateSubtask = (id: string, field: 'title' | 'taskType' | 'deadline', value: string) => {
    setSubtasks(subtasks.map((st) => st.id === id ? { ...st, [field]: value } : st));
  };

  const handleCreate = () => {
    if (!title || !clientName || subtasks.length === 0) return;
    const projectId = `proj-${Date.now()}`;
    const project: Project = {
      id: projectId,
      title,
      clientName,
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
    addToast('Project created successfully', 'success');
    onNavigate('/admin/projects');
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 lg:px-6 py-8">
      <button
        onClick={() => onNavigate('/admin/projects')}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </button>

      <div className="mb-6">
        <h1 className="text-h2 mb-1">Create project</h1>
        <p className="text-sm text-gray-600">Set up a new project and define its subtasks</p>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Project details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Project title" placeholder="e.g. Aurora Skincare — Q4 Launch" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Client name" placeholder="e.g. Aurora Cosmetics Inc." value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3" style={{ fontSize: '16px' }}>Subtasks</h2>
          <span className="text-xs text-gray-500">{subtasks.length} subtask{subtasks.length !== 1 ? 's' : ''}</span>
        </div>

        {subtasks.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-8 h-8" />}
            title="No subtasks added"
            description="Add subtasks to define what needs to be done in this project."
            action={<Button variant="outline" size="sm" onClick={addSubtask}><Plus className="w-4 h-4" /> Add subtask</Button>}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {subtasks.map((st, i) => (
              <div key={st.id} className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-050 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <Input placeholder="Subtask title" value={st.title} onChange={(e) => updateSubtask(st.id, 'title', e.target.value)} />
                </div>
                <div className="flex-1">
                  <Select value={st.taskType} onChange={(e) => updateSubtask(st.id, 'taskType', e.target.value)}>
                    {allTaskTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </div>
                <div className="flex-1">
                  <Input type="date" value={st.deadline} onChange={(e) => updateSubtask(st.id, 'deadline', e.target.value)} />
                </div>
                <button
                  onClick={() => removeSubtask(st.id)}
                  className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-050 transition-colors shrink-0 self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {subtasks.length > 0 && (
          <button
            onClick={addSubtask}
            className="mt-3 flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add subtask
          </button>
        )}
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onNavigate('/admin/projects')}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!title || !clientName || subtasks.length === 0}>
          Create project
        </Button>
      </div>
    </div>
  );
}
