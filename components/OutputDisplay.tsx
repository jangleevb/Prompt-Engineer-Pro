import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Save, Download, Play, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface OutputDisplayProps {
  promptText: string;
  title?: string;
  onSave: () => void;
  attachedImages?: string[]; // Array of base64 data URLs
  apiKey?: string;
}

// Internal Component for Individual Code Blocks
const CodeBlock = ({ language, value }: { language: string, value: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
    }
    
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="relative group/code my-5 rounded-lg overflow-hidden border border-slate-700/60 shadow-xl bg-[#1e1e1e]">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-2 border-b border-slate-700/50">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
          title="Copy Code"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Syntax Highlighter */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          background: 'transparent',
          fontSize: '0.85rem',
          lineHeight: '1.5',
          fontFamily: "'JetBrains Mono', monospace",
        }}
        wrapLines={true}
        wrapLongLines={true} // Wrap long lines to avoid horizontal scrollbar hell on mobile
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const OutputDisplay: React.FC<OutputDisplayProps> = ({ promptText, title, onSave, attachedImages = [], apiKey }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Gemini State
  const [activeTab, setActiveTab] = useState<'prompt' | 'result'>('prompt');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performCopy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Navigator clipboard failed.', err);
    }
  };

  const handleCopy = () => {
    const textToCopy = activeTab === 'prompt' ? promptText : result;
    performCopy(textToCopy);
  };

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = activeTab === 'prompt' ? promptText : result;
    if (!textToDownload) return;

    const element = document.createElement("a");
    const file = new Blob([textToDownload], {type: 'text/markdown'});
    const fileName = `${title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'prompt'}_${activeTab}_${Date.now()}.md`;
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const handleRunGemini = async () => {
    if (!promptText.trim()) return;

    // Priority: User Key > Env Key
    const validKey = apiKey || process.env.API_KEY;

    if (!validKey) {
        setError("Vui lòng cấu hình API Key (nút góc trên bên phải) trước khi chạy.");
        setActiveTab('result');
        return;
    }

    setIsLoading(true);
    setError(null);
    setActiveTab('result'); // Switch to result tab immediately

    try {
        const ai = new GoogleGenAI({ apiKey: validKey });
        
        let contents: any;

        if (attachedImages.length > 0) {
            // Multimodal request
            const parts: any[] = [{ text: promptText }];
            
            attachedImages.forEach(dataUrl => {
                const [metadata, base64] = dataUrl.split(';base64,');
                const mimeType = metadata.split(':')[1];
                
                parts.push({
                    inlineData: {
                        mimeType: mimeType,
                        data: base64
                    }
                });
            });

            contents = { parts: parts };
        } else {
            contents = promptText;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents,
        });
        setResult(response.text || "Không có phản hồi từ API.");
    } catch (err: any) {
        console.error(err);
        setError(err.message || "Đã xảy ra lỗi khi gọi Gemini API.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleOpenGemini = () => {
      window.open('https://aistudio.google.com/', '_blank');
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        
        {/* Tabs Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button 
                onClick={() => setActiveTab('prompt')}
                className={`flex items-center px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'prompt' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Terminal className="w-3.5 h-3.5 mr-1.5" /> Prompt
            </button>
            <button 
                onClick={() => setActiveTab('result')}
                className={`flex items-center px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'result' ? 'bg-sky-900/50 text-sky-400 shadow border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Result
            </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {activeTab === 'prompt' && (
             <button 
              onClick={handleRunGemini}
              disabled={isLoading}
              className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs rounded border border-indigo-400/50 font-bold transition-all flex items-center shadow-lg shadow-sky-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Chạy prompt với Gemini ngay tại đây"
             >
               {isLoading ? <span className="animate-spin mr-1">⏳</span> : <Play className="w-3 h-3 mr-1" />}
               Run with Gemini
             </button>
          )}

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
            title="Sao chép toàn bộ"
          >
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            Copy All
          </button>

          <button 
            onClick={handleDownload}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs rounded transition-colors flex items-center"
            title="Tải xuống file .md"
          >
            <Download className="w-3 h-3" />
          </button>
          
           <button 
            onClick={handleOpenGemini}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs rounded transition-colors flex items-center"
            title="Mở trong Google AI Studio"
           >
             <ExternalLink className="w-3 h-3" />
           </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0d1117] rounded-xl border border-slate-800 p-4 relative group overflow-hidden flex flex-col shadow-2xl min-h-0">
        {/* Decoration Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${activeTab === 'result' ? 'from-sky-500 via-green-500 to-emerald-500' : 'from-pink-500 via-purple-500 to-indigo-500'}`}></div>
        
        <div className="flex-1 overflow-auto p-2 custom-scrollbar relative">
            {activeTab === 'prompt' ? (
                <div className="space-y-4 relative group/prompt-view">
                    {/* Floating Copy Button for Prompt Text */}
                    <button 
                        onClick={(e) => {
                           e.stopPropagation();
                           performCopy(promptText);
                        }}
                        className="absolute top-0 right-0 p-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-400 hover:text-white transition-all opacity-0 group-hover/prompt-view:opacity-100 z-10 shadow-lg"
                        title="Sao chép Prompt"
                    >
                         {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {attachedImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-900/50 rounded border border-slate-800/50">
                            {attachedImages.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-slate-700 group/img">
                                    <img src={img} alt={`Attached ${idx}`} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 right-0 bg-black/60 p-0.5 rounded-tl text-[8px] text-white">
                                        IMG {idx + 1}
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center text-xs text-slate-500 italic px-2">
                                <ImageIcon className="w-3 h-3 mr-1" /> Kèm {attachedImages.length} ảnh
                            </div>
                        </div>
                    )}
                    <div className="font-mono text-sm text-slate-300 whitespace-pre-wrap break-words pb-4 leading-relaxed">
                        {promptText || <span className="text-slate-600 italic">// Prompt sẽ xuất hiện ở đây...</span>}
                    </div>
                </div>
            ) : (
                <div className="text-sm text-slate-300 leading-7 markdown-content">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                             <p className="animate-pulse">Gemini đang suy nghĩ...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-sm mb-1">Lỗi API hoặc Cấu hình</h4>
                                <p className="text-xs font-mono">{error}</p>
                            </div>
                        </div>
                    ) : result ? (
                        <ReactMarkdown 
                            components={{
                                code({node, inline, className, children, ...props}: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const codeString = String(children).replace(/\n$/, '');

                                    return !inline && match ? (
                                        <CodeBlock language={match[1]} value={codeString} />
                                    ) : (
                                        <code className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-xs text-sky-300 border border-slate-700" {...props}>
                                            {children}
                                        </code>
                                    )
                                },
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3 mt-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-sky-100 mt-8 mb-4 flex items-center before:content-['#'] before:text-sky-500 before:mr-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-sky-400 mt-6 mb-3" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 my-4 text-slate-300 pl-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 my-4 text-slate-300 pl-2" {...props} />,
                                p: ({node, ...props}) => <p className="mb-4 text-slate-300 leading-7" {...props} />,
                                blockquote: ({node, ...props}) => (
                                    <blockquote className="border-l-4 border-sky-500/50 bg-sky-900/10 pl-4 py-2 pr-2 italic text-slate-400 my-6 rounded-r-md" {...props} />
                                ),
                                table: ({node, ...props}) => (
                                    <div className="overflow-x-auto my-6 rounded-lg border border-slate-700">
                                        <table className="min-w-full divide-y divide-slate-700 bg-slate-900/50" {...props} />
                                    </div>
                                ),
                                th: ({node, ...props}) => <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider bg-slate-800" {...props} />,
                                td: ({node, ...props}) => <td className="px-4 py-3 text-sm text-slate-400 border-t border-slate-800" {...props} />,
                                a: ({node, ...props}) => <a className="text-sky-400 hover:text-sky-300 hover:underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                            }}
                        >
                            {result}
                        </ReactMarkdown>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                             <Sparkles className="w-10 h-10 mb-3 opacity-20" />
                             <p>Nhấn "Run with Gemini" để xem kết quả.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      
      <p className="text-xs text-slate-500 mt-3 text-center">
        {activeTab === 'prompt' 
            ? <span>Mẹo: Nhấn <strong>Run with Gemini</strong> để chạy ngay hoặc copy sang AI Studio.</span>
            : <span>Kết quả được sinh ra bởi model <strong>gemini-2.5-flash</strong>.</span>
        }
      </p>
    </div>
  );
};

export default OutputDisplay;