import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initialEditors, initialProjects } from './data.js';
import { generateUploadUrl, deleteR2Files } from './r2.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const serverStartTime = Date.now();

app.use(cors());
app.use(express.json());

// In-Memory State Store (Falls back seamlessly when DB offline)
let editors = [...initialEditors];
let projects = [...initialProjects];

// Storage assets tracking table
let editorAssets = [
  {
    id: 'asset-1',
    editorId: 'e1',
    subtaskId: 'st-1',
    fileName: 'hero_commercial_rough_cut_v2.mp4',
    fileSizeBytes: 245000000, // 245 MB
    mimeType: 'video/mp4',
    r2Key: 'editors/e1/subtasks/st-1/hero_commercial_rough_cut_v2.mp4',
    publicUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'asset-2',
    editorId: 'e1',
    subtaskId: 'st-3',
    fileName: 'product_tutorials_episode1_full_4k.mov',
    fileSizeBytes: 380000000, // 380 MB
    mimeType: 'video/quicktime',
    r2Key: 'editors/e1/subtasks/st-3/product_tutorials_episode1_full_4k.mov',
    publicUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'asset-3',
    editorId: 'e2',
    subtaskId: 'st-2',
    fileName: 'instagram_reels_pack_5x_final.mp4',
    fileSizeBytes: 180000000, // 180 MB
    mimeType: 'video/mp4',
    r2Key: 'editors/e2/subtasks/st-2/instagram_reels_pack_5x_final.mp4',
    publicUrl: 'https://images.unsplash.com/photo-1608248597263-0057e43a4524?w=800',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
];

// Helper to compute used bytes for an editor
function getEditorUsedBytes(editorId) {
  return editorAssets
    .filter((a) => a.editorId === editorId)
    .reduce((sum, a) => sum + a.fileSizeBytes, 0);
}

// ============================================================
// 1. HEALTH CHECK & KEEP-ALIVE ENDPOINT
// ============================================================
app.get('/api/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  res.json({
    status: 'ok',
    service: 'Gogangs Express Backend',
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    storageConfigured: !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID),
  });
});

// ============================================================
// 2. CLOUDFLARE R2 STORAGE & 1 GB QUOTA ENGINE
// ============================================================

// POST /api/storage/presigned-upload-url - Issue S3 upload URL with 1GB quota validation
app.post('/api/storage/presigned-upload-url', async (req, res) => {
  try {
    const { editorId, subtaskId, fileName, fileSizeBytes, mimeType } = req.body;
    if (!editorId || !fileName || !fileSizeBytes) {
      return res.status(400).json({ error: 'Missing required parameters (editorId, fileName, fileSizeBytes)' });
    }

    const editor = editors.find((e) => e.id === editorId);
    const storageLimit = editor?.storageLimitBytes || 1073741824; // 1 GB default
    const currentUsage = getEditorUsedBytes(editorId);

    const presignedData = await generateUploadUrl({
      editorId,
      subtaskId,
      fileName,
      fileSizeBytes,
      mimeType,
      currentUsage,
      storageLimit,
    });

    res.json({
      success: true,
      currentUsageBytes: currentUsage,
      storageLimitBytes: storageLimit,
      ...presignedData,
    });
  } catch (error) {
    if (error.statusCode === 403 || error.message.toLowerCase().includes('quota')) {
      return res.status(403).json({
        error: 'STORAGE_QUOTA_EXCEEDED',
        message: error.message,
      });
    }
    console.error('Storage Presign Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/storage/confirm-upload - Record asset in DB and link with deliverable
app.post('/api/storage/confirm-upload', (req, res) => {
  const { editorId, subtaskId, fileName, fileSizeBytes, mimeType, r2Key, publicUrl } = req.body;
  if (!editorId || !fileSizeBytes || !r2Key) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const newAsset = {
    id: `asset-${Date.now()}`,
    editorId,
    subtaskId,
    fileName: fileName || 'deliverable.mp4',
    fileSizeBytes: Number(fileSizeBytes),
    mimeType: mimeType || 'video/mp4',
    r2Key,
    publicUrl: publicUrl || `https://${process.env.R2_PUBLIC_DOMAIN || 'media.gogangs.com'}/${r2Key}`,
    createdAt: new Date().toISOString(),
  };

  editorAssets.unshift(newAsset);

  // If subtask ID provided, update subtask deliverable link and set to "Ready for Review"
  if (subtaskId) {
    projects.forEach((p) => {
      const st = p.subtasks.find((s) => s.id === subtaskId);
      if (st) {
        st.deliverableLink = newAsset.publicUrl;
        st.status = 'Ready for Review';
      }
    });
  }

  const updatedUsage = getEditorUsedBytes(editorId);
  res.status(201).json({
    success: true,
    asset: newAsset,
    storageUsedBytes: updatedUsage,
  });
});

// GET /api/storage/my-assets - Fetch all uploaded files and quota metrics for an editor
app.get('/api/storage/my-assets', (req, res) => {
  const { editorId } = req.query;
  if (!editorId) return res.status(400).json({ error: 'Missing editorId query param' });

  const editor = editors.find((e) => e.id === editorId);
  const assets = editorAssets.filter((a) => a.editorId === editorId);
  const storageUsedBytes = assets.reduce((sum, a) => sum + a.fileSizeBytes, 0);
  const storageLimitBytes = editor?.storageLimitBytes || 1073741824; // 1 GB
  const storageTier = editor?.storageTier || 'Free';

  res.json({
    assets,
    storageUsedBytes,
    storageLimitBytes,
    storageTier,
    percentageUsed: Math.min(100, Math.round((storageUsedBytes / storageLimitBytes) * 100)),
  });
});

// DELETE /api/storage/assets - Bulk delete files from R2 and free up quota
app.delete('/api/storage/assets', async (req, res) => {
  try {
    const { editorId, assetIds } = req.body;
    if (!editorId || !assetIds || !Array.isArray(assetIds)) {
      return res.status(400).json({ error: 'Missing editorId or assetIds array' });
    }

    const assetsToDelete = editorAssets.filter(
      (a) => a.editorId === editorId && assetIds.includes(a.id)
    );
    const r2Keys = assetsToDelete.map((a) => a.r2Key);

    // Delete from Cloudflare R2
    await deleteR2Files(r2Keys);

    // Remove from in-memory / DB state
    editorAssets = editorAssets.filter(
      (a) => !(a.editorId === editorId && assetIds.includes(a.id))
    );

    const updatedUsedBytes = getEditorUsedBytes(editorId);
    res.json({
      success: true,
      deletedCount: assetsToDelete.length,
      storageUsedBytes: updatedUsedBytes,
    });
  } catch (error) {
    console.error('Delete assets error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/storage/upgrade-tier - Upgrade editor storage tier
app.post('/api/storage/upgrade-tier', (req, res) => {
  const { editorId, planTier } = req.body;
  const editor = editors.find((e) => e.id === editorId);
  if (!editor) return res.status(404).json({ error: 'Editor not found' });

  const tiers = {
    Free: 1073741824, // 1 GB
    Pro_50GB: 53687091200, // 50 GB
    Studio_200GB: 214748364800, // 200 GB
  };

  editor.storageTier = planTier;
  editor.storageLimitBytes = tiers[planTier] || 1073741824;

  res.json({
    success: true,
    editorId,
    storageTier: editor.storageTier,
    storageLimitBytes: editor.storageLimitBytes,
  });
});

// ============================================================
// 3. EDITORS & PROJECTS CRUD
// ============================================================

app.get('/api/editors', (req, res) => {
  const { search, status } = req.query;
  let result = [...editors];

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (status && status !== 'All') {
    result = result.filter((e) => e.verificationStatus === status);
  }

  res.json(result);
});

app.get('/api/editors/:id', (req, res) => {
  const editor = editors.find((e) => e.id === req.params.id);
  if (!editor) return res.status(404).json({ error: 'Editor not found' });
  res.json(editor);
});

app.post('/api/editors', (req, res) => {
  const newEditor = {
    id: `e-${Date.now()}`,
    active: true,
    verificationStatus: 'Pending',
    lastLogin: new Date().toISOString(),
    rating: 5.0,
    storageUsedBytes: 0,
    storageLimitBytes: 1073741824,
    storageTier: 'Free',
    portfolioLinks: [],
    sampleVideos: [],
    ...req.body,
  };
  editors.unshift(newEditor);
  res.status(201).json(newEditor);
});

app.put('/api/editors/:id', (req, res) => {
  const index = editors.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Editor not found' });
  editors[index] = { ...editors[index], ...req.body };
  res.json(editors[index]);
});

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: `p-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'In Progress',
    subtasks: [],
    ...req.body,
  };
  projects.unshift(newProject);
  res.status(201).json(newProject);
});

app.put('/api/projects/:projectId/subtasks/:subtaskId', (req, res) => {
  const { projectId, subtaskId } = req.params;
  const project = projects.find((p) => p.id === projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const subtask = project.subtasks.find((st) => st.id === subtaskId);
  if (!subtask) return res.status(404).json({ error: 'Subtask not found' });

  Object.assign(subtask, req.body);
  res.json(subtask);
});

app.get('/api/review-queue', (req, res) => {
  const queue = projects.flatMap((p) =>
    p.subtasks
      .filter((st) => st.status === 'Ready for Review')
      .map((st) => {
        const editor = editors.find((e) => e.id === st.assignedEditorIds[0]);
        return {
          ...st,
          projectTitle: p.title,
          projectId: p.id,
          editorName: editor?.fullName || 'Unknown',
          editorAvatar: editor?.avatarUrl || '',
          editorId: editor?.id || '',
        };
      })
  );
  res.json(queue);
});

app.get('/api/dashboard/stats', (req, res) => {
  const totalEditors = editors.length;
  const verifiedEditors = editors.filter((e) => e.verificationStatus === 'Verified').length;
  const pendingEditors = editors.filter((e) => e.verificationStatus === 'Pending').length;
  const totalProjects = projects.length;
  const reviewQueueCount = projects
    .flatMap((p) => p.subtasks)
    .filter((st) => st.status === 'Ready for Review').length;

  res.json({
    totalEditors,
    verifiedEditors,
    pendingEditors,
    totalProjects,
    reviewQueueCount,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Gogangs Express Backend server running on http://localhost:${PORT}`);
});
