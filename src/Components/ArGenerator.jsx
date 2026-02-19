import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Activity, Cpu, Palette, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [exposure, setExposure] = useState(1);
  const [baseColor, setBaseColor] = useState('#ffffff'); 
  const [status, setStatus] = useState({ show: false, message: '', type: 'success' });

  const modelViewerRef = useRef();
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api"; // Replace with your actual backend URL

  const showNotification = (msg, type = 'success') => {
    setStatus({ show: true, message: msg, type });
    setTimeout(() => setStatus({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleColorChange = (color) => {
    setBaseColor(color);
    const viewer = modelViewerRef.current;
    if (viewer?.model?.materials[0]) {
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;
      viewer.model.materials[0].pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
    }
  };

  const saveMatrixConfig = async () => {
    if (!publicUrl) return showNotification("Upload a model first!", "error");
    setSyncing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/save-config`, {
        publicUrl: publicUrl,
        baseColor: baseColor, 
        exposure: exposure,
        ownerId: "admin_1" 
      });

      if (response.data.success) {
        setSavedId(response.data.modelId);
        showNotification("MATRIX SYNCED SUCCESSFULLY", "success");
      }
    } catch (err) {
      showNotification("SYNC FAILED", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModelUrl(URL.createObjectURL(file));
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "ml_default"); 
    
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/doa5h9wwi/auto/upload`, formData);
      setPublicUrl(res.data.secure_url);
      showNotification("GLB INJECTED", "success");
    } catch (err) {
      showNotification("UPLOAD FAILED", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#010604] p-4 text-emerald-50">
      {status.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500/20 border border-emerald-500/50 p-4 rounded-xl backdrop-blur-md">
          <span className="font-bold uppercase tracking-widest text-xs italic">{status.message}</span>
        </div>
      )}

      <header className="flex justify-between items-center bg-black/40 p-6 rounded-[2rem] border border-emerald-500/10 mb-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <Cpu size={32} className="text-emerald-500 animate-pulse"/>
          <h1 className="text-2xl font-black italic uppercase">AR <span className="text-emerald-500">MATRIX</span></h1>
        </div>
        <label className="cursor-pointer bg-emerald-600 px-6 py-3 rounded-xl font-black text-black flex items-center gap-2 uppercase text-xs transition-all">
          <input type="file" className="hidden" onChange={handleFileUpload} accept=".glb" />
          {loading ? <Activity className="animate-spin" /> : <Upload />} INJECTION GLB
        </label>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-black/60 rounded-[3rem] h-[500px] relative border border-emerald-500/10 overflow-hidden">
          {modelUrl ? (
            <>
              <model-viewer ref={modelViewerRef} src={modelUrl} camera-controls exposure={exposure} style={{width:'100%', height:'100%'}} />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-black/80 p-4 rounded-2xl border border-emerald-500/10">
                <input type="color" value={baseColor} onChange={(e) => handleColorChange(e.target.value)} className="w-10 h-10 rounded-full cursor-pointer bg-transparent border-none" />
                <input type="range" min="0" max="3" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} className="w-1/2 accent-emerald-500" />
                <button onClick={saveMatrixConfig} className="bg-emerald-500 text-black px-4 py-2 rounded-lg font-black text-[10px] uppercase">
                  {syncing ? "Syncing..." : "Sync Matrix"}
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center opacity-20"><Box size={60} /></div>
          )}
        </div>
        <div className="lg:col-span-4 bg-[#05110d] rounded-[3rem] p-10 flex flex-col items-center justify-center border border-emerald-500/10 min-h-[400px]">
          {savedId ? (
            <div className="bg-white p-4 rounded-2xl">
              <QRCodeCanvas value={`${window.location.origin}/view?id=${savedId}`} size={180} />
            </div>
          ) : <Smartphone size={60} className="opacity-10 text-emerald-500"/>}
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;