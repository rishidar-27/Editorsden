import { createClient } from '@supabase/supabase-js';
import type { Editor, Project, Subtask, EditorAsset, VerificationStatus, ProjectStatus } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gogangs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * ============================================================
 * 1. AUTHENTICATION SERVICES
 * ============================================================
 */
export async function signInWithEmail(email: string, password: string) {
  // If real Supabase keys configured, use native Supabase Auth
  if (supabaseUrl.includes('supabase.co') && !supabaseAnonKey.includes('key')) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  // Fallback to Backend REST API
  const res = await fetch('http://localhost:5000/api/editors');
  const editors: Editor[] = await res.json();
  const found = editors.find((e) => e.email.toLowerCase() === email.toLowerCase());
  return { user: found ? { id: found.id, email: found.email } : null };
}

export async function signOutUser() {
  if (supabaseUrl.includes('supabase.co') && !supabaseAnonKey.includes('key')) {
    await supabase.auth.signOut();
  }
}

/**
 * ============================================================
 * 2. PROFILES / EDITORS SERVICES
 * ============================================================
 */
export async function fetchAllEditors(): Promise<Editor[]> {
  try {
    const res = await fetch('http://localhost:5000/api/editors');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // Fallback to direct Supabase query if available
  }

  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error && data && data.length > 0) {
      return data.map((p) => ({
        id: p.id,
        email: p.email,
        password: p.password || 'demo1234',
        fullName: p.full_name,
        city: p.city || '',
        phone: p.phone || '',
        experience: p.experience_years || 0,
        skills: p.skills || [],
        editingSoftware: p.editing_software || [],
        availability: p.availability || 'Part-Time',
        hoursPerWeek: p.hours_per_week || 20,
        bio: p.bio || '',
        avatarUrl: p.avatar_url || `https://i.pravatar.cc/150?u=${p.id}`,
        portfolio: [],
        verificationStatus: p.verification_status || 'Pending',
        verificationDocs: { sampleWorkLinks: [], portfolioLinks: [] },
        active: p.is_active ?? true,
        lastLogin: p.updated_at || new Date().toISOString(),
        lastProfileUpdate: p.updated_at || new Date().toISOString(),
        lastPortfolioUpdate: p.updated_at || new Date().toISOString(),
        storageUsedBytes: Number(p.storage_used_bytes) || 0,
        storageLimitBytes: Number(p.storage_limit_bytes) || 1073741824,
        storageTier: p.storage_tier || 'Free',
      }));
    }
  } catch {}

  return [];
}

export async function updateEditorProfile(id: string, updates: Partial<Editor>) {
  return await fetch(`http://localhost:5000/api/editors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).then((r) => r.json());
}

/**
 * ============================================================
 * 3. PROJECTS & SUBTASKS SERVICES
 * ============================================================
 */
export async function fetchAllProjects(): Promise<Project[]> {
  try {
    const res = await fetch('http://localhost:5000/api/projects');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}

  return [];
}

export async function createProjectRecord(project: Project) {
  return await fetch('http://localhost:5000/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  }).then((r) => r.json());
}

export async function updateSubtaskRecord(
  projectId: string,
  subtaskId: string,
  updates: Partial<Subtask>
) {
  return await fetch(`http://localhost:5000/api/projects/${projectId}/subtasks/${subtaskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).then((r) => r.json());
}

/**
 * ============================================================
 * 4. CLOUDFLARE R2 ASSETS & STORAGE SERVICES
 * ============================================================
 */
export async function fetchEditorAssets(editorId: string) {
  return await fetch(`http://localhost:5000/api/storage/my-assets?editorId=${editorId}`)
    .then((r) => r.json())
    .catch(() => ({ assets: [], storageUsedBytes: 0, storageLimitBytes: 1073741824 }));
}

export async function deleteAssetsFromStorage(editorId: string, assetIds: string[]) {
  return await fetch('http://localhost:5000/api/storage/assets', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ editorId, assetIds }),
  }).then((r) => r.json());
}
