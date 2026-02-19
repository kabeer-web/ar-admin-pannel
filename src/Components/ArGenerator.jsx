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

  // URL FIX: Strict HTTPS for Vercel
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";
  const CLOUD_NAME = "doa5h9wwi";
  const UPLOAD_PRESET = "ml_default"; 

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
      alert("Sync Failed: Check Vercel Logs");
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
    <div className="w-full min-h-screen bg-[#010604] p-8 text-emerald-50 font-sans">
      <header className="flex justify-between items-center bg-black/40 p-8 rounded-[2.5rem] border border-emerald-500/10 mb-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <Cpu size={32} className="text-emerald-500 animate-pulse"/>
          <h1 className="text-3xl font-black italic uppercase">AR <span className="text-emerald-500">MATRIX</span></h1>
        </div>
        <label className="cursor-pointer bg-emerald-600 px-8 py-4 rounded-2xl font-black text-black flex items-center gap-3">
          <input type="file" className="hidden" onChange={handleFileUpload} accept=".glb" />
          {loading ? <Activity className="animate-spin" size={20}/> : <Upload size={20}/>}
          INJECTION GLB
        </label>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-black/60 rounded-[3.5rem] h-[600px] relative border border-emerald-500/10 overflow-hidden">
          {modelUrl ? (
            <model-viewer 
              ref={modelViewerRef}
              src={modelUrl} 
              camera-controls 
              exposure={exposure}
              style={{width:'100%', height:'100%'}} 
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Box size={100} className="text-emerald-500"/>
              <p className="uppercase mt-4 tracking-widest">System Standby</p>
            </div>
          )}
        </div>

        <div className="col-span-4 bg-[#05110d] rounded-[3.5rem] p-10 flex flex-col items-center justify-center border border-emerald-500/10">
          {savedId ? (
            <div ref={qrRef} className="bg-white p-6 rounded-[2.5rem] shadow-2xl">
              <QRCodeCanvas value={`${window.location.origin}/view?id=${savedId}`} size={220} />
            </div>
          ) : (
            <Smartphone size={100} className="opacity-10 text-emerald-500"/>
          )}
          <button onClick={saveMatrixConfig} className="w-full mt-10 bg-emerald-500 hover:bg-emerald-400 text-black py-6 rounded-3xl font-black uppercase tracking-widest transition-all">
            {syncing ? "Syncing..." : "Sync to Matrix"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;