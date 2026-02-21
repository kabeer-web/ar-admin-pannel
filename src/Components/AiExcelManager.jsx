import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, FileUp, Database, Table as TableIcon, Loader2, Palette } from 'lucide-react';
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Design Engine Online. I can now modify the grid's appearance, colors, and format. Command me to 'Change theme to Neon' or 'Highlight negative balances'." }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("AI_Ledger.xlsx");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // --- New Styling States ---
  const [gridStyle, setGridStyle] = useState({
    primaryColor: '#10b981', // Emerald 500
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
      setMessages(prev => [...prev, { role: 'ai', text: `Matrix Ingested: ${data.length} records loaded.` }]);
    };
    reader.readAsBinaryString(file);
  };

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
            content: `You are a Data & UI Architect.
            You must return a JSON with TWO parts: 
            1. "data": The updated JSON array.
            2. "style": An object containing (primaryColor, bgColor, textColor, fontSize, rowPadding).
            
            Format: { "data": [...], "style": {...} }
            
            Maintain the ledger logic. If the user asks for design/color changes, update the "style" object. Use HEX codes for colors.`
          },
          {
            role: "user",
            content: `Current Style: ${JSON.stringify(gridStyle)}\nCurrent Data: ${JSON.stringify(excelData)}\nCommand: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
      });

      const response = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
      
      if (response.data) setExcelData(response.data);
      if (response.style) setGridStyle(prev => ({ ...prev, ...response.style }));
      
      setMessages(prev => [...prev, { role: 'ai', text: "Matrix and UI synchronized." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Processing failed. Check command." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 gap-4 overflow-hidden font-sans transition-all duration-700" style={{ backgroundColor: '#020403' }}>
      
      {/* COMMAND CENTER */}
      <div className="w-full lg:w-1/4 flex flex-col rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden" style={{ backgroundColor: gridStyle.bgColor }}>
        <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit style={{ color: gridStyle.primaryColor }} size={20} className="animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: gridStyle.primaryColor }}>Command Core</h2>
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
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-black/20 border-t border-white/5">
          <div className="flex gap-2 bg-black/40 p-2 rounded-2xl border border-white/10">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-4 text-xs text-white placeholder-zinc-700"
              placeholder="Design or Data command..."
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

      {/* DYNAMIC GRID INTERFACE */}
      <div className="w-full lg:w-3/4 flex flex-col rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden transition-all duration-700" style={{ backgroundColor: gridStyle.bgColor }}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-4">
            <TableIcon style={{ color: gridStyle.primaryColor }} size={20} />
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: gridStyle.primaryColor }}>Dynamic Grid</h2>
              <p className="text-[9px] font-bold opacity-40 uppercase" style={{ color: gridStyle.textColor }}>{fileName}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl transition-all border border-white/5 bg-black/20 hover:bg-black/40">
              <FileUp size={16} style={{ color: gridStyle.primaryColor }} />
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={() => XLSX.writeFile(XLSX.utils.book_append_sheet(XLSX.utils.book_new(), XLSX.utils.json_to_sheet(excelData), "Sheet1"), fileName)} className="px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all" style={{ backgroundColor: gridStyle.primaryColor, color: '#000' }}>
              Download
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {excelData.length > 0 ? (
            <div className="relative overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full border-collapse" style={{ fontSize: gridStyle.fontSize, color: gridStyle.textColor }}>
                <thead className="sticky top-0 z-10">
                  <tr className="bg-black/60 uppercase tracking-widest text-[9px] font-black" style={{ color: gridStyle.primaryColor }}>
                    {Object.keys(excelData[0]).map(key => (
                      <th key={key} className="p-4 border-b border-white/5 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {excelData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-white/5 transition-all">
                      {Object.keys(row).map(key => (
                        <td key={key} className="p-0 border-white/5">
                          <input 
                            type="text" 
                            value={row[key] || ""} 
                            onChange={(e) => handleCellEdit(rowIndex, key, e.target.value)}
                            style={{ padding: gridStyle.rowPadding, color: gridStyle.textColor }}
                            className="bg-transparent w-full border-none outline-none focus:bg-white/5 transition-all"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Database size={50} style={{ color: gridStyle.primaryColor }} />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em]">Empty Grid</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;