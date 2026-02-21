import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, FileUp, Database, Table as TableIcon, Loader2, Palette } from 'lucide-react';
import Groq from "groq-sdk";

// ✅ Fetching key safely
const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Neural Core Stabilized. Format errors filtered. I am ready for data and UI commands." }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("AI_Ledger.xlsx");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // --- Styling States ---
  const [gridStyle, setGridStyle] = useState({
    primaryColor: '#10b981', 
    bgColor: '#080f0c',
    textColor: '#f0fdf4',
    fontSize: '12px',
    rowPadding: '12px',
    borderRadius: '2.5rem'
  });

  const chatEndRef = useRef(null);
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleCellEdit = (rowIndex, columnKey, value) => {
    const newData = [...excelData];
    newData[rowIndex][columnKey] = value;
    setExcelData(newData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = XLSX.utils.sheet_to_json(XLSX.read(evt.target.result, { type: 'binary' }).Sheets[XLSX.read(evt.target.result, { type: 'binary' }).SheetNames[0]]);
      setExcelData(data);
      setMessages(prev => [...prev, { role: 'ai', text: `Data Ingested: ${data.length} records ready.` }]);
    };
    reader.readAsBinaryString(file);
  };

  // 🔥 NEW ROBUST HANDLESEND
  const handleSend = async () => {
    if (!input.trim()) return;
    const userQuery = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a Data & UI Architect. Return ONLY a valid JSON object. 
            Format: { "data": [...], "style": {...} }
            Strictly no text before or after JSON. 
            Keep 'data' as an array of objects. 
            In 'style', use HEX for primaryColor, bgColor, textColor. Use px for fontSize and rowPadding.`
          },
          {
            role: "user",
            content: `Current Style: ${JSON.stringify(gridStyle)}\nCurrent Data: ${JSON.stringify(excelData)}\nCommand: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
      });

      let responseText = chatCompletion.choices[0]?.message?.content || "{}";
      
      // Magic Filter: Regex ensures we only get the JSON block
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Format Error");

      const response = JSON.parse(jsonMatch[0]);
      
      if (response.data) setExcelData(response.data);
      if (response.style) setGridStyle(prev => ({ ...prev, ...response.style }));
      
      setMessages(prev => [...prev, { role: 'ai', text: "Matrix Synced. UI and Data updated." }]);
    } catch (err) {
      console.error("Parse Error:", err);
      setMessages(prev => [...prev, { role: 'ai', text: "Sync Error: I couldn't parse the matrix. Try a simpler command." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 gap-4 overflow-hidden font-sans transition-all duration-500" style={{ backgroundColor: '#020403' }}>
      
      {/* COMMAND CENTER (LEFT) */}
      <div className="w-full lg:w-1/4 flex flex-col rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden" style={{ backgroundColor: gridStyle.bgColor }}>
        <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit style={{ color: gridStyle.primaryColor }} size={20} className="animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: gridStyle.primaryColor }}>AI CORE v3.1</h2>
          </div>
          <Palette size={14} style={{ color: gridStyle.primaryColor }} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl text-[12px] leading-relaxed max-w-[90%] shadow-lg ${msg.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-black/40 border border-white/5 text-zinc-300'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <Loader2 className="animate-spin text-white/20 mx-auto" size={18} />}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-black/20 border-t border-white/5">
          <div className="flex gap-2 bg-black/40 p-2 rounded-2xl border border-white/10">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-4 text-xs text-white placeholder-zinc-700"
              placeholder="Command the matrix..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="p-3 rounded-xl transition-all active:scale-95 shadow-lg" style={{ backgroundColor: gridStyle.primaryColor }}>
              <Send size={16} color="#000" />
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC GRID (RIGHT) */}
      <div className="w-full lg:w-3/4 flex flex-col rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden transition-all duration-700" style={{ backgroundColor: gridStyle.bgColor }}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-black/20 rounded-xl">
               <TableIcon style={{ color: gridStyle.primaryColor }} size={20} />
            </div>
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: gridStyle.primaryColor }}>Live Matrix Grid</h2>
              <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest" style={{ color: gridStyle.textColor }}>{fileName}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl transition-all border border-white/5 bg-black/20 hover:bg-black/40 text-[10px] font-bold uppercase tracking-tighter">
              <FileUp size={16} style={{ color: gridStyle.primaryColor }} />
              <span>Upload</span>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={downloadExcel} className="px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all" style={{ backgroundColor: gridStyle.primaryColor, color: '#000' }}>
              Export XLSX
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
          {excelData.length > 0 ? (
            <div className="relative overflow-x-auto rounded-2xl border border-white/5 shadow-inner bg-black/10">
              <table className="w-full border-collapse" style={{ fontSize: gridStyle.fontSize, color: gridStyle.textColor }}>
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#020403]/90 backdrop-blur-md uppercase tracking-[0.2em] text-[9px] font-black" style={{ color: gridStyle.primaryColor }}>
                    {Object.keys(excelData[0]).map(key => (
                      <th key={key} className="p-4 border-b border-white/5 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {excelData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-white/5 transition-all group">
                      {Object.keys(row).map(key => (
                        <td key={key} className="p-0 border-white/5">
                          <input 
                            type="text" 
                            value={row[key] || ""} 
                            onChange={(e) => handleCellEdit(rowIndex, key, e.target.value)}
                            style={{ padding: gridStyle.rowPadding, color: gridStyle.textColor }}
                            className="bg-transparent w-full border-none outline-none focus:bg-white/10 transition-all font-medium"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Database size={60} style={{ color: gridStyle.primaryColor }} />
              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.5em]">System Offline: Load Data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;