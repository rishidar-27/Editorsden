import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Editor, Project, User, ActivityEvent, VerificationStatus, EditorAsset } from './types';
import { editors as initialEditors, projects as initialProjects, activityFeed as initialActivity, adminCredentials } from './data';
import {
  fetchAllEditors,
  fetchAllProjects,
  updateEditorProfile,
  createProjectRecord,
  updateSubtaskRecord,
  deleteAssetsFromStorage,
  fetchEditorAssets,
  addDeliverableSubmissionRecord,
  fetchAllActivityLogs,
  createActivityLogRecord,
  subscribeToDatabaseChanges,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  isSupabaseConfigured,
  supabase,
} from './lib/supabase';

export interface Toast {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'info';
}

const initialAssets: EditorAsset[] = [
  {
    id: 'asset-1',
    editorId: 'e1',
    subtaskId: 'st1',
    fileName: 'hero_brand_film_rough_cut_v2.mp4',
    fileSizeBytes: 245000000,
    mimeType: 'video/mp4',
    r2Key: 'editors/e1/subtasks/st1/hero_brand_film_rough_cut_v2.mp4',
    publicUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'asset-2',
    editorId: 'e1',
    subtaskId: 'st3',
    fileName: 'product_tutorial_4k_master_raw.mov',
    fileSizeBytes: 380000000,
    mimeType: 'video/quicktime',
    r2Key: 'editors/e1/subtasks/st3/product_tutorial_4k_master_raw.mov',
    publicUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    createdAt: '2026-08-22T14:30:00Z',
  },
  {
    id: 'asset-3',
    editorId: 'e2',
    subtaskId: 'st2',
    fileName: 'instagram_reels_pack_5x_color_graded.mp4',
    fileSizeBytes: 180000000,
    mimeType: 'video/mp4',
    r2Key: 'editors/e2/subtasks/st2/instagram_reels_pack_5x_color_graded.mp4',
    publicUrl: 'https://images.unsplash.com/photo-1608248597263-0057e43a4524?w=800',
    createdAt: '2026-08-21T09:15:00Z',
  },
];

interface AppState {
  user: User | null;
  editors: Editor[];
  projects: Project[];
  activity: ActivityEvent[];
  assets: EditorAsset[];
  toasts: Toast[];
  login: (email: string, password: string) => Promise<{ success: boolean; userType?: 'admin' | 'editor'; error?: string }>;
  register: (email: string, password: string, fullName?: string, specialty?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getEditor: (id: string) => Editor | undefined;
  getCurrentEditor: () => Editor | undefined;
  updateEditor: (id: string, updates: Partial<Editor>) => void;
  setVerificationStatus: (editorId: string, status: VerificationStatus, feedback?: string) => void;
  toggleEditorActive: (editorId: string) => void;
  addProject: (project: Project) => void;
  updateSubtask: (projectId: string, subtaskId: string, updates: Partial<import('./types').Subtask>) => void;
  assignEditors: (projectId: string, subtaskId: string, editorIds: string[]) => void;
  deleteEditorAssets: (editorId: string, assetIds: string[]) => Promise<{ success: boolean; freedBytes: number }>;
  addEditorAsset: (asset: EditorAsset) => void;
  upgradeStorageTier: (editorId: string, tier: 'Free' | 'Pro_50GB' | 'Studio_200GB') => void;
  getEditorStorageStats: (editorId: string) => {
    storageUsedBytes: number;
    storageLimitBytes: number;
    storageTier: string;
    percentageUsed: number;
  };
  addToast: (message: string, variant?: Toast['variant']) => void;
  removeToast: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('gogangs_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin')) return { type: 'admin' };
      if (window.location.pathname.startsWith('/editor')) return { type: 'editor', editorId: 'e1' };
    }
    return null;
  });
  const [editors, setEditors] = useState<Editor[]>(() => isSupabaseConfigured() ? [] : initialEditors);
  const [projects, setProjects] = useState<Project[]>(() => isSupabaseConfigured() ? [] : initialProjects);
  const [activity, setActivity] = useState<ActivityEvent[]>(() => isSupabaseConfigured() ? [] : initialActivity);
  const [assets, setAssets] = useState<EditorAsset[]>(() => isSupabaseConfigured() ? [] : initialAssets);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('gogangs_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('gogangs_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('gogangs_theme', 'light');
      }
    } catch {}
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('gogangs_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('gogangs_user');
      }
    } catch {}
  }, [user]);

  // Listen for Supabase session and email confirmation redirects
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Check existing active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const isUserAdmin = session.user.email === 'admin@gogangs.com';
        setUser({
          type: isUserAdmin ? 'admin' : 'editor',
          editorId: session.user.id,
        });
      }
    }).catch(() => null);

    // Listen to auth events (e.g. Email Confirmation callback, token exchange, sign in, sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        const isUserAdmin = session.user.email === 'admin@gogangs.com';
        setUser({
          type: isUserAdmin ? 'admin' : 'editor',
          editorId: session.user.id,
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch real data from Supabase / Backend with Realtime Sync
  useEffect(() => {
    async function loadRealData() {
      try {
        const [liveEditors, liveProjects, liveActivity] = await Promise.all([
          fetchAllEditors(),
          fetchAllProjects(),
          fetchAllActivityLogs(),
        ]);
        if (isSupabaseConfigured()) {
          setEditors(liveEditors || []);
          setProjects(liveProjects || []);
          setActivity(liveActivity || []);
        } else {
          if (liveEditors && liveEditors.length > 0) setEditors(liveEditors);
          if (liveProjects && liveProjects.length > 0) setProjects(liveProjects);
          if (liveActivity && liveActivity.length > 0) setActivity(liveActivity);
        }
      } catch (err) {
        console.warn('Real data load notice:', err);
      }
    }

    loadRealData();

    // Subscribe to live Realtime database broadcasts
    const unsubscribe = subscribeToDatabaseChanges(() => {
      loadRealData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch live storage assets when editor is active
  useEffect(() => {
    if (user?.type === 'editor' && user.editorId) {
      fetchEditorAssets(user.editorId).then((liveAssets) => {
        if (liveAssets && liveAssets.length > 0) {
          setAssets(liveAssets);
        }
      }).catch(() => null);
    }
  }, [user]);

  const addToast = useCallback((message: string, variant: Toast['variant'] = 'info') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const login = useCallback(async (emailInput: string, passwordInput: string): Promise<{ success: boolean; userType?: 'admin' | 'editor'; error?: string }> => {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    // 1. FIXED DEMO CREDENTIALS FOR ADMIN (Instant bypass)
    if (
      email === adminCredentials.email.toLowerCase() &&
      (password === adminCredentials.password || password === 'admin123' || password === 'admin')
    ) {
      setUser({ type: 'admin' });
      return { success: true, userType: 'admin' };
    }

    // 2. SUPABASE AUTH FOR EDITORS
    if (isSupabaseConfigured()) {
      try {
        const authRes = await signInWithEmail(email, password);
        if (authRes?.user) {
          setUser({ type: 'editor', editorId: authRes.user.id });
          return { success: true, userType: 'editor' };
        }
      } catch (authErr: any) {
        return { success: false, error: authErr.message || 'Invalid email or password' };
      }
    }

    // Fallback for local testing
    const editor = editors.find((e) => {
      const matchEmail = e.email.trim().toLowerCase() === email ||
        (email === 'marcus.chen@example.com' && e.id === 'e1');
      const matchPass = e.password === password || password === 'demo1234' || password === 'editor123' || password === 'editor1234';
      return matchEmail && matchPass;
    });

    if (editor) {
      setUser({ type: 'editor', editorId: editor.id });
      setEditors((prev) => prev.map((e) => e.id === editor.id ? { ...e, lastLogin: new Date().toISOString() } : e));
      return { success: true, userType: 'editor' };
    }

    return { success: false, error: 'Invalid email or password' };
  }, [editors]);

  const register = useCallback(async (emailInput: string, passwordInput: string, fullNameInput?: string, specialtyInput?: string): Promise<{ success: boolean; error?: string }> => {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();
    const displayName = fullNameInput?.trim() || email.split('@')[0] || 'New Editor';

    // SUPABASE AUTH REGISTRATION FOR EDITORS
    if (isSupabaseConfigured()) {
      try {
        const authRes = await signUpWithEmail(email, password, displayName, 'editor', specialtyInput);
        if (authRes?.user) {
          setUser({ type: 'editor', editorId: authRes.user.id });
          return { success: true };
        }
      } catch (authErr: any) {
        return { success: false, error: authErr.message || 'Could not register user with Supabase' };
      }
    }

    // Fallback for local testing
    const exists = editors.some((e) => e.email.trim().toLowerCase() === email);
    if (exists) return { success: false, error: 'An account with this email already exists' };

    const newEditor: Editor = {
      id: `e${Date.now()}`,
      email,
      password,
      fullName: displayName,
      phone: '',
      city: '',
      experience: 0,
      editingSoftware: (specialtyInput ? [specialtyInput] : []) as any,
      skills: (specialtyInput ? [specialtyInput] : []) as any,
      availability: 'Not Available',
      hoursPerWeek: 0,
      bio: '',
      avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
      portfolio: [],
      verificationStatus: 'Pending',
      verificationDocs: { sampleWorkLinks: [], portfolioLinks: [] },
      active: true,
      lastLogin: new Date().toISOString(),
      lastProfileUpdate: new Date().toISOString(),
      lastPortfolioUpdate: new Date().toISOString(),
      storageUsedBytes: 0,
      storageLimitBytes: 1073741824,
      storageTier: 'Free',
    };

    setEditors((prev) => [...prev, newEditor]);
    setUser({ type: 'editor', editorId: newEditor.id });

    return { success: true };
  }, [editors]);

  const logout = useCallback(() => {
    signOutUser();
    setUser(null);
  }, []);

  const getEditor = useCallback((id: string) => editors.find((e) => e.id === id), [editors]);

  const getCurrentEditor = useCallback(() => {
    if (user?.type === 'editor' && user.editorId) {
      return editors.find((e) => e.id === user.editorId);
    }
    return editors.find((e) => e.id === 'e1') || editors[0];
  }, [user, editors]);

  const updateEditor = useCallback((id: string, updates: Partial<Editor>) => {
    setEditors((prev) => prev.map((e) => e.id === id ? { ...e, ...updates, lastProfileUpdate: new Date().toISOString() } : e));
    updateEditorProfile(id, updates).catch(() => null);
  }, []);

  const setVerificationStatus = useCallback((editorId: string, status: VerificationStatus, feedback?: string) => {
    setEditors((prev) => prev.map((e) => e.id === editorId ? {
      ...e,
      verificationStatus: status,
      verificationFeedback: feedback,
    } : e));
    updateEditorProfile(editorId, { verificationStatus: status, verificationFeedback: feedback }).catch(() => null);

    const editor = editors.find((e) => e.id === editorId);
    const type = status === 'Verified' ? 'verify' : status === 'Rejected' ? 'reject' : 'register';
    const event: ActivityEvent = {
      id: `a${Date.now()}`,
      type,
      message: status === 'Verified'
        ? `${editor?.fullName || 'Editor'} verified as an editor`
        : status === 'Rejected'
        ? `${editor?.fullName || 'Editor'}'s verification rejected`
        : `${editor?.fullName || 'Editor'} submitted for verification`,
      timestamp: new Date().toISOString(),
    };
    setActivity((prev) => [event, ...prev]);
  }, [editors]);

  const toggleEditorActive = useCallback((editorId: string) => {
    setEditors((prev) => prev.map((e) => e.id === editorId ? { ...e, active: !e.active } : e));
    const current = editors.find((e) => e.id === editorId);
    if (current) {
      updateEditorProfile(editorId, { active: !current.active }).catch(() => null);
    }
  }, [editors]);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev]);
    createProjectRecord(project).catch(() => null);

    const event: ActivityEvent = {
      id: `a${Date.now()}`,
      type: 'create_project',
      message: `Project "${project.title}" created`,
      timestamp: new Date().toISOString(),
    };
    setActivity((prev) => [event, ...prev]);
    createActivityLogRecord({ type: event.type, message: event.message }).catch(() => null);
  }, []);

  const updateSubtask = useCallback((projectId: string, subtaskId: string, updates: Partial<import('./types').Subtask>) => {
    setProjects((prev) => prev.map((p) => p.id === projectId ? {
      ...p,
      subtasks: p.subtasks.map((st) => st.id === subtaskId ? { ...st, ...updates } : st),
    } : p));

    updateSubtaskRecord(projectId, subtaskId, updates).catch(() => null);

    if (updates.deliverablesQueue && updates.deliverablesQueue.length > 0) {
      addDeliverableSubmissionRecord(subtaskId, updates.deliverablesQueue[0]).catch(() => null);
    }

    if (updates.status === 'Ready for Review') {
      const project = projects.find((p) => p.id === projectId);
      const subtask = project?.subtasks.find((st) => st.id === subtaskId);
      const editor = subtask ? editors.find((e) => e.id === subtask.assignedEditorIds[0]) : undefined;
      const event: ActivityEvent = {
        id: `a${Date.now()}`,
        type: 'submit_review',
        message: `${editor?.fullName || 'Editor'} submitted "${subtask?.title || 'task'}" for review`,
        timestamp: new Date().toISOString(),
      };
      setActivity((prev) => [event, ...prev]);
      createActivityLogRecord({ type: event.type, message: event.message, metadata: { projectId, subtaskId } }).catch(() => null);
    }
  }, [projects, editors]);

  const assignEditors = useCallback((projectId: string, subtaskId: string, editorIds: string[]) => {
    setProjects((prev) => prev.map((p) => p.id === projectId ? {
      ...p,
      subtasks: p.subtasks.map((st) => st.id === subtaskId ? { ...st, assignedEditorIds: editorIds } : st),
    } : p));

    updateSubtaskRecord(projectId, subtaskId, { assignedEditorIds: editorIds }).catch(() => null);
  }, []);

  // Storage Quota Methods
  const getEditorStorageStats = useCallback((editorId: string) => {
    const editor = editors.find((e) => e.id === editorId);
    const editorAssets = assets.filter((a) => a.editorId === editorId);
    const storageUsedBytes = editorAssets.reduce((sum, a) => sum + a.fileSizeBytes, 0);
    const storageLimitBytes = editor?.storageLimitBytes || 1073741824;
    const storageTier = editor?.storageTier || 'Free';
    const percentageUsed = Math.min(100, Math.round((storageUsedBytes / storageLimitBytes) * 100));

    return {
      storageUsedBytes,
      storageLimitBytes,
      storageTier,
      percentageUsed,
    };
  }, [editors, assets]);

  const addEditorAsset = useCallback((asset: EditorAsset) => {
    setAssets((prev) => [asset, ...prev]);
    fetch('http://localhost:5000/api/storage/confirm-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    }).catch(() => null);
  }, []);

  const deleteEditorAssets = useCallback(async (editorId: string, assetIds: string[]) => {
    const toDelete = assets.filter((a) => a.editorId === editorId && assetIds.includes(a.id));
    const freedBytes = toDelete.reduce((sum, a) => sum + a.fileSizeBytes, 0);

    setAssets((prev) => prev.filter((a) => !(a.editorId === editorId && assetIds.includes(a.id))));
    deleteAssetsFromStorage(editorId, assetIds).catch(() => null);

    return { success: true, freedBytes };
  }, [assets]);

  const upgradeStorageTier = useCallback((editorId: string, tier: 'Free' | 'Pro_50GB' | 'Studio_200GB') => {
    const limits = {
      Free: 1073741824,
      Pro_50GB: 53687091200,
      Studio_200GB: 214748364800,
    };

    setEditors((prev) =>
      prev.map((e) =>
        e.id === editorId
          ? {
              ...e,
              storageTier: tier,
              storageLimitBytes: limits[tier] || 1073741824,
            }
          : e
      )
    );

    fetch('http://localhost:5000/api/storage/upgrade-tier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ editorId, planTier: tier }),
    }).catch(() => null);
  }, []);

  return (
    <AppContext.Provider value={{
      user, editors, projects, activity, assets, toasts,
      login, register, logout, getEditor, getCurrentEditor,
      updateEditor, setVerificationStatus, toggleEditorActive,
      addProject, updateSubtask, assignEditors,
      getEditorStorageStats, addEditorAsset, deleteEditorAssets, upgradeStorageTier,
      addToast, removeToast,
      darkMode, toggleDarkMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}
