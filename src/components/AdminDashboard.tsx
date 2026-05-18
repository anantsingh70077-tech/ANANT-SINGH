import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Activity, HardDrive, AlertTriangle, Search, UserMinus, ShieldAlert, Trash2, ShieldCheck, Eye } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useAdminStatus } from '../lib/useAdminStatus';

import { OperationType, handleFirestoreError } from '../lib/firebase';

export default function AdminDashboard() {
  const { isAdmin, loading: adminLoading } = useAdminStatus();
  
  const [users, setUsers] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtifacts: 0,
    totalChats: 0,
    cpuUsage: 34,
    ramUsage: 62,
    activeNodes: 45
  });

  useEffect(() => {
    if (!isAdmin) return;

    // Fetch initial data
    const fetchAdminData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        const artifactsQuery = query(collection(db, 'artifacts'), orderBy('createdAt', 'desc'), limit(10));
        const artifactsSnapshot = await getDocs(artifactsQuery);
        const artifactsData = artifactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtifacts(artifactsData);

        const chatsQuery = query(collection(db, 'chats'), limit(50));
        const chatsSnapshot = await getDocs(chatsQuery);
        const chatsData = chatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChats(chatsData);

        setStats(prev => ({
          ...prev,
          totalUsers: usersData.length,
          totalArtifacts: artifactsSnapshot.size, // This is just sample, normally we should use count()
          totalChats: chatsSnapshot.size
        }));

      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'admin_dashboard_data');
      }
    };

    fetchAdminData();

    // Mock live system stats update
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 20) + 30, // 30-50%
        ramUsage: Math.floor(Math.random() * 10) + 60, // 60-70%
        activeNodes: Math.floor(Math.random() * 5) + 40
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    if (!window.confirm(`Are you sure you want to change this user's role?`)) return;
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleDeleteArtifact = async (artifactId: string) => {
    if (!window.confirm('Delete this artifact? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'artifacts', artifactId));
      setArtifacts(artifacts.filter(a => a.id !== artifactId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `artifacts/${artifactId}`);
    }
  };

  if (adminLoading) return <div className="p-10 text-white">Authenticating access...</div>;
  if (!isAdmin) return <div className="p-10 text-rose-500 flex items-center gap-2"><AlertTriangle /> ACCESS DENIED. You do not have clearance.</div>;

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-indus-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          OVERWATCH COMMAND
        </h1>
        <p className="text-indus-slate-400 mt-2">Executive control dashboard and system telemetry.</p>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Registered Nodes', value: stats.totalUsers, icon: Users, color: 'text-indus-cyan' },
          { label: 'Network CPU Load', value: `${stats.cpuUsage}%`, icon: Activity, color: stats.cpuUsage > 80 ? 'text-rose-500' : 'text-emerald-400' },
          { label: 'Memory Allocation', value: `${stats.ramUsage}%`, icon: HardDrive, color: 'text-indus-purple' },
          { label: 'Active Relays', value: stats.activeNodes, icon: Activity, color: 'text-amber-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl glass-card border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className={`w-12 h-12 ${stat.color}`} />
            </div>
            <p className="text-xs text-indus-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-3xl font-display font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Node Management</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indus-slate-500" />
              <input 
                type="text" 
                placeholder="Search nodes..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-indus-cyan outline-none transition-colors"
              />
            </div>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left bg-transparent">
                <thead className="bg-white/5 text-xs uppercase tracking-widest text-indus-slate-400">
                  <tr>
                    <th className="p-4">Node Profile</th>
                    <th className="p-4">Authorization</th>
                    <th className="p-4 rounded-tr-xl">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} className="w-8 h-8 rounded-full border border-white/10" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indus-navy flex items-center justify-center">
                            <Users className="w-4 h-4 text-indus-slate-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium">{user.displayName || 'Unknown'}</div>
                          <div className="text-xs text-indus-slate-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md border ${user.role === 'admin' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : 'border-indus-cyan/30 text-indus-cyan bg-indus-cyan/10'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleToggleAdmin(user.id, user.role || 'user')}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-indus-slate-400 hover:text-white transition-colors"
                            title={user.role === 'admin' ? "Revoke Admin" : "Grant Admin"}
                          >
                            {user.role === 'admin' ? <UserMinus className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-indus-slate-500">No nodes found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Artifacts / Moderation */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold">Artifact Moderation</h2>
          <div className="glass-card rounded-2xl border border-white/5 p-4 space-y-4 max-h-[600px] overflow-y-auto no-scrollbar">
            {artifacts.map((artifact) => (
              <div key={artifact.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indus-cyan/30 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-mono text-indus-cyan uppercase">{artifact.type}</div>
                  <button 
                    onClick={() => handleDeleteArtifact(artifact.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-rose-500/20 text-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="font-semibold text-sm mb-1 line-clamp-1">{artifact.title}</div>
                <div className="text-xs text-indus-slate-500 mb-3 font-mono">By Node: {artifact.userId.substring(0,8)}...</div>
                <div className="text-xs border border-white/5 bg-black/40 rounded-lg p-2 max-h-24 overflow-hidden relative">
                  <span className="opacity-70 font-mono text-[10px] break-all">{artifact.content}</span>
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              </div>
            ))}
            {artifacts.length === 0 && (
              <div className="text-center text-indus-slate-500 py-8">No recent artifacts detected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
