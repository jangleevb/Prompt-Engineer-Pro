import React, { useRef, useState, useEffect } from 'react';
import { Template, InputConfig } from '../types';
import { ArrowLeft, Upload, X, Image as ImageIcon, Wand2, Loader2, FileCode, ChevronDown, AlertCircle } from 'lucide-react';
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
  
  // Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset validation state when template changes
  useEffect(() => {
    setTouched({});
  }, [template?.id]);

  const handleBlur = (id: string) => {
    setTouched(prev => ({ ...prev, [id]: true }));
  };

  const validate = (input: InputConfig, value: string): string | null => {
    if (input.required) {
        if (!value || value.trim() === '') return 'Trường này là bắt buộc';
    }
    if (value && input.validationRule === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email không đúng định dạng';
    }
    if (value && input.validationRule === 'url') {
        try {
           new URL(value);
        } catch {
           return 'URL không hợp lệ (cần có http:// hoặc https://)';
        }
    }
    return null;
  };

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Result is a base64 data URL
        onChange(id, reader.result as string);
        handleBlur(id); // Auto touch on file select
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
        handleBlur(id); // Auto touch on file select
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
            // Don't mark as touched immediately to allow user to edit, or maybe we should?
            // Let's not touch it so validation doesn't scream immediately if AI generates something weird (unlikely)
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
      {template.inputs.map(input => {
        const error = touched[input.id] ? validate(input, formData[input.id] || '') : null;
        
        return (
        <div key={input.id} className="group/input">
          <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                {input.label}
                {input.required && <span className="text-red-500" title="Bắt buộc">*</span>}
              </label>

              {/* Magic Fill Button - Only for text/textarea */}
              {input.type !== 'image' && input.type !== 'file' && input.type !== 'select' && (
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
              className={`w-full p-3 rounded-lg bg-slate-800 border text-slate-200 text-sm font-mono focus:outline-none focus:ring-1 transition-all placeholder-slate-600 ${
                  error 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-slate-700 focus:border-sky-400 focus:ring-sky-400'
              }`}
              placeholder={input.placeholder}
              value={formData[input.id] || ''}
              onChange={(e) => onChange(input.id, e.target.value)}
              onBlur={() => handleBlur(input.id)}
            />
          ) : input.type === 'select' ? (
             <div className="relative">
                <select
                  className={`w-full p-3 pr-10 rounded-lg bg-slate-800 border text-slate-200 text-sm appearance-none focus:outline-none focus:ring-1 transition-all ${
                      error 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-slate-700 focus:border-sky-400 focus:ring-sky-400'
                  }`}
                  value={formData[input.id] || ''}
                  onChange={(e) => {
                      onChange(input.id, e.target.value);
                      handleBlur(input.id);
                  }}
                  onBlur={() => handleBlur(input.id)}
                >
                    <option value="" disabled>{input.placeholder || 'Chọn một tùy chọn...'}</option>
                    {input.options?.map((opt, idx) => (
                        <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
             </div>
          ) : input.type === 'image' ? (
            <div className="mt-1">
              {formData[input.id] ? (
                <div className={`relative group w-full h-48 bg-slate-950 rounded-lg border overflow-hidden flex items-center justify-center ${error ? 'border-red-500' : 'border-slate-700'}`}>
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
                  className={`w-full h-32 border-2 border-dashed rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-500 group ${
                      error ? 'border-red-500/50 bg-red-900/10' : 'border-slate-700 hover:border-sky-500'
                  }`}
                >
                  <Upload className={`w-8 h-8 mb-2 transition-colors ${error ? 'text-red-400' : 'group-hover:text-sky-400'}`} />
                  <span className={`text-xs ${error ? 'text-red-400' : 'group-hover:text-slate-300'}`}>{input.placeholder || "Click để tải ảnh lên"}</span>
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
                    <div className={`w-full p-3 bg-slate-800 rounded-lg border flex flex-col gap-2 ${error ? 'border-red-500' : 'border-slate-700'}`}>
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
                        className={`w-full h-24 border border-dashed rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-500 group ${
                             error ? 'border-red-500/50 bg-red-900/10' : 'border-slate-700 hover:border-sky-500'
                        }`}
                    >
                        <FileCode className={`w-6 h-6 mb-2 transition-colors ${error ? 'text-red-400' : 'group-hover:text-sky-400'}`} />
                        <span className={`text-xs ${error ? 'text-red-400' : 'group-hover:text-slate-300'}`}>{input.placeholder || "Upload Code File (.js, .py, .txt, Dockerfile...)"}</span>
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
              className={`w-full p-3 rounded-lg bg-slate-800 border text-slate-200 text-sm focus:outline-none focus:ring-1 transition-all placeholder-slate-600 ${
                  error 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-slate-700 focus:border-sky-400 focus:ring-sky-400'
              }`}
              placeholder={input.placeholder}
              value={formData[input.id] || ''}
              onChange={(e) => onChange(input.id, e.target.value)}
              onBlur={() => handleBlur(input.id)}
            />
          )}

          {error && (
              <div className="flex items-center gap-1.5 text-red-400 text-[10px] mt-1.5 animate-in slide-in-from-top-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{error}</span>
              </div>
          )}
        </div>
      )})}
    </div>
  );
};

export default InputForm;