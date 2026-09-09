-- ============================================================================
-- GOGANGS COMPLETE MASTER SCHEMA FOR SUPABASE (SINGLE QUERY - COPY & RUN ALL)
-- ============================================================================
-- Instructions: Copy this ENTIRE file and paste it into Supabase SQL Editor,
-- then click "RUN". It sets up all tables, triggers, buckets, RLS, and realtime.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CUSTOM TYPES & ENUMS
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'editor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

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

-- ============================================================================
-- 3. PROFILES TABLE (Mirrors and extends Supabase Auth users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'editor' NOT NULL,
    avatar_url TEXT,
    city TEXT,
    phone TEXT,
    bio TEXT,
    linkedin TEXT,
    instagram TEXT,
    portfolio_link TEXT,
    experience_years INTEGER DEFAULT 0,
    skills TEXT[] DEFAULT '{}',
    editing_software TEXT[] DEFAULT '{}',
    availability availability_status DEFAULT 'Part-Time',
    hours_per_week INTEGER DEFAULT 20,
    verification_status verification_status DEFAULT 'Pending',
    verification_feedback TEXT,
    resume_link TEXT,
    sample_work_links TEXT[] DEFAULT '{}',
    portfolio_links TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    languages TEXT[] DEFAULT '{}',
    timezone TEXT DEFAULT 'UTC',
    verified_date TIMESTAMPTZ,
    verified_by UUID,

    -- Professional Metrics & Rates
    hourly_rate TEXT DEFAULT '$65/hr',
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    completed_projects INTEGER DEFAULT 0,
    hardware TEXT,
    turnaround TEXT DEFAULT '24h - 48h',

    -- Storage Quota System (1GB = 1073741824 bytes default)
    storage_used_bytes BIGINT DEFAULT 0 NOT NULL,
    storage_limit_bytes BIGINT DEFAULT 1073741824 NOT NULL,
    storage_tier TEXT DEFAULT 'Free' NOT NULL,

    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Safely link profiles to auth.users if available
DO $$ BEGIN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT fk_profiles_auth_users 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================================================
-- 4. PROJECTS (CAMPAIGNS) TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'In Progress' NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 5. SUBTASKS (DELIVERABLES) TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    task_type TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    status project_status DEFAULT 'Assigned' NOT NULL,
    deliverable_link TEXT,
    feedback TEXT,
    assigned_editor_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subtasks_project_id ON public.subtasks(project_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_assigned_editors ON public.subtasks USING gin (assigned_editor_ids);

-- ============================================================================
-- 6. DELIVERABLE SUBMISSIONS TABLE (Versioned cut history: v1, v2, v3...)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.deliverable_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subtask_id UUID NOT NULL REFERENCES public.subtasks(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT DEFAULT 0 NOT NULL,
    file_url TEXT NOT NULL,
    mime_type TEXT,
    notes TEXT,
    submitted_by_editor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'In Review' NOT NULL,
    feedback TEXT,
    feedback_given_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_deliverables_subtask_id ON public.deliverable_submissions(subtask_id);

-- ============================================================================
-- 7. PORTFOLIO ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    editor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'video' NOT NULL,
    thumbnail_url TEXT,
    link TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_portfolio_editor_id ON public.portfolio_items(editor_id);

-- ============================================================================
-- 8. EDITOR ASSETS TABLE (Storage & Media Quota Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.editor_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    editor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subtask_id UUID REFERENCES public.subtasks(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    storage_provider TEXT DEFAULT 'cloudflare_r2' NOT NULL,
    r2_key TEXT,
    public_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_editor_assets_editor ON public.editor_assets(editor_id);

-- ============================================================================
-- 9. ACTIVITY LOGS (Realtime Audit / Notifications Feed)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 10. HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Helper: Check if current authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Trigger: Automatically create public.profiles row upon Supabase Auth sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        avatar_url
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'editor'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://i.pravatar.cc/150?u=' || NEW.id)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Live Storage Quota calculation when files are uploaded/deleted
CREATE OR REPLACE FUNCTION public.update_editor_storage_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.profiles
        SET storage_used_bytes = storage_used_bytes + NEW.file_size_bytes,
            updated_at = NOW()
        WHERE id = NEW.editor_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.profiles
        SET storage_used_bytes = GREATEST(0, storage_used_bytes - OLD.file_size_bytes),
            updated_at = NOW()
        WHERE id = OLD.editor_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_update_editor_storage ON public.editor_assets;
CREATE TRIGGER tr_update_editor_storage
AFTER INSERT OR DELETE ON public.editor_assets
FOR EACH ROW EXECUTE FUNCTION public.update_editor_storage_usage();

-- ============================================================================
-- 11. SUPABASE STORAGE BUCKETS (For Non-Video Files: PDFs, Images, Resumes)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('avatars', 'avatars', true),
    ('portfolio', 'portfolio', true),
    ('documents', 'documents', true),
    ('deliverables', 'deliverables', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
DO $$ BEGIN
    CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'portfolio', 'deliverables', 'documents'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated user upload files" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users update own files" ON storage.objects FOR UPDATE USING (auth.uid() = owner);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users delete own files" ON storage.objects FOR DELETE USING (auth.uid() = owner OR public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverable_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editor_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 12.1 Profiles Policies
DO $$ BEGIN
    CREATE POLICY "Public can view active profiles" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users update own profile or Admin update any" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins full access to profiles" ON public.profiles FOR ALL USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 12.2 Projects Policies
DO $$ BEGIN
    CREATE POLICY "Authenticated users can view projects" ON public.projects FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can insert/update/delete projects" ON public.projects FOR ALL USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 12.3 Subtasks Policies
DO $$ BEGIN
    CREATE POLICY "Authenticated users can view subtasks" ON public.subtasks FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Editors update assigned subtask status and link" ON public.subtasks FOR UPDATE USING (
        auth.uid() = ANY(assigned_editor_ids) OR public.is_admin()
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins manage subtasks" ON public.subtasks FOR ALL USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 12.4 Deliverable Submissions (v1, v2, review queue)
DO $$ BEGIN
    CREATE POLICY "View deliverable submissions" ON public.deliverable_submissions FOR SELECT USING (
        submitted_by_editor_id = auth.uid() OR public.is_admin()
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Editors insert own deliverable submission" ON public.deliverable_submissions FOR INSERT WITH CHECK (
        submitted_by_editor_id = auth.uid() OR public.is_admin()
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins and submission owners update submissions" ON public.deliverable_submissions FOR UPDATE USING (
        submitted_by_editor_id = auth.uid() OR public.is_admin()
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins delete submissions" ON public.deliverable_submissions FOR DELETE USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 12.5 Portfolio Items Policies
DO $$ BEGIN
    CREATE POLICY "Public read portfolio items" ON public.portfolio_items FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Editors manage own portfolio" ON public.portfolio_items FOR ALL USING (editor_id = auth.uid() OR public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 12.6 Editor Assets Policies
DO $$ BEGIN
    CREATE POLICY "Editors view and manage own assets" ON public.editor_assets FOR ALL USING (editor_id = auth.uid() OR public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 12.7 Activity Logs Policies
DO $$ BEGIN
    CREATE POLICY "Authenticated users view activity logs" ON public.activity_logs FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "System and users insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins manage activity logs" ON public.activity_logs FOR ALL USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 13. REALTIME PUBLICATION (Enables instantaneous live sync across UI)
-- ============================================================================
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.subtasks;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.deliverable_submissions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_items;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.editor_assets;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.subtasks REPLICA IDENTITY FULL;
ALTER TABLE public.deliverable_submissions REPLICA IDENTITY FULL;
ALTER TABLE public.portfolio_items REPLICA IDENTITY FULL;
ALTER TABLE public.editor_assets REPLICA IDENTITY FULL;
ALTER TABLE public.activity_logs REPLICA IDENTITY FULL;

-- ============================================================================
-- 14. FIXED DEMO ADMIN ACCOUNT (admin@gogangs.com / admin1234)
-- ============================================================================
DO $$
DECLARE
    admin_uid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- 1. Insert fixed admin into Supabase auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        role,
        aud
    )
    VALUES (
        admin_uid,
        '00000000-0000-0000-0000-000000000000',
        'admin@gogangs.com',
        crypt('admin1234', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Studio Administrator","role":"admin"}'::jsonb,
        NOW(),
        NOW(),
        'authenticated',
        'authenticated'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 2. Insert fixed admin into public.profiles
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        avatar_url,
        city,
        verification_status,
        storage_tier,
        storage_limit_bytes,
        created_at,
        updated_at
    )
    VALUES (
        admin_uid,
        'admin@gogangs.com',
        'Studio Administrator',
        'admin',
        'https://i.pravatar.cc/150?u=admin',
        'San Francisco, CA',
        'Verified',
        'Studio_200GB',
        214748364800,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
