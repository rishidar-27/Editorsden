import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bell,
  Menu,
  X,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon,
  ExternalLink,
  Sun,
  Moon,
  Briefcase,
  Layers,
  FileText,
  Clock,
  ArrowRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '@/context';
import { Avatar } from './ui';

interface NavItem {
  label: string;
  route: string;
}

interface TopNavProps {
  items: NavItem[];
  currentRoute: string;
  onNavigate: (route: string) => void;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export function TopNav({ items, currentRoute, onNavigate, showSearch = false, showNotifications = true }: TopNavProps) {
  const { user, getCurrentEditor, editors, logout, projects, activity, darkMode, toggleDarkMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const currentEditor = getCurrentEditor();

  const isMac = useMemo(() => {
    return (
      typeof navigator !== 'undefined' &&
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent)
    );
  }, []);

  // Global keyboard shortcut to open/close search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  const storageKey = `gogangs_read_notifs_${user?.type === 'admin' ? 'admin' : (user?.editorId || 'guest')}`;
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'review':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'approve':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'feedback':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />;
      case 'in_progress':
        return <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'assign':
        return <Briefcase className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'verify':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400" />;
    }
  };

  const notifications = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      message: string;
      time: string;
      unread: boolean;
      route: string;
      type: string;
    }> = [];

    const now = Date.now();

    if (user?.type === 'admin') {
      // 1. Pending reviews in projects
      projects.forEach((proj) => {
        proj.subtasks?.forEach((st) => {
          if (st.status === 'Ready for Review') {
            const assignedEditor = editors.find((e) => st.assignedEditorIds?.includes(e.id));
            const count = st.deliverablesQueue?.length || 1;
            list.push({
              id: `review-${st.id}-${count}`,
              title: 'Deliverable Needs Review',
              message: `${assignedEditor?.fullName || 'Editor'} submitted cut v${count} for "${st.title}" in ${proj.title}.`,
              time: 'In Queue',
              unread: !readIds.includes(`review-${st.id}-${count}`),
              route: '/admin/reviews',
              type: 'review',
            });
          }

          // 2. Editor Started Working (In Progress)
          if (st.status === 'In Progress') {
            const assignedEditor = editors.find((e) => st.assignedEditorIds?.includes(e.id));
            list.push({
              id: `started-${st.id}`,
              title: 'Editor Working on Task',
              message: `${assignedEditor?.fullName || 'Editor'} is actively working on "${st.title}" in ${proj.title}.`,
              time: 'In Progress',
              unread: !readIds.includes(`started-${st.id}`),
              route: `/admin/projects/${proj.id}`,
              type: 'in_progress',
            });
          }

          // 3. Overdue Subtask alert for admin
          if (st.status !== 'Approved' && st.deadline) {
            const d = new Date(st.deadline);
            if (!isNaN(d.getTime())) {
              const days = Math.ceil((d.getTime() - now) / (1000 * 60 * 60 * 24));
              if (days < 0) {
                const assignedEditor = editors.find((e) => st.assignedEditorIds?.includes(e.id));
                list.push({
                  id: `admin-overdue-${st.id}`,
                  title: 'Subtask Overdue',
                  message: `"${st.title}" in ${proj.title} is ${Math.abs(days)}d past deadline (${assignedEditor?.fullName || 'Unassigned'}).`,
                  time: 'Overdue',
                  unread: !readIds.includes(`admin-overdue-${st.id}`),
                  route: `/admin/projects/${proj.id}`,
                  type: 'deadline',
                });
              }
            }
          }
        });
      });

      // 4. Pending editor verifications
      editors.forEach((ed) => {
        if (ed.verificationStatus === 'Pending') {
          list.push({
            id: `verify-${ed.id}`,
            title: 'Editor Verification Request',
            message: `${ed.fullName} registered and requested editor verification.`,
            time: 'Pending',
            unread: !readIds.includes(`verify-${ed.id}`),
            route: '/admin/verification',
            type: 'verify',
          });
        }
      });

      // 5. Recent Activity Logs stream
      (activity || []).slice(0, 5).forEach((act) => {
        list.push({
          id: `act-${act.id}`,
          title: act.type === 'deadline' ? 'Deadline Updated' : act.type === 'submit_review' ? 'Submission' : act.type === 'approve' ? 'Approved' : 'Activity',
          message: act.message,
          time: 'Recent',
          unread: !readIds.includes(`act-${act.id}`),
          route: act.type === 'submit_review' ? '/admin/reviews' : '/admin/projects',
          type: act.type,
        });
      });
    } else if (user?.type === 'editor' && currentEditor) {
      // Dynamic notifications for the logged in editor
      projects.forEach((proj) => {
        proj.subtasks?.forEach((st) => {
          if (st.assignedEditorIds?.includes(currentEditor.id)) {
            // A. Deadline Notice (whenever deadline is updated or set)
            if (st.deadline) {
              const d = new Date(st.deadline);
              if (!isNaN(d.getTime())) {
                const days = Math.ceil((d.getTime() - now) / (1000 * 60 * 60 * 24));
                const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const deadlineId = `deadline-${st.id}-${st.deadline.slice(0, 10)}`;
                list.push({
                  id: deadlineId,
                  title: 'Deadline Updated',
                  message: `The deadline for "${st.title}" in project "${proj.title}" is ${formatted}.`,
                  time: days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due Today' : `${days}d left`,
                  unread: !readIds.includes(deadlineId),
                  route: '/editor/projects',
                  type: 'deadline',
                });

                // Urgent deadline notice if due within 2 days or overdue
                if (st.status !== 'Approved' && days <= 2) {
                  const urgentId = `urgent-${st.id}-${days < 0 ? 'overdue' : 'due'}`;
                  list.push({
                    id: urgentId,
                    title: days < 0 ? 'Task Overdue' : 'Urgent: Due Soon',
                    message: `"${st.title}" in project "${proj.title}" is ${days < 0 ? `${Math.abs(days)}d past deadline` : 'due soon'}. Please submit your deliverable cut.`,
                    time: 'Urgent',
                    unread: !readIds.includes(urgentId),
                    route: '/editor/projects',
                    type: 'deadline',
                  });
                }
              }
            }

            // B. Revision Requested by Admin
            if (st.status === 'Sent Back') {
              list.push({
                id: `feedback-${st.id}`,
                title: 'Admin Revision Feedback',
                message: st.feedback || `Revisions requested on "${st.title}". Please check revision notes.`,
                time: 'Revision',
                unread: !readIds.includes(`feedback-${st.id}`),
                route: '/editor/projects',
                type: 'feedback',
              });
            } else if (st.status === 'Approved') {
              // C. Deliverable Approved
              list.push({
                id: `approved-${st.id}`,
                title: 'Deliverable Approved',
                message: `Your deliverable for "${st.title}" in ${proj.title} has been approved!`,
                time: 'Approved',
                unread: !readIds.includes(`approved-${st.id}`),
                route: '/editor/projects',
                type: 'approve',
              });
            } else if (st.status === 'Assigned' || st.status === 'In Progress') {
              // D. Assigned Task with Brief
              list.push({
                id: `assign-${st.id}`,
                title: st.status === 'In Progress' ? 'In Progress Task' : 'New Assignment',
                message: `Assigned to "${st.title}" in project "${proj.title}". ${st.description ? `Brief: ${st.description}` : ''}`,
                time: 'Active',
                unread: !readIds.includes(`assign-${st.id}`),
                route: '/editor/projects',
                type: 'assign',
              });
            }
          }
        });
      });

      if (currentEditor.verificationStatus === 'Verified') {
        list.push({
          id: `verified-${currentEditor.id}`,
          title: 'Creator Verified',
          message: 'Your editor profile is verified for commercial agency assignments.',
          time: 'Active',
          unread: !readIds.includes(`verified-${currentEditor.id}`),
          route: '/editor/profile',
          type: 'verify',
        });
      } else if (currentEditor.verificationStatus === 'Rejected') {
        list.push({
          id: `rejected-${currentEditor.id}`,
          title: 'Verification Feedback',
          message: currentEditor.verificationFeedback || 'Your verification submission requires updates.',
          time: 'Action Needed',
          unread: !readIds.includes(`rejected-${currentEditor.id}`),
          route: '/editor/profile',
          type: 'verify',
        });
      }
    }

    return list;
  }, [user, currentEditor, projects, editors, activity, readIds]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  const markAsRead = (id: string, route?: string) => {
    const updated = Array.from(new Set([...readIds, id]));
    setReadIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
    if (route) {
      setNotificationsOpen(false);
      onNavigate(route);
    }
  };

  const liveReviewCount = useMemo(() => {
    return projects.flatMap((p) => p.subtasks).filter((st) => st.status === 'Ready for Review').length;
  }, [projects]);

  // Quick navigation recommendations when search query is empty
  const quickLinks = useMemo(() => {
    if (user?.type === 'admin') {
      return [
        { label: 'Editor Directory', route: '/admin/editors', category: 'Directory', icon: UserIcon },
        { label: 'Review Queue', route: '/admin/review', category: 'Approvals', icon: Clock },
        { label: 'Client Projects', route: '/admin/projects', category: 'Pipeline', icon: Briefcase },
        { label: 'Production Reports', route: '/admin/reports', category: 'Analytics', icon: FileText },
      ];
    }
    return [
      { label: 'Active Projects', route: '/editor/projects', category: 'Tasks', icon: Briefcase },
      { label: 'Cloud Storage', route: '/editor/storage', category: 'Assets', icon: Layers },
      { label: 'Master Portfolio', route: '/editor/portfolio', category: 'Showcase', icon: FileText },
      { label: 'Studio Profile', route: '/editor/profile', category: 'Profile', icon: UserIcon },
    ];
  }, [user]);

  // Live real-time search results matching editors, projects, tasks, and routes
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    // 1. Editors search (excluding admin)
    const matchedEditors = editors
      .filter((e) => (e as any).role !== 'admin' && e.email !== 'admin@gogangs.com')
      .filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          (e.skills || []).some((s) => s.toLowerCase().includes(q))
      )
      .slice(0, 5)
      .map((e) => ({
        id: `editor-${e.id}`,
        title: e.fullName,
        subtitle: `${e.city || 'Remote'} • ${e.skills?.[0] || 'Editor'}`,
        category: 'Editor' as const,
        route: user?.type === 'admin' ? `/admin/editor/${e.id}` : `/editor/${e.id}`,
        badge: e.verificationStatus,
      }));

    // 2. Projects search
    const matchedProjects = (projects || [])
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.clientName && p.clientName.toLowerCase().includes(q))
      )
      .slice(0, 5)
      .map((p) => ({
        id: `proj-${p.id}`,
        title: p.title,
        subtitle: p.clientName ? `Client: ${p.clientName}` : 'Project',
        category: 'Project' as const,
        route: user?.type === 'admin' ? `/admin/projects/${p.id}` : `/editor/projects`,
        badge: `${p.subtasks?.length || 0} subtasks`,
      }));

    // 3. Subtasks search
    const matchedTasks = (projects || [])
      .flatMap((p) =>
        (p.subtasks || []).map((st) => ({
          ...st,
          projectTitle: p.title,
        }))
      )
      .filter(
        (st) =>
          st.title.toLowerCase().includes(q) ||
          (st.taskType && st.taskType.toLowerCase().includes(q))
      )
      .slice(0, 5)
      .map((st) => ({
        id: `task-${st.id}`,
        title: st.title,
        subtitle: `${st.projectTitle} • ${st.taskType || 'Milestone'}`,
        category: 'Task' as const,
        route: user?.type === 'admin' ? `/admin/review` : `/editor/projects`,
        badge: st.status,
      }));

    // 4. Navigation route matches
    const matchedPages = items
      .filter((item) => item.label.toLowerCase().includes(q))
      .map((item) => ({
        id: `nav-${item.route}`,
        title: item.label,
        subtitle: 'Navigation Page',
        category: 'Page' as const,
        route: item.route,
        badge: 'Page',
      }));

    return [...matchedEditors, ...matchedProjects, ...matchedTasks, ...matchedPages];
  }, [searchQuery, editors, projects, items, user]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (route: string) => {
    if (route === '/admin/dashboard' || route === '/editor/dashboard') return currentRoute === route;
    return currentRoute.startsWith(route);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-200/80 dark:border-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors">
        <div className="max-w-[1400px] mx-auto h-full px-4 lg:px-8 flex items-center justify-between gap-6">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8 h-full min-w-0">
            <button
              onClick={() => onNavigate(user?.type === 'admin' ? '/admin/dashboard' : '/editor/dashboard')}
              className="shrink-0 flex items-center"
            >
              <Logo />
            </button>
            <div className="hidden lg:flex items-center gap-1 h-full">
              {items.map((item) => {
                const active = isActive(item.route);
                const isReview = item.label === 'Review Queue';
                return (
                  <button
                    key={item.route}
                    onClick={() => onNavigate(item.route)}
                    className={`h-16 px-3.5 text-sm transition-all flex items-center gap-1.5 border-b-2 ${
                      active
                        ? 'text-gray-900 dark:text-white font-bold border-gray-900 dark:border-white'
                        : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white font-medium border-transparent'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isReview && liveReviewCount > 0 && (
                      <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-gray-900 text-white dark:bg-white dark:text-zinc-950 shadow-2xs">
                        {liveReviewCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Search, Dark Mode Toggle, Notifications, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {showSearch && (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center justify-between w-64 px-3.5 py-1.5 text-xs bg-gray-100/90 dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-850 hover:border-gray-300 dark:hover:border-zinc-700 focus:outline-none transition-all text-gray-500 dark:text-zinc-400 group shadow-2xs"
              >
                <span className="flex items-center gap-2 overflow-hidden">
                  <Search className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
                  <span className="text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300 transition-colors truncate">
                    Search editors, projects...
                  </span>
                </span>
                <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded shadow-2xs shrink-0 select-none">
                  {isMac ? '⌘ K' : 'Ctrl K'}
                </kbd>
              </button>
            )}

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 animate-spin-slow transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 transition-transform" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-full transition-colors ${
                    notificationsOpen
                      ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 stroke-[1.75]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-zinc-950 shadow-2xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in z-50 font-sans">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-850/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-semibold text-gray-900 dark:text-zinc-300 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-zinc-800/60">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-400 dark:text-zinc-500">
                          No notifications at this time.
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => markAsRead(item.id, item.route)}
                            className={`p-3.5 hover:bg-gray-100/60 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors flex items-start gap-3 ${
                              item.unread ? 'bg-gray-50/80 dark:bg-zinc-850/40' : 'bg-white dark:bg-zinc-900'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                              {getNotificationIcon(item.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className={`text-xs ${item.unread ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-zinc-300'}`}>
                                  {item.title}
                                </h4>
                                <span className="text-[10px] text-gray-400 dark:text-zinc-500 whitespace-nowrap">{item.time}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 line-clamp-2 leading-snug">
                                {item.message}
                              </p>
                            </div>
                            {item.unread && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-850/30 text-center">
                      <button
                        onClick={() => {
                          setNotificationsOpen(false);
                          onNavigate(user?.type === 'admin' ? '/admin/reviews' : '/editor/projects');
                        }}
                        className="text-[11px] font-bold text-gray-900 dark:text-zinc-200 hover:underline py-1 inline-block"
                      >
                        {user?.type === 'admin' ? 'View review queue →' : 'View all tasks & assignments →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Avatar Dropdown */}
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
              >
                <img
                  src={user?.type === 'admin' ? 'https://i.pravatar.cc/150?u=admin' : currentEditor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-700 object-cover shadow-2xs"
                />
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
              </button>
              {avatarOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 animate-scale-in z-50">
                  {user?.type === 'editor' && (
                    <>
                      <button
                        onClick={() => { setAvatarOpen(false); onNavigate(`/editor/${currentEditor?.id}`); }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left"
                      >
                        <UserIcon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                        View public profile
                      </button>
                      <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1" />
                    </>
                  )}
                  <button
                    onClick={() => { setAvatarOpen(false); logout(); onNavigate('/'); }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 shadow-lg animate-fade-in">
            <div className="px-4 py-3 flex flex-col gap-1">
              {items.map((item) => (
                <button
                  key={item.route}
                  onClick={() => { onNavigate(item.route); setMobileOpen(false); }}
                  className={`text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.route) ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-900 font-bold' : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-gray-100 dark:bg-zinc-850 my-1" />
              <button
                onClick={toggleDarkMode}
                className="text-left px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Appearance</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 font-normal">
                  {darkMode ? <><Sun className="w-4 h-4 text-amber-400" /> Dark</> : <><Moon className="w-4 h-4" /> Light</>}
                </span>
              </button>
              {showSearch && (
                <button
                  onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
                  className="text-left px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search overlay / Live Command Palette */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 animate-fade-in"
          onClick={() => setSearchOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          <div
            className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl animate-scale-in overflow-hidden flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-900/60">
              <Search className="w-5 h-5 text-gray-400 dark:text-zinc-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search editors by name or skill, projects, tasks..."
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-gray-900 dark:text-white"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded">
                  ESC
                </kbd>
              )}
            </div>

            {/* Results or Quick Links */}
            <div className="overflow-y-auto py-2 divide-y divide-gray-100 dark:divide-zinc-800/60">
              {searchQuery ? (
                searchResults && searchResults.length > 0 ? (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                      Matches ({searchResults.length})
                    </div>
                    {searchResults.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => {
                          onNavigate(res.route);
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 shrink-0 group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 transition-colors">
                            {res.category === 'Editor' && <UserIcon className="w-4 h-4" />}
                            {res.category === 'Project' && <Briefcase className="w-4 h-4" />}
                            {res.category === 'Task' && <FileText className="w-4 h-4" />}
                            {res.category === 'Page' && <Layers className="w-4 h-4" />}
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {res.title}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border border-gray-200/80 dark:border-zinc-700">
                            {res.badge}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-gray-500 dark:text-zinc-400 space-y-1">
                    <p className="font-semibold text-gray-700 dark:text-zinc-300">No results found for "{searchQuery}"</p>
                    <p className="text-[11px] text-gray-400">Try searching for an editor name, city, skill, or project title.</p>
                  </div>
                )
              ) : (
                <div className="p-2 space-y-2">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    Quick Navigation
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {quickLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.route}
                          onClick={() => {
                            onNavigate(item.route);
                            setSearchOpen(false);
                          }}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800/70 transition-colors text-left group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 shrink-0 group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 transition-colors">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                              {item.label}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {item.category}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 text-[11px] text-gray-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-600 dark:text-zinc-300">Shortcut:</span> Press{' '}
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-[9px] font-mono">
                  {isMac ? '⌘ K' : 'Ctrl K'}
                </kbd>{' '}
                anytime
              </span>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
