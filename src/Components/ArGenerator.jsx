import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Palette, Download, Activity, Cpu, ImageIcon, X } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [qrColor, setQrColor] = useState('#10b981');
  const qrRef = useRef();

  const API_BASE_URL = "http://localhost:5000"; 

  // FIXED: Strictly point to the /view route
  const getARViewLink = () => {
    if (!publicUrl) return '';
    const origin = window.location.origin;
    return `${origin}/view?model=${encodeURIComponent(publicUrl)}`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.glb')) return;
    setModelUrl(URL.createObjectURL(file));
    setLoading(true);
    const formData = new FormData();
    formData.append('model', file); 
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData);
      if (res.data.url) {
        setPublicUrl(res.data.url);
        setLoading(false);
      }
    } catch (err) { setLoading(false); }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL("image/png");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "AR-Code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="w-full min-h-screen bg-[#020806] p-4 lg:p-8 text-emerald-50">
      <header className="flex justify-between items-center bg-[#05110d] p-8 rounded-[2.5rem] border border-emerald-500/10 mb-8">
        <div className="flex items-center gap-6">
          <div className="bg-[#020806] p-5 rounded-2xl text-emerald-400 border border-emerald-500/20"><Cpu size={32}/></div>
          <h1 className="text-3xl font-black italic uppercase">CODE GENERATOR <span className="text-emerald-500">AR</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
          <label htmlFor="glb-up" className="cursor-pointer bg-emerald-600 px-8 py-4 rounded-xl font-black text-black flex items-center gap-3 uppercase text-sm">
            <Upload size={20}/> Initialize GLB
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-auto">
        {/* Viewport */}
        <div className="bg-[#030c08] rounded-[3rem] min-h-[500px] relative border border-emerald-900/20 flex flex-col overflow-hidden">
          <div className="flex-1">
            {publicUrl ? (
              <model-viewer src={modelUrl} auto-rotate camera-controls shadow-intensity="2" style={{width:'100%', height:'100%'}} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20"><Box size={100}/></div>
            )}
          </div>
        </div>

        {/* QR Core */}
        <div className="flex flex-col gap-8">
          <div className="flex-1 bg-[#081511] rounded-[3rem] border border-emerald-900/30 p-10 flex flex-col items-center justify-center">
            {publicUrl ? (
              <div className="flex flex-col items-center gap-8 w-full">
                <div ref={qrRef} className="bg-white p-6 rounded-[2.5rem] border-[10px] border-[#020806]">
                  <QRCodeCanvas 
                    value={getARViewLink()} 
                    size={280}
                    fgColor={qrColor}
                    level="H"
                    imageSettings={logoUrl ? { src: logoUrl, height: 50, width: 50, excavate: true } : null}
                  />
                </div>
                <button onClick={downloadQRCode} className="w-full max-w-sm bg-emerald-600 py-5 rounded-2xl font-black text-black flex items-center justify-center gap-3 uppercase tracking-widest">
                  <Download size={20}/> Export Matrix
                </button>
              </div>
            ) : (
              <div className="opacity-20 flex flex-col items-center gap-4"><Smartphone size={80}/><p>Standby...</p></div>
            )}
          </div>

          {/* Branding Panel */}
          <div className={`bg-[#05110d] p-8 rounded-[2.5rem] border border-emerald-900/30 ${!publicUrl && 'opacity-20 pointer-events-none'}`}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-800 mb-3 tracking-[0.2em]">Matrix Tint</p>
                <input type="color" value={qrColor} onChange={(e)=>setQrColor(e.target.value)} className="w-full h-12 bg-transparent cursor-pointer" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-800 mb-3 tracking-[0.2em]">Neural Branding</p>
                {logoUrl ? (
                  <div className="flex items-center justify-between p-2 bg-black rounded-lg">
                    <img src={logoUrl} className="w-8 h-8 rounded border border-emerald-500/20" />
                    <button onClick={()=>setLogoUrl('')}><X size={16} className="text-red-500"/></button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center h-12 border-2 border-dashed border-emerald-900/40 rounded-lg cursor-pointer hover:border-emerald-500">
                    <input type="file" className="hidden" accept="image/*" onChange={(e)=>setLogoUrl(URL.createObjectURL(e.target.files[0]))} />
                    <ImageIcon size={18} className="text-emerald-900"/>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;