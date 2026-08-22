import { Badge, Card, ProgressBar } from '@/components/ui';
import { useApp } from '@/context';
import { 
  ShieldCheck, 
  FileText, 
  Calendar, 
  User, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  CheckSquare, 
  Star, 
  Hourglass,
  FolderKanban,
  Upload,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface EditorDashboardProps {
  onNavigate: (route: string) => void;
}

export function EditorDashboard({ onNavigate }: EditorDashboardProps) {
  const { getCurrentEditor, projects, activity } = useApp();
  const editor = getCurrentEditor();

  if (!editor) return null;

  const mySubtasks = projects
    .flatMap((p) => p.subtasks.map((st) => ({ ...st, projectTitle: p.title, clientName: p.clientName })))
    .filter((st) => st.assignedEditorIds.includes(editor.id));

  const activeAssignments = mySubtasks.filter(
    (st) => st.status === 'Assigned' || st.status === 'In Progress' || st.status === 'Ready for Review'
  );

  const inProgressCount = mySubtasks.filter((st) => st.status === 'In Progress').length;
  const readyForReviewCount = mySubtasks.filter((st) => st.status === 'Ready for Review').length;

  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const deadlinesThisWeek = mySubtasks.filter((st) => {
    const deadline = new Date(st.deadline);
    return deadline > now && deadline < weekFromNow;
  }).length;

  // Profile completeness calculation
  const fields = [
    editor.fullName, editor.phone, editor.city, editor.bio,
    editor.linkedin, editor.instagram, editor.portfolioLink,
    editor.experience > 0, editor.editingSoftware.length > 0,
    editor.skills.length > 0, editor.portfolio.length > 0,
  ];
  const filled = fields.filter(Boolean).length;
  const completeness = Math.round((filled / fields.length) * 100);

  const firstName = editor.fullName ? editor.fullName.split(' ')[0] : 'Marcus';

  // Sample static images for items if not present
  const sampleImages = [
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 lg:px-8 py-8 font-sans bg-surface-50 min-h-screen text-gray-900">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            Welcome back, <span className="text-violet-600">{firstName}!</span> 👋
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Let's keep creating and delivering amazing edits.
          </p>
        </div>
        {/* Clapperboard Illustration / Decorative graphic */}
        <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-violet-100 to-indigo-50 px-6 py-3.5 rounded-2xl border border-violet-100/60 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-violet-900 uppercase tracking-wider">Editor Portal</div>
            <div className="text-sm font-bold text-violet-700">Studio Dashboard</div>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Verification Status */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Verification Status</div>
            <div className="text-lg font-bold text-gray-900 mb-1">Verified</div>
            <p className="text-xs text-gray-500 leading-snug">
              You are all set! You can now receive new assignments.
            </p>
          </div>
        </div>

        {/* Active Assignments */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="w-8 h-8 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-600 flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Active Assignments</div>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              {activeAssignments.length || 3}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {inProgressCount || 2} in progress • {readyForReviewCount || 1} for review
            </p>
          </div>
        </div>

        {/* Deadlines This Week */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-500 flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Deadlines This Week</div>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              {deadlinesThisWeek}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Great! No deadlines this week. Enjoy your flow 🎉
            </p>
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-gray-900">{completeness}%</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Profile Completeness</div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-500" 
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {completeness === 100 ? 'Amazing! Your profile is complete.' : 'Complete your profile to get more orders.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main 3-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Column 1: Upcoming Deadlines (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Upcoming Deadlines</h3>
              </div>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors"
              >
                View all projects <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Task 1 */}
              <div className="p-3.5 rounded-xl border border-gray-100 hover:border-violet-100 hover:bg-violet-50/20 transition-all flex items-center gap-3.5 group">
                <img 
                  src={sampleImages[0]} 
                  alt="Task thumbnail" 
                  className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-violet-600 transition-colors">
                    Hero Brand Film (60s)
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-1.5">Aurora Skincare — Q4 Launch Campaign</p>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" /> May 20, 2026
                    </span>
                    <span className="flex items-center gap-1 text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                      <Clock className="w-3 h-3" /> Overdue
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                    • In Progress
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-600 transition-colors" />
                </div>
              </div>

              {/* Task 2 */}
              <div className="p-3.5 rounded-xl border border-gray-100 hover:border-violet-100 hover:bg-violet-50/20 transition-all flex items-center gap-3.5 group">
                <img 
                  src={sampleImages[1]} 
                  alt="Task thumbnail" 
                  className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-violet-600 transition-colors">
                    Motion Graphics Intro Package
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-1.5">TechFlow SaaS — Product Demo Series</p>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" /> May 21, 2026
                    </span>
                    <span className="flex items-center gap-1 text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                      <Clock className="w-3 h-3" /> Overdue
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                    • In Progress
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-600 transition-colors" />
                </div>
              </div>

              {/* Task 3 */}
              <div className="p-3.5 rounded-xl border border-gray-100 hover:border-violet-100 hover:bg-violet-50/20 transition-all flex items-center gap-3.5 group">
                <img 
                  src={sampleImages[2]} 
                  alt="Task thumbnail" 
                  className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-violet-600 transition-colors">
                    Product Tutorial Videos (3x)
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-1.5">Aurora Skincare — Q4 Launch Campaign</p>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" /> May 22, 2026
                    </span>
                    <span className="flex items-center gap-1 text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                      <Clock className="w-3 h-3" /> Overdue
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                    • Assigned
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-600 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: My Assignments (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">My Assignments</h3>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Assignment 1 */}
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-gray-900">Instagram Reel Series (5x)</h4>
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-violet-50 text-violet-600">
                    • In Progress
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2.5">Aurora Skincare — Q4 Launch</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" /> Due May 19, 2026
                  </span>
                  <span className="font-bold text-violet-600">60%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 rounded-full w-[60%]" />
                </div>
              </div>

              {/* Assignment 2 */}
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-gray-900">Feature Walkthrough Video</h4>
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-violet-50 text-violet-600">
                    • In Progress
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2.5">TechFlow SaaS — Demo Series</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" /> Due May 21, 2026
                  </span>
                  <span className="font-bold text-violet-600">30%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 rounded-full w-[30%]" />
                </div>
              </div>

              {/* Assignment 3 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-gray-900">Promo Reels (3x)</h4>
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-600">
                    Ready for Review
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2.5">The Founder's Journey — S2</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" /> Due May 23, 2026
                  </span>
                  <span className="font-bold text-violet-600">100%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 rounded-full w-[100%]" />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('/editor/projects')}
            className="mt-4 pt-3 border-t border-gray-100 w-full text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center justify-center gap-1 transition-colors"
          >
            Go to My Projects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column 3: Recent Activity (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative pl-4 space-y-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {/* Event 1 */}
              <div className="relative">
                <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-violet-600 ring-4 ring-white" />
                <p className="text-xs text-gray-800 leading-snug">
                  You submitted <span className="font-semibold text-gray-900">"Instagram Reel Series (5x)"</span> for review
                </p>
                <span className="text-[11px] text-gray-400 font-medium">2 hours ago</span>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <p className="text-xs text-gray-800 leading-snug">
                  <span className="font-semibold text-gray-900">"Thumbnail Design Package"</span> approved
                </p>
                <span className="text-[11px] text-gray-400 font-medium">1 day ago</span>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
                <p className="text-xs text-gray-800 leading-snug">
                  Started working on <span className="font-semibold text-gray-900">"Feature Walkthrough Video"</span>
                </p>
                <span className="text-[11px] text-gray-400 font-medium">2 days ago</span>
              </div>

              {/* Event 4 */}
              <div className="relative">
                <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-400 ring-4 ring-white" />
                <p className="text-xs text-gray-800 leading-snug">
                  Updated portfolio item <span className="font-semibold text-gray-900">"Luxury Product Promo"</span>
                </p>
                <span className="text-[11px] text-gray-400 font-medium">3 days ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Performance Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Performance Overview (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            Performance Overview <span className="text-xs font-normal text-gray-400">(This Month)</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="p-4 rounded-xl bg-surface-50 border border-gray-100 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">12</div>
                <div className="text-xs text-gray-500 font-medium">Tasks Completed</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-0.5">↑ 20% vs last month</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-4 rounded-xl bg-surface-50 border border-gray-100 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">94%</div>
                <div className="text-xs text-gray-500 font-medium">On-time Delivery</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-0.5">↑ 8% vs last month</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-4 rounded-xl bg-surface-50 border border-gray-100 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">4.8<span className="text-sm font-normal text-gray-400">/5</span></div>
                <div className="text-xs text-gray-500 font-medium">Avg. Rating</div>
                <div className="text-[11px] text-gray-400 font-medium mt-0.5">From 16 reviews</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-4 rounded-xl bg-surface-50 border border-gray-100 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <Hourglass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">3h</div>
                <div className="text-xs text-gray-500 font-medium">Avg. Response Time</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-0.5">↓ 10% vs last month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <h3 className="text-base font-bold text-gray-900 mb-5">Quick Actions</h3>

          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FolderKanban className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-800 text-center">My Projects</span>
            </button>

            <button 
              onClick={() => onNavigate('/editor/portfolio')}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-800 text-center">Upload Work</span>
            </button>

            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-800 text-center">Messages</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
