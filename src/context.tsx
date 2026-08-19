import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Editor, Project, User, ActivityEvent, VerificationStatus } from './types';
import { editors as initialEditors, projects as initialProjects, activityFeed as initialActivity, adminCredentials } from './data';

export interface Toast {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'info';
}

interface AppState {
  user: User | null;
  editors: Editor[];
  projects: Project[];
  activity: ActivityEvent[];
  toasts: Toast[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  getEditor: (id: string) => Editor | undefined;
  getCurrentEditor: () => Editor | undefined;
  updateEditor: (id: string, updates: Partial<Editor>) => void;
  setVerificationStatus: (editorId: string, status: VerificationStatus, feedback?: string) => void;
  toggleEditorActive: (editorId: string) => void;
  addProject: (project: Project) => void;
  updateSubtask: (projectId: string, subtaskId: string, updates: Partial<import('./types').Subtask>) => void;
  assignEditors: (projectId: string, subtaskId: string, editorIds: string[]) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [editors, setEditors] = useState<Editor[]>(initialEditors);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activity, setActivity] = useState<ActivityEvent[]>(initialActivity);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Fetch initial data from Node.js & Express backend server using native fetch
  useEffect(() => {
    async function fetchBackendData() {
      try {
        const [editorsRes, projectsRes] = await Promise.all([
          fetch('http://localhost:5000/api/editors').catch(() => null),
          fetch('http://localhost:5000/api/projects').catch(() => null),
        ]);

        if (editorsRes && editorsRes.ok) {
          const editorsData = await editorsRes.json();
          if (Array.isArray(editorsData) && editorsData.length > 0) {
            setEditors(editorsData);
          }
        }

        if (projectsRes && projectsRes.ok) {
          const projectsData = await projectsRes.json();
          if (Array.isArray(projectsData) && projectsData.length > 0) {
            setProjects(projectsData);
          }
        }
      } catch (err) {
        console.warn('Express backend server fallback to local state:', err);
      }
    }
    fetchBackendData();
  }, []);

  const addToast = useCallback((message: string, variant: Toast['variant'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    if (email === adminCredentials.email && password === adminCredentials.password) {
      setUser({ type: 'admin' });
      return { success: true };
    }
    const editor = editors.find((e) => e.email === email && e.password === password);
    if (editor) {
      setUser({ type: 'editor', editorId: editor.id });
      setEditors((prev) => prev.map((e) => e.id === editor.id ? { ...e, lastLogin: new Date().toISOString() } : e));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, [editors]);

  const register = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const exists = editors.some((e) => e.email === email);
    if (exists) return { success: false, error: 'An account with this email already exists' };
    const newEditor: Editor = {
      id: `e${Date.now()}`,
      email,
      password,
      fullName: '',
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
    };
    setEditors((prev) => [...prev, newEditor]);
    setUser({ type: 'editor', editorId: newEditor.id });
    return { success: true };
  }, [editors]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const getEditor = useCallback((id: string) => editors.find((e) => e.id === id), [editors]);

  const getCurrentEditor = useCallback(() => {
    if (user?.type === 'editor' && user.editorId) {
      return editors.find((e) => e.id === user.editorId);
    }
    return undefined;
  }, [user, editors]);

  const updateEditor = useCallback((id: string, updates: Partial<Editor>) => {
    setEditors((prev) => prev.map((e) => e.id === id ? { ...e, ...updates, lastProfileUpdate: new Date().toISOString() } : e));
  }, []);

  const setVerificationStatus = useCallback((editorId: string, status: VerificationStatus, feedback?: string) => {
    setEditors((prev) => prev.map((e) => e.id === editorId ? {
      ...e,
      verificationStatus: status,
      verificationFeedback: feedback,
    } : e));
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
  }, []);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev]);
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
  }, []);

  return (
    <AppContext.Provider value={{
      user, editors, projects, activity, toasts,
      login, register, logout, getEditor, getCurrentEditor,
      updateEditor, setVerificationStatus, toggleEditorActive,
      addProject, updateSubtask, assignEditors, addToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}
