import { useState } from 'react';
import { Input, Textarea, Select, Button, SkillTag } from '@/components/ui';
import { useApp } from '@/context';
import { allSkills, allSoftware } from '@/data';
import { Check, Plus, User, Mail, Phone, MapPin, Globe, Linkedin, Instagram, Briefcase, Clock, ShieldCheck, Sparkles } from 'lucide-react';
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
    <div className="bg-[#FAF9FF] min-h-screen py-8 px-4 lg:px-8 font-sans text-gray-900">
      <div className="max-w-[1140px] mx-auto">
        
        {/* Header Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={editor.avatarUrl || 'https://i.pravatar.cc/150?u=editor'} 
                alt={editor.fullName} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs" 
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{editor.fullName || 'Editor Profile'}</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#E6F8F0] text-[#10B981] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your personal info, portfolio links, skills, and work availability.
              </p>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            className="bg-[#6D28D9] hover:bg-purple-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
          >
            {saved ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Save changes</>
            )}
          </Button>
        </div>

        {/* 2-Column Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="Full Name" 
                  value={form.fullName} 
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                  icon={<User className="w-4 h-4 text-gray-400" />}
                />
                <Input 
                  label="Phone Number" 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  icon={<Phone className="w-4 h-4 text-gray-400" />}
                />
                <Input 
                  label="Email Address" 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  icon={<Mail className="w-4 h-4 text-gray-400" />}
                />
                <Input 
                  label="City / Location" 
                  value={form.city} 
                  onChange={(e) => setForm({ ...form, city: e.target.value })} 
                  icon={<MapPin className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>

            {/* Links & Social Media Card */}
            <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Links & Social Presence</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="LinkedIn Profile" 
                  placeholder="linkedin.com/in/..." 
                  value={form.linkedin} 
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })} 
                  icon={<Linkedin className="w-4 h-4 text-gray-400" />}
                />
                <Input 
                  label="Instagram Handle" 
                  placeholder="@username" 
                  value={form.instagram} 
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })} 
                  icon={<Instagram className="w-4 h-4 text-gray-400" />}
                />
                <Input 
                  label="Portfolio Website" 
                  placeholder="yourname.studio" 
                  value={form.portfolioLink} 
                  onChange={(e) => setForm({ ...form, portfolioLink: e.target.value })} 
                  icon={<Globe className="w-4 h-4 text-gray-400" />}
                />
                <Input 
                  label="Experience (Years)" 
                  type="number" 
                  min="0" 
                  value={form.experience} 
                  onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) || 0 })} 
                  icon={<Briefcase className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>

            {/* Bio Card */}
            <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)]">
              <h2 className="text-base font-bold text-gray-900 mb-3">About / Bio</h2>
              <Textarea
                rows={4}
                placeholder="Tell clients and admins about your editing style, niche, and achievements..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

          </div>

          {/* Right Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Skills & Specialties */}
            <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)]">
              <h2 className="text-base font-bold text-gray-900 mb-3">Skills & Specialties</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <SkillTag key={skill} onRemove={() => removeSkill(skill)} className="bg-[#F0EBFE] text-[#7C3AED] font-semibold px-3 py-1 rounded-full text-xs">
                    {skill}
                  </SkillTag>
                ))}
                {skills.length === 0 && <p className="text-xs text-gray-500">No skills added yet.</p>}
              </div>

              <div className="relative">
                <Input
                  placeholder="Type to search and add skills..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  icon={<Plus className="w-4 h-4 text-gray-400" />}
                />
                {skillInput && filteredSkills.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20 max-h-48 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-[#F0EBFE] hover:text-[#7C3AED] transition-colors font-medium"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Editing Software */}
            <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)]">
              <h2 className="text-base font-bold text-gray-900 mb-3">Editing Software</h2>
              
              <div className="flex flex-wrap gap-2">
                {allSoftware.map((sw) => {
                  const selected = software.includes(sw as Software);
                  return (
                    <button
                      key={sw}
                      onClick={() => toggleSoftware(sw)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        selected
                          ? 'bg-[#F0EBFE] border-[#7C3AED]/40 text-[#7C3AED]'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                      {sw}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Work Availability */}
            <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#FFF4E5] text-[#F97316] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Work Availability</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Status"
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
                  icon={<Clock className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
