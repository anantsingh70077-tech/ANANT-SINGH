import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Briefcase, 
  FolderRoot, 
  User, 
  Settings,
  Crown,
  ChevronRight,
  LogOut,
  Sparkles,
  Video
} from 'lucide-react';
import { cn } from '../lib/utils';
import { APP_NAME, AppView, FOUNDER, CO_FOUNDER } from '../lib/constants';

import IndusLogo from './IndusLogo';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  setIsSidebarOpen?: (open: boolean) => void;
}

export default function Sidebar({ currentView, setView, setIsSidebarOpen }: SidebarProps) {
  const menuItems = [
    { id: AppView.HOME, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.CHAT, label: 'Chat History', icon: MessageSquare },
    { id: AppView.TOOLS, label: 'AI Workspace', icon: Briefcase },
    { id: AppView.WORKSPACE, label: 'Saved Files', icon: FolderRoot },
  ];

  const handleNav = (id: AppView) => {
    setView(id);
    if (setIsSidebarOpen) setIsSidebarOpen(false);
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 h-full bg-[#1E293B]/40 backdrop-blur-3xl border-r border-white/5 p-6 z-20">
      {/* Brand */}
      <div className="mb-10 px-2 cursor-pointer" onClick={() => handleNav(AppView.HOME)}>
        <IndusLogo size={42} withText />
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-indus-slate-500 mb-4 ml-2">Intelligence Modes</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              currentView === item.id 
                ? "bg-white/5 text-indus-cyan border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                : "text-indus-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            {currentView === item.id && (
              <div className="w-1.5 h-1.5 bg-indus-cyan rounded-full shadow-[0_0_8px_#06b6d4]" />
            )}
            {currentView !== item.id && (() => {
              const Icon = item.icon;
              return <Icon className="w-4 h-4 text-indus-slate-600 group-hover:text-indus-slate-400 transition-colors" />;
            })()}
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}

        <div className="pt-8 space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-indus-slate-500 mb-4 ml-2">Recent Activity</p>
          <div className="text-xs text-indus-slate-500 italic ml-2 px-3 py-1 border-l border-white/10">
            Analyze Q3 PDF Market...
          </div>
          <div className="text-xs text-indus-slate-500 italic ml-2 px-3 py-1 border-l border-white/10">
            Neural Optimization Loop...
          </div>
        </div>
      </nav>

      {/* Membership Card */}
      <div className="mt-auto mb-8">
        <button 
          onClick={() => handleNav(AppView.MEMBERSHIP)}
          className="w-full text-left bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-indus-cyan/30 p-5 rounded-2xl group overflow-hidden relative transition-all"
        >
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-indus-cyan tracking-wider uppercase mb-1">Standard Plan</p>
            <p className="text-base font-semibold leading-tight text-white">Active: Free for 1 Year</p>
            <div className="mt-3 text-[10px] text-cyan-200/40">Early adopter benefits enabled.</div>
          </div>
          {/* Animated Background Glow */}
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indus-cyan/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
        </button>
      </div>

      {/* Bottom Footer */}
      <div className="space-y-4 border-t border-indus-white/10 pt-6">
        <button 
          onClick={() => handleNav(AppView.PROFILE)}
          className="w-full flex items-center gap-3 px-4 py-2 text-indus-white/50 hover:text-indus-white transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Profile</span>
        </button>
        <button 
          onClick={() => handleNav(AppView.SETTINGS)}
          className="w-full flex items-center gap-3 px-4 py-2 text-indus-white/50 hover:text-indus-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </button>

        {/* Founder Info */}
        <div className="px-4 py-4 bg-indus-black/40 rounded-xl border border-indus-white/5">
          <p className="text-[10px] text-indus-white/30 uppercase tracking-widest mb-2 font-mono">Founders</p>
          <p className="text-[11px] font-medium text-indus-white/70">{FOUNDER}</p>
          <p className="text-[11px] font-medium text-indus-white/70">{CO_FOUNDER}</p>
        </div>
      </div>
    </aside>
  );
}
