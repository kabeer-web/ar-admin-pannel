import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      axios.get(`https://ar-admin-pannel.vercel.app/api/get-config/${id}?t=${Date.now()}`)
        .then(res => setConfig(res.data))
        .catch(err => console.error("Link Failed"));
    }
  }, [searchParams]);

  if (!config) return (
    <div className="h-screen bg-black flex items-center justify-center text-emerald-500 font-mono">
      LOADING NEURAL MODEL...
    </div>
  );

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <model-viewer
        src={config.publicUrl}
        ios-src={config.publicUrl}
        ar
        ar-modes="webxr quick-look scene-viewer"
        camera-controls
        auto-rotate
        exposure={config.exposure || 1}
        style={{ width: '100%', height: '100%' }}
      >
        <button 
          slot="ar-button" 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-12 py-4 rounded-full font-black uppercase tracking-widest shadow-lg"
        >
          VIEW IN YOUR SPACE
        </button>
      </model-viewer>
    </div>
  );
};

export default ARView;