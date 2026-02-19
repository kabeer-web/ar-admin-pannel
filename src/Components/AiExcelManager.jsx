import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Send, Download, BrainCircuit, Loader2, FileUp } from 'lucide-react';
import axios from 'axios';

const AiExcelManager = () => {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Awaiting Neural Input...");

  // 1. File Upload & Read
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("Reading Spreadsheet...");

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setExcelData(data);
      setStatus("Data Ingested. Ask AI to edit anything.");
    };
    reader.readAsBinaryString(file);
  };

  // 2. AI Processing (Prompt + Data)
  const processWithAI = async () => {
    if (!excelData || !prompt) return alert("Pehle file upload karein aur prompt likhein!");
    
    setLoading(true);
    setStatus("AI is Analyzing & Editing...");

    try {
      // Note: Backend par ek route banana hoga jo OpenAI/Gemini ko ye data bheje
      // Yahan hum aapke backend ko payload bhej rahe hain
      const res = await axios.post('https://ar-admin-pannel.vercel.app/api/process-excel', {
        data: excelData,
        instruction: prompt
      });

      if (res.data.success) {
        setExcelData(res.data.updatedData);
        setStatus("Matrix Updated by AI! Ready for Download.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Neural Error: Could not process data.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Download Updated File
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Updated_Data");
    XLSX.writeFile(wb, `AI_Edited_${fileName || 'data.xlsx'}`);
  };

  return (
    <div className="bg-[#020806] min-h-screen p-8 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10 border-b border-emerald-500/20 pb-6">
          <BrainCircuit className="text-emerald-500" size={40} />
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">AI Data <span className="text-emerald-500">Manipulator</span></h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Upload Box */}
          <div className="bg-emerald-950/5 border-2 border-dashed border-emerald-500/20 rounded-[32px] p-10 flex flex-col items-center justify-center group hover:border-emerald-500/50 transition-all">
            <input type="file" id="excelUp" className="hidden" onChange={handleFileUpload} accept=".xlsx, .xls" />
            <label htmlFor="excelUp" className="cursor-pointer flex flex-col items-center">
              <FileUp size={50} className="text-emerald-500/40 mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-sm uppercase tracking-widest">{fileName || "Upload Office Excel"}</p>
            </label>
          </div>

          {/* Status Box */}
          <div className="bg-black border border-white/5 rounded-[32px] p-8 flex flex-col justify-center">
            <p className="text-[10px] font-mono text-emerald-500 uppercase mb-2">System Status:</p>
            <p className="text-xl font-bold italic">{status}</p>
          </div>
        </div>

        {/* AI Command Input */}
        <div className="bg-emerald-950/10 rounded-[32px] p-8 border border-emerald-500/10 mb-8">
          <label className="block text-[10px] font-black text-emerald-500 uppercase mb-4 tracking-[0.2em]">Neural Prompt (e.g., "Add 10% tax to price column")</label>
          <div className="flex gap-4">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell AI what to do with your data..."
              className="flex-1 bg-black border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none h-24"
            />
            <button 
              onClick={processWithAI}
              disabled={loading}
              className="bg-emerald-500 text-black px-8 rounded-2xl font-black hover:bg-white transition-all flex flex-col items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
              <span className="text-[10px]">EXECUTE</span>
            </button>
          </div>
        </div>

        {/* Results / Download */}
        {excelData && (
          <div className="animate-in fade-in slide-in-from-bottom-5">
            <button 
              onClick={downloadExcel}
              className="w-full bg-white text-black py-6 rounded-[32px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-emerald-500 transition-all"
            >
              <Download size={24} /> Download Modified Neural Sheet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiExcelManager;