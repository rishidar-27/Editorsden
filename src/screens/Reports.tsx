import { useState, useMemo } from 'react';
import { Card, Button, Avatar, Badge, Checkbox, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import { Download, Users } from 'lucide-react';
import type { Editor } from '@/types';

type ReportTab = 'active-7' | 'active-30' | 'inactive-30';

interface ReportsProps {
  onNavigate: (route: string) => void;
}

export function Reports({ onNavigate }: ReportsProps) {
  const { editors } = useApp();
  const [tab, setTab] = useState<ReportTab>('active-7');
  const [selected, setSelected] = useState<string[]>([]);

  const now = new Date();

  const daysSince = (iso: string) => Math.floor((now.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));

  const filtered = useMemo(() => {
    return editors.filter((e) => {
      const days = daysSince(e.lastLogin);
      if (tab === 'active-7') return days <= 7;
      if (tab === 'active-30') return days <= 30;
      return days > 30;
    });
  }, [editors, tab]);

  const tabs: { id: ReportTab; label: string; count: number }[] = [
    { id: 'active-7', label: 'Active last 7 days', count: editors.filter((e) => daysSince(e.lastLogin) <= 7).length },
    { id: 'active-30', label: 'Active last 30 days', count: editors.filter((e) => daysSince(e.lastLogin) <= 30).length },
    { id: 'inactive-30', label: 'Inactive 30+ days', count: editors.filter((e) => daysSince(e.lastLogin) > 30).length },
  ];

  const toggleSelect = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((e) => e.id));
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'City', 'Experience', 'Skills', 'Software', 'Availability', 'Verification Status', 'Active', 'Last Login'];
    const rows = filtered.map((e: Editor) => [
      e.fullName,
      e.email,
      e.city,
      String(e.experience),
      e.skills.join('; '),
      e.editingSoftware.join('; '),
      e.availability,
      e.verificationStatus,
      e.active ? 'Yes' : 'No',
      new Date(e.lastLogin).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gogangs-report-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-h2 mb-1">Reports</h1>
          <p className="text-sm text-gray-600">Editor activity and engagement reports</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSelected([]); }}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              tab === t.id ? 'bg-surface-0 text-ink-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
            <span className={`ml-1.5 text-xs ${tab === t.id ? 'text-violet-600' : 'text-gray-400'}`}>({t.count})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10" />}
          title="No editors in this category"
          description="No editors match the selected time period."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-10">
                    <Checkbox checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Editor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Skills</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Availability</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Last login</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((editor) => (
                  <tr
                    key={editor.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-050 transition-colors cursor-pointer"
                    onClick={() => onNavigate(`/admin/editor/${editor.id}`)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selected.includes(editor.id)} onChange={() => toggleSelect(editor.id)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={editor.avatarUrl} alt={editor.fullName} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-ink-900">{editor.fullName}</p>
                          <p className="text-xs text-gray-500">{editor.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {editor.skills.slice(0, 2).map((s) => (
                          <span key={s} className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">{s}</span>
                        ))}
                        {editor.skills.length > 2 && <span className="text-xs text-gray-500">+{editor.skills.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{editor.availability}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={editor.verificationStatus === 'Verified' ? 'verified' : editor.verificationStatus === 'Pending' ? 'pending' : 'rejected'}>
                        {editor.verificationStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 tabular-nums">{formatDate(editor.lastLogin)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-gray-100">
            {filtered.map((editor) => (
              <div key={editor.id} className="p-4 flex items-start gap-3" onClick={() => onNavigate(`/admin/editor/${editor.id}`)}>
                <Checkbox checked={selected.includes(editor.id)} onChange={() => toggleSelect(editor.id)} className="mt-1" />
                <Avatar src={editor.avatarUrl} alt={editor.fullName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900 truncate">{editor.fullName}</p>
                  <p className="text-xs text-gray-500">{editor.city} · {editor.availability}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant={editor.verificationStatus === 'Verified' ? 'verified' : editor.verificationStatus === 'Pending' ? 'pending' : 'rejected'}>
                      {editor.verificationStatus}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatDate(editor.lastLogin)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
