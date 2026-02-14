import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Download, Activity, Cpu } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrColor, setQrColor] = useState('#10b981');
  const qrRef = useRef();

  // LOCALHOST URL (Backend address)
  const API_BASE_URL = "http://localhost:5000";  

  const getARViewLink = () => {
    if (!publicUrl) return '';
    // Note: Localhost link mobile scan pe nahi chalega jab tak aapka phone same Wi-Fi pe na ho aur IP use na karein
    return publicUrl; 
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.glb')) {
      alert("Please upload a .glb file");
      return;
    }
    
    const localBlob = URL.createObjectURL(file);
    setModelUrl(localBlob);
    setLoading(true);
    
    const formData = new FormData();
    formData.append('model', file); 
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.url) {
        setPublicUrl(res.data.url);
        console.log("Uploaded to Cloudinary:", res.data.url);
      }
    } catch (err) { 
      console.error("Upload Error:", err);
      alert("Backend se connect nahi ho pa raha. Pehle 'node server.js' chalao.");
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
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">CODE GENERATOR <span className="text-emerald-500">AR</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
          <label htmlFor="glb-up" className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 px-6 py-4 rounded-xl font-black text-black flex items-center gap-3 uppercase text-sm transition-all shadow-lg shadow-emerald-500/20">
            {loading ? <Activity className="animate-spin" size={20}/> : <Upload size={20}/>}
            {loading ? 'Processing...' : 'Initialize GLB'}
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-[#030c08] rounded-[3rem] min-h-[400px] md:min-h-[500px] relative border border-emerald-900/20 flex flex-col overflow-hidden shadow-inner">
          <div className="flex-1 w-full h-full">
            {modelUrl ? (
              <model-viewer 
                key={modelUrl}
                src={modelUrl} 
                auto-rotate 
                camera-controls 
                shadow-intensity="2" 
                ar
                style={{width:'100%', height:'100%', backgroundColor: 'transparent'}} 
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                <Box size={100} className="mb-4"/>
                <p className="font-bold tracking-widest uppercase">No Neural Asset Detected</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex-1 bg-[#081511] rounded-[3rem] border border-emerald-900/30 p-8 md:p-10 flex flex-col items-center justify-center shadow-2xl">
            {publicUrl ? (
              <div className="flex flex-col items-center gap-8 w-full">
                <div ref={qrRef} className="bg-white p-6 rounded-[2.5rem] border-[10px] border-[#020806] shadow-2xl">
                  <QRCodeCanvas 
                    value={getARViewLink()} 
                    size={260}
                    fgColor={qrColor}
                    level="H"
                  />
                </div>
                <button onClick={downloadQRCode} className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-black text-black flex items-center justify-center gap-3 uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">
                  <Download size={20}/> Export Matrix
                </button>
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