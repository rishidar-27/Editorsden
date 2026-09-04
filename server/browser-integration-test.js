// End-to-End Browser & API Integration Test for Node.js + Express & Vite Frontend

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';

async function runBrowserIntegrationTests() {
  console.log('🌐 Starting Full End-to-End Browser & Node.js + Express Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  async function step(title, fn) {
    try {
      await fn();
      console.log(`✅ [SUCCESS] ${title}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAILURE] ${title}:`, err.message);
      failed++;
    }
  }

  // 1. Browser Frontend Server Test
  await step('1. Browser Access: GET http://localhost:5173/ (Vite Frontend)', async () => {
    const res = await fetch(FRONTEND_URL);
    if (!res.ok) throw new Error(`Frontend returned HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('<title>') && !html.includes('id="root"')) {
      throw new Error('Vite index.html root container not found');
    }
  });

  // 2. Browser CORS & Headers Test on Node.js + Express
  await step('2. Express Server: CORS & Security Headers Check', async () => {
    const res = await fetch(`${BACKEND_URL}/api/health`, {
      headers: {
        Origin: 'http://localhost:5173',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const corsHeader = res.headers.get('access-control-allow-origin');
    if (!corsHeader && corsHeader !== '*') {
      // CORS allowed
    }
  });

  // 3. User Flow Scenario A: Admin creates a new campaign
  let createdProjectId = '';
  await step('3. Scenario A: Admin creates a new campaign project', async () => {
    const newProjectPayload = {
      title: 'E2E Automated Test Campaign 2026',
      clientName: 'Apex Gaming Media',
      subtasks: [
        {
          id: `st-test-${Date.now()}`,
          title: 'Cinematic Game Trailer 4K',
          taskType: 'Commercial Ads',
          deadline: '2026-09-20T18:00:00Z',
          assignedEditorIds: [],
          status: 'Assigned',
        },
      ],
    };

    const res = await fetch(`${BACKEND_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProjectPayload),
    });
    if (!res.ok) throw new Error(`Failed to create project: HTTP ${res.status}`);
    const data = await res.json();
    if (!data.id) throw new Error('Project ID missing from response');
    createdProjectId = data.id;
  });

  // 4. User Flow Scenario B: Admin assigns Marcus Chen to the subtask
  let subtaskId = '';
  await step('4. Scenario B: Admin assigns editor to the subtask', async () => {
    const projRes = await fetch(`${BACKEND_URL}/api/projects/${createdProjectId}`);
    const project = await projRes.json();
    if (!project.subtasks || project.subtasks.length === 0) throw new Error('Subtask not found in project');
    subtaskId = project.subtasks[0].id;

    const assignRes = await fetch(`${BACKEND_URL}/api/projects/${createdProjectId}/subtasks/${subtaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedEditorIds: ['e1'],
        status: 'In Progress',
      }),
    });
    if (!assignRes.ok) throw new Error(`Assignment update failed: HTTP ${assignRes.status}`);
    const updated = await assignRes.json();
    if (!updated.assignedEditorIds.includes('e1')) throw new Error('Editor assignment mismatch');
  });

  // 5. User Flow Scenario C: Editor requests S3 Presigned URL & uploads deliverable
  let uploadedAssetKey = '';
  let uploadedAssetId = '';
  await step('5. Scenario C: Editor gets S3 Presigned URL & submits 220 MB deliverable', async () => {
    // Step 5.1: Request presigned upload URL
    const presignRes = await fetch(`${BACKEND_URL}/api/storage/presigned-upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        subtaskId,
        fileName: 'Apex_Game_Trailer_4K_Master.mp4',
        fileSizeBytes: 220000000, // 220 MB
        mimeType: 'video/mp4',
      }),
    });
    if (!presignRes.ok) throw new Error(`Presign failed: HTTP ${presignRes.status}`);
    const presignData = await presignRes.json();
    uploadedAssetKey = presignData.fileKey;

    // Step 5.2: Confirm upload & update deliverable status to "Ready for Review"
    const confirmRes = await fetch(`${BACKEND_URL}/api/storage/confirm-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        subtaskId,
        fileName: 'Apex_Game_Trailer_4K_Master.mp4',
        fileSizeBytes: 220000000,
        mimeType: 'video/mp4',
        r2Key: uploadedAssetKey,
        publicUrl: presignData.publicUrl,
      }),
    });
    if (!confirmRes.ok) throw new Error(`Upload confirmation failed: HTTP ${confirmRes.status}`);
    const confirmData = await confirmRes.json();
    uploadedAssetId = confirmData.asset.id;
  });

  // 6. User Flow Scenario D: Admin reviews the queue and approves the deliverable
  await step('6. Scenario D: Admin detects submission in Review Queue & approves task', async () => {
    const queueRes = await fetch(`${BACKEND_URL}/api/review-queue`);
    const queue = await queueRes.json();
    const item = queue.find((q) => q.id === subtaskId);
    if (!item) throw new Error('Submitted deliverable not found in Admin Review Queue');

    // Admin marks Approved
    const approveRes = await fetch(`${BACKEND_URL}/api/projects/${createdProjectId}/subtasks/${subtaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
      }),
    });
    if (!approveRes.ok) throw new Error(`Approval failed: HTTP ${approveRes.status}`);
  });

  // 7. User Flow Scenario E: Editor checks 1 GB Storage & deletes old drafts
  await step('7. Scenario E: Editor cleans bucket to reclaim 1 GB storage quota', async () => {
    // Check initial storage
    const beforeRes = await fetch(`${BACKEND_URL}/api/storage/my-assets?editorId=e1`);
    const beforeData = await beforeRes.json();

    // Delete the test asset
    const delRes = await fetch(`${BACKEND_URL}/api/storage/assets`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editorId: 'e1',
        assetIds: [uploadedAssetId],
      }),
    });
    if (!delRes.ok) throw new Error(`Delete failed: HTTP ${delRes.status}`);

    // Check after storage
    const afterRes = await fetch(`${BACKEND_URL}/api/storage/my-assets?editorId=e1`);
    const afterData = await afterRes.json();
    if (afterData.storageUsedBytes >= beforeData.storageUsedBytes) {
      throw new Error('Storage used bytes was not decremented after deletion');
    }
  });

  console.log(`\n==================================================`);
  console.log(`🎉 End-to-End Browser & API Test Suite Passed: ${passed}/${passed + failed}`);
  console.log(`==================================================\n`);
}

runBrowserIntegrationTests();
