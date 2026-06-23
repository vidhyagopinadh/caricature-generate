import React, { useState } from 'react';
import { 
  X, 
  Coffee, 
  Plane, 
  Sparkles, 
  Code, 
  Tag, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Download,
  MessageSquare,
  Volume2
} from 'lucide-react';
import { playAnniversaryWish } from '../utils/speech';

interface TimelineEvent {
  time: string;
  event: string;
  status: string;
}

interface Employee {
  id: number;
  name: string;
  role_title: string;
  department: string;
  milestone: string;
  original_image_url: string;
  caricature_url: string | null;
  status: string;
  progress?: number;
  tags: string[];
  timeline: TimelineEvent[];
}

interface InspectionViewProps {
  employee: Employee | null;
  onClose: () => void;
  onApprove: (id: number) => void;
  onAddTag: (id: number, tag: string) => void;
  onRemoveTag: (id: number, tag: string) => void;
  onDownload: (employee: Employee) => void;
  onFeedback: (employee: Employee) => void;
}

export const InspectionView: React.FC<InspectionViewProps> = ({
  employee,
  onClose,
  onApprove,
  onAddTag,
  onRemoveTag,
  onDownload,
  onFeedback,
}) => {
  const [newTagInput, setNewTagInput] = useState('');

  if (!employee) {
    return null;
  }

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim()) {
      onAddTag(employee.id, newTagInput.trim());
      setNewTagInput('');
    }
  };

  // Helper to resolve URLs depending on backend vs absolute assets
  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return '/admin_avatar.png';
    if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  };

  // Maps tags to custom visual colors and icons
  const getTagStyle = (tag: string) => {
    const norm = tag.toLowerCase();
    if (norm.includes('coffee')) {
      return {
        classes: 'border-teal-500/40 bg-teal-950/20 text-teal-300 hover:border-teal-400/60',
        icon: Coffee,
      };
    } else if (norm.includes('travel') || norm.includes('explore') || norm.includes('wander')) {
      return {
        classes: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400/60',
        icon: Plane,
      };
    } else if (norm.includes('vector') || norm.includes('modern') || norm.includes('design')) {
      return {
        classes: 'border-pink-500/40 bg-pink-950/20 text-pink-300 hover:border-pink-400/60',
        icon: Sparkles,
      };
    } else if (norm.includes('code') || norm.includes('engineer') || norm.includes('artist') || norm.includes('tech')) {
      return {
        classes: 'border-purple-500/40 bg-purple-950/20 text-purple-300 hover:border-purple-400/60',
        icon: Code,
      };
    }
    // Default Style
    return {
      classes: 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700',
      icon: Tag,
    };
  };

  const isReady = employee.status === 'Ready for Review';
  const showOriginal = employee.status === 'Pending' || employee.status === 'Generating';
  const displayPhoto = showOriginal 
    ? employee.original_image_url 
    : (employee.caricature_url || employee.original_image_url);

  return (
    <div className="w-96 bg-[#090A0F] border-l border-slate-900 flex flex-col h-screen shrink-0 overflow-y-auto select-none relative">
      {/* Header Panel */}
      <div className="flex items-center justify-between p-5 border-b border-slate-900">
        <h2 className="font-extrabold text-base text-slate-100">Inspection View</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Drawer Body */}
      <div className="p-5 flex-1 space-y-6">
        {/* Caricature Large Preview */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#0F1015] border border-slate-900 relative shadow-inner">
          <img 
            src={getImageUrl(displayPhoto)} 
            alt={`${employee.name} expanded`}
            className={`w-full h-full object-cover ${
              employee.status === 'Generating' ? 'blur-md opacity-45' : ''
            }`}
          />
          {employee.status === 'Generating' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <RotateIcon />
            </div>
          )}
        </div>

        {/* Employee Info Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white truncate max-w-[220px]">{employee.name}</h3>
            <div className="px-2.5 py-0.5 rounded-full border border-pink-500/30 bg-pink-950/10 text-[10px] font-bold text-neonPink shrink-0">
              {employee.milestone.replace(' Anniversary', '').replace('st', '').replace('nd', '').replace('rd', '').replace('th', '')} Years
            </div>
          </div>
          <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
            {employee.role_title} • {employee.department}
          </span>
        </div>

        {/* Persona Tags section */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-3">
            PERSONA TAGS
          </h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {employee.tags.map((tag) => {
              const style = getTagStyle(tag);
              const TagIcon = style.icon;
              return (
                <div
                  key={tag}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${style.classes}`}
                >
                  <TagIcon className="w-3.5 h-3.5" />
                  <span>{tag}</span>
                  <button
                    onClick={() => onRemoveTag(employee.id, tag)}
                    className="pl-1 text-slate-500 hover:text-red-400 transition-colors font-bold text-xs"
                    title="Remove tag"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Tag Inline Form */}
          <form onSubmit={handleAddTagSubmit} className="flex items-center gap-1.5 mt-2">
            <input
              type="text"
              placeholder="Add tag..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-900/40 border border-slate-850 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neonPink/50"
            />
            <button
              type="submit"
              className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-neonPink transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Generation Log Timeline */}
        <div className="relative timeline-line">
          <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4">
            GENERATION LOG
          </h4>
          <div className="space-y-5 relative pl-8">
            {employee.timeline.map((event, index) => {
              const isComp = event.status === 'completed';
              const isAct = event.status === 'in-progress';
              return (
                <div key={index} className="relative text-xs">
                  {/* Timeline Dot */}
                  <span className="absolute -left-8 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#090A0F]">
                    {isComp ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 fill-[#090A0F]" />
                    ) : isAct ? (
                      <Clock className="h-4.5 w-4.5 text-neonPink fill-[#090A0F] animate-pulse-fast" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-800"></span>
                    )}
                  </span>
                  
                  {/* Event Text */}
                  <div className="flex flex-col">
                    <span className={`font-bold ${isComp ? 'text-slate-200' : isAct ? 'text-neonPink' : 'text-slate-500'}`}>
                      {event.event}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                      {event.time}{event.event === 'Generation Complete' ? ' • Version 3.2' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Controls panel */}
      <div className="p-4 border-t border-slate-900 space-y-2.5 bg-[#090A0F]/80 backdrop-blur-md sticky bottom-0">
        <button
          onClick={() => onApprove(employee.id)}
          disabled={!isReady}
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-center transition-all duration-200 ${
            isReady
              ? 'bg-neonPink hover:bg-[#E02269] text-white shadow-glow active:scale-[0.98]'
              : 'bg-[#1D2130] text-slate-500 cursor-not-allowed'
          }`}
        >
          {employee.status === 'Approved' ? 'Milestone Scheduled' : 'Approve & Schedule Milestone'}
        </button>

        {/* Audio Wish and Secondary Actions */}
        <button
          onClick={() => playAnniversaryWish(employee)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#00E5FF] hover:bg-[#00CCEE] text-slate-950 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-[0_0_12px_rgba(0,229,255,0.15)]"
        >
          <Volume2 className="w-4 h-4" />
          <span>Play Anniversary Audio Wish</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onDownload(employee)}
            className="flex-1 py-2.5 px-3 bg-[#1D2130]/50 hover:bg-[#1D2130] text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-800/40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={() => onFeedback(employee)}
            className="flex-1 py-2.5 px-3 bg-[#1D2130]/50 hover:bg-[#1D2130] text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-800/40 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Internal quick spinner component
const RotateIcon = () => (
  <div className="relative flex items-center justify-center w-12 h-12">
    <div className="absolute inset-0 border-2 border-t-neonPink border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    <Sparkles className="w-5 h-5 text-neonPink animate-pulse-fast" />
  </div>
);
