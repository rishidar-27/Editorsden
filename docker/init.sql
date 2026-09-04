-- ============================================================
-- GOGANGS POSTGRESQL DATABASE INITIALIZATION SCRIPT
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('Pending', 'Verified', 'Rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE availability_status AS ENUM ('Full-Time', 'Part-Time', 'Weekends', 'Not Available');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('Assigned', 'In Progress', 'Ready for Review', 'Approved', 'Sent Back');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'editor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'demo1234',
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
    
    -- STORAGE QUOTA MANAGEMENT (1 GB default)
    storage_used_bytes BIGINT DEFAULT 0 NOT NULL,
    storage_limit_bytes BIGINT DEFAULT 1073741824 NOT NULL,
    storage_tier TEXT DEFAULT 'Free' NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. PROJECTS (CAMPAIGNS) TABLE
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'In Progress',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. SUBTASKS (DELIVERABLES) TABLE
CREATE TABLE IF NOT EXISTS subtasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    task_type TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    status project_status DEFAULT 'Assigned' NOT NULL,
    deliverable_link TEXT,
    feedback TEXT,
    assigned_editor_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. EDITOR ASSETS TABLE (Cloudflare R2 / MinIO S3 Object Tracking)
CREATE TABLE IF NOT EXISTS editor_assets (
    id TEXT PRIMARY KEY,
    editor_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subtask_id TEXT,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    r2_key TEXT NOT NULL UNIQUE,
    public_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. AUTOMATIC STORAGE CALCULATION TRIGGER
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_editor_storage ON editor_assets;
CREATE TRIGGER tr_update_editor_storage
AFTER INSERT OR DELETE ON editor_assets
FOR EACH ROW EXECUTE FUNCTION update_editor_storage_usage();

-- ============================================================
-- 7. INITIAL SEED DATA
-- ============================================================

-- Admin Account
INSERT INTO profiles (id, email, password, full_name, role, avatar_url, city, verification_status, storage_limit_bytes, storage_tier)
VALUES (
    'admin-1',
    'admin@gogangs.com',
    'admin1234',
    'Platform Administrator',
    'admin',
    'https://i.pravatar.cc/150?u=admin',
    'San Francisco, CA',
    'Verified',
    214748364800,
    'Studio_200GB'
) ON CONFLICT (email) DO NOTHING;

-- Editors
INSERT INTO profiles (id, email, password, full_name, role, avatar_url, city, experience_years, skills, editing_software, availability, hours_per_week, verification_status, storage_used_bytes, storage_limit_bytes, storage_tier)
VALUES 
(
    'e1',
    'marcus@gogangs.com',
    'demo1234',
    'Marcus Chen',
    'editor',
    'https://i.pravatar.cc/150?u=marcus',
    'San Francisco, CA',
    5,
    ARRAY['Commercial Ads', 'Color Grading', 'YouTube Editing'],
    ARRAY['Adobe Premiere Pro', 'DaVinci Resolve', 'Adobe After Effects'],
    'Full-Time',
    40,
    'Verified',
    625000000,
    1073741824,
    'Free'
),
(
    'e2',
    'elena@gogangs.com',
    'demo1234',
    'Elena Rostova',
    'editor',
    'https://i.pravatar.cc/150?u=elena',
    'Berlin, Germany',
    4,
    ARRAY['Reels Editing', 'Motion Graphics', 'Commercial Ads'],
    ARRAY['Adobe After Effects', 'Adobe Premiere Pro', 'Blender'],
    'Part-Time',
    25,
    'Verified',
    180000000,
    1073741824,
    'Free'
),
(
    'e3',
    'david@gogangs.com',
    'demo1234',
    'David Kim',
    'editor',
    'https://i.pravatar.cc/150?u=david',
    'Seoul, South Korea',
    6,
    ARRAY['Podcast Editing', 'Corporate Videos', 'YouTube Editing'],
    ARRAY['Adobe Premiere Pro', 'Final Cut Pro', 'Audacity'],
    'Full-Time',
    40,
    'Verified',
    0,
    1073741824,
    'Free'
),
(
    'e4',
    'zara@gogangs.com',
    'demo1234',
    'Zara Patel',
    'editor',
    'https://i.pravatar.cc/150?u=zara',
    'London, UK',
    3,
    ARRAY['Wedding Videos', 'Color Grading', 'Reels Editing'],
    ARRAY['DaVinci Resolve', 'Adobe Premiere Pro'],
    'Weekends',
    15,
    'Pending',
    0,
    1073741824,
    'Free'
) ON CONFLICT (email) DO NOTHING;

-- Projects
INSERT INTO projects (id, title, client_name, description, status, created_at)
VALUES 
(
    'p1',
    'Aurora Skincare — Q4 Launch Campaign',
    'Aurora Cosmetics Inc.',
    'Global product rollout with hero commercial, product tutorials, and viral Reels cutdowns.',
    'In Progress',
    '2026-08-10T09:00:00Z'
),
(
    'p2',
    'TechFlow SaaS — Product Demo Series',
    'TechFlow Inc.',
    'Episodic software walkthrough and motion graphics intro package.',
    'In Progress',
    '2026-08-14T11:30:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Subtasks
INSERT INTO subtasks (id, project_id, title, task_type, deadline, status, deliverable_link, assigned_editor_ids)
VALUES 
(
    'st-1',
    'p1',
    'Hero Brand Commercial (60s)',
    'Commercial Ads',
    '2026-09-10T18:00:00Z',
    'Ready for Review',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    ARRAY['e1']
),
(
    'st-2',
    'p1',
    'Instagram Reels Cutdown Series (5x)',
    'Reels Editing',
    '2026-09-08T18:00:00Z',
    'In Progress',
    NULL,
    ARRAY['e2']
),
(
    'st-3',
    'p1',
    'Product Tutorial Videos (3x)',
    'YouTube Editing',
    '2026-09-14T18:00:00Z',
    'Assigned',
    NULL,
    ARRAY['e1', 'e3']
),
(
    'st-4',
    'p1',
    'Thumbnail Design Graphic Package',
    'Thumbnail Design',
    '2026-09-06T18:00:00Z',
    'Ready for Review',
    'https://images.unsplash.com/photo-1608248597263-0057e43a4524?w=800',
    ARRAY['e1']
),
(
    'st-5',
    'p2',
    'Motion Graphics Intro Package',
    'Motion Graphics',
    '2026-09-12T18:00:00Z',
    'In Progress',
    NULL,
    ARRAY['e2']
),
(
    'st-6',
    'p2',
    'Feature Walkthrough Video',
    'Corporate Videos',
    '2026-09-16T18:00:00Z',
    'Ready for Review',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    ARRAY['e3']
) ON CONFLICT (id) DO NOTHING;

-- Initial Assets (Linked with Marcus Chen)
INSERT INTO editor_assets (id, editor_id, subtask_id, file_name, file_size_bytes, mime_type, r2_key, public_url, created_at)
VALUES 
(
    'asset-1',
    'e1',
    'st-1',
    'Aurora_Hero_Commercial_4K_FinalCut_v3.mp4',
    320000000,
    'video/mp4',
    'editors/e1/subtasks/st-1/Aurora_Hero_Commercial_4K_FinalCut_v3.mp4',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    '2026-08-25T14:30:00Z'
),
(
    'asset-2',
    'e1',
    'st-2',
    'Instagram_Reels_Cutdown_Pack_5x_1080p.mp4',
    185000000,
    'video/mp4',
    'editors/e1/subtasks/st-2/Instagram_Reels_Cutdown_Pack_5x_1080p.mp4',
    'https://images.unsplash.com/photo-1608248597263-0057e43a4524?w=800',
    '2026-08-24T11:15:00Z'
),
(
    'asset-3',
    'e1',
    'st-3',
    'TechFlow_Motion_Graphics_Package_ProRes.mov',
    120000000,
    'video/quicktime',
    'editors/e1/subtasks/st-3/TechFlow_Motion_Graphics_Package_ProRes.mov',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    '2026-08-22T09:40:00Z'
) ON CONFLICT (id) DO NOTHING;
