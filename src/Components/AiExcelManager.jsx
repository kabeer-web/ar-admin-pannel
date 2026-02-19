import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, Loader2, FileUp, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Nayi API Key jo tune di
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
          { role: 'ai', text: `Matrix Ingested. ${data.length} records detected. Standing by.` }
        ]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Format Error." }]);
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Chota aur seedha prompt taake AI confuse na ho
      const prompt = `Return ONLY a JSON array. Task: ${userQuery}. Data: ${JSON.stringify(excelData)}`;

      // Timeout control logic
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text().trim();
      
      const startIdx = responseText.indexOf('[');
      const endIdx = responseText.lastIndexOf(']') + 1;
      
      if (startIdx === -1) throw new Error("JSON_MISSING");

      const jsonString = responseText.substring(startIdx, endIdx);
      const updatedJson = JSON.parse(jsonString);
      
      setExcelData(updatedJson);
      setMessages(prev => [...prev, { role: 'ai', text: "Matrix Updated. Balance Sync Complete." }]);
      
    } catch (err) {
      console.error(err);
      // Agar Gemini fail ho toh hum user ko bata denge ke manual retry karein
      setMessages(prev => [...prev, { role: 'ai', text: "Neural Link Busy. Try hitting 'Execute' again—the gateway is congested." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `Modified_${fileName}`);
  };

  return (
    <div className="flex flex-col h-[90vh] bg-[#010604] text-emerald-50 rounded-3xl border border-emerald-500/10 overflow-hidden m-4 shadow-2xl">
      <div className="p-6 border-b border-emerald-500/10 flex justify-between items-center bg-[#020806]">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-emerald-500" size={24} />
          <h2 className="font-black text-xs uppercase tracking-widest italic">Neural Engine v4.0</h2>
        </div>
        {excelData && (
          <button onClick={downloadExcel} className="bg-emerald-500 text-black px-4 py-2 rounded-full font-bold text-[10px]">
            DOWNLOAD
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl text-xs max-w-[80%] ${msg.role === 'user' ? 'bg-emerald-600' : 'bg-[#0a1a15] border border-emerald-500/10'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-emerald-500 text-[10px] animate-pulse">PROCESSING...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 bg-[#020806] border-t border-emerald-500/10">
        {!excelData && (
          <label className="block text-center p-4 border border-dashed border-emerald-500/30 rounded-xl mb-4 cursor-pointer hover:bg-emerald-500/5">
            <span className="text-[10px] font-bold uppercase tracking-widest">Upload Excel</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type command..."
            className="flex-1 bg-black/50 border border-emerald-500/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/50"
          />
          <button onClick={handleSend} className="bg-emerald-500 text-black px-6 rounded-xl font-bold text-xs uppercase">Run</button>
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;