import React from 'react';
import { useSearchParams } from 'react-router-dom';

const ARView = () => {
  const [searchParams] = useSearchParams();
  const modelUrl = searchParams.get('model');

  if (!modelUrl) return <div className="p-10 text-center font-bold">Model URL missing!</div>;

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex flex-col items-center">
      <model-viewer
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '100%' }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-full font-black shadow-2xl"
        >
          👋 VIEW IN YOUR ROOM
        </button>
      </model-viewer>
    </div>
  );
};

export default ARView;