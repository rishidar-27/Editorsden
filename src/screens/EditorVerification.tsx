import { useState, useEffect } from 'react';
import { Button, Card, Badge, Input, Textarea } from '@/components/ui';
import { useApp } from '@/context';
import { ShieldCheck, Clock, XCircle, CheckCircle, FileText, Link2, Plus, X } from 'lucide-react';
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
    addToast('Verification submitted! We\'ll review your application.', 'success');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resubmit = () => {
    setVerificationStatus(editor.id, 'Pending');
    addToast('Verification resubmitted', 'success');
  };

  const statusConfig: Record<VerificationStatus, { icon: React.ReactNode; variant: 'verified' | 'pending' | 'rejected' }> = {
    Verified: { icon: <CheckCircle className="w-5 h-5 text-mint-600" />, variant: 'verified' },
    Pending: { icon: <Clock className="w-5 h-5 text-amber-600" />, variant: 'pending' },
    Rejected: { icon: <XCircle className="w-5 h-5 text-red-600" />, variant: 'rejected' },
  };

  return (
    <div className="max-w-[700px] mx-auto px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-h2 mb-1">Verification</h1>
        <p className="text-sm text-gray-600">Submit your work for review to become a verified Gogangs editor</p>
      </div>

      {/* Status banner */}
      <Card className={`p-5 mb-6 ${status === 'Rejected' ? 'border-red-200' : ''}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            status === 'Verified' ? 'bg-mint-050' : status === 'Pending' ? 'bg-amber-050' : 'bg-red-050'
          }`}>
            {statusConfig[status].icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-ink-900">Verification status</h3>
              <Badge variant={statusConfig[status].variant}>{status}</Badge>
            </div>
            <p className="text-sm text-gray-600">
              {status === 'Verified' && 'You are a verified Gogangs editor. Clients can trust the quality of your work.'}
              {status === 'Pending' && 'Your verification is under review. This usually takes 2-3 business days.'}
              {status === 'Rejected' && 'Your verification was not approved. Please review the feedback below and resubmit.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Rejection feedback */}
      {status === 'Rejected' && editor.verificationFeedback && (
        <div className="mb-6 p-4 bg-red-050 border border-red-200 rounded-card">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-red-700">!</span>
            </div>
            <div>
              <p className="text-xs font-medium text-red-700 uppercase tracking-wide mb-1">Admin feedback</p>
              <p className="text-sm text-red-800">{editor.verificationFeedback}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button size="sm" onClick={resubmit}>Resubmit for verification</Button>
          </div>
        </div>
      )}

      {/* Verification form */}
      {status !== 'Verified' && (
        <Card className="p-6">
          <h2 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Verification documents</h2>
          <div className="flex flex-col gap-5">
            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume link</label>
              <Input
                placeholder="https://docs.google.com/your-resume"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                icon={<FileText className="w-4 h-4" />}
              />
            </div>

            {/* Sample work links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sample work links</label>
              <div className="flex flex-col gap-2 mb-2">
                {sampleWorkLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 text-sm bg-gray-050 border border-gray-200 rounded-lg text-gray-700 truncate">
                      <Link2 className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                      {link}
                    </div>
                    <button
                      onClick={() => setSampleWorkLinks(sampleWorkLinks.filter((_, idx) => idx !== i))}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-050 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={newSampleLink}
                  onChange={(e) => setNewSampleLink(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    if (newSampleLink) {
                      setSampleWorkLinks([...sampleWorkLinks, newSampleLink]);
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Portfolio links</label>
              <div className="flex flex-col gap-2 mb-2">
                {portfolioLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 text-sm bg-gray-050 border border-gray-200 rounded-lg text-gray-700 truncate">
                      <Link2 className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                      {link}
                    </div>
                    <button
                      onClick={() => setPortfolioLinks(portfolioLinks.filter((_, idx) => idx !== i))}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-050 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="yourname.studio"
                  value={newPortfolioLink}
                  onChange={(e) => setNewPortfolioLink(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    if (newPortfolioLink) {
                      setPortfolioLinks([...portfolioLinks, newPortfolioLink]);
                      setNewPortfolioLink('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={handleSubmit} disabled={!resumeLink}>
                <ShieldCheck className="w-4 h-4" />
                Submit for verification
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Success animation overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 animate-fade-in">
          <div className="bg-surface-0 rounded-card border border-gray-200 shadow-xl p-8 flex flex-col items-center animate-scale-in">
            <svg className="w-16 h-16 mb-4" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="#22B396" strokeWidth="2" />
              <path
                d="M18 30 L26 38 L42 22"
                stroke="#22B396"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-check"
                style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
              />
            </svg>
            <h3 className="text-h3 mb-1" style={{ fontSize: '18px' }}>Submitted!</h3>
            <p className="text-sm text-gray-600 text-center">Your verification is now pending review.</p>
            <div className="mt-4">
              <Badge variant="pending">Pending</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
