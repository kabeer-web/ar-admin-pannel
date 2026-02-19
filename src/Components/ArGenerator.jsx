import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Activity, Cpu, Palette, Box, Trash2, Edit3, Plus } from 'lucide-react';
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
  
  const modelViewerRef = useRef();
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get-all-models`);
      setModels(res.data);
    } catch (err) { console.error("Fetch Error"); }
  };

  useEffect(() => { fetchModels(); }, []);

  const handleColorChange = (color) => {
    setBaseColor(color);
    const viewer = modelViewerRef.current;
    if (viewer?.model) {
      viewer.model.materials.forEach(mat => {
        const r = parseInt(color.slice(1, 3), 16) / 255;
        const g = parseInt(color.slice(3, 5), 16) / 255;
        const b = parseInt(color.slice(5, 7), 16) / 255;
        mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      });
    }
  };

  const saveConfig = async () => {
    if (!publicUrl) return alert("Upload a model first!");
    setSyncing(true);
    try {
      const payload = {
        id: currentId, // Agar edit kar rahe hain to ID jayegi
        publicUrl,
        baseColor,
        exposure
      };
      const res = await axios.post(`${API_BASE_URL}/save-config`, payload);
      if (res.data.success) {
        alert("Matrix Saved/Updated Successfully!");
        setCurrentId(null); // Reset after save
        fetchModels(); // Library refresh karo
      }
    } catch (err) { alert("Error saving config"); }
    finally { setSyncing(false); }
  };

  const editModel = (m) => {
    setCurrentId(m._id);
    setPublicUrl(m.publicUrl);
    setModelUrl(m.publicUrl);
    setBaseColor(m.baseColor);
    setExposure(m.exposure);
    // Scroll to top to edit
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteModel = async (id) => {
    if (window.confirm("Delete this entry?")) {
      await axios.delete(`${API_BASE_URL}/delete-model/${id}`);
      fetchModels();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "ml_default");
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/doa5h9wwi/auto/upload`, formData);
      setPublicUrl(res.data.secure_url);
      setModelUrl(res.data.secure_url);
      setCurrentId(null); // Reset ID for new upload
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#010604] p-6 text-emerald-50">
      <header className="flex justify-between items-center mb-8 bg-black/40 p-6 rounded-3xl border border-emerald-500/10">
        <div className="flex items-center gap-3"><Cpu className="text-emerald-500"/><h1 className="font-bold">AR MATRIX DASHBOARD</h1></div>
        <label className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold cursor-pointer">
          <input type="file" className="hidden" onChange={handleFileUpload} />
          {loading ? "Uploading..." : "Upload New GLB"}
        </label>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 bg-black/60 rounded-[3rem] h-[500px] border border-emerald-500/10 relative overflow-hidden">
          {modelUrl ? (
            <>
              <model-viewer ref={modelViewerRef} src={modelUrl} camera-controls exposure={exposure} style={{width:'100%', height:'100%'}} />
              <div className="absolute bottom-6 left-6 right-6 bg-black/90 p-4 rounded-2xl flex items-center justify-between">
                <input type="color" value={baseColor} onChange={(e) => handleColorChange(e.target.value)} />
                <input type="range" min="0" max="3" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} className="w-1/3" />
                <button onClick={saveConfig} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold">
                  {syncing ? "Syncing..." : currentId ? "Update Config" : "Save New"}
                </button>
              </div>
            </>
          ) : <div className="h-full flex items-center justify-center opacity-20"><Box size={80}/></div>}
        </div>
        <div className="lg:col-span-4 bg-[#05110d] rounded-[3rem] p-10 flex flex-col items-center justify-center border border-emerald-500/10">
          {(currentId || publicUrl) && (
            <div className="bg-white p-4 rounded-2xl">
              <QRCodeCanvas value={`${window.location.origin}/view?id=${currentId || 'pending'}`} size={200} />
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Asset Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {models.map(m => (
          <div key={m._id} className="bg-black/40 border border-emerald-500/10 p-4 rounded-2xl">
            <div className="flex justify-between items-start">
              <div className="w-6 h-6 rounded-full" style={{backgroundColor: m.baseColor}}></div>
              <div className="flex gap-2">
                <button onClick={() => editModel(m)} className="text-emerald-500"><Edit3 size={16}/></button>
                <button onClick={() => deleteModel(m._id)} className="text-red-500"><Trash2 size={16}/></button>
              </div>
            </div>
            <p className="text-[10px] mt-4 opacity-50 uppercase tracking-widest">{m._id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArGenerator;