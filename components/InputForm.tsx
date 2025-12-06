import React, { useRef, useState } from 'react';
import { Template, InputConfig } from '../types';
import { ArrowLeft, Upload, X, Image as ImageIcon, Wand2, Loader2, FileCode } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface InputFormProps {
  template: Template | null;
  formData: Record<string, string>;
  onChange: (id: string, value: string) => void;
  apiKey?: string;
}

const InputForm: React.FC<InputFormProps> = ({ template, formData, onChange, apiKey }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textFileInputRef = useRef<HTMLInputElement>(null);
  const [fillingId, setFillingId] = useState<string | null>(null);

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Result is a base64 data URL
        onChange(id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onChange(id, content);
      };
      reader.readAsText(file);
    }
  };

  const handleClearImage = (id: string) => {
    onChange(id, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClearFile = (id: string) => {
    onChange(id, '');
    if (textFileInputRef.current) {
      textFileInputRef.current.value = '';
    }
  };

  const handleMagicFill = async (input: InputConfig) => {
    if (!template) return;
    
    // Priority: User Key > Env Key
    const validKey = apiKey || process.env.API_KEY;

    if (!validKey) {
        alert("Vui lòng nhập API Key (nút góc trên bên phải) để sử dụng Magic Fill.");
        return;
    }

    setFillingId(input.id);
    try {
        const ai = new GoogleGenAI({ apiKey: validKey });
        const prompt = `Context: User is filling a form for a prompt template titled "${template.title}" - ${template.desc}.
        
        Task: Generate a realistic, creative, and specific example value for the input field labeled "${input.label}".
        Hint from placeholder: "${input.placeholder}".
        
        Constraint: Return ONLY the example text. Do not include quotes, prefixes or explanations. Keep it concise but descriptive enough to be useful.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text?.trim();
        if (text) {
            // Remove surrounding quotes if Gemini adds them
            const cleanText = text.replace(/^"|"$/g, '');
            onChange(input.id, cleanText);
        }
    } catch (err: any) {
        console.error("Magic fill error:", err);
        let errorMsg = "Lỗi khi gọi AI.";
        if (err.message?.includes('403') || err.message?.includes('API key')) {
          errorMsg = "API Key không chính xác hoặc không có quyền truy cập. Vui lòng kiểm tra lại trong phần Cài đặt.";
        } else if (err.message) {
          errorMsg = `Lỗi: ${err.message.slice(0, 100)}`;
        }
        alert(errorMsg);
    } finally {
        setFillingId(null);
    }
  };

  if (!template) {
    return (
      <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg flex items-center justify-center h-48">
        <div className="text-center text-slate-500 italic flex items-center">
          <ArrowLeft className="mr-2 w-4 h-4" /> Chọn mẫu để hiển thị form nhập liệu
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
      {template.inputs.map(input => (
        <div key={input.id} className="group/input">
          <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-400 uppercase">
                {input.label}
              </label>

              {/* Magic Fill Button - Only for text/textarea */}
              {input.type !== 'image' && input.type !== 'file' && (
                  <button
                    onClick={() => handleMagicFill(input)}
                    disabled={fillingId === input.id}
                    className="text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-900/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover/input:opacity-100 focus:opacity-100"
                    title="AI tự điền mẫu (Magic Fill)"
                  >
                    {fillingId === input.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <Wand2 className="w-3 h-3" />
                    )}
                    Magic Fill
                  </button>
              )}
          </div>
          
          {input.type === 'textarea' ? (
            <textarea
              rows={4}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm font-mono focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder-slate-600"
              placeholder={input.placeholder}
              value={formData[input.id] || ''}
              onChange={(e) => onChange(input.id, e.target.value)}
            />
          ) : input.type === 'image' ? (
            <div className="mt-1">
              {formData[input.id] ? (
                <div className="relative group w-full h-48 bg-slate-950 rounded-lg border border-slate-700 overflow-hidden flex items-center justify-center">
                  <img 
                    src={formData[input.id]} 
                    alt="Uploaded" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                       onClick={() => handleClearImage(input.id)}
                       className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-transform hover:scale-110"
                     >
                       <X className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => document.getElementById(`file-${input.id}`)?.click()}
                  className="w-full h-32 border-2 border-dashed border-slate-700 rounded-lg hover:border-sky-500 hover:bg-slate-800/50 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-500 group"
                >
                  <Upload className="w-8 h-8 mb-2 group-hover:text-sky-400 transition-colors" />
                  <span className="text-xs group-hover:text-slate-300">{input.placeholder || "Click để tải ảnh lên"}</span>
                  <input 
                    id={`file-${input.id}`}
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(input.id, e)}
                    ref={fileInputRef}
                  />
                </div>
              )}
            </div>
          ) : input.type === 'file' ? (
             <div className="mt-1">
                {formData[input.id] ? (
                    <div className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sky-400">
                                <FileCode className="w-5 h-5" />
                                <span className="text-xs font-bold">File Content Loaded</span>
                            </div>
                            <button onClick={() => handleClearFile(input.id)} className="text-slate-500 hover:text-red-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="max-h-32 overflow-y-auto p-2 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-slate-400">
                            {formData[input.id].slice(0, 500)}...
                        </div>
                    </div>
                ) : (
                    <div 
                        onClick={() => document.getElementById(`text-file-${input.id}`)?.click()}
                        className="w-full h-24 border border-dashed border-slate-700 rounded-lg hover:border-sky-500 hover:bg-slate-800/50 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-500 group"
                    >
                        <FileCode className="w-6 h-6 mb-2 group-hover:text-sky-400 transition-colors" />
                        <span className="text-xs group-hover:text-slate-300">{input.placeholder || "Upload Code File (.js, .py, .txt, Dockerfile...)"}</span>
                        <input 
                            id={`text-file-${input.id}`}
                            type="file" 
                            className="hidden"
                            onChange={(e) => handleTextFileChange(input.id, e)}
                            ref={textFileInputRef}
                        />
                    </div>
                )}
             </div>
          ) : (
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder-slate-600"
              placeholder={input.placeholder}
              value={formData[input.id] || ''}
              onChange={(e) => onChange(input.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default InputForm;