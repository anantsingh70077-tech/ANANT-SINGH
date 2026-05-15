import { useState, useRef, Suspense } from 'react';
import { motion } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Text, Points, PointMaterial } from '@react-three/drei';
import { Brain, Zap, Globe, Cpu, Database, Activity, RefreshCw } from 'lucide-react';
import * as THREE from 'three';
import { cn } from '../lib/utils';

function NeuralSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={2}>
        <MeshDistortMaterial
          color="#06b6d4"
          attach="material"
          distort={0.4}
          speed={3}
          roughness={0}
          emissive="#06b6d4"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}

function DataPoints() {
  const points = useRef<THREE.Points>(null);
  const count = 1000;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        color="#9333ea"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
}

export default function NeuralLab() {
  const [activeModule, setActiveModule] = useState('core');
  
  const modules = [
    { id: 'core', name: 'Neural Core', icon: Brain, stats: '98.4% Sync' },
    { id: 'quantum', name: 'Quantum Hub', icon: Zap, stats: 'Stable' },
    { id: 'world', name: 'Global Link', icon: Globe, stats: '1.2ms Latency' },
    { id: 'compute', name: 'Edge Compute', icon: Cpu, stats: 'Peak Load' },
  ];

  return (
    <div className="h-full flex flex-col bg-indus-black relative overflow-hidden">
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 p-8 flex flex-col justify-between">
        <header className="flex justify-between items-start">
          <div>
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl font-display font-black tracking-tighter text-white mb-2"
            >
              NEURAL LAB <span className="text-indus-cyan">v3.5</span>
            </motion.h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">
              Real-time Latent Space Visualization
            </p>
          </div>
          <div className="flex gap-4 pointer-events-auto">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indus-cyan rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Protocol: Active</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex justify-between items-end gap-8">
          <div className="w-80 space-y-6 pointer-events-auto">
            {activeModule === 'compute' ? (
              <div className="glass-card p-4 h-64 flex flex-col font-mono text-[10px] overflow-hidden">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-white/40 ml-2">INDUS_TERMINAL_V1.0</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 text-indus-cyan scrollbar-none">
                  <p>root@indus:~$ init_neural_bridge --mode=quantum</p>
                  <p className="text-white/20">[SUCCESS] Quantum handshake completed in 0.2ms</p>
                  <p>root@indus:~$ scan_latent_space --depth=128</p>
                  <p className="text-white/20">[INFO] Scanning 4.2 trillion vector points...</p>
                  <p className="text-emerald-400">root@indus:~$ execute_synthetic_logic --agent=INDUS_PRO</p>
                  <p className="text-white/20 animate-pulse">[PROCESSING] Recalibrating logic gates...</p>
                  <p className="text-white/20">[STATUS] 98.4% Coherence achieved.</p>
                  <div className="flex gap-1">
                    <span className="text-indus-cyan">root@indus:~$</span>
                    <span className="w-1.5 h-3 bg-indus-cyan animate-pulse mt-0.5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-4 space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> System Telemetry
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Neural Flux', value: '0.82 THz' },
                    { label: 'Synaptic Density', value: '42.1M/cm³' },
                    { label: 'Entropy Level', value: 'Minimal' }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] text-white/40 font-mono">{stat.label}</span>
                      <span className="text-[10px] text-indus-cyan font-mono">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl transition-all border group",
                    activeModule === mod.id 
                      ? "bg-indus-cyan text-black border-indus-cyan" 
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <mod.icon className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{mod.name}</span>
                  </div>
                  <span className={cn(
                    "text-[9px] font-mono",
                    activeModule === mod.id ? "text-black/60" : "text-white/20"
                  )}>{mod.stats}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-6 text-right">
             <div className="space-y-1">
               <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Temporal Link</p>
               <h3 className="text-2xl font-display font-bold text-white tabular-nums">
                 {new Date().toLocaleTimeString()}
               </h3>
             </div>
             <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-indus-cyan hover:text-black transition-all pointer-events-auto">
               <RefreshCw className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* 3D Stage */}
      <div className="flex-1 bg-black">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9333ea" />
            
            <NeuralSphere />
            <DataPoints />
            
            <OrbitControls 
              enableZoom={false} 
              autoRotate 
              autoRotateSpeed={0.5}
              makeDefault
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute inset-0 bg-gradient-to-t from-indus-black via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
    </div>
  );
}
