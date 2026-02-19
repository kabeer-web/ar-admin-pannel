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
      // Timestamp add kiya taake har baar fresh data aaye
      axios.get(`https://ar-admin-pannel.vercel.app/api/get-config/${id}?t=${Date.now()}`)
        .then(res => setConfig(res.data))
        .catch(err => console.error("Neural Link Failed"));
    }
  }, [searchParams]);

  const forceApply = () => {
    const viewer = modelViewerRef.current;
    if (viewer && viewer.model && config) {
      const color = config.baseColor || "#ffffff";
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;

      viewer.model.materials.forEach((mat) => {
        mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      });
      console.log("Color Injected ✅");
    }
  };

  if (!config) return <div className="h-screen bg-black flex items-center justify-center text-emerald-500 font-mono italic">SYNCING WITH MATRIX...</div>;

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <model-viewer
        ref={modelViewerRef}
        src={config.publicUrl}
        ar
        ar-modes="webxr quick-look" // Scene viewer hata diya kyunki wo settings uda deta hai
        camera-controls
        exposure={config.exposure || 1}
        onLoad={forceApply}
        ar-status="not-presenting"
        style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
      >
        {/* Forcefully Visible AR Button */}
        <button 
          slot="ar-button" 
          id="ar-button"
          className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-10 py-5 rounded-full font-black uppercase tracking-tighter shadow-[0_0_50px_rgba(16,185,129,0.6)] z-[9999] block !important"
          style={{ display: 'block', visibility: 'visible', opacity: 1 }}
        >
          START AR MATRIX
        </button>
      </model-viewer>

      {/* CSS to make sure button is NEVER hidden by model-viewer */}
      <style>{`
        #ar-button {
          display: block !important;
          visibility: visible !important;
        }
        model-viewer#ar-button:not([ar-status="not-presenting"]) {
          display: block !important;
        }
      `}</style>
    </div>
  );
};

export default ARView;