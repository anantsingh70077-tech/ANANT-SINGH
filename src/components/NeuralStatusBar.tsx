import { motion } from 'motion/react';
import { Activity, Globe, Zap, Cpu, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NeuralStatusBar() {
  const [stats, setStats] = useState({
    latency: '0.8ms',
    throughput: '12.4 GB/s',
    activeNodes: '4,102',
    marketIndex: '+1.24%'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        latency: `${(Math.random() * 0.5 + 0.5).toFixed(1)}ms`,
        throughput: `${(Math.random() * 5 + 10).toFixed(1)} GB/s`,
        activeNodes: (4000 + Math.floor(Math.random() * 200)).toLocaleString(),
        marketIndex: `${(Math.random() * 2 - 0.5).toFixed(2)}%`
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 bg-indus-black/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">Neural Link: Stable</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-indus-cyan opacity-40" />
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest whitespace-nowrap">Latency: <span className="text-indus-cyan">{stats.latency}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-indus-purple opacity-40" />
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest whitespace-nowrap">Load: <span className="text-indus-purple">{stats.throughput}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-rose-400 opacity-40" />
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest whitespace-nowrap">Nodes: <span className="text-rose-400">{stats.activeNodes}</span></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 overflow-hidden">
        <motion.div 
          animate={{ x: [0, -100] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap"
        >
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-white/20 uppercase">NIFTY 50:</span>
            <span className="text-[9px] font-mono text-emerald-400">22,147.50 (+0.82%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-white/20 uppercase">SENSEX:</span>
            <span className="text-[9px] font-mono text-emerald-400">72,900.12 (+0.65%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-white/20 uppercase">NASDAQ:</span>
            <span className="text-[9px] font-mono text-rose-400">16,128.50 (-0.21%)</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
