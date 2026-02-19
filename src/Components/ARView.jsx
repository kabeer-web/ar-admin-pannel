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

  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";

  useEffect(() => {
    const modelId = searchParams.get('id');
    if (modelId) {
      axios.get(`${API_BASE_URL}/get-config/${modelId}`)
        .then(res => setConfig(res.data))
        .catch(err => console.error("Link Failed"));
    }
  }, [searchParams]);

  // COLOR APPLY LOGIC (CONVERTS HEX TO RGB FOR AR)
  const applyConfigToModel = () => {
    const viewer = modelViewerRef.current;
    if (viewer && viewer.model && config) {
      const material = viewer.model.materials[0];
      if (material) {
        // Hex to RGB conversion
        const color = config.baseColor || "#ffffff";
        const r = parseInt(color.slice(1, 3), 16) / 255;
        const g = parseInt(color.slice(3, 5), 16) / 255;
        const b = parseInt(color.slice(5, 7), 16) / 255;
        material.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      }
    }
  };

  useEffect(() => {
    if (isLoaded && config) {
      applyConfigToModel();
    }
  }, [isLoaded, config]);

  if (!config) return <div className="h-screen bg-black flex items-center justify-center text-emerald-500 font-mono"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* IMPORTANT: ar-modes order matters! webxr first allows color persistence */}
      <model-viewer
        ref={modelViewerRef}
        src={config.publicUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        shadow-intensity="2"
        exposure={config.exposure}
        onLoad={() => setIsLoaded(true)}
        style={{ width: '100%', height: '100%' }}
      >
        <button slot="ar-button" className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl">
          View In Your Space
        </button>
      </model-viewer>

      <div className="absolute top-6 left-6 p-4 bg-black/50 backdrop-blur-md rounded-2xl border border-emerald-500/20">
        <div className="flex items-center gap-2 text-emerald-500">
          <Zap size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Neural Link Active</span>
        </div>
      </div>
    </div>
  );
};

export default ARView;