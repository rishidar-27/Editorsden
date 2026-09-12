-- ============================================================================
-- GOGANGS SUPABASE MIGRATION: EXTENDED FEATURES & DATABASE PERSISTENCE
-- ============================================================================
-- 1. Notification Tracking (Persistent Read/Unread across browsers/devices)
-- 2. Taxonomy & Dropdown Picklists (Skills, Software, Task Types)
-- 3. Map Coordinates on Profiles (Latitude & Longitude)
-- 4. User Theme Preference (Dark / Light mode)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. NOTIFICATIONS TABLE (Persistent Read/Unread Status)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'system',
    route TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ----------------------------------------------------------------------------
-- 2. TAXONOMY TABLES (Skills, Software, Task Types)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.software_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.task_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed Initial Taxonomy
INSERT INTO public.skills (name) VALUES
    ('Reels Editing'),
    ('YouTube Editing'),
    ('Podcast Editing'),
    ('Motion Graphics'),
    ('Commercial Ads'),
    ('Corporate Videos'),
    ('Wedding Videos'),
    ('Color Grading'),
    ('Thumbnail Design')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.software_tools (name) VALUES
    ('Adobe Premiere Pro'),
    ('After Effects'),
    ('DaVinci Resolve'),
    ('Final Cut Pro'),
    ('Adobe Photoshop'),
    ('Adobe Audition'),
    ('CapCut')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.task_types (name) VALUES
    ('Reels Editing'),
    ('YouTube Editing'),
    ('Podcast Editing'),
    ('Motion Graphics'),
    ('Commercial Ads'),
    ('Corporate Videos'),
    ('Wedding Videos'),
    ('Color Grading'),
    ('Thumbnail Design')
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. MAP COORDINATES (Lat & Lng) & 4. THEME PREFERENCE ON PROFILES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'dark';

-- ----------------------------------------------------------------------------
-- 5. ENABLE ROW LEVEL SECURITY & REALTIME FOR NEW TABLES
-- ----------------------------------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_types ENABLE ROW LEVEL SECURITY;

-- Permissive read & write policies
DO $$ BEGIN
    CREATE POLICY "Allow public read access for skills" ON public.skills FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public insert for skills" ON public.skills FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public read access for software" ON public.software_tools FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public insert for software" ON public.software_tools FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public read access for task types" ON public.task_types FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public insert for task types" ON public.task_types FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public all access on notifications" ON public.notifications FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enable Realtime publication for the new tables
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.skills;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.software_tools;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.task_types;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
