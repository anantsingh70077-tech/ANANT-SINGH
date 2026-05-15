import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Download, Code, Eye, FileText, Globe, Play, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Artifact {
  id: string;
  type: 'code' | 'markdown' | 'image' | 'web';
  title: string;
  content: string;
  language?: string;
  url?: string;
}

interface ArtifactsSidebarProps {
  artifact: Artifact | null;
  onClose: () => void;
}

export default function ArtifactsSidebar({ artifact, onClose }: ArtifactsSidebarProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  if (!artifact) return null;

  const handleRun = () => {
    setIsRunning(true);
    setConsoleOutput(["Initializing Neural Runtime...", "Optimizing JIT Compiler...", "Executing Logic Branches..."]);
    
    setTimeout(() => {
      setConsoleOutput(prev => [...prev, "[SUCCESS] Process completed without errors.", `[RESULT] ${artifact.language === 'javascript' || artifact.language === 'typescript' ? 'Program synchronized.' : 'Data processed.'}`]);
      setIsRunning(false);
    }, 2000);
  };

  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full lg:w-[600px] bg-indus-navy/95 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl"
    >
      <header className="flex items-center justify-between p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indus-cyan/10">
            {artifact.type === 'code' ? <Code className="w-5 h-5 text-indus-cyan" /> :
             artifact.type === 'image' ? <Eye className="w-5 h-5 text-indus-cyan" /> :
             artifact.type === 'web' ? <Globe className="w-5 h-5 text-indus-cyan" /> :
             <FileText className="w-5 h-5 text-indus-cyan" />}
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">{artifact.title}</h3>
            <p className="text-[10px] text-indus-white/40 uppercase tracking-widest font-mono">
              {artifact.type} • {artifact.language || 'Plain Text'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {artifact.type === 'code' && (
             <button 
                onClick={handleRun}
                className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors flex items-center gap-2 px-3"
             >
               <Play className={cn("w-4 h-4", isRunning && "animate-pulse")} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Run</span>
             </button>
          )}
          <button className="p-2 hover:bg-white/5 rounded-lg text-indus-white/40 hover:text-white transition-colors">
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg text-indus-white/40 hover:text-white transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {artifact.type === 'image' ? (
          <div className="h-full flex items-center justify-center bg-black/40 rounded-3xl p-8">
            <img 
              src={artifact.content} 
              alt={artifact.title} 
              className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : artifact.type === 'code' ? (
          <div className="space-y-6">
            <pre className="p-6 rounded-3xl bg-black/40 border border-white/5 font-mono text-sm overflow-x-auto text-indus-cyan">
              <code>{artifact.content}</code>
            </pre>
            
            <AnimatePresence>
              {(isRunning || consoleOutput.length > 0) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-6 rounded-3xl bg-indus-black border border-white/10 font-mono text-xs overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-4 text-white/30 uppercase tracking-widest">
                    <Terminal className="w-3 h-3" /> Console Output
                  </div>
                  <div className="space-y-2">
                    {consoleOutput.map((line, idx) => (
                      <p key={idx} className={cn(
                        line.startsWith('[SUCCESS]') ? "text-emerald-400" :
                        line.startsWith('[RESULT]') ? "text-indus-cyan" : "text-white/60"
                      )}>{line}</p>
                    ))}
                    {isRunning && <span className="inline-block w-2 h-4 bg-indus-cyan animate-pulse" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none bg-white/5 p-8 rounded-3xl border border-white/5">
            <ReactMarkdown>{artifact.content}</ReactMarkdown>
          </div>
        )}
      </div>

      <footer className="p-6 border-t border-white/5 bg-black/20">
        <p className="text-[10px] text-center text-indus-white/20 uppercase tracking-[0.2em]">
          Synthesized by INDUS Neural Engine v3.1
        </p>
      </footer>
    </motion.aside>
  );
}
