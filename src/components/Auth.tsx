import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, LogIn, Sparkles, Chrome, ChevronRight, User as UserIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword } from '../lib/firebase';
import { APP_NAME } from '../lib/constants';
import AIOrb from './AIOrb';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetState, setIsResetState] = useState(false);

  const getErrorMessage = (err: any) => {
    const code = err?.code || '';
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') return 'Invalid email or password.';
    if (code === 'auth/email-already-in-use') return 'An account with this email already exists.';
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters.';
    if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Form validation
    if (!email) {
      setError('Email is required.');
      setLoading(false);
      return;
    }

    try {
      if (isResetState) {
        await resetPassword(email);
        setSuccess('Password reset protocol initiated. Check your inbox.');
        setIsResetState(false);
      } else if (isLogin) {
        if (!password) {
          setError('Password is required.');
          setLoading(false);
          return;
        }
        await loginWithEmail(email, password);
      } else {
        if (!name || !password) {
          setError('All fields are required for initialization.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, name);
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setIsResetState(false);
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
                {isResetState ? 'System Recovery' : (isLogin ? 'Initialize Access' : 'Create Node Profile')}
              </h2>
              <p className="text-xs text-indus-white/50">
                {isResetState 
                  ? 'We will transmit a recovery key to your frequency.' 
                  : 'Enter the next-generation AI ecosystem.'}
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
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2 overflow-hidden"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <p>{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!isResetState && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-indus-white text-indus-black font-bold uppercase tracking-widest text-xs hover:glow-cyan transition-all relative group overflow-hidden disabled:opacity-50"
                >
                  {loading ? (
                    <Sparkles className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Chrome className="w-4 h-4" />
                      Connect via Google
                    </>
                  )}
                  <div className="absolute inset-0 bg-indus-cyan/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-indus-white/10"></span></div>
                  <div className="relative flex justify-center"><span className="px-3 bg-indus-navy text-[10px] text-indus-white/40 uppercase tracking-[0.2em] font-mono glass-card">Neural Auth Loop</span></div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && !isResetState && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="relative"
                  >
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indus-cyan/50" />
                    <input
                      type="text"
                      placeholder="Display Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-indus-black/50 border border-indus-white/10 focus:border-indus-cyan/50 focus:ring-1 focus:ring-indus-cyan/50 outline-none transition-all text-sm placeholder:text-indus-white/20 disabled:opacity-50"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indus-cyan/50" />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-indus-black/50 border border-indus-white/10 focus:border-indus-cyan/50 focus:ring-1 focus:ring-indus-cyan/50 outline-none transition-all text-sm placeholder:text-indus-white/20 disabled:opacity-50"
                />
              </div>

              {!isResetState && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indus-cyan/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Encryption Key (Password)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-indus-black/50 border border-indus-white/10 focus:border-indus-cyan/50 focus:ring-1 focus:ring-indus-cyan/50 outline-none transition-all text-sm placeholder:text-indus-white/20 disabled:opacity-50"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-indus-white/30 hover:text-indus-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {isLogin && !isResetState && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => { setIsResetState(true); setError(null); setSuccess(null); }}
                    className="text-[10px] text-indus-cyan/70 hover:text-indus-cyan font-mono uppercase transition-colors"
                  >
                    Forgot Key?
                  </button>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indus-cyan/20 border border-indus-cyan/30 text-indus-cyan font-bold uppercase tracking-widest text-xs hover:bg-indus-cyan hover:text-indus-black transition-all glow-cyan disabled:opacity-50"
              >
                {loading ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isResetState ? 'Transmit Recovery Key' : (isLogin ? 'Initiate Link' : 'Forge Profile')}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-indus-white/10 text-center">
              {isResetState ? (
                <button 
                  onClick={() => setIsResetState(false)}
                  className="text-xs text-indus-white/50 hover:text-indus-white transition-colors"
                >
                  Aboard Mission. Return to Login.
                </button>
              ) : (
                <button 
                  onClick={toggleAuthMode}
                  className="text-xs text-indus-white/50 hover:text-indus-white transition-colors"
                >
                  {isLogin ? "Don't have a profile? Request Creation." : "Existing profile? Initialize Access."}
                </button>
              )}
            </div>
            
            <p className="text-center text-[10px] text-indus-white/20 font-mono mt-4">
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
