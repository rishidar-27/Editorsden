import { useState } from 'react';
import { Button, Card, Badge, Input } from '@/components/ui';
import { useApp } from '@/context';
import {
  ShieldCheck,
  Clock,
  XCircle,
  CheckCircle2,
  FileText,
  Link2,
  Plus,
  X,
  Sparkles,
  Cpu,
  Tv,
  Zap,
  Volume2,
  Layers,
  Award,
} from 'lucide-react';
import type { VerificationStatus } from '@/types';

export function EditorVerification() {
  const { getCurrentEditor, updateEditor, setVerificationStatus, addToast } = useApp();
  const editor = getCurrentEditor();
  const [resumeLink, setResumeLink] = useState(editor?.verificationDocs.resumeLink || '');
  const [sampleWorkLinks, setSampleWorkLinks] = useState<string[]>(editor?.verificationDocs.sampleWorkLinks || []);
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>(editor?.verificationDocs.portfolioLinks || []);
  const [newSampleLink, setNewSampleLink] = useState('');
  const [newPortfolioLink, setNewPortfolioLink] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!editor) return null;

  const status = editor.verificationStatus;

  const handleSubmit = () => {
    updateEditor(editor.id, {
      verificationDocs: {
        resumeLink,
        sampleWorkLinks,
        portfolioLinks,
      },
    });
    setVerificationStatus(editor.id, 'Pending');
    setShowSuccess(true);
    addToast('Verification submitted! Gogangs quality team will review your application.', 'success');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resubmit = () => {
    setVerificationStatus(editor.id, 'Pending');
    addToast('Verification resubmitted for admin review', 'success');
  };

  const statusConfig: Record<VerificationStatus, { icon: React.ReactNode; variant: 'verified' | 'pending' | 'rejected' }> = {
    Verified: { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, variant: 'verified' },
    Pending: { icon: <Clock className="w-5 h-5 text-amber-600" />, variant: 'pending' },
    Rejected: { icon: <XCircle className="w-5 h-5 text-red-600" />, variant: 'rejected' },
  };

  const vettingStages = [
    {
      num: '01',
      title: 'Hardware & Render Benchmark',
      description: 'Minimum 32GB RAM, Dedicated GPU (Apple Silicon / RTX 4080+), 1Gbps Fiber connection.',
      status: 'Passed (Score: 98/100)',
      icon: <Cpu className="w-4 h-4 text-gray-900" />,
    },
    {
      num: '02',
      title: 'Color Science & Rec.709 / HDR Accuracy',
      description: 'Delta E < 1.5 color grading accuracy tested across calibrated ProArt displays.',
      status: 'Passed (Score: 99/100)',
      icon: <Tv className="w-4 h-4 text-emerald-600" />,
    },
    {
      num: '03',
      title: 'Audio Dynamics & -14 LUFS Broadcast Standard',
      description: 'Pristine dialogue isolation, spectral de-noise, and broadcast LUFS compliance.',
      status: 'Passed (Score: 96/100)',
      icon: <Volume2 className="w-4 h-4 text-gray-900" />,
    },
    {
      num: '04',
      title: 'Narrative Pacing & Hook Retention',
      description: 'Tested on short-form viral retention (first 3 seconds drop-off < 18%).',
      status: 'Passed (Score: 97/100)',
      icon: <Layers className="w-4 h-4 text-amber-600" />,
    },
    {
      num: '05',
      title: 'Rapid Turnaround Speed Test',
      description: 'Same-day 4-hour rough assembly delivery test on raw multi-cam footage.',
      status: 'Passed (Score: 100/100)',
      icon: <Zap className="w-4 h-4 text-gray-900" />,
    },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-gray-900" />
          <span>Editor Verification & Quality Badging</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gogangs verifies top video editors through a comprehensive 5-stage benchmark test to unlock high-budget enterprise campaigns.
        </p>
      </div>

      {/* Status banner */}
      <Card className={`p-5 bg-white border rounded-2xl shadow-2xs ${status === 'Rejected' ? 'border-red-200 bg-red-50/20' : 'border-gray-100'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
            status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
          }`}>
            {statusConfig[status].icon}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Verification Status</h3>
              <Badge variant={statusConfig[status].variant}>{status}</Badge>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {status === 'Verified' && 'You are an official Verified Gogangs Creator. You are automatically prioritized for enterprise briefs and client invites.'}
              {status === 'Pending' && 'Your verification package is actively under review with the senior creative director team. Review timeframe: 24–48 hours.'}
              {status === 'Rejected' && 'Your verification needs revisions. Please review the admin feedback below and update your portfolio assets.'}
            </p>
          </div>
        </div>
      </Card>

      {/* 5-Stage Vetting Scorecard */}
      <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-900" />
            <h2 className="text-base font-bold text-gray-900">
              5-Stage Quality Benchmark Results
            </h2>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Top 1% Creator Badge
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {vettingStages.map((stage, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1.5 ${idx === 4 ? 'md:col-span-2' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-2xs">
                    {stage.icon}
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">{stage.title}</h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {stage.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 pl-8 leading-relaxed">
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Rejection feedback */}
      {status === 'Rejected' && editor.verificationFeedback && (
        <div className="p-5 bg-red-50 border border-red-200 rounded-2xl space-y-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold">!</span>
            </div>
            <div>
              <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Reviewer Feedback</p>
              <p className="text-xs text-red-900 mt-1 leading-relaxed">{editor.verificationFeedback}</p>
            </div>
          </div>
          <div className="pt-2">
            <Button size="sm" onClick={resubmit} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs">
              Resubmit for Review
            </Button>
          </div>
        </div>
      )}

      {/* Verification form */}
      {status !== 'Verified' && (
        <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900">Verification Portfolio & Resume</h2>
            <p className="text-xs text-gray-400 mt-0.5">Submit master showreels and previous client work for verification.</p>
          </div>

          <div className="space-y-4">
            {/* Resume */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Resume / LinkedIn URL *</label>
              <Input
                placeholder="https://linkedin.com/in/yourprofile or Google Drive resume link"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                icon={<FileText className="w-4 h-4" />}
              />
            </div>

            {/* Sample work links */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Master Showreel & Video Links</label>
              <div className="space-y-2 mb-2">
                {sampleWorkLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 truncate font-medium">
                      <Link2 className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                      {link}
                    </div>
                    <button
                      onClick={() => setSampleWorkLinks(sampleWorkLinks.filter((_, idx) => idx !== i))}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://youtube.com/watch?v=... or Vimeo master cut"
                  value={newSampleLink}
                  onChange={(e) => setNewSampleLink(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    if (newSampleLink.trim()) {
                      setSampleWorkLinks([...sampleWorkLinks, newSampleLink.trim()]);
                      setNewSampleLink('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Portfolio links */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Website / Studio Portfolio</label>
              <div className="space-y-2 mb-2">
                {portfolioLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 truncate font-medium">
                      <Link2 className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                      {link}
                    </div>
                    <button
                      onClick={() => setPortfolioLinks(portfolioLinks.filter((_, idx) => idx !== i))}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="yourname.studio or behance.net/yourprofile"
                  value={newPortfolioLink}
                  onChange={(e) => setNewPortfolioLink(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    if (newPortfolioLink.trim()) {
                      setPortfolioLinks([...portfolioLinks, newPortfolioLink.trim()]);
                      setNewPortfolioLink('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <Button onClick={handleSubmit} disabled={!resumeLink} className="bg-gray-900 hover:bg-black text-white font-bold text-xs">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Submit Verification Package
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Success animation overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-8 flex flex-col items-center animate-scale-in max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-2xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Application Submitted!</h3>
            <p className="text-xs text-gray-500 mb-4">Your verification package is now in the review queue.</p>
            <Badge variant="pending">Pending Admin Review</Badge>
          </div>
        </div>
      )}
    </div>
  );
}

