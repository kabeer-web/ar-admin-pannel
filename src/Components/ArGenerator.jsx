import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Upload, Smartphone, Box, Download, Activity, 
  Cpu, Database, Palette, RotateCcw, CheckCircle2, XCircle, Zap 
} from 'lucide-react';
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

  const qrRef = useRef();
  const modelViewerRef = useRef();

  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";
  const CLOUD_NAME = "doa5h9wwi";
  const UPLOAD_PRESET = "ml_default"; 

  const showNotification = (msg, type = 'success') => {
    setStatus({ show: true, message: msg, type });
    setTimeout(() => setStatus({ show: false, message: '', type: 'success' }), 3000);
  };

  // Logic to apply color to the live preview
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
        modelName: "Project_Alpha",
        publicUrl: publicUrl,
        baseColor: baseColor, 
        exposure: exposure,
        hotspots: [], 
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
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, formData);
      setPublicUrl(res.data.secure_url);
      showNotification("GLB INJECTED", "success");
    } catch (err) {
      showNotification("UPLOAD FAILED", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#010604] p-4 lg:p-8 text-emerald-50 font-sans relative">
      {status.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce-short">
          <div className={`flex items-center gap-4 px-8 py-4 rounded-2xl border backdrop-blur-3xl shadow-2xl ${
            status.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
          }`}>
            <CheckCircle2 size={20} />
            <span className="font-black uppercase tracking-widest text-xs italic">{status.message}</span>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-center bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-emerald-500/10 mb-8 gap-4 shadow-2xl">
        <div className="flex items-center gap-6">
          <Cpu size={32} className="text-emerald-500 animate-pulse"/>
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">AR <span className="text-emerald-500">MATRIX</span></h1>
        </div>
        <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-400 px-8 py-4 rounded-2xl font-black text-black flex items-center gap-3 uppercase text-sm transition-all shadow-lg">
          <input type="file" className="hidden" onChange={handleFileUpload} accept=".glb" />
          {loading ? <Activity className="animate-spin" size={20}/> : <Upload size={20}/>}
          INJECTION GLB
        </label>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 bg-black/60 rounded-[3.5rem] h-[550px] relative border border-emerald-500/10 overflow-hidden shadow-2xl">
          {modelUrl ? (
            <>
              <model-viewer 
                ref={modelViewerRef}
                src={modelUrl} 
                camera-controls 
                exposure={exposure}
                style={{width:'100%', height:'100%'}} 
              />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-black/80 backdrop-blur-md p-6 rounded-[2rem] border border-emerald-500/10">
                <div className="flex items-center gap-4">
                  <Palette className="text-emerald-500" size={20}/>
                  <input type="color" value={baseColor} onChange={(e) => handleColorChange(e.target.value)} className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer" />
                </div>
                <div className="flex items-center gap-4 flex-1 max-w-[200px] ml-4">
                  <input type="range" min="0" max="3" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                <button onClick={saveMatrixConfig} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase ml-4">
                  {syncing ? "Syncing..." : "Sync Matrix"}
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Box size={80} className="mb-4 animate-pulse" />
              <p className="font-black uppercase tracking-widest">Awaiting Neural Link</p>
            </div>
          )}
        </div>
        <div className="xl:col-span-4 bg-[#05110d] rounded-[3.5rem] p-10 flex flex-col items-center justify-center border border-emerald-500/10 min-h-[500px]">
          {savedId ? (
            <div className="flex flex-col items-center gap-6">
              <div ref={qrRef} className="bg-white p-6 rounded-[2rem]">
                <QRCodeCanvas value={`${window.location.origin}/view?id=${savedId}`} size={200} />
              </div>
              <p className="text-emerald-500/50 text-[10px] uppercase font-bold tracking-widest">Link Encrypted & Ready</p>
            </div>
          ) : <Smartphone size={80} className="opacity-10 text-emerald-500"/>}
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;