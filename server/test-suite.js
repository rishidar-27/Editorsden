// Automated Backend Test Suite for Gogangs Platform
const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting Gogangs Full Stack Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health Check Test
  await test('1. GET /api/health - Telemetry & Uptime Check', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Health check returned non-ok status');
  });

  // 2. Dashboard Stats Test
  await test('2. GET /api/dashboard/stats - Aggregated Metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.totalEditors !== 'number' || typeof data.totalProjects !== 'number') {
      throw new Error('Invalid stats payload');
    }
  });

  // 3. Editors API Test
  await test('3. GET /api/editors - Editor Directory & Filter', async () => {
    const res = await fetch(`${BASE_URL}/api/editors?status=Verified`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const editors = await res.json();
    if (!Array.isArray(editors) || editors.length === 0) throw new Error('No editors returned');
  });

  // 4. Projects API Test
  await test('4. GET /api/projects - Campaign Directory', async () => {
    const res = await fetch(`${BASE_URL}/api/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    if (!Array.isArray(projects) || projects.length === 0) throw new Error('No projects returned');
  });

  // 5. Review Queue API Test
  await test('5. GET /api/review-queue - Submissions Feed', async () => {
    const res = await fetch(`${BASE_URL}/api/review-queue`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const queue = await res.json();
    if (!Array.isArray(queue)) throw new Error('Review queue is not an array');
  });

  // 6. Storage S3 Presigned URL & 1 GB Quota Engine Test
  await test('6. POST /api/storage/presigned-upload-url - Valid Quota Test (150 MB)', async () => {
    const res = await fetch(`${BASE_URL}/api/storage/presigned-upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        subtaskId: 'st-1',
        fileName: 'test_commercial_cut_150mb.mp4',
        fileSizeBytes: 150000000,
        mimeType: 'video/mp4',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.uploadUrl || !data.fileKey) throw new Error('Missing uploadUrl or fileKey in response');
  });

  // 7. Storage 1 GB Quota Rejection Test (Attempting 2 GB upload)
  await test('7. POST /api/storage/presigned-upload-url - Quota Rejection (>1 GB)', async () => {
    const res = await fetch(`${BASE_URL}/api/storage/presigned-upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        subtaskId: 'st-1',
        fileName: 'huge_raw_4k_footage_2gb.mov',
        fileSizeBytes: 2147483648, // 2 GB
        mimeType: 'video/quicktime',
      }),
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden for quota breach, got HTTP ${res.status}`);
  });

  // 8. Confirm Asset Upload Test
  let createdAssetId = '';
  await test('8. POST /api/storage/confirm-upload - Record Asset Metadata', async () => {
    const res = await fetch(`${BASE_URL}/api/storage/confirm-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        subtaskId: 'st-1',
        fileName: 'test_hero_commercial.mp4',
        fileSizeBytes: 95000000,
        mimeType: 'video/mp4',
        r2Key: `editors/e1/subtasks/st-1/test-${Date.now()}.mp4`,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.asset || !data.asset.id) throw new Error('Asset metadata not created');
    createdAssetId = data.asset.id;
  });

  // 9. Storage Metrics & Asset Inspection Test
  await test('9. GET /api/storage/my-assets - Storage Calculations', async () => {
    const res = await fetch(`${BASE_URL}/api/storage/my-assets?editorId=e1`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.storageUsedBytes !== 'number' || typeof data.percentageUsed !== 'number') {
      throw new Error('Invalid storage metrics calculation');
    }
  });

  // 10. Bucket Clean-Up (Delete Asset & Reclaim Quota)
  await test('10. DELETE /api/storage/assets - Bucket Clean-up & Space Recovery', async () => {
    if (!createdAssetId) return;
    const res = await fetch(`${BASE_URL}/api/storage/assets`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        assetIds: [createdAssetId],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.deletedCount !== 1) throw new Error('Asset deletion failed');
  });

  // 11. Storage Tier Upgrade Test
  await test('11. POST /api/storage/upgrade-tier - Pro 50GB Upgrade', async () => {
    const res = await fetch(`${BASE_URL}/api/storage/upgrade-tier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        planTier: 'Pro_50GB',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.storageLimitBytes !== 53687091200) throw new Error('Storage limit not updated to 50 GB');
  });

  console.log(`\n========================================`);
  console.log(`🏁 Total Tests: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
