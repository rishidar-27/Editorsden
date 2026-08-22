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
    <div className="bg-[#FAF9FF] min-h-screen py-8 px-4 lg:px-8 font-sans text-gray-900">
      <div className="max-w-[1240px] mx-auto">
        
        {/* ================= HERO BANNER ================= */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
              Welcome back, <span className="text-[#6D28D9]">{firstName}!</span> 👋
            </h1>
            <p className="text-sm text-gray-500 font-normal mt-1">
              Let's keep creating and delivering amazing edits.
            </p>
          </div>

          {/* Right Clapperboard + 3D Play Graphic */}
          <div className="hidden md:flex items-center justify-end relative w-56 h-20 shrink-0">
            <svg viewBox="0 0 240 100" className="w-full h-full">
              {/* Sparkles / Stars */}
              <circle cx="20" cy="30" r="3" fill="#A855F7" opacity="0.6" />
              <circle cx="35" cy="70" r="2" fill="#818CF8" opacity="0.7" />
              <path d="M15 60 L17 64 L21 65 L17 66 L15 70 L13 66 L9 65 L13 64 Z" fill="#F59E0B" />
              <path d="M220 20 L222 24 L226 25 L222 26 L220 30 L218 26 L214 25 L218 24 Z" fill="#C084FC" />
              
              {/* Soft purple glow backdrop */}
              <circle cx="165" cy="50" r="36" fill="#F3E8FF" />
              
              {/* Clapperboard tilted */}
              <g transform="translate(100, 18) rotate(-14)">
                {/* Board base */}
                <rect x="0" y="22" width="56" height="40" rx="6" fill="#1E1B4B" />
                {/* Clapper top bar */}
                <rect x="0" y="6" width="56" height="12" rx="3" fill="#312E81" />
                {/* White diagonal stripes */}
                <polygon points="5,6 12,6 7,18 0,18" fill="white" opacity="0.9" />
                <polygon points="19,6 26,6 21,18 14,18" fill="white" opacity="0.9" />
                <polygon points="33,6 40,6 35,18 28,18" fill="white" opacity="0.9" />
                <polygon points="47,6 54,6 49,18 42,18" fill="white" opacity="0.9" />
              </g>

              {/* Glowing Purple Circle Play Button */}
              <g transform="translate(145, 25)">
                <circle cx="25" cy="25" r="22" fill="url(#playGrad)" />
                <polygon points="21,17 33,25 21,33" fill="white" />
              </g>

              <defs>
                <linearGradient id="playGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ================= TOP 4 STAT CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Card 1: Verification Status */}
          <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F8F0] text-[#10B981] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-[#E6F8F0] text-[#10B981]">
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
          <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="w-8 h-8 rounded-full bg-[#F0EBFE] hover:bg-purple-100 text-[#7C3AED] flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-0.5">Active Assignments</div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">3</div>
              <p className="text-xs text-gray-400 leading-snug">
                2 in progress • 1 for review
              </p>
            </div>
          </div>

          {/* Card 3: Deadlines This Week */}
          <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4E5] text-[#F97316] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="w-8 h-8 rounded-full bg-[#FFF4E5] hover:bg-orange-100 text-[#F97316] flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-0.5">Deadlines This Week</div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">0</div>
              <p className="text-xs text-gray-400 leading-snug">
                Great! No deadlines this week. Enjoy your flow 🎉
              </p>
            </div>
          </div>

          {/* Card 4: Profile Completeness */}
          <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">100%</span>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1.5">Profile Completeness</div>
              <div className="w-full h-2 bg-[#6D28D9] rounded-full mb-2" />
              <p className="text-xs text-gray-400 leading-snug">
                Amazing! Your profile is complete.
              </p>
            </div>
          </div>

        </div>

        {/* ================= MAIN 3-COLUMN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          
          {/* Column 1: Upcoming Deadlines (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/70 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
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
                  View all projects <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3.5">
                {/* Task 1 */}
                <div className="p-2.5 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/10 transition-all flex items-center gap-3.5 group">
                  <img 
                    src={taskImages[0]} 
                    alt="Hero Brand Film" 
                    className="w-16 h-14 rounded-xl object-cover border border-gray-100 shrink-0" 
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
                      <span className="flex items-center gap-1 text-[#EF4444] font-semibold">
                        <Clock className="w-3 h-3" /> 459d overdue
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                      • In Progress
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Task 2 */}
                <div className="p-2.5 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/10 transition-all flex items-center gap-3.5 group">
                  <img 
                    src={taskImages[1]} 
                    alt="Motion Graphics Package" 
                    className="w-16 h-14 rounded-xl object-cover border border-gray-100 shrink-0" 
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
                      <span className="flex items-center gap-1 text-[#EF4444] font-semibold">
                        <Clock className="w-3 h-3" /> 457d overdue
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                      • In Progress
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Task 3 */}
                <div className="p-2.5 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/10 transition-all flex items-center gap-3.5 group">
                  <img 
                    src={taskImages[2]} 
                    alt="Product Tutorial Videos" 
                    className="w-16 h-14 rounded-xl object-cover border border-gray-100 shrink-0" 
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
                      <span className="flex items-center gap-1 text-[#EF4444] font-semibold">
                        <Clock className="w-3 h-3" /> 453d overdue
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#F3F4F6] text-[#4B5563]">
                      • Assigned
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: My Assignments (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/70 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">My Assignments</h3>
                <button 
                  onClick={() => onNavigate('/editor/projects')}
                  className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Assignment 1 */}
                <div className="pb-3.5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-bold text-gray-900">Instagram Reel Series (5x)</h4>
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                      • In Progress
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2.5">Aurora Skincare — Q4 Launch</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3 h-3" /> Due May 19, 2026
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[60%]" />
                      </div>
                      <span className="font-semibold text-gray-700 text-xs">60%</span>
                    </div>
                  </div>
                </div>

                {/* Assignment 2 */}
                <div className="pb-3.5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-bold text-gray-900">Feature Walkthrough Video</h4>
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#F0EBFE] text-[#7C3AED]">
                      • In Progress
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2.5">TechFlow SaaS — Demo Series</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3 h-3" /> Due May 21, 2026
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[30%]" />
                      </div>
                      <span className="font-semibold text-gray-700 text-xs">30%</span>
                    </div>
                  </div>
                </div>

                {/* Assignment 3 */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-bold text-gray-900">Promo Reels (3x)</h4>
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#FFF4E5] text-[#F97316]">
                      Ready for Review
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2.5">The Founder's Journey — S2</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3 h-3" /> Due May 23, 2026
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[100%]" />
                      </div>
                      <span className="font-semibold text-gray-700 text-xs">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('/editor/projects')}
              className="mt-4 text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
            >
              Go to My Projects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Column 3: Recent Activity (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/70 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
                <button 
                  onClick={() => onNavigate('/editor/projects')}
                  className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Event 1 */}
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-800 leading-snug">
                      You submitted <span className="font-semibold text-gray-900">"Instagram Reel Series (5x)"</span> for review
                    </p>
                    <span className="text-gray-400 block mt-0.5">2 hours ago</span>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-800 leading-snug">
                      <span className="font-semibold text-gray-900">"Thumbnail Design Package"</span> approved
                    </p>
                    <span className="text-gray-400 block mt-0.5">1 day ago</span>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-800 leading-snug">
                      Started working on <span className="font-semibold text-gray-900">"Feature Walkthrough Video"</span>
                    </p>
                    <span className="text-gray-400 block mt-0.5">2 days ago</span>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6B7280] shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-800 leading-snug">
                      Updated portfolio item <span className="font-semibold text-gray-900">"Luxury Product Promo"</span>
                    </p>
                    <span className="text-gray-400 block mt-0.5">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM ROW: PERFORMANCE OVERVIEW & QUICK ACTIONS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Performance Overview (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/70 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)]">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Performance Overview <span className="text-xs font-normal text-gray-400">(This Month)</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Stat 1 */}
              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6F8F0] text-[#10B981] flex items-center justify-center shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">12</div>
                  <div className="text-xs text-gray-500 font-medium">Tasks Completed</div>
                  <div className="text-[11px] font-semibold text-[#10B981] mt-0.5">↑ 20% vs last month</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">94%</div>
                  <div className="text-xs text-gray-500 font-medium">On-time Delivery</div>
                  <div className="text-[11px] font-semibold text-[#10B981] mt-0.5">↑ 8% vs last month</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4E5] text-[#F97316] flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">4.8<span className="text-xs font-normal text-gray-400">/5</span></div>
                  <div className="text-xs text-gray-500 font-medium">Avg. Rating</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">From 16 reviews</div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center shrink-0">
                  <Hourglass className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">3h</div>
                  <div className="text-xs text-gray-500 font-medium">Avg. Response Time</div>
                  <div className="text-[11px] font-semibold text-[#10B981] mt-0.5">↓ 10% vs last month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/70 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>

            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="p-3.5 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 flex flex-col items-center justify-center text-center transition-all group bg-white shadow-2xs"
              >
                <Folder className="w-6 h-6 text-[#7C3AED] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-800">My Projects</span>
              </button>

              <button 
                onClick={() => onNavigate('/editor/portfolio')}
                className="p-3.5 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 flex flex-col items-center justify-center text-center transition-all group bg-white shadow-2xs"
              >
                <UploadCloud className="w-6 h-6 text-[#7C3AED] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-800">Upload Work</span>
              </button>

              <button 
                onClick={() => onNavigate('/editor/projects')}
                className="p-3.5 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 flex flex-col items-center justify-center text-center transition-all group bg-white shadow-2xs"
              >
                <MessageSquare className="w-6 h-6 text-[#7C3AED] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-800">Messages</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
