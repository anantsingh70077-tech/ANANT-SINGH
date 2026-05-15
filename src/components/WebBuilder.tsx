import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Box, 
  Layout, 
  Code, 
  Eye, 
  Download, 
  Sparkles, 
  Zap, 
  Monitor, 
  Smartphone, 
  Tablet,
  ChevronRight,
  RefreshCw,
  Share2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

export default function WebBuilder() {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedSite, setGeneratedSite] = useState<boolean>(false);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const steps = [
    "Analyzing visual hierarchy...",
    "Synthesizing layout components...",
    "Injecting neural styling...",
    "Optimizing asset delivery...",
    "Assembling 3D scene graphs...",
    "Finalizing deployment hook..."
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedSite(false);
    setGeneratedHtml('');
    
    // Animate through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(s => (s + 1) % steps.length);
    }, 800);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: `You are a world-class UI/UX designer. Generate a fully-functional but highly concise single-file HTML website with inline CSS (Tailwind CDN) and JS for this request: ${prompt}. Mode requested: ${mode}. Output ONLY the raw HTML code without markdown blocks. Prioritize speed and brevity. Return only the valid HTML.`
      });

      setGeneratedSite(true);
      let html = '';

      for await (const chunk of responseStream) {
        if (!chunk.text) continue;
        html += chunk.text;
        
        let cleanedHtml = html;
        if (cleanedHtml.includes('```html')) {
          cleanedHtml = cleanedHtml.split('```html')[1] || '';
          if (cleanedHtml.includes('```')) {
            cleanedHtml = cleanedHtml.split('```')[0].trim();
          }
        } else if (cleanedHtml.includes('```')) {
          cleanedHtml = cleanedHtml.split('```')[1] || '';
          if (cleanedHtml.includes('```')) {
            cleanedHtml = cleanedHtml.split('```')[0].trim();
          }
        }
        
        setGeneratedHtml(cleanedHtml || html);
      }
    } catch (error) {
      console.error("Web Generation Error:", error);
      alert("Error synthesizing site. Please check neural core connections.");
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-indus-black relative overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-indus-black to-transparent z-20" />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Panel */}
        <aside className="w-80 border-r border-white/5 bg-indus-navy/20 p-6 flex flex-col gap-8 z-30">
          <div>
            <h2 className="text-xl font-display font-black tracking-tight mb-1">ARCHITECT</h2>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Neural Web Synthesis</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Canvas Dimension</label>
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setMode('2d')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest",
                    mode === '2d' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                  )}
                >
                  <Layout className="w-3 h-3" /> 2D Web
                </button>
                <button 
                  onClick={() => setMode('3d')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest",
                    mode === '3d' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                  )}
                >
                  <Box className="w-3 h-3" /> 3D Space
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Directive</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website aesthetic and functionality..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-white/20 min-h-[120px] focus:border-indus-cyan/40 outline-none transition-all no-scrollbar"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-indus-cyan text-black rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale glow-cyan"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'Synthesizing...' : 'Generate Site'}
            </button>
          </div>

          <div className="mt-auto">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indus-blue/10 to-indus-purple/10 border border-white/10">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                <Zap className="w-3 h-3 text-emerald-400" /> Quantum Deploy
              </h4>
              <p className="text-[10px] text-white/40 leading-relaxed">Generated sites are hosted on the INDUS Global Edge network with instant propagation.</p>
            </div>
          </div>
        </aside>

        {/* Main Stage */}
        <main className="flex-1 flex flex-col relative bg-black/40 overflow-hidden">
          {/* Top Preview Bar */}
          <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-indus-navy/40 backdrop-blur-md">
            <div className="flex gap-1">
              {[
                { id: 'desktop', icon: Monitor },
                { id: 'tablet', icon: Tablet },
                { id: 'mobile', icon: Smartphone }
              ].map((d) => (
                <button 
                  key={d.id}
                  onClick={() => setDevice(d.id as any)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    device === d.id ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"
                  )}
                >
                  <d.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (generatedHtml) {
                    const blob = new Blob([generatedHtml], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                  } else {
                    alert('Please generate a site first.');
                  }
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
                <Code className="w-3 h-3" /> View Source
              </button>
              <button 
                onClick={() => {
                  if (generatedSite) {
                    alert('Artifact deployed to INDUS Edge Network! (Simulation)');
                  } else {
                    alert('Please generate a site first.');
                  }
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                <Share2 className="w-3 h-3" /> Publish
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-12 flex justify-center items-center relative">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="generating"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center gap-6 text-center max-w-sm"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-indus-cyan/20 border-t-indus-cyan animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indus-cyan animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold mb-2 tracking-tight">Synthesizing Digital Matter</h3>
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-indus-cyan animate-pulse">{steps[currentStep]}</p>
                  </div>
                </motion.div>
              ) : generatedSite ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-700 relative",
                    device === 'desktop' ? "w-full h-[80vh] min-h-[500px]" : 
                    device === 'tablet' ? "w-[600px] aspect-[3/4]" : "w-[320px] aspect-[9/19]"
                  )}
                >
                  {/* Real Generated Site iframe */}
                  <iframe 
                    srcDoc={generatedHtml} 
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-scripts allow-forms allow-same-origin"
                  />
                  
                  {/* Mobile Device Bezels overlay */}
                  {device !== 'desktop' && (
                    <div className="absolute inset-0 border-[12px] border-black rounded-2xl pointer-events-none z-10" />
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-6 opacity-20 hover:opacity-40 transition-opacity"
                >
                   <Globe className="w-24 h-24 mx-auto text-white" />
                   <h2 className="text-2xl font-display font-bold tracking-tight">Awaiting Neural Template</h2>
                   <p className="text-xs max-w-xs mx-auto">Provide instructions in the architect panel to generate a high-fidelity web experience.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
    </div>
  );
}
