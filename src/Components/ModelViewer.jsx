import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

const ModelViewer = () => {
  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner">
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            {/* Placeholder Box - Jab tak AI model nahi aata */}
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#c4f63b" />
            </mesh>
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default ModelViewer; 