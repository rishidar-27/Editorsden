import { useEffect, useState } from 'react';
import { ArrowRight, Play, MapPin, Star, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button, Badge, Avatar } from '@/components/ui';
import { useApp } from '@/context';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { editors } = useApp();
  const featured = editors.filter((e) => e.verificationStatus === 'Verified').slice(0, 6);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface-0/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto h-full px-4 lg:px-6 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/login')}>
              Admin login
            </Button>
            <Button size="sm" onClick={() => onNavigate('/login')}>
              Apply as an editor
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 lg:px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="flex justify-center mb-6 animate-fade-in" style={{ animationDelay: '0ms' }}>
            <div className="w-16 h-16 rounded-full bg-ink-900 flex items-center justify-center animate-scale-in">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
          </div>
          <h1
            className="text-display mb-4 opacity-0 animate-fade-slide-up"
            style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
          >
            Join a community of<br />vetted video editors
          </h1>
          <p
            className="text-body-lg text-gray-600 max-w-xl mx-auto mb-8 opacity-0 animate-fade-slide-up"
            style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
          >
            Gogangs connects skilled freelance editors with brands and creators.
            Build your portfolio, get verified, and land your next project.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 opacity-0 animate-fade-slide-up"
            style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
          >
            <Button size="lg" onClick={() => onNavigate('/login')} className="w-full sm:w-auto">
              Apply as an editor
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate('/login')} className="w-full sm:w-auto">
              Admin login
            </Button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-200 bg-surface-0">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '150+', label: 'Vetted editors' },
            { value: '40+', label: 'Active projects' },
            { value: '12', label: 'Countries' },
            { value: '98%', label: 'Approval rate' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-ink-900 tabular-nums" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample portfolios */}
      <section className="py-20 px-4 lg:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-2">Meet our editors</h2>
            <p className="text-body-lg text-gray-600">A glimpse of the talent in our community</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((editor, i) => (
              <div
                key={editor.id}
                className={`group cursor-pointer transition-all duration-300 ease-out-soft ${
                  revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
                onClick={() => onNavigate(`/editor/${editor.id}`)}
              >
                <div className="bg-surface-0 border border-gray-200 rounded-card overflow-hidden transition-all duration-150 ease-out-soft hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={editor.portfolio[0]?.thumbnailUrl}
                      alt={editor.portfolio[0]?.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-ink-950/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-ink-950/60 backdrop-blur-sm rounded-pill">
                      <Play className="w-3 h-3 text-white" fill="white" />
                      <span className="text-xs text-white font-medium">View portfolio</span>
                    </div>
                    {editor.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="featured">Featured</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar src={editor.avatarUrl} alt={editor.fullName} size="sm" />
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-ink-900 truncate">{editor.fullName}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {editor.city}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{editor.bio}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {editor.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                          {skill}
                        </span>
                      ))}
                      {editor.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-xs font-medium text-gray-500">
                          +{editor.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 lg:px-6 bg-surface-0 border-t border-gray-200">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-8 h-8 text-violet-500" />
          </div>
          <h2 className="text-h2 mb-3">Ready to join Gogangs?</h2>
          <p className="text-body-lg text-gray-600 mb-6">
            Create your account, build your portfolio, and get verified to start receiving project assignments.
          </p>
          <Button size="lg" onClick={() => onNavigate('/login')}>
            Get started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 lg:px-6 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-gray-500">© 2026 Gogangs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
