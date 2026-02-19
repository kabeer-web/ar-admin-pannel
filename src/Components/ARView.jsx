import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Zap } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState(null);
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";

  useEffect(() => {
    const modelId = searchParams.get('id');
    if (modelId) {
      axios.get(`${API_BASE_URL}/get-config/${modelId}`)
        .then(res => setConfig(res.data))
        .catch(err => console.error("Neural Link Failed"));
    }
  }, [searchParams]);

  if (!config) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-emerald-500 font-mono">
      <Loader2 className="animate-spin mb-4" /> [ INITIALIZING_LINK... ]
    </div>
  );

  return (
    <div className="h-screen w-screen bg-black">
      <model-viewer
        src={config.publicUrl}
        ar ar-modes="webxr scene-viewer quick-look"
        camera-controls shadow-intensity="2"
        exposure={config.exposure}
        style={{ width: '100%', height: '100%' }}
      >
        <button slot="ar-button" className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-10 py-5 rounded-2xl font-black">
          Project into Room
        </button>
      </model-viewer>
    </div>
  );
};

export default ARView;