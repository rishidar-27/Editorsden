import { useState } from 'react';
import { Input, Textarea, Select, Button, SkillTag } from '@/components/ui';
import { useApp } from '@/context';
import { allSkills, allSoftware } from '@/data';
import { Check, X, Plus } from 'lucide-react';
import type { AvailabilityStatus, Skill, Software } from '@/types';

const availabilityOptions: AvailabilityStatus[] = ['Full-Time', 'Part-Time', 'Weekends', 'Not Available'];

export function EditorProfile() {
  const { getCurrentEditor, updateEditor, addToast } = useApp();
  const editor = getCurrentEditor();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    fullName: editor?.fullName || '',
    phone: editor?.phone || '',
    email: editor?.email || '',
    city: editor?.city || '',
    linkedin: editor?.linkedin || '',
    instagram: editor?.instagram || '',
    portfolioLink: editor?.portfolioLink || '',
    experience: editor?.experience || 0,
    bio: editor?.bio || '',
    availability: editor?.availability || ('Not Available' as AvailabilityStatus),
    hoursPerWeek: editor?.hoursPerWeek || 0,
  });

  const [skills, setSkills] = useState<Skill[]>(editor?.skills || []);
  const [software, setSoftware] = useState<Software[]>(editor?.editingSoftware || []);
  const [skillInput, setSkillInput] = useState('');

  if (!editor) return null;

  const handleSave = () => {
    updateEditor(editor.id, {
      ...form,
      skills,
      editingSoftware: software,
    });
    setSaved(true);
    addToast('Profile updated successfully', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const addSkill = (skill: string) => {
    if (!skills.includes(skill as Skill) && allSkills.includes(skill)) {
      setSkills([...skills, skill as Skill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: Skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const toggleSoftware = (sw: string) => {
    if (software.includes(sw as Software)) {
      setSoftware(software.filter((s) => s !== sw));
    } else {
      setSoftware([...software, sw as Software]);
    }
  };

  const filteredSkills = allSkills.filter(
    (s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s as Skill)
  );

  return (
    <div className="max-w-[800px] mx-auto px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 mb-1">My profile</h1>
          <p className="text-sm text-gray-600">Keep your information up to date</p>
        </div>
        <Button onClick={handleSave} size="sm">
          {saved ? <><Check className="w-4 h-4" /> Saved</> : 'Save changes'}
        </Button>
      </div>

      {/* Personal info */}
      <section className="mb-8">
        <h2 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Personal information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
      </section>

      <div className="h-px bg-gray-100 mb-8" />

      {/* Social & links */}
      <section className="mb-8">
        <h2 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Links & social</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="LinkedIn" placeholder="linkedin.com/in/..." value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
          <Input label="Instagram" placeholder="@username" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          <Input label="Portfolio link" placeholder="yourname.studio" value={form.portfolioLink} onChange={(e) => setForm({ ...form, portfolioLink: e.target.value })} />
          <Input label="Experience (years)" type="number" min="0" value={form.experience} onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) || 0 })} />
        </div>
      </section>

      <div className="h-px bg-gray-100 mb-8" />

      {/* Bio */}
      <section className="mb-8">
        <Textarea
          label="Bio"
          rows={4}
          placeholder="Tell clients about your editing style and experience..."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </section>

      <div className="h-px bg-gray-100 mb-8" />

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Skills</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill) => (
            <SkillTag key={skill} onRemove={() => removeSkill(skill)}>{skill}</SkillTag>
          ))}
          {skills.length === 0 && <p className="text-sm text-gray-500">No skills added yet.</p>}
        </div>
        <div className="relative">
          <Input
            placeholder="Type to search and add skills..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            icon={<Plus className="w-4 h-4" />}
          />
          {skillInput && filteredSkills.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-surface-0 border border-gray-200 rounded-lg shadow-lg py-1 z-10 max-h-48 overflow-y-auto scrollbar-thin">
              {filteredSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="h-px bg-gray-100 mb-8" />

      {/* Software */}
      <section className="mb-8">
        <h2 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Editing software</h2>
        <div className="flex flex-wrap gap-2">
          {allSoftware.map((sw) => {
            const selected = software.includes(sw as Software);
            return (
              <button
                key={sw}
                onClick={() => toggleSoftware(sw)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  selected
                    ? 'bg-violet-050 border-violet-200 text-violet-700'
                    : 'bg-surface-0 border-gray-200 text-gray-700 hover:bg-gray-050'
                }`}
              >
                {selected && <Check className="w-3.5 h-3.5" />}
                {sw}
              </button>
            );
          })}
        </div>
      </section>

      <div className="h-px bg-gray-100 mb-8" />

      {/* Availability */}
      <section className="mb-8">
        <h2 className="text-h3 mb-4" style={{ fontSize: '16px' }}>Availability</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Availability"
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value as AvailabilityStatus })}
          >
            {availabilityOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
          <Input
            label="Hours per week"
            type="number"
            min="0"
            max="60"
            value={form.hoursPerWeek}
            onChange={(e) => setForm({ ...form, hoursPerWeek: parseInt(e.target.value) || 0 })}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          {saved ? <><Check className="w-4 h-4" /> Saved</> : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
