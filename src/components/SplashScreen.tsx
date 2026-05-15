import { motion } from 'motion/react';
import { APP_NAME } from '../lib/constants';
import AIOrb from './AIOrb';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-indus-black flex flex-col items-center justify-center z-[100] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-indus-cyan/5 via-transparent to-transparent opacity-50" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative"
      >
        <AIOrb size={240} className="mb-12" />
      </motion.div>

      <div className="relative">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-7xl font-display font-bold tracking-tighter text-glow-cyan"
        >
          {APP_NAME}
        </motion.h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.8, duration: 1.2, ease: "easeInOut" }}
          className="h-[1px] bg-gradient-to-r from-transparent via-indus-cyan to-transparent mt-4"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="text-center mt-6 uppercase tracking-[0.3em] text-xs font-mono"
        >
          Initializing Ecosystem...
        </motion.p>
      </div>

      {/* Cinematic Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              opacity: [0, 0.4, 0],
              y: [null, '-=100']
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-[1px] h-[1px] bg-indus-white"
          />
        ))}
      </div>
    </div>
  );
}
