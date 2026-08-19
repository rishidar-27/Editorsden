import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button, Input } from '@/components/ui';
import { useApp } from '@/context';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, register, addToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const result = login(email, password);
        if (result.success) {
          if (email === 'admin@gogangs.com') {
            onNavigate('/admin/dashboard');
          } else {
            onNavigate('/editor/dashboard');
          }
        } else {
          setError(result.error || 'Invalid credentials');
        }
      } else {
        const result = register(email, password);
        if (result.success) {
          addToast('Account created! Start building your profile.', 'success');
          onNavigate('/editor/profile');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
      setLoading(false);
    }, 500);
  };

  const fillDemo = (type: 'admin' | 'editor') => {
    if (type === 'admin') {
      setEmail('admin@gogangs.com');
      setPassword('admin1234');
    } else {
      setEmail('marcus@gogangs.com');
      setPassword('demo1234');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Simple top bar */}
      <header className="h-16 px-4 lg:px-6 flex items-center">
        <button onClick={() => onNavigate('/')}>
          <Logo />
        </button>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm opacity-0 animate-fade-slide-up" style={{ animationFillMode: 'forwards' }}>
          <div className="mb-6 text-center">
            <h1 className="text-h2 mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-gray-600">
              {mode === 'login'
                ? 'Sign in to access your portal'
                : 'Join the Gogangs editor community'}
            </p>
          </div>

          <div className="bg-surface-0 border border-gray-200 rounded-card p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="w-4 h-4" />}
              />

              {error && (
                <div className="px-3 py-2 text-sm text-red-700 bg-red-050 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" disabled={loading} className="w-full">
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-sm text-gray-600 hover:text-ink-900 transition-colors"
              >
                {mode === 'login'
                  ? "Don't have an account? Register"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>

          {/* Demo credentials */}
          {mode === 'login' && (
            <div className="mt-4 p-4 bg-gray-050 border border-gray-100 rounded-card">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Demo credentials</p>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => fillDemo('admin')}
                  className="text-left text-xs text-gray-600 hover:text-violet-700 transition-colors"
                >
                  <span className="font-medium">Admin:</span> admin@gogangs.com / admin1234
                </button>
                <button
                  onClick={() => fillDemo('editor')}
                  className="text-left text-xs text-gray-600 hover:text-violet-700 transition-colors"
                >
                  <span className="font-medium">Editor:</span> marcus@gogangs.com / demo1234
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
