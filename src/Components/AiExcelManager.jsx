import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, Loader2, FileUp, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Teri API Key maine integrate kar di hai
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
      setMessages(prev => [...prev, 
        { role: 'user', text: `Uploaded: ${file.name}` },
        { role: 'ai', text: `Neural scan complete. Found ${data.length} records. Give me your instructions, and I shall rewrite the matrix.` }
      ]);
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
      
      const prompt = `
        You are a Data Engineering AI. I will give you a JSON array representing an Excel sheet.
        Data: ${JSON.stringify(excelData)}
        
        Task: ${userQuery}
        
        CRITICAL INSTRUCTIONS:
        1. Modify the data based on the task.
        2. If the task is to add a column, calculate values, or delete rows, do it accurately.
        3. Return ONLY the final updated JSON array.
        4. No prose, no explanations, no markdown code blocks like \`\`\`json. Just the raw array [{},{}].
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      // Clean potential markdown formatting
      text = text.replace(/```json|```/g, "");
      
      const cleanedJson = JSON.parse(text);
      setExcelData(cleanedJson);
      setMessages(prev => [...prev, { role: 'ai', text: "Data successfully manipulated. The modified sheet is ready for extraction." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "An error occurred in the neural logic. Ensure the data is not too large for the current buffer." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Neural_Export");
    XLSX.writeFile(wb, `AI_MODIFIED_${fileName}`);
  };

  return (
    <div className="flex flex-col h-[90vh] bg-[#010604] text-emerald-50 rounded-[2rem] border border-emerald-500/10 overflow-hidden m-4">
      {/* Header */}
      <div className="p-5 border-b border-emerald-500/10 flex justify-between items-center bg-[#020806]">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-emerald-500 animate-pulse" size={24} />
          <h2 className="font-black text-sm uppercase tracking-widest italic">Neural Data Processor</h2>
        </div>
        {excelData && (
          <button onClick={downloadExcel} className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-black text-[10px] hover:bg-emerald-500 transition-all">
            <Download size={14}/> EXTRACT DATA
          </button>
        )}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${msg.role === 'user' ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-black border-emerald-500/20 text-emerald-500'}`}>
                {msg.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
              </div>
              <div className={`p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-2xl ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-emerald-950/20 border border-emerald-500/5 text-emerald-100 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-black border border-emerald-500/20 flex items-center justify-center text-emerald-500"><Loader2 className="animate-spin" size={14}/></div>
            <div className="bg-emerald-950/10 p-4 rounded-2xl rounded-tl-none text-emerald-500/40 text-[10px] uppercase font-black tracking-widest">Processing Matrix...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input / Control */}
      <div className="p-6 bg-[#020806] border-t border-emerald-500/10">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {!excelData && (
            <label className="mx-auto flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 px-8 py-4 rounded-2xl cursor-pointer hover:bg-emerald-500 hover:text-black transition-all group">
              <FileUp size={20} className="group-hover:scale-110 transition-transform"/>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Upload Matrix File (Excel)</span>
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx, .xls" />
            </label>
          )}
          
          <div className="flex gap-3 bg-black/50 p-2 rounded-2xl border border-emerald-500/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={excelData ? "Instruction: e.g. 'Calculate total of column B'" : "System idle. Awaiting file..."}
              disabled={!excelData || isTyping}
              className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-emerald-50"
            />
            <button 
              onClick={handleSend}
              disabled={!excelData || isTyping}
              className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-10"
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