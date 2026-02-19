import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Zap, Loader2, Smartphone } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const modelViewerRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [config, setConfig] = useState(null);

  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";

  useEffect(() => {
    const modelId = searchParams.get('id');
    if (modelId) {
      axios.get(`${API_BASE_URL}/get-config/${modelId}`)
        .then(res => setConfig(res.data))
        .catch(err => console.error("Link Failed"));
    }
  }, [searchParams]);

  // Main Function to inject color into the AR material
  const applyConfigToModel = () => {
    const viewer = modelViewerRef.current;
    if (viewer && viewer.model && config) {
      const material = viewer.model.materials[0];
      if (material) {
        const color = config.baseColor || "#ffffff";
        const r = parseInt(color.slice(1, 3), 16) / 255;
        const g = parseInt(color.slice(3, 5), 16) / 255;
        const b = parseInt(color.slice(5, 7), 16) / 255;
        
        // This line applies the color to the session
        material.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      }
    }
  };

  useEffect(() => {
    if (isLoaded && config) {
      applyConfigToModel();
    }
  }, [isLoaded, config]);

  if (!config) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-emerald-500 font-mono gap-4">
      <Loader2 className="animate-spin" size={32} />
      <span className="text-[10px] uppercase tracking-[0.5em]">Establishing Neural Connection</span>
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* IMPORTANT: ar-modes order ensures WebXR runs first. 
          WebXR is the ONLY way to keep customized colors in AR.
      */}
      <model-viewer
        ref={modelViewerRef}
        src={config.publicUrl}
        ar
        ar-modes="webxr scene-viewer quick-look" 
        camera-controls
        shadow-intensity="2"
        exposure={config.exposure}
        onLoad={() => {
            setIsLoaded(true);
            // Re-apply color after a small delay to ensure material is ready
            setTimeout(applyConfigToModel, 150);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <button slot="ar-button" className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-90 transition-all">
          Launch AR Matrix
        </button>
      </model-viewer>

      <div className="absolute top-8 left-8 p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-emerald-500/20">
        <div className="flex items-center gap-3 text-emerald-500">
          <Zap size={16} className="animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Neural Link Active</span>
            <span className="text-[8px] opacity-40 uppercase font-bold mt-1">Spatial Sync: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARView;