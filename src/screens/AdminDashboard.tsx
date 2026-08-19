import { useState } from 'react';
import { Card } from '@/components/ui';
import {
  Users,
  ShieldCheck,
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  ArrowRight,
  MoreVertical,
  Calendar,
  ChevronDown,
  Briefcase,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [selectedRange] = useState('May 12 – May 18, 2025');

  // Stat metrics matching reference mock
  const metrics = [
    {
      label: 'Total Editors',
      value: '15',
      trend: '↑ 12%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <Users className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-100/70',
    },
    {
      label: 'Verified Editors',
      value: '9',
      trend: '↑ 18%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100/70',
    },
    {
      label: 'Pending Verification',
      value: '5',
      trend: '↓ 7%',
      trendUp: false,
      subtext: 'vs last 7 days',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100/70',
    },
    {
      label: 'Active Editors',
      value: '14',
      trend: '↑ 16%',
      trendUp: true,
      subtext: 'vs last 7 days',
      icon: <UserCheck className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-100/70',
    },
    {
      label: 'Inactive Editors',
      value: '1',
      trend: '↓ 50%',
      trendUp: false,
      subtext: 'vs last 7 days',
      icon: <UserX className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-100/70',
    },
  ];

  // Deadlines at risk list
  const deadlinesAtRisk = [
    {
      id: 'd1',
      title: 'Hero Brand Film (60s)',
      client: 'Aurora Skincare — Q4 Launch Campaign',
      subtasksCount: 3,
      daysLeft: '4d left',
      dueDate: 'Due May 22',
      status: 'warning',
      thumbnail:
        'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 'd2',
      title: 'Instagram Reel Series (5x)',
      client: 'Aurora Skincare — Q4 Launch Campaign',
      subtasksCount: 4,
      daysLeft: '2d left',
      dueDate: 'Due May 20',
      status: 'warning',
      thumbnail:
        'https://images.pexels.com/photos/3756879/pexels-photo-3756879.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 'd3',
      title: 'Thumbnail Design Package',
      client: 'Aurora Skincare — Q4 Launch Campaign',
      subtasksCount: 2,
      daysLeft: '1d left',
      dueDate: 'Due May 19',
      status: 'danger',
      thumbnail:
        'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 'd4',
      title: 'Social Teasers (4x)',
      client: 'TechFlow SaaS — Product Demo Series',
      subtasksCount: 4,
      daysLeft: '3d left',
      dueDate: 'Due May 21',
      status: 'warning',
      thumbnail:
        'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 'd5',
      title: 'Promo Reels (3x)',
      client: "The Founder's Journey — Podcast S2",
      subtasksCount: 3,
      daysLeft: '5d left',
      dueDate: 'Due May 23',
      status: 'warning',
      thumbnail:
        'https://images.pexels.com/photos/4050245/pexels-photo-4050245.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];

  // Recent activity list
  const recentActivities = [
    {
      id: 'a1',
      user: 'Elena Rodriguez',
      avatar: 'https://i.pravatar.cc/150?u=elena',
      action: 'submitted "Instagram Reel Series" for review',
      time: '1h ago',
      type: 'avatar',
    },
    {
      id: 'a2',
      user: 'Noah Kim',
      avatar: 'https://i.pravatar.cc/150?u=noah',
      action: 'registered and submitted for verification',
      time: '3h ago',
      type: 'avatar',
    },
    {
      id: 'a3',
      user: 'You approved',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      action: '"Brand Commercial" by Marcus Chen',
      time: '5h ago',
      type: 'avatar',
    },
    {
      id: 'a4',
      user: 'Zara Ahmed',
      avatar: 'https://i.pravatar.cc/150?u=zara',
      action: 'assigned to "Cinematic Hero Film"',
      time: '6h ago',
      type: 'avatar',
    },
    {
      id: 'a5',
      user: 'Project',
      action: '"Discover Dubai — Tourism Campaign" created',
      time: '1d ago',
      type: 'project_created',
    },
    {
      id: 'a6',
      user: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?u=james',
      action: 'verified as an editor',
      time: '2d ago',
      type: 'avatar',
    },
    {
      id: 'a7',
      user: "Aria Patel's",
      avatar: 'https://i.pravatar.cc/150?u=aria',
      action: 'verification sent back with feedback',
      time: '2d ago',
      type: 'avatar',
    },
    {
      id: 'a8',
      user: 'Maya Singh',
      avatar: 'https://i.pravatar.cc/150?u=maya',
      action: 'updated her portfolio',
      time: '3d ago',
      type: 'avatar',
    },
  ];

  // Top skills in demand data
  const topSkills = [
    { name: 'Video Editing', count: 12, width: '88%', color: 'bg-violet-600' },
    { name: 'Motion Graphics', count: 9, width: '70%', color: 'bg-violet-400' },
    { name: 'Color Grading', count: 7, width: '55%', color: 'bg-violet-300' },
    { name: 'Reels Editing', count: 6, width: '42%', color: 'bg-violet-200' },
    { name: 'Thumbnail Design', count: 5, width: '32%', color: 'bg-violet-100' },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Overview of your editor community and projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 5 Top Stat Cards Grid (Compact & Sleek) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-3.5 relative bg-white border border-gray-100 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 truncate pr-4">{m.label}</span>
              <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                {m.icon}
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {m.value}
              </h2>
              <div className="flex items-center gap-1 text-[10.5px]">
                <span className={`font-bold ${m.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {m.trend}
                </span>
                <span className="text-gray-400 font-medium hidden xl:inline">{m.subtext}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Middle Grid: Deadlines at risk & Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deadlines at risk (Left) */}
        <Card className="lg:col-span-7 p-5 bg-white border border-gray-100 rounded-xl shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-gray-900 text-base">Deadlines at risk</h3>
              </div>
              <button
                onClick={() => onNavigate('/admin/projects')}
                className="text-xs font-semibold text-violet-700 hover:text-violet-800 transition-colors flex items-center gap-1"
              >
                View all projects <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {deadlinesAtRisk.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold text-violet-700 bg-violet-50 rounded-full border border-violet-100">
                          Subtasks: {item.subtasksCount}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {item.client}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end">
                    <span
                      className={`text-xs font-bold ${
                        item.status === 'danger' ? 'text-red-500' : 'text-amber-500'
                      }`}
                    >
                      {item.daysLeft}
                    </span>
                    <span className="text-[10px] text-gray-400">{item.dueDate}</span>
                    <div className="w-16 bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.status === 'danger' ? 'bg-red-500' : 'bg-amber-400'
                        }`}
                        style={{ width: item.status === 'danger' ? '85%' : '60%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 text-[11px] text-gray-400">
            Showing 5 of 8 projects
          </div>
        </Card>

        {/* Recent activity (Right) */}
        <Card className="lg:col-span-5 p-5 bg-white border border-gray-100 rounded-xl shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">Recent activity</h3>
              <button className="text-xs font-semibold text-violet-700 hover:text-violet-800 transition-colors">
                View all
              </button>
            </div>

            <div className="space-y-3.5">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {act.type === 'project_created' ? (
                      <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                        <Briefcase className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <img
                        src={act.avatar}
                        alt={act.user}
                        className="w-6 h-6 rounded-full object-cover shrink-0 border border-gray-200"
                      />
                    )}
                    <p className="text-gray-800 text-[11.5px] truncate">
                      <span className="font-semibold text-gray-900">{act.user}</span>{' '}
                      {act.action}
                    </p>
                  </div>
                  <span className="text-[10.5px] text-gray-400 shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Analytics 3-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Editors by status */}
        <Card className="p-5 bg-white border border-gray-100 rounded-xl shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-4">Editors by status</h3>
            <div className="flex items-center justify-between gap-4 py-2">
              {/* Donut Chart */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Segment 1: Verified (Green) - 60% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeDasharray="52.7 35.2"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Pending (Orange) - 33% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeDasharray="29.0 58.9"
                    strokeDashoffset="-52.7"
                  />
                  {/* Segment 3: Active (Purple) - 93% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="4"
                    strokeDasharray="81.8 6.1"
                    strokeDashoffset="-81.7"
                  />
                  {/* Segment 4: Inactive (Red) - 7% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="4"
                    strokeDasharray="6.1 81.8"
                    strokeDashoffset="-163.5"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-gray-900 leading-none">15</span>
                  <span className="text-[10px] text-gray-400 font-medium mt-0.5">Total</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2.5 text-xs flex-1 pl-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-gray-600">Verified</span>
                  </div>
                  <span className="font-semibold text-gray-900">9 (60%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <span className="font-semibold text-gray-900">5 (33%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-600" />
                    <span className="text-gray-600">Active</span>
                  </div>
                  <span className="font-semibold text-gray-900">14 (93%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-gray-600">Inactive</span>
                  </div>
                  <span className="font-semibold text-gray-900">1 (7%)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin/reports')}
            className="text-xs font-semibold text-violet-700 hover:text-violet-800 transition-colors flex items-center gap-1 pt-4"
          >
            View full report <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        {/* Card 2: New editors (last 7 days) */}
        <Card className="p-5 bg-white border border-gray-100 rounded-xl shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">New editors (last 7 days)</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded-full">
                ↑ 40% vs last 7 days
              </span>
            </div>

            {/* Smooth SVG Area Line Chart */}
            <div className="relative w-full h-36">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 280 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Grid Lines */}
                <line x1="20" y1="10" x2="275" y2="10" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="20" y1="35" x2="275" y2="35" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="20" y1="60" x2="275" y2="60" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="20" y1="85" x2="275" y2="85" stroke="#F3F4F6" strokeWidth="1" />

                {/* Y Axis Labels */}
                <text x="5" y="14" fill="#9CA3AF" fontSize="8">6</text>
                <text x="5" y="39" fill="#9CA3AF" fontSize="8">4</text>
                <text x="5" y="64" fill="#9CA3AF" fontSize="8">2</text>
                <text x="5" y="89" fill="#9CA3AF" fontSize="8">0</text>

                {/* Gradient Area Fill */}
                <path
                  d="M 20,68 Q 60,40 90,55 T 160,25 T 220,50 T 275,20 L 275,85 L 20,85 Z"
                  fill="url(#purpleGradient)"
                />

                {/* Smooth Curve Stroke */}
                <path
                  d="M 20,68 Q 60,40 90,55 T 160,25 T 220,50 T 275,20"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="20" cy="68" r="3" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="62" cy="48" r="3" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="104" cy="55" r="3" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="146" cy="28" r="3" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="188" cy="40" r="3" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="230" cy="24" r="3" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="275" cy="20" r="3" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between pl-5 text-[9px] text-gray-400 mt-1">
                <span>May 12</span>
                <span>May 13</span>
                <span>May 14</span>
                <span>May 15</span>
                <span>May 16</span>
                <span>May 17</span>
                <span>May 18</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin/reports')}
            className="text-xs font-semibold text-violet-700 hover:text-violet-800 transition-colors flex items-center gap-1 pt-4"
          >
            View full report <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        {/* Card 3: Top skills in demand */}
        <Card className="p-5 bg-white border border-gray-100 rounded-xl shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-4">Top skills in demand</h3>

            <div className="space-y-3">
              {topSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs gap-3">
                  <span className="text-gray-600 text-[11px] w-28 shrink-0">{skill.name}</span>
                  <div className="flex-1 bg-gray-50 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${skill.color}`}
                      style={{ width: skill.width }}
                    />
                  </div>
                  <span className="font-bold text-gray-900 text-[11px] w-4 text-right">
                    {skill.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin/reports')}
            className="text-xs font-semibold text-violet-700 hover:text-violet-800 transition-colors flex items-center gap-1 pt-4"
          >
            View full report <ArrowRight className="w-3 h-3" />
          </button>
        </Card>
      </div>
    </div>
  );
}

