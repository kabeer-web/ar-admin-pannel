import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Upload, Palette, Link as LinkIcon } from 'lucide-react';

const QrGenerator = () => {
  const [url, setUrl] = useState('');
  const [color, setColor] = useState('#2563eb'); // Default Blue
  const [logo, setLogo] = useState(null);
  const qrRef = useRef();

  // Logo upload handle karne ke liye
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // QR Code download karne ke liye
  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ar-model-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-4">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">QR Generator Pro</h1>
        <p className="text-slate-500 mt-1 text-lg font-medium">Customize your AR Experience with Branding.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl">
        {/* Input Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Model Link</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/model.glb"
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">QR Color</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                />
                <span className="text-sm font-mono font-bold uppercase">{color}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Brand Logo</label>
              <label className="flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all text-slate-600 font-bold text-sm">
                <Upload size={18} />
                Upload Logo
                <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-white shadow-2xl">
          <div ref={qrRef} className="bg-white p-6 rounded-[2rem] mb-6 shadow-xl">
            <QRCodeCanvas
              value={url || "https://github.com/kabeer-web"}
              size={250}
              fgColor={color}
              level={"H"} // High error correction logo ke liye zaroori hai
              imageSettings={{
                src: logo || "",
                x: undefined,
                y: undefined,
                height: 50,
                width: 50,
                excavate: true, // Logo ke peeche ke pixels hata deta hai
              }}
            />
          </div>
          
          <button 
            disabled={!url}
            onClick={downloadQR}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all ${url ? 'bg-blue-600 hover:bg-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'bg-slate-700 cursor-not-allowed'}`}
          >
            <Download size={20} />
            DOWNLOAD QR CODE
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;