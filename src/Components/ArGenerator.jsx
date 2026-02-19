import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Cpu, Box, Trash2, Smartphone, Zap, Download } from 'lucide-react'; // Download icon add kiya
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [models, setModels] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get-all-models`);
      setModels(res.data);
    } catch (err) { console.error("Fetch Error"); }
  };

  useEffect(() => { fetchModels(); }, []);

  // --- QR DOWNLOAD LOGIC ---
  const downloadQR = () => {
    const canvas = document.getElementById("qr-gen");
    if (!canvas) return;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `Matrix_QR_${currentId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setShowQR(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "ml_default");
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/doa5h9wwi/auto/upload`, formData);
      const url = res.data.secure_url;
      setPublicUrl(url);

      const saveRes = await axios.post(`${API_BASE_URL}/save-config`, {
        publicUrl: url,
        exposure: 1
      });
      
      if (saveRes.data.success) {
        setCurrentId(saveRes.data.modelId);
        setShowQR(true);
        fetchModels();
      }
    } catch (err) { alert("Upload Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020806] p-4 md:p-8 text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 bg-emerald-950/10 p-6 rounded-3xl border border-emerald-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/50">
            <Cpu className="text-emerald-500" size={32}/>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-emerald-500">Neural Matrix Core</h1>
          </div>
        </div>
        
        <label className="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black cursor-pointer hover:bg-white transition-all active:scale-95 flex items-center gap-2">
          {loading ? <Zap className="animate-spin" /> : <Upload size={20} />}
          {loading ? "INJECTING..." : "UPLOAD GLB ASSET"}
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
      </header>

      {/* Main UI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        {/* QR Section with Download Button */}
        <div className="lg:col-span-5 bg-emerald-950/5 rounded-[40px] p-10 border border-emerald-500/10 flex flex-col items-center justify-center relative overflow-hidden group">
          {showQR ? (
            <div className="relative z-10 animate-in zoom-in duration-500 text-center">
              <div className="bg-white p-6 rounded-[32px] mb-6 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
                <QRCodeCanvas 
                  id="qr-gen"
                  value={`${window.location.origin}/view?id=${currentId}`} 
                  size={240} 
                  includeMargin={true}
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <p className="text-emerald-500 font-black tracking-[0.3em] text-[10px] uppercase">Asset Sync Complete</p>
                <button 
                  onClick={downloadQR}
                  className="flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 py-3 px-6 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all font-bold text-xs"
                >
                  <Download size={16}/> DOWNLOAD QR IMAGE
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-20">
              <Smartphone size={100} className="mx-auto mb-6" />
              <p className="font-bold tracking-widest uppercase text-xs text-emerald-500">Awaiting Deployment</p>
            </div>
          )}
        </div>

        {/* Hero Preview */}
        <div className="lg:col-span-7 bg-black rounded-[40px] h-[500px] border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          {publicUrl ? (
            <model-viewer 
              src={publicUrl} 
              camera-controls 
              auto-rotate 
              style={{width:'100%', height:'100%', background: 'radial-gradient(circle, #062817 0%, #000 100%)'}} 
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-emerald-500/20">
              <Box size={120} className="animate-pulse stroke-[0.5px]" />
              <p className="mt-4 font-mono text-[10px]">3D_PREVIEW_READY</p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <h2 className="text-2xl font-black italic mb-8 uppercase text-emerald-500">Asset Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {models.map(m => (
          <div key={m._id} className="group bg-black border border-white/5 rounded-[32px] overflow-hidden hover:border-emerald-500/50 transition-all duration-500">
            <div className="h-48 bg-[#050505] relative border-b border-white/5">
              <model-viewer 
                src={m.publicUrl} 
                auto-rotate 
                camera-controls 
                touch-action="none"
                style={{width:'100%', height:'100%'}} 
              />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-mono text-white/30 truncate w-32 uppercase tracking-tighter">{m._id}</p>
                <button 
                  onClick={() => { if(window.confirm("Purge asset?")) axios.delete(`${API_BASE_URL}/delete-model/${m._id}`).then(fetchModels) }} 
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
              
              <button 
                onClick={() => { setCurrentId(m._id); setShowQR(true); setPublicUrl(m.publicUrl); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                className="w-full bg-emerald-500/10 border border-emerald-500/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
              >
                SELECT ASSET
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArGenerator;