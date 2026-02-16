import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Download, Activity, Cpu, Database, Zap, Sun, Palette, Play } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelStats, setModelStats] = useState({ materials: 0, size: "0 MB" });
  
  // Customization States
  const [exposure, setExposure] = useState(1);
  const [baseColor, setBaseColor] = useState('#10b981'); // Default Emerald
  
  const qrRef = useRef();
  const modelViewerRef = useRef();

  const CLOUD_NAME = "doa5h9wwi";
  const UPLOAD_PRESET = "ml_default"; 

  // Model Color Change Logic
  const handleColorChange = (color) => {
    setBaseColor(color);
    const viewer = modelViewerRef.current;
    if (viewer && viewer.model) {
      const material = viewer.model.materials[0]; // First material pakra
      if (material) {
        material.pbrMetallicRoughness.setBaseColorFactor(color);
      }
    }
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
    <div className="w-full min-h-screen bg-[#010604] p-4 lg:p-8 text-emerald-50 font-sans relative overflow-x-hidden">
      
      {/* Background Matrix Effect Placeholder - Professional Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-center bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-emerald-500/10 mb-8 gap-4 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-[#020806] p-4 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Cpu size={32} className="animate-pulse text-emerald-500"/>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter italic">AR <span className="text-emerald-500">MATRIX</span> ENGINE</h1>
            <p className="text-[10px] text-emerald-500/40 tracking-[0.4em] uppercase font-bold italic">Neural Reconstruction Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
          <label htmlFor="glb-up" className="cursor-pointer bg-emerald-600 hover:bg-emerald-400 px-8 py-4 rounded-2xl font-black text-black flex items-center gap-3 uppercase text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95">
            {loading ? <Activity className="animate-spin" size={20}/> : <Upload size={20}/>}
            {loading ? 'Transmitting...' : 'Injection GLB'}
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Left: 3D Workspace */}
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
                  ar
                  style={{width:'100%', height:'100%', backgroundColor: 'transparent'}} 
                />
                
                {/* Advanced Multi-Control Panel */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-black/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-emerald-500/10 shadow-2xl">
                    
                    {/* Color Picker Feature */}
                    <div className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-emerald-500/5">
                      <p className="text-[10px] uppercase font-bold text-emerald-500/50 flex items-center gap-2"><Palette size={14}/> Texture Hue</p>
                      <input 
                        type="color" 
                        value={baseColor} 
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-10 h-10 rounded-full overflow-hidden bg-transparent border-none cursor-pointer"
                      />
                    </div>

                    {/* Brightness Slider */}
                    <div className="flex flex-col gap-1 flex-1 max-w-[200px]">
                      <p className="text-[10px] uppercase font-bold text-emerald-500/50 flex items-center gap-2"><Sun size={14}/> Luminance</p>
                      <input type="range" min="0" max="3" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} 
                        className="w-full accent-emerald-500" />
                    </div>

                    {/* Animation Controls Placeholder */}
                    <div className="flex gap-2 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                       <p className="text-[10px] font-black uppercase px-2 text-emerald-400">PBR_RENDER_HQ</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <div className="relative mb-6">
                  <div className="absolute -inset-8 bg-emerald-500/10 blur-3xl rounded-full" />
                  <Box size={100} className="text-emerald-500 animate-pulse relative"/>
                </div>
                <p className="font-bold tracking-[0.8em] uppercase text-sm">System Standby</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: The Engine */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-[#05110d] rounded-[3.5rem] border border-emerald-500/10 p-10 flex flex-col items-center justify-between shadow-2xl min-h-[550px] relative">
            <div className="w-full">
               <h3 className="text-center text-[10px] tracking-[0.5em] font-black uppercase text-emerald-500/40 mb-8">Spatial Export Protocol</h3>
            </div>
            
            {publicUrl ? (
              <div className="flex flex-col items-center gap-10 w-full z-10">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-emerald-500/20 blur-2xl rounded-full animate-pulse group-hover:bg-emerald-500/30 transition-all" />
                  <div ref={qrRef} className="bg-white p-6 rounded-[2.5rem] border-[12px] border-black shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10">
                    <QRCodeCanvas value={getARViewLink()} size={220} fgColor="#000" level="H" />
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <button onClick={downloadQRCode} className="group w-full bg-emerald-600 hover:bg-emerald-400 py-6 rounded-3xl font-black text-black flex items-center justify-center gap-3 uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
                    <Download size={22} className="group-hover:bounce"/> Extract Asset
                  </button>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold tracking-[0.3em]">Data Link Secure</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="opacity-10 flex flex-col items-center gap-8 py-20">
                <Smartphone size={100} className="text-emerald-500"/>
                <p className="font-black tracking-[0.4em] uppercase text-xs text-center leading-loose">Initialize Uplink<br/>to Generate QR</p>
              </div>
            )}
            
            {/* Model Info Mini-Panel */}
            <div className="w-full border-t border-emerald-500/5 pt-6 mt-6">
               <div className="flex justify-between items-center px-4">
                  <span className="text-[9px] uppercase font-bold text-emerald-500/30 tracking-widest">Model Size:</span>
                  <span className="text-xs font-mono text-emerald-400">{modelStats.size}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;