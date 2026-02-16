import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Download, Activity, Cpu, Database, Zap, Sun, Moon, Wind } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelStats, setModelStats] = useState({ materials: 0, size: "0 MB" });
  
  // Naye Advance States
  const [exposure, setExposure] = useState(1);
  const [environment, setEnvironment] = useState('neutral');
  
  const qrRef = useRef();
  const modelViewerRef = useRef();

  const CLOUD_NAME = "doa5h9wwi";
  const UPLOAD_PRESET = "ml_default"; 

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (viewer) {
      viewer.addEventListener('load', () => {
        const materialCount = viewer.model?.materials.length || 0;
        setModelStats(prev => ({ ...prev, materials: materialCount }));
      });
    }
  }, [modelUrl]);

  const getARViewLink = () => {
    if (!publicUrl) return '';
    // Hum exposure aur env bhi bhej sakte hain agar view page handle kare
    return `${window.location.origin}/view?model=${encodeURIComponent(publicUrl)}&exp=${exposure}&env=${environment}`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.glb')) {
      alert("Please upload a .glb file");
      return;
    }

    setModelStats({ materials: "Scanning...", size: (file.size / (1024 * 1024)).toFixed(2) + " MB" });
    const localBlob = URL.createObjectURL(file);
    setModelUrl(localBlob);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, formData);
      if (res.data.secure_url) setPublicUrl(res.data.secure_url);
    } catch (err) {
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
    <div className="w-full min-h-screen bg-[#020806] p-4 lg:p-8 text-emerald-50 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-[#05110d] p-6 md:p-8 rounded-[2.5rem] border border-emerald-500/10 mb-8 gap-4 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-[#020806] p-4 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Cpu size={32} className="animate-pulse"/>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">AR <span className="text-emerald-500">MATRIX</span></h1>
            <p className="text-[10px] text-emerald-500/40 tracking-[0.4em] uppercase font-bold">Spatial Configurator v3.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
          <label htmlFor="glb-up" className="cursor-pointer bg-emerald-600 hover:bg-emerald-400 px-8 py-4 rounded-2xl font-black text-black flex items-center gap-3 uppercase text-sm transition-all shadow-lg active:scale-95">
            {loading ? <Activity className="animate-spin" size={20}/> : <Upload size={20}/>}
            {loading ? 'Transmitting...' : 'Upload Asset'}
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: 3D Studio */}
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
                  exposure={exposure}
                  environment-image={environment}
                  style={{width:'100%', height:'100%', backgroundColor: 'transparent'}} 
                />
                
                {/* Real-time Environment Controls Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 bg-black/40 backdrop-blur-xl p-6 rounded-[2rem] border border-emerald-500/10">
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <p className="text-[10px] uppercase font-bold text-emerald-500/50 flex items-center gap-2"><Sun size={12}/> Exposure (Brightness)</p>
                    <input type="range" min="0" max="2" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} 
                      className="w-full md:w-48 accent-emerald-500 bg-emerald-900/20 rounded-lg" />
                  </div>
                  
                  <div className="flex gap-2 bg-black/40 p-1 rounded-xl">
                    <button onClick={() => setEnvironment('neutral')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${environment === 'neutral' ? 'bg-emerald-600 text-black' : 'hover:bg-emerald-500/10'}`}>Neutral</button>
                    <button onClick={() => setEnvironment('legacy')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${environment === 'legacy' ? 'bg-emerald-600 text-black' : 'hover:bg-emerald-500/10'}`}>Studio</button>
                    <button onClick={() => setEnvironment('city')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${environment === 'city' ? 'bg-emerald-600 text-black' : 'hover:bg-emerald-500/10'}`}>City</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Box size={100} className="mb-4 text-emerald-500"/>
                <p className="font-bold tracking-[0.5em] uppercase">Ready for Uplink</p>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#05110d] p-6 rounded-3xl border border-emerald-500/5 flex items-center gap-4">
              <Database className="text-emerald-500/50" size={20}/>
              <div><p className="text-[10px] uppercase text-emerald-500/30">Weight</p><p className="font-mono text-sm">{modelStats.size}</p></div>
            </div>
            <div className="bg-[#05110d] p-6 rounded-3xl border border-emerald-500/5 flex items-center gap-4">
              <Zap className="text-emerald-500/50" size={20}/>
              <div><p className="text-[10px] uppercase text-emerald-500/30">Engine</p><p className="font-mono text-sm tracking-tighter text-emerald-400">WEBGL_PRO</p></div>
            </div>
            <div className="bg-[#05110d] p-6 rounded-3xl border border-emerald-500/5 hidden md:flex items-center gap-4">
              <Box className="text-emerald-500/50" size={20}/>
              <div><p className="text-[10px] uppercase text-emerald-500/30">Materials</p><p className="font-mono text-sm">{modelStats.materials} Units</p></div>
            </div>
          </div>
        </div>

        {/* Right: QR Engine */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-[#081511] rounded-[3.5rem] border border-emerald-900/30 p-8 flex flex-col items-center justify-center shadow-2xl min-h-[500px] relative">
            {publicUrl ? (
              <div className="flex flex-col items-center gap-8 w-full">
                <div className="bg-emerald-500/5 absolute inset-0 animate-pulse pointer-events-none" />
                <div ref={qrRef} className="bg-white p-6 rounded-[2.5rem] border-[10px] border-black shadow-2xl relative z-10 scale-110">
                  <QRCodeCanvas value={getARViewLink()} size={220} fgColor="#000" level="H" />
                </div>
                <button onClick={downloadQRCode} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-400 py-6 rounded-2xl font-black text-black flex items-center justify-center gap-3 uppercase tracking-widest transition-all z-10 shadow-xl">
                  <Download size={20}/> Download QR
                </button>
                <div className="flex items-center gap-2 opacity-50">
                  <Smartphone size={14}/> <p className="text-[10px] uppercase tracking-widest">AR Link Synced</p>
                </div>
              </div>
            ) : (
              <div className="opacity-10 flex flex-col items-center gap-6">
                <Smartphone size={100} className="text-emerald-500"/>
                <p className="font-bold tracking-[0.5em] uppercase text-xs">Waiting for Data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;