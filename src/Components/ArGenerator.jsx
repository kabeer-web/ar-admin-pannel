import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Download, Activity, Cpu, Database, Palette, RotateCcw } from 'lucide-react';
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
  const [originalColor, setOriginalColor] = useState(null);
  
  const qrRef = useRef();
  const modelViewerRef = useRef();

  // URL FIXED: Proper HTTPS for Vercel
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";
  const CLOUD_NAME = "doa5h9wwi";
  const UPLOAD_PRESET = "ml_default"; 

  // Texture logic restore
  const handleColorChange = (color) => {
    setBaseColor(color);
    const viewer = modelViewerRef.current;
    if (viewer?.model?.materials[0]) {
      viewer.model.materials[0].pbrMetallicRoughness.setBaseColorFactor(color);
    }
  };

  const restoreOriginal = () => {
    const viewer = modelViewerRef.current;
    if (viewer?.model?.materials[0] && originalColor) {
      viewer.model.materials[0].pbrMetallicRoughness.setBaseColorFactor(originalColor);
      setBaseColor('#ffffff');
    }
  };

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (viewer) {
      const loadHandler = () => {
        if (viewer.model?.materials[0]) {
          setOriginalColor(viewer.model.materials[0].pbrMetallicRoughness.baseColorFactor);
        }
      };
      viewer.addEventListener('load', loadHandler);
      return () => viewer.removeEventListener('load', loadHandler);
    }
  }, [modelUrl]);

  const saveMatrixConfig = async () => {
    if (!publicUrl) return alert("Pehle model upload karein!");
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
        alert("Matrix Synced! ✅");
      }
    } catch (err) {
      console.error(err);
      alert("Sync Failed: Vercel connection error");
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
    } catch (err) {
      alert("Cloudinary Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#010604] p-4 lg:p-8 text-emerald-50 font-sans relative">
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-center bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-emerald-500/10 mb-8 gap-4 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-[#020806] p-4 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Cpu size={32} className="animate-pulse text-emerald-500"/>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">AR <span className="text-emerald-500">MATRIX</span></h1>
            <p className="text-[10px] text-emerald-500/40 tracking-[0.4em] uppercase font-bold italic">Spatial Memory Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
          <label htmlFor="glb-up" className="cursor-pointer bg-emerald-600 hover:bg-emerald-400 px-8 py-4 rounded-2xl font-black text-black flex items-center gap-3 uppercase text-sm transition-all shadow-lg active:scale-95">
            {loading ? <Activity className="animate-spin" size={20}/> : <Upload size={20}/>}
            {loading ? 'Transmitting...' : 'Injection GLB'}
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-black/60 rounded-[3.5rem] h-[550px] md:h-[650px] relative border border-emerald-500/10 overflow-hidden shadow-inner group">
            {modelUrl ? (
              <>
                <model-viewer 
                  ref={modelViewerRef}
                  src={modelUrl} 
                  auto-rotate 
                  camera-controls 
                  shadow-intensity="1.5"
                  exposure={exposure}
                  style={{width:'100%', height:'100%', backgroundColor: 'transparent'}} 
                />
                
                {/* TOOLBAR RESTORED */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 bg-black/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-emerald-500/10 shadow-2xl">
                  <div className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-emerald-500/5">
                    <p className="text-[10px] uppercase font-bold text-emerald-500/50 flex items-center gap-2"><Palette size={14}/> Texture</p>
                    <input type="color" value={baseColor} onChange={(e) => handleColorChange(e.target.value)} className="w-10 h-10 rounded-full bg-transparent border-none cursor-pointer" />
                    <button onClick={restoreOriginal} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 transition-all border border-emerald-500/20">
                      <RotateCcw size={14}/>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 flex-1 max-w-[300px]">
                    <button onClick={saveMatrixConfig} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                      {syncing ? <Activity className="animate-spin" size={14}/> : <Database size={14}/>}
                      {syncing ? "Syncing..." : "Sync to Matrix"}
                    </button>
                    <div className="flex flex-col gap-1 w-24">
                       <input type="range" min="0" max="3" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <Box size={100} className="text-emerald-500 animate-pulse"/>
                <p className="font-bold tracking-[0.8em] uppercase text-sm">System Standby</p>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-[#05110d] rounded-[3.5rem] border border-emerald-500/10 p-10 flex flex-col items-center justify-center shadow-2xl min-h-[550px] relative text-center">
            {savedId ? (
              <div className="flex flex-col items-center gap-10 w-full z-10">
                <div className="relative">
                  <div className="absolute -inset-6 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                  <div ref={qrRef} className="bg-white p-6 rounded-[2.5rem] border-[12px] border-black shadow-2xl relative z-10">
                    <QRCodeCanvas value={`${window.location.origin}/view?id=${savedId}`} size={220} fgColor="#000" level="H" />
                  </div>
                </div>
                <button onClick={() => {
                  const canvas = qrRef.current.querySelector('canvas');
                  const link = document.createElement("a");
                  link.href = canvas.toDataURL("image/png");
                  link.download = "Matrix-AR-Link.png";
                  link.click();
                }} className="w-full bg-emerald-600 hover:bg-emerald-400 py-6 rounded-3xl font-black text-black flex items-center justify-center gap-3 uppercase tracking-widest transition-all">
                  <Download size={22}/> Extract Asset
                </button>
              </div>
            ) : (
              <div className="opacity-10 flex flex-col items-center gap-8 py-20">
                <Smartphone size={100} className="text-emerald-500"/>
                <p className="font-black tracking-[0.4em] uppercase text-xs">Waiting for Sync</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;