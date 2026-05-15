import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Plus, 
  Search, 
  Filter, 
  FolderOpen,
  Pin,
  Clock,
  MoreVertical,
  Upload,
  X,
  FileArchive
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../lib/utils';
import { APP_NAME } from '../lib/constants';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';

interface FileAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: any;
  pinned?: boolean;
}

export default function Workspace() {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'files'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fileList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FileAsset[];
        setFiles(fileList);
        setIsLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'files');
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  const categories = [
    { label: 'All Files', icon: FolderOpen, count: files.length },
    { label: 'Documents', icon: FileText, count: files.filter(f => f.type.includes('pdf') || f.type.includes('text')).length },
    { label: 'Media', icon: ImageIcon, count: files.filter(f => f.type.includes('image')).length },
    { label: 'Code', icon: FileCode, count: files.filter(f => f.type.includes('code') || f.type.includes('script')).length },
  ];

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return ImageIcon;
    if (type.includes('pdf')) return FileText;
    if (type.includes('code') || type.includes('script')) return FileCode;
    if (type.includes('zip') || type.includes('archive')) return FileArchive;
    return FileText;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!auth.currentUser) return;
    
    setIsUploading(true);
    for (const file of acceptedFiles) {
      // Simulate file upload to storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        await addDoc(collection(db, 'files'), {
          userId: auth.currentUser.uid,
          name: file.name,
          size: file.size,
          type: file.type || 'unknown',
          url: '#', // Placeholder for actual storage URL
          createdAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'files');
      }
    }
    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16 h-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tighter mb-2">AI Workspace</h1>
          <p className="text-indus-white/50 font-light">Manage your intelligence assets and analyzed documents.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indus-white/30" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="w-full pl-11 pr-4 py-3 glass-card bg-indus-navy/20 outline-none focus:border-indus-cyan/40 transition-all text-sm"
            />
          </div>
          <button 
            {...getRootProps()}
            className="bg-indus-cyan text-indus-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:glow-cyan shadow-lg transition-all"
          >
            <input {...getInputProps()} />
            <Plus className="w-5 h-5" /> Import
          </button>
        </div>
      </div>

      {/* Upload Zone (Drag Active) */}
      <AnimatePresence>
        {isDragActive && (
          <div {...getRootProps()}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-12 bg-indus-black/80 backdrop-blur-xl"
            >
              <div className="w-full max-w-2xl p-20 border-2 border-dashed border-indus-cyan/50 rounded-3xl flex flex-col items-center justify-center gap-6 bg-indus-cyan/5">
                <Upload className="w-16 h-16 text-indus-cyan animate-bounce" />
                <h2 className="text-3xl font-display font-bold">Transmit to {APP_NAME}</h2>
                <p className="text-indus-white/50">Release files to begin quantum analysis.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-indus-white/5 transition-colors cursor-pointer"
            >
              {(() => {
                const Icon = cat.icon;
                return <Icon className="w-6 h-6 text-indus-cyan" />;
              })()}
              <span className="text-lg font-bold">{cat.count}</span>
              <span className="text-[10px] uppercase tracking-widest text-indus-white/40 font-bold">{cat.label}</span>
            </motion.div>
          ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-indus-white/10">
          <h3 className="text-sm uppercase tracking-widest font-mono text-indus-white/40 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Recent Intelligence Artifacts
          </h3>
          <button className="p-2 hover:bg-indus-white/5 rounded-lg text-indus-white/40">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {isUploading && (
          <div className="glass-card p-4 border-indus-cyan/20 animate-pulse flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indus-cyan/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-indus-cyan" />
            </div>
            <div className="flex-1">
              <div className="h-2 w-full bg-indus-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-full bg-indus-cyan" 
                />
              </div>
              <p className="text-[10px] text-indus-cyan mt-1 uppercase tracking-widest font-bold">Transmitting metadata...</p>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {files.map((file, i) => {
            const Icon = getFileIcon(file.type);
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-4 lg:p-6 flex items-center justify-between group hover:bg-indus-white/5 transition-colors cursor-pointer border-indus-white/5"
              >
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center p-3 relative",
                    file.pinned ? "bg-indus-cyan/10 border-indus-cyan/20" : "bg-indus-white/5 border-indus-white/10"
                  )}>
                    <Icon className={cn("w-full h-full", file.pinned ? "text-indus-cyan" : "text-indus-white/40")} />
                    {file.pinned && (
                      <div className="absolute -top-1 -right-1">
                        <Pin className="w-3 h-3 text-indus-cyan fill-indus-cyan" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium group-hover:text-indus-cyan transition-colors">{file.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-indus-white/5 text-[10px] font-bold text-indus-white/40 uppercase">{file.type.split('/')[1] || file.type}</span>
                      <span className="text-[10px] text-indus-white/30">{formatSize(file.size)}</span>
                      <span className="text-[10px] text-indus-white/30">•</span>
                      <span className="text-[10px] text-indus-white/30">
                        {file.createdAt?.toDate ? file.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-indus-white/10 rounded-lg text-indus-white/40 hover:text-indus-white transition-colors">
                    <Pin className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-indus-white/10 rounded-lg text-indus-white/40 hover:text-indus-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
          {files.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-indus-white/5 rounded-3xl border border-dashed border-indus-white/10">
              <FolderOpen className="w-12 h-12 text-indus-white/10 mx-auto mb-4" />
              <p className="text-indus-white/40 text-sm font-medium tracking-widest uppercase">No artifacts archived yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
