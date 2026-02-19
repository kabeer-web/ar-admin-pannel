import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Activity, Cpu, Box, Trash2, Edit3, Plus, Save } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [models, setModels] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [exposure, setExposure] = useState(1);
  const [baseColor, setBaseColor] = useState('#ffffff');
  const [showQR, setShowQR] = useState(false);
  
  const modelViewerRef = useRef();
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get-all-models`);
      setModels(res.data);
    } catch (err) { console.error("Fetch Error"); }
  };

  useEffect(() => { fetchModels(); }, []);

  // Is function ko model load hone par aur color change par call karenge
  const applyColorToViewer = (colorValue) => {
    const viewer = modelViewerRef.current;
    if (viewer?.model) {
      const r = parseInt(colorValue.slice(1, 3), 16) / 255;
      const g = parseInt(colorValue.slice(3, 5), 16) / 255;
      const b = parseInt(colorValue.slice(5, 7), 16) / 255;
      viewer.model.materials.forEach(mat => {
        mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      });
    }
  };

  const saveConfig = async () => {
    if (!publicUrl) return alert("Pehle model upload karein!");
    setSyncing(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/save-config`, {
        id: currentId,
        publicUrl,
        baseColor,
        exposure
      });
      if (res.data.success) {
        setCurrentId(res.data.modelId);
        setShowQR(true); // Save hone ke baad QR dikhao
        fetchModels();
        alert(currentId ? "Updated Successfully!" : "Saved Successfully!");
      }
    } catch (err) { alert("Save Error"); }
    finally { setSyncing(false); }
  };

  const editModel = (m) => {
    setShowQR(false); // Edit start karte hi QR chhupa do jab tak save na ho
    setCurrentId(m._id);
    setPublicUrl(m.publicUrl);
    setModelUrl(m.publicUrl);
    setBaseColor(m.baseColor);
    setExposure(m.exposure);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setPublicUrl(res.data.secure_url);
      setModelUrl(res.data.secure_url);
      setCurrentId(null); 
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020806] p-6 text-white font-sans">
      <header className="flex justify-between items-center mb-10 bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/10">
        <div className="flex items-center gap-3"><Cpu className="text-emerald-500"/><h1 className="text-xl font-black tracking-tighter">NEURAL AR CORE</h1></div>
        <label className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-lg font-bold cursor-pointer transition-colors flex items-center gap-2">
          <Upload size={18}/> <input type="file" className="hidden" onChange={handleFileUpload} /> {loading ? "Uploading..." : "Inject GLB"}
        </label>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-8 bg-black rounded-3xl h-[550px] border border-emerald-500/20 relative shadow-2xl overflow-hidden">
          {modelUrl ? (
            <>
              <model-viewer 
                ref={modelViewerRef} 
                src={modelUrl} 
                camera-controls 
                exposure={exposure} 
                onLoad={() => applyColorToViewer(baseColor)}
                style={{width:'100%', height:'100%'}} 
              />
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase">Base Color</span>
                  <input type="color" value={baseColor} onChange={(e) => { setBaseColor(e.target.value); applyColorToViewer(e.target.value); }} className="w-12 h-12 rounded cursor-pointer bg-transparent border-none" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase">Exposure: {exposure}</span>
                  <input type="range" min="0" max="3" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                <button onClick={saveConfig} className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:bg-emerald-500 transition-all">
                  {syncing ? <Activity className="animate-spin"/> : <Save size={16}/>} {currentId ? "Update" : "Deploy"}
                </button>
              </div>
            </>
          ) : <div className="h-full flex flex-col items-center justify-center opacity-10"><Box size={100}/><p className="mt-4 font-bold">AWAITING NEURAL INPUT</p></div>}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-emerald-950/10 rounded-3xl p-8 border border-emerald-500/10 flex flex-col items-center justify-center min-h-[350px]">
            {showQR && currentId ? (
              <>
                <div className="bg-white p-4 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <QRCodeCanvas value={`${window.location.origin}/view?id=${currentId}`} size={220} />
                </div>
                <p className="mt-6 text-emerald-500 font-bold text-sm animate-pulse italic">MATRIX LINK ACTIVE</p>
              </>
            ) : (
              <div className="text-center opacity-30">
                <Smartphone size={60} className="mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">QR Code will generate <br/> after successful sync</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-500/10 pt-10">
        <h2 className="text-2xl font-black mb-8 italic tracking-tighter">NEURAL ASSET LIBRARY</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map(m => (
            <div key={m._id} className="bg-emerald-950/5 border border-emerald-500/10 p-6 rounded-2xl hover:bg-emerald-900/10 transition-all group">
              <div className="flex justify-between items-center mb-4">
                <div className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{backgroundColor: m.baseColor}}></div>
                <div className="flex gap-3">
                  <button onClick={() => editModel(m)} className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-500 transition-colors"><Edit3 size={18}/></button>
                  <button onClick={() => { if(window.confirm("Delete?")) axios.delete(`${API_BASE_URL}/delete-model/${m._id}`).then(fetchModels) }} className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
              <p className="text-[10px] font-mono opacity-40 break-all">{m._id}</p>
              <p className="text-[10px] font-bold text-emerald-500 mt-2 uppercase tracking-tighter">Exposure: {m.exposure}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;