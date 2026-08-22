import { 
  ShieldCheck, 
  FileText, 
  Calendar, 
  User, 
  ArrowRight, 
  Clock, 
  CheckSquare, 
  Star, 
  Hourglass,
  FolderKanban,
  Upload,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/context';

interface EditorDashboardProps {
  onNavigate: (route: string) => void;
}

export function EditorDashboard({ onNavigate }: EditorDashboardProps) {
  const { getCurrentEditor } = useApp();
  const editor = getCurrentEditor();

  const firstName = editor?.fullName ? editor.fullName.split(' ')[0] : 'Marcus';

  // Sample static images for portfolio items matching reference design
  const sampleImages = [
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-4 lg:px-6 py-6 font-sans bg-surface-50 min-h-screen text-gray-900">
      
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            Welcome back, <span className="text-[#7C3AED]">{firstName}!</span> 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Let's keep creating and delivering amazing edits.
          </p>
        </div>

        {/* Clapperboard Graphic Illustration */}
        <div className="hidden sm:flex items-center justify-end relative w-44 h-16 shrink-0">
          <svg viewBox="0 0 180 80" className="w-full h-full">
            <circle cx="130" cy="40" r="32" fill="#F0EBFE" />
            <circle cx="145" cy="38" r="18" fill="#7C3AED" />
            <polygon points="142,32 153,38 142,44" fill="white" />
            <g transform="translate(75, 12) rotate(-12)">
              <rect x="0" y="16" width="44" height="32" rx="5" fill="#1E1B4B" />
              <rect x="0" y="4" width="44" height="10" rx="3" fill="#312E81" />
              <polygon points="4,4 10,4 6,14 0,14" fill="white" opacity="0.8" />
              <polygon points="16,4 22,4 18,14 12,14" fill="white" opacity="0.8" />
              <polygon points="28,4 34,4 30,14 24,14" fill="white" opacity="0.8" />
            </g>
            <circle cx="45" cy="24" r="2.5" fill="#A855F7" />
            <circle cx="55" cy="58" r="2" fill="#C084FC" />
            <path d="M165 14 L166.5 18 L171 19.5 L166.5 21 L165 25 L163.5 21 L159 19.5 L163.5 18 Z" fill="#A855F7" />
          </svg>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Card 1: Verification Status */}
        <div className="bg-white rounded-2xl border border-gray-100/90 p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#E8F8F0] text-[#10B981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Verified
            </span>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-0.5">Verification Status</div>
            <div className="text-lg font-bold text-gray-900 mb-1">Verified</div>
            <p className="text-xs text-gray-400 leading-snug">
              You are all set! You can now receive new assignments.
            </p>
          </div>
        </div>

        {/* Card 2: Active Assignments */}
        <div className="bg-white rounded-2xl border border-gray-100/90 p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="w-7 h-7 rounded-full bg-[#F0EBFE] hover:bg-violet-100 text-[#7C3AED] flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-0.5">Active Assignments</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
            <p className="text-xs text-gray-400 leading-snug">
              2 in progress • 1 for review
            </p>
          </div>
        </div>

        {/* Card 3: Deadlines This Week */}
        <div className="bg-white rounded-2xl border border-gray-100/90 p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF4E5] text-[#F97316] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="w-7 h-7 rounded-full bg-[#FFF4E5] hover:bg-orange-100 text-[#F97316] flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-0.5">Deadlines This Week</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
            <p className="text-xs text-gray-400 leading-snug flex items-center gap-1">
              Great! No deadlines this week. Enjoy your flow 🎉
            </p>
          </div>
        </div>

        {/* Card 4: Profile Completeness */}
        <div className="bg-white rounded-2xl border border-gray-100/90 p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-gray-900">100%</span>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-2">Profile Completeness</div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#7C3AED] rounded-full w-full" />
            </div>
            <p className="text-xs text-gray-400 leading-snug">
              Amazing! Your profile is complete.
            </p>
          </div>
        </div>

      </div>

      {/* Main 3-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        
        {/* Column 1: Upcoming Deadlines (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100/90 p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Upcoming Deadlines</h3>
              </div>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
              >
                View all projects <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Task 1 */}
              <div className="p-3 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/10 transition-all flex items-center gap-3 group">
                <img 
                  src={sampleImages[0]} 
                  alt="Hero Brand Film" 
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#7C3AED] transition-colors">
                    Hero Brand Film (60s)
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-1">Aurora Skincare — Q4 Launch Campaign</p>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" /> May 20, 2026
                    </span>
                    <span className="flex items-center gap-1 text-red-500 font-semibold">
                      <Clock className="w-3 h-3" /> 459d overdue
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                    • In Progress
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Task 2 */}
              <div className="p-3 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/10 transition-all flex items-center gap-3 group">
                <img 
                  src={sampleImages[1]} 
                  alt="Motion Graphics Package" 
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#7C3AED] transition-colors">
                    Motion Graphics Intro Package
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-1">TechFlow SaaS — Product Demo Series</p>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" /> May 21, 2026
                    </span>
                    <span className="flex items-center gap-1 text-red-500 font-semibold">
                      <Clock className="w-3 h-3" /> 457d overdue
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                    • In Progress
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Task 3 */}
              <div className="p-3 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/10 transition-all flex items-center gap-3 group">
                <img 
                  src={sampleImages[2]} 
                  alt="Product Tutorial Videos" 
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#7C3AED] transition-colors">
                    Product Tutorial Videos (3x)
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-1">Aurora Skincare — Q4 Launch Campaign</p>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" /> May 22, 2026
                    </span>
                    <span className="flex items-center gap-1 text-red-500 font-semibold">
                      <Clock className="w-3 h-3" /> 453d overdue
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    • Assigned
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: My Assignments (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100/90 p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">My Assignments</h3>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Assignment 1 */}
              <div className="pb-3.5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-gray-900">Instagram Reel Series (5x)</h4>
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                    • In Progress
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Aurora Skincare — Q4 Launch</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" /> Due May 19, 2026
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7C3AED] rounded-full w-[60%]" />
                  </div>
                  <span className="font-semibold text-gray-700">60%</span>
                </div>
              </div>

              {/* Assignment 2 */}
              <div className="pb-3.5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-gray-900">Feature Walkthrough Video</h4>
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                    • In Progress
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">TechFlow SaaS — Demo Series</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" /> Due May 21, 2026
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7C3AED] rounded-full w-[30%]" />
                  </div>
                  <span className="font-semibold text-gray-700">30%</span>
                </div>
              </div>

              {/* Assignment 3 */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-gray-900">Promo Reels (3x)</h4>
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#FFF4E5] text-[#F97316]">
                    Ready for Review
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">The Founder's Journey — S2</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" /> Due May 23, 2026
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7C3AED] rounded-full w-[100%]" />
                  </div>
                  <span className="font-semibold text-gray-700">100%</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('/editor/projects')}
            className="mt-3 text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
          >
            Go to My Projects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column 3: Recent Activity (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100/90 p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Event 1 */}
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0 mt-1" />
                <div>
                  <p className="text-gray-800 leading-snug">
                    You submitted <span className="font-medium text-gray-900">"Instagram Reel Series (5x)"</span> for review
                  </p>
                  <span className="text-gray-400 block mt-0.5">2 hours ago</span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0 mt-1" />
                <div>
                  <p className="text-gray-800 leading-snug">
                    <span className="font-medium text-gray-900">"Thumbnail Design Package"</span> approved
                  </p>
                  <span className="text-gray-400 block mt-0.5">1 day ago</span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0 mt-1" />
                <div>
                  <p className="text-gray-800 leading-snug">
                    Started working on <span className="font-medium text-gray-900">"Feature Walkthrough Video"</span>
                  </p>
                  <span className="text-gray-400 block mt-0.5">2 days ago</span>
                </div>
              </div>

              {/* Event 4 */}
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0 mt-1" />
                <div>
                  <p className="text-gray-800 leading-snug">
                    Updated portfolio item <span className="font-medium text-gray-900">"Luxury Product Promo"</span>
                  </p>
                  <span className="text-gray-400 block mt-0.5">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Performance Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Performance Overview (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100/90 p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)]">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            Performance Overview <span className="text-xs font-normal text-gray-400">(This Month)</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Stat 1 */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center shrink-0">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">12</div>
                <div className="text-xs text-gray-500">Tasks Completed</div>
                <div className="text-[11px] font-semibold text-[#10B981] mt-0.5">↑ 20% vs last month</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">94%</div>
                <div className="text-xs text-gray-500">On-time Delivery</div>
                <div className="text-[11px] font-semibold text-[#10B981] mt-0.5">↑ 8% vs last month</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4E5] text-[#F97316] flex items-center justify-center shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">4.8<span className="text-xs font-normal text-gray-400">/5</span></div>
                <div className="text-xs text-gray-500">Avg. Rating</div>
                <div className="text-[11px] text-gray-400 mt-0.5">From 16 reviews</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <Hourglass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">3h</div>
                <div className="text-xs text-gray-500">Avg. Response Time</div>
                <div className="text-[11px] font-semibold text-[#10B981] mt-0.5">↓ 10% vs last month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100/90 p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>

          <div className="grid grid-cols-3 gap-2.5">
            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 flex flex-col items-center justify-center text-center transition-all group"
            >
              <FolderKanban className="w-5 h-5 text-[#7C3AED] mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-800">My Projects</span>
            </button>

            <button 
              onClick={() => onNavigate('/editor/portfolio')}
              className="p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 flex flex-col items-center justify-center text-center transition-all group"
            >
              <Upload className="w-5 h-5 text-[#7C3AED] mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-800">Upload Work</span>
            </button>

            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 flex flex-col items-center justify-center text-center transition-all group"
            >
              <MessageSquare className="w-5 h-5 text-[#7C3AED] mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-800">Messages</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
