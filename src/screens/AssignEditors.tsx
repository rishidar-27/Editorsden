import { useState, useMemo } from 'react';
import { Card, Button, Input, Avatar, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import { ArrowLeft, Search, Plus, Check, Filter } from 'lucide-react';
import { allSkills } from '@/data';

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

  const assignedIds = subtask?.assignedEditorIds || [];

  const availableEditors = useMemo(() => {
    return editors.filter((e) => {
      if (e.verificationStatus !== 'Verified') return false;
      if (!e.active) return false;
      if (search && !e.fullName.toLowerCase().includes(search.toLowerCase())) return false;
      if (skillFilter && !e.skills.includes(skillFilter as never)) return false;
      if (availabilityFilter && e.availability !== availabilityFilter) return false;
      return true;
    });
  }, [editors, search, skillFilter, availabilityFilter]);

  const assignedEditors = assignedIds
    .map((id) => editors.find((e) => e.id === id))
    .filter(Boolean) as typeof editors;

  if (!project || !subtask) {
    return (
      <div className="pt-24 text-center">
        <p className="text-sm text-gray-600">Subtask not found.</p>
        <button onClick={() => onNavigate('/admin/projects')} className="text-sm text-violet-600 mt-2">Back to projects</button>
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

  return (
    <div className="max-w-[1000px] mx-auto px-4 lg:px-6 py-8">
      <button
        onClick={() => onNavigate(`/admin/projects/${projectId}`)}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to project
      </button>

      <div className="mb-6">
        <h1 className="text-h2 mb-1">Assign editors</h1>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-ink-900">{subtask.title}</span> · {subtask.taskType}
        </p>
      </div>

      <Card className="p-5 mb-6">
        <h2 className="text-h3 mb-3" style={{ fontSize: '15px' }}>Currently assigned ({assignedEditors.length})</h2>
        {assignedEditors.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">No editors assigned yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assignedEditors.map((e) => (
              <div key={e.id} className="inline-flex items-center gap-2 pl-1 pr-2 py-1 bg-gray-100 rounded-lg">
                <Avatar src={e.avatarUrl} alt={e.fullName} size="sm" className="w-6 h-6" />
                <span className="text-sm text-gray-800">{e.fullName}</span>
                <button onClick={() => unassign(e.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search editors by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <select
          className="px-3 py-2 text-sm bg-surface-0 border border-gray-200 rounded-lg focus-ring"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        >
          <option value="">All skills</option>
          {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="px-3 py-2 text-sm bg-surface-0 border border-gray-200 rounded-lg focus-ring"
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
        >
          <option value="">Any availability</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Weekends">Weekends</option>
        </select>
      </div>

      {availableEditors.length === 0 ? (
        <EmptyState
          icon={<Filter className="w-8 h-8" />}
          title="No editors found"
          description="Try adjusting your filters to find available editors."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableEditors.map((e) => {
            const isAssigned = assignedIds.includes(e.id);
            return (
              <Card key={e.id} className="p-4 flex items-center gap-3">
                <Avatar src={e.avatarUrl} alt={e.fullName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900 truncate">{e.fullName}</p>
                  <p className="text-xs text-gray-500">{e.city} · {e.availability}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {e.skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-1.5 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-700 rounded">{s}</span>
                    ))}
                  </div>
                </div>
                {isAssigned ? (
                  <Button variant="ghost" size="sm" onClick={() => unassign(e.id)} className="shrink-0">
                    <Check className="w-4 h-4 text-mint-600" />
                    Assigned
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => assign(e.id)} className="shrink-0">
                    <Plus className="w-4 h-4" />
                    Assign
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
