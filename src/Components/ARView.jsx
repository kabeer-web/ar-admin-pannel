import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const modelViewerRef = useRef();

  // URL se saara data nikaal lo
  const modelUrl = searchParams.get('model');
  const customColor = searchParams.get('color');
  const exposure = searchParams.get('exp') || "1";
  const environment = searchParams.get('env') || "neutral";

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (viewer && customColor) {
      viewer.addEventListener('load', () => {
        const material = viewer.model?.materials[0];
        if (material) {
          // Jo color generator mein set kiya tha, wahi yahan apply hoga
          material.pbrMetallicRoughness.setBaseColorFactor(customColor);
        }
      });
    }
  }, [customColor, modelUrl]);

  if (!modelUrl) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-emerald-500 font-mono tracking-tighter">
        [ SYSTEM_ERROR: NO_MODEL_DATA_LINKED ]
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="2"
        exposure={exposure}
        environment-image={environment}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Neon Style AR Button */}
        <button
          slot="ar-button"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#10b981',
            color: 'black',
            padding: '20px 40px',
            borderRadius: '20px',
            border: 'none',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
            cursor: 'pointer'
          }}
        >
          Activate AR Matrix
        </button>

        {/* Loading Bar Customization */}
        <div slot="progress-bar" style={{ background: '#10b981' }}></div>
      </model-viewer>

      {/* Subtle UI Overlay for Mobile User */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <p className="text-[10px] text-emerald-500/50 uppercase font-black tracking-[0.3em]">
          Neural Link Established
        </p>
      </div>
    </div>
  );
};

export default ARView;