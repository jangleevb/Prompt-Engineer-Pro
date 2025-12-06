import React, { useState, useEffect, useRef } from 'react';
import { X, User, Key, LogOut, Check, ShieldCheck, AlertCircle, Save, Trash2, ClipboardPaste, Zap, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, onClose, user, onLogin, onLogout, apiKey, onSaveKey 
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'api'>('account');
  const [tempKey, setTempKey] = useState(apiKey);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Test Connection State
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempKey(apiKey);
    // Auto focus input when switching to API tab
    if (isOpen && activeTab === 'api') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [apiKey, isOpen, activeTab]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset test status when key changes
  useEffect(() => {
    setTestStatus('idle');
    setTestMessage('');
  }, [tempKey]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    if (tempKey && !validateKeyFormat(tempKey)) {
        // Allow saving but show alert? Or block?
        // We will allow saving but user should have seen the validation error visually.
    }
    onSaveKey(tempKey);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleClearKey = () => {
    setTempKey('');
    onSaveKey('');
    setTestStatus('idle');
    setTestMessage('');
    inputRef.current?.focus();
  };

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTempKey(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard', err);
      // Fallback: Focus input so user can Ctrl+V
      inputRef.current?.focus();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSaveKey();
    }
  };

  const validateKeyFormat = (key: string): boolean => {
    if (!key) return false;
    if (key.trim().startsWith('sk-')) {
        setTestStatus('error');
        setTestMessage('Đây có vẻ là API Key của OpenAI. Vui lòng nhập Gemini API Key.');
        return false;
    }
    if (key.length < 30) {
        setTestStatus('error');
        setTestMessage('API Key có vẻ quá ngắn. Vui lòng kiểm tra lại.');
        return false;
    }
    return true;
  };

  const handleTestConnection = async () => {
    if (!tempKey) return;
    
    // Client-side validation
    if (!validateKeyFormat(tempKey)) return;

    setIsTesting(true);
    setTestStatus('idle');
    setTestMessage('');
    
    try {
        const ai = new GoogleGenAI({ apiKey: tempKey });
        // Make a minimal call to verify
        await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: 'Hello',
        });
        setTestStatus('success');
        setTestMessage('Kết nối thành công! API Key hợp lệ.');
    } catch (e: any) {
        setTestStatus('error');
        let msg = `Kết nối thất bại.`;
        if (e.message?.includes('403') || e.message?.includes('API key')) {
             msg = "API Key không chính xác hoặc không có quyền truy cập.";
        } else {
             msg = `Lỗi: ${e.message?.slice(0, 60)}...`;
        }
        setTestMessage(msg);
    } finally {
        setIsTesting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-md transition-all duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 scale-100">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 select-none">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            Cài đặt tài khoản & API
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-full transition-colors"
            title="Đóng (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all relative ${
              activeTab === 'account' 
                ? 'text-sky-400 bg-slate-800/50' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" /> Tài khoản
            {activeTab === 'account' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"></div>}
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all relative ${
              activeTab === 'api' 
                ? 'text-indigo-400 bg-slate-800/50' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-4 h-4" /> Cấu hình API
            {activeTab === 'api' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-900 min-h-[340px] flex flex-col">
          {activeTab === 'account' ? (
            <div className="flex flex-col items-center justify-center flex-1 space-y-6 animate-fadeIn">
              {user ? (
                <>
                  <div className="relative group cursor-pointer">
                    <img 
                      src={user.avatar} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-xl transition-transform group-hover:scale-105 ring-2 ring-transparent group-hover:ring-sky-500/50"
                    />
                    <div className="absolute bottom-0 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-slate-900"></div>
                  </div>
                  <div className="text-center select-none">
                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                    <span className="inline-block mt-3 px-3 py-1 bg-gradient-to-r from-sky-900/50 to-indigo-900/50 text-sky-400 text-xs rounded-full border border-sky-500/30 font-mono font-bold shadow-glow">
                      ✨ PRO MEMBER
                    </span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="w-full py-2.5 bg-slate-800 hover:bg-red-900/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-lg font-bold flex items-center justify-center gap-2 transition-all mt-auto"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 mb-2 shadow-inner">
                    <User className="w-10 h-10 text-slate-500" />
                  </div>
                  <div className="text-center space-y-2 select-none">
                    <h3 className="text-lg font-bold text-white">Chưa đăng nhập</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                      Đăng nhập để đồng bộ hóa dữ liệu và truy cập các tính năng nâng cao trên mọi thiết bị.
                    </p>
                  </div>
                  <button 
                    onClick={onLogin}
                    className="w-full py-3 bg-white hover:bg-gray-100 text-slate-900 rounded-lg font-bold flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-lg mt-4 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white outline-none"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                    Tiếp tục với Google
                  </button>
                  <p className="text-[10px] text-slate-500 mt-4 text-center">
                    *Chế độ giả lập (Mock Mode). Sẵn sàng tích hợp Firebase Auth.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full space-y-4 animate-fadeIn">
               <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg flex gap-3 items-start shadow-sm">
                  <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    API Key được lưu mã hóa cục bộ trên thiết bị (Local Storage). Chúng tôi không thu thập key của bạn.
                  </p>
               </div>

               <div className="space-y-2 flex-1">
                 <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold text-slate-300">Google Gemini API Key</label>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleTestConnection}
                            disabled={!tempKey || isTesting}
                            className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                                isTesting ? 'bg-slate-700 text-slate-400' : 'bg-indigo-900/40 text-indigo-400 hover:bg-indigo-900/60'
                            }`}
                            title="Kiểm tra kết nối"
                        >
                            {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                            Test Connection
                        </button>
                        <button 
                            onClick={handlePasteKey}
                            className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition-colors"
                            title="Dán từ Clipboard"
                        >
                            <ClipboardPaste className="w-3 h-3" /> Paste
                        </button>
                    </div>
                 </div>
                 
                 <div className="relative group">
                    <input 
                      ref={inputRef}
                      type="password"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      placeholder="AIza..."
                      className={`w-full p-3 pl-10 bg-slate-800 border rounded-lg text-white outline-none font-mono text-sm transition-all placeholder-slate-600 ${
                        testStatus === 'error' ? 'border-red-500 focus:ring-1 focus:ring-red-500' :
                        testStatus === 'success' ? 'border-green-500 focus:ring-1 focus:ring-green-500' :
                        'border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                      spellCheck={false}
                    />
                    <Key className={`w-4 h-4 absolute left-3 top-3.5 transition-colors ${
                        testStatus === 'error' ? 'text-red-500' :
                        testStatus === 'success' ? 'text-green-500' :
                        'text-slate-500 group-focus-within:text-indigo-400'
                    }`} />
                    
                    {/* Status Indicator Icon inside Input */}
                    {testStatus !== 'idle' && (
                        <div className="absolute right-3 top-3.5">
                            {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            {testStatus === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                        </div>
                    )}
                 </div>

                 {/* Test Result Message */}
                 {testMessage && (
                     <div className={`text-xs px-1 flex items-start gap-1.5 ${
                         testStatus === 'success' ? 'text-green-400' : 'text-red-400'
                     }`}>
                         <span className="mt-0.5">{testStatus === 'success' ? '✓' : '✕'}</span>
                         <span>{testMessage}</span>
                     </div>
                 )}

                 <div className="flex justify-between items-center text-xs mt-1 px-1 pt-1">
                     <span className="text-slate-500 hidden sm:inline">Nhấn <kbd className="font-mono bg-slate-800 border border-slate-700 px-1 rounded text-[10px]">Enter</kbd> để lưu</span>
                     <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 ml-auto">
                      Lấy API Key miễn phí <span className="text-lg leading-none">&rsaquo;</span>
                     </a>
                 </div>
               </div>

               <div className="mt-auto pt-4 flex gap-2">
                 {apiKey && (
                     <button
                        onClick={handleClearKey}
                        className="px-4 py-3 bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-lg transition-colors focus:ring-2 focus:ring-red-500/50 outline-none"
                        title="Xóa Key khỏi trình duyệt"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                 )}
                 <button 
                    onClick={handleSaveKey}
                    disabled={isTesting}
                    className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      showSuccess 
                      ? 'bg-green-600 text-white focus:ring-green-500' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                 >
                    {showSuccess ? <Check className="w-5 h-5" /> : <Save className="w-4 h-4" />}
                    {showSuccess ? 'Đã lưu thành công!' : 'Lưu cấu hình API'}
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;