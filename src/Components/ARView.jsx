import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Zap, Loader2 } from 'lucide-react';
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
        .catch(err => console.error("Neural Connection Lost"));
    }
  }, [searchParams]);

  const applyMatrixColor = () => {
    const viewer = modelViewerRef.current;
    if (viewer && viewer.model && config) {
      const material = viewer.model.materials[0];
      if (material) {
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
      setTimeout(applyMatrixColor, 150);
    }
  }, [isLoaded, config]);

  if (!config) return <div className="h-screen bg-black flex items-center justify-center text-emerald-500 font-mono"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <model-viewer
        ref={modelViewerRef}
        src={config.publicUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        exposure={config.exposure}
        onLoad={() => setIsLoaded(true)}
        style={{ width: '100%', height: '100%' }}
      >
        <button slot="ar-button" className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl">
          Launch AR Space
        </button>
      </model-viewer>
      
      <div className="absolute top-6 left-6 flex items-center gap-2 p-3 bg-black/40 backdrop-blur-md rounded-xl border border-emerald-500/20">
        <Zap size={14} className="text-emerald-500 animate-pulse" />
        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Neural Sync: 100%</span>
      </div>
    </div>
  );
};

export default ARView;