import { useState } from 'react';
import { Card, Badge, Button, Avatar, Modal, Textarea, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import { Check, X, Link2, ExternalLink, Clock, FileText } from 'lucide-react';
import type { Subtask } from '@/types';

interface ReviewQueueProps {
  onNavigate: (route: string) => void;
}

interface QueueItem extends Subtask {
  projectTitle: string;
  projectId: string;
  editorName: string;
  editorAvatar: string;
  editorId: string;
}

export function ReviewQueue({ onNavigate }: ReviewQueueProps) {
  const { projects, editors, updateSubtask, addToast } = useApp();
  const [sendBackModal, setSendBackModal] = useState<QueueItem | null>(null);
  const [feedback, setFeedback] = useState('');

  const queueItems: QueueItem[] = projects.flatMap((p) =>
    p.subtasks
      .filter((st) => st.status === 'Ready for Review')
      .map((st) => {
        const editor = editors.find((e) => e.id === st.assignedEditorIds[0]);
        return {
          ...st,
          projectTitle: p.title,
          projectId: p.id,
          editorName: editor?.fullName || 'Unknown',
          editorAvatar: editor?.avatarUrl || '',
          editorId: editor?.id || '',
        };
      })
  );

  const approve = (item: QueueItem) => {
    updateSubtask(item.projectId, item.id, { status: 'Approved' });
    addToast(`"${item.title}" approved`, 'success');
  };

  const sendBack = () => {
    if (!sendBackModal || !feedback.trim()) return;
    updateSubtask(sendBackModal.projectId, sendBackModal.id, {
      status: 'Sent Back',
      feedback: feedback.trim(),
    });
    addToast(`"${sendBackModal.title}" sent back with feedback`, 'info');
    setSendBackModal(null);
    setFeedback('');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-h2 mb-1">Review queue</h1>
        <p className="text-sm text-gray-600">
          {queueItems.length > 0 ? `${queueItems.length} submission${queueItems.length !== 1 ? 's' : ''} awaiting review` : 'All caught up'}
        </p>
      </div>

      {queueItems.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-10 h-10" />}
          title="No submissions to review"
          description="When editors mark tasks as ready for review, they'll appear here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {queueItems.map((item) => {
            const daysLeft = Math.ceil((new Date(item.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return (
              <Card key={item.id} className="p-5">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    <Avatar src={item.editorAvatar} alt={item.editorName} size="md" />
                    <div>
                      <p className="text-sm font-medium text-ink-900">{item.editorName}</p>
                      <p className="text-xs text-gray-500">{item.projectTitle}</p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-ink-900 mb-1">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="neutral">{item.taskType}</Badge>
                      <span className={`flex items-center gap-1 text-xs font-medium ${
                        daysLeft < 0 ? 'text-red-600' : daysLeft <= 3 ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </span>
                    </div>
                    {item.deliverableLink && (
                      <a
                        href={item.deliverableLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[300px]">{item.deliverableLink}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" onClick={() => approve(item)} className="bg-mint-500 hover:bg-mint-600">
                      <Check className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setSendBackModal(item); setFeedback(''); }}>
                      <X className="w-4 h-4" />
                      Send back
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!sendBackModal} onClose={() => setSendBackModal(null)} title="Send back for revision">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-600">Task</p>
            <p className="text-sm font-medium text-ink-900">{sendBackModal?.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sendBackModal?.projectTitle}</p>
          </div>
          <Textarea
            label="Feedback (required)"
            rows={4}
            placeholder="Explain what needs to be revised..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSendBackModal(null)}>Cancel</Button>
            <Button variant="destructive" onClick={sendBack} disabled={!feedback.trim()}>
              Send back
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
