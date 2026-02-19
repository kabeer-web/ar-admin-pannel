import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, Loader2, FileUp, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Active API Key Integrated
const genAI = new GoogleGenerativeAI("AIzaSyDeX3WC7vGApqmeJpKHxgptfZJ-0RpeS7k");

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Systems online. Kabir, I am ready to process your spreadsheets. Upload a file to begin." }
  ]);
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  // 1. File Upload Logic
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
          { role: 'ai', text: `Neural scan complete. Found ${data.length} records. Matrix is ready for modification.` }
        ]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Error reading matrix file." }]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // 2. AI Processing Logic with "Scrubber"
  const handleSend = async () => {
    if (!input.trim() || !excelData) return;

    const userQuery = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        Context: You are a Ledger Expert. 
        Current Data (JSON): ${JSON.stringify(excelData)}
        
        Task: ${userQuery}
        
        Rules:
        1. Modify the data based on the task.
        2. If "Balance" exists, recalculate as (Previous Balance + Credit - Debit).
        3. ALWAYS return the updated JSON array.
        4. Even if you want to explain, ensure the JSON array is present in your response enclosed in [ and ].
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text().trim();
      
      // --- THE SCRUBBER LOGIC (Extract JSON from any text) ---
      try {
        const startIdx = responseText.indexOf('[');
        const endIdx = responseText.lastIndexOf(']') + 1;
        
        if (startIdx === -1 || endIdx === 0) {
            throw new Error("Neural response did not contain a data array.");
        }

        const jsonString = responseText.substring(startIdx, endIdx);
        const updatedJson = JSON.parse(jsonString);
        
        setExcelData(updatedJson);
        setMessages(prev => [...prev, { role: 'ai', text: "Matrix successfully updated. All calculations verified and synced." }]);
      } catch (parseErr) {
        console.error("Scrub Error:", responseText);
        setMessages(prev => [...prev, { role: 'ai', text: "Neural Error: Could not extract valid data from AI response. Please try a simpler command." }]);
      }
      
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection Timeout: Neural link interrupted." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AI_MODIFIED");
    XLSX.writeFile(wb, `AI_Edited_${fileName}`);
  };

  return (
    <div className="flex flex-col h-[90vh] bg-[#010604] text-emerald-50 rounded-[2.5rem] border border-emerald-500/10 overflow-hidden m-4 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-emerald-500/10 flex justify-between items-center bg-[#020806]">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-emerald-500 animate-pulse" size={24} />
          <h2 className="font-black text-xs uppercase tracking-widest italic">Neural Data Engine</h2>
        </div>
        {excelData && (
          <button onClick={downloadExcel} className="flex items-center gap-2 bg-emerald-500 text-black px-6 py-2 rounded-full font-black text-[10px] hover:bg-white transition-all">
            <Download size={14}/> DOWNLOAD MATRIX
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${msg.role === 'user' ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-black border-emerald-500/20 text-emerald-500'}`}>
                {msg.role === 'user' ? <User size={18}/> : <Bot size={18}/>}
              </div>
              <div className={`p-5 rounded-3xl text-[13px] leading-relaxed shadow-xl ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-[#0a1a15] border border-emerald-500/10 text-emerald-100 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-black border border-emerald-500/20 flex items-center justify-center text-emerald-500"><Loader2 className="animate-spin" size={18}/></div>
            <div className="bg-[#0a1a15] p-5 rounded-3xl rounded-tl-none text-emerald-500/40 text-[10px] uppercase font-black tracking-widest">Rewriting Matrix...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-[#020806] border-t border-emerald-500/10">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {!excelData && (
            <label className="mx-auto flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 px-10 py-5 rounded-[2rem] cursor-pointer hover:bg-emerald-500 hover:text-black transition-all group active:scale-95 shadow-lg">
              <FileUp size={24} className="group-hover:-translate-y-1 transition-transform"/>
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Upload Ledger Spreadsheet</span>
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx, .xls" />
            </label>
          )}
          
          <div className="flex gap-4 bg-black/50 p-3 rounded-[2rem] border border-emerald-500/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={excelData ? "Ask AI to edit data..." : "Awaiting matrix injection..."}
              disabled={!excelData || isTyping}
              className="flex-1 bg-transparent border-none outline-none px-6 text-sm text-emerald-50 placeholder-emerald-900/50"
            />
            <button 
              onClick={handleSend}
              disabled={!excelData || isTyping}
              className="bg-emerald-500 text-black px-8 py-3 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-10"
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