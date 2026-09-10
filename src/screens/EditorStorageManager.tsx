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
  Plus,
  AlertCircle,
} from 'lucide-react';
import type { EditorAsset } from '@/types';

export function EditorStorageManager() {
  const { getCurrentEditor, assets, getEditorStorageStats, deleteEditorAssets, addEditorAsset, addPayAsYouGoStorage, addToast } = useApp();
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
  const displayAssetsList = rawAssets;

  const storageStats = getEditorStorageStats(editorId);
  const calculatedUsedBytes = displayAssetsList.reduce((sum, a) => sum + a.fileSizeBytes, 0);
  const storageLimitBytes = storageStats.storageLimitBytes || 1073741824; // 1 GB
  const usedMB = Math.round(calculatedUsedBytes / (1024 * 1024));
  const limitMB = Math.round(storageLimitBytes / (1024 * 1024));
  const limitGB = (storageLimitBytes / (1024 * 1024 * 1024)).toFixed(1).replace(/\.0$/, '');
  const isPro = editor?.storageTier === 'Pro' || storageLimitBytes > 1073741824;
  const percentageUsed = Math.min(100, Math.round((calculatedUsedBytes / storageLimitBytes) * 100));

  const isNearLimit = percentageUsed >= 80;
  const isOverLimit = percentageUsed >= 100;

  const handleAddExtraStorage = async (additionalGB: number) => {
    await addPayAsYouGoStorage(editorId, additionalGB);
    setIsUpgradeModalOpen(false);
    addToast(`Successfully added +${additionalGB} GB extra storage! You are now a PRO Creator.`, 'success');
  };

  const draftAssets = useMemo(() => {
    return displayAssetsList.filter(
      (a) => a.fileName.toLowerCase().includes('draft') || a.fileName.toLowerCase().includes('rough')
    );
  }, [displayAssetsList]);
  const draftCount = draftAssets.length;
  const draftBytes = draftAssets.reduce((sum, a) => sum + a.fileSizeBytes, 0);
  const draftMB = Math.round(draftBytes / (1024 * 1024));

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

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <HardDrive className="w-7 h-7 text-gray-900 dark:text-zinc-100" />
              Storage & Cloud Assets
            </h1>
            {isPro ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 fill-white" />
                PRO CREATOR
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                1 GB Free Starter
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
            Manage your Cloudflare R2 video storage bucket, monitor your 1 GB free quota, and add extra storage as you go.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant={isOverLimit ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setIsUpgradeModalOpen(true)}
            className={`font-bold text-xs shadow-2xs cursor-pointer ${
              isOverLimit
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-0'
                : 'border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Extra Storage (Pay As You Go)
          </Button>
        </div>
      </div>

      {/* 4 Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Used Capacity */}
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Storage Used</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-200 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
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
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Bandwidth Cost</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">$0.00</h2>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Zero Egress
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium block mt-1">
            Unlimited video playback for clients
          </span>
        </Card>

        {/* Card 3: Files in Bucket */}
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Files Stored</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-200 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {displayAssetsList.length} <span className="text-sm font-semibold text-gray-400">videos</span>
            </h2>
            <span className="text-xs font-bold text-gray-900 dark:text-zinc-200">Cloudflare R2</span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium block mt-1">
            ProRes, MP4, MOV masters
          </span>
        </Card>

        {/* Card 4: Bucket Hygiene */}
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Bucket Hygiene</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              draftCount > 0
                ? 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {draftCount > 0 ? 'Review' : 'Clean'}
            </h2>
            <span className={`text-xs font-bold ${draftCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {draftCount} {draftCount === 1 ? 'Old Draft' : 'Old Drafts'}
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium block mt-1">
            {draftCount > 0 ? `Clean drafts to free ${draftMB} MB` : 'No redundant draft cuts'}
          </span>
        </Card>
      </div>

      {/* Main Quota Gauge Card */}
      <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Current Storage Tier:
              </span>
              {isPro ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 fill-white" />
                  PRO CREATOR ({limitGB} GB)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gray-900 dark:bg-zinc-800 text-white dark:text-zinc-200">
                  1 GB Free Starter Tier
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              {isOverLimit ? (
                <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1 inline-flex">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Storage limit reached! Add pay-as-you-go extra storage to resume uploading deliverables.
                </span>
              ) : (
                <>
                  You have <span className="font-bold text-gray-800 dark:text-white">{Math.max(0, limitMB - usedMB)} MB</span> available before reaching your {limitGB} GB bucket limit.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {draftCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCleanOldDrafts}
                className="text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:text-red-600 hover:border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clean Draft Cuts ({draftMB} MB)
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white border-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Extra Storage
            </Button>
          </div>
        </div>

        {/* Dynamic Storage Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full bg-gray-100 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverLimit
                  ? 'bg-red-500'
                  : isNearLimit
                  ? 'bg-amber-500'
                  : 'bg-gray-900 dark:bg-zinc-100'
              }`}
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 font-medium">
            <span>0 MB</span>
            <span className="text-gray-500 dark:text-zinc-400 font-semibold">{percentageUsed}% used of {limitMB.toLocaleString()} MB ({limitGB} GB)</span>
            <span>{limitGB} GB</span>
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

      {/* Pay-As-You-Go Extra Storage Modal */}
      {isUpgradeModalOpen && (
        <Modal
          open={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          title="Add Extra Video Storage (Pay As You Go)"
        >
          <div className="space-y-4 pt-2">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">1 GB is permanently Free for every editor!</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Need more space for 4K edits and large deliverables? Pay as you go on-demand with zero recurring subscriptions. Any top-up permanently upgrades your account to <span className="font-bold">PRO Creator</span> status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: +5 GB */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-600 space-y-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                  Quick Top-Up
                </span>
                <div>
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-base">+5 GB Storage</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Expand bucket instantly</p>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  $2.50 <span className="text-xs text-gray-400 font-normal">one-time</span>
                </div>
                <ul className="text-[11px] text-gray-600 dark:text-zinc-400 space-y-1">
                  <li>✓ 10–15 full HD video cuts</li>
                  <li>✓ Permanent PRO Creator badge</li>
                  <li>✓ Zero monthly commitments</li>
                </ul>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddExtraStorage(5)}
                  className="w-full text-xs font-bold cursor-pointer"
                >
                  Add +5 GB ($2.50)
                </Button>
              </div>

              {/* Option 2: +15 GB (Popular) */}
              <div className="p-4 rounded-2xl border-2 border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 space-y-3 relative">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white uppercase tracking-wider">
                  Most Popular
                </span>
                <div>
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-base">+15 GB Storage</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">High bitrate & 4K cuts</p>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  $6.00 <span className="text-xs text-gray-400 font-normal">one-time</span>
                </div>
                <ul className="text-[11px] text-gray-600 dark:text-zinc-400 space-y-1">
                  <li>✓ 35+ client deliverables</li>
                  <li>✓ Permanent PRO Creator badge</li>
                  <li>✓ Direct CDN fast playback</li>
                </ul>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleAddExtraStorage(15)}
                  className="w-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white border-0 cursor-pointer"
                >
                  Add +15 GB ($6.00)
                </Button>
              </div>

              {/* Option 3: +50 GB */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-600 space-y-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                  Power Creator
                </span>
                <div>
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-base">+50 GB Storage</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Heavy multi-project archive</p>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  $15.00 <span className="text-xs text-gray-400 font-normal">one-time</span>
                </div>
                <ul className="text-[11px] text-gray-600 dark:text-zinc-400 space-y-1">
                  <li>✓ 120+ video versions & drafts</li>
                  <li>✓ Permanent PRO Creator badge</li>
                  <li>✓ High concurrency downloads</li>
                </ul>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddExtraStorage(50)}
                  className="w-full text-xs font-bold cursor-pointer"
                >
                  Add +50 GB ($15.00)
                </Button>
              </div>

              {/* Option 4: +100 GB */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-600 space-y-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900 uppercase tracking-wider">
                  Studio Scale
                </span>
                <div>
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-base">+100 GB Storage</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Maximum speed & headroom</p>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  $25.00 <span className="text-xs text-gray-400 font-normal">one-time</span>
                </div>
                <ul className="text-[11px] text-gray-600 dark:text-zinc-400 space-y-1">
                  <li>✓ 250+ full productions</li>
                  <li>✓ Permanent PRO Creator badge</li>
                  <li>✓ Zero egress or bandwidth caps</li>
                </ul>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddExtraStorage(100)}
                  className="w-full text-xs font-bold cursor-pointer"
                >
                  Add +100 GB ($25.00)
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
