import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface IndusLogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
  onClick?: () => void;
}

export default function IndusLogo({ size = 40, className, withText = false, onClick }: IndusLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} onClick={onClick}>
      <motion.div 
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center"
      >
        {/* Geometric Outer Frame */}
        <div className="absolute inset-0 bg-gradient-to-br from-indus-cyan via-indus-blue to-indus-purple rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] rotate-45" />
        <div className="absolute inset-0 border border-white/20 rounded-2xl rotate-12 animate-pulse-slow" />
        
        {/* Inner Core */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-[70%] h-[70%] bg-black rounded-xl flex items-center justify-center border border-white/10 overflow-hidden"
        >
          {/* Animated Background Scan */}
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-full h-[10%] bg-gradient-to-b from-transparent via-indus-cyan/40 to-transparent group-hover:via-indus-cyan/60"
          />
          
          <div className="w-[15%] h-[50%] bg-white rounded-full shadow-[0_0_15px_#fff] relative z-10" />
        </motion.div>

        {/* Orbiting Quantum Particles */}
        {[0, 120, 240].map((rot) => (
          <motion.div 
            key={rot}
            animate={{ rotate: 360 + rot }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-8px]"
          >
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]" 
              style={{ transformOrigin: `50% ${size/2 + 8}px` }}
            />
          </motion.div>
        ))}
      </motion.div>

      {withText && (
        <span className="font-display font-black text-3xl tracking-tighter text-white">INDUS</span>
      )}
    </div>
  );
}
