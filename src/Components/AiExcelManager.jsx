import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, FileUp, Database, Table as TableIcon } from 'lucide-react';
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Neural Grid Active. Upload a file or tell me to create one. You can edit the cells directly too!" }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // Manual Edit Function
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
      setMessages(prev => [...prev, { role: 'ai', text: `Matrix Ingested. ${data.length} rows loaded into the grid.` }]);
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
            content: "You are a Data Engine. Return ONLY a JSON array. Maintain headers: Date, Customer Name, Bill No, Credit, Debit, Balance. Always append/edit, never wipe data."
          },
          {
            role: "user",
            content: `Current Data: ${JSON.stringify(excelData)}\nCommand: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "";
      const updatedJson = JSON.parse(responseText.substring(responseText.indexOf('['), responseText.lastIndexOf(']') + 1));
      setExcelData(updatedJson);
      setMessages(prev => [...prev, { role: 'ai', text: "Grid synchronized with AI logic." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error syncing matrix." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#010302] p-4 gap-4 overflow-hidden">
      
      {/* Left Side: AI Chat (30%) */}
      <div className="w-full lg:w-1/3 flex flex-col bg-[#050a08] rounded-[2rem] border border-emerald-500/20 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-emerald-500/10 flex items-center gap-3 bg-black/40">
          <BrainCircuit className="text-emerald-400" size={20} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">AI Command Center</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl text-[12px] max-w-[90%] ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/30 border border-emerald-900/50 text-emerald-100'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-black/20 border-t border-emerald-500/10">
          <div className="flex gap-2 bg-black/40 p-2 rounded-2xl border border-emerald-900/30">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-4 text-xs text-emerald-50"
              placeholder="Command the AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-3 rounded-xl hover:bg-white transition-all">
              <Send size={16} className="text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Excel GUI (70%) */}
      <div className="w-full lg:w-2/3 flex flex-col bg-[#050a08] rounded-[2rem] border border-emerald-500/20 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-emerald-500/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
            <TableIcon className="text-emerald-400" size={20} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Live Ledger Matrix</h2>
          </div>
          <div className="flex gap-3">
            <label className="cursor-pointer bg-emerald-900/20 hover:bg-emerald-900/40 p-2 rounded-lg transition-all border border-emerald-500/20">
              <FileUp size={18} className="text-emerald-400" />
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={() => XLSX.writeFile(XLSX.utils.book_append_sheet(XLSX.utils.book_new(), XLSX.utils.json_to_sheet(excelData), "Sheet1"), "ledger.xlsx")} className="bg-emerald-500 p-2 rounded-lg hover:bg-white transition-all">
              <Download size={18} className="text-black" />
            </button>
          </div>
        </div>

        {/* The Grid */}
        <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-emerald-900">
          {excelData.length > 0 ? (
            <table className="w-full border-collapse text-[12px] text-emerald-100">
              <thead>
                <tr className="bg-emerald-900/20 text-emerald-400 uppercase tracking-widest text-[10px]">
                  {Object.keys(excelData[0]).map(key => (
                    <th key={key} className="p-4 border border-emerald-500/10 text-left font-black">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-emerald-500/5 border-b border-emerald-500/5 transition-all">
                    {Object.keys(row).map(key => (
                      <td key={key} className="p-2 border border-emerald-500/5">
                        <input 
                          type="text" 
                          value={row[key] || ""} 
                          onChange={(e) => handleCellEdit(rowIndex, key, e.target.value)}
                          className="bg-transparent w-full border-none outline-none focus:bg-emerald-500/10 p-2 rounded transition-all"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-emerald-900">
              <Database size={60} className="mb-4 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Grid Empty: Ingest Data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;