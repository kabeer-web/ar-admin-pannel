import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, Loader2, FileUp, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ New API Key Integrated
const genAI = new GoogleGenerativeAI("AIzaSyCFsfQ24mlRXqHq0u6HkmYrAaW_-s2gPTI");

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Neural Core Online. Kabir, inject the matrix (Excel) to begin data manipulation." }
  ]);
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        setExcelData(data);
        setMessages(prev => [...prev, 
          { role: 'user', text: `Uploaded: ${file.name}` },
          { role: 'ai', text: `Matrix Ingested. ${data.length} neural nodes (rows) detected. Standing by for instructions.` }
        ]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Input Error: Matrix format corrupted." }]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSend = async () => {
    if (!input.trim() || !excelData) return;

    const userQuery = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        ]
      });
      
      const prompt = `
        You are a Data Matrix Assistant. 
        Matrix Data: ${JSON.stringify(excelData)}
        Instruction: ${userQuery}
        
        Strict Command:
        1. Process the instruction. 
        2. Recalculate 'Balance' column if it exists (Balance = Previous Balance + Credit - Debit).
        3. Output ONLY the updated JSON array. No conversational text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text().trim();
      
      // Clean Response for JSON only
      const startIdx = responseText.indexOf('[');
      const endIdx = responseText.lastIndexOf(']') + 1;
      
      if (startIdx === -1) throw new Error("Format Mismatch");

      const jsonString = responseText.substring(startIdx, endIdx);
      const updatedJson = JSON.parse(jsonString);
      
      setExcelData(updatedJson);
      setMessages(prev => [...prev, { role: 'ai', text: "Neural Link Successful. Matrix recalculated and entry synced." }]);
      
    } catch (err) {
      console.error("AI Error:", err);
      setMessages(prev => [...prev, { role: 'ai', text: "Neural Link Timeout: The matrix is too complex or API quota reached. Retrying connection..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AI_MODIFIED");
    XLSX.writeFile(wb, `Neural_Edit_${fileName}`);
  };

  return (
    <div className="flex flex-col h-[92vh] bg-[#010604] text-emerald-50 rounded-[2.5rem] border border-emerald-500/10 overflow-hidden m-4 shadow-2xl relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 border-b border-emerald-500/10 flex justify-between items-center bg-[#020806]/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <BrainCircuit className="text-emerald-500 animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-[0.2em] italic">Neural Engine v3.5</h2>
            <p className="text-[8px] text-emerald-500/40 font-bold tracking-widest uppercase">Encryption Active // Kabir Core</p>
          </div>
        </div>
        {excelData && (
          <button onClick={downloadExcel} className="bg-emerald-500 text-black px-6 py-2.5 rounded-full font-black text-[10px] hover:bg-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] uppercase">
            Extract Modified Matrix
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide z-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${msg.role === 'user' ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-black border-emerald-500/20 text-emerald-500'}`}>
                {msg.role === 'user' ? <User size={18}/> : <Bot size={18}/>}
              </div>
              <div className={`p-5 rounded-3xl text-[13px] font-medium leading-relaxed shadow-2xl backdrop-blur-md ${msg.role === 'user' ? 'bg-emerald-600/90 text-white rounded-tr-none' : 'bg-emerald-950/20 border border-emerald-500/10 text-emerald-100 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-black border border-emerald-500/20 flex items-center justify-center text-emerald-500"><Loader2 className="animate-spin" size={18}/></div>
            <div className="bg-emerald-500/5 px-4 py-2 rounded-2xl text-emerald-500/40 text-[10px] uppercase font-black tracking-widest flex items-center">AI is rewriting reality...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-8 bg-[#020806]/95 border-t border-emerald-500/10 z-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {!excelData && (
            <label className="mx-auto flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 px-10 py-5 rounded-[2rem] cursor-pointer hover:bg-emerald-500 hover:text-black transition-all group shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <FileUp size={24} className="group-hover:-translate-y-1 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Inject Matrix Ledger</span>
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx, .xls" />
            </label>
          )}
          
          <div className="flex gap-4 bg-black/60 p-3 rounded-[2rem] border border-emerald-500/10 focus-within:border-emerald-500/40 transition-all shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={excelData ? "Instruction: e.g. 'Update Fraaz Industry balance'" : "Matrix offline. Awaiting injection..."}
              disabled={!excelData || isTyping}
              className="flex-1 bg-transparent border-none outline-none px-6 text-sm text-emerald-50 placeholder-emerald-950"
            />
            <button 
              onClick={handleSend}
              disabled={!excelData || isTyping}
              className="bg-emerald-500 text-black px-10 py-3 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-10 active:scale-95 shadow-lg"
            >
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;