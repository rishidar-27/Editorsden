import { useState, useMemo } from 'react';
import { Card, Button, Badge, Modal, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import {
  HardDrive,
  Trash2,
  UploadCloud,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Film,
  Video,
  FileVideo,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Play,
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  Download,
  Info,
  Check,
  X,
  FileText,
} from 'lucide-react';
import type { EditorAsset } from '@/types';

// Default enriched mock assets for Marcus / demo preview
const demoMockAssets: EditorAsset[] = [
  {
    id: 'asset-demo-1',
    editorId: 'e1',
    subtaskId: 'st-1',
    fileName: 'Aurora_Hero_Commercial_4K_FinalCut_v3.mp4',
    fileSizeBytes: 320000000, // 320 MB
    mimeType: 'video/mp4',
    r2Key: 'editors/e1/subtasks/st-1/Aurora_Hero_Commercial_4K_FinalCut_v3.mp4',
    publicUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    createdAt: '2026-08-25T14:30:00Z',
  },
  {
    id: 'asset-demo-2',
    editorId: 'e1',
    subtaskId: 'st-2',
    fileName: 'Instagram_Reels_Cutdown_Pack_5x_1080p.mp4',
    fileSizeBytes: 185000000, // 185 MB
    mimeType: 'video/mp4',
    r2Key: 'editors/e1/subtasks/st-2/Instagram_Reels_Cutdown_Pack_5x_1080p.mp4',
    publicUrl: 'https://images.unsplash.com/photo-1608248597263-0057e43a4524?w=800',
    createdAt: '2026-08-24T11:15:00Z',
  },
  {
    id: 'asset-demo-3',
    editorId: 'e1',
    subtaskId: 'st-3',
    fileName: 'TechFlow_Motion_Graphics_Package_ProRes.mov',
    fileSizeBytes: 125000000, // 125 MB
    mimeType: 'video/quicktime',
    r2Key: 'editors/e1/subtasks/st-3/TechFlow_Motion_Graphics_Package_ProRes.mov',
    publicUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    createdAt: '2026-08-22T09:40:00Z',
  },
  {
    id: 'asset-demo-4',
    editorId: 'e1',
    subtaskId: 'st-4',
    fileName: 'Aurora_Draft_Rough_Cut_WorkInProgress.mp4',
    fileSizeBytes: 85000000, // 85 MB
    mimeType: 'video/mp4',
    r2Key: 'editors/e1/subtasks/st-4/Aurora_Draft_Rough_Cut_WorkInProgress.mp4',
    publicUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
    createdAt: '2026-08-15T18:20:00Z',
  },
  {
    id: 'asset-demo-5',
    editorId: 'e1',
    subtaskId: 'st-5',
    fileName: 'YouTube_Podcast_Episode_Teaser_AudioVisualizer.mp4',
    fileSizeBytes: 42000000, // 42 MB
    mimeType: 'video/mp4',
    r2Key: 'editors/e1/subtasks/st-5/YouTube_Podcast_Episode_Teaser_AudioVisualizer.mp4',
    publicUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    createdAt: '2026-08-12T16:00:00Z',
  },
];

export function EditorStorageManager() {
  const { getCurrentEditor, assets, getEditorStorageStats, deleteEditorAssets, addEditorAsset, upgradeStorageTier, addToast } = useApp();
  const editor = getCurrentEditor();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewAsset, setPreviewAsset] = useState<EditorAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'MP4' | 'MOV' | 'Drafts'>('All');
  const [sortBy, setSortBy] = useState<'largest' | 'newest' | 'smallest'>('largest');

  const editorId = editor?.id || 'e1';
  const rawAssets = assets.filter((a) => a.editorId === editorId);
  const displayAssetsList = rawAssets.length > 0 ? rawAssets : demoMockAssets;

  const storageStats = getEditorStorageStats(editorId);
  const calculatedUsedBytes = displayAssetsList.reduce((sum, a) => sum + a.fileSizeBytes, 0);
  const storageLimitBytes = storageStats.storageLimitBytes || 1073741824; // 1 GB
  const usedMB = Math.round(calculatedUsedBytes / (1024 * 1024));
  const limitMB = Math.round(storageLimitBytes / (1024 * 1024));
  const percentageUsed = Math.min(100, Math.round((calculatedUsedBytes / storageLimitBytes) * 100));

  const isNearLimit = percentageUsed >= 80;
  const isOverLimit = percentageUsed >= 100;

  // Filter and sort display assets
  const filteredAssets = useMemo(() => {
    let list = [...displayAssetsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((a) => a.fileName.toLowerCase().includes(q) || a.r2Key.toLowerCase().includes(q));
    }

    if (filterType === 'MP4') {
      list = list.filter((a) => a.fileName.endsWith('.mp4'));
    } else if (filterType === 'MOV') {
      list = list.filter((a) => a.fileName.endsWith('.mov'));
    } else if (filterType === 'Drafts') {
      list = list.filter((a) => a.fileName.toLowerCase().includes('draft') || a.fileName.toLowerCase().includes('rough'));
    }

    if (sortBy === 'largest') {
      list.sort((a, b) => b.fileSizeBytes - a.fileSizeBytes);
    } else if (sortBy === 'smallest') {
      list.sort((a, b) => a.fileSizeBytes - b.fileSizeBytes);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [displayAssetsList, searchQuery, filterType, sortBy]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAssets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAssets.map((a) => a.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const { freedBytes } = await deleteEditorAssets(editorId, selectedIds);
    const freedMB = Math.round((freedBytes || 150000000) / (1024 * 1024));
    addToast(`Successfully deleted ${selectedIds.length} asset(s) and freed up ${freedMB} MB!`, 'success');
    setSelectedIds([]);
  };

  const handleCleanOldDrafts = async () => {
    const draftIds = displayAssetsList
      .filter((a) => a.fileName.toLowerCase().includes('draft') || a.fileName.toLowerCase().includes('rough'))
      .map((a) => a.id);

    if (draftIds.length === 0) {
      addToast('No old draft files found to clean up.', 'info');
      return;
    }

    await deleteEditorAssets(editorId, draftIds);
    addToast(`Cleaned up ${draftIds.length} old draft cuts! Your bucket is refreshed.`, 'success');
    setSelectedIds([]);
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (calculatedUsedBytes + file.size > storageLimitBytes) {
      addToast('Storage quota exceeded! Please clean up old assets or upgrade your plan.', 'error');
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            const newAsset: EditorAsset = {
              id: `asset-${Date.now()}`,
              editorId,
              fileName: file.name,
              fileSizeBytes: file.size || 180000000,
              mimeType: file.type || 'video/mp4',
              r2Key: `editors/${editorId}/subtasks/st-upload/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
              publicUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
              createdAt: new Date().toISOString(),
            };
            addEditorAsset(newAsset);
            setIsUploading(false);
            setUploadProgress(0);
            addToast(`"${file.name}" uploaded directly to Cloudflare R2 bucket!`, 'success');
          }, 350);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleSelectTier = (tier: 'Free' | 'Pro_50GB' | 'Studio_200GB') => {
    upgradeStorageTier(editorId, tier);
    setIsUpgradeModalOpen(false);
    addToast(`Storage upgraded to ${tier === 'Pro_50GB' ? '50 GB' : '200 GB'} plan!`, 'success');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <HardDrive className="w-7 h-7 text-gray-900" />
            Storage & Cloud Assets
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your Cloudflare R2 video storage bucket, monitor your 1 GB limit, and clean old draft cuts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUpgradeModalOpen(true)}
            className="border-gray-300 text-gray-900 bg-gray-50 hover:bg-gray-100 font-bold text-xs shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-gray-900" />
            Upgrade Storage Plan
          </Button>
        </div>
      </div>

      {/* 4 Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Used Capacity */}
        <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Storage Used</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {usedMB} <span className="text-sm font-semibold text-gray-400">/ {limitMB} MB</span>
            </h2>
            <span className={`text-xs font-bold ${isNearLimit ? 'text-amber-600' : 'text-emerald-600'}`}>
              {percentageUsed}%
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium block mt-1">
            Free Tier Quota (1,024 MB)
          </span>
        </Card>

        {/* Card 2: Zero Egress Bandwidth */}
        <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Bandwidth Cost</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-600 tracking-tight">$0.00</h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Zero Egress
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium block mt-1">
            Unlimited video playback for clients
          </span>
        </Card>

        {/* Card 3: Files in Bucket */}
        <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Files Stored</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {displayAssetsList.length} <span className="text-sm font-semibold text-gray-400">videos</span>
            </h2>
            <span className="text-xs font-bold text-gray-900">Cloudflare R2</span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium block mt-1">
            ProRes, MP4, MOV masters
          </span>
        </Card>

        {/* Card 4: Bucket Hygiene */}
        <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Bucket Hygiene</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Good</h2>
            <span className="text-xs font-bold text-amber-600">2 Old Drafts</span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium block mt-1">
            Clean drafts to free 85 MB
          </span>
        </Card>
      </div>

      {/* Main Quota Gauge Card */}
      <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Current Storage Tier:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gray-900 text-white">
                1 GB Free Creator Tier
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You have <span className="font-bold text-gray-800">{limitMB - usedMB} MB</span> available before reaching the free cap.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCleanOldDrafts}
              className="text-xs font-semibold text-gray-700 hover:text-red-600 hover:border-red-200"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clean Draft Cuts (85 MB)
            </Button>
          </div>
        </div>

        {/* Dynamic Storage Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverLimit
                  ? 'bg-red-500'
                  : isNearLimit
                  ? 'bg-amber-500'
                  : 'bg-gray-900'
              }`}
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 font-medium">
            <span>0 MB</span>
            <span className="text-gray-500 font-semibold">{percentageUsed}% used of 1,024 MB</span>
            <span>1,024 MB</span>
          </div>
        </div>
      </Card>

      {/* 2-Column Section: Direct Upload & Assets Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Direct Upload Box (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-gray-900" />
                Upload New Deliverable
              </h3>
              <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                Cloudflare R2
              </span>
            </div>

            <div className="border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100/70 transition-colors rounded-2xl p-6 text-center space-y-3 relative cursor-pointer group">
              <input
                type="file"
                accept="video/*"
                onChange={handleSimulatedFileUpload}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-105 transition-transform">
                <FileVideo className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Click or drag video file here</p>
                <p className="text-[11px] text-gray-400 mt-0.5">MP4, MOV, ProRes up to 500 MB</p>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-1.5 p-3 bg-gray-100 rounded-xl border border-gray-200">
                <div className="flex justify-between text-xs font-bold text-gray-900">
                  <span>Uploading to R2...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gray-900 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-[11.5px] text-gray-800 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                How the 1 GB bucket works:
              </span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                When you submit deliverables for clients, they store directly in your Cloudflare R2 bucket. Once client approval is complete, you can delete old raw files to reset your space without paying!
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: Bucket Assets Manager Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
            {/* Top Toolbar */}
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-sm">
                    Stored Video Files ({filteredAssets.length})
                  </h3>
                </div>

                {/* Bulk Action Button */}
                {selectedIds.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSelected}
                    className="text-xs font-bold shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete Selected ({selectedIds.length})
                  </Button>
                )}
              </div>

              {/* Search & Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search file name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  {(['All', 'MP4', 'MOV', 'Drafts'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        filterType === t
                          ? 'bg-gray-900 text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as never)}
                    className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg border-none focus:outline-none cursor-pointer"
                  >
                    <option value="largest">Sort: Largest First</option>
                    <option value="smallest">Sort: Smallest First</option>
                    <option value="newest">Sort: Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Assets Table */}
            {filteredAssets.length === 0 ? (
              <div className="p-12 text-center">
                <EmptyState
                  icon={<HardDrive className="w-10 h-10 text-gray-400" />}
                  title="No video files found"
                  description="Try changing your search query or reset your filter pills."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === filteredAssets.length && filteredAssets.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-gray-900 focus:ring-gray-400 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4">ASSET NAME</th>
                      <th className="py-3 px-4">FORMAT</th>
                      <th className="py-3 px-4">SIZE</th>
                      <th className="py-3 px-4">UPLOADED</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                    {filteredAssets.map((asset) => {
                      const sizeMB = (asset.fileSizeBytes / (1024 * 1024)).toFixed(1);
                      const isSelected = selectedIds.includes(asset.id);
                      const isDraft = asset.fileName.toLowerCase().includes('draft') || asset.fileName.toLowerCase().includes('rough');

                      return (
                        <tr
                          key={asset.id}
                          className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                            isSelected ? 'bg-gray-100/70' : ''
                          }`}
                          onClick={() => toggleSelect(asset.id)}
                        >
                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(asset.id)}
                              className="rounded border-gray-300 text-gray-900 focus:ring-gray-400 cursor-pointer"
                            />
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5 max-w-[280px]">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center shrink-0">
                                <Film className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 truncate hover:text-black transition-colors" title={asset.fileName}>
                                  {asset.fileName}
                                </p>
                                <p className="text-[10px] text-gray-400 truncate">
                                  {asset.r2Key}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isDraft ? (
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                                Draft Cut
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                Master Deliverable
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                              {sizeMB} MB
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                            {new Date(asset.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setPreviewAsset(asset)}
                                className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Preview Video Details"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  await deleteEditorAssets(editorId, [asset.id]);
                                  addToast(`Deleted "${asset.fileName}" and freed space!`, 'info');
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete file"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Video Preview Modal */}
      {previewAsset && (
        <Modal
          open={!!previewAsset}
          onClose={() => setPreviewAsset(null)}
          title="Video Deliverable Preview"
        >
          <div className="space-y-4 pt-2">
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center group shadow-md">
              <img
                src={previewAsset.publicUrl}
                alt="Video Thumbnail"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-gray-900 ml-1" />
                </div>
              </div>
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-bold">
                1080p • 60 FPS
              </span>
            </div>

            <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">File Name:</span>
                <span className="font-bold text-gray-900 truncate max-w-xs">{previewAsset.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">File Size:</span>
                <span className="font-bold text-gray-900">{(previewAsset.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Storage Engine:</span>
                <span className="font-bold text-gray-900">Cloudflare R2 ($0 Egress)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">R2 Object Key:</span>
                <span className="text-[11px] text-gray-500 truncate max-w-xs font-mono">{previewAsset.r2Key}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setPreviewAsset(null)}>
                Close
              </Button>
              <a
                href={previewAsset.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Direct CDN URL
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* Upgrade Storage Tier Modal */}
      {isUpgradeModalOpen && (
        <Modal
          open={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          title="Upgrade Video Storage Bucket"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-500">
              Need more than 1 GB for high-bitrate 4K edits and large asset archives? Choose a dedicated Cloudflare R2 creator plan:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Plan 1: Pro 50GB */}
              <div className="p-4 rounded-2xl border-2 border-gray-900 bg-gray-50 space-y-3 relative">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-900 text-white uppercase tracking-wider">
                  Popular
                </span>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">Pro Editor</h4>
                  <p className="text-xs text-gray-500">50 GB High-Speed Storage</p>
                </div>
                <div className="text-2xl font-black text-gray-900">
                  $9 <span className="text-xs text-gray-400 font-normal">/ month</span>
                </div>
                <ul className="text-[11px] text-gray-600 space-y-1">
                  <li>✓ Store up to 100+ full HD videos</li>
                  <li>✓ Zero egress bandwidth costs</li>
                  <li>✓ ProRes & 4K file support</li>
                </ul>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleSelectTier('Pro_50GB')}
                  className="w-full text-xs font-bold"
                >
                  Upgrade to 50 GB
                </Button>
              </div>

              {/* Plan 2: Studio 200GB */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 space-y-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-700 uppercase tracking-wider">
                  Heavy 4K
                </span>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">Studio Pro</h4>
                  <p className="text-xs text-gray-500">200 GB High-Speed Storage</p>
                </div>
                <div className="text-2xl font-black text-gray-900">
                  $24 <span className="text-xs text-gray-400 font-normal">/ month</span>
                </div>
                <ul className="text-[11px] text-gray-600 space-y-1">
                  <li>✓ 400+ hours of video storage</li>
                  <li>✓ Dedicated CDN edge caching</li>
                  <li>✓ Priority deliverable streams</li>
                </ul>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectTier('Studio_200GB')}
                  className="w-full text-xs font-bold"
                >
                  Upgrade to 200 GB
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
