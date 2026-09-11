import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context';
import { TopNav } from '@/components/TopNav';
import { ToastContainer } from '@/components/ui';
import { LandingPage } from '@/screens/LandingPage';
import { LoginPage } from '@/screens/LoginPage';
import { PublicPortfolioPage } from '@/screens/PublicPortfolioPage';
import { EditorDashboard } from '@/screens/EditorDashboard';
import { EditorProfile } from '@/screens/EditorProfile';
import { EditorPortfolio } from '@/screens/EditorPortfolio';
import { EditorProjects } from '@/screens/EditorProjects';
import { EditorStorageManager } from '@/screens/EditorStorageManager';
import { AdminDashboard } from '@/screens/AdminDashboard';
import { EditorManagement } from '@/screens/EditorManagement';
import { EditorDetail } from '@/screens/EditorDetail';
import { ProjectsOverview } from '@/screens/ProjectsOverview';
import { ProjectDetail } from '@/screens/ProjectDetail';
import { CreateProject } from '@/screens/CreateProject';
import { AssignEditors } from '@/screens/AssignEditors';
import { ReviewQueue } from '@/screens/ReviewQueue';
import { Reports } from '@/screens/Reports';
import { EditorMap } from '@/screens/EditorMap';

const editorNavItems = [
  { label: 'Dashboard', route: '/editor/dashboard' },
  { label: 'My Projects', route: '/editor/projects' },
  { label: 'Storage & Assets', route: '/editor/storage' },
  { label: 'Portfolio', route: '/editor/portfolio' },
  { label: 'My Profile', route: '/editor/profile' },
];

const adminNavItems = [
  { label: 'Dashboard', route: '/admin/dashboard' },
  { label: 'Editors', route: '/admin/editors' },
  { label: 'Editor Map', route: '/admin/map' },
  { label: 'Projects', route: '/admin/projects' },
  { label: 'Review Queue', route: '/admin/review' },
  { label: 'Reports', route: '/admin/reports' },
];

function Router() {
  const { user, toasts, removeToast } = useApp();
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    window.addEventListener('popstate', () => setRoute(window.location.pathname));
  }, []);

  const navigate = (newRoute: string) => {
    window.history.pushState({}, '', newRoute);
    setRoute(newRoute);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handler = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  // Public routes
  if (route === '/' || route === '' || route === '/onboarding') {
    return (
      <>
        <LandingPage onNavigate={navigate} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  if (route === '/login') {
    return (
      <>
        <LoginPage onNavigate={navigate} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  const cleanRoute = route.split('?')[0].split('#')[0];

  // Public portfolio
  const editorMatch = cleanRoute.match(/^\/editor\/([^/]+)$/);
  const isPublicPortfolio = editorMatch && !['dashboard', 'profile', 'portfolio', 'verification', 'projects', 'storage'].includes(editorMatch[1]);
  if (isPublicPortfolio) {
    const editorId = editorMatch[1];
    const isFromAdmin = user?.type === 'admin' || route.includes('from=admin');
    if (isFromAdmin) {
      return (
        <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#09090B] text-gray-900 dark:text-zinc-100 transition-colors">
          <TopNav items={adminNavItems} currentRoute="/admin/editors" onNavigate={navigate} showSearch showNotifications />
          <div className="pt-16">
            <div className="bg-gray-900 text-white px-4 sm:px-8 py-2.5 text-xs font-semibold border-b border-gray-800 shadow-xs">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">Administrative View</span>
                  <span className="text-gray-400">• Inspecting public profile as administrator</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/editor/${editorId}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>← Return to Editor Details</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/editors')}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    All Editors
                  </button>
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="px-3 py-1 bg-white text-gray-950 hover:bg-gray-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Admin Dashboard
                  </button>
                </div>
              </div>
            </div>
            <PublicPortfolioPage editorId={editorId} onNavigate={navigate} fromAdmin={true} />
          </div>
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
      );
    }

    return (
      <>
        <PublicPortfolioPage editorId={editorId} onNavigate={navigate} fromAdmin={false} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  // Protected routes — require login
  if (!user) {
    return (
      <>
        <LoginPage onNavigate={navigate} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  const isAdmin = user.type === 'admin';
  const navItems = isAdmin ? adminNavItems : editorNavItems;

  // Admin routes
  if (isAdmin) {
    let content: React.ReactNode = null;
    if (cleanRoute === '/admin/dashboard') content = <AdminDashboard onNavigate={navigate} />;
    else if (cleanRoute === '/admin/editors') content = <EditorManagement onNavigate={navigate} />;
    else if (cleanRoute === '/admin/map') content = <EditorMap onNavigate={navigate} />;
    else if (cleanRoute === '/admin/review') content = <ReviewQueue onNavigate={navigate} />;
    else if (cleanRoute === '/admin/reports') content = <Reports onNavigate={navigate} />;
    else if (cleanRoute === '/admin/projects') content = <ProjectsOverview onNavigate={navigate} />;
    else if (cleanRoute === '/admin/projects/new') content = <CreateProject onNavigate={navigate} />;
    else {
      const adminPreviewMatch = cleanRoute.match(/^\/admin\/editor\/([^/]+)\/(?:preview|public)$/);
      if (adminPreviewMatch) {
        const editorId = adminPreviewMatch[1];
        content = (
          <div>
            <div className="bg-gray-900 text-white px-4 sm:px-8 py-2.5 text-xs font-semibold border-b border-gray-800 shadow-xs">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">Administrative View</span>
                  <span className="text-gray-400">• Inspecting public profile as administrator</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/editor/${editorId}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>← Return to Editor Details</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/editors')}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    All Editors
                  </button>
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="px-3 py-1 bg-white text-gray-950 hover:bg-gray-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Admin Dashboard
                  </button>
                </div>
              </div>
            </div>
            <PublicPortfolioPage editorId={editorId} onNavigate={navigate} fromAdmin={true} />
          </div>
        );
      } else {
        const projMatch = cleanRoute.match(/^\/admin\/projects\/([^/]+)$/);
        if (projMatch) content = <ProjectDetail projectId={projMatch[1]} onNavigate={navigate} />;
        else {
          const assignMatch = cleanRoute.match(/^\/admin\/projects\/([^/]+)\/subtasks\/([^/]+)\/assign$/);
          if (assignMatch) content = <AssignEditors projectId={assignMatch[1]} subtaskId={assignMatch[2]} onNavigate={navigate} />;
          else {
            const editorDetailMatch = cleanRoute.match(/^\/admin\/editor\/([^/]+)$/);
            if (editorDetailMatch) content = <EditorDetail editorId={editorDetailMatch[1]} onNavigate={navigate} />;
          }
        }
      }
    }

    if (content === null) content = <AdminDashboard onNavigate={navigate} />;

    return (
      <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#09090B] text-gray-900 dark:text-zinc-100 transition-colors">
        <TopNav items={navItems} currentRoute={route} onNavigate={navigate} showSearch showNotifications />
        <div className="pt-16">
          {content}
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // Editor routes
  let content: React.ReactNode = null;
  if (route === '/editor/dashboard') content = <EditorDashboard onNavigate={navigate} />;
  else if (route === '/editor/profile' || route === '/editor/verification') content = <EditorProfile />;
  else if (route === '/editor/portfolio') content = <EditorPortfolio />;
  else if (route === '/editor/projects') content = <EditorProjects />;
  else if (route === '/editor/storage') content = <EditorStorageManager />;
  else content = <EditorDashboard onNavigate={navigate} />;

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#09090B] text-gray-900 dark:text-zinc-100 transition-colors">
      <TopNav items={navItems} currentRoute={route} onNavigate={navigate} showSearch showNotifications />
      <div className="pt-16">
        {content}
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
