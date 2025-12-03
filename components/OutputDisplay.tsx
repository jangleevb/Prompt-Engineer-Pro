import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Save, Download } from 'lucide-react';

interface OutputDisplayProps {
  promptText: string;
  title?: string;
  onSave: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ promptText, title, onSave }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([promptText], {type: 'text/markdown'});
    const fileName = `${title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'prompt'}_${Date.now()}.md`;
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const handleOpenGemini = () => {
      window.open('https://aistudio.google.com/', '_blank');
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-200 flex items-center">
          <Terminal className="mr-2 text-green-400 w-5 h-5" />
          Kết quả (Output)
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={handleSave}
            className={`
              px-3 py-1.5 text-xs rounded border transition-all flex items-center
              ${saved 
                ? 'bg-sky-900/30 border-sky-500 text-sky-400' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }
            `}
            title="Lưu vào bộ nhớ trình duyệt"
          >
            {saved ? <Check className="w-3 h-3 mr-1" /> : <Save className="w-3 h-3 mr-1" />}
            {saved ? 'Saved' : 'Save'}
          </button>

          <button 
            onClick={handleCopy}
            className={`
              px-3 py-1.5 text-xs rounded border transition-all flex items-center
              ${copied 
                ? 'bg-green-900/30 border-green-500 text-green-400' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }
            `}
            title="Sao chép vào clipboard"
          >
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button 
            onClick={handleDownload}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs rounded transition-colors flex items-center"
            title="Tải xuống file .md"
          >
            <Download className="w-3 h-3 mr-1" /> Export
          </button>
          
           <button 
            onClick={handleOpenGemini}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded transition-colors flex items-center"
            title="Mở Google AI Studio"
           >
             <ExternalLink className="w-3 h-3 mr-1" /> Gemini
           </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0d1117] rounded-xl border border-slate-800 p-4 relative group overflow-hidden flex flex-col shadow-2xl">
        {/* System Instruction Indicator decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        
        <div className="flex-1 overflow-auto font-mono text-sm text-slate-300 p-2 whitespace-pre-wrap break-words custom-scrollbar">
          {promptText}
        </div>
      </div>
      
      <p className="text-xs text-slate-500 mt-3 text-center">
        Mẹo: Copy nội dung này dán vào <strong>Google AI Studio</strong> để có kết quả tốt nhất.
      </p>
    </div>
  );
};

export default OutputDisplay;