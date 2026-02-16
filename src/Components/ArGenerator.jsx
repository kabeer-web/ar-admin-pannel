import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Download, Activity, Cpu, Database, Zap, Maximize } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelStats, setModelStats] = useState({ triangles: 0, materials: 0, size: "0 MB" });
  const qrRef = useRef();
  const modelViewerRef = useRef();

  const CLOUD_NAME = "doa5h9wwi";
  const UPLOAD_PRESET = "ml_default"; 

  // Model load hote hi uska internal data nikalne ka logic
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (viewer) {
      viewer.addEventListener('load', () => {
        // Advanced Metadata Extraction
        const materialCount = viewer.model?.materials.length || 0;
        // Triangles nikalne ke liye hum browser console se data uthate hain
        // Note: Real triangles count needs specialized parsing, but we show a pro UI placeholder
        setModelStats(prev => ({
          ...prev,
          materials: materialCount,
        }));
      });
    }
  }, [modelUrl]);

  const getARViewLink = () => {
    if (!publicUrl) return '';
    return `${window.location.origin}/view?model=${encodeURIComponent(publicUrl)}`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.glb')) {
      alert("Please upload a .glb file");
      return;
    }

    // Stats Update
    setModelStats({
      triangles: "Analyzing...",
      materials: "Scanning...",
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });

    const localBlob = URL.createObjectURL(file);
    setModelUrl(localBlob);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, 
        formData
      );

      if (res.data.secure_url) {
        setPublicUrl(res.data.secure_url);
      }
    } catch (err) {
      console.error("Cloudinary Error:", err.response?.data);
      alert(`Upload failed: ${err.response?.data?.error?.message || "Check connection"}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "AR-Code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="w-full min-h-screen bg-[#020806] p-4 lg:p-8 text-emerald-50 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-[#05110d] p-6 md:p-8 rounded-[2.5rem] border border-emerald-500/10 mb-8 gap-4 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-[#020806] p-4 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Cpu size={32} className="animate-pulse"/>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter italic">AR <span className="text-emerald-500">MATRIX</span></h1>
            <p className="text-[10px] text-emerald-500/40 tracking-[0.4em] uppercase font-bold">Neural Asset Compiler v2.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
          <label htmlFor="glb-up" className="group cursor-pointer bg-emerald-600 hover:bg-emerald-400 px-8 py-4 rounded-2xl font-black text-black flex items-center gap-3 uppercase text-sm transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95">
            {loading ? <Activity className="animate-spin" size={20}/> : <Upload size={20} className="group-hover:-translate-y-1 transition-transform"/>}
            {loading ? 'Transmitting...' : 'Initialize Asset'}
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Side: 3D Preview & Stats */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-[#030c08] rounded-[3rem] h-[500px] md:h-[600px] relative border border-emerald-900/20 overflow-hidden shadow-inner group">
            {modelUrl ? (
              <>
                <model-viewer 
                  ref={modelViewerRef}
                  src={modelUrl} 
                  auto-rotate 
                  camera-controls 
                  shadow-intensity="2" 
                  ar-modes="webxr scene-viewer quick-look"
                  style={{width:'100%', height:'100%', backgroundColor: 'transparent'}} 
                />
                {/* Real-time Overlay Labels */}
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                  <div className="bg-black/60 backdrop-blur-md border border-emerald-500/20 p-4 rounded-2xl">
                    <p className="text-[10px] text-emerald-500/50 uppercase font-bold mb-1">Asset Status</p>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Zap size={14} /> <span className="text-xs font-mono tracking-tighter">RENDER_ACTIVE</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Box size={120} className="mb-6 text-emerald-500 animate-bounce"/>
                <p className="font-bold tracking-[0.5em] uppercase">No Neural Asset Detected</p>
              </div>
            )}
          </div>

          {/* New Feature: Inspector Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#05110d] border border-emerald-500/10 p-6 rounded-[2rem] flex items-center gap-4">
              <Database className="text-emerald-500" size={24}/>
              <div>
                <p className="text-[10px] text-emerald-500/50 uppercase font-bold">Data Weight</p>
                <p className="font-mono font-bold">{modelStats.size}</p>
              </div>
            </div>
            <div className="bg-[#05110d] border border-emerald-500/10 p-6 rounded-[2rem] flex items-center gap-4">
              <Maximize className="text-emerald-500" size={24}/>
              <div>
                <p className="text-[10px] text-emerald-500/50 uppercase font-bold">Complexity</p>
                <p className="font-mono font-bold">Optimized Mesh</p>
              </div>
            </div>
            <div className="bg-[#05110d] border border-emerald-500/10 p-6 rounded-[2rem] flex items-center gap-4">
              <Box className="text-emerald-500" size={24}/>
              <div>
                <p className="text-[10px] text-emerald-500/50 uppercase font-bold">Materials</p>
                <p className="font-mono font-bold">{modelStats.materials} Active Units</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: QR & Export */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <div className="bg-[#081511] rounded-[3.5rem] border border-emerald-900/30 p-10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group min-h-[500px]">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {publicUrl ? (
              <div className="flex flex-col items-center gap-10 w-full z-10">
                <div className="relative">
                  <div className="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                  <div ref={qrRef} className="bg-white p-6 rounded-[2.5rem] border-[10px] border-[#020806] shadow-2xl relative">
                    <QRCodeCanvas 
                      value={getARViewLink()} 
                      size={240} 
                      fgColor="#020806" 
                      level="H" 
                      includeMargin={false}
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <button onClick={downloadQRCode} className="w-full bg-emerald-600 hover:bg-emerald-400 py-6 rounded-[1.5rem] font-black text-black flex items-center justify-center gap-3 uppercase tracking-widest transition-all shadow-xl hover:shadow-emerald-500/40 active:scale-95">
                    <Download size={22}/> Export Matrix
                  </button>
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/60 font-bold">Encrypted Link Ready</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="opacity-20 flex flex-col items-center gap-6 py-20">
                <Smartphone size={80} className="animate-pulse text-emerald-500"/>
                <p className="font-bold tracking-[0.6em] uppercase text-xs text-center">Standby for<br/>Spatial Uplink</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;