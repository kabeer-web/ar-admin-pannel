import React, { useState } from 'react';
import { Upload, X, Box } from 'lucide-react';

const UploadZone = ({ onUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold mb-4 text-slate-800">1. Upload 2D Image</h3>
      
      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
          <Upload className="text-slate-400 mb-2" size={40} />
          <span className="text-slate-600 font-medium">Click to select image</span>
          <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
        </label>
      ) : (
        <div className="relative group w-full h-64">
          <img src={preview} className="w-full h-full object-contain rounded-xl bg-slate-100" />
          <button 
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50">
        <Box size={20} /> Generate 3D Model
      </button>
    </div>
  );
};

export default UploadZone;