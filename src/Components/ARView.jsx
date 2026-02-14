import React from 'react';
import { useSearchParams } from 'react-router-dom';
import '@google/model-viewer';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const modelUrl = searchParams.get('model');

  if (!modelUrl) return <div className="text-white p-10">No model detected in link.</div>;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <model-viewer
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '100%' }}
      >
        <button slot="ar-button" style={{
          position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#10b981', color: 'black', padding: '15px 30px', borderRadius: '50px', border: 'none', fontWeight: 'bold'
        }}>
          VIEW IN YOUR ROOM
        </button>
      </model-viewer>
    </div>
  );
};

export default ARView;
