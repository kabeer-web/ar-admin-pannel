import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Box, Smartphone, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const qrRef = useRef();

  // Vercel par ye automatic current domain utha lega
  const API_BASE_URL = window.location.origin; 

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.glb')) {
      setError("Please upload a valid .glb file.");
      return;
    }

    setModelUrl(URL.createObjectURL(file));
    setError(null);
    setSuccess(false);
    setPublicUrl('');
    setLoading(true);

    const formData = new FormData();
    formData.append('model', file);

    try {
      // Direct /api call for Vercel Serverless
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.url) {
        setPublicUrl(res.data.url);
        setSuccess(true);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setError("Server error! Make sure Cloudinary keys are in Vercel Settings.");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'ar-model-qr.png';
    link.click();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight text-center lg:text-left">AR Studio Pro</h1>
        <p className="text-slate-500 font-medium text-center lg:text-left">Upload your .glb model and scan to view in AR.</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-700 font-bold max-w-2xl mx-auto lg:mx-0">
          <AlertCircle size={20} /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-3 text-green-700 font-bold max-w-2xl mx-auto lg:mx-0">
          <CheckCircle2 size={20} /> Success! Scan the QR code below.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-center">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">1. Step: Upload Model</label>
          <label className="flex flex-col items-center justify-center w-full h-72 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-blue-50 transition-all group relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <span className="font-black text-blue-600 tracking-widest uppercase">Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="text-slate-300 group-hover:text-blue-500 mb-4 transition-colors" size={48} />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">Drop .glb file here</span>
              </>
            )}
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".glb" disabled={loading} />
          </label>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-8 flex flex-col items-center justify-center text-white shadow-2xl min-h-[550px]">
          {modelUrl ? (
            <div className="w-full flex flex-col space-y-6 h-full">
              <div className="flex-1 bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 min-h-[300px]">
                <model-viewer src={modelUrl} ar camera-controls auto-rotate shadow-intensity="1" style={{ width: '100%', height: '100%' }} />
              </div>

              {publicUrl && (
                <div className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center space-y-4 animate-in zoom-in">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
                    <Smartphone size={18} className="text-blue-600" /> AR Quick Look
                  </div>
                  <div ref={qrRef} className="p-2 bg-slate-50 rounded-xl">
                    <QRCodeCanvas value={publicUrl} size={160} level="H" />
                  </div>
                  <button onClick={downloadQR} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                    <Download size={14} /> SAVE QR CODE
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-20 space-y-4">
              <Box size={100} strokeWidth={1} />
              <p className="font-bold uppercase tracking-widest text-sm">Waiting for asset...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;