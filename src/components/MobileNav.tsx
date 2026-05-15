import { motion } from 'motion/react';
import { 
  Home, 
  MessageSquare, 
  LayoutGrid, 
  FolderRoot, 
  User 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AppView } from '../lib/constants';

interface MobileNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export default function MobileNav({ currentView, setView }: MobileNavProps) {
  const tabs = [
    { id: AppView.HOME, icon: Home, label: 'Home' },
    { id: AppView.CHAT, icon: MessageSquare, label: 'Chat' },
    { id: AppView.TOOLS, icon: LayoutGrid, label: 'Workspace' },
    { id: AppView.WORKSPACE, icon: FolderRoot, label: 'Files' },
    { id: AppView.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="lg:hidden h-16 bg-indus-black/80 backdrop-blur-2xl border-t border-indus-white/10 flex items-center justify-around px-4 pb-safe relative z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className="flex flex-col items-center justify-center p-2 relative group"
        >
          {currentView === tab.id && (
            <motion.div
              layoutId="mobile-active-bg"
              className="absolute inset-0 bg-indus-cyan/10 rounded-xl -z-10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {(() => {
            const Icon = tab.icon;
            return (
              <Icon className={cn(
                "w-5 h-5 mb-1 transition-all duration-300",
                currentView === tab.id ? "text-indus-cyan" : "text-indus-white/40"
              )} />
            );
          })()}
          <span className={cn(
            "text-[10px] uppercase font-bold tracking-tighter transition-all duration-300",
            currentView === tab.id ? "text-indus-cyan opacity-100" : "text-indus-white/40 opacity-0 group-hover:opacity-100"
          )}>
            {tab.label}
          </span>
          
          {currentView === tab.id && (
            <motion.div 
              layoutId="mobile-active-dot" 
              className="absolute -top-1 w-1 h-1 bg-indus-cyan rounded-full shadow-[0_0_5px_#00E5FF]" 
            />
          )}
        </button>
      ))}
    </nav>
  );
}
