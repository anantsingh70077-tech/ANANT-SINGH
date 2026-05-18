/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  MessageSquare, 
  FolderRoot, 
  LayoutGrid, 
  User, 
  Settings, 
  Search,
  PlusCircle,
  Menu,
  X,
  Crown
} from 'lucide-react';
import { cn } from './lib/utils';
import { AppView, APP_NAME } from './lib/constants';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Workspace from './components/Workspace';
import Membership from './components/Membership';
import Profile from './components/Profile';
import AuthView from './components/Auth';
import NeuralLab from './components/NeuralLab';
import WebBuilder from './components/WebBuilder';
import NeuralStatusBar from './components/NeuralStatusBar';
import IndusLogo from './components/IndusLogo';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [view, setView] = useState<AppView>(AppView.SPLASH);
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Initial splash delay handle
    if (authChecked) {
      if (view === AppView.SPLASH) {
        const timer = setTimeout(() => {
          setView(user ? AppView.HOME : AppView.AUTH);
        }, 2000); // reduced splash delay
        return () => clearTimeout(timer);
      } else {
        if (!user && view !== AppView.AUTH) {
          setView(AppView.AUTH);
        } else if (user && view === AppView.AUTH) {
          setView(AppView.HOME);
        }
      }
    }
  }, [authChecked, user, view]);

  const renderContent = () => {
    switch (view) {
      case AppView.HOME:
        return <Dashboard setView={setView} setInitialPrompt={setInitialPrompt} />;
      case AppView.CHAT:
        return <Chat initialPrompt={initialPrompt} setInitialPrompt={setInitialPrompt} />;
      case AppView.WORKSPACE:
      case AppView.TOOLS:
        return <Workspace />;
      case AppView.MEMBERSHIP:
        return <Membership />;
      case AppView.PROFILE:
        return <Profile />;
      case AppView.NEURAL_LAB:
        return <NeuralLab />;
      case AppView.WEB_BUILDER:
        return <WebBuilder />;
      case AppView.ADMIN:
        return <AdminDashboard />;
      default:
        return <Dashboard setView={setView} setInitialPrompt={setInitialPrompt} />;
    }
  };

  if (view === AppView.SPLASH) {
    return <SplashScreen />;
  }

  if (view === AppView.AUTH) {
    return <AuthView />;
  }

  return (
    <div className="flex flex-col h-screen bg-indus-black overflow-hidden font-sans text-indus-white selection:bg-indus-cyan/30">
      <NeuralStatusBar />
      {/* Background Cinematic Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indus-cyan/10 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indus-purple/10 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute top-[20%] right-[30%] w-[30%] h-[30%] bg-indus-blue/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        
        {/* Orbital Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/[0.01] rounded-full" />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar currentView={view} setView={setView} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-indus-navy/95 backdrop-blur-2xl z-50 lg:hidden border-r border-indus-white/10"
            >
              <Sidebar currentView={view} setView={setView} setIsSidebarOpen={setIsSidebarOpen} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 shrink-0 px-10 items-center justify-between border-b border-white/5 bg-indus-navy/20 backdrop-blur-xl relative z-20">
          <div className="flex items-center gap-12">
            <IndusLogo size={32} withText className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer group" onClick={() => setView(AppView.HOME)} />
            
            <nav className="flex gap-10 text-xs font-bold uppercase tracking-[0.2em] text-indus-white/40">
              {[
                { id: AppView.HOME, label: 'Omni-Core' },
                { id: AppView.WORKSPACE, label: 'Artifacts' },
                { id: AppView.CHAT, label: 'Neural Link' },
                { id: AppView.WEB_BUILDER, label: 'Architect' },
                { id: AppView.NEURAL_LAB, label: 'Think Tank' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={cn(
                    "transition-all hover:text-white relative py-1", 
                    (view === item.id || (item.id === AppView.WORKSPACE && view === AppView.TOOLS)) ? "text-white" : ""
                  )}
                >
                  {item.label}
                  {(view === item.id || (item.id === AppView.WORKSPACE && view === AppView.TOOLS)) && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-indus-cyan glow-cyan" 
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Crown className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Quantum Class</span>
                <span className="text-[10px] text-white/40">Unlimited Reasoning</span>
              </div>
            </div>
            
            <button 
              onClick={() => setView(AppView.PROFILE)}
              className="w-10 h-10 rounded-2xl border border-white/10 overflow-hidden hover:border-indus-cyan/40 transition-colors group p-0.5 bg-white/5"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
              ) : (
                <div className="w-full h-full bg-indus-navy flex items-center justify-center rounded-[14px]">
                  <User className="w-5 h-5 text-indus-white/40" />
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Top Header (Mobile Only) */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-indus-white/10 bg-indus-navy/60 backdrop-blur-xl relative z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-indus-white/5 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-indus-white" />
          </button>
          <div className="flex items-center gap-2" onClick={() => setView(AppView.HOME)}>
            <IndusLogo size={24} withText />
          </div>
          <button onClick={() => setView(AppView.PROFILE)} className="w-8 h-8 rounded-full border border-white/10 overflow-hidden">
            {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <User className="w-4 h-4 m-2" />}
          </button>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Navigation */}
        <MobileNav currentView={view} setView={setView} />
      </main>
    </div>
  );
}
