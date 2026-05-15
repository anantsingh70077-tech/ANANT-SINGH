import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, Sparkles, Chrome, ChevronRight } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';
import { APP_NAME } from '../lib/constants';
import AIOrb from './AIOrb';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Synchronous connection failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indus-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-indus-cyan/10 via-transparent to-transparent opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <AIOrb size={120} className="mb-6" />
          <h1 className="text-4xl font-display font-bold tracking-tighter text-glow-cyan mb-2">{APP_NAME}</h1>
          <p className="text-indus-white/40 uppercase tracking-[0.3em] text-[10px] font-mono">Quantum Intelligence Protocol</p>
        </div>

        <div className="glass-card p-8 lg:p-10 border-indus-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indus-cyan/5 to-indus-purple/5 pointer-events-none" />
          
          <div className="relative space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold">Initialize Access</h2>
              <p className="text-sm text-indus-white/50">Enter the next-generation AI ecosystem.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-indus-white text-indus-black font-bold uppercase tracking-widest text-xs hover:glow-cyan transition-all relative group overflow-hidden disabled:opacity-50"
              >
                {loading ? (
                  <Sparkles className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Chrome className="w-5 h-5" />
                    Connect via Google
                  </>
                )}
                <div className="absolute inset-0 bg-indus-cyan/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-indus-white/10"></span></div>
                <div className="relative flex justify-center"><span className="px-3 bg-indus-black text-[10px] text-indus-white/30 uppercase tracking-[0.2em] font-mono">Neural Auth Loop</span></div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indus-white/30" />
                  <input
                    type="email"
                    placeholder="Enter email ID"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-indus-white/5 border border-indus-white/10 focus:border-indus-cyan/40 outline-none transition-all text-sm placeholder:text-indus-white/20"
                  />
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indus-white/5 border border-indus-white/10 text-indus-white/70 font-bold uppercase tracking-widest text-xs hover:bg-indus-white/10 transition-all">
                  Request OTP <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] text-indus-white/20 font-mono">
              By initializing, you agree to the INDUS Intelligence Charter & Privacy Protocol.
            </p>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex justify-center gap-8 text-[10px] uppercase tracking-widest font-mono text-indus-white/20">
          <div className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" /> Nodes Online</div>
          <div className="flex items-center gap-2"><div className="w-1 h-1 bg-indus-cyan rounded-full animate-pulse" /> Encrypted Connection</div>
        </div>
      </motion.div>
    </div>
  );
}
