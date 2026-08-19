import { Card, Badge, Avatar, Button, SkillTag } from '@/components/ui';
import { useApp } from '@/context';
import { ArrowLeft, MapPin, Star, Mail, Linkedin, Instagram, Globe, Clock, FileText, ShieldCheck, ShieldX, Ban } from 'lucide-react';
import type { VerificationStatus } from '@/types';

interface EditorDetailProps {
  editorId: string;
  onNavigate: (route: string) => void;
}

export function EditorDetail({ editorId, onNavigate }: EditorDetailProps) {
  const { getEditor, setVerificationStatus, toggleEditorActive, addToast } = useApp();
  const editor = getEditor(editorId);

  if (!editor) {
    return (
      <div className="pt-24 text-center">
        <p className="text-sm text-gray-600">Editor not found.</p>
        <button onClick={() => onNavigate('/admin/editors')} className="text-sm text-violet-600 mt-2">Back to editors</button>
      </div>
    );
  }

  const statusVariant = (status: VerificationStatus): 'verified' | 'pending' | 'rejected' =>
    status === 'Verified' ? 'verified' : status === 'Pending' ? 'pending' : 'rejected';

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const timeline = [
    { label: 'Last login', value: formatDate(editor.lastLogin), icon: <Clock className="w-3.5 h-3.5" /> },
    { label: 'Last profile update', value: formatDate(editor.lastProfileUpdate), icon: <FileText className="w-3.5 h-3.5" /> },
    { label: 'Last portfolio update', value: formatDate(editor.lastPortfolioUpdate), icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-4 lg:px-6 py-8">
      <button
        onClick={() => onNavigate('/admin/editors')}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to editors
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        <Avatar src={editor.avatarUrl} alt={editor.fullName} size="xl" className="shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-h2">{editor.fullName}</h1>
            <Badge variant={statusVariant(editor.verificationStatus)}>{editor.verificationStatus}</Badge>
            {!editor.active && <Badge variant="inactive">Inactive</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{editor.city}</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4" />{editor.experience} years</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{editor.availability} · {editor.hoursPerWeek}h/week</span>
          </div>
          <p className="text-sm text-gray-700 max-w-2xl">{editor.bio}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {editor.verificationStatus !== 'Verified' && (
            <Button size="sm" onClick={() => { setVerificationStatus(editor.id, 'Verified'); addToast(`${editor.fullName} verified`, 'success'); }}>
              <ShieldCheck className="w-4 h-4" /> Verify
            </Button>
          )}
          {editor.verificationStatus !== 'Rejected' && (
            <Button size="sm" variant="destructive" onClick={() => { setVerificationStatus(editor.id, 'Rejected', 'Please review and resubmit.'); addToast(`${editor.fullName} rejected`, 'error'); }}>
              <ShieldX className="w-4 h-4" /> Reject
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => { toggleEditorActive(editor.id); addToast(`${editor.fullName} ${editor.active ? 'disabled' : 'enabled'}`, 'info'); }}>
            <Ban className="w-4 h-4" /> {editor.active ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Skills, Software, Portfolio */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Skills & Software */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="text-h3 mb-3" style={{ fontSize: '15px' }}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {editor.skills.map((s) => <SkillTag key={s}>{s}</SkillTag>)}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="text-h3 mb-3" style={{ fontSize: '15px' }}>Software</h3>
              <div className="flex flex-wrap gap-2">
                {editor.editingSoftware.map((s) => <SkillTag key={s}>{s}</SkillTag>)}
              </div>
            </Card>
          </div>

          {/* Portfolio preview */}
          <Card className="p-5">
            <h3 className="text-h3 mb-4" style={{ fontSize: '15px' }}>Portfolio ({editor.portfolio.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {editor.portfolio.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden bg-gray-100 rounded-lg border border-gray-200">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                    {item.featured && (
                      <div className="absolute top-1.5 right-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-ink-900 mt-2 truncate">{item.title}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Verification docs */}
          <Card className="p-5">
            <h3 className="text-h3 mb-4" style={{ fontSize: '15px' }}>Verification documents</h3>
            <div className="flex flex-col gap-3">
              {editor.verificationDocs.resumeLink && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <a href={editor.verificationDocs.resumeLink} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 truncate">
                    {editor.verificationDocs.resumeLink}
                  </a>
                </div>
              )}
              {editor.verificationDocs.sampleWorkLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 truncate">
                    {link}
                  </a>
                </div>
              ))}
              {editor.verificationDocs.portfolioLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 truncate">
                    {link}
                  </a>
                </div>
              ))}
            </div>
            {editor.verificationFeedback && (
              <div className="mt-4 p-3 bg-red-050 border border-red-200 rounded-lg">
                <p className="text-xs font-medium text-red-700 uppercase tracking-wide mb-1">Feedback given</p>
                <p className="text-sm text-red-800">{editor.verificationFeedback}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Contact + Activity timeline */}
        <div className="flex flex-col gap-6">
          {/* Contact */}
          <Card className="p-5">
            <h3 className="text-h3 mb-3" style={{ fontSize: '15px' }}>Contact</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" /> {editor.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-4 h-4 text-gray-400 text-xs text-center">Ph</span> {editor.phone}
              </div>
              {editor.linkedin && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Linkedin className="w-4 h-4 text-gray-400" /> {editor.linkedin}
                </div>
              )}
              {editor.instagram && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Instagram className="w-4 h-4 text-gray-400" /> {editor.instagram}
                </div>
              )}
              {editor.portfolioLink && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Globe className="w-4 h-4 text-gray-400" /> {editor.portfolioLink}
                </div>
              )}
            </div>
          </Card>

          {/* Activity timeline */}
          <Card className="p-5">
            <h3 className="text-h3 mb-4" style={{ fontSize: '15px' }}>Activity log</h3>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />
              <div className="flex flex-col gap-4">
                {timeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className="w-3.5 h-3.5 rounded-full bg-surface-0 border-2 border-gray-300 flex items-center justify-center shrink-0 mt-0.5 z-10">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-ink-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
