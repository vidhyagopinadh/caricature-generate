import React, { useState } from 'react';
import { X, UserPlus, AlertTriangle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (
    name: string,
    roleTitle: string,
    department: string,
    milestone: string,
    tags: string[],
    age: number,
    hobbies: string[],
    activities: string[],
    photoFile: File | null
  ) => Promise<void>;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState('Product');
  const [milestone, setMilestone] = useState('5th Anniversary');
  const [tagsInput, setTagsInput] = useState('');
  const [age, setAge] = useState(30);
  const [hobbiesInput, setHobbiesInput] = useState('');
  const [activitiesInput, setActivitiesInput] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErrorMsg('Name is required.');
    if (!roleTitle.trim()) return setErrorMsg('Role Title is required.');
    if (!department.trim()) return setErrorMsg('Department is required.');

    setIsSubmitting(true);
    setErrorMsg(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const hobbies = hobbiesInput
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const activities = activitiesInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      await onRegister(
        name.trim(),
        roleTitle.trim(),
        department.trim(),
        milestone,
        tags,
        Number(age),
        hobbies,
        activities,
        photoFile
      );
      // Reset state and close modal
      setName('');
      setRoleTitle('');
      setDepartment('Product');
      setMilestone('5th Anniversary');
      setTagsInput('');
      setAge(30);
      setHobbiesInput('');
      setActivitiesInput('');
      setPhotoFile(null);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register employee milestone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm select-none p-4 animate-fade-in">
      {/* Modal Card */}
      <div 
        className="w-full max-w-lg bg-[#12131A] border border-slate-800 rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-900">
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-neonPink" />
            <span>Register Employee Milestone</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="flex items-center space-x-2 bg-red-950/20 border border-red-500/40 text-red-400 p-3 rounded-lg text-xs font-semibold">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Employee Details Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Employee Name</label>
              <input
                type="text"
                placeholder="e.g., Sarah Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Role Title</label>
              <input
                type="text"
                placeholder="e.g., Senior Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Department</label>
              <input
                type="text"
                placeholder="e.g., Product"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Milestone</label>
              <select
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                className="w-full bg-[#090A0F] border border-slate-800/80 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 cursor-pointer"
              >
                <option value="1st Anniversary">1st Anniversary</option>
                <option value="3rd Anniversary">3rd Anniversary</option>
                <option value="5th Anniversary">5th Anniversary</option>
                <option value="10th Anniversary">10th Anniversary</option>
                <option value="15th Anniversary">15th Anniversary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Persona Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., Code Artist, Traveler"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neonPink/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Hobbies (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Coffee Brewing, Travel Photography"
              value={hobbiesInput}
              onChange={(e) => setHobbiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Activities (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Hiking, Cycling"
              value={activitiesInput}
              onChange={(e) => setActivitiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Profile Portrait Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPhotoFile(e.target.files[0]);
                }
              }}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 file:bg-neonPink/20 file:border-0 file:text-neonPink file:text-xs file:font-bold file:px-2.5 file:py-1 file:rounded-md file:cursor-pointer cursor-pointer focus:outline-none"
            />
          </div>

          <div className="text-[10px] text-slate-500 leading-relaxed bg-[#090A0F]/50 p-3 rounded-lg border border-slate-900">
            💡 **Tip:** After registering the milestone, you can trigger style caricature generation on their dashboard card. The resulting caricature will process the portrait image considering all custom tags, hobbies, activities, and role titles.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1D2130]/60 hover:bg-[#1D2130] rounded-lg text-xs font-bold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-neonPink to-violet-650 hover:from-neonPink hover:to-violet-750 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registering...' : 'Register Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
