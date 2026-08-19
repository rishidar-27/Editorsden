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
import { EditorVerification } from '@/screens/EditorVerification';
import { EditorProjects } from '@/screens/EditorProjects';
import { AdminDashboard } from '@/screens/AdminDashboard';
import { EditorManagement } from '@/screens/EditorManagement';
import { EditorDetail } from '@/screens/EditorDetail';
import { ProjectsOverview } from '@/screens/ProjectsOverview';
import { ProjectDetail } from '@/screens/ProjectDetail';
import { CreateProject } from '@/screens/CreateProject';
import { AssignEditors } from '@/screens/AssignEditors';
import { ReviewQueue } from '@/screens/ReviewQueue';
import { Reports } from '@/screens/Reports';

const editorNavItems = [
  { label: 'Dashboard', route: '/editor/dashboard' },
  { label: 'My Profile', route: '/editor/profile' },
  { label: 'Portfolio', route: '/editor/portfolio' },
  { label: 'My Projects', route: '/editor/projects' },
  { label: 'Verification', route: '/editor/verification' },
];

const adminNavItems = [
  { label: 'Dashboard', route: '/admin/dashboard' },
  { label: 'Editors', route: '/admin/editors' },
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
  if (route === '/' || route === '') {
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

  // Public portfolio
  const editorMatch = route.match(/^\/editor\/([^/]+)$/);
  if (editorMatch) {
    return (
      <>
        <PublicPortfolioPage editorId={editorMatch[1]} onNavigate={navigate} />
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
    if (route === '/admin/dashboard') content = <AdminDashboard onNavigate={navigate} />;
    else if (route === '/admin/editors') content = <EditorManagement onNavigate={navigate} />;
    else if (route === '/admin/review') content = <ReviewQueue onNavigate={navigate} />;
    else if (route === '/admin/reports') content = <Reports onNavigate={navigate} />;
    else if (route === '/admin/projects') content = <ProjectsOverview onNavigate={navigate} />;
    else if (route === '/admin/projects/new') content = <CreateProject onNavigate={navigate} />;
    else {
      const projMatch = route.match(/^\/admin\/projects\/([^/]+)$/);
      if (projMatch) content = <ProjectDetail projectId={projMatch[1]} onNavigate={navigate} />;
      else {
        const assignMatch = route.match(/^\/admin\/projects\/([^/]+)\/subtasks\/([^/]+)\/assign$/);
        if (assignMatch) content = <AssignEditors projectId={assignMatch[1]} subtaskId={assignMatch[2]} onNavigate={navigate} />;
        else {
          const editorDetailMatch = route.match(/^\/admin\/editor\/([^/]+)$/);
          if (editorDetailMatch) content = <EditorDetail editorId={editorDetailMatch[1]} onNavigate={navigate} />;
        }
      }
    }

    if (content === null) content = <AdminDashboard onNavigate={navigate} />;

    return (
      <div className="min-h-screen bg-surface-50">
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
  else if (route === '/editor/profile') content = <EditorProfile />;
  else if (route === '/editor/portfolio') content = <EditorPortfolio />;
  else if (route === '/editor/verification') content = <EditorVerification />;
  else if (route === '/editor/projects') content = <EditorProjects />;
  else content = <EditorDashboard onNavigate={navigate} />;

  return (
    <div className="min-h-screen bg-surface-50">
      <TopNav items={navItems} currentRoute={route} onNavigate={navigate} showNotifications />
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
