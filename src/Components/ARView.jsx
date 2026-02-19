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

  if (!config) return <div className="h-screen bg-black flex items-center justify-center text-emerald-500 font-mono italic">SYNCING...</div>;

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <model-viewer
        ref={modelViewerRef}
        src={config.publicUrl} 
        // ios-src ke bina iPhone "Object could not be opened" bolega
        ios-src={config.publicUrl} 
        ar
        ar-modes="webxr quick-look scene-viewer"
        camera-controls
        exposure={config.exposure || 1}
        onLoad={forceApply}
        // iPhone AR ke liye ye zaruri hai
        quick-look-browsers="safari chrome"
        style={{ width: '100%', height: '100%' }}
      >
        <button 
          slot="ar-button" 
          style={{
            display: 'block',
            position: 'fixed',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#10b981',
            color: 'black',
            padding: '20px 45px',
            borderRadius: '12px',
            fontWeight: '900',
            zIndex: 999999,
            border: 'none',
            boxShadow: '0 0 40px rgba(16,185,129,0.5)',
            textTransform: 'uppercase'
          }}
        >
          Activate AR Matrix
        </button>
      </model-viewer>
    </div>
  );
};

export default ARView;