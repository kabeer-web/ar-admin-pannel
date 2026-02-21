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
    { role: 'ai', text: "Assalam-o-Alaikum bhai! Beer AI ab bilkul saaf hai. Koi faltu data nahi daloonga. File load karo ya naya khata shuru karo!" }
  ]);
  const [excelData, setExcelData] = useState([]); // Default data removed
  const [fileName, setFileName] = useState("Beer_Ledger.xlsx");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        setExcelData(data);
        setMessages(prev => [...prev, { role: 'ai', text: "Bhai file mil gayi! Data matrix set hai." }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Bhai file error hai!" }]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleCellEdit = (rowIndex, columnKey, value) => {
    const newData = [...excelData];
    newData[rowIndex][columnKey] = value;
    setExcelData(newData);
  };

  const downloadExcel = () => {
    if (excelData.length === 0) return alert("Pehle data toh dalo!");
    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [{wch: 15}, {wch: 25}, {wch: 25}, {wch: 12}, {wch: 12}, {wch: 15}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger");
    XLSX.writeFile(wb, fileName);
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
            content: "You are 'Beer AI'. Expert Accountant. Response: Hinglish. ONLY use provided data. Format: [MESSAGE]: friendly talk [DATA]: JSON array. NEVER add extra entries unless asked."
          },
          {
            role: "user",
            content: `Current Ledger: ${JSON.stringify(excelData)}\nAction: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1, // Accuracy ke liye lowest temperature
      });

      let rawResponse = chatCompletion.choices[0]?.message?.content || "";
      const messageMatch = rawResponse.match(/\[MESSAGE\]:(.*?)(\[DATA\]|$)/s);
      const dataMatch = rawResponse.match(/\[DATA\]:(\s*\[[\s\S]*\])/);

      if (dataMatch) {
        setExcelData(JSON.parse(dataMatch[1].trim()));
        setMessages(prev => [...prev, { role: 'ai', text: messageMatch ? messageMatch[1].trim() : "Done!" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Masla aa gaya bhai, dobara bolna?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#020403] p-4 gap-6 overflow-hidden text-zinc-100">
      <div className="w-full lg:w-1/4 flex flex-col bg-[#0d1110] rounded-[2rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/5 bg-emerald-500/5 flex items-center gap-3">
          <BrainCircuit className="text-emerald-400" size={24} />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">Beer AI</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-emerald-500/20">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] text-[13px] ${msg.role === 'user' ? 'bg-emerald-600' : 'bg-[#161d1a] border border-emerald-500/10'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-5 bg-black/20">
          <div className="flex gap-2 bg-[#020403] p-2 rounded-2xl border border-emerald-500/20 focus-within:border-emerald-500">
            <input className="flex-1 bg-transparent border-none outline-none px-3 text-sm" placeholder="Hukum karo bhai..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
            <button onClick={handleSend} className="bg-emerald-500 p-3 rounded-xl text-black"><Send size={16} /></button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/4 flex flex-col bg-[#0d1110] rounded-[2.5rem] border border-emerald-500/10 overflow-hidden shadow-2xl">
        <div className="p-7 border-b border-emerald-500/5 flex justify-between items-center bg-black/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl"><TableIcon className="text-emerald-400" size={24} /></div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Financial Matrix</h2>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer border border-emerald-500/20 px-5 py-2.5 rounded-2xl text-xs font-bold text-emerald-400 uppercase">
              <FileUp size={18} /> Ingest
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={downloadExcel} className="bg-emerald-500 text-black px-8 py-2.5 rounded-2xl font-black text-xs uppercase hover:bg-white transition-all">Export</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-[#050706]">
          {excelData.length > 0 ? (
            <div className="border border-emerald-500/10 rounded-[1.5rem] overflow-hidden bg-[#0d1110]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#161d1a] text-emerald-400 font-black uppercase text-[10px]">
                    <th className="p-5 text-left border-b border-emerald-500/5">Date</th>
                    <th className="p-5 text-left border-b border-emerald-500/5">Customer Name</th>
                    <th className="p-5 text-left border-b border-emerald-500/5">Description</th>
                    <th className="p-5 text-right border-b border-emerald-500/5">Debit</th>
                    <th className="p-5 text-right border-b border-emerald-500/5">Credit</th>
                    <th className="p-5 text-right border-b border-emerald-500/5 bg-emerald-500/5">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/5">
                  {excelData.map((row, i) => (
                    <tr key={i} className="hover:bg-emerald-500/5">
                      <td className="p-2 px-5"><input className="bg-transparent outline-none w-full text-emerald-100/50" value={row["Date"] || ""} onChange={(e) => handleCellEdit(i, "Date", e.target.value)} /></td>
                      <td className="p-2 px-5 font-bold"><input className="bg-transparent outline-none w-full text-white uppercase" value={row["Customer Name"] || ""} onChange={(e) => handleCellEdit(i, "Customer Name", e.target.value)} /></td>
                      <td className="p-2 px-5 opacity-50"><input className="bg-transparent outline-none w-full" value={row["Description"] || ""} onChange={(e) => handleCellEdit(i, "Description", e.target.value)} /></td>
                      <td className="p-2 px-5 text-right font-black text-red-400"><input className="bg-transparent outline-none w-full text-right" value={row["Debit"] || 0} onChange={(e) => handleCellEdit(i, "Debit", e.target.value)} /></td>
                      <td className="p-2 px-5 text-right font-black text-emerald-400"><input className="bg-transparent outline-none w-full text-right" value={row["Credit"] || 0} onChange={(e) => handleCellEdit(i, "Credit", e.target.value)} /></td>
                      <td className="p-5 text-right font-black text-white bg-emerald-500/[0.02]">{row["Balance"] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Database size={80} className="text-emerald-500" />
              <p className="font-black uppercase tracking-[0.5em] text-sm">Waiting for Data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;