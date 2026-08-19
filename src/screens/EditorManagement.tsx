import { useState, useMemo } from 'react';
import { Card, Badge, Avatar, Button, Input, Checkbox, KebabMenu, EmptyState } from '@/components/ui';
import { useApp } from '@/context';
import { Search, SlidersHorizontal, Users, ShieldCheck, ShieldX, Eye, Pencil, Ban } from 'lucide-react';
import { allSkills, allSoftware } from '@/data';
import type { VerificationStatus, AvailabilityStatus } from '@/types';

interface EditorManagementProps {
  onNavigate: (route: string) => void;
}

export function EditorManagement({ onNavigate }: EditorManagementProps) {
  const { editors, setVerificationStatus, toggleEditorActive, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    software: [] as string[],
    availability: '' as string,
    verification: '' as string,
    minExperience: 0,
  });

  const filtered = useMemo(() => {
    return editors.filter((e) => {
      if (search && !e.fullName.toLowerCase().includes(search.toLowerCase()) && !e.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.skills.length > 0 && !filters.skills.every((s) => e.skills.includes(s as never))) return false;
      if (filters.software.length > 0 && !filters.software.some((s) => e.editingSoftware.includes(s as never))) return false;
      if (filters.availability && e.availability !== filters.availability) return false;
      if (filters.verification && e.verificationStatus !== filters.verification) return false;
      if (filters.minExperience > 0 && e.experience < filters.minExperience) return false;
      return true;
    });
  }, [editors, search, filters]);

  const toggleSelect = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((e) => e.id));
    }
  };

  const bulkVerify = () => {
    selected.forEach((id) => setVerificationStatus(id, 'Verified'));
    addToast(`${selected.length} editor${selected.length > 1 ? 's' : ''} verified`, 'success');
    setSelected([]);
  };

  const bulkReject = () => {
    selected.forEach((id) => setVerificationStatus(id, 'Rejected', 'Bulk rejection: please review and resubmit.'));
    addToast(`${selected.length} editor${selected.length > 1 ? 's' : ''} rejected`, 'error');
    setSelected([]);
  };

  const toggleFilter = (category: 'skills' | 'software', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const statusVariant = (status: VerificationStatus): 'verified' | 'pending' | 'rejected' =>
    status === 'Verified' ? 'verified' : status === 'Pending' ? 'pending' : 'rejected';

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-h2 mb-1">Editors</h1>
        <p className="text-sm text-gray-600">Manage all editors in your community</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search editors by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {Object.values(filters).some((v) => Array.isArray(v) ? v.length > 0 : v) && (
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          )}
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <Card className="p-5 mb-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Skills */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleFilter('skills', skill)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      filters.skills.includes(skill)
                        ? 'bg-violet-050 text-violet-700 border border-violet-200'
                        : 'bg-gray-100 text-gray-700 border border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            {/* Software */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Software</p>
              <div className="flex flex-wrap gap-1.5">
                {allSoftware.map((sw) => (
                  <button
                    key={sw}
                    onClick={() => toggleFilter('software', sw)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      filters.software.includes(sw)
                        ? 'bg-violet-050 text-violet-700 border border-violet-200'
                        : 'bg-gray-100 text-gray-700 border border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {sw}
                  </button>
                ))}
              </div>
            </div>
            {/* Other filters */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Availability</p>
                <select
                  className="w-full px-3 py-2 text-sm bg-surface-0 border border-gray-200 rounded-lg focus-ring"
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                >
                  <option value="">Any</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Verification status</p>
                <select
                  className="w-full px-3 py-2 text-sm bg-surface-0 border border-gray-200 rounded-lg focus-ring"
                  value={filters.verification}
                  onChange={(e) => setFilters({ ...filters, verification: e.target.value })}
                >
                  <option value="">Any</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Min. experience (years)</p>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 text-sm bg-surface-0 border border-gray-200 rounded-lg focus-ring"
                  value={filters.minExperience}
                  onChange={(e) => setFilters({ ...filters, minExperience: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setFilters({ skills: [], software: [], availability: '', verification: '', minExperience: 0 })}>
              Clear all
            </Button>
          </div>
        </Card>
      )}

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="sticky top-16 z-30 mb-4 px-4 py-3 bg-ink-900 rounded-card flex items-center justify-between animate-fade-in">
          <span className="text-sm text-white font-medium">{selected.length} selected</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={bulkVerify} className="bg-mint-500 hover:bg-mint-600">
              <ShieldCheck className="w-4 h-4" />
              Verify
            </Button>
            <Button size="sm" variant="destructive" onClick={bulkReject} className="border-white/30 text-white hover:bg-red-500/20">
              <ShieldX className="w-4 h-4" />
              Reject
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])} className="text-white/70 hover:bg-white/10">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10" />}
          title="No editors found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <Card className="overflow-hidden">
          {/* Desktop table */}
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
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((editor) => (
                  <tr key={editor.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-050 transition-colors">
                    <td className="px-4 py-3">
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
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
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
                      <div className="flex items-center gap-2">
                        <Badge variant={statusVariant(editor.verificationStatus)}>{editor.verificationStatus}</Badge>
                        {!editor.active && <Badge variant="inactive">Inactive</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <KebabMenu items={[
                        { label: 'View profile', onClick: () => onNavigate(`/admin/editor/${editor.id}`) },
                        { label: 'Edit', onClick: () => onNavigate(`/admin/editor/${editor.id}`) },
                        editor.verificationStatus !== 'Verified'
                          ? { label: 'Verify', onClick: () => { setVerificationStatus(editor.id, 'Verified'); addToast(`${editor.fullName} verified`, 'success'); } }
                          : { label: 'Reject', onClick: () => { setVerificationStatus(editor.id, 'Rejected', 'Please review and resubmit.'); addToast(`${editor.fullName} rejected`, 'error'); } },
                        { label: editor.active ? 'Disable' : 'Enable', onClick: () => { toggleEditorActive(editor.id); addToast(`${editor.fullName} ${editor.active ? 'disabled' : 'enabled'}`, 'info'); }, variant: editor.active ? 'destructive' : 'default' },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y divide-gray-100">
            {filtered.map((editor) => (
              <div key={editor.id} className="p-4 flex items-start gap-3">
                <Checkbox checked={selected.includes(editor.id)} onChange={() => toggleSelect(editor.id)} className="mt-1" />
                <Avatar src={editor.avatarUrl} alt={editor.fullName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink-900 truncate">{editor.fullName}</p>
                    <KebabMenu items={[
                      { label: 'View profile', onClick: () => onNavigate(`/admin/editor/${editor.id}`) },
                      { label: 'Verify', onClick: () => { setVerificationStatus(editor.id, 'Verified'); addToast(`${editor.fullName} verified`, 'success'); } },
                      { label: 'Reject', onClick: () => { setVerificationStatus(editor.id, 'Rejected', 'Please review.'); addToast(`${editor.fullName} rejected`, 'error'); }, variant: 'destructive' },
                    ]} />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{editor.city}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {editor.skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(editor.verificationStatus)}>{editor.verificationStatus}</Badge>
                    <span className="text-xs text-gray-500">{editor.availability}</span>
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
