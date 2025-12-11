import React, { useEffect } from 'react';
import { X, User, LogOut, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, onClose, user, onLogin, onLogout 
}) => {
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-md transition-all duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 scale-100">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 select-none">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            Tài khoản người dùng
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-full transition-colors"
            title="Đóng (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-900 flex flex-col items-center justify-center space-y-6">
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
                onClick={() => {
                  onLogout();
                  onClose();
                }}
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
                  Đăng nhập để đồng bộ hóa dữ liệu và truy cập các tính năng nâng cao.
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
      </div>
    </div>
  );
};

export default LoginModal;