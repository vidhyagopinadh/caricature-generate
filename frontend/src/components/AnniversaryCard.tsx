import React from 'react';
import { 
  CheckCircle2, 
  RotateCw, 
  Edit2, 
  Calendar,
  Sparkles,
  Volume2
} from 'lucide-react';
import { playAnniversaryWish } from '../utils/speech';

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
}

interface AnniversaryCardProps {
  employee: Employee;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onGenerate: () => void;
  onUploadPhoto: (file: File) => void;
  onRefresh: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}

export const AnniversaryCard: React.FC<AnniversaryCardProps> = ({
  employee,
  isSelected,
  onSelect,
  onApprove,
  onGenerate,
  onUploadPhoto,
  onRefresh,
  onEdit
}) => {
  const isPending = employee.status === 'Pending';
  const isGenerating = employee.status === 'Generating';
  const isReady = employee.status === 'Ready for Review';
  const isApproved = employee.status === 'Approved';

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadPhoto(e.target.files[0]);
    }
  };

  // Determine which photo to show
  const showOriginal = isPending || isGenerating;
  const currentPhoto = showOriginal 
    ? employee.original_image_url 
    : (employee.caricature_url || employee.original_image_url);

  return (
    <div 
      onClick={onSelect}
      className={`bg-[#12131A] border-2 rounded-2xl flex flex-col p-4 cursor-pointer transition-all duration-200 select-none relative group ${
        isSelected 
          ? 'border-neonPink shadow-panelGlow' 
          : 'border-slate-900 hover:border-slate-800'
      }`}
    >
      {/* Hidden File Input for photo upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Top Section - Employee Info */}
      <div className="flex items-start justify-between mb-3.5">
        <div className="flex items-center space-x-3">
          <img 
            src={getImageUrl(employee.original_image_url)} 
            alt={employee.name} 
            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-800 bg-slate-950"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-sm text-slate-100 truncate">{employee.name}</h3>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wide truncate uppercase">
              {employee.role_title} • {employee.department}
            </p>
          </div>
        </div>
        
        {/* Milestone Pill */}
        <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-850 text-[10px] font-bold text-slate-400 shrink-0">
          {employee.milestone.replace(' Anniversary', '')}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-3.5">
        {isPending && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 text-slate-450 text-[10px] font-bold tracking-wider uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <span>AWAITING STYLIZATION</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full w-full"></div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-neonPink text-[10px] font-bold tracking-wider uppercase mb-1">
              <div className="flex items-center space-x-1.5">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>GENERATING ({employee.progress || 0}%)</span>
              </div>
            </div>
            <div className="h-1 bg-slate-800 rounded-full w-full overflow-hidden">
              <div 
                className="h-full bg-neonPink transition-all duration-300 rounded-full" 
                style={{ width: `${employee.progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}

        {isReady && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] font-bold tracking-wider uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-950/20" />
              <span>READY FOR REVIEW</span>
            </div>
            <div className="h-1 bg-emerald-500 rounded-full w-full"></div>
          </div>
        )}

        {isApproved && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 text-cyan-400 text-[10px] font-bold tracking-wider uppercase mb-1">
              <Calendar className="w-3.5 h-3.5 fill-cyan-950/20" />
              <span>APPROVED & SCHEDULED</span>
            </div>
            <div className="h-1 bg-[#00E5FF] rounded-full w-full"></div>
          </div>
        )}
      </div>

      {/* Middle Section - Caricature Frame */}
      <div className="relative aspect-square w-full bg-[#090A0F] rounded-xl overflow-hidden mb-4 border border-slate-850 flex items-center justify-center group/img">
        <img 
          src={getImageUrl(currentPhoto)} 
          alt={`${employee.name}`} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105 ${
            isGenerating ? 'blur-md opacity-45' : ''
          }`}
        />

        {/* Localized Edit Photo Overlay */}
        {!isGenerating && (
          <button
            onClick={handleEditClick}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer backdrop-blur-xs select-none border-0"
          >
            <Edit2 className="w-5 h-5 text-[#00E5FF] drop-shadow-glow animate-pulse" />
            <span className="text-[10px] font-bold text-slate-300 tracking-wider">
              UPDATE PHOTO
            </span>
          </button>
        )}

        {/* Applying Styles Spinner Overlay for Generating Card */}
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs select-none">
            <div className="relative flex items-center justify-center w-12 h-12 mb-2">
              <div className="absolute inset-0 border-2 border-t-neonPink border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <Sparkles className="w-5 h-5 text-neonPink animate-pulse-fast" />
            </div>
            <span className="text-[10px] font-black text-neonPink tracking-widest text-glow-pink">
              APPLYING STYLES...
            </span>
          </div>
        )}
      </div>

      {/* Bottom Section - Action Controls */}
      <div className="flex items-center gap-2 mt-auto">
        {/* Approve or Generate Action Button */}
        {isPending && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerate();
            }}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-[#00E5FF] hover:bg-[#00CCEE] text-slate-950 transition-all duration-200 active:scale-[0.98] shadow-[0_0_12px_rgba(0,229,255,0.15)]"
          >
            Generate Caricature
          </button>
        )}

        {isGenerating && (
          <button
            disabled
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed text-center"
          >
            Generating...
          </button>
        )}

        {isReady && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove();
            }}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-neonPink hover:bg-[#E02269] text-white transition-all duration-200 active:scale-[0.98] shadow-glow"
          >
            Approve & Schedule
          </button>
        )}

        {isApproved && (
          <button
            disabled
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-[#1D2130] text-slate-400 cursor-not-allowed text-center"
          >
            Scheduled
          </button>
        )}

        {/* Play Anniversary Wish Audio Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playAnniversaryWish(employee);
          }}
          className="p-2 border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 bg-slate-900/40 rounded-lg text-[#00E5FF] hover:text-white transition-colors"
          title="Play Anniversary Voice Wish"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>

        {/* Regenerate / refresh button */}
        {(isReady || isApproved) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefresh(e);
            }}
            className="p-2 border border-slate-850 hover:border-slate-700 bg-slate-900/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            title="Regenerate Caricature"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Edit Tags Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(e);
          }}
          className="p-2 border border-slate-850 hover:border-slate-700 bg-slate-900/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Edit Tags"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
