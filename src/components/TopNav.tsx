import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, Menu, X, Search, ChevronDown, LogOut, User as UserIcon, ExternalLink } from 'lucide-react';
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
  const { user, getCurrentEditor, logout, projects } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const currentEditor = getCurrentEditor();

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Admin Revision Feedback',
      message: 'Client requested warmer color grading on Hero Brand Film (60s).',
      time: '2 hours ago',
      unread: true,
      route: '/editor/projects',
      type: 'feedback',
    },
    {
      id: 'notif-2',
      title: 'New Assignment',
      message: 'You have been assigned to "Product Tutorial Videos (3x)".',
      time: '5 hours ago',
      unread: true,
      route: '/editor/projects',
      type: 'assign',
    },
    {
      id: 'notif-3',
      title: 'Deliverable Approved',
      message: 'Your deliverable for "Brand Commercial" was approved by client!',
      time: 'Yesterday',
      unread: true,
      route: '/editor/projects',
      type: 'approve',
    },
    {
      id: 'notif-4',
      title: 'Upcoming Deadline',
      message: 'Hero Brand Film submission is due soon.',
      time: '2 days ago',
      unread: true,
      route: '/editor/projects',
      type: 'deadline',
    },
    {
      id: 'notif-5',
      title: 'Creator Verified',
      message: 'Your editor profile is verified for commercial assignments.',
      time: '3 days ago',
      unread: true,
      route: '/editor/profile',
      type: 'verify',
    },
    {
      id: 'notif-6',
      title: 'Storage Synchronized',
      message: 'Cloud media assets are synced with R2 object storage.',
      time: '4 days ago',
      unread: true,
      route: '/editor/storage',
      type: 'storage',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string, route?: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    if (route) {
      setNotificationsOpen(false);
      onNavigate(route);
    }
  };

  const liveReviewCount = useMemo(() => {
    return projects.flatMap((p) => p.subtasks).filter((st) => st.status === 'Ready for Review').length;
  }, [projects]);

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
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
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
                        ? 'text-[#3b28cc] font-bold border-[#3b28cc]'
                        : 'text-gray-600 hover:text-gray-900 font-medium border-transparent'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isReview && liveReviewCount > 0 && (
                      <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-gray-900 shadow-2xs">
                        {liveReviewCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Search, Notifications, Avatar */}
          <div className="flex items-center gap-3">
            {showSearch && (
              <div className="hidden md:flex items-center relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search editors, projects..."
                  onClick={() => setSearchOpen(true)}
                  readOnly
                  className="w-60 pl-9 pr-9 py-1.5 text-xs bg-gray-100/90 border border-transparent rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-white focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800"
                />
                <span className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 rounded shadow-2xs pointer-events-none">
                  ⌘K
                </span>
              </div>
            )}

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-full transition-colors ${
                    notificationsOpen ? 'bg-indigo-50 text-[#3b28cc]' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 stroke-[1.75]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#e11d48] text-white text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-2xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-scale-in z-50 font-sans">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gray-50/70">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-[#ede9fe] text-[#4f46e5] rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-semibold text-[#3b28cc] hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-400">
                          No notifications at this time.
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => markAsRead(item.id, item.route)}
                            className={`p-3.5 hover:bg-indigo-50/40 cursor-pointer transition-colors flex items-start gap-3 ${
                              item.unread ? 'bg-indigo-50/20' : 'bg-white'
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full bg-[#3b28cc] mt-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: item.unread ? 1 : 0 }} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className={`text-xs ${item.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                                  {item.title}
                                </h4>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">{item.time}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                                {item.message}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                      <button
                        onClick={() => {
                          setNotificationsOpen(false);
                          onNavigate('/editor/projects');
                        }}
                        className="text-[11px] font-bold text-[#3b28cc] hover:underline py-1 inline-block"
                      >
                        View all tasks & assignments →
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
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 transition-all"
              >
                <img
                  src={user?.type === 'admin' ? 'https://i.pravatar.cc/150?u=admin' : currentEditor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-2xs"
                />
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
              {avatarOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 animate-scale-in z-50">
                  {user?.type === 'editor' && (
                    <>
                      <button
                        onClick={() => { setAvatarOpen(false); onNavigate(`/editor/${currentEditor?.id}`); }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        View public profile
                      </button>
                      <div className="h-px bg-gray-100 my-1" />
                    </>
                  )}
                  <button
                    onClick={() => { setAvatarOpen(false); logout(); onNavigate('/'); }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-surface-0 border-b border-gray-200 shadow-lg animate-fade-in">
            <div className="px-4 py-3 flex flex-col gap-1">
              {items.map((item) => (
                <button
                  key={item.route}
                  onClick={() => { onNavigate(item.route); setMobileOpen(false); }}
                  className={`text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.route) ? 'text-violet-700 bg-violet-050 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {showSearch && (
                <button
                  onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
                  className="text-left px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 animate-fade-in" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-ink-950/20" />
          <div className="relative w-full max-w-xl bg-surface-0 rounded-card border border-gray-200 shadow-xl animate-scale-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                autoFocus
                placeholder="Search editors, projects, tasks..."
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
              <button onClick={() => setSearchOpen(false)} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                ESC
              </button>
            </div>
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Recent</div>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left">
                <ExternalLink className="w-4 h-4 text-gray-400" />
                Marcus Chen — Verified Editor
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left">
                <ExternalLink className="w-4 h-4 text-gray-400" />
                Aurora Skincare — Q4 Launch Campaign
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left">
                <ExternalLink className="w-4 h-4 text-gray-400" />
                Review Queue — 3 pending
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
