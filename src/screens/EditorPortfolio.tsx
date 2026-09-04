import { useState } from 'react';
import { useApp } from '@/context';
import { 
  Plus, 
  Star, 
  X, 
  Upload, 
  Link2, 
  Calendar, 
  Clock, 
  Globe, 
  Instagram, 
  Image as ImageIcon,
  Folder,
  Check,
  Eye,
  GripVertical,
  MoreHorizontal
} from 'lucide-react';
import type { PortfolioItem, Skill } from '@/types';

export function EditorPortfolio() {
  const { getCurrentEditor, updateEditor, addToast } = useApp();
  const editor = getCurrentEditor();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');

  // Form states for the "Add portfolio item" modal
  const [title, setTitle] = useState('');
  const [projectType, setProjectType] = useState('Commercial Ads');
  const [client, setClient] = useState('');
  const [role, setRole] = useState('Video Editor');
  const [dateCompleted, setDateCompleted] = useState('2026-05-20');
  const [duration, setDuration] = useState('01:20');
  const [videoLink, setVideoLink] = useState('https://youtube.com/watch?v=demo');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800');
  const [description, setDescription] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>(['Premiere Pro', 'After Effects', 'Color Grading']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [instagramLink, setInstagramLink] = useState('');
  const [featured, setFeatured] = useState(true);
  const [visibility, setVisibility] = useState('Public');

  if (!editor) return null;

  const portfolio = editor.portfolio || [];
  const featuredCount = portfolio.filter((p) => p.featured).length;

  const updatePortfolio = (items: PortfolioItem[]) => {
    updateEditor(editor.id, { portfolio: items, lastPortfolioUpdate: new Date().toISOString() });
  };

  const toggleFeatured = (id: string) => {
    const item = portfolio.find((p) => p.id === id);
    if (item && !item.featured && featuredCount >= 3) {
      addToast('You can only feature 3 items. Unfeature one first.', 'error');
      return;
    }
    updatePortfolio(portfolio.map((p) => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  const removeItem = (id: string) => {
    updatePortfolio(portfolio.filter((p) => p.id !== id));
    addToast('Portfolio item removed', 'info');
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skillsList.includes(newSkillInput.trim())) {
      setSkillsList([...skillsList, newSkillInput.trim()]);
      setNewSkillInput('');
      setShowSkillInput(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleAddToPortfolio = () => {
    if (!title) {
      addToast('Please enter a project title', 'error');
      return;
    }

    const newItem: PortfolioItem = {
      id: `p${Date.now()}`,
      title: title,
      type: activeTab === 'upload' ? 'video' : 'link',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
      link: videoLink || 'https://youtube.com/watch?v=demo',
      featured: featured && featuredCount < 3,
    };

    updatePortfolio([newItem, ...portfolio]);
    addToast('Portfolio item added successfully!', 'success');
    setShowAddModal(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setClient('');
  };

  return (
    <div className="bg-[#FAF9FF] dark:bg-[#09090B] min-h-screen py-8 px-4 lg:px-8 font-sans text-gray-900 dark:text-zinc-100 transition-colors">
      <div className="max-w-[1140px] mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Portfolio</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Drag to reorder. Star up to 3 items</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Star Featured Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200/80 bg-[#FFFBEB] text-amber-700 text-xs font-semibold shadow-2xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{featuredCount} / 3 featured</span>
            </div>

            {/* Add Work Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gray-900 hover:bg-black text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add work
            </button>
          </div>
        </div>

        {/* Portfolio Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Media Thumbnail Overlay */}
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />
                
                {/* Top Star Feature Button */}
                <button
                  onClick={() => toggleFeatured(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-400/90 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                  <Star className={`w-4 h-4 ${item.featured ? 'fill-white' : ''}`} />
                </button>

                {/* Bottom Overlay Pills & Duration */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full backdrop-blur-md ${
                    item.featured ? 'bg-red-500/90 text-white' : 'bg-white/80 text-gray-800'
                  }`}>
                    • {item.featured ? 'Featured' : 'Not featured'}
                  </span>
                  <span className="text-xs font-mono font-medium text-white/90 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    00:45
                  </span>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-900 truncate mb-1">{item.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-gray-400" />
                    <span>Personal Project</span>
                    <span>•</span>
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>May 20, 2026</span>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Drag and Drop Banner */}
        <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
          <GripVertical className="w-6 h-6 text-gray-700 mb-1.5" />
          <h4 className="text-sm font-bold text-gray-900">Drag & drop to reorder your works</h4>
          <p className="text-xs text-gray-500 mt-0.5">Anyone can see up to 3 works on your public profile.</p>
        </div>

      </div>

      {/* ================= ADD PORTFOLIO ITEM MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div 
            className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto scrollbar-thin p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h2 className="text-lg font-extrabold text-gray-900">Add portfolio item</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top 2 Tab Option Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'border-gray-900 bg-gray-50 text-gray-900'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-5 h-5 text-gray-900" />
                <span className="text-xs font-bold">Upload video file</span>
                <span className="text-[10px] text-gray-400">MP4, MOV up to 2GB</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('link')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1.5 ${
                  activeTab === 'link'
                    ? 'border-gray-900 bg-gray-50 text-gray-900'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Link2 className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-bold text-gray-900">Paste a link</span>
                <span className="text-[10px] text-gray-400">YouTube, Vimeo, Drive, etc.</span>
              </button>
            </div>

            {/* SECTION 1: PROJECT DETAILS */}
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-900 tracking-wider uppercase mb-3">PROJECT DETAILS</h3>
              
              {/* Title & Project Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Brand Commercial — Aurora Skincare"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Project type *</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                  >
                    <option value="Commercial Ads">Commercial Ads</option>
                    <option value="Reels Editing">Reels Editing</option>
                    <option value="YouTube Editing">YouTube Editing</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Podcast Editing">Podcast Editing</option>
                    <option value="Color Grading">Color Grading</option>
                  </select>
                </div>
              </div>

              {/* Client & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Client / Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Aurora Skincare"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                  >
                    <option value="Video Editor">Video Editor</option>
                    <option value="Lead Editor & Motion Designer">Lead Editor & Motion Designer</option>
                    <option value="Colorist">Colorist</option>
                    <option value="Sound Editor">Sound Editor</option>
                  </select>
                </div>
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date completed</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateCompleted}
                      onChange={(e) => setDateCompleted(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Video duration (optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 01:20"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: MEDIA */}
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-900 tracking-wider uppercase mb-3">MEDIA</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                {/* Video Link */}
                <div className="sm:col-span-7">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Video link *</label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 mb-1"
                  />
                  <p className="text-[10px] text-gray-400">Supports YouTube, Vimeo, Google Drive and more.</p>
                </div>

                {/* Thumbnail Dropzone & Preview Box */}
                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Thumbnail *</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-20 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors">
                      <ImageIcon className="w-4 h-4 text-gray-700 mb-0.5" />
                      <span className="text-[11px] font-bold text-gray-900">Upload thumbnail</span>
                      <span className="text-[9px] text-gray-400">JPG, PNG up to 5MB</span>
                    </div>

                    {/* Thumbnail Preview Box */}
                    {thumbnailUrl && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                        <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setThumbnailUrl('')}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: DESCRIPTION */}
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-900 tracking-wider uppercase mb-1">DESCRIPTION</h3>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Short description (optional)</label>
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Describe your project, the goal, and your creative approach..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 resize-none"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-400">
                  {description.length} / 500
                </span>
              </div>
            </div>

            {/* SECTION 4: TOOLS & SKILLS & LINKS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Tools & Skills */}
              <div>
                <h3 className="text-[11px] font-bold text-gray-900 tracking-wider uppercase mb-2">TOOLS & SKILLS</h3>
                <div className="flex flex-wrap items-center gap-1.5">
                  {skillsList.map((sk) => (
                    <span key={sk} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-900 text-xs font-semibold">
                      {sk}
                      <button type="button" onClick={() => handleRemoveSkill(sk)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  
                  {showSkillInput ? (
                    <input
                      type="text"
                      autoFocus
                      placeholder="Skill..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      onBlur={handleAddSkill}
                      className="w-20 px-2 py-0.5 text-xs border border-gray-300 rounded-lg outline-none"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSkillInput(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-900 text-xs font-medium transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add more
                    </button>
                  )}
                </div>
              </div>

              {/* Links (Optional) */}
              <div>
                <h3 className="text-[11px] font-bold text-gray-900 tracking-wider uppercase mb-2">LINKS (OPTIONAL)</h3>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Instagram link</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://instagram.com/username"
                    value={instagramLink}
                    onChange={(e) => setInstagramLink(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 pr-9"
                  />
                  <Instagram className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* SECTION 5: PORTFOLIO SETTINGS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
              {/* Feature checkbox */}
              <div>
                <h3 className="text-[11px] font-bold text-gray-900 tracking-wider uppercase mb-2">PORTFOLIO SETTINGS</h3>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-400"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Feature on my profile
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 block mt-0.5">3 / 3 featured</span>
                  </div>
                </label>
              </div>

              {/* Visibility Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Visibility</label>
                <div className="relative">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 appearance-none"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                  <Globe className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Anyone can see this on your public profile.</p>
              </div>
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddToPortfolio}
                className="px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors shadow-xs"
              >
                Add to portfolio
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
