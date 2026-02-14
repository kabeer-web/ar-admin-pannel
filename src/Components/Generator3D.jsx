import React, { useState } from 'react';
import axios from 'axios';
import UploadZone from './UploadZone';
import ModelViewer from './ModelViewer';
import { Loader2, Download, Box, RefreshCcw } from 'lucide-react';

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
        const msg = err.response?.data?.error || "Connection error. Try again.";
        setError(msg);
        setLoading(false);
      }
    };
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black italic text-slate-900">
          PRO<span className="text-blue-600">3D</span> <span className="text-sm font-normal not-italic text-slate-400">BYPASS MODE</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <UploadZone onUpload={handleUpload} />
          
          {loading && (
            <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white flex flex-col items-center gap-4 shadow-xl shadow-blue-200 animate-pulse">
              <Loader2 className="animate-spin" size={32} />
              <p className="font-bold uppercase text-xs tracking-[0.2em]">{status}</p>
            </div>
          )}

          {error && (
            <div className="p-5 bg-red-50 border-2 border-red-100 text-red-600 rounded-3xl text-sm font-bold flex items-start gap-3">
              <span className="bg-red-600 text-white rounded-full px-2 text-[10px]">!</span>
              {error}
            </div>
          )}

          {modelUrl && (
            <a href={modelUrl} download="3d_model.glb" className="flex items-center justify-center gap-3 w-full bg-slate-900 hover:bg-black text-white p-6 rounded-[2rem] font-bold transition-all transform hover:scale-[1.02]">
              <Download size={22} /> DOWNLOAD GLB FILE
            </a>
          )}
        </div>

        <div className="h-[550px] bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden relative group">
          {modelUrl ? (
            <ModelViewer modelUrl={modelUrl} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-200">
              <Box size={120} strokeWidth={0.5} className="group-hover:text-blue-100 transition-colors" />
              <p className="mt-4 font-black text-[10px] uppercase tracking-[0.3em] text-slate-300">Awaiting 3D Generation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator3D;