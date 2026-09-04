import { useState } from 'react';
import { Input, Textarea, Select, Button, SkillTag } from '@/components/ui';
import { useApp } from '@/context';
import { allSkills, allSoftware } from '@/data';
import {
  Check,
  Plus,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Instagram,
  Briefcase,
  Clock,
  ShieldCheck,
  Sparkles,
  Cpu,
  Tv,
  Wifi,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';
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

  const [hardwareSpecs, setHardwareSpecs] = useState({
    workstation: 'Apple Mac Studio M2 Ultra (128GB Unified Memory, 24-Core CPU)',
    displays: 'Dual ASUS ProArt 32" 4K HDR (Calibrated Rec.709 & DCI-P3 Delta E < 1.5)',
    connectivity: '1 Gbps Symmetrical Fiber Optical (Low-Latency R2 Sync)',
    audioMonitors: 'Yamaha HS8 Studio Reference Monitors + Sennheiser HD 650 Pro',
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
    addToast('Studio profile and hardware specs updated successfully!', 'success');
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
    <div className="bg-[#f4f6fb] dark:bg-[#09090B] min-h-screen py-6 px-4 lg:px-8 font-sans text-gray-900 dark:text-zinc-100 transition-colors">
      <div className="max-w-[1140px] mx-auto space-y-6">
        
        {/* Compact Header Bar */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img 
                src={editor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'} 
                alt={editor.fullName} 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-zinc-700 shadow-2xs" 
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{editor.fullName || 'Creator Profile'}</h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Top 1%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your creator studio credentials, hardware benchmarking, and public portfolio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`#/editor/${editor.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span>View Public Portfolio</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>

            <Button 
              onClick={handleSave} 
              className="bg-gray-900 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 shrink-0"
            >
              {saved ? (
                <><Check className="w-3.5 h-3.5" /> Saved!</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> Save Changes</>
              )}
            </Button>
          </div>
        </div>

        {/* 2-Column Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Personal & Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input 
                  label="Full Name" 
                  value={form.fullName} 
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                  icon={<User className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Phone Number" 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Email Address" 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="City / Location" 
                  value={form.city} 
                  onChange={(e) => setForm({ ...form, city: e.target.value })} 
                  icon={<MapPin className="w-3.5 h-3.5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Hardware & Workstation Specs (NEW) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Studio Workstation & Hardware Benchmark</h2>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  4K 60FPS Certified
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-gray-900" />
                    Primary Workstation / GPU
                  </label>
                  <input
                    type="text"
                    value={hardwareSpecs.workstation}
                    onChange={(e) => setHardwareSpecs({ ...hardwareSpecs, workstation: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-emerald-600" />
                    Color-Calibrated Displays
                  </label>
                  <input
                    type="text"
                    value={hardwareSpecs.displays}
                    onChange={(e) => setHardwareSpecs({ ...hardwareSpecs, displays: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-gray-900" />
                    Network Pipeline & Audio Monitoring
                  </label>
                  <input
                    type="text"
                    value={hardwareSpecs.connectivity}
                    onChange={(e) => setHardwareSpecs({ ...hardwareSpecs, connectivity: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Links & Social Media Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Links & Social Presence</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input 
                  label="LinkedIn Profile" 
                  placeholder="linkedin.com/in/..." 
                  value={form.linkedin} 
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })} 
                  icon={<Linkedin className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Instagram Handle" 
                  placeholder="@username" 
                  value={form.instagram} 
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })} 
                  icon={<Instagram className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Personal Portfolio Website" 
                  placeholder="yourname.studio" 
                  value={form.portfolioLink} 
                  onChange={(e) => setForm({ ...form, portfolioLink: e.target.value })} 
                  icon={<Globe className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Industry Experience (Years)" 
                  type="number" 
                  min="0" 
                  value={form.experience} 
                  onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) || 0 })} 
                  icon={<Briefcase className="w-3.5 h-3.5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Bio Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-gray-900">Creator Bio & Narrative Style</h2>
              <Textarea
                rows={3}
                placeholder="Describe your editing philosophy, favorite niches, pacing style, and major commercial highlights..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

          </div>

          {/* Right Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Skills & Specialties */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-gray-900">Editing Disciplines & Skills</h2>
              
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <SkillTag key={skill} onRemove={() => removeSkill(skill)} className="bg-gray-100 text-gray-900 font-bold px-2.5 py-1 rounded-lg text-xs">
                    {skill}
                  </SkillTag>
                ))}
                {skills.length === 0 && <p className="text-xs text-gray-400">No skills added yet.</p>}
              </div>

              <div className="relative pt-1">
                <Input
                  placeholder="Type to add skills..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  icon={<Plus className="w-3.5 h-3.5 text-gray-400" />}
                />
                {skillInput && filteredSkills.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20 max-h-40 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-semibold"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Editing Software */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-gray-900">Creative Software Suite</h2>
              
              <div className="flex flex-wrap gap-1.5">
                {allSoftware.map((sw) => {
                  const selected = software.includes(sw as Software);
                  return (
                    <button
                      key={sw}
                      onClick={() => toggleSoftware(sw)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        selected
                          ? 'bg-gray-900 border-gray-900 text-white shadow-2xs'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 text-white" />}
                      {sw}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Work Availability */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Work Capacity & Availability</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  icon={<Clock className="w-3.5 h-3.5 text-gray-400" />}
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

