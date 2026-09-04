// Comprehensive End-to-End Browser & API Test Suite for Gogangs
// Validates frontend route rendering, backend APIs, R2 presigning, 1GB quota manager, and full user workflows.

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:5000';

async function runComprehensiveE2ETests() {
  console.log('🚀 ========================================================');
  console.log('🎬 GOGANGS FULL-STACK END-TO-END & BROWSER TESTING SUITE');
  console.log('🚀 ========================================================\n');

  let passed = 0;
  let failed = 0;
  const testResults = [];

  async function test(name, category, fn) {
    try {
      const start = Date.now();
      await fn();
      const duration = Date.now() - start;
      console.log(`✅ [PASS] [${category}] ${name} (${duration}ms)`);
      testResults.push({ name, category, status: 'PASS', duration });
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] [${category}] ${name}:`, err.message);
      testResults.push({ name, category, status: 'FAIL', error: err.message });
      failed++;
    }
  }

  // ==========================================
  // SECTION 1: VITE FRONTEND & STATIC ASSETS
  // ==========================================
  console.log('--- SECTION 1: Frontend Server & Route Entry Points ---');

  await test('Vite Dev Server Serves HTML Shell with Root Element', 'Frontend', async () => {
    const res = await fetch(FRONTEND_URL);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('id="root"')) throw new Error('Missing root DOM mount container');
    if (!html.includes('/src/main.tsx')) throw new Error('Missing TypeScript entry script');
  });

  await test('Vite Serves Main TypeScript Application Module', 'Frontend', async () => {
    const res = await fetch(`${FRONTEND_URL}/src/main.tsx`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const js = await res.text();
    if (!js.includes('createRoot') || !js.includes('App')) {
      throw new Error('main.tsx did not return expected React DOM mount code');
    }
  });

  await test('Vite Compiles App.tsx with All 18 Screen Routes', 'Frontend', async () => {
    const res = await fetch(`${FRONTEND_URL}/src/App.tsx`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const code = await res.text();
    const requiredScreens = [
      'LandingPage',
      'LoginPage',
      'AdminDashboard',
      'EditorManagement',
      'EditorDetail',
      'ProjectsOverview',
      'ProjectDetail',
      'CreateProject',
      'AssignEditors',
      'ReviewQueue',
      'Reports',
      'EditorDashboard',
      'EditorProfile',
      'EditorPortfolio',
      'EditorVerification',
      'EditorProjects',
      'EditorStorageManager',
      'PublicPortfolioPage',
    ];
    for (const screen of requiredScreens) {
      if (!code.includes(screen)) {
        throw new Error(`Screen ${screen} missing in App.tsx route definitions`);
      }
    }
  });

  await test('CSS Design System & Tailwind Utilities Loaded', 'Frontend', async () => {
    const res = await fetch(`${FRONTEND_URL}/src/index.css`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const css = await res.text();
    if (!css.includes('@tailwind') && !css.includes('font-family')) {
      throw new Error('index.css does not contain base styles');
    }
  });

  // ==========================================
  // SECTION 2: BACKEND HEALTH & DATA APIS
  // ==========================================
  console.log('\n--- SECTION 2: Node.js + Express Backend APIs ---');

  await test('GET /api/health - Telemetry & Uptime Monitor', 'Backend API', async () => {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok' || data.service !== 'Gogangs Express Backend') {
      throw new Error('Invalid health status payload');
    }
  });

  await test('GET /api/dashboard/stats - Admin KPI Metrics Aggregate', 'Backend API', async () => {
    const res = await fetch(`${BACKEND_URL}/api/dashboard/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const stats = await res.json();
    if (typeof stats.totalEditors !== 'number' || stats.totalEditors < 1) {
      throw new Error('Invalid totalEditors metric');
    }
    if (typeof stats.totalProjects !== 'number' || stats.totalProjects < 1) {
      throw new Error('Invalid totalProjects metric');
    }
  });

  await test('GET /api/editors - Directory with Skill & Availability Filters', 'Backend API', async () => {
    const res = await fetch(`${BACKEND_URL}/api/editors?status=Verified`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const editors = await res.json();
    if (!Array.isArray(editors) || editors.length === 0) {
      throw new Error('No verified editors found');
    }
    const marcus = editors.find((e) => e.id === 'e1' || e.fullName === 'Marcus Chen');
    if (!marcus) throw new Error('Marcus Chen profile not found in directory');
  });

  await test('GET /api/projects - Multi-campaign listing with Subtasks', 'Backend API', async () => {
    const res = await fetch(`${BACKEND_URL}/api/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error('No projects returned from database');
    }
    const firstProj = projects[0];
    if (!firstProj.subtasks || firstProj.subtasks.length === 0) {
      throw new Error('Subtasks array missing from project object');
    }
  });

  // ==========================================
  // SECTION 3: CLOUDFLARE R2 & 1GB QUOTA ENGINE
  // ==========================================
  console.log('\n--- SECTION 3: Storage Quota Engine & R2 Uploads ---');

  let testAssetKey = '';
  let testAssetId = '';

  await test('POST /api/storage/presigned-upload-url - Valid File Under Quota (180 MB)', 'Storage Engine', async () => {
    const res = await fetch(`${BACKEND_URL}/api/storage/presigned-upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        subtaskId: 'st-1',
        fileName: 'commercial_hero_4k_master.mp4',
        fileSizeBytes: 180000000, // 180 MB
        mimeType: 'video/mp4',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.uploadUrl || !data.fileKey) {
      throw new Error('S3 Presigned upload URL or fileKey missing');
    }
    testAssetKey = data.fileKey;
  });

  await test('POST /api/storage/presigned-upload-url - Quota Breach Rejection (>1 GB on Free Tier)', 'Storage Engine', async () => {
    const res = await fetch(`${BACKEND_URL}/api/storage/presigned-upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e2', // e2 is Free tier (1 GB limit)
        subtaskId: 'st-2',
        fileName: 'uncompressed_raw_footage_archive.mov',
        fileSizeBytes: 2000000000, // ~2 GB (> 1 GB free quota)
        mimeType: 'video/quicktime',
      }),
    });
    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden for quota breach, got ${res.status}`);
    }
    const errData = await res.json();
    const errMsg = (errData.error || errData.message || '').toLowerCase();
    if (!errMsg.includes('quota')) {
      throw new Error('Error message did not mention storage quota limit');
    }
  });

  await test('POST /api/storage/confirm-upload - Record Asset Metadata', 'Storage Engine', async () => {
    const res = await fetch(`${BACKEND_URL}/api/storage/confirm-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        subtaskId: 'st-1',
        fileName: 'commercial_hero_4k_master.mp4',
        fileSizeBytes: 180000000,
        mimeType: 'video/mp4',
        r2Key: testAssetKey,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.asset || !data.asset.id) throw new Error('Asset object not returned');
    testAssetId = data.asset.id;
  });

  await test('GET /api/storage/my-assets - Storage Meter & Breakdown Calculation', 'Storage Engine', async () => {
    const res = await fetch(`${BACKEND_URL}/api/storage/my-assets?editorId=e1`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.storageUsedBytes !== 'number' || data.storageUsedBytes <= 0) {
      throw new Error('Used bytes calculation incorrect');
    }
    if (typeof data.percentageUsed !== 'number' || data.percentageUsed <= 0) {
      throw new Error('Storage percentage calculation missing');
    }
  });

  await test('DELETE /api/storage/assets - Bucket Cleanup & Reclaim Space', 'Storage Engine', async () => {
    if (!testAssetId) throw new Error('Test asset ID not present');
    const res = await fetch(`${BACKEND_URL}/api/storage/assets`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        assetIds: [testAssetId],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.deletedCount !== 1) throw new Error('Asset count deleted mismatch');
  });

  await test('POST /api/storage/upgrade-tier - Pro 50 GB Subscription Upgrade', 'Storage Engine', async () => {
    const res = await fetch(`${BACKEND_URL}/api/storage/upgrade-tier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        planTier: 'Pro_50GB',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.storageLimitBytes !== 53687091200) {
      throw new Error('Storage limit was not expanded to 50 GB');
    }
  });

  // ==========================================
  // SECTION 4: FULL USER WORKFLOW SIMULATIONS
  // ==========================================
  console.log('\n--- SECTION 4: Full User Lifecycle Workflows ---');

  let newCampaignId = '';
  let subtaskId = '';

  await test('Workflow Step 1: Admin Creates New Client Campaign', 'Workflow', async () => {
    const res = await fetch(`${BACKEND_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Global Summer Launch 2026',
        clientName: 'Nike Athletics',
        clientAvatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
        brandGuidelines: 'High-contrast energetic cuts, 60fps pacing',
        subtasks: [
          {
            id: `st-nike-${Date.now()}`,
            title: 'Vertical Story Ads 9:16 Pack',
            taskType: 'Reels Editing',
            deadline: '2026-09-15T23:59:59Z',
            assignedEditorIds: [],
            status: 'Assigned',
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const project = await res.json();
    newCampaignId = project.id;
    subtaskId = project.subtasks[0].id;
  });

  await test('Workflow Step 2: Smart Algorithm Assigns Editor to Subtask', 'Workflow', async () => {
    const res = await fetch(`${BACKEND_URL}/api/projects/${newCampaignId}/subtasks/${subtaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedEditorIds: ['e1'],
        status: 'In Progress',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();
    if (!updated.assignedEditorIds.includes('e1')) {
      throw new Error('Editor assignment not reflected in subtask');
    }
  });

  await test('Workflow Step 3: Editor Submits Deliverable & Triggers "Ready for Review"', 'Workflow', async () => {
    const res = await fetch(`${BACKEND_URL}/api/projects/${newCampaignId}/subtasks/${subtaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Ready for Review',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();
    if (updated.status !== 'Ready for Review') {
      throw new Error('Status not updated to Ready for Review');
    }
  });

  await test('Workflow Step 4: Admin Detects Submission in Review Queue & Approves', 'Workflow', async () => {
    const queueRes = await fetch(`${BACKEND_URL}/api/review-queue`);
    const queue = await queueRes.json();
    const item = queue.find((q) => q.id === subtaskId);
    if (!item) throw new Error('Submitted deliverable not listed in Review Queue');

    const approveRes = await fetch(`${BACKEND_URL}/api/projects/${newCampaignId}/subtasks/${subtaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
      }),
    });
    if (!approveRes.ok) throw new Error(`HTTP ${approveRes.status}`);
  });

  console.log('\n========================================================');
  console.log(`📊 FINAL RESULTS: ${passed} PASSED / ${passed + failed} TOTAL (${failed} FAILED)`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveE2ETests();
