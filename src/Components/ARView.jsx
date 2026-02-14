import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Target, Cpu } from 'lucide-react';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawModelUrl = searchParams.get('model');
  const modelUrl = rawModelUrl ? decodeURIComponent(rawModelUrl).trim() : null;

  if (!modelUrl) {
    return (
      <div className="w-full h-screen bg-[#020806] flex flex-col items-center justify-center text-emerald-500 font-black">
        <Cpu size={48} className="animate-pulse mb-4" />
        <p className="tracking-widest uppercase text-xs">Uplink Error: No Model Data</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* HUD Header */}
      <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => navigate('/')} 
          className="pointer-events-auto bg-black/40 backdrop-blur-md border border-emerald-500/20 p-3 rounded-xl text-emerald-500"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="bg-black/40 backdrop-blur-md border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">
           Neural Sync Active
        </div>
      </div>

      <model-viewer
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '100%' }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-black px-10 py-5 rounded-2xl font-black shadow-[0_15px_40px_rgba(16,185,129,0.4)] z-[9999] uppercase tracking-widest text-xs flex items-center gap-3 border-none"
        >
          <Target size={20} /> 👋 View In Your Room
        </button>
      </model-viewer>
    </div>
  );
};

export default ARView;