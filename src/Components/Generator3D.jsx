import React, { useState } from 'react';
import axios from 'axios';
import UploadZone from './UploadZone';
import ModelViewer from './ModelViewer';
import { Loader2, Box, Sparkles, Cpu, TreePine, Zap, Leaf, ShieldCheck, Globe, X, Heart } from 'lucide-react';

const Generator3D = () => {
  const [loading, setLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleUpload = async (file) => {
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-[#040d0a] text-emerald-50 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      
      {/* --- AMBIENT FOREST BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full"></div>
      </div>

      {/* --- HUMAN-TOUCH POPUP --- */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a1a15] border border-emerald-500/30 rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl text-center space-y-6 relative border-t-emerald-500">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <Heart className="text-emerald-400 fill-emerald-400 animate-pulse" size={32} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black tracking-tight text-emerald-50">Almost there!</h3>
              <p className="text-emerald-400/70 text-sm leading-relaxed">
                Hey! We're still polishing the AI engine to make sure your 3D models look perfect. 
                <span className="block mt-2 font-bold text-emerald-400">This feature will be live very soon. Stay tuned!</span>
              </p>
            </div>
            <button 
              onClick={() => setShowPopup(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-[#040d0a] py-4 rounded-2xl font-black transition-all shadow-lg uppercase tracking-widest text-xs"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 lg:p-12 space-y-12">
        
        {/* --- SIMPLE & CLEAR HEADER --- */}
        <div className="space-y-4 border-l-4 border-emerald-500 pl-8 py-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] tracking-[0.3em] uppercase">
                <Sparkles size={14} /> AI Powered Generation
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-none">
                2D TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">3D MODEL</span>
            </h1>
            <p className="text-emerald-500/60 font-medium text-lg max-w-2xl">
                Turn your ordinary 2D images into high-quality 3D assets instantly using our advanced neural engine.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- LEFT: CONTROL PANEL --- */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[3.5rem] opacity-10 group-hover:opacity-20 blur transition duration-1000"></div>
              <div className="relative bg-[#081511] rounded-[3.5rem] p-6 border border-emerald-500/10 shadow-2xl">
                <UploadZone onUpload={handleUpload} />
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a1a15] border border-emerald-500/5 p-6 rounded-[2.5rem] hover:border-emerald-500/20 transition-all group">
                    <TreePine className="text-emerald-500/40 group-hover:text-emerald-400 mb-3 transition-colors" size={24} />
                    <p className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest">Quality</p>
                    <p className="font-bold text-emerald-50">High Poly Mesh</p>
                </div>
                <div className="bg-[#0a1a15] border border-emerald-500/5 p-6 rounded-[2.5rem] hover:border-cyan-500/20 transition-all group">
                    <Globe className="text-cyan-500/40 group-hover:text-cyan-400 mb-3 transition-colors" size={24} />
                    <p className="text-[10px] font-black text-cyan-500/40 uppercase tracking-widest">Export</p>
                    <p className="font-bold text-emerald-50">.GLB Format</p>
                </div>
            </div>

            {/* Practical Advice */}
            <div className="bg-emerald-950/10 border border-emerald-500/10 p-6 rounded-[2.5rem] flex items-center gap-5">
              <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">Best Results</p>
                <p className="text-sm text-emerald-200/60 font-medium">Use clear images with a simple background for better 3D depth.</p>
              </div>
            </div>
          </div>

          {/* --- RIGHT: THE VIEWPORT --- */}
          <div className="lg:col-span-7 h-[700px] relative">
            
            {/* Viewport Labels */}
            <div className="absolute top-8 left-8 z-10">
              <div className="bg-black/20 backdrop-blur-xl border border-white/5 px-5 py-2 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black tracking-widest text-emerald-100/50 uppercase">3D Preview Studio</span>
              </div>
            </div>

            {/* Main Viewport Card */}
            <div className="w-full h-full bg-[#05110d] rounded-[4.5rem] border border-emerald-500/5 overflow-hidden relative shadow-2xl group">
                {modelUrl ? (
                    <ModelViewer modelUrl={modelUrl} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
                        <div className="relative">
                            <div className="absolute -inset-10 bg-emerald-500/5 rounded-full blur-[50px]"></div>
                            <Box size={160} strokeWidth={0.2} className="text-emerald-900/30 relative z-10 transition-transform duration-700 group-hover:scale-105" />
                            <Leaf className="absolute -top-2 -right-2 text-emerald-500/40" size={40} />
                        </div>
                        <div className="text-center">
                          <p className="text-emerald-500/20 font-black text-xs uppercase tracking-[0.4em]">Waiting for Image</p>
                          <p className="text-emerald-700 text-[11px] font-bold uppercase tracking-widest mt-2">Upload a photo to see the magic</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Simple Tech Footer */}
            <div className="absolute -bottom-4 left-10 right-10 bg-[#0d1f1a] border border-emerald-500/10 px-8 py-4 rounded-2xl shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">System Ready</span>
                </div>
                <div className="text-[10px] font-bold text-emerald-50/20 uppercase tracking-widest italic">
                   Powered by Advanced Neural Mesh Technology
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Generator3D;