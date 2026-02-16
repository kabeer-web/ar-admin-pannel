import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Download, Activity, Cpu } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const qrRef = useRef();

  const CLOUD_NAME = "doa5h9wwi";
  const UPLOAD_PRESET = "ml_default"; 

  const getARViewLink = () => {
    if (!publicUrl) return '';
    // Scan karne par ye aapki site ke /view page par jayega model ke sath
    return `${window.location.origin}/view?model=${encodeURIComponent(publicUrl)}`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.glb')) {
      alert("Please upload a .glb file");
      return;
    }

    // Local Preview for immediate feedback
    const localBlob = URL.createObjectURL(file);
    setModelUrl(localBlob);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      // FIX: Using 'auto' endpoint which is standard for 3D/Raw files
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, 
        formData
      );

      if (res.data.secure_url) {
        setPublicUrl(res.data.secure_url);
        console.log("Success! Cloudinary URL:", res.data.secure_url);
      }
    } catch (err) {
      console.error("Cloudinary Error Response:", err.response?.data);
      const errorDetail = err.response?.data?.error?.message || "Unknown error";
      alert(`Upload failed: ${errorDetail}`);
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
    <div className="w-full min-h-screen bg-[#020806] p-4 lg:p-8 text-emerald-50">
      <header className="flex flex-col md:flex-row justify-between items-center bg-[#05110d] p-6 md:p-8 rounded-[2.5rem] border border-emerald-500/10 mb-8 gap-4">
        <div className="flex items-center gap-6">
          <div className="bg-[#020806] p-4 rounded-2xl text-emerald-400 border border-emerald-500/20"><Cpu size={32}/></div>
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter italic">AR <span className="text-emerald-500 text-bold">MATRIX</span> GENERATOR</h1>
        </div>
        <div className="flex items-center gap-4">
          <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
          <label htmlFor="glb-up" className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 px-6 py-4 rounded-xl font-black text-black flex items-center gap-3 uppercase text-sm transition-all shadow-lg shadow-emerald-500/20">
            {loading ? <Activity className="animate-spin" size={20}/> : <Upload size={20}/>}
            {loading ? 'Transmitting Data...' : 'Initialize GLB'}
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-[#030c08] rounded-[3rem] min-h-[500px] relative border border-emerald-900/20 flex flex-col overflow-hidden shadow-inner">
          <div className="flex-1">
            {modelUrl ? (
              <model-viewer 
                src={modelUrl} 
                auto-rotate 
                camera-controls 
                shadow-intensity="2" 
                style={{width:'100%', height:'100%', backgroundColor: 'transparent'}} 
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                <Box size={100} className="mb-4 text-emerald-500"/>
                <p className="font-bold tracking-widest uppercase">No Neural Asset Detected</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex-1 bg-[#081511] rounded-[3rem] border border-emerald-900/30 p-10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            {publicUrl ? (
              <div className="flex flex-col items-center gap-8 w-full z-10">
                <div ref={qrRef} className="bg-white p-6 rounded-[2.5rem] border-[10px] border-[#020806] shadow-2xl">
                  <QRCodeCanvas 
                    value={getARViewLink()} 
                    size={260} 
                    fgColor="#10b981" 
                    level="H" 
                  />
                </div>
                <button onClick={downloadQRCode} className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-black text-black flex items-center justify-center gap-3 uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">
                  <Download size={20}/> Download Matrix
                </button>
                <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/50">Asset successfully synced to Cloudinary</p>
              </div>
            ) : (
              <div className="opacity-10 flex flex-col items-center gap-4 py-20">
                <Smartphone size={80}/>
                <p className="font-bold tracking-[0.5em] uppercase text-sm">Standby for Matrix...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;