import { Badge, Card, ProgressBar } from '@/components/ui';
import { useApp } from '@/context';
import { ShieldCheck, FileText, Calendar, User, ArrowRight, Clock } from 'lucide-react';

interface EditorDashboardProps {
  onNavigate: (route: string) => void;
}

export function EditorDashboard({ onNavigate }: EditorDashboardProps) {
  const { getCurrentEditor, projects } = useApp();
  const editor = getCurrentEditor();

  if (!editor) return null;

  const mySubtasks = projects
    .flatMap((p) => p.subtasks.map((st) => ({ ...st, projectTitle: p.title })))
    .filter((st) => st.assignedEditorIds.includes(editor.id));

  const activeAssignments = mySubtasks.filter(
    (st) => st.status === 'Assigned' || st.status === 'In Progress'
  ).length;

  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const deadlinesThisWeek = mySubtasks.filter((st) => {
    const deadline = new Date(st.deadline);
    return deadline > now && deadline < weekFromNow;
  }).length;

  // Profile completeness
  const fields = [
    editor.fullName, editor.phone, editor.city, editor.bio,
    editor.linkedin, editor.instagram, editor.portfolioLink,
    editor.experience > 0, editor.editingSoftware.length > 0,
    editor.skills.length > 0, editor.portfolio.length > 0,
  ];
  const filled = fields.filter(Boolean).length;
  const completeness = Math.round((filled / fields.length) * 100);

  const verificationBadgeVariant = editor.verificationStatus === 'Verified' ? 'verified' : editor.verificationStatus === 'Pending' ? 'pending' : 'rejected';

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-h2 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back, {editor.fullName || 'editor'}</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Verification status */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-violet-050 flex items-center justify-center">
              <ShieldCheck className="w-[18px] h-[18px] text-violet-600" />
            </div>
            <Badge variant={verificationBadgeVariant}>{editor.verificationStatus}</Badge>
          </div>
          <p className="text-sm text-gray-600">Verification</p>
          <p className="text-sm font-medium text-ink-900 mt-0.5">
            {editor.verificationStatus === 'Verified' ? 'You are verified' : editor.verificationStatus === 'Pending' ? 'Awaiting review' : 'Needs resubmission'}
          </p>
        </Card>

        {/* Active assignments */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-[18px] h-[18px] text-gray-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Active assignments</p>
          <p className="text-2xl font-bold text-ink-900 tabular-nums mt-0.5" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
            {activeAssignments}
          </p>
        </Card>

        {/* Deadlines this week */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-amber-050 flex items-center justify-center">
              <Calendar className="w-[18px] h-[18px] text-amber-600" />
            </div>
            {deadlinesThisWeek > 0 && <span className="w-2 h-2 rounded-full bg-amber-500" />}
          </div>
          <p className="text-sm text-gray-600">Deadlines this week</p>
          <p className="text-2xl font-bold text-ink-900 tabular-nums mt-0.5" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
            {deadlinesThisWeek}
          </p>
        </Card>

        {/* Profile completeness */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <User className="w-[18px] h-[18px] text-gray-600" />
            </div>
            <span className="text-sm font-medium text-ink-900 tabular-nums">{completeness}%</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Profile completeness</p>
          <ProgressBar value={completeness} animateOnMount />
        </Card>
      </div>

      {/* Quick actions / status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding progress */}
        {editor.verificationStatus !== 'Verified' && (
          <Card className="p-6">
            <h3 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Complete your setup</h3>
            <div className="flex flex-col gap-3">
              <SetupStep
                label="Complete your profile"
                done={completeness >= 80}
                onClick={() => onNavigate('/editor/profile')}
              />
              <SetupStep
                label="Add portfolio items"
                done={editor.portfolio.length >= 3}
                onClick={() => onNavigate('/editor/portfolio')}
              />
              <SetupStep
                label="Submit for verification"
                done={editor.verificationStatus !== 'Pending'}
                onClick={() => onNavigate('/editor/verification')}
              />
            </div>
          </Card>
        )}

        {/* Upcoming deadlines */}
        <Card className="p-6">
          <h3 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Upcoming deadlines</h3>
          {mySubtasks.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No active assignments.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {mySubtasks
                .filter((st) => st.status !== 'Approved')
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 4)
                .map((st) => {
                  const daysLeft = Math.ceil((new Date(st.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const urgent = daysLeft <= 3;
                  const overdue = daysLeft < 0;
                  return (
                    <div key={st.id} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink-900 truncate">{st.title}</p>
                        <p className="text-xs text-gray-500">{st.projectTitle}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`flex items-center gap-1 text-xs font-medium ${
                          overdue ? 'text-red-600' : urgent ? 'text-amber-600' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {overdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                        </span>
                        <Badge variant={st.status === 'In Progress' ? 'info' : st.status === 'Ready for Review' ? 'pending' : 'neutral'}>
                          {st.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
          <button
            onClick={() => onNavigate('/editor/projects')}
            className="mt-4 flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 transition-colors"
          >
            View all projects
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>
      </div>
    </div>
  );
}

function SetupStep({ label, done, onClick }: { label: string; done: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-050 transition-colors text-left"
    >
      <span className={`text-sm ${done ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{label}</span>
      {done ? (
        <span className="w-5 h-5 rounded-full bg-mint-100 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-mint-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      ) : (
        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
      )}
    </button>
  );
}
