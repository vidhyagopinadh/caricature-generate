import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// Interfaces
// ==========================================

interface TimelineEvent {
  time: string;
  event: string;
  status: string;
}

interface Employee {
  id: string;
  name: string;
  gender: string;
  designation: string;
  department: string;
  photo_url: string;
  age: number;
  joining_date: string;
  anniversary_milestone: string;
  hobbies: string[];
  activities: string[];
  caricature_url: string | null;
  status: 'Awaiting Stylization' | 'Generating' | 'Ready for Review' | 'Approved';
  progress: number;
  tags: string[];
  timeline: TimelineEvent[];
}

// ==========================================
// Inline SVG Icon Components
// ==========================================

const IconDashboard = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="10" rx="1" />
    <rect width="7" height="5" x="3" y="14" rx="1" />
  </svg>
);

const IconClock = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconPaintbrush = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 22 1-1c1.4-1.4 2.4-3.2 3-5 .2-.7.7-1.3 1.4-1.5 1.8-.6 3.6-1.6 5-3l-10-10c-1.4 1.4-2.4 3.2-3 5-.2.7-.7 1.3-1.4 1.5-1.8.6-3.6 1.6-5 3l1 1h5l1 1" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconFileText = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

const IconSearch = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconChevronDown = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconUserPlus = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const IconAlertTriangle = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconCheckCircle2 = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconVolume2 = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const IconDownload = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconMessageSquare = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconSparkles = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const IconRotateCw = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <polyline points="21 3 21 8 16 8" />
  </svg>
);

const IconEdit2 = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const IconPlus = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconX = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCalendar = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconTag = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.29-7.29a1 1 0 0 0 0-1.42z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IconCoffee = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </svg>
);

const IconPlane = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 20.19 14 17.5H4.5a1.5 1.5 0 0 1 0-3h4.68l-3.32-6 2.37-1.37 5.56 5.87h6.69a2 2 0 0 1 2 2c0 .9-.68 1.63-1.56 1.83Z" />
  </svg>
);

// ==========================================
// Speech Synthesis Generator
// ==========================================

const playAnniversaryWishText = (employee: Employee) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech narration
  window.speechSynthesis.cancel();

  const milestoneClean = employee.anniversary_milestone.replace(' Anniversary', '');
  
  const hobbiesText = employee.hobbies && employee.hobbies.length > 0
    ? `whose hobbies include ${employee.hobbies.join(', ')}`
    : 'who has a vibrant set of hobbies';
    
  const activitiesText = employee.activities && employee.activities.length > 0
    ? `loves participating in ${employee.activities.join(', ')}`
    : 'enjoys engaging in team challenges';

  const phrase = `Happy ${milestoneClean} Work Anniversary, ${employee.name}! Thank you for being our incredible ${employee.designation} in the ${employee.department} department! We celebrate you as someone ${hobbiesText}, and who ${activitiesText}. Have a fantastic milestone day!`;

  const utterance = new SpeechSynthesisUtterance(phrase);

  let voices = window.speechSynthesis.getVoices();

  const speakUtterance = () => {
    const englishVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
    if (englishVoices.length > 0) {
      const charSum = employee.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const voiceIndex = charSum % englishVoices.length;
      utterance.voice = englishVoices[voiceIndex];
    }

    const seed = employee.name.length;
    utterance.pitch = 1.15 + (seed % 3) * 0.05; 
    utterance.rate = 0.95 + (seed % 2) * 0.05; 
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  if (!voices || voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      speakUtterance();
    };
  } else {
    speakUtterance();
  }
};

// ==========================================
// Inner Component: Sidebar
// ==========================================

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onGenerateReport: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onGenerateReport }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: IconDashboard },
    { id: 'queue', name: 'Anniversary Queue', icon: IconClock },
    { id: 'employees', name: 'Employees', icon: IconUsers },
    { id: 'templates', name: 'Templates', icon: IconPaintbrush },
    { id: 'settings', name: 'Settings', icon: IconSettings },
  ];

  return (
    <aside className="w-64 bg-[#090A0F] border-r border-slate-900 flex flex-col h-screen shrink-0 justify-between select-none">
      <div>
        <div className="p-6">
          <div className="flex flex-col">
            <h1 className="font-extrabold text-xl tracking-wider text-white">
              HR <span className="text-neonPink">CORE AI</span>
            </h1>
            <span className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase mt-0.5">
              ENTERPRISE ADMIN
            </span>
          </div>
        </div>

        <nav className="px-3 space-y-1 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-lg transition-all duration-150 ${
                  isActive 
                    ? 'bg-neonPink text-white font-semibold shadow-glow' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-4">
        <button 
          onClick={onGenerateReport}
          className="w-full py-3 px-4 rounded-xl bg-[#00FFE0] hover:bg-[#00E5CC] text-slate-950 text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.98] shadow-[0_0_12px_rgba(0,255,224,0.15)]"
        >
          <IconFileText />
          <span>Generate Reports</span>
        </button>

        <div className="flex items-center space-x-3 p-2">
          <div className="relative">
            <img 
              src="/admin_avatar.png" 
              alt="Admin Profile" 
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-800"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#090A0F]"></span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-200 truncate leading-tight">Admin User</span>
            <span className="text-[10px] text-slate-500 truncate mt-0.5">HR Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ==========================================
// Inner Component: KPICards
// ==========================================

interface KPICardsProps {
  pendingCount: number;
  awaitingCount: number;
  scheduledCount: number;
}

const KPICards: React.FC<KPICardsProps> = ({ pendingCount, awaitingCount, scheduledCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 select-none">
      <div className="bg-[#12131A] border border-slate-900 rounded-xl p-5 flex flex-col justify-between h-[120px] transition-all hover:border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          PENDING GENERATION
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl font-extrabold text-neonPink">{pendingCount}</span>
          <div className="flex items-center space-x-2 text-neonPink text-xs font-semibold">
            <svg className="w-14 h-6 stroke-current stroke-[2] fill-none" viewBox="0 0 50 20">
              <path d="M0 15 Q 12 5, 25 12 T 50 5" />
            </svg>
            <span>~ 2%</span>
          </div>
        </div>
      </div>

      <div className="bg-[#12131A] border border-slate-900 rounded-xl p-5 flex flex-col justify-between h-[120px] transition-all hover:border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          AWAITING APPROVAL
        </span>
        <div className="flex flex-col mt-2">
          <span className="text-3xl font-extrabold text-[#00FFE0]">{awaitingCount}</span>
          <span className="text-slate-500 text-xs mt-1 font-medium">Target: 0</span>
        </div>
      </div>

      <div className="bg-[#12131A] border border-slate-900 rounded-xl p-5 flex flex-col justify-between h-[120px] transition-all hover:border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          SCHEDULED THIS WEEK
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl font-extrabold text-white">{scheduledCount}</span>
          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold">
            <IconCheckCircle2 className="w-4 h-4 fill-emerald-950/40" />
            <span>On Track</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: FilterBar
// ==========================================

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  deptFilter: string;
  setDeptFilter: (filter: string) => void;
  departments: string[];
  onUploadTrigger: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
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
      <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
        <div className="relative w-full sm:w-72">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
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
          <IconUserPlus />
          <span>Register Milestone</span>
        </button>
      </div>

      <div className="flex w-full sm:w-auto items-center gap-3 justify-end">
        <div className="relative min-w-[130px] w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-[#090A0F] border border-slate-800/80 hover:border-slate-700/80 px-4 py-2 pr-9 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 transition-colors cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Awaiting Stylization">Awaiting Stylization</option>
            <option value="Generating">Generating</option>
            <option value="Ready for Review">Ready for Review</option>
            <option value="Approved">Approved</option>
          </select>
          <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>

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
          <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: AnniversaryCard
// ==========================================

interface AnniversaryCardProps {
  employee: Employee;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onGenerate: () => void;
  onUploadPhoto: (file: File) => void;
  onRefresh: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onUpdateClick: () => void;
}

const AnniversaryCard: React.FC<AnniversaryCardProps> = ({
  employee,
  isSelected,
  onSelect,
  onApprove,
  onGenerate,
  onUploadPhoto,
  onRefresh,
  onEdit,
  onUpdateClick
}) => {
  const isAwaiting = employee.status === 'Awaiting Stylization';
  const isGenerating = employee.status === 'Generating';
  const isReady = employee.status === 'Ready for Review';
  const isApproved = employee.status === 'Approved';

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadPhoto(e.target.files[0]);
    }
  };

  const showOriginal = isAwaiting || isGenerating;
  const currentPhoto = showOriginal 
    ? employee.photo_url 
    : (employee.caricature_url || employee.photo_url);

  const getPhotoUrl = (url: string) => {
    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  };

  return (
    <div 
      onClick={onSelect}
      className={`bg-[#12131A] border-2 rounded-2xl flex flex-col p-4 cursor-pointer transition-all duration-200 select-none relative group ${
        isSelected 
          ? 'border-neonPink shadow-panelGlow' 
          : 'border-slate-900 hover:border-slate-800'
      }`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Top Section - Employee Info */}
      <div className="flex items-start justify-between mb-3.5">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <img 
            src={getPhotoUrl(employee.photo_url)} 
            alt={employee.name} 
            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-800 bg-slate-950 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-sm text-slate-100 truncate">{employee.name}</h3>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wide truncate uppercase">
              {employee.designation} • {employee.department}
            </p>
          </div>
        </div>
        
        <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-850 text-[10px] font-bold text-slate-400 shrink-0 ml-2">
          {employee.anniversary_milestone.replace(' Anniversary', '')}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-3.5">
        {isAwaiting && (
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
                <IconRotateCw className="w-3.5 h-3.5 animate-spin" />
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
              <IconCheckCircle2 className="w-3.5 h-3.5 fill-emerald-950/20" />
              <span>READY FOR REVIEW</span>
            </div>
            <div className="h-1 bg-emerald-500 rounded-full w-full"></div>
          </div>
        )}

        {isApproved && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 text-cyan-400 text-[10px] font-bold tracking-wider uppercase mb-1">
              <IconCalendar className="w-3.5 h-3.5 fill-cyan-950/20" />
              <span>APPROVED & SCHEDULED</span>
            </div>
            <div className="h-1 bg-[#00E5FF] rounded-full w-full"></div>
          </div>
        )}
      </div>

      {/* Middle Section - Caricature Frame */}
      <div className="relative aspect-square w-full bg-[#090A0F] rounded-xl overflow-hidden mb-4 border border-slate-850 flex items-center justify-center group/img">
        <img 
          src={getPhotoUrl(currentPhoto)} 
          alt={`${employee.name}`} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105 ${
            isGenerating ? 'blur-md opacity-45' : ''
          }`}
        />

        {!isGenerating && (
          <button
            onClick={handleEditClick}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer backdrop-blur-xs select-none border-0"
          >
            <IconEdit2 className="w-5 h-5 text-[#00E5FF] drop-shadow-glow animate-pulse" />
            <span className="text-[10px] font-bold text-slate-300 tracking-wider">
              UPDATE PHOTO
            </span>
          </button>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs select-none">
            <div className="relative flex items-center justify-center w-12 h-12 mb-2">
              <div className="absolute inset-0 border-2 border-t-neonPink border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <IconSparkles className="w-5 h-5 text-neonPink animate-pulse-fast" />
            </div>
            <span className="text-[10px] font-black text-neonPink tracking-widest text-glow-pink">
              APPLYING STYLES...
            </span>
          </div>
        )}
      </div>

      {/* Localized Update Employee Info Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpdateClick();
        }}
        className="w-full py-1.5 mb-3 bg-[#1D2130]/80 hover:bg-[#1D2130] text-[10px] font-extrabold text-slate-350 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-1.5"
        title="Update Employee Info"
      >
        <IconEdit2 className="w-3 h-3 text-[#00FFE0]" />
        <span>UPDATE EMPLOYEE INFO</span>
      </button>

      {/* Bottom Section - Action Controls */}
      <div className="flex items-center gap-2 mt-auto">
        {isAwaiting && (
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            playAnniversaryWishText(employee);
          }}
          className="p-2 border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 bg-slate-900/40 rounded-lg text-[#00E5FF] hover:text-white transition-colors"
          title="Play Anniversary Voice Wish"
        >
          <IconVolume2 />
        </button>

        {(isReady || isApproved) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefresh(e);
            }}
            className="p-2 border border-slate-850 hover:border-slate-700 bg-slate-900/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            title="Regenerate Caricature"
          >
            <IconRotateCw />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(e);
          }}
          className="p-2 border border-slate-850 hover:border-slate-700 bg-slate-900/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Focus Detail"
        >
          <IconSearch className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: InspectionView
// ==========================================

interface InspectionViewProps {
  employee: Employee | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onDownload: (employee: Employee) => void;
  onFeedback: (employee: Employee) => void;
  onEditProfileClick: () => void;
}

const InspectionView: React.FC<InspectionViewProps> = ({
  employee,
  onClose,
  onApprove,
  onAddTag,
  onRemoveTag,
  onDownload,
  onFeedback,
  onEditProfileClick
}) => {
  const [newTagInput, setNewTagInput] = useState('');

  if (!employee) return null;

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim()) {
      onAddTag(employee.id, newTagInput.trim());
      setNewTagInput('');
    }
  };

  const getTagStyle = (tag: string) => {
    const norm = tag.toLowerCase();
    if (norm.includes('coffee')) {
      return {
        classes: 'border-teal-500/40 bg-teal-950/20 text-teal-300 hover:border-teal-400/60',
        icon: IconCoffee,
      };
    } else if (norm.includes('travel') || norm.includes('explore') || norm.includes('wander')) {
      return {
        classes: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400/60',
        icon: IconPlane,
      };
    } else if (norm.includes('vector') || norm.includes('modern') || norm.includes('design')) {
      return {
        classes: 'border-pink-500/40 bg-pink-950/20 text-pink-300 hover:border-pink-400/60',
        icon: IconSparkles,
      };
    } else if (norm.includes('code') || norm.includes('engineer') || norm.includes('artist') || norm.includes('tech')) {
      return {
        classes: 'border-purple-500/40 bg-purple-950/20 text-purple-300 hover:border-purple-400/60',
        icon: IconCode,
      };
    }
    return {
      classes: 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700',
      icon: IconTag,
    };
  };

  const IconCode = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );

  const isReady = employee.status === 'Ready for Review';
  const showOriginal = employee.status === 'Awaiting Stylization' || employee.status === 'Generating';
  const displayPhoto = showOriginal 
    ? employee.photo_url 
    : (employee.caricature_url || employee.photo_url);

  const getPhotoUrl = (url: string) => {
    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  };

  return (
    <div className="w-96 bg-[#090A0F] border-l border-slate-900 flex flex-col h-screen shrink-0 overflow-y-auto select-none relative">
      <div className="flex items-center justify-between p-5 border-b border-slate-900">
        <h2 className="font-extrabold text-base text-slate-100">Inspection View</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors"
        >
          <IconX />
        </button>
      </div>

      <div className="p-5 flex-1 space-y-6 overflow-y-auto">
        <div className="flex justify-end">
          <button
            onClick={onEditProfileClick}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <IconEdit2 className="w-3 h-3 text-neonPink" />
            <span>Update Info</span>
          </button>
        </div>

        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#0F1015] border border-slate-900 relative shadow-inner">
          <img 
            src={getPhotoUrl(displayPhoto)} 
            alt={`${employee.name} expanded`}
            className={`w-full h-full object-cover ${
              employee.status === 'Generating' ? 'blur-md opacity-45' : ''
            }`}
          />
          {employee.status === 'Generating' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center w-12 h-12">
                <div className="absolute inset-0 border-2 border-t-neonPink border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <IconSparkles className="w-5 h-5 text-neonPink animate-pulse-fast" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white truncate max-w-[220px]">{employee.name}</h3>
            <div className="px-2.5 py-0.5 rounded-full border border-pink-500/30 bg-pink-950/10 text-[10px] font-bold text-neonPink shrink-0">
              {employee.anniversary_milestone.replace(' Anniversary', '').replace('st', '').replace('nd', '').replace('rd', '').replace('th', '')} Years
            </div>
          </div>
          <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
            {employee.designation} • {employee.department} (Age {employee.age})
          </span>
        </div>

        <div className="space-y-3 bg-[#11121B] p-4 rounded-xl border border-slate-900 text-xs text-slate-300">
          <div>
            <strong className="text-slate-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Hobbies</strong>
            <p className="leading-relaxed">
              {employee.hobbies.length > 0 ? employee.hobbies.join(', ') : 'None listed'}
            </p>
          </div>
          <div>
            <strong className="text-slate-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Activities</strong>
            <p className="leading-relaxed">
              {employee.activities.length > 0 ? employee.activities.join(', ') : 'None listed'}
            </p>
          </div>
        </div>

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
              <IconPlus />
            </button>
          </form>
        </div>

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
                  <span className="absolute -left-8 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#090A0F]">
                    {isComp ? (
                      <IconCheckCircle2 className="h-4.5 w-4.5 text-emerald-400 fill-[#090A0F]" />
                    ) : isAct ? (
                      <IconClock className="h-4.5 w-4.5 text-neonPink fill-[#090A0F] animate-pulse-fast" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-800"></span>
                    )}
                  </span>
                  
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

      {/* Footer Controls Panel */}
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

        <button
          onClick={() => playAnniversaryWishText(employee)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#00E5FF] hover:bg-[#00CCEE] text-slate-950 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-[0_0_12px_rgba(0,229,255,0.15)]"
        >
          <IconVolume2 className="w-4 h-4 text-slate-950" />
          <span>Play Anniversary Audio Wish</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onDownload(employee)}
            className="flex-1 py-2.5 px-3 bg-[#1D2130]/50 hover:bg-[#1D2130] text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-800/40 transition-colors"
          >
            <IconDownload />
            <span>Download</span>
          </button>
          <button
            onClick={() => onFeedback(employee)}
            className="flex-1 py-2.5 px-3 bg-[#1D2130]/50 hover:bg-[#1D2130] text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-800/40 transition-colors"
          >
            <IconMessageSquare />
            <span>Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: UploadModal
// ==========================================

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (
    name: string,
    gender: string,
    roleTitle: string,
    department: string,
    milestone: string,
    tags: string[],
    age: number,
    hobbies: string[],
    activities: string[],
    photoFile: File | null
  ) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Female');
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState('Product');
  const [milestone, setMilestone] = useState('5th Anniversary');
  const [tagsInput, setTagsInput] = useState('');
  const [age, setAge] = useState(30);
  const [hobbiesInput, setHobbiesInput] = useState('');
  const [activitiesInput, setActivitiesInput] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErrorMsg('Name is required.');
    if (!roleTitle.trim()) return setErrorMsg('Role Title is required.');
    if (!department.trim()) return setErrorMsg('Department is required.');

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

    onRegister(
      name.trim(),
      gender,
      roleTitle.trim(),
      department.trim(),
      milestone,
      tags,
      Number(age),
      hobbies,
      activities,
      photoFile
    );
    
    setName('');
    setGender('Female');
    setRoleTitle('');
    setDepartment('Product');
    setMilestone('5th Anniversary');
    setTagsInput('');
    setAge(30);
    setHobbiesInput('');
    setActivitiesInput('');
    setPhotoFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm select-none p-4 animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[#12131A] border border-slate-800 rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-900">
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <IconUserPlus className="w-5 h-5 text-neonPink" />
            <span>Register Employee Milestone</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="flex items-center space-x-2 bg-red-950/20 border border-red-500/40 text-red-400 p-3 rounded-lg text-xs font-semibold">
              <IconAlertTriangle />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Employee Name</label>
              <input
                type="text"
                placeholder="e.g., Sarah Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-neonPink/50"
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
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Gender Style</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#090A0F] border border-slate-800/80 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 cursor-pointer"
              >
                <option value="Female">Female Style (Jane / Sarah Templates)</option>
                <option value="Male">Male Style (Marcus / Alex Templates)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Department</label>
              <input
                type="text"
                placeholder="e.g., Product"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Persona Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Code Artist, Traveler"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Hobbies (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Coffee Brewing, Travel Photography"
              value={hobbiesInput}
              onChange={(e) => setHobbiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Activities (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Hiking, Cycling"
              value={activitiesInput}
              onChange={(e) => setActivitiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-neonPink/50"
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
            💡 **Tip:** The caricature card will dynamically cartoonize this uploaded portrait image and display all custom tags, hobbies, activities, and role titles.
          </div>

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
              className="px-4 py-2 bg-gradient-to-r from-neonPink to-violet-650 hover:from-neonPink hover:to-violet-750 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-[0.98]"
            >
              Register Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: UpdateEmployeeModal (Localized inline configuration modal)
// ==========================================

interface UpdateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onUpdate: (id: string, updatedFields: {
    name: string;
    gender: string;
    designation: string;
    department: string;
    age: number;
    hobbies: string[];
    activities: string[];
  }) => void;
}

const UpdateEmployeeModal: React.FC<UpdateEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onUpdate,
}) => {
  const [name, setName] = useState(employee.name);
  const [gender, setGender] = useState(employee.gender || 'Female');
  const [designation, setDesignation] = useState(employee.designation);
  const [department, setDepartment] = useState(employee.department);
  const [age, setAge] = useState(employee.age);
  const [hobbiesInput, setHobbiesInput] = useState(employee.hobbies.join(', '));
  const [activitiesInput, setActivitiesInput] = useState(employee.activities.join(', '));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hobbies = hobbiesInput.split(',').map((h) => h.trim()).filter(Boolean);
    const activities = activitiesInput.split(',').map((a) => a.trim()).filter(Boolean);
    onUpdate(employee.id, {
      name: name.trim(),
      gender,
      designation: designation.trim(),
      department: department.trim(),
      age: Number(age),
      hobbies,
      activities
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#12131A] border border-slate-800 rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between p-5 border-b border-slate-900">
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <IconEdit2 className="w-5 h-5 text-[#00FFE0]" />
            <span>Update Employee Info</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors">
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Gender Style</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#090A0F] border border-slate-800/80 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
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
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Hobbies (comma-separated)</label>
            <input
              type="text"
              value={hobbiesInput}
              onChange={(e) => setHobbiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Activities (comma-separated)</label>
            <input
              type="text"
              value={activitiesInput}
              onChange={(e) => setActivitiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[#1D2130]/60 hover:bg-[#1D2130] rounded-lg text-xs font-bold text-slate-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-neonPink to-violet-650 hover:from-neonPink hover:to-violet-750 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-[0.98]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// Main Component: App
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [activeEditEmployee, setActiveEditEmployee] = useState<Employee | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadEmployees = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      } else {
        throw new Error('API server did not respond successfully');
      }
    } catch (err) {
      console.warn('Backend server not responding, using offline fallback schema:', err);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    const hasGenerating = employees.some(emp => emp.status === 'Generating');
    if (!hasGenerating) return;

    const pollInterval = setInterval(() => {
      loadEmployees();
    }, 1500);

    return () => clearInterval(pollInterval);
  }, [employees]);

  const handleGenerateCaricature = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/generate`, {
        method: 'POST',
      });
      if (res.ok) {
        triggerToast("Caricature style transfer pipeline initiated!");
        loadEmployees();
      } else {
        throw new Error('Caricature generation trigger failed.');
      }
    } catch (err) {
      console.error('Failed to trigger generation:', err);
      triggerToast("Error triggering caricature styling.");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        triggerToast("Milestone approved and scheduled successfully!");
        loadEmployees();
      } else {
        throw new Error('Approval request failed');
      }
    } catch (err) {
      console.error('Approval failed:', err);
      triggerToast("Error approving milestone.");
    }
  };

  const handlePhotoUpload = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/upload-photo`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        triggerToast("Professional photo uploaded successfully!");
        loadEmployees();
      } else {
        throw new Error('Photo upload failed.');
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      triggerToast("Error uploading photo.");
    }
  };

  const handleRegisterEmployee = async (
    name: string,
    gender: string,
    roleTitle: string,
    department: string,
    milestone: string,
    tags: string[],
    age: number,
    hobbies: string[],
    activities: string[],
    photoFile: File | null
  ) => {
    try {
      const res = await fetch('http://localhost:8000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, gender, role_title: roleTitle, department, milestone, tags, age, hobbies, activities })
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(`Milestone registered for ${name}!`);
        if (photoFile) {
          await handlePhotoUpload(data.id, photoFile);
        } else {
          loadEmployees();
        }
        setSelectedId(data.id);
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      triggerToast("Error registering milestone.");
    }
  };

  const handleUpdateEmployee = async (id: string, updatedFields: any) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        triggerToast("Profile variables saved. Status reset to Awaiting Stylization!");
        loadEmployees();
      } else {
        throw new Error('Update request failed');
      }
    } catch (err) {
      console.error('Failed to update employee details:', err);
      triggerToast("Error updating employee profile details.");
    }
  };

  const handleAddTag = async (id: string, tag: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag })
      });
      if (res.ok) {
        loadEmployees();
      }
    } catch (err) {
      console.error('Failed to add tag:', err);
    }
  };

  const handleRemoveTag = async (id: string, tag: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/tags/${encodeURIComponent(tag)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadEmployees();
      }
    } catch (err) {
      console.error('Failed to remove tag:', err);
    }
  };

  const handleGenerateReport = () => {
    triggerToast("Generating export payload. Excel spreadsheet downloaded (CSV format ready)!");
    const headers = "Employee Name,Designation,Milestone,Department,Age,Status,Tags,Hobbies,Activities\n";
    const rows = employees.map(e => 
      `"${e.name}","${e.designation}","${e.anniversary_milestone}","${e.department}",${e.age},"${e.status}","${e.tags.join(' | ')}","${e.hobbies.join(' | ')}","${e.activities.join(' | ')}"`
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "anniversary_caricature_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFocusDetails = (_e: React.MouseEvent, id: string) => {
    setSelectedId(id);
    triggerToast("Profile focused in Inspection View.");
  };

  const handleDownloadCaricature = (emp: Employee) => {
    const url = emp.caricature_url || emp.photo_url;
    const downloadUrl = url.startsWith('/static') ? `http://localhost:8000${url}` : url;
    triggerToast(`Downloading digital asset: ${emp.name}_asset.png`);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${emp.name.replace(' ', '_')}_asset.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFeedback = (emp: Employee) => {
    const feedbackMsg = prompt(`Submit design review notes for ${emp.name}'s styling:`, "Refine style transfer caricature details.");
    if (feedbackMsg) {
      triggerToast(`Feedback submitted: "${feedbackMsg}"`);
    }
  };

  const selectedEmployee = employees.find(e => e.id === selectedId) || null;

  const departments = Array.from(new Set(employees.map(e => e.department)));

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const upcomingEmployees = filteredEmployees.filter(emp => emp.status === 'Awaiting Stylization' || emp.status === 'Generating');
  const completedEmployees = filteredEmployees.filter(emp => emp.status === 'Ready for Review' || emp.status === 'Approved');

  const pendingCount = employees.filter(e => e.status === 'Awaiting Stylization' || e.status === 'Generating').length;
  const awaitingCount = employees.filter(e => e.status === 'Ready for Review').length;
  const scheduledCount = employees.filter(e => e.status === 'Approved').length;

  return (
    <div className="flex h-screen w-screen bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-slate-900 border-2 border-neonPink rounded-xl shadow-glow text-xs font-bold text-white flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-neonPink animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Nav panel */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onGenerateReport={handleGenerateReport} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#0D0E15]">
        {activeTab === 'queue' ? (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-8 select-none">
              <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                Anniversary <span className="text-neonPink">Caricature</span> Queue
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
                Manage upcoming employee milestones and generate caricature artwork.
                Wipe out stale caricatures and edit customized variables completely offline.
              </p>
            </div>

            {/* KPI Cards Panel */}
            <KPICards 
              pendingCount={pendingCount} 
              awaitingCount={awaitingCount} 
              scheduledCount={scheduledCount} 
            />

            {/* Search/Filters bar */}
            <FilterBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              deptFilter={deptFilter}
              setDeptFilter={setDeptFilter}
              departments={departments}
              onUploadTrigger={() => setIsRegisterModalOpen(true)}
            />

            {/* Main Lists Section */}
            <div className="space-y-10 pb-12">
              {/* Upcoming work Anniversaries list */}
              <section>
                <h3 className="text-lg font-extrabold text-white mb-5 flex items-center gap-2 select-none border-b border-slate-900 pb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neonPink animate-pulse"></span>
                  <span>Upcoming Work Anniversaries</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md ml-1.5 font-bold">
                    {upcomingEmployees.length} Approaching
                  </span>
                </h3>
                {upcomingEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEmployees.map((emp) => (
                      <AnniversaryCard 
                        key={emp.id}
                        employee={emp}
                        isSelected={selectedId === emp.id}
                        onSelect={() => setSelectedId(emp.id)}
                        onApprove={() => handleApprove(emp.id)}
                        onGenerate={() => handleGenerateCaricature(emp.id)}
                        onUploadPhoto={(file) => handlePhotoUpload(emp.id, file)}
                        onRefresh={(e) => {
                          e.stopPropagation();
                          handleGenerateCaricature(emp.id);
                        }}
                        onEdit={(e) => handleFocusDetails(e, emp.id)}
                        onUpdateClick={() => setActiveEditEmployee(emp)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-900 rounded-2xl select-none">
                    <span className="text-slate-500 font-bold mb-1 text-sm">No Upcoming Anniversaries</span>
                    <span className="text-xs text-slate-650">Register employee milestones or clear active filters</span>
                  </div>
                )}
              </section>

              {/* Completed history list */}
              <section>
                <h3 className="text-lg font-extrabold text-white mb-5 flex items-center gap-2 select-none border-b border-slate-900 pb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]"></span>
                  <span>Completed Caricatures History</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md ml-1.5 font-bold">
                    {completedEmployees.length} Historical
                  </span>
                </h3>
                {completedEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedEmployees.map((emp) => (
                      <AnniversaryCard 
                        key={emp.id}
                        employee={emp}
                        isSelected={selectedId === emp.id}
                        onSelect={() => setSelectedId(emp.id)}
                        onApprove={() => handleApprove(emp.id)}
                        onGenerate={() => handleGenerateCaricature(emp.id)}
                        onUploadPhoto={(file) => handlePhotoUpload(emp.id, file)}
                        onRefresh={(e) => {
                          e.stopPropagation();
                          handleGenerateCaricature(emp.id);
                        }}
                        onEdit={(e) => handleFocusDetails(e, emp.id)}
                        onUpdateClick={() => setActiveEditEmployee(emp)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-900 rounded-2xl select-none">
                    <span className="text-slate-500 font-bold mb-1 text-sm">No Completed Caricatures</span>
                    <span className="text-xs text-slate-650">Complete style transfers above to populate history</span>
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : activeTab === 'employees' ? (
          // ==================== EMPLOYEES DIRECTORY REGISTRY ====================
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-8 select-none">
              <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                Employee <span className="text-neonPink">Directory</span> Registry
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
                View all company employees registered for milestones. Manage profiles, update details, or jump straight to stylization.
              </p>
            </div>
            
            {/* Search/Filters bar */}
            <FilterBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              deptFilter={deptFilter}
              setDeptFilter={setDeptFilter}
              departments={departments}
              onUploadTrigger={() => setIsRegisterModalOpen(true)}
            />

            {/* Table layout of employees */}
            <div className="bg-[#12131A] border border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-[#090A0F]/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                      <th className="py-4 px-6">Employee</th>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6">Milestone</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Age</th>
                      <th className="py-4 px-6">Hobbies & Activities</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-xs text-slate-200">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp) => {
                        const isAwaiting = emp.status === 'Awaiting Stylization';
                        const isGenerating = emp.status === 'Generating';
                        const isReady = emp.status === 'Ready for Review';
                        const isApproved = emp.status === 'Approved';

                        let statusColor = "text-slate-450 border-slate-800 bg-slate-900/50";
                        if (isAwaiting) statusColor = "text-slate-400 border-slate-800 bg-slate-900/40";
                        if (isGenerating) statusColor = "text-neonPink border-neonPink/20 bg-neonPink/5";
                        if (isReady) statusColor = "text-emerald-400 border-emerald-500/20 bg-emerald-950/10";
                        if (isApproved) statusColor = "text-[#00FFE0] border-[#00FFE0]/20 bg-[#00FFE0]/5";

                        const getPhotoUrl = (url: string) => {
                          if (url.startsWith('/static')) {
                            return `http://localhost:8000${url}`;
                          }
                          return url;
                        };

                        return (
                          <tr key={emp.id} className="hover:bg-slate-900/20 transition-colors">
                            <td className="py-3.5 px-6">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={getPhotoUrl(emp.photo_url)} 
                                  alt={emp.name} 
                                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-800 bg-slate-950 shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-slate-100 truncate">{emp.name}</span>
                                  <span className="text-[10px] text-slate-500 font-medium truncate">{emp.designation}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-6 text-slate-300 font-semibold">{emp.department}</td>
                            <td className="py-3.5 px-6">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                                {emp.anniversary_milestone.replace(' Anniversary', '')}
                              </span>
                            </td>
                            <td className="py-3.5 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                                {isGenerating && <span className="w-1.5 h-1.5 rounded-full bg-neonPink animate-ping"></span>}
                                {emp.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 text-slate-400 font-medium">{emp.age}</td>
                            <td className="py-3.5 px-6 max-w-xs">
                              <div className="flex flex-col gap-0.5 truncate text-[10px] text-slate-450">
                                <span className="truncate"><strong>Hobbies:</strong> {emp.hobbies.length > 0 ? emp.hobbies.join(', ') : 'None'}</span>
                                <span className="truncate"><strong>Activities:</strong> {emp.activities.length > 0 ? emp.activities.join(', ') : 'None'}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => playAnniversaryWishText(emp)}
                                  className="p-1.5 border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 bg-slate-900/40 rounded-lg text-[#00E5FF] hover:text-white transition-colors"
                                  title="Play Voice Wish"
                                >
                                  <IconVolume2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setActiveEditEmployee(emp)}
                                  className="p-1.5 border border-slate-850 hover:border-slate-700 bg-slate-900/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                                  title="Update Info"
                                >
                                  <IconEdit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedId(emp.id);
                                    setActiveTab('queue');
                                    triggerToast(`Viewing details for ${emp.name}`);
                                  }}
                                  className="p-1.5 border border-neonPink/20 hover:border-neonPink/50 bg-slate-900/40 rounded-lg text-neonPink hover:text-white transition-colors"
                                  title="Focus in Queue"
                                >
                                  <IconSearch className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 select-none font-bold">
                          No employees matching the search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center select-none text-slate-500">
            <h2 className="text-lg font-bold capitalize mb-1">{activeTab} Section</h2>
            <p className="text-xs text-slate-660">This module is active under the administrator dashboard scope.</p>
          </div>
        )}
      </main>

      {/* Right Drawer Inspection Panel */}
      {activeTab === 'queue' && selectedEmployee && (
        <InspectionView 
          employee={selectedEmployee}
          onClose={() => setSelectedId(null)}
          onApprove={handleApprove}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onDownload={handleDownloadCaricature}
          onFeedback={handleFeedback}
          onEditProfileClick={() => setActiveEditEmployee(selectedEmployee)}
        />
      )}

      {/* Register Milestone Modal */}
      <UploadModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterEmployee}
      />

      {/* Localized Inline Edit Modal */}
      {activeEditEmployee && (
        <UpdateEmployeeModal
          isOpen={!!activeEditEmployee}
          onClose={() => setActiveEditEmployee(null)}
          employee={activeEditEmployee}
          onUpdate={handleUpdateEmployee}
        />
      )}
    </div>
  );
}
