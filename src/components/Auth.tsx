import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Chrome, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';
import { APP_NAME } from '../lib/constants';
import AIOrb from './AIOrb';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: any) => {
    const code = err?.code || '';
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') return 'Invalid credentials.';
    if (code === 'auth/email-already-in-use') return 'An account with this email already exists.';
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters.';
    if (code === 'auth/unauthorized-domain') return "Domain Unauthorized. Please add this domain to 'Authorized domains' in your Firebase console under Authentication > Settings.";
    return err?.message || 'Authentication failed. Please try again.';
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indus-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-radial from-indus-cyan/10 via-indus-black to-indus-black opacity-80" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <AIOrb size={100} className="mb-4" />
          <h1 className="text-4xl font-display font-bold tracking-tighter text-glow-cyan mb-2">{APP_NAME}</h1>
          <p className="text-indus-white/40 uppercase tracking-[0.3em] text-[10px] font-mono">Quantum Intelligence Protocol</p>
        </div>

        <div className="glass-card p-8 border-indus-cyan/20 relative overflow-hidden shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-indus-cyan/10 to-indus-purple/10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indus-cyan/50 to-transparent" />
          
          <div className="relative space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-display font-bold text-indus-white">
                Initialize Access
              </h2>
              <p className="text-xs text-indus-white/50">
                Enter the next-generation AI ecosystem.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2 overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-indus-white text-indus-black font-bold uppercase tracking-widest text-sm hover:glow-cyan transition-all relative group overflow-hidden disabled:opacity-50 mt-8"
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
            
            <p className="text-center text-[10px] text-indus-white/20 font-mono mt-8">
              By initializing, you agree to the INDUS Intelligence Charter & Privacy Protocol.
            </p>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex justify-center gap-8 text-[10px] uppercase tracking-widest font-mono text-indus-white/20">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse glow-white" /> Grid Status: Nominal</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indus-cyan rounded-full animate-pulse glow-cyan" /> Secure Connection</div>
        </div>
      </motion.div>
    </div>
  );
}
