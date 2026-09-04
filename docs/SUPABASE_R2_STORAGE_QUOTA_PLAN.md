# 📦 Supabase, Cloudflare R2 & 1 GB Quota Engine Specification

This document provides the complete database schema, Cloudflare R2 storage architecture, 1 GB quota enforcement logic, cleanup workflows, and billing specifications for **Gogangs**.

---

## 1. Supabase PostgreSQL Schema (Complete SQL DDL)

Copy and execute this script directly inside the **Supabase SQL Editor** to establish all tables, relations, triggers, and Row Level Security policies.

```sql
-- ============================================================
-- 1. EXTENSIONS & ENUMS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE verification_status AS ENUM ('Pending', 'Verified', 'Rejected');
CREATE TYPE availability_status AS ENUM ('Full-Time', 'Part-Time', 'Weekends', 'Not Available');
CREATE TYPE project_status AS ENUM ('Assigned', 'In Progress', 'Ready for Review', 'Approved', 'Sent Back');
CREATE TYPE user_role AS ENUM ('admin', 'editor');

-- ============================================================
-- 2. PROFILES TABLE (Linked with Supabase Auth)
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'editor' NOT NULL,
    avatar_url TEXT,
    city TEXT,
    phone TEXT,
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    skills TEXT[] DEFAULT '{}',
    editing_software TEXT[] DEFAULT '{}',
    availability availability_status DEFAULT 'Part-Time',
    hours_per_week INTEGER DEFAULT 20,
    verification_status verification_status DEFAULT 'Pending',
    verification_feedback TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- STORAGE QUOTA MANAGEMENT
    storage_used_bytes BIGINT DEFAULT 0 NOT NULL,
    storage_limit_bytes BIGINT DEFAULT 1073741824 NOT NULL, -- 1 GB Default (1024 * 1024 * 1024)
    storage_tier TEXT DEFAULT 'Free' NOT NULL, -- 'Free', 'Pro_50GB', 'Studio_200GB'
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 3. PROJECTS (CAMPAIGNS) TABLE
-- ============================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 4. SUBTASKS (DELIVERABLES) TABLE
-- ============================================================
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    task_type TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    status project_status DEFAULT 'Assigned' NOT NULL,
    deliverable_link TEXT,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 5. SUBTASK ASSIGNMENTS TABLE (Many-to-Many)
-- ============================================================
CREATE TABLE subtask_assignments (
    subtask_id UUID NOT NULL REFERENCES subtasks(id) ON DELETE CASCADE,
    editor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (subtask_id, editor_id)
);

-- ============================================================
-- 6. EDITOR ASSETS TABLE (Cloudflare R2 File Tracking)
-- ============================================================
CREATE TABLE editor_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    editor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subtask_id UUID REFERENCES subtasks(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    r2_key TEXT NOT NULL UNIQUE,
    public_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 7. AUTOMATIC STORAGE USAGE CALCULATION TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_editor_storage_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE profiles
        SET storage_used_bytes = storage_used_bytes + NEW.file_size_bytes,
            updated_at = NOW()
        WHERE id = NEW.editor_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE profiles
        SET storage_used_bytes = GREATEST(0, storage_used_bytes - OLD.file_size_bytes),
            updated_at = NOW()
        WHERE id = OLD.editor_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_update_editor_storage
AFTER INSERT OR DELETE ON editor_assets
FOR EACH ROW EXECUTE FUNCTION update_editor_storage_usage();

-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtask_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE editor_assets ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read, user can update own profile, admin can update all
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Authenticated users can view, only admin can insert/update
CREATE POLICY "Authenticated view projects" ON projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage projects" ON projects FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Assets: Editors manage their own assets, admins can view all
CREATE POLICY "Editors manage own assets" ON editor_assets FOR ALL USING (editor_id = auth.uid());
CREATE POLICY "Admins view all assets" ON editor_assets FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

---

## 2. Cloudflare R2 Direct Upload Architecture

### Why Cloudflare R2?
- **Zero ($0.00) Egress Fees**: Unlike AWS S3 which charges ~$0.09/GB on video playback, Cloudflare R2 has no egress bandwidth charges.
- **S3 API Compatibility**: Works seamlessly with `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`.

### Backend Implementation (`server/r2.js`)
```javascript
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate Presigned Upload URL with 1 GB Quota Verification
 */
export async function generateUploadUrl({ editorId, subtaskId, fileName, fileSizeBytes, mimeType, currentUsage, storageLimit }) {
  // 1. Enforce Quota Check
  if (currentUsage + fileSizeBytes > storageLimit) {
    const error = new Error('STORAGE_QUOTA_EXCEEDED');
    error.statusCode = 403;
    throw error;
  }

  // 2. Generate unique R2 Object Key
  const fileKey = `editors/${editorId}/subtasks/${subtaskId}/${Date.now()}-${fileName}`;

  // 3. Create S3 Command
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
    ContentType: mimeType,
  });

  // 4. Generate Pre-signed PUT URL (Valid for 15 minutes)
  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
  const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${fileKey}`;

  return { uploadUrl, fileKey, publicUrl };
}

/**
 * Bulk Delete Video Assets from R2
 */
export async function deleteR2Files(fileKeys) {
  if (!fileKeys.length) return;
  const command = new DeleteObjectsCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Delete: {
      Objects: fileKeys.map((Key) => ({ Key })),
    },
  });
  return await r2Client.send(command);
}
```

---

## 3. 1 GB Storage Quota & Bucket Cleanup Engine

### Storage Tier Matrix
| Tier Name | Storage Limit | Monthly Price | Max Single Video Size | Ideal Persona |
| :--- | :--- | :--- | :--- | :--- |
| **Free Creator** | **1 GB (1,073,741,824 B)** | **$0 / month** | 500 MB | Beginner / Social Reels Editors |
| **Pro Editor** | **50 GB** | **$9 / month** | 4 GB | Full-time YouTube / Commercial Editors |
| **Studio Pro** | **200 GB** | **$24 / month** | 10 GB | High-volume Agency & 4K Video Editors |

---

### Editor Bucket Cleanup UI Workflow
1. **Live Storage Gauge**:
   - Renders a real-time progress bar: `640 MB / 1,024 MB Used (62%)`.
   - **Green** (< 70%), **Amber** (70% - 90%), **Red** (> 90%).
2. **Asset Inspection Table**:
   - Lists all uploaded `.mp4`, `.mov`, `.png` files with thumbnail previews, subtask titles, upload dates, and file sizes in MB.
   - Default sorted by **Largest Files First** so editors can free up maximum space with minimum deletions.
3. **1-Click Bulk Delete**:
   - Selected files are sent to `DELETE /api/storage/assets`.
   - Express server removes objects from Cloudflare R2 bucket.
   - Supabase PostgreSQL trigger decrements `storage_used_bytes` automatically.
   - Frontend updates storage bar instantly with confirmation toast: *"520 MB freed up!"*.

---

## 4. Stripe / Razorpay Webhook Billing Specification

### Webhook Event: `customer.subscription.created` & `updated`
When an editor upgrades to **Pro (50 GB)** or **Studio (200 GB)**:
```javascript
// POST /api/webhooks/stripe
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const subscription = event.data.object;
    const editorId = subscription.metadata.editorId;
    const planTier = subscription.metadata.planTier; // 'Pro_50GB' or 'Studio_200GB'

    const storageLimits = {
      Pro_50GB: 53687091200,   // 50 GB in Bytes
      Studio_200GB: 214748364800, // 200 GB in Bytes
    };

    // Update Supabase profile limit
    await supabase
      .from('profiles')
      .update({
        storage_tier: planTier,
        storage_limit_bytes: storageLimits[planTier] || 1073741824,
      })
      .eq('id', editorId);
  }

  res.json({ received: true });
});
```
