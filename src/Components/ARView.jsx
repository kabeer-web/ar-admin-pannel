import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw, Zap, Target } from 'lucide-react';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const modelViewerRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCustom, setIsCustom] = useState(true);

  const modelUrl = searchParams.get('model');
  const customColor = searchParams.get('color');
  const exposure = searchParams.get('exp') || "1";
  const environment = searchParams.get('env') || "neutral";

  // Color apply logic (Toggle support ke sath)
  const applyColor = (color) => {
    const viewer = modelViewerRef.current;
    if (viewer && viewer.model) {
      const material = viewer.model.materials[0];
      if (material) {
        material.pbrMetallicRoughness.setBaseColorFactor(color);
      }
    }
  };

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (viewer) {
      const handleLoad = () => {
        setIsLoaded(true);
        if (customColor && isCustom) applyColor(customColor);
      };
      viewer.addEventListener('load', handleLoad);
      return () => viewer.removeEventListener('load', handleLoad);
    }
  }, [modelUrl, customColor, isCustom]);

  const toggleOriginal = () => {
    if (isCustom) {
      // White/Default reset logic
      applyColor([1, 1, 1, 1]); 
      setIsCustom(false);
    } else {
      applyColor(customColor);
      setIsCustom(true);
    }
  };

  if (!modelUrl) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-emerald-500 font-mono text-xs p-10 text-center">
        [ SYSTEM_ERROR: SPATIAL_UPLINK_FAILED ]
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      
      {/* 3D Viewer */}
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate={!isLoaded} // Stop rotating when user interacts
        shadow-intensity="2"
        exposure={exposure}
        environment-image={environment}
        interaction-prompt="auto"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
        {/* Customized AR Button */}
        <button
          slot="ar-button"
          className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.4)] active:scale-90 transition-all border-none"
        >
          Project into Room
        </button>

        {/* Custom Progress Bar */}
        <div slot="progress-bar" className="w-full h-1 bg-emerald-900/20">
             <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-300" />
        </div>
      </model-viewer>

      {/* Floating UI Overlays */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-emerald-500">
            <Zap size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Link</span>
          </div>
          <p className="text-[8px] text-emerald-500/40 uppercase font-bold ml-6">v3.0 Secure Connection</p>
        </div>
        
        {/* Target Sync Icon */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
           <Target size={18} className="text-emerald-500 opacity-50" />
        </div>
      </div>

      {/* Quick Actions (Bottom Left) */}
      {customColor && isLoaded && (
        <div className="absolute bottom-32 left-6 flex flex-col gap-3">
          <button 
            onClick={toggleOriginal}
            className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 flex items-center gap-3 active:scale-95 transition-all shadow-2xl"
          >
            <RotateCcw size={16} className={!isCustom ? 'rotate-180 transition-transform' : ''}/>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isCustom ? 'Show Original' : 'Apply Custom'}
            </span>
          </button>
        </div>
      )}

      {/* Corner Accents (Decorative) */}
      <div className="absolute bottom-6 left-6 w-10 h-[1px] bg-emerald-500/20" />
      <div className="absolute bottom-6 left-6 h-10 w-[1px] bg-emerald-500/20" />
    </div>
  );
};

export default ARView;