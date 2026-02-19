import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const modelViewerRef = useRef();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      // CACHE BUSTER ADDED: Hamesha fresh data ayega database se
      axios.get(`https://ar-admin-pannel.vercel.app/api/get-config/${id}?t=${Date.now()}`)
        .then(res => {
          console.log("Neural Data Received:", res.data);
          setConfig(res.data);
        })
        .catch(err => console.error("Neural Link Failed", err));
    }
  }, [searchParams]);

  // COLOR INJECTION LOGIC (Solidified)
  const applyMatrixSettings = () => {
    const viewer = modelViewerRef.current;
    if (viewer && viewer.model && config) {
      const color = config.baseColor || "#ffffff";
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;

      // Sabhi materials par override apply karo
      viewer.model.materials.forEach((mat) => {
        mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      });
      console.log("Matrix Applied: ", color);
    }
  };

  if (!config) return (
    <div className="h-screen bg-[#010604] flex flex-col items-center justify-center text-emerald-500 font-mono">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="animate-pulse tracking-[0.3em]">SYNCING MATRIX...</p>
    </div>
  );

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <model-viewer
        ref={modelViewerRef}
        src={config.publicUrl}
        ar
        ar-modes="webxr scene-viewer"
        camera-controls
        exposure={config.exposure || 1}
        shadow-intensity="1"
        // Triple Injection Strategy for Mobile Reliability
        onLoad={() => {
          applyMatrixSettings();
          setTimeout(applyMatrixSettings, 500);
          setTimeout(applyMatrixSettings, 1500);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <button 
          slot="ar-button" 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-12 py-4 rounded-full font-black uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-90 transition-transform"
        >
          LAUNCH NEURAL AR
        </button>
      </model-viewer>

      {/* Watermark taake pata chale updated version hai */}
      <div className="absolute top-4 left-4 text-emerald-500/20 text-[8px] font-mono pointer-events-none uppercase tracking-[0.5em]">
        Neural Core v3.0 // Ready
      </div>
    </div>
  );
};

export default ARView;