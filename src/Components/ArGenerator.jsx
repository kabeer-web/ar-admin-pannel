import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Cpu, Box, Trash2, Smartphone } from 'lucide-react';
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

      // Auto-save model to DB after upload
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
    <div className="min-h-screen bg-[#020806] p-6 text-white font-sans">
      <header className="flex justify-between items-center mb-10 bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/10">
        <div className="flex items-center gap-3"><Cpu className="text-emerald-500"/><h1 className="text-xl font-black">AR ASSET MANAGER</h1></div>
        <label className="bg-emerald-500 text-black px-6 py-2 rounded-lg font-bold cursor-pointer hover:bg-emerald-400">
          <Upload size={18} className="inline mr-2"/> 
          <input type="file" className="hidden" onChange={handleFileUpload} /> 
          {loading ? "UPLOADING..." : "UPLOAD NEW GLB"}
        </label>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 text-center">
        {/* QR Section */}
        <div className="bg-emerald-950/10 rounded-3xl p-8 border border-emerald-500/10 flex flex-col items-center justify-center min-h-[350px]">
          {showQR ? (
            <>
              <div className="bg-white p-4 rounded-xl">
                <QRCodeCanvas value={`${window.location.origin}/view?id=${currentId}`} size={200} />
              </div>
              <p className="mt-4 text-emerald-500 font-bold tracking-widest uppercase">SCAN TO VIEW IN AR</p>
            </>
          ) : <div className="opacity-20"><Smartphone size={60} className="mx-auto"/><p>Upload a model to get QR</p></div>}
        </div>

        {/* Preview Section */}
        <div className="bg-black rounded-3xl h-[350px] border border-emerald-500/10 overflow-hidden">
          {publicUrl ? (
            <model-viewer src={publicUrl} camera-controls style={{width:'100%', height:'100%'}} />
          ) : <div className="h-full flex items-center justify-center opacity-10"><Box size={60}/></div>}
        </div>
      </div>

      {/* Asset Library */}
      <h2 className="text-xl font-black mb-6 text-emerald-500 uppercase tracking-widest">Uploaded Assets</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {models.map(m => (
          <div key={m._id} className="bg-emerald-950/5 border border-emerald-500/10 p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono opacity-40">{m._id}</span>
              <button onClick={() => { if(window.confirm("Delete?")) axios.delete(`${API_BASE_URL}/delete-model/${m._id}`).then(fetchModels) }} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                <Trash2 size={16}/>
              </button>
            </div>
            <button 
              onClick={() => { setCurrentId(m._id); setShowQR(true); setPublicUrl(m.publicUrl); }}
              className="w-full bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-black transition-all"
            >
              GENERATE QR
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArGenerator;