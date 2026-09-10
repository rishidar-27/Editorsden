import { createClient } from '@supabase/supabase-js';
import type { Editor, Project, Subtask, EditorAsset, ActivityEvent, DeliverableSubmission } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gogangs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.includes('supabase.co') &&
    !supabaseAnonKey.includes('key')
  );
};

/**
 * ============================================================
 * 1. AUTHENTICATION SERVICES
 * ============================================================
 */
export async function signInWithEmail(email: string, password: string) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  // Fallback for local testing
  return { user: { id: 'e1', email } };
}

export async function signUpWithEmail(email: string, password: string, fullName: string, role: 'admin' | 'editor' = 'editor', specialty?: string) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          ...(specialty && specialty.trim() ? { specialty: specialty.trim() } : {}),
        },
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (error) throw error;
    return data;
  }

  return { user: { id: `e-${Date.now()}`, email } };
}

export async function resendConfirmationEmail(email: string) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (error) throw error;
    return true;
  }
  return true;
}

export async function signOutUser() {
  if (isSupabaseConfigured()) {
    await supabase.auth.signOut();
  }
}

/**
 * ============================================================
 * 2. PROFILES / EDITORS SERVICES (Direct Supabase)
 * ============================================================
 */
export async function fetchAllEditors(): Promise<Editor[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, portfolio:portfolio_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Exclude administrator accounts from the editors directory
        const editorProfiles = data.filter(
          (p) => p.role !== 'admin' && p.email !== 'admin@gogangs.com'
        );

        return editorProfiles.map((p) => ({
          id: p.id,
          email: p.email,
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
          portfolio: (p.portfolio || []).map((port: any) => ({
            id: port.id,
            title: port.title,
            type: port.type || 'video',
            thumbnailUrl: port.thumbnail_url || '',
            link: port.link,
            featured: port.featured ?? false,
          })),
          verificationStatus: p.verification_status || 'Pending',
          verificationFeedback: p.verification_feedback || undefined,
          verificationDocs: {
            resumeLink: p.resume_link,
            sampleWorkLinks: p.sample_work_links || [],
            portfolioLinks: p.portfolio_links || [],
          },
          active: p.is_active ?? true,
          lastLogin: p.last_login || p.updated_at || new Date().toISOString(),
          lastProfileUpdate: p.updated_at || new Date().toISOString(),
          lastPortfolioUpdate: p.updated_at || new Date().toISOString(),
          createdAt: p.created_at || p.joined_date || p.last_login || new Date().toISOString(),
          role: p.role || 'editor',
          storageUsedBytes: Number(p.storage_used_bytes) || 0,
          storageLimitBytes: Number(p.storage_limit_bytes) || 1073741824,
          storageTier: p.storage_tier || 'Free',
          hourlyRate: p.hourly_rate || '$65/hr',
          rating: p.rating || 5.0,
          reviewsCount: p.reviews_count || 0,
          completedProjects: p.completed_projects || 0,
          hardware: p.hardware,
          turnaround: p.turnaround || '24h - 48h',
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchAllEditors notice:', err);
    }
    return [];
  }

  // Fallback to Express backend only if Supabase is not configured
  try {
    const res = await fetch('http://localhost:5000/api/editors');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.filter((e: any) => e.email !== 'admin@gogangs.com' && e.role !== 'admin');
      }
    }
  } catch {}

  return [];
}

export async function updateEditorProfile(id: string, updates: Partial<Editor>) {
  const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
  if (updates.city !== undefined) dbUpdates.city = updates.city;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
  if (updates.experience !== undefined) dbUpdates.experience_years = updates.experience;
  if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
  if (updates.editingSoftware !== undefined) dbUpdates.editing_software = updates.editingSoftware;
  if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
  if (updates.hoursPerWeek !== undefined) dbUpdates.hours_per_week = updates.hoursPerWeek;
  if (updates.verificationStatus !== undefined) dbUpdates.verification_status = updates.verificationStatus;
  if (updates.verificationFeedback !== undefined) dbUpdates.verification_feedback = updates.verificationFeedback;
  if (updates.active !== undefined) dbUpdates.is_active = updates.active;
  if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
  if (updates.storageTier !== undefined) dbUpdates.storage_tier = updates.storageTier;
  if (updates.storageLimitBytes !== undefined) dbUpdates.storage_limit_bytes = updates.storageLimitBytes;
  if (updates.hardware !== undefined) dbUpdates.hardware = updates.hardware;
  if (updates.lastLogin !== undefined) dbUpdates.last_login = updates.lastLogin;

  // 1. Guaranteed server-side Supabase write using Service Role Key (bypasses RLS)
  try {
    const res = await fetch(`http://localhost:5000/api/editors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const serverData = await res.json();
      if (serverData) return serverData;
    }
  } catch {}

  // 2. Direct browser Supabase update (for authenticated sessions)
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('profiles').update(dbUpdates).eq('id', id).select().single();
      if (!error) return data;
    } catch {}
  }

  return null;
}

/**
 * ============================================================
 * 3. PROJECTS & SUBTASKS SERVICES (Direct Supabase)
 * ============================================================
 */
export async function fetchAllProjects(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          client_name,
          description,
          status,
          created_at,
          subtasks (
            id,
            project_id,
            title,
            task_type,
            deadline,
            status,
            deliverable_link,
            feedback,
            assigned_editor_ids,
            deliverable_submissions (
              id,
              subtask_id,
              version,
              file_name,
              file_size_bytes,
              file_url,
              mime_type,
              notes,
              status,
              feedback,
              feedback_given_at,
              submitted_at,
              submitted_by_editor_id
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((p) => ({
          id: p.id,
          title: p.title,
          clientName: p.client_name,
          createdAt: p.created_at,
          subtasks: (p.subtasks || []).map((st: any) => ({
            id: st.id,
            projectId: st.project_id,
            title: st.title,
            taskType: st.task_type,
            deadline: st.deadline,
            status: st.status,
            deliverableLink: st.deliverable_link,
            feedback: st.feedback,
            assignedEditorIds: st.assigned_editor_ids || [],
            deliverablesQueue: (st.deliverable_submissions || [])
              .sort((a: any, b: any) => (b.version || 0) - (a.version || 0))
              .map((sub: any) => ({
                id: sub.id,
                version: sub.version,
                fileName: sub.file_name,
                fileSizeBytes: Number(sub.file_size_bytes) || 0,
                fileUrl: sub.file_url,
                mimeType: sub.mime_type,
                notes: sub.notes,
                status: sub.status,
                feedback: sub.feedback,
                feedbackGivenAt: sub.feedback_given_at,
                submittedAt: sub.submitted_at,
                submittedByEditorId: sub.submitted_by_editor_id,
              })),
          })),
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchAllProjects notice:', err);
    }
    return [];
  }

  // Fallback to Express backend only if Supabase is not configured
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
  if (isSupabaseConfigured()) {
    const { data: projectData, error } = await supabase.from('projects').insert({
      id: project.id.startsWith('p-') ? undefined : project.id,
      title: project.title,
      client_name: project.clientName,
      status: 'In Progress',
    }).select().single();

    if (!error && projectData && project.subtasks && project.subtasks.length > 0) {
      const subtaskInserts = project.subtasks.map((st) => ({
        project_id: projectData.id,
        title: st.title,
        task_type: st.taskType,
        deadline: st.deadline,
        status: st.status,
        deliverable_link: st.deliverableLink,
        feedback: st.feedback,
        assigned_editor_ids: st.assignedEditorIds || [],
      }));
      await supabase.from('subtasks').insert(subtaskInserts);
    }
  }

  return await fetch('http://localhost:5000/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  }).then((r) => r.json()).catch(() => null);
}

export async function updateSubtaskRecord(
  projectId: string,
  subtaskId: string,
  updates: Partial<Subtask>
) {
  if (isSupabaseConfigured()) {
    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.deliverableLink !== undefined) dbUpdates.deliverable_link = updates.deliverableLink;
    if (updates.feedback !== undefined) dbUpdates.feedback = updates.feedback;
    if (updates.assignedEditorIds !== undefined) dbUpdates.assigned_editor_ids = updates.assignedEditorIds;
    if (updates.title !== undefined) dbUpdates.title = updates.title;

    await supabase.from('subtasks').update(dbUpdates).eq('id', subtaskId);
  }

  return await fetch(`http://localhost:5000/api/projects/${projectId}/subtasks/${subtaskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).then((r) => r.json()).catch(() => null);
}

export async function addDeliverableSubmissionRecord(subtaskId: string, submission: DeliverableSubmission) {
  if (isSupabaseConfigured()) {
    await supabase.from('deliverable_submissions').insert({
      subtask_id: subtaskId,
      version: submission.version,
      file_name: submission.fileName,
      file_size_bytes: submission.fileSizeBytes,
      file_url: submission.fileUrl,
      mime_type: submission.mimeType,
      notes: submission.notes,
      submitted_by_editor_id: submission.submittedByEditorId,
      status: submission.status || 'In Review',
    });
  }
}

/**
 * ============================================================
 * 4. ASSETS & STORAGE SERVICES (Direct Supabase & Storage)
 * ============================================================
 */
export async function fetchEditorAssets(editorId: string): Promise<EditorAsset[]> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase
      .from('editor_assets')
      .select('*')
      .eq('editor_id', editorId)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      return data.map((a) => ({
        id: a.id,
        editorId: a.editor_id,
        subtaskId: a.subtask_id,
        fileName: a.file_name,
        fileSizeBytes: Number(a.file_size_bytes) || 0,
        mimeType: a.mime_type,
        r2Key: a.r2_key || a.file_name,
        publicUrl: a.public_url,
        createdAt: a.created_at,
      }));
    }
  }

  return await fetch(`http://localhost:5000/api/storage/my-assets?editorId=${editorId}`)
    .then((r) => r.json())
    .then((data) => data.assets || [])
    .catch(() => []);
}

export async function deleteAssetsFromStorage(editorId: string, assetIds: string[]) {
  if (isSupabaseConfigured()) {
    await supabase.from('editor_assets').delete().in('id', assetIds);
  }

  return await fetch('http://localhost:5000/api/storage/assets', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ editorId, assetIds }),
  }).then((r) => r.json()).catch(() => null);
}

/**
 * Supabase Storage Uploader for Non-Video Files (PDF resumes, avatars, documents, attachments)
 */
export async function uploadToSupabaseStorage(
  bucket: 'avatars' | 'portfolio' | 'deliverables' | 'documents',
  path: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });
  if (error) throw error;
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicData.publicUrl;
}

/**
 * ============================================================
 * 5. ACTIVITY LOGS / AUDIT SERVICES (Realtime Activity Feed)
 * ============================================================
 */
export async function fetchAllActivityLogs(): Promise<ActivityEvent[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      return data.map((log: any) => ({
        id: log.id,
        type: log.type,
        message: log.message,
        timestamp: log.created_at,
      }));
    }
  }

  return [];
}

export async function createActivityLogRecord(event: {
  type: string;
  message: string;
  actorId?: string;
  metadata?: Record<string, any>;
}) {
  if (isSupabaseConfigured()) {
    await supabase.from('activity_logs').insert({
      type: event.type,
      message: event.message,
      actor_id: event.actorId || null,
      metadata: event.metadata || {},
    });
  }
}

/**
 * ============================================================
 * 6. REALTIME SYNC LISTENER
 * ============================================================
 */
export function subscribeToDatabaseChanges(onPayload: () => void) {
  if (!isSupabaseConfigured()) return () => {};

  const channel = supabase
    .channel('realtime-all-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => onPayload())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => onPayload())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'subtasks' }, () => onPayload())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'deliverable_submissions' }, () => onPayload())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'editor_assets' }, () => onPayload())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, () => onPayload())
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

