import { useState, useRef, useEffect, useMemo } from 'react';
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
  HardDrive,
  XCircle,
  AlertCircle,
  X,
  Camera,
} from 'lucide-react';
import type { AvailabilityStatus, Skill, Software, VerificationStatus } from '@/types';

const availabilityOptions: AvailabilityStatus[] = ['Full-Time', 'Part-Time', 'Weekends', 'Not Available'];

interface HardwareConfig {
  workstation: string;
  displays: string;
  storage: string;
  audioConnectivity: string;
}

const parseHardware = (raw?: string): HardwareConfig => {
  if (!raw) return { workstation: '', displays: '', storage: '', audioConnectivity: '' };
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        workstation: parsed.workstation || '',
        displays: parsed.displays || '',
        storage: parsed.storage || '',
        audioConnectivity: parsed.audioConnectivity || parsed.connectivity || '',
      };
    }
  } catch {
    return { workstation: raw, displays: '', storage: '', audioConnectivity: '' };
  }
  return { workstation: '', displays: '', storage: '', audioConnectivity: '' };
};

export function EditorProfile() {
  const { getCurrentEditor, updateEditor, addToast } = useApp();
  const editor = getCurrentEditor();
  const isPro = editor?.storageTier === 'Pro' || (editor?.storageLimitBytes && editor.storageLimitBytes > 1073741824);
  const [saved, setSaved] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(editor?.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [hardwareSpecs, setHardwareSpecs] = useState<HardwareConfig>(() => parseHardware(editor?.hardware));

  const [skills, setSkills] = useState<Skill[]>(editor?.skills || []);
  const [software, setSoftware] = useState<Software[]>(editor?.editingSoftware || []);
  const [skillInput, setSkillInput] = useState('');

  const isDirtyRef = useRef(false);
  const lastEditorIdRef = useRef<string | null>(null);

  // Sync state whenever editor data loads or updates from Supabase/server
  useEffect(() => {
    if (!editor) return;
    if (lastEditorIdRef.current !== editor.id || !isDirtyRef.current) {
      lastEditorIdRef.current = editor.id;
      setForm({
        fullName: editor.fullName || '',
        phone: editor.phone || '',
        email: editor.email || '',
        city: editor.city || '',
        linkedin: editor.linkedin || '',
        instagram: editor.instagram || '',
        portfolioLink: editor.portfolioLink || '',
        experience: editor.experience || 0,
        bio: editor.bio || '',
        availability: editor.availability || ('Not Available' as AvailabilityStatus),
        hoursPerWeek: editor.hoursPerWeek || 0,
      });
      setAvatarUrl(editor.avatarUrl || '');
      setHardwareSpecs(parseHardware(editor.hardware));
      setSkills(editor.skills || []);
      setSoftware(editor.editingSoftware || []);
    }
  }, [
    editor?.id,
    editor?.fullName,
    editor?.phone,
    editor?.email,
    editor?.city,
    editor?.linkedin,
    editor?.instagram,
    editor?.portfolioLink,
    editor?.experience,
    editor?.bio,
    editor?.availability,
    editor?.hoursPerWeek,
    editor?.hardware,
    editor?.skills,
    editor?.editingSoftware,
    editor?.avatarUrl,
  ]);

  // Profile completion criteria (10 core items x 10%)
  const profileCriteria = useMemo(() => [
    { key: 'fullName', label: 'Full Name', completed: Boolean(form.fullName?.trim()) },
    { key: 'phone', label: 'Phone Number', completed: Boolean(form.phone?.trim()) },
    { key: 'city', label: 'City / Location', completed: Boolean(form.city?.trim()) },
    { key: 'bio', label: 'Professional Bio', completed: Boolean(form.bio?.trim() && form.bio.trim().length >= 15) },
    { key: 'experience', label: 'Years Experience', completed: Boolean(form.experience && form.experience > 0) },
    { key: 'availability', label: 'Availability & Hours', completed: Boolean(form.availability && form.availability !== 'Not Available' && form.hoursPerWeek > 0) },
    { key: 'software', label: 'Software Suite', completed: software.length > 0 },
    { key: 'skills', label: 'Core Skills', completed: skills.length > 0 },
    { key: 'hardware', label: 'Hardware Rig Specs', completed: Boolean(hardwareSpecs.workstation?.trim() || hardwareSpecs.displays?.trim() || hardwareSpecs.storage?.trim()) },
    { key: 'links', label: 'Social / Portfolio Link', completed: Boolean(form.linkedin?.trim() || form.instagram?.trim() || form.portfolioLink?.trim()) },
  ], [form, software, skills, hardwareSpecs]);

  const completedCount = useMemo(() => profileCriteria.filter((c) => c.completed).length, [profileCriteria]);
  const completionPercentage = useMemo(() => Math.round((completedCount / profileCriteria.length) * 100), [completedCount, profileCriteria.length]);
  const missingCriteria = useMemo(() => profileCriteria.filter((c) => !c.completed), [profileCriteria]);

  if (!editor) return null;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Profile image size must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        updateEditor(editor.id, { avatarUrl: dataUrl });
        addToast('Profile picture updated successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    isDirtyRef.current = false;
    updateEditor(editor.id, {
      ...form,
      avatarUrl: avatarUrl || editor.avatarUrl,
      skills,
      editingSoftware: software,
      hardware: JSON.stringify(hardwareSpecs),
    });
    setSaved(true);
    addToast('Studio profile and hardware specs updated successfully!', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const updateFormField = (key: keyof typeof form, val: any) => {
    isDirtyRef.current = true;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const updateHardware = (field: keyof HardwareConfig, val: string) => {
    isDirtyRef.current = true;
    setHardwareSpecs((prev) => ({ ...prev, [field]: val }));
  };

  const addSkill = (skill: string) => {
    isDirtyRef.current = true;
    if (!skills.includes(skill as Skill) && allSkills.includes(skill)) {
      setSkills([...skills, skill as Skill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: Skill) => {
    isDirtyRef.current = true;
    setSkills(skills.filter((s) => s !== skill));
  };

  const toggleSoftware = (sw: string) => {
    isDirtyRef.current = true;
    if (software.includes(sw as Software)) {
      setSoftware(software.filter((s) => s !== sw));
    } else {
      setSoftware([...software, sw as Software]);
    }
  };

  const filteredSkills = allSkills.filter(
    (s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s as Skill)
  );

  const verificationStatus: VerificationStatus = editor.verificationStatus || 'Pending';
  const verificationConfig: Record<
    VerificationStatus,
    {
      badgeText: string;
      badgeClass: string;
      icon: React.ReactNode;
      avatarBadgeClass: string;
      avatarIcon: React.ReactNode;
    }
  > = {
    Verified: {
      badgeText: 'Verified',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      avatarBadgeClass: 'bg-emerald-500',
      avatarIcon: <Check className="w-3 h-3 stroke-[3]" />,
    },
    Pending: {
      badgeText: 'Pending Verification',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      avatarBadgeClass: 'bg-amber-500',
      avatarIcon: <Clock className="w-3 h-3 stroke-[2.5]" />,
    },
    Rejected: {
      badgeText: 'Action Needed',
      badgeClass: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      icon: <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />,
      avatarBadgeClass: 'bg-red-500',
      avatarIcon: <X className="w-3 h-3 stroke-[2.5]" />,
    },
  };

  const currentVerification = verificationConfig[verificationStatus] || verificationConfig.Pending;

  return (
    <div className="bg-[#f4f6fb] dark:bg-[#09090B] min-h-screen py-6 px-4 lg:px-8 font-sans text-gray-900 dark:text-zinc-100 transition-colors">
      <div className="max-w-[1140px] mx-auto space-y-6">
        
        {/* Compact Header Bar */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Hidden File Input for Image Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
            />
            
            {/* Clickable Avatar with Camera Overlay */}
            <div className="relative shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-16 h-16 rounded-2xl overflow-hidden cursor-pointer border-2 border-white dark:border-zinc-700 shadow-2xs group"
                title="Click to upload profile photo"
              >
                <img 
                  src={avatarUrl || editor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'} 
                  alt={editor.fullName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5">
                  <Camera className="w-4 h-4" />
                  <span>Update</span>
                </div>
              </div>
              <span 
                title={`Status: ${currentVerification.badgeText}`}
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${currentVerification.avatarBadgeClass} border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white shadow-2xs z-10 pointer-events-none`}
              >
                {currentVerification.avatarIcon}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{editor.fullName || 'Creator Profile'}</h1>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border flex items-center gap-1 ${currentVerification.badgeClass}`}>
                  {currentVerification.icon}
                  {currentVerification.badgeText}
                </span>
                {isPro && (
                  <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 fill-white" />
                    PRO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                  <span>Change photo</span>
                </button>
                <span className="text-xs text-gray-400 dark:text-zinc-500">•</span>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Manage your creator studio profile, hardware specifications, and public portfolio.
                </p>
              </div>
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

        {/* Verification Alert / Feedback (if rejected or revisions needed) */}
        {verificationStatus === 'Rejected' && editor.verificationFeedback && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-800 dark:text-red-300">Verification Review Feedback</h4>
              <p className="text-xs text-red-700 dark:text-red-400 mt-0.5 leading-relaxed">{editor.verificationFeedback}</p>
            </div>
          </div>
        )}

        {/* Profile Completion Overview Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black text-sm shadow-xs border ${
                completionPercentage >= 80
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : completionPercentage >= 50
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800'
              }`}>
                <span>{completionPercentage}%</span>
                <span className="text-[8px] font-bold uppercase tracking-wider opacity-70">Score</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black text-gray-900 dark:text-white">
                    {completionPercentage === 100
                      ? '100% Profile Completed — Fully Configured'
                      : `${completionPercentage}% Profile Completed`}
                  </h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    completionPercentage >= 80
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}>
                    {completedCount} of {profileCriteria.length} details filled
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  {completionPercentage === 100
                    ? 'All studio and hardware specifications are verified. Your profile is ready for maximum client project matching.'
                    : 'Provide the missing details below to ensure client clarity and unlock priority project assignments.'}
                </p>
              </div>
            </div>

            {missingCriteria.length > 0 ? (
              <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 sm:text-right shrink-0">
                {missingCriteria.length} {missingCriteria.length === 1 ? 'detail' : 'details'} required for 100%
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Profile 100% complete
              </span>
            )}
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-gray-200/60 dark:border-zinc-700">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                completionPercentage >= 80
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : completionPercentage >= 50
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: `${Math.max(4, completionPercentage)}%` }}
            />
          </div>

          {/* Missing fields recommendation pills */}
          {missingCriteria.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Unfilled fields:</span>
              {missingCriteria.map((item) => (
                <span
                  key={item.key}
                  className="px-2.5 py-0.5 bg-gray-50 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 rounded-lg text-[11px] font-semibold border border-gray-200 dark:border-zinc-700/80"
                >
                  + {item.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Personal Information Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Personal & Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input 
                  label="Full Name" 
                  value={form.fullName} 
                  placeholder={form.fullName ? '' : 'Not specified (e.g. Alex Rivera)'}
                  onChange={(e) => updateFormField('fullName', e.target.value)} 
                  icon={<User className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Phone Number" 
                  value={form.phone} 
                  placeholder={form.phone ? '' : 'Not specified (e.g. +1 555-0199)'}
                  onChange={(e) => updateFormField('phone', e.target.value)} 
                  icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Email Address" 
                  type="email" 
                  value={form.email} 
                  placeholder={form.email ? '' : 'Not specified (e.g. editor@gogangs.com)'}
                  onChange={(e) => updateFormField('email', e.target.value)} 
                  icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="City / Location" 
                  value={form.city} 
                  placeholder={form.city ? '' : 'Not specified (e.g. Los Angeles, CA)'}
                  onChange={(e) => updateFormField('city', e.target.value)} 
                  icon={<MapPin className="w-3.5 h-3.5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Hardware & Workstation Specs (Dynamic & User-Editable) */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Workstation & Hardware Specifications</h2>
                    <p className="text-[11px] text-gray-400 dark:text-zinc-400">Specify your computer specs, displays, and setup details</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {hardwareSpecs.workstation || hardwareSpecs.displays ? 'Configured' : 'Not specified'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-gray-900 dark:text-zinc-200" />
                    Primary Workstation / CPU / GPU
                  </label>
                  <input
                    type="text"
                    value={hardwareSpecs.workstation}
                    placeholder={hardwareSpecs.workstation ? '' : 'Not specified (e.g. Apple Mac Studio M2 Ultra / PC RTX 4090, Intel i9)'}
                    onChange={(e) => updateHardware('workstation', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-gray-400 dark:focus:border-zinc-500 font-medium text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Monitors & Color Reference Displays
                  </label>
                  <input
                    type="text"
                    value={hardwareSpecs.displays}
                    placeholder={hardwareSpecs.displays ? '' : 'Not specified (e.g. Dual 4K ASUS ProArt 32-inch HDR, Calibrated DCI-P3)'}
                    onChange={(e) => updateHardware('displays', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-gray-400 dark:focus:border-zinc-500 font-medium text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Storage & Scratch Disks
                  </label>
                  <input
                    type="text"
                    value={hardwareSpecs.storage}
                    placeholder={hardwareSpecs.storage ? '' : 'Not specified (e.g. 4TB NVMe SSD + 16TB High-Speed RAID Array)'}
                    onChange={(e) => updateHardware('storage', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-gray-400 dark:focus:border-zinc-500 font-medium text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-gray-900 dark:text-zinc-200" />
                    Network Pipeline & Audio Monitoring
                  </label>
                  <input
                    type="text"
                    value={hardwareSpecs.audioConnectivity}
                    placeholder={hardwareSpecs.audioConnectivity ? '' : 'Not specified (e.g. 1 Gbps Symmetrical Fiber, Yamaha HS8 Monitors)'}
                    onChange={(e) => updateHardware('audioConnectivity', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-gray-400 dark:focus:border-zinc-500 font-medium text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Bio Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Creator Bio & Narrative Style</h2>
                <span className="text-[10px] text-gray-400 font-semibold">
                  {form.bio?.trim() ? `${form.bio.length} characters` : 'Not specified'}
                </span>
              </div>
              <Textarea
                rows={3}
                placeholder={form.bio ? '' : 'Not specified. Describe your editing philosophy, favorite niches, pacing style, and major commercial highlights...'}
                value={form.bio}
                onChange={(e) => updateFormField('bio', e.target.value)}
              />
            </div>

          </div>

          {/* Right Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Links & Social Presence Card (Moved to Right Column) */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Links & Social Presence</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input 
                  label="LinkedIn Profile" 
                  placeholder={form.linkedin ? '' : 'Not specified (e.g. linkedin.com/in/username)'} 
                  value={form.linkedin} 
                  onChange={(e) => updateFormField('linkedin', e.target.value)} 
                  icon={<Linkedin className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Instagram Handle" 
                  placeholder={form.instagram ? '' : 'Not specified (e.g. @username)'} 
                  value={form.instagram} 
                  onChange={(e) => updateFormField('instagram', e.target.value)} 
                  icon={<Instagram className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Personal Portfolio Website" 
                  placeholder={form.portfolioLink ? '' : 'Not specified (e.g. yourname.studio)'} 
                  value={form.portfolioLink} 
                  onChange={(e) => updateFormField('portfolioLink', e.target.value)} 
                  icon={<Globe className="w-3.5 h-3.5 text-gray-400" />}
                />
                <Input 
                  label="Industry Experience (Years)" 
                  type="number" 
                  min="0" 
                  value={form.experience} 
                  onChange={(e) => updateFormField('experience', parseInt(e.target.value) || 0)} 
                  icon={<Briefcase className="w-3.5 h-3.5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Work Availability */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Work Capacity & Availability</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Select
                  label="Status"
                  value={form.availability}
                  onChange={(e) => updateFormField('availability', e.target.value as AvailabilityStatus)}
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
                  onChange={(e) => updateFormField('hoursPerWeek', parseInt(e.target.value) || 0)}
                  icon={<Clock className="w-3.5 h-3.5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Skills & Specialties */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Editing Disciplines & Skills</h2>
              
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <SkillTag key={skill} onRemove={() => removeSkill(skill)} className="bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-bold px-2.5 py-1 rounded-lg text-xs">
                    {skill}
                  </SkillTag>
                ))}
                {skills.length === 0 && <p className="text-xs text-gray-400 dark:text-zinc-500">No skills added yet.</p>}
              </div>

              <div className="relative pt-1">
                <Input
                  placeholder="Type to add skills..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  icon={<Plus className="w-3.5 h-3.5 text-gray-400" />}
                />
                {skillInput && filteredSkills.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg py-1 z-20 max-h-40 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white transition-colors font-semibold"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Editing Software */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Creative Software Suite</h2>
              
              <div className="flex flex-wrap gap-1.5">
                {allSoftware.map((sw) => {
                  const selected = software.includes(sw as Software);
                  return (
                    <button
                      key={sw}
                      onClick={() => toggleSoftware(sw)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        selected
                          ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900 shadow-2xs'
                          : 'bg-white dark:bg-zinc-800/80 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 text-white dark:text-gray-900" />}
                      {sw}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

