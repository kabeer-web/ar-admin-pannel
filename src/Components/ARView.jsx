import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Target, Cpu, Activity, Info } from 'lucide-react';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const rawModelUrl = searchParams.get('model');
  const modelUrl = rawModelUrl ? decodeURIComponent(rawModelUrl).trim() : null;

  useEffect(() => {
    // Artificial delay for that "AI Loading" feel
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!modelUrl) {
    return (
      <div className="w-full h-screen bg-[#010503] flex flex-col items-center justify-center text-emerald-500 font-black p-6 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse"></div>
          <Cpu size={60} className="relative text-red-500" />
        </div>
        <h2 className="text-2xl tracking-[0.3em] uppercase mb-2">Uplink Failed</h2>
        <p className="text-[10px] text-emerald-900 uppercase tracking-widest">Model path is corrupted or missing</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-[100dvh] bg-black overflow-hidden relative font-sans">
      
      {/* --- NEURAL OVERLAY (Animation) --- */}
      {!isLoaded && (
        <div className="absolute inset-0 z-[100] bg-[#010503] flex flex-col items-center justify-center">
          <Activity size={48} className="text-emerald-500 animate-pulse mb-4" />
          <div className="w-48 h-[2px] bg-emerald-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500 animate-loading-bar"></div>
          </div>
          <p className="mt-4 text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] animate-pulse">Syncing Spatial Data...</p>
        </div>
      )}

      {/* --- RESPONSIVE HUD HEADER --- */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 md:p-8 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => navigate('/')} 
          className="pointer-events-auto bg-[#05110d]/80 backdrop-blur-xl border border-emerald-500/20 p-3 md:p-4 rounded-2xl text-emerald-500 shadow-2xl active:scale-90 transition-all"
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>
        
        <div className="flex flex-col items-end gap-1">
            <div className="bg-[#05110d]/80 backdrop-blur-xl border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-3 shadow-2xl">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-[9px] md:text-[11px] font-black text-emerald-400 uppercase tracking-widest">Neural Link v3.5</span>
            </div>
            <span className="text-[7px] text-emerald-900 uppercase tracking-[0.3em] mr-1">Status: Stable</span>
        </div>
      </div>

      {/* --- SIDEBAR UTILS (Responsive Desktop/Mobile) --- */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-4 pointer-events-none">
         {[1, 2, 3].map((i) => (
           <div key={i} className="w-[1px] h-12 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"></div>
         ))}
      </div>

      {/* --- THE ENGINE (Model Viewer) --- */}
      <model-viewer
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        camera-controls
        auto-rotate
        shadow-intensity="2"
        exposure="1.2"
        environment-image="neutral"
        interaction-prompt="auto"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        className="reveal"
      >
        {/* --- DYNAMIC AR BUTTON (Mobile Specific Styling) --- */}
        <button
          slot="ar-button"
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 bg-emerald-600 hover:bg-emerald-400 text-black px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black shadow-[0_20px_60px_rgba(16,185,129,0.4)] z-[9999] uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center gap-4 transition-all active:scale-95 border-b-4 border-emerald-800"
        >
          <Target size={18} className="animate-spin-slow" /> 👋 View In Your Room
        </button>

        {/* --- SCANNING LINE EFFECT --- */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.02)_1.5px,transparent_1.5px)] bg-[size:100%_3px] opacity-50"></div>
      </model-viewer>

      {/* --- FOOTER SPECS --- */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none z-40">
        <div className="space-y-1">
           <p className="text-[8px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-2">
             <Info size={10} /> Model Orientation: Optimized
           </p>
           <p className="text-[8px] font-bold text-emerald-800 uppercase tracking-widest">Light Source: Neural Environment</p>
        </div>
        <div className="text-right">
           <div className="p-2 border border-emerald-500/10 rounded-lg">
              <Box size={14} className="text-emerald-900" />
           </div>
        </div>
      </div>

      {/* --- TAILWIND CUSTOM ANIMATIONS --- */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default ARView;