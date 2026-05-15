import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AIOrbProps {
  size?: number;
  className?: string;
  active?: boolean;
}

export default function AIOrb({ size = 200, className, active = true }: AIOrbProps) {
  return (
    <div 
      className={cn("relative flex items-center justify-center", className)} 
      style={{ width: size, height: size }}
    >
      {/* Outer Glo rings */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-[-20%] border border-indus-cyan/20 rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        className="absolute inset-[-40%] border border-white/5 rounded-full"
      />

      {/* Primary Orb Body */}
      <motion.div
        animate={{
          rotate: active ? 360 : 0,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-b from-indus-cyan to-indus-blue blur-[2px] shadow-[0_0_80px_rgba(6,182,212,0.4)] flex items-center justify-center"
      >
        <div className="w-[80%] h-[80%] bg-black/90 backdrop-blur-3xl rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
          {/* Internal Plasma Effect */}
          <motion.div
            animate={{
              scale: active ? [1, 1.2, 0.9, 1.1] : 1,
              opacity: active ? [0.6, 0.9, 0.7] : 0.5,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-radial from-indus-cyan/30 via-transparent to-transparent"
          />
        </div>
      </motion.div>

      {/* Floating Particles/Highlights */}
      <AnimatePresence>
        {active && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.5, 0],
                  x: [0, (i - 1) * 40, (i - 1) * 60],
                  y: [0, -40, -80]
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 bg-indus-cyan rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Core Energy Center */}
      <motion.div
        animate={{
          scale: active ? [1, 1.05, 1] : 1,
          boxShadow: active 
            ? ["0 0 20px rgba(0,229,255,0.4)", "0 0 40px rgba(0,229,255,0.6)", "0 0 20px rgba(0,229,255,0.4)"]
            : "0 0 20px rgba(0,229,255,0.2)"
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-[15%] h-[15%] rounded-full bg-white z-10 blur-[4px] shadow-[0_0_20px_#fff]"
      />
    </div>
  );
}

