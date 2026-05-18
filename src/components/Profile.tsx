import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  BarChart3, 
  Settings, 
  LogOut,
  Camera,
  Edit2,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { APP_NAME, CEO } from '../lib/constants';
import { auth, logout, db } from '../lib/firebase';
import { collection, query, where, getDocs, count } from 'firebase/firestore';

export default function Profile() {
  const user = auth.currentUser;
  const [stats, setStats] = useState([
    { label: 'AI Interactions', value: '0', icon: BarChart3, color: 'text-indus-cyan' },
    { label: 'Files Analyzed', value: '0', icon: Shield, color: 'text-indus-purple' },
    { label: 'Vision Quota', value: 'Spark', icon: Sparkles, color: 'text-emerald-400' },
  ]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const chatsQuery = query(collection(db, 'chats'), where('userId', '==', user.uid));
        const filesQuery = query(collection(db, 'files'), where('userId', '==', user.uid));
        
        const [chatsSnap, filesSnap] = await Promise.all([
          getDocs(chatsQuery),
          getDocs(filesQuery)
        ]);

        setStats([
          { label: 'AI Interactions', value: chatsSnap.size.toLocaleString(), icon: BarChart3, color: 'text-indus-cyan' },
          { label: 'Files Analyzed', value: filesSnap.size.toLocaleString(), icon: Shield, color: 'text-indus-purple' },
          { label: 'Vision Quota', value: 'Spark', icon: Sparkles, color: 'text-emerald-400' },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20 h-full overflow-y-auto no-scrollbar">
      {/* Header Profile */}
      <div className="flex flex-col items-center mb-16 relative">
        <div className="relative group">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-indus-white/10 p-1 relative z-10"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indus-navy to-indus-black overflow-hidden flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 lg:w-20 lg:h-20 text-indus-white/20" />
              )}
            </div>
            <div className="absolute inset-0 bg-indus-cyan/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
          </motion.div>
          <button className="absolute bottom-2 right-2 p-2 bg-indus-cyan text-indus-black rounded-full shadow-lg z-20 hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6"
        >
          <h2 className="text-3xl font-display font-bold">{user?.displayName || "Anonymous Pioneer"}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Sparkles className="w-3 h-3 text-indus-cyan" />
            <p className="text-indus-white/40 font-mono text-sm uppercase tracking-widest">Early Adopter #{user?.uid.slice(-4).toUpperCase()}</p>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-card p-6 flex flex-col items-center text-center gap-2"
          >
            {(() => {
              const Icon = stat.icon;
              return <Icon className={cn("w-5 h-5 mb-2", stat.color)} />;
            })()}
            <span className="text-2xl font-display font-black">{stat.value}</span>
            <span className="text-[10px] uppercase tracking-widest text-indus-white/40 font-bold">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Profile Details */}
      <div className="space-y-6">
        <div className="glass-card p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-indus-white/5 pb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indus-cyan" /> User Information
            </h3>
            <button className="text-xs text-indus-cyan hover:underline flex items-center gap-1">
              <Edit2 className="w-3 h-3" /> Edit Profile
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-mono text-indus-white/30">Email Address</label>
              <div className="flex items-center gap-3 text-indus-white/80">
                <Mail className="w-4 h-4 opacity-40" />
                <span className="truncate">{user?.email || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-mono text-indus-white/30">Member Since</label>
              <div className="flex items-center gap-3 text-indus-white/80">
                <Calendar className="w-4 h-4 opacity-40" />
                <span>{user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-mono text-indus-white/30">Account Security</label>
              <div className="flex items-center gap-3 text-emerald-400">
                <Shield className="w-4 h-4 opacity-80" />
                <span>Encrypted & Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* CEO Credit */}
        <div className="bg-indus-navy/40 border border-indus-white/10 p-8 rounded-3xl flex flex-col items-center text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] font-mono text-indus-white/20 mb-6">INDUS Visionaries</p>
          <div className="flex gap-16">
            <div>
              <p className="text-lg font-display font-bold">{CEO}</p>
              <p className="text-[10px] text-indus-white/40 uppercase tracking-widest">CEO</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 text-rose-400 font-bold uppercase tracking-widest hover:bg-rose-950/20 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out from Ecosystem
        </button>
      </div>
    </div>
  );
}
