import { ArrowLeft, MapPin, Mail, Linkedin, Instagram, Globe, Star, Play } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Badge, Avatar, Card } from '@/components/ui';
import { useApp } from '@/context';

interface PublicPortfolioPageProps {
  editorId: string;
  onNavigate: (route: string) => void;
}

export function PublicPortfolioPage({ editorId, onNavigate }: PublicPortfolioPageProps) {
  const { getEditor } = useApp();
  const editor = getEditor(editorId);

  if (!editor) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Editor not found.</p>
          <button onClick={() => onNavigate('/')} className="text-sm text-violet-600 hover:text-violet-700">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const featured = editor.portfolio.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface-0/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1000px] mx-auto h-full px-4 lg:px-6 flex items-center justify-between">
          <button onClick={() => onNavigate('/')}>
            <Logo />
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-ink-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-[1000px] mx-auto px-4 lg:px-6 pt-24 pb-16">
        {/* Hero section */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
          <Avatar src={editor.avatarUrl} alt={editor.fullName} size="xl" className="shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-display" style={{ fontSize: '36px', lineHeight: '44px' }}>
                {editor.fullName}
              </h1>
              {editor.isFeatured && <Badge variant="featured">Featured editor</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {editor.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4" />
                {editor.experience} years experience
              </span>
              <Badge variant={editor.verificationStatus === 'Verified' ? 'verified' : editor.verificationStatus === 'Pending' ? 'pending' : 'rejected'}>
                {editor.verificationStatus}
              </Badge>
            </div>
            <p className="text-body-lg text-gray-700 max-w-2xl">{editor.bio}</p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Skills */}
          <Card className="p-5">
            <h3 className="text-h3 mb-3" style={{ fontSize: '16px' }}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {editor.skills.map((skill) => (
                <span key={skill} className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Software */}
          <Card className="p-5">
            <h3 className="text-h3 mb-3" style={{ fontSize: '16px' }}>Editing Software</h3>
            <div className="flex flex-wrap gap-2">
              {editor.editingSoftware.map((sw) => (
                <span key={sw} className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                  {sw}
                </span>
              ))}
            </div>
          </Card>

          {/* Availability */}
          <Card className="p-5">
            <h3 className="text-h3 mb-3" style={{ fontSize: '16px' }}>Availability</h3>
            <p className="text-sm font-medium text-ink-900 mb-1">{editor.availability}</p>
            <p className="text-sm text-gray-600">{editor.hoursPerWeek} hours/week</p>
          </Card>
        </div>

        {/* Featured work */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-h2 mb-6">Featured work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden bg-gray-100 rounded-card border border-gray-200">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-ink-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-surface-0/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-ink-900" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-ink-900 mt-3">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <Card className="p-6">
          <h2 className="text-h3 mb-4">Get in touch</h2>
          <div className="flex flex-wrap gap-4">
            <a href={`mailto:${editor.email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-ink-900 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Mail className="w-4 h-4 text-gray-600" />
              </div>
              {editor.email}
            </a>
            {editor.linkedin && (
              <a href={`https://${editor.linkedin}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-ink-900 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Linkedin className="w-4 h-4 text-gray-600" />
                </div>
                {editor.linkedin}
              </a>
            )}
            {editor.instagram && (
              <a href={`https://${editor.instagram}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-ink-900 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-gray-600" />
                </div>
                {editor.instagram}
              </a>
            )}
            {editor.portfolioLink && (
              <a href={`https://${editor.portfolioLink}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-ink-900 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-gray-600" />
                </div>
                {editor.portfolioLink}
              </a>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
