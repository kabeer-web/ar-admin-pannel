import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, FileUp, Database, Table as TableIcon, Loader2 } from 'lucide-react';
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Neural Matrix Online. I'm ready to manage your data with infinite persistence. Upload or command me to start." }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("AI_Ledger.xlsx");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // For visual flash effect
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // Manual Edit with change detection
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
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      setExcelData(data);
      setMessages(prev => [...prev, { role: 'ai', text: `System Synced: ${data.length} records loaded into the grid.` }]);
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
            content: "You are a Data Engine. Return ONLY a JSON array. Maintain consistency. If user asks for a new file, use headers: Date, Customer Name, Bill No, Credit, Debit, Balance. ALWAYS maintain the running Balance."
          },
          {
            role: "user",
            content: `Current Matrix State: ${JSON.stringify(excelData)}\nInstruction: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "";
      const updatedJson = JSON.parse(responseText.substring(responseText.indexOf('['), responseText.lastIndexOf(']') + 1));
      
      // Visual feedback: Flash the table
      setIsUpdating(true);
      setExcelData(updatedJson);
      setTimeout(() => setIsUpdating(false), 1000);
      
      setMessages(prev => [...prev, { role: 'ai', text: "Operation successful. Grid updated." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Logic Error: Connection to neural core lost." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName.startsWith("AI_") ? fileName : `AI_MODIFIED_${fileName}`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#020403] p-4 gap-4 overflow-hidden font-sans">
      
      {/* AI COMMAND PANEL */}
      <div className="w-full lg:w-1/4 flex flex-col bg-[#080f0c] rounded-[2.5rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/10 bg-black/40 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <BrainCircuit className="text-emerald-400 animate-pulse" size={20} />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">Command Core</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl text-[12px] leading-relaxed max-w-[90%] shadow-lg ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-[#0d1612] border border-emerald-900/50 text-emerald-100 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <Loader2 className="text-emerald-500 animate-spin ml-2" size={16} />}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-black/40 border-t border-emerald-500/10">
          <div className="flex gap-2 bg-[#020403] p-2 rounded-2xl border border-emerald-900/40 focus-within:border-emerald-500/50 transition-all">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-4 text-xs text-emerald-50 placeholder-emerald-900"
              placeholder="Inject instruction..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-3 rounded-xl hover:bg-white active:scale-95 transition-all">
              <Send size={16} className="text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* LIVE GRID INTERFACE */}
      <div className="w-full lg:w-3/4 flex flex-col bg-[#080f0c] rounded-[2.5rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/10 flex justify-between items-center bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TableIcon className="text-emerald-400" size={20} />
            </div>
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">Matrix Ledger Grid</h2>
              <p className="text-[9px] text-emerald-700 font-bold uppercase">{fileName}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <label className="group flex items-center gap-2 cursor-pointer bg-emerald-950/20 hover:bg-emerald-500 hover:text-black px-4 py-2 rounded-xl transition-all border border-emerald-500/20 shadow-inner">
              <FileUp size={16} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Upload</span>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button 
              onClick={downloadExcel} 
              disabled={excelData.length === 0}
              className="flex items-center gap-2 bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-tighter hover:bg-white disabled:opacity-20 active:scale-95 transition-all shadow-lg"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* DATA GRID AREA */}
        <div className={`flex-1 overflow-auto p-2 transition-all duration-500 ${isUpdating ? 'bg-emerald-500/10 opacity-50' : ''}`}>
          {excelData.length > 0 ? (
            <div className="relative overflow-x-auto rounded-xl border border-emerald-500/5">
              <table className="w-full border-collapse text-[12px] text-emerald-100">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#020403] text-emerald-400 uppercase tracking-widest text-[10px]">
                    <th className="p-4 border-b border-emerald-500/10 text-left bg-[#020403] w-12 text-center">#</th>
                    {Object.keys(excelData[0]).map(key => (
                      <th key={key} className="p-4 border-b border-emerald-500/10 text-left font-black bg-[#020403]">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/5">
                  {excelData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="group hover:bg-emerald-500/5 transition-all">
                      <td className="p-2 text-center text-emerald-800 font-mono text-[10px]">{rowIndex + 1}</td>
                      {Object.keys(row).map(key => (
                        <td key={key} className="p-1 min-w-[120px]">
                          <input 
                            type="text" 
                            value={row[key] || ""} 
                            onChange={(e) => handleCellEdit(rowIndex, key, e.target.value)}
                            className="bg-transparent w-full border border-transparent focus:border-emerald-500/30 focus:bg-black/40 outline-none p-3 rounded-lg transition-all text-[12px] text-emerald-50 group-hover:text-white"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="p-8 rounded-full bg-emerald-500/5 border border-emerald-500/10 animate-pulse">
                <Database size={40} className="text-emerald-900" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-900">Waiting for Matrix Injection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;