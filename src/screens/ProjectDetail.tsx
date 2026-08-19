import { Card, Badge, AvatarStack, Button, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import { ArrowLeft, Clock, UserPlus, Calendar } from 'lucide-react';
import type { ProjectStatus } from '@/types';

interface ProjectDetailProps {
  projectId: string;
  onNavigate: (route: string) => void;
}

export function ProjectDetail({ projectId, onNavigate }: ProjectDetailProps) {
  const { projects, editors } = useApp();
  const project = projects.find((p) => p.id === projectId);
  const now = new Date();

  if (!project) {
    return (
      <div className="pt-24 text-center">
        <p className="text-sm text-gray-600">Project not found.</p>
        <button onClick={() => onNavigate('/admin/projects')} className="text-sm text-violet-600 mt-2">Back to projects</button>
      </div>
    );
  }

  const statusVariant = (status: ProjectStatus): 'neutral' | 'info' | 'pending' | 'verified' | 'rejected' => {
    if (status === 'Approved') return 'verified';
    if (status === 'Ready for Review') return 'pending';
    if (status === 'In Progress') return 'info';
    if (status === 'Sent Back') return 'rejected';
    return 'neutral';
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 lg:px-6 py-8">
      <button
        onClick={() => onNavigate('/admin/projects')}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-h2 mb-1">{project.title}</h1>
          <p className="text-sm text-gray-600">{project.clientName} · Created {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Subtasks ({project.subtasks.length})</h2>
      </div>

      {project.subtasks.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title="No subtasks"
          description="This project has no subtasks yet."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {project.subtasks.map((st) => {
            const assignedEditors = st.assignedEditorIds
              .map((id) => editors.find((e) => e.id === id))
              .filter(Boolean) as { id: string; fullName: string; avatarUrl: string }[];
            const days = Math.ceil((new Date(st.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const urgent = days <= 3 && days >= 0;
            const overdue = days < 0;

            return (
              <Card key={st.id} className="p-5">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-ink-900 mb-1">{st.title}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="neutral">{st.taskType}</Badge>
                      <span className={`flex items-center gap-1 text-xs font-medium ${
                        overdue ? 'text-red-600' : urgent ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {overdue ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d left`}
                      </span>
                      <Badge variant={statusVariant(st.status)}>{st.status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {assignedEditors.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <AvatarStack editors={assignedEditors} />
                        <span className="text-xs text-gray-500">{assignedEditors.length} assigned</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Unassigned</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(`/admin/projects/${project.id}/subtasks/${st.id}/assign`)}
                    >
                      <UserPlus className="w-4 h-4" />
                      {assignedEditors.length > 0 ? 'Manage' : 'Assign'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
