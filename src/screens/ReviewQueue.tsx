import { useState } from 'react';
import { Card, Modal, Textarea } from '@/components/ui';
import { useApp } from '@/context';
import {
  Inbox,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  MapPin,
  Play,
  Check,
  RotateCcw,
  MoreVertical,
} from 'lucide-react';

interface ReviewQueueProps {
  onNavigate: (route: string) => void;
}

export function ReviewQueue({ onNavigate }: ReviewQueueProps) {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'ready' | 'returned'>('all');
  const [projectFilter, setProjectFilter] = useState('All');
  const [editorFilter, setEditorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [sendBackItem, setSendBackItem] = useState<any | null>(null);
  const [feedback, setFeedback] = useState('');

  // 4 Detailed Review Queue Submissions matching reference mock
  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-1',
      editorName: 'Elena Rodriguez',
      editorAvatar: 'https://i.pravatar.cc/150?u=elena',
      campaign: 'Aurora Skincare — Q4 Launch Campaign',
      location: 'New York, NY',
      taskTitle: 'Instagram Reel Series (5x)',
      taskSkill: 'Reels Editing',
      taskStatus: 'Ready for review',
      driveLink: 'https://drive.google.com/aurora-reels',
      thumbnail:
        'https://images.pexels.com/photos/3756879/pexels-photo-3756879.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '00:48',
      submittedTime: '1h ago',
      dueDate: 'May 20, 2025',
      status: 'Ready for review',
    },
    {
      id: 'sub-2',
      editorName: 'Leo Tanaka',
      editorAvatar: 'https://i.pravatar.cc/150?u=leo',
      campaign: 'Aurora Skincare — Q4 Launch Campaign',
      location: 'Tokyo, Japan',
      taskTitle: 'Thumbnail Design Package',
      taskSkill: 'Thumbnail Design',
      taskStatus: 'Ready for review',
      driveLink: 'https://drive.google.com/aurora-thumbs',
      thumbnail:
        'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '00:15',
      submittedTime: '3h ago',
      dueDate: 'May 20, 2025',
      status: 'Ready for review',
    },
    {
      id: 'sub-3',
      editorName: 'Lucas Moreira',
      editorAvatar: 'https://i.pravatar.cc/150?u=lucas',
      campaign: 'TechFlow SaaS — Product Demo Series',
      location: 'São Paulo, Brazil',
      taskTitle: 'Social Teasers (4x)',
      taskSkill: 'Reels Editing',
      taskStatus: 'Ready for review',
      driveLink: 'https://drive.google.com/techflow-teasers',
      thumbnail:
        'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '',
      submittedTime: '5h ago',
      dueDate: 'May 21, 2025',
      status: 'Ready for review',
    },
    {
      id: 'sub-4',
      editorName: 'James Wilson',
      editorAvatar: 'https://i.pravatar.cc/150?u=james',
      campaign: "The Founder's Journey — Podcast S2",
      location: 'Chicago, IL',
      taskTitle: 'Promo Reels (3x)',
      taskSkill: 'Reels Editing',
      taskStatus: 'Ready for review',
      driveLink: 'https://drive.google.com/promo-reels',
      thumbnail:
        'https://images.pexels.com/photos/4050245/pexels-photo-4050245.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '00:45',
      submittedTime: '1d ago',
      dueDate: 'May 22, 2025',
      status: 'Ready for review',
    },
  ]);

  const handleApprove = (id: string, title: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    addToast(`"${title}" approved successfully`, 'success');
  };

  const handleSendBackConfirm = () => {
    if (!sendBackItem || !feedback.trim()) return;
    setSubmissions((prev) => prev.filter((s) => s.id !== sendBackItem.id));
    addToast(`"${sendBackItem.taskTitle}" sent back with feedback`, 'info');
    setSendBackItem(null);
    setFeedback('');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-violet-100/80 text-violet-600 flex items-center justify-center shrink-0">
          <Inbox className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review Queue</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Submissions from editors awaiting your review
          </p>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-50/80 border border-gray-200/80 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-violet-50 text-violet-700 border border-violet-100 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All (8)
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ready'
                ? 'bg-violet-50 text-violet-700 border border-violet-100 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ready for review (6)
          </button>
          <button
            onClick={() => setActiveTab('returned')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'returned'
                ? 'bg-violet-50 text-violet-700 border border-violet-100 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Returned (2)
          </button>
        </div>

        {/* Right Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <span>Project: {projectFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <span>Editor: {editorFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <span>Status: {statusFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span>Sort by: {sortBy}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Review Queue Submission Cards Stack (Compact & Sleek) */}
      <div className="space-y-3">
        {submissions.map((item) => (
          <Card
            key={item.id}
            className="p-3.5 sm:p-4 bg-white border border-gray-100 rounded-xl shadow-2xs hover:shadow-md transition-all relative"
          >
            <button className="absolute top-3.5 right-3.5 text-gray-300 hover:text-gray-500 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pr-6">
              {/* Column 1: Editor Info (3 cols) */}
              <div className="lg:col-span-3 flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <img
                    src={item.editorAvatar}
                    alt={item.editorName}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-xs truncate">{item.editorName}</h3>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.campaign}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span>{item.location}</span>
                  </p>
                </div>
              </div>

              {/* Column 2: Task Info & Drive Link (3 cols) */}
              <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-2.5 lg:pt-0 lg:pl-4 space-y-1.5">
                <h4 className="font-bold text-gray-900 text-xs truncate">{item.taskTitle}</h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[10.5px] font-semibold rounded-full border border-violet-100">
                    {item.taskSkill}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[10.5px] font-semibold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {item.taskStatus}
                  </span>
                </div>
                <a
                  href={item.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-violet-600 font-semibold hover:underline mt-0.5 group"
                >
                  <span className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-600 flex items-center justify-center text-[7px] text-white font-bold shrink-0">
                    ▲
                  </span>
                  <span className="truncate">{item.driveLink}</span>
                  <ExternalLink className="w-3 h-3 text-violet-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Column 3: Video Preview Thumbnail (3 cols) */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="relative w-32 h-18 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group cursor-pointer">
                  <img
                    src={item.thumbnail}
                    alt={item.taskTitle}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
                      <Play className="w-3 h-3 fill-gray-900 ml-0.5" />
                    </div>
                  </div>
                  {item.duration && (
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/75 text-white text-[9px] font-medium rounded shadow-2xs">
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Column 4: Submission Meta & Actions (3 cols) */}
              <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3">
                <div className="text-left lg:text-right space-y-0.5">
                  <div className="flex items-center gap-1 lg:justify-end">
                    <span className="text-[10px] text-gray-400 font-medium">Submitted</span>
                    <span className="text-[11px] font-bold text-gray-900">{item.submittedTime}</span>
                  </div>
                  <div className="flex items-center gap-1 lg:justify-end">
                    <span className="text-[10px] text-gray-400 font-medium">Due</span>
                    <span className="text-[11px] font-bold text-gray-900">{item.dueDate}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(item.id, item.taskTitle)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors w-full sm:w-28"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => setSendBackItem(item)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors w-full sm:w-28"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                    <span>Send back</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-gray-500">
        <span>Showing 1 to 8 of 8 submissions</span>

        <div className="flex items-center gap-1.5">
          <button
            disabled
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 opacity-40 cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center bg-violet-50 text-violet-700 border border-violet-600">
            1
          </button>
          <button className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Send Back Revision Modal */}
      <Modal
        open={!!sendBackItem}
        onClose={() => setSendBackItem(null)}
        title="Send back for revision"
      >
        <div className="space-y-4 pt-2">
          <div>
            <span className="text-xs text-gray-400 font-medium">Task</span>
            <p className="text-sm font-bold text-gray-900">{sendBackItem?.taskTitle}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sendBackItem?.campaign}</p>
          </div>

          <Textarea
            label="Feedback (required)"
            rows={4}
            placeholder="Explain what changes or revisions are required from the editor..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setSendBackItem(null)}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendBackConfirm}
              disabled={!feedback.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Send back
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

