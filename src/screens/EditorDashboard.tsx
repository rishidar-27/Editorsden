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
  Folder,
  UploadCloud,
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

  // Exact image thumbnails matching reference design
  const taskImages = [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', // Skincare bottle
    'https://images.unsplash.com/photo-1608248597263-0057e43a4524?w=500', // Purple serum bottle
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500'  // Futuristic tech display
  ];

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-5 px-3 lg:px-6 font-sans text-gray-900">
      <div className="max-w-[1140px] mx-auto">
        
        {/* ================= HERO BANNER ================= */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-1.5">
              Welcome back, <span className="text-[#6D28D9]">{firstName}!</span> 👋
            </h1>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Let's keep creating and delivering amazing edits.
            </p>
          </div>

          {/* Right Clapperboard Graphic */}
          <div className="hidden sm:flex items-center justify-end relative w-44 h-14 shrink-0">
            <svg viewBox="0 0 200 80" className="w-full h-full">
              <circle cx="15" cy="25" r="2.5" fill="#A855F7" opacity="0.6" />
              <circle cx="30" cy="55" r="1.5" fill="#818CF8" opacity="0.7" />
              <path d="M10 50 L12 54 L16 55 L12 56 L10 60 L8 56 L4 55 L8 54 Z" fill="#F59E0B" />
              <circle cx="140" cy="40" r="28" fill="#F3E8FF" />
              
              <g transform="translate(85, 14) rotate(-14)">
                <rect x="0" y="18" width="46" height="32" rx="5" fill="#1E1B4B" />
                <rect x="0" y="4" width="46" height="10" rx="2.5" fill="#312E81" />
                <polygon points="4,4 10,4 6,14 0,14" fill="white" opacity="0.9" />
                <polygon points="16,4 22,4 18,14 12,14" fill="white" opacity="0.9" />
                <polygon points="28,4 34,4 30,14 24,14" fill="white" opacity="0.9" />
              </g>

              <g transform="translate(125, 20)">
                <circle cx="20" cy="20" r="18" fill="url(#playGradCompact)" />
                <polygon points="17,14 27,20 17,26" fill="white" />
              </g>

              <defs>
                <linearGradient id="playGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ================= TOP 4 UNIFORM STAT CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
          
          {/* Card 1: Verification Status */}
          <div className="bg-white rounded-xl border border-gray-200/60 p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px]">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#E6F8F0] text-[#10B981] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#E6F8F0] text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Verified
              </span>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">Verification Status</div>
              <div className="text-base font-bold text-gray-900">Verified</div>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                You are all set! You can now receive new assignments.
              </p>
            </div>
          </div>

          {/* Card 2: Active Assignments */}
          <div className="bg-white rounded-xl border border-gray-200/60 p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px]">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="w-6 h-6 rounded-full bg-[#F0EBFE] hover:bg-purple-100 text-[#7C3AED] flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">Active Assignments</div>
              <div className="text-2xl font-extrabold text-gray-900 leading-tight">3</div>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                2 in progress • 1 for review
              </p>
            </div>
          </div>

          {/* Card 3: Deadlines This Week */}
          <div className="bg-white rounded-xl border border-gray-200/60 p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px]">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#FFF4E5] text-[#F97316] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="w-6 h-6 rounded-full bg-[#FFF4E5] hover:bg-orange-100 text-[#F97316] flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">Deadlines This Week</div>
              <div className="text-2xl font-extrabold text-gray-900 leading-tight">0</div>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                Great! No deadlines this week. Enjoy your flow 🎉
              </p>
            </div>
          </div>

          {/* Card 4: Profile Completeness */}
          <div className="bg-white rounded-xl border border-gray-200/60 p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px]">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-gray-900">100%</span>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium mb-1">Profile Completeness</div>
              <div className="w-full h-1.5 bg-[#6D28D9] rounded-full mb-1.5" />
              <p className="text-[11px] text-gray-400 leading-tight">
                Amazing! Your profile is complete.
              </p>
            </div>
          </div>

        </div>

        {/* ================= MAIN 3-COLUMN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
          
          {/* Column 1: Upcoming Deadlines (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/60 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Upcoming Deadlines</h3>
                </div>
                <button 
                  onClick={() => onNavigate('/editor/projects')}
                  className="text-[11px] font-semibold text-[#7C3AED] hover:underline flex items-center gap-0.5 transition-colors"
                >
                  View all projects <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {/* Task 1 */}
                <div className="p-2 rounded-lg border border-gray-100 hover:border-purple-100 hover:bg-purple-50/10 transition-all flex items-center gap-3 group">
                  <img 
                    src={taskImages[0]} 
                    alt="Hero Brand Film" 
                    className="w-12 h-11 rounded-lg object-cover border border-gray-100 shrink-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#7C3AED] transition-colors">
                      Hero Brand Film (60s)
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">Aurora Skincare — Q4 Launch Campaign</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-medium text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5 text-gray-400" /> May 20, 2026
                      </span>
                      <span className="flex items-center gap-0.5 text-[#EF4444] font-semibold">
                        <Clock className="w-2.5 h-2.5" /> 459d overdue
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                      • In Progress
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>

                {/* Task 2 */}
                <div className="p-2 rounded-lg border border-gray-100 hover:border-purple-100 hover:bg-purple-50/10 transition-all flex items-center gap-3 group">
                  <img 
                    src={taskImages[1]} 
                    alt="Motion Graphics Package" 
                    className="w-12 h-11 rounded-lg object-cover border border-gray-100 shrink-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#7C3AED] transition-colors">
                      Motion Graphics Intro Package
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">TechFlow SaaS — Product Demo Series</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-medium text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5 text-gray-400" /> May 21, 2026
                      </span>
                      <span className="flex items-center gap-0.5 text-[#EF4444] font-semibold">
                        <Clock className="w-2.5 h-2.5" /> 457d overdue
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                      • In Progress
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>

                {/* Task 3 */}
                <div className="p-2 rounded-lg border border-gray-100 hover:border-purple-100 hover:bg-purple-50/10 transition-all flex items-center gap-3 group">
                  <img 
                    src={taskImages[2]} 
                    alt="Product Tutorial Videos" 
                    className="w-12 h-11 rounded-lg object-cover border border-gray-100 shrink-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#7C3AED] transition-colors">
                      Product Tutorial Videos (3x)
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">Aurora Skincare — Q4 Launch Campaign</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-medium text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5 text-gray-400" /> May 22, 2026
                      </span>
                      <span className="flex items-center gap-0.5 text-[#EF4444] font-semibold">
                        <Clock className="w-2.5 h-2.5" /> 453d overdue
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#F3F4F6] text-[#4B5563]">
                      • Assigned
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: My Assignments (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200/60 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">My Assignments</h3>
                <button 
                  onClick={() => onNavigate('/editor/projects')}
                  className="text-[11px] font-semibold text-[#7C3AED] hover:underline flex items-center gap-0.5 transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Assignment 1 */}
                <div className="pb-2.5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-bold text-gray-900">Instagram Reel Series (5x)</h4>
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                      • In Progress
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-1.5">Aurora Skincare — Q4 Launch</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-2.5 h-2.5" /> Due May 19, 2026
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[60%]" />
                      </div>
                      <span className="font-semibold text-gray-700 text-[10px]">60%</span>
                    </div>
                  </div>
                </div>

                {/* Assignment 2 */}
                <div className="pb-2.5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-bold text-gray-900">Feature Walkthrough Video</h4>
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                      • In Progress
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-1.5">TechFlow SaaS — Demo Series</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-2.5 h-2.5" /> Due May 21, 2026
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[30%]" />
                      </div>
                      <span className="font-semibold text-gray-700 text-[10px]">30%</span>
                    </div>
                  </div>
                </div>

                {/* Assignment 3 */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-bold text-gray-900">Promo Reels (3x)</h4>
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#FFF4E5] text-[#F97316]">
                      Ready for Review
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-1.5">The Founder's Journey — S2</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-2.5 h-2.5" /> Due May 23, 2026
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[100%]" />
                      </div>
                      <span className="font-semibold text-gray-700 text-[10px]">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="mt-3 text-[11px] font-semibold text-[#7C3AED] hover:underline flex items-center gap-0.5 transition-colors"
            >
              Go to My Projects <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Column 3: Recent Activity (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200/60 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
                <button 
                  onClick={() => onNavigate('/editor/projects')}
                  className="text-[11px] font-semibold text-[#7C3AED] hover:underline flex items-center gap-0.5 transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3 text-[11px]">
                {/* Event 1 */}
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-800 leading-snug">
                      You submitted <span className="font-semibold text-gray-900">"Instagram Reel Series (5x)"</span> for review
                    </p>
                    <span className="text-gray-400 block mt-0.5 text-[10px]">2 hours ago</span>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-800 leading-snug">
                      <span className="font-semibold text-gray-900">"Thumbnail Design Package"</span> approved
                    </p>
                    <span className="text-gray-400 block mt-0.5 text-[10px]">1 day ago</span>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-800 leading-snug">
                      Started working on <span className="font-semibold text-gray-900">"Feature Walkthrough Video"</span>
                    </p>
                    <span className="text-gray-400 block mt-0.5 text-[10px]">2 days ago</span>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6B7280] shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-800 leading-snug">
                      Updated portfolio item <span className="font-semibold text-gray-900">"Luxury Product Promo"</span>
                    </p>
                    <span className="text-gray-400 block mt-0.5 text-[10px]">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM ROW: PERFORMANCE OVERVIEW & QUICK ACTIONS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Performance Overview (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200/60 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              Performance Overview <span className="text-[11px] font-normal text-gray-400">(This Month)</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* Stat 1 */}
              <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E6F8F0] text-[#10B981] flex items-center justify-center shrink-0">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900 leading-tight">12</div>
                  <div className="text-[11px] text-gray-500 font-medium">Tasks Completed</div>
                  <div className="text-[10px] font-semibold text-[#10B981] mt-0.5">↑ 20% vs last month</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900 leading-tight">94%</div>
                  <div className="text-[11px] text-gray-500 font-medium">On-time Delivery</div>
                  <div className="text-[10px] font-semibold text-[#10B981] mt-0.5">↑ 8% vs last month</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF4E5] text-[#F97316] flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900 leading-tight">4.8<span className="text-[10px] font-normal text-gray-400">/5</span></div>
                  <div className="text-[11px] text-gray-500 font-medium">Avg. Rating</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">From 16 reviews</div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center shrink-0">
                  <Hourglass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900 leading-tight">3h</div>
                  <div className="text-[11px] text-gray-500 font-medium">Avg. Response Time</div>
                  <div className="text-[10px] font-semibold text-[#10B981] mt-0.5">↓ 10% vs last month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200/60 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>

            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 flex flex-col items-center justify-center text-center transition-all group bg-white"
              >
                <Folder className="w-5 h-5 text-[#7C3AED] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-gray-800">My Projects</span>
              </button>

              <button 
                onClick={() => onNavigate('/editor/portfolio')}
                className="p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 flex flex-col items-center justify-center text-center transition-all group bg-white"
              >
                <UploadCloud className="w-5 h-5 text-[#7C3AED] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-gray-800">Upload Work</span>
              </button>

              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 flex flex-col items-center justify-center text-center transition-all group bg-white"
              >
                <MessageSquare className="w-5 h-5 text-[#7C3AED] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-gray-800">Messages</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
