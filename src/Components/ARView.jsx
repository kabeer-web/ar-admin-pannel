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
      axios.get(`https://ar-admin-pannel.vercel.app/api/get-config/${id}`)
        .then(res => setConfig(res.data))
        .catch(err => console.error("Neural Link Failed"));
    }
  }, [searchParams]);

  // COLOR INJECTION: Har ek material ko check karega
  const forceApplyColor = () => {
    const viewer = modelViewerRef.current;
    if (viewer && viewer.model && config) {
      const color = config.baseColor || "#ffffff";
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;

      // GLB ke saare materials par color thop do
      viewer.model.materials.forEach((mat) => {
        mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      });
      console.log("Matrix Injection: Complete");
    }
  };

  if (!config) return <div className="h-screen bg-black flex items-center justify-center text-emerald-500 font-mono">Syncing Matrix...</div>;

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <model-viewer
        ref={modelViewerRef}
        src={config.publicUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        exposure={config.exposure || 1}
        onLoad={() => {
          // Model load hote hi multiple times color apply karo
          forceApplyColor();
          setTimeout(forceApplyColor, 100);
          setTimeout(forceApplyColor, 500);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <button slot="ar-button" className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-12 py-4 rounded-full font-black uppercase tracking-widest shadow-2xl">
          Launch AR Matrix
        </button>
      </model-viewer>
    </div>
  );
};

export default ARView;