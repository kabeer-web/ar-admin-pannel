import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Loader2, Box, Palette, Image as ImageIcon, Zap, Share2, Download, MousePointer2, Expand } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const qrRef = useRef();

  const [qrColor, setQrColor] = useState('#2563eb');
  const [qrBg, setQrBg] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState(''); 

  const API_BASE_URL = "http://localhost:5000"; 

  const getARViewLink = () => {
    if (!publicUrl) return '';
    return `${window.location.origin}/view?model=${encodeURIComponent(publicUrl)}`;
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL("image/png");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "AR-QR.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.glb')) return;
    setModelUrl(URL.createObjectURL(file));
    setLoading(true);
    setUploadStep('Syncing Asset...');
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

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 transition-colors duration-300">
      
      {/* Header */}
      <header className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
           <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Zap size={20} fill="currentColor"/></div>
           <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">AR Studio <span className="text-blue-600">Pro</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
           <label htmlFor="glb-up" className="cursor-pointer bg-slate-900 dark:bg-blue-600 text-white px-6 py-2 rounded-2xl text-sm font-bold hover:opacity-80 transition-all flex items-center gap-2">
              <Upload size={16}/> Upload GLB
           </label>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)]">
        {/* 3D Viewport */}
        <div className="flex-[3] bg-slate-200 dark:bg-[#0f172a] rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-slate-300 dark:border-white/5">
            {publicUrl ? (
                <model-viewer src={modelUrl} auto-rotate camera-controls shadow-intensity="1" environment-image="neutral" style={{width:'100%', height:'100%'}} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-10 space-y-6">
                    <Box size={60} className="text-slate-400 dark:text-white/20 animate-pulse"/>
                    <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs">Awaiting Asset Upload</p>
                </div>
            )}
        </div>

        {/* Sidebar Controls */}
        <div className="flex-1 flex flex-col gap-6 min-w-[380px]">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
                {publicUrl ? (
                    <div className="w-full space-y-6">
                        <div ref={qrRef} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner">
                            <QRCodeCanvas value={getARViewLink()} size={200} fgColor={qrColor} bgColor={qrBg} level="H" imageSettings={logoUrl ? { src: logoUrl, height: 40, width: 40, excavate: true } : null} />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={downloadQRCode} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg">
                                <Download size={16}/> DOWNLOAD PNG
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                        <Smartphone size={40} className="mb-2 opacity-20"/>
                        <p className="text-[10px] font-black uppercase tracking-widest">QR Ready for link</p>
                    </div>
                )}
            </div>

            <div className={`bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 flex-1 space-y-6 ${!publicUrl && 'opacity-40 pointer-events-none'}`}>
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2"><Palette size={14}/> Design Studio</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">QR Color</p>
                        <input type="color" value={qrColor} onChange={(e)=>setQrColor(e.target.value)} className="w-full h-8 bg-transparent cursor-pointer" />
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Canvas</p>
                        <input type="color" value={qrBg} onChange={(e)=>setQrBg(e.target.value)} className="w-full h-8 bg-transparent cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;