import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface KPICardsProps {
  pendingCount: number;
  awaitingCount: number;
  scheduledCount: number;
}

export const KPICards: React.FC<KPICardsProps> = ({ 
  pendingCount, 
  awaitingCount, 
  scheduledCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 select-none">
      {/* Pending Generation Card */}
      <div className="bg-[#12131A] border border-slate-900 rounded-xl p-5 flex flex-col justify-between h-[120px] transition-all hover:border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          PENDING GENERATION
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl font-extrabold text-neonPink">{pendingCount}</span>
          <div className="flex items-center space-x-2 text-neonPink text-xs font-semibold">
            {/* Sparkline svg */}
            <svg className="w-14 h-6 stroke-current stroke-[2] fill-none" viewBox="0 0 50 20">
              <path d="M0 15 Q 12 5, 25 12 T 50 5" />
            </svg>
            <span>~ 2%</span>
          </div>
        </div>
      </div>

      {/* Awaiting Approval Card */}
      <div className="bg-[#12131A] border border-slate-900 rounded-xl p-5 flex flex-col justify-between h-[120px] transition-all hover:border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          AWAITING APPROVAL
        </span>
        <div className="flex flex-col mt-2">
          <span className="text-3xl font-extrabold text-[#00FFE0]">{awaitingCount}</span>
          <span className="text-slate-500 text-xs mt-1 font-medium">Target: 0</span>
        </div>
      </div>

      {/* Scheduled This Week Card */}
      <div className="bg-[#12131A] border border-slate-900 rounded-xl p-5 flex flex-col justify-between h-[120px] transition-all hover:border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          SCHEDULED THIS WEEK
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl font-extrabold text-white">{scheduledCount}</span>
          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 fill-emerald-950/40" />
            <span>On Track</span>
          </div>
        </div>
      </div>
    </div>
  );
};
