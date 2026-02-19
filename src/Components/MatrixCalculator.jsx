import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Delete, Hash, ChevronLeft, History, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const MatrixCalculator = () => {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [isScientific, setIsScientific] = useState(false);
  const scrollRef = useRef(null);

  const basicButtons = [
    '7', '8', '9', '/', 
    '4', '5', '6', '*', 
    '1', '2', '3', '-', 
    '0', '.', '=', '+'
  ];

  const scientificButtons = [
    'sin', 'cos', 'tan', 'π',
    'log', 'exp', '√', '^',
    '(', ')', '%', 'abs'
  ];

  // Logic to calculate result with advanced math
  const calculateResult = (currentDisplay) => {
    try {
      if (!currentDisplay) return;
      
      // Sanitizing input for advanced math
      let formattedInput = currentDisplay
        .replace(/π/g, 'Math.PI')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/exp/g, 'Math.exp')
        .replace(/√/g, 'Math.sqrt')
        .replace(/\^/g, '**');

      const evalResult = eval(formattedInput);
      const finalRes = Number.isInteger(evalResult) ? evalResult : evalResult.toFixed(4);
      
      setResult(finalRes.toString());
      setHistory(prev => [{ input: currentDisplay, output: finalRes }, ...prev].slice(0, 10));
    } catch {
      setResult("CALC_ERR");
    }
  };

  const handleAction = (val) => {
    // Sound/Haptic feedback simulation
    if (window.navigator.vibrate) window.navigator.vibrate(5);

    if (val === '=') {
      calculateResult(display);
    } else if (scientificButtons.includes(val) && val !== '^' && val !== 'π') {
      setDisplay(prev => prev + val + '('); // Auto bracket for functions
    } else {
      setDisplay(prev => prev + val);
      setResult('');
    }
  };

  const clear = () => {
    setDisplay('');
    setResult('');
  };

  const backspace = () => {
    setDisplay(prev => prev.slice(0, -1));
    setResult('');
  };

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (/^[0-9+\-*/.()]/.test(key)) {
        event.preventDefault();
        handleAction(key);
      } else if (key === 'Enter') {
        event.preventDefault();
        handleAction('=');
      } else if (key === 'Backspace') {
        event.preventDefault();
        backspace();
      } else if (key === 'Escape') {
        event.preventDefault();
        clear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]);

  return (
    <div className="min-h-screen bg-[#010604] flex items-center justify-center p-4 font-mono overflow-hidden">
      {/* Matrix Rain/Glow Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black pointer-events-none" />

      <div className="relative w-full max-w-lg bg-black/80 backdrop-blur-3xl border border-emerald-500/20 rounded-[2.5rem] p-6 shadow-[0_0_100px_rgba(16,185,129,0.15)] transition-all duration-500">
        
        {/* Advanced Header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/dashboard" className="text-emerald-500/40 hover:text-emerald-500 transition-all hover:scale-110">
            <ChevronLeft size={28} />
          </Link>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap size={14} className="animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Quantum Logic Unit</span>
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mt-1" />
          </div>
          <button 
            onClick={() => setIsScientific(!isScientific)}
            className={`p-2 rounded-lg transition-all ${isScientific ? 'bg-emerald-500 text-black' : 'text-emerald-500 bg-emerald-500/10'}`}
          >
            <Activity size={20} />
          </button>
        </div>

        {/* Display Screen with Trace */}
        <div className="bg-[#020806] border-2 border-emerald-500/20 rounded-3xl p-6 mb-6 text-right relative group shadow-inner">
          <div className="absolute top-4 left-4 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
          </div>
          <div className="text-emerald-500/30 text-xs mb-2 font-bold tracking-widest overflow-hidden h-5">
            {display || 'AWAITING_INPUT...'}
          </div>
          <div className="text-emerald-400 text-5xl font-black tracking-tighter truncate drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
            {result || display.split(/[+\-*/^]/).pop() || '0'}
          </div>
        </div>

        {/* Scientific Toggle Panel */}
        {isScientific && (
          <div className="grid grid-cols-4 gap-2 mb-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {scientificButtons.map(btn => (
              <button
                key={btn}
                onClick={() => handleAction(btn)}
                className="py-3 bg-emerald-950/20 border border-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-500 hover:text-black transition-all"
              >
                {btn}
              </button>
            ))}
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          <button onClick={clear} className="col-span-2 bg-red-950/20 border border-red-500/30 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all">
            Purge Cache
          </button>
          <button onClick={backspace} className="col-span-2 bg-orange-950/20 border border-orange-500/30 text-orange-500 py-4 rounded-2xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
            <Delete size={20} />
          </button>

          {basicButtons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleAction(btn)}
              className={`py-5 rounded-2xl font-bold text-2xl transition-all active:scale-90 ${
                btn === '=' 
                ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                : isNaN(btn) && btn !== '.'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xl'
                : 'bg-white/5 border border-white/5 text-white hover:bg-white/10'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* History Log */}
        {history.length > 0 && (
          <div className="mt-6 pt-6 border-t border-emerald-500/10">
            <div className="flex items-center gap-2 text-emerald-500/40 mb-3 text-[10px] font-bold uppercase tracking-widest">
              <History size={12} /> Data Logs
            </div>
            <div className="space-y-2 max-h-24 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-500/20">
              {history.map((item, i) => (
                <div key={i} className="flex justify-between text-[10px] font-mono">
                  <span className="text-white/30">{item.input}</span>
                  <span className="text-emerald-500/60 font-bold">{item.output}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixCalculator;