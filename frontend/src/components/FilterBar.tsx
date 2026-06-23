import React from 'react';
import { Search, ChevronDown, UserPlus } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  deptFilter: string;
  setDeptFilter: (filter: string) => void;
  departments: string[];
  onUploadTrigger: () => void; // Keeps the prop name for compatibility in App.tsx
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  deptFilter,
  setDeptFilter,
  departments,
  onUploadTrigger,
}) => {
  return (
    <div className="bg-[#12131A] border border-slate-900 rounded-xl p-3 flex flex-col lg:flex-row gap-4 items-center justify-between mb-8 select-none">
      {/* Left container: Search and Register Milestone */}
      <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee names..."
            className="w-full pl-10 pr-4 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-neonPink/50 transition-colors"
          />
        </div>
        
        <button
          onClick={onUploadTrigger}
          className="w-full sm:w-auto py-2 px-4 bg-neonPink/10 hover:bg-neonPink/20 text-neonPink border border-neonPink/30 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(255,42,122,0.1)] active:scale-[0.98] shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register Milestone</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex w-full sm:w-auto items-center gap-3 justify-end">
        {/* Status Dropdown */}
        <div className="relative min-w-[130px] w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-[#090A0F] border border-slate-800/80 hover:border-slate-700/80 px-4 py-2 pr-9 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 transition-colors cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="Generating">Generating</option>
            <option value="Ready for Review">Ready for Review</option>
            <option value="Approved">Approved</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>

        {/* Department Dropdown */}
        <div className="relative min-w-[140px] w-full sm:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full appearance-none bg-[#090A0F] border border-slate-800/80 hover:border-slate-700/80 px-4 py-2 pr-9 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 transition-colors cursor-pointer"
          >
            <option value="All">Department: All</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
