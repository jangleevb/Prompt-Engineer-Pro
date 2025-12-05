import React, { useState, useEffect } from 'react';
import { X, User, Key, LogOut, Check, ShieldCheck, AlertCircle, Save } from 'lucide-react';

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

  useEffect(() => {
    setTempKey(apiKey);
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    onSaveKey(tempKey);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            Cài đặt tài khoản & API
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'account' 
                ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-800/50' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" /> Tài khoản
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'api' 
                ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/50' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-4 h-4" /> Cấu hình API
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-900 min-h-[300px]">
          {activeTab === 'account' ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fadeIn">
              {user ? (
                <>
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-full border-4 border-slate-800 shadow-xl"
                    />
                    <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-slate-900"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-sky-900/30 text-sky-400 text-xs rounded-full border border-sky-500/30 font-mono">
                      Plan: PRO MEMBER
                    </span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="w-full py-2.5 bg-slate-800 hover:bg-red-900/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 mb-2">
                    <User className="w-10 h-10 text-slate-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-white">Chưa đăng nhập</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                      Đăng nhập để lưu prompt lên đám mây và đồng bộ hóa giữa các thiết bị.
                    </p>
                  </div>
                  <button 
                    onClick={onLogin}
                    className="w-full py-3 bg-white hover:bg-gray-100 text-slate-900 rounded-lg font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                    Tiếp tục với Google
                  </button>
                  <p className="text-xs text-slate-500 mt-4">
                    *Đây là bản giả lập UI. Trong thực tế sẽ tích hợp Firebase Auth.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full space-y-4 animate-fadeIn">
               <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-200">
                    API Key của bạn được lưu trữ an toàn trong <strong>Local Storage</strong> của trình duyệt này. Chúng tôi không bao giờ gửi key của bạn đi đâu khác ngoài Google API.
                  </p>
               </div>

               <div className="space-y-2">
                 <label className="block text-sm font-bold text-slate-300">Google Gemini API Key</label>
                 <div className="relative">
                    <input 
                      type="password"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-sm"
                    />
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                 </div>
                 <p className="text-xs text-slate-500 text-right">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                      Lấy API Key tại đây &rarr;
                    </a>
                 </p>
               </div>

               <div className="mt-auto pt-4">
                 <button 
                    onClick={handleSaveKey}
                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                      showSuccess 
                      ? 'bg-green-600 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
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