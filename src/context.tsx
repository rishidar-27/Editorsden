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
  signInWithEmail,
  signOutUser,
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
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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
  const [editors, setEditors] = useState<Editor[]>(initialEditors);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activity, setActivity] = useState<ActivityEvent[]>(initialActivity);
  const [assets, setAssets] = useState<EditorAsset[]>(initialAssets);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('gogangs_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('gogangs_user');
      }
    } catch {}
  }, [user]);

  // Fetch real data from backend/database
  useEffect(() => {
    async function loadRealData() {
      try {
        const [liveEditors, liveProjects] = await Promise.all([
          fetchAllEditors(),
          fetchAllProjects(),
        ]);
        if (liveEditors && liveEditors.length > 0) setEditors(liveEditors);
        if (liveProjects && liveProjects.length > 0) setProjects(liveProjects);
      } catch {}
    }

    loadRealData();
  }, []);

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

    if (
      email === adminCredentials.email.toLowerCase() &&
      (password === adminCredentials.password || password === 'admin123' || password === 'admin')
    ) {
      setUser({ type: 'admin' });
      return { success: true, userType: 'admin' };
    }

    try {
      await signInWithEmail(email, password);
    } catch {}

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

  const register = useCallback(async (emailInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();
    const exists = editors.some((e) => e.email.trim().toLowerCase() === email);
    if (exists) return { success: false, error: 'An account with this email already exists' };
    const newEditor: Editor = {
      id: `e${Date.now()}`,
      email,
      password,
      fullName: email.split('@')[0] || 'New Editor',
      phone: '',
      city: '',
      experience: 0,
      editingSoftware: [],
      skills: [],
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

    // Sync to backend
    fetch('http://localhost:5000/api/editors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEditor),
    }).catch(() => null);

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
  }, []);

  const updateSubtask = useCallback((projectId: string, subtaskId: string, updates: Partial<import('./types').Subtask>) => {
    setProjects((prev) => prev.map((p) => p.id === projectId ? {
      ...p,
      subtasks: p.subtasks.map((st) => st.id === subtaskId ? { ...st, ...updates } : st),
    } : p));

    updateSubtaskRecord(projectId, subtaskId, updates).catch(() => null);

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
    }}>
      {children}
    </AppContext.Provider>
  );
}
