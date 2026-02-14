import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, ChevronLeft, Target, ShieldCheck, Zap } from 'lucide-react';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const modelUrl = searchParams.get('model');

  if (!modelUrl) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#010503] text-emerald-500 font-black gap-6">
        <div className="p-6 bg-red-500/10 rounded-full border border-red-500/20 animate-pulse">
            <ShieldCheck size={40} className="text-red-500"/>
        </div>
        <p className="tracking-[0.5em] uppercase text-xs">Uplink Error: Model Data Fragmented</p>
        <button onClick={() => navigate(-1)} className="text-[10px] text-emerald-800 hover:text-emerald-400 underline tracking-[0.2em] uppercase transition-all">
            Return to Matrix
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#000] overflow-hidden relative font-sans">
      
      {/* --- HUD OVERLAY: TOP BAR --- */}
      <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
        <button 
          onClick={() => navigate(-1)} 
          className="pointer-events-auto bg-[#05110d]/60 backdrop-blur-xl border border-emerald-500/10 p-4 rounded-2xl text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all shadow-2xl"
        >
          <ChevronLeft size={24} strokeWidth={3}/>
        </button>
        
        <div className="bg-[#05110d]/60 backdrop-blur-xl border border-emerald-500/10 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Quantum Sync Active</span>
        </div>
      </div>

      {/* --- HUD OVERLAY: CORNER DECO --- */}
      <div className="absolute bottom-10 right-10 z-50 pointer-events-none opacity-40 hidden md:block">
         <div className="text-right">
            <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1">Spatial coordinates</p>
            <p className="text-[11px] font-mono text-emerald-500 uppercase tracking-tighter">X: 104.22 | Y: 88.01 | Z: --</p>
         </div>
      </div>

      {/* --- SCANLINE EFFECT --- */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.03)_1.5px,transparent_1.5px)] bg-[size:100%_4px] z-10 opacity-30"></div>

      {/* --- MAIN AR ENGINE --- */}
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
        camera-orbit="45deg 55deg auto"
        interaction-prompt="auto"
        style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
      >
        {/* --- CUSTOM NEURAL AR BUTTON --- */}
        <button
          slot="ar-button"
          className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-emerald-600 hover:bg-emerald-400 text-[#010503] px-12 py-6 rounded-3xl font-black shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all active:scale-95 z-[999] uppercase tracking-[0.2em] text-xs flex items-center gap-4 whitespace-nowrap border-b-4 border-emerald-800"
        >
          <Target size={20} /> Launch Spatial View
        </button>

        {/* --- CUSTOM PROGRESS BAR --- */}
        <div slot="progress-bar" className="absolute top-0 left-0 w-full h-1 bg-emerald-950">
            <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] animate-pulse" style={{ width: '100%' }}></div>
        </div>

        {/* --- ANNOTATION HELP (Visible before AR) --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
            <Box size={300} strokeWidth={0.5} className="text-emerald-500 animate-spin-slow" />
        </div>
      </model-viewer>

      {/* --- FOOTER INFO --- */}
      <div className="absolute bottom-4 w-full text-center z-50 pointer-events-none">
        <p className="text-[8px] font-black text-emerald-900 uppercase tracking-[0.8em]">Neural Mesh Interface v3.5</p>
      </div>
      
    </div>
  );
};

export default ARView;