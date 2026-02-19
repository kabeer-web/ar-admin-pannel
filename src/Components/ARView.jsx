import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw, Zap, Target, Loader2 } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const modelViewerRef = useRef();
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [config, setConfig] = useState(null);
  const [isCustom, setIsCustom] = useState(true);

  // FIXED URL: Direct HTTPS to avoid Mixed Content error
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";

  // --- FETCH CONFIG FROM DATABASE ---
  useEffect(() => {
    const modelId = searchParams.get('id');
    if (modelId) {
      axios.get(`${API_BASE_URL}/get-config/${modelId}`)
        .then(res => setConfig(res.data))
        .catch(err => console.error("Neural Link Failed: ", err));
    }
  }, [searchParams]);

  const applyColor = (color) => {
    const viewer = modelViewerRef.current;
    if (viewer?.model?.materials[0]) {
      viewer.model.materials[0].pbrMetallicRoughness.setBaseColorFactor(color);
    }
  };

  // Sync color when loaded
  useEffect(() => {
    if (isLoaded && config && isCustom) {
      applyColor(config.baseColor);
    }
  }, [isLoaded, config, isCustom]);

  const toggleOriginal = () => {
    if (isCustom) {
      applyColor([1, 1, 1, 1]); // Restore to default white/original
      setIsCustom(false);
    } else {
      applyColor(config.baseColor);
      setIsCustom(true);
    }
  };

  if (!config) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-emerald-500 font-mono text-xs gap-4">
        <Loader2 className="animate-spin" size={24} />
        [ INITIALIZING_SPATIAL_LINK... ]
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      <model-viewer
        ref={modelViewerRef}
        src={config.publicUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        shadow-intensity="2"
        exposure={config.exposure}
        environment-image="neutral"
        onLoad={() => setIsLoaded(true)}
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
        <button slot="ar-button" className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.4)] active:scale-90 transition-all">
          Project into Room
        </button>
      </model-viewer>

      {/* MATRIX UI OVERLAY */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-emerald-500">
            <Zap size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Link Connected</span>
          </div>
          <p className="text-[8px] text-emerald-500/40 uppercase font-bold ml-6">Matrix Sync ID: {config._id.slice(-6)}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
           <Target size={18} className="text-emerald-500 opacity-50" />
        </div>
      </div>

      {/* FEATURE: TEXTURE TOGGLE RESTORED */}
      {isLoaded && (
        <div className="absolute bottom-32 left-6">
          <button onClick={toggleOriginal} className="bg-black/60 backdrop-blur-xl border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 flex items-center gap-3 active:scale-95 transition-all">
            <RotateCcw size={16} className={!isCustom ? 'rotate-180 transition-transform' : ''}/>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isCustom ? 'Original Texture' : 'Matrix Texture'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ARView;