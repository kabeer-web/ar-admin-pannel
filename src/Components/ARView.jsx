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
    }
  };

  if (!config) return <div className="h-screen bg-black flex items-center justify-center text-emerald-500 font-mono italic">INITIALIZING MATRIX...</div>;

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <model-viewer
        ref={modelViewerRef}
        src={config.publicUrl} // GLB File
        ios-src={config.publicUrl} // iPhone ke liye (Agar USDZ nahi hai to ye convert karne ki koshish karega)
        ar
        ar-modes="quick-look webxr scene-viewer" 
        camera-controls
        exposure={config.exposure || 1}
        onLoad={forceApply}
        style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
      >
        {/* iPhone Fix: Button ko center mein laane ke liye inline styles use kiye hain */}
        <button 
          slot="ar-button" 
          style={{
            display: 'block',
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#10b981',
            color: 'black',
            padding: '18px 40px',
            borderRadius: '50px',
            fontWeight: '900',
            fontSize: '14px',
            border: 'none',
            zIndex: 9999,
            boxShadow: '0 0 30px rgba(16,185,129,0.5)'
          }}
        >
          OPEN NEURAL AR
        </button>
      </model-viewer>

      {/* iPhone 8 Safari Fix: Force button visibility */}
      <style>{`
        model-viewer::part(default-ar-button) {
          display: block !important;
        }
      `}</style>
    </div>
  );
};

export default ARView;