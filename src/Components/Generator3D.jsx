import React, { useState } from 'react';
import axios from 'axios';
import UploadZone from './UploadZone';
import ModelViewer from './ModelViewer';
import { Loader2, Download, Box, Sparkles } from 'lucide-react';

const Generator3D = () => {
  const [loading, setLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    setModelUrl(null);
    setStatus('AI is building 3D mesh...');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/generate', {
          image: reader.result
        });
        if (response.data.model) {
          setModelUrl(response.data.model);
          setLoading(false);
          setStatus('Ready!');
        }
      } catch (err) {
        setError(err.response?.data?.error || "Generation failed. Check API.");
        setLoading(false);
      }
    };
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 transition-colors duration-300">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Box className="text-blue-600" size={32} />
          2D TO <span className="text-blue-600">3D</span> ENGINE
        </h1>
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
          AI Model v4.0
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <UploadZone onUpload={handleUpload} />
          </div>
          
          {loading && (
            <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white flex flex-col items-center gap-4 shadow-2xl shadow-blue-500/20 animate-pulse">
              <Loader2 className="animate-spin" size={32} />
              <p className="font-bold uppercase text-xs tracking-[0.2em]">{status}</p>
            </div>
          )}

          {error && (
            <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-3xl text-sm font-bold flex items-center gap-3">
              <span className="bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px]">!</span>
              {error}
            </div>
          )}

          {modelUrl && (
            <a href={modelUrl} download className="flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-blue-600 hover:scale-[1.02] text-white p-6 rounded-[2rem] font-bold transition-all shadow-xl">
              <Download size={22} /> DOWNLOAD GLB ASSET
            </a>
          )}
        </div>

        {/* Viewport Card */}
        <div className="h-[600px] bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative group">
          {modelUrl ? (
            <ModelViewer modelUrl={modelUrl} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-200 dark:text-slate-800">
              <div className="relative">
                 <Box size={140} strokeWidth={0.5} className="group-hover:text-blue-500/20 transition-colors" />
                 <Sparkles className="absolute -top-4 -right-4 text-blue-500/30 animate-bounce" size={40} />
              </div>
              <p className="mt-6 font-black text-[10px] uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600">Awaiting Neural Processing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator3D;