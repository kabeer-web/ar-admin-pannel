import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Target, Cpu } from 'lucide-react';
import '@google/model-viewer'; // Important!

const ARView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const modelUrl = searchParams.get('model');

  // Page load hote hi ensure karein ki model viewer ready hai
  useEffect(() => {
    console.log("Neural Link Established with Model:", modelUrl);
  }, [modelUrl]);

  if (!modelUrl) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-emerald-500 font-black p-10 text-center">
        <Cpu size={48} className="mb-4 animate-pulse" />
        <p className="tracking-widest uppercase text-xs">Uplink Error: Model URL Not Found</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      
      {/* --- HUD HEADER --- */}
      <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => navigate(-1)} 
          className="pointer-events-auto bg-black/50 backdrop-blur-md border border-emerald-500/20 p-3 rounded-xl text-emerald-500"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="bg-black/50 backdrop-blur-md border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">
           Spatial Sync Active
        </div>
      </div>

      {/* --- MAIN AR ENGINE --- */}
      <model-viewer
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look" // Ye teenon mode hona zaroori hain
        ar-scale="auto"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        environment-image="neutral"
        loading="eager" // Jaldi load karne ke liye
        reveal="auto"
        style={{ width: '100%', height: '100%' }}
      >
        {/* --- THE BUTTON (This only shows on Mobile) --- */}
        <button
          slot="ar-button"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-black px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(16,185,129,0.5)] z-[999] uppercase tracking-widest text-sm flex items-center gap-3 border-none outline-none"
        >
          <Target size={20} /> 👋 View In Your Room
        </button>

        {/* Loading Progress */}
        <div slot="progress-bar" className="absolute top-0 left-0 w-full h-1 bg-emerald-900">
            <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: '100%' }}></div>
        </div>
      </model-viewer>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-emerald-500/5 z-0"></div>
    </div>
  );
};

export default ARView;