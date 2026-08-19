import { useState, useRef, useEffect } from 'react';
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
  const { user, getCurrentEditor, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const currentEditor = getCurrentEditor();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
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
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface-0 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto h-full px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8 min-w-0">
            <button onClick={() => onNavigate(user?.type === 'admin' ? '/admin/dashboard' : '/editor/dashboard')} className="shrink-0">
              <Logo />
            </button>
            <div className="hidden lg:flex items-center gap-2">
              {items.map((item) => {
                const active = isActive(item.route);
                const isReview = item.label === 'Review Queue';
                return (
                  <button
                    key={item.route}
                    onClick={() => onNavigate(item.route)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                      active ? 'text-violet-700 font-semibold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                    {isReview && (
                      <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-violet-100 text-violet-700">
                        8
                      </span>
                    )}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-violet-600 rounded-full" />
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
                  className="w-64 pl-9 pr-9 py-1.5 text-xs bg-gray-100/90 border border-transparent rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-white focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800"
                />
                <span className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 rounded shadow-2xs pointer-events-none">
                  ⌘K
                </span>
              </div>
            )}
            {showNotifications && (
              <button className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus-ring">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  6
                </span>
              </button>
            )}
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-violet-200 transition-all focus-ring"
              >
                <Avatar src={user?.type === 'admin' ? 'https://i.pravatar.cc/150?u=admin' : currentEditor?.avatarUrl || ''} alt="Avatar" size="sm" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
              </button>
              {avatarOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-surface-0 border border-gray-200 rounded-lg shadow-lg py-1 animate-scale-in">
                  {user?.type === 'editor' && (
                    <>
                      <button
                        onClick={() => { setAvatarOpen(false); onNavigate(`/editor/${currentEditor?.id}`); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                      >
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        View public profile
                      </button>
                      <div className="h-px bg-gray-100 my-1" />
                    </>
                  )}
                  <button
                    onClick={() => { setAvatarOpen(false); logout(); onNavigate('/'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-gray-400" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors focus-ring"
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
