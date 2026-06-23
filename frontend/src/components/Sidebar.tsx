import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Users, 
  Paintbrush, 
  Settings, 
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onGenerateReport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onGenerateReport }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', name: 'Anniversary Queue', icon: Clock },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'templates', name: 'Templates', icon: Paintbrush },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#090A0F] border-r border-slate-900 flex flex-col h-screen shrink-0 justify-between select-none">
      <div>
        {/* Logo Section */}
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

        {/* Navigation Items */}
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
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-4 space-y-4">
        {/* Generate Reports Button */}
        <button 
          onClick={onGenerateReport}
          className="w-full py-3 px-4 rounded-xl bg-[#00FFE0] hover:bg-[#00E5CC] text-slate-950 text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.98] shadow-[0_0_12px_rgba(0,255,224,0.15)]"
        >
          <FileText className="w-4.5 h-4.5 stroke-[2.5]" />
          <span>Generate Reports</span>
        </button>

        {/* Admin profile footer */}
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
