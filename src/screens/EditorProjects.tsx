import { useState } from 'react';
import { Card, Badge, Button, Input, Modal, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import { Clock, Link2, MessageSquare, AlertCircle, FileText } from 'lucide-react';
import type { ProjectStatus, Subtask } from '@/types';

export function EditorProjects() {
  const { getCurrentEditor, projects, updateSubtask, addToast } = useApp();
  const editor = getCurrentEditor();
  const [deliverableModal, setDeliverableModal] = useState<{ subtask: Subtask; projectTitle: string; projectId: string } | null>(null);
  const [deliverableLink, setDeliverableLink] = useState('');

  if (!editor) return null;

  const mySubtasks = projects
    .flatMap((p) => p.subtasks.map((st) => ({ ...st, projectTitle: p.title, projectId: p.id })))
    .filter((st) => st.assignedEditorIds.includes(editor.id));

  const now = new Date();

  const getDeadlineInfo = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      days,
      label: days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d left`,
      variant: days < 0 ? 'overdue' : days <= 3 ? 'urgent' : 'neutral',
      border: days < 0 ? 'border-l-red-500' : days <= 3 ? 'border-l-amber-500' : 'border-l-gray-200',
    };
  };

  const statusFlow: Record<ProjectStatus, ProjectStatus[]> = {
    'Assigned': ['In Progress'],
    'In Progress': ['Ready for Review'],
    'Ready for Review': [],
    'Approved': [],
    'Sent Back': ['In Progress'],
  };

  const statusBadgeVariant: Record<ProjectStatus, 'neutral' | 'info' | 'pending' | 'verified' | 'rejected'> = {
    'Assigned': 'neutral',
    'In Progress': 'info',
    'Ready for Review': 'pending',
    'Approved': 'verified',
    'Sent Back': 'rejected',
  };

  const advanceStatus = (subtask: Subtask & { projectTitle: string; projectId: string }) => {
    const next = statusFlow[subtask.status];
    if (next.length === 0) return;

    if (subtask.status === 'In Progress' && next[0] === 'Ready for Review') {
      setDeliverableModal({ subtask, projectTitle: subtask.projectTitle, projectId: subtask.projectId });
      setDeliverableLink(subtask.deliverableLink || '');
      return;
    }

    updateSubtask(subtask.projectId, subtask.id, { status: next[0] });
    addToast(`Status updated to "${next[0]}"`, 'success');
  };

  const submitForReview = () => {
    if (!deliverableModal || !deliverableLink) return;
    updateSubtask(deliverableModal.projectId, deliverableModal.subtask.id, {
      status: 'Ready for Review',
      deliverableLink,
    });
    addToast('Submitted for review!', 'success');
    setDeliverableModal(null);
    setDeliverableLink('');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-h2 mb-1">My projects</h1>
        <p className="text-sm text-gray-600">Your assigned tasks across all projects</p>
      </div>

      {mySubtasks.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-10 h-10" />}
          title="No assignments yet"
          description="Once an admin assigns you to a project, your tasks will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mySubtasks.map((st) => {
            const deadline = getDeadlineInfo(st.deadline);
            const canAdvance = statusFlow[st.status].length > 0;
            return (
              <Card key={st.id} className={`p-5 border-l-4 ${deadline.border}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink-900 truncate">{st.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{st.projectTitle}</p>
                  </div>
                  <Badge variant={statusBadgeVariant[st.status]}>{st.status}</Badge>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-gray-500">{st.taskType}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    deadline.variant === 'overdue' ? 'text-red-600' : deadline.variant === 'urgent' ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {deadline.label}
                  </span>
                </div>

                {/* Feedback if sent back */}
                {st.status === 'Sent Back' && st.feedback && (
                  <div className="mb-4 p-3 bg-red-050 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-red-700 uppercase tracking-wide mb-1">Admin feedback</p>
                        <p className="text-sm text-red-800">{st.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deliverable link if ready for review */}
                {st.deliverableLink && st.status === 'Ready for Review' && (
                  <div className="mb-4 p-3 bg-gray-050 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <a href={st.deliverableLink} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 hover:text-violet-700 truncate">
                        {st.deliverableLink}
                      </a>
                    </div>
                  </div>
                )}

                {/* Action button */}
                {canAdvance && (
                  <Button
                    size="sm"
                    variant={st.status === 'In Progress' ? 'primary' : 'outline'}
                    onClick={() => advanceStatus(st)}
                    className="w-full"
                  >
                    {st.status === 'Assigned' && 'Start working'}
                    {st.status === 'In Progress' && 'Mark ready for review'}
                    {st.status === 'Sent Back' && 'Resume work'}
                  </Button>
                )}
                {st.status === 'Ready for Review' && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 justify-center py-1">
                    <Clock className="w-3.5 h-3.5" />
                    Awaiting admin review
                  </div>
                )}
                {st.status === 'Approved' && (
                  <div className="flex items-center gap-2 text-xs text-mint-600 justify-center py-1 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Approved
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Deliverable modal */}
      <Modal open={!!deliverableModal} onClose={() => setDeliverableModal(null)} title="Submit for review">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Task</p>
            <p className="text-sm font-medium text-ink-900">{deliverableModal?.subtask.title}</p>
            <p className="text-xs text-gray-500">{deliverableModal?.projectTitle}</p>
          </div>
          <Input
            label="Deliverable link"
            placeholder="https://drive.google.com/your-deliverable"
            value={deliverableLink}
            onChange={(e) => setDeliverableLink(e.target.value)}
            icon={<Link2 className="w-4 h-4" />}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeliverableModal(null)}>Cancel</Button>
            <Button onClick={submitForReview} disabled={!deliverableLink}>
              <MessageSquare className="w-4 h-4" />
              Submit for review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
