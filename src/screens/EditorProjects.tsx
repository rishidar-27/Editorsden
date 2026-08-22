import { useState } from 'react';
import { useApp } from '@/context';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  MoreHorizontal, 
  FolderKanban, 
  ListFilter, 
  Grid, 
  List, 
  Play, 
  ChevronDown,
  X,
  Link2,
  Send
} from 'lucide-react';
import type { Subtask } from '@/types';

export function EditorProjects() {
  const { getCurrentEditor, projects, updateSubtask, addToast } = useApp();
  const editor = getCurrentEditor();

  const [activeFilter, setActiveFilter] = useState<'All' | 'In Progress' | 'Assigned' | 'Ready for Review' | 'Completed' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deliverableModal, setDeliverableModal] = useState<{ subtask: Subtask; projectTitle: string; projectId: string } | null>(null);
  const [deliverableLink, setDeliverableLink] = useState('');

  if (!editor) return null;

  // Exact sample projects matching reference image
  const sampleProjects = [
    {
      id: 'sp1',
      title: 'Hero Brand Film (60s)',
      clientName: 'Aurora Skincare — Q4 Launch',
      status: 'In Progress',
      overdueText: '459d overdue',
      progress: 60,
      skills: ['Commercial Ads', 'Color Grading'],
      assignedDate: 'May 12, 2026',
      duration: '01:02',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
      borderLeft: 'border-l-4 border-l-[#EF4444]',
      rating: null
    },
    {
      id: 'sp2',
      title: 'Product Tutorial Videos (3x)',
      clientName: 'Aurora Skincare — Q4 Launch',
      status: 'Assigned',
      overdueText: '453d overdue',
      progress: 0,
      skills: ['YouTube Editing', 'Motion Graphics'],
      assignedDate: 'May 10, 2026',
      duration: '00:45',
      thumbnailUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
      borderLeft: 'border-l-4 border-l-gray-200',
      rating: null
    },
    {
      id: 'sp3',
      title: 'Motion Graphics Intro Package',
      clientName: 'TechFlow SaaS — Demo Series',
      status: 'In Progress',
      overdueText: '457d overdue',
      progress: 40,
      skills: ['Motion Graphics', 'After Effects'],
      assignedDate: 'May 14, 2026',
      duration: '00:58',
      thumbnailUrl: 'https://images.unsplash.com/photo-1608248597263-0057e43a4524?w=500',
      borderLeft: 'border-l-4 border-l-[#EF4444]',
      rating: null
    },
    {
      id: 'sp4',
      title: 'YouTube Travel Vlogs (5x)',
      clientName: 'The Founder\'s Journey',
      status: 'Completed',
      overdueText: null,
      completedDate: 'May 8, 2026',
      progress: 100,
      skills: ['YouTube Editing', 'Sound Design'],
      assignedDate: 'May 01, 2026',
      duration: '02:15',
      thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500',
      borderLeft: 'border-l-4 border-l-[#10B981]',
      rating: '4.8/5'
    },
    {
      id: 'sp5',
      title: 'Wedding Highlight Reel',
      clientName: 'Private Client',
      status: 'Completed',
      overdueText: null,
      completedDate: 'Apr 28, 2026',
      progress: 100,
      skills: ['Wedding Videos', 'Color Grading'],
      assignedDate: 'Apr 20, 2026',
      duration: '03:20',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
      borderLeft: 'border-l-4 border-l-[#10B981]',
      rating: '5.0/5'
    }
  ];

  const filteredProjects = sampleProjects.filter((p) => {
    if (activeFilter === 'In Progress') return p.status === 'In Progress';
    if (activeFilter === 'Assigned') return p.status === 'Assigned';
    if (activeFilter === 'Completed') return p.status === 'Completed';
    if (activeFilter === 'Overdue') return p.overdueText !== null;
    return true;
  }).filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.clientName.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleActionClick = (p: typeof sampleProjects[0]) => {
    if (p.status === 'In Progress') {
      addToast(`Marked "${p.title}" as ready for review!`, 'success');
    } else if (p.status === 'Assigned') {
      addToast(`Started working on "${p.title}"!`, 'info');
    } else {
      addToast(`Opening details for "${p.title}"`, 'info');
    }
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-8 px-4 lg:px-8 font-sans text-gray-900">
      <div className="max-w-[1240px] mx-auto">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Projects</h1>
            <p className="text-sm text-gray-500 font-normal mt-0.5">Your assigned tasks across all projects</p>
          </div>

          <button
            onClick={() => addToast('Browsing available new projects...', 'info')}
            className="bg-[#6D28D9] hover:bg-purple-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Browse New Projects
          </button>
        </div>

        {/* ================= TOP 4 SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Card 1: Total Projects */}
          <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Total Projects</div>
              <div className="text-2xl font-extrabold text-gray-900">5</div>
              <p className="text-xs text-gray-400">Everything in one place</p>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E6F8F0] text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Completed</div>
              <div className="text-2xl font-extrabold text-gray-900">2</div>
              <p className="text-xs text-gray-400">40% completion rate</p>
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 fill-[#7C3AED]" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">In Progress</div>
              <div className="text-2xl font-extrabold text-gray-900">2</div>
              <p className="text-xs text-gray-400">Currently working</p>
            </div>
          </div>

          {/* Card 4: Overdue */}
          <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF4E5] text-[#F97316] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Overdue</div>
              <div className="text-2xl font-extrabold text-gray-900">1</div>
              <p className="text-xs text-gray-400">Needs your attention</p>
            </div>
          </div>

        </div>

        {/* ================= FILTER & SEARCH TOOLBAR ================= */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'All', label: 'All Projects (5)' },
              { id: 'In Progress', label: 'In Progress (2)' },
              { id: 'Assigned', label: 'Assigned (1)' },
              { id: 'Ready for Review', label: 'Ready for Review (1)' },
              { id: 'Completed', label: 'Completed (1)' },
              { id: 'Overdue', label: 'Overdue (1)' },
            ].map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    active
                      ? 'bg-[#F0EBFE] text-[#7C3AED] font-bold shadow-2xs'
                      : 'bg-gray-100/70 text-gray-600 hover:bg-gray-200/60'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Search, Sort, View Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#7C3AED] w-48 shadow-2xs"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-xl text-gray-700 shadow-2xs hover:bg-gray-50">
                Last Updated <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#F0EBFE] text-[#7C3AED]' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#F0EBFE] text-[#7C3AED]' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* ================= PROJECT CARDS GRID (3 COLS) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between ${p.borderLeft}`}
            >
              <div className="p-4">
                {/* Top Row: Thumbnail + Content */}
                <div className="flex items-start gap-3 mb-3">
                  {/* Thumbnail Image with Duration Badge */}
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-gray-900 shrink-0">
                    <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono text-white bg-black/60 px-1 py-0.2 rounded">
                      {p.duration}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <h3 className="text-sm font-bold text-gray-900 truncate leading-snug">{p.title}</h3>
                      <button className="text-gray-400 hover:text-gray-700 shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1.5">{p.clientName}</p>
                    
                    {/* Status Pill & Overdue / Completed Text */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        p.status === 'Completed'
                          ? 'bg-[#E6F8F0] text-[#10B981]'
                          : p.status === 'In Progress'
                          ? 'bg-[#F0EBFE] text-[#7C3AED]'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        • {p.status}
                      </span>

                      {p.overdueText && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#EF4444]">
                          <Clock className="w-3 h-3 text-[#EF4444]" /> {p.overdueText}
                        </span>
                      )}

                      {p.completedDate && (
                        <span className="flex items-center gap-1 text-xs font-medium text-[#10B981]">
                          <CheckCircle2 className="w-3 h-3" /> Completed on {p.completedDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar Row */}
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${p.status === 'Completed' ? 'bg-[#10B981]' : 'bg-[#7C3AED]'}`} 
                      style={{ width: `${p.progress}%` }} 
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{p.progress}%</span>
                </div>

                {/* Skill Tags Row */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {p.skills.map((s) => (
                    <span key={s} className="px-2.5 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Card Footer: Date / Rating & Action Button */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  {p.rating ? (
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{p.rating} <span className="text-[11px] text-gray-400 font-normal">(Client rated)</span></span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Assigned: {p.assignedDate}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleActionClick(p)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      p.status === 'In Progress'
                        ? 'bg-[#6D28D9] text-white hover:bg-purple-800 shadow-2xs'
                        : 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {p.status === 'In Progress' ? 'Mark ready for review' : p.status === 'Assigned' ? 'Start working' : 'View details'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Card 6: "Looking for more projects?" CTA Box */}
          <div className="border-2 border-dashed border-purple-200 bg-purple-50/20 rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[240px]">
            <div className="w-10 h-10 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center mb-3">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Looking for more projects?</h3>
            <p className="text-xs text-gray-500 mb-4 max-w-xs">
              Browse and apply for new editing opportunities
            </p>
            <button
              onClick={() => addToast('Opening project catalog...', 'info')}
              className="bg-[#6D28D9] hover:bg-purple-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              + Browse New Projects
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
