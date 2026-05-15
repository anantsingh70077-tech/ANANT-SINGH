import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  Search, 
  Mic, 
  Sparkles, 
  FileText, 
  Code, 
  BarChart3,
  Bot,
  Zap,
  Briefcase,
  Video,
  ChevronRight,
  Crown,
  Globe,
  Layout
} from 'lucide-react';
import { cn } from '../lib/utils';
import { APP_NAME, QUICK_PROMPTS, AppView, AI_MODES } from '../lib/constants';
import { auth } from '../lib/firebase';
import IndusLogo from './IndusLogo';

interface DashboardProps {
  setView: (view: AppView) => void;
  setInitialPrompt: (prompt: string) => void;
}

export default function Dashboard({ setView, setInitialPrompt }: DashboardProps) {
  const [inputValue, setInputValue] = useState('');

  const handleExecute = () => {
    if (inputValue.trim()) {
      setInitialPrompt(inputValue);
      setView(AppView.CHAT);
    } else {
      setView(AppView.CHAT);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center">
      {/* Central Intelligence Core */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative mb-20 group"
      >
        <div className="absolute -inset-24 bg-indus-cyan/5 blur-[100px] rounded-full group-hover:bg-indus-cyan/10 transition-all duration-1000" />
        <div className="absolute -inset-1 border border-white/5 rounded-full scale-110 animate-pulse-slow" />
        <IndusLogo size={160} className="z-10" />
        
        {/* Orbital Data Rings */}
        <div className="absolute inset-0 z-0">
          {[0, 120, 240].map((rot) => (
            <motion.div
              key={rot}
              animate={{ rotate: 360 }}
              transition={{ duration: 20 + rot/10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-40px] border border-white/5 rounded-full"
              style={{ rotate: rot }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indus-cyan/20 rounded-full" />
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-6xl lg:text-8xl font-display font-black text-center mb-6 tracking-tighter"
      >
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indus-cyan via-white to-indus-purple">INDUS</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-indus-slate-400 text-lg lg:text-xl text-center max-w-2xl mb-16 font-light leading-relaxed"
      >
        The world's most advanced neural ecosystem. 
        Transcend limits with {APP_NAME}'s Sovereign Intelligence.
      </motion.p>

      {/* Quantum Command Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-3xl relative mb-24 group"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-indus-cyan/10 to-indus-purple/10 blur-2xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 flex items-center shadow-2xl">
          <div className="p-4 bg-indus-cyan/10 rounded-full ml-2">
            <Sparkles className="w-6 h-6 text-indus-cyan" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Execute directive (e.g. 'Synthesize market report', 'Debug neural node')..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-xl font-display text-indus-white placeholder-indus-white/20 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
          />
          <button 
            onClick={handleExecute}
            className="mr-2 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Execute
          </button>
        </div>
      </motion.div>

      {/* Proactive Neural Modules (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-20">
        <div className="md:col-span-2 glass-card p-8 group hover:bg-white/5 border-indus-cyan/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-32 h-32 text-indus-cyan" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-display font-bold mb-2">Neural Velocity</h3>
            <p className="text-indus-slate-400 text-sm mb-6 max-w-xs">AI processing speed is currently at 12,000 TPS. Your workspace is optimized for real-time synthesis.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setView(AppView.CHAT)}
                className="px-6 py-2 bg-indus-cyan/10 border border-indus-cyan/30 text-indus-cyan text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-indus-cyan hover:text-black transition-all"
              >
                Launch Kernel
              </button>
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 uppercase">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> High Fidelity
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 group hover:bg-white/5 border-white/5 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-indus-cyan/10 flex items-center justify-center p-4">
            <Zap className="w-full h-full text-indus-cyan" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold">Think Tank</h4>
            <p className="text-[10px] text-indus-white/40 uppercase tracking-widest mt-1">3D Neural Stage</p>
          </div>
          <button 
            onClick={() => setView(AppView.NEURAL_LAB)}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            Launch Lab
          </button>
        </div>

        <div className="glass-card p-8 group hover:bg-white/5 border-white/5 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-indus-purple/10 flex items-center justify-center p-4">
            <Layout className="w-full h-full text-indus-purple" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold">Architect</h4>
            <p className="text-[10px] text-indus-white/40 uppercase tracking-widest mt-1">2D/3D Web Builder</p>
          </div>
          <button 
            onClick={() => setView(AppView.WEB_BUILDER)}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            Design Site
          </button>
        </div>

        <div className="glass-card p-8 group hover:bg-white/5 border-white/5 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-indus-purple/10 flex items-center justify-center p-4">
            <Briefcase className="w-full h-full text-indus-purple" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold">Workspace</h4>
            <p className="text-[10px] text-indus-white/40 uppercase tracking-widest mt-1">Sovereign Artifacts</p>
          </div>
          <button 
            onClick={() => setView(AppView.WORKSPACE)}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Futuristic News/Feed simulated */}
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8 px-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indus-white/40">Global Intelligence Feed</h3>
          <div className="h-px flex-1 mx-8 bg-white/5" />
          <button className="text-[10px] font-bold uppercase tracking-widest text-indus-cyan hover:glow-cyan transition-all">Clear Nodes</button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-4">
          {[
            { tag: 'TECH', title: 'Silicon Valley AI cluster reports 40% efficiency boost with INDUS nodes.', color: 'text-indus-cyan' },
            { tag: 'INDIA', title: 'Bangalore Tech Summit features INDUS Sovereign Intelligence as key infrastructure.', color: 'text-emerald-400' },
            { tag: 'FINANCE', title: 'NIFTY 50 surges as tech giants adopt decentralized neural processing.', color: 'text-amber-400' },
            { tag: 'RESEARCH', title: 'New paper published on "Latent Space Compression" by INDUS Core Team.', color: 'text-indus-purple' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/[0.08] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className={cn("text-[9px] font-mono tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/5", item.color)}>{item.tag}</span>
                <p className="text-xs text-indus-white/60 group-hover:text-indus-white transition-colors">{item.title}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-indus-white/20 group-hover:text-indus-cyan transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
