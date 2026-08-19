import { Card, Badge, AvatarStack, Button, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import { Plus, FolderKanban, ChevronRight } from 'lucide-react';
import type { ProjectStatus } from '@/types';

interface ProjectsOverviewProps {
  onNavigate: (route: string) => void;
}

export function ProjectsOverview({ onNavigate }: ProjectsOverviewProps) {
  const { projects, editors } = useApp();
  const now = new Date();

  const statusVariant = (status: ProjectStatus): 'neutral' | 'info' | 'pending' | 'verified' | 'rejected' => {
    if (status === 'Approved') return 'verified';
    if (status === 'Ready for Review') return 'pending';
    if (status === 'In Progress') return 'info';
    if (status === 'Sent Back') return 'rejected';
    return 'neutral';
  };

  const getProjectDeadlineStatus = (subtasks: { deadline: string; status: ProjectStatus }[]) => {
    const active = subtasks.filter((st) => st.status !== 'Approved');
    if (active.length === 0) return { label: 'Completed', variant: 'verified' as const };
    const nearest = active.reduce((earliest, st) =>
      new Date(st.deadline).getTime() < new Date(earliest.deadline).getTime() ? st : earliest
    );
    const days = Math.ceil((new Date(nearest.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: `${Math.abs(days)}d overdue`, variant: 'overdue' as const };
    if (days <= 5) return { label: `${days}d to deadline`, variant: 'urgent' as const };
    return { label: `${days}d to deadline`, variant: 'neutral' as const };
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 mb-1">Projects</h1>
          <p className="text-sm text-gray-600">Manage all projects and campaigns</p>
        </div>
        <Button size="sm" onClick={() => onNavigate('/admin/projects/new')}>
          <Plus className="w-4 h-4" />
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-10 h-10" />}
          title="No projects yet"
          description="Create your first project to start assigning tasks to editors."
          action={<Button onClick={() => onNavigate('/admin/projects/new')}><Plus className="w-4 h-4" /> New project</Button>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => {
            const assignedEditors = Array.from(
              new Set(project.subtasks.flatMap((st) => st.assignedEditorIds))
            ).map((id) => editors.find((e) => e.id === id)).filter(Boolean) as { id: string; fullName: string; avatarUrl: string }[];
            const deadlineStatus = getProjectDeadlineStatus(project.subtasks);
            const completed = project.subtasks.filter((st) => st.status === 'Approved').length;

            return (
              <Card key={project.id} hover onClick={() => onNavigate(`/admin/projects/${project.id}`)} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-ink-900 mb-1">{project.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{project.clientName}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-gray-600">{project.subtasks.length} subtasks</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-600">{completed}/{project.subtasks.length} approved</span>
                      <span className="text-xs text-gray-300">·</span>
                      <Badge variant={deadlineStatus.variant}>{deadlineStatus.label}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {assignedEditors.length > 0 && <AvatarStack editors={assignedEditors} />}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                  {project.subtasks.slice(0, 4).map((st) => (
                    <div key={st.id} className="flex items-center gap-2 px-2.5 py-1 bg-gray-050 rounded-md">
                      <span className="text-xs text-gray-600">{st.title}</span>
                      <Badge variant={statusVariant(st.status)}>{st.status}</Badge>
                    </div>
                  ))}
                  {project.subtasks.length > 4 && (
                    <span className="text-xs text-gray-500 px-2 py-1">+{project.subtasks.length - 4} more</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
