import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import TacticBox from './components/TacticBox';
import CreateTemplateModal from './components/CreateTemplateModal';
import LoginModal from './components/LoginModal';
import ApiKeyModal from './components/ApiKeyModal';
import { TEMPLATES } from './constants';
import { Template, SavedPrompt, CustomTemplateData } from './types';
import { Menu, UserCircle, Key, Pencil, Trash2 } from 'lucide-react';

// Firebase Imports
import { auth, googleProvider, isFirebaseConfigured } from './firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const STORAGE_KEY_TEMPLATE = 'pe_template_id';
const STORAGE_KEY_FORM = 'pe_form_data';
const STORAGE_KEY_SAVED = 'pe_saved_prompts';
const STORAGE_KEY_CUSTOM_TEMPLATES = 'pe_custom_templates';
// STORAGE_KEY_USER is no longer needed as we use Firebase session
const STORAGE_KEY_API_KEY = 'pe_user_api_key';

const App: React.FC = () => {
  // --- USER & API STATE ---
  const [user, setUser] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    // Only set up Firebase listener if configured and auth is initialized
    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser({
            name: currentUser.displayName,
            email: currentUser.email,
            avatar: currentUser.photoURL
          });
        } else {
          setUser(null);
        }
      });
    }

    // Load API Key
    const savedKey = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (savedKey) setApiKey(savedKey);

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    // Fallback: Mock Login if Firebase is not configured
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      console.warn("Firebase not configured. Using Mock Login.");
      setUser({
        name: "Demo User",
        email: "demo@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
      });
      setIsLoginModalOpen(false);
      alert("Đang chạy chế độ Demo (Chưa cấu hình Firebase env).");
      return;
    }

    // Real Firebase Login
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting the user state
      setIsLoginModalOpen(false);
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Handle Invalid API Key by falling back to Mock Mode
      if (error.code === 'auth/api-key-not-valid' || error.message?.includes('api-key-not-valid')) {
         alert("Cấu hình Firebase không hợp lệ (API Key sai). Đang chuyển sang chế độ Demo.");
         setUser({
            name: "Demo User",
            email: "demo@example.com",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
         });
         setIsLoginModalOpen(false);
         return;
      }
      
      alert(`Đăng nhập thất bại: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    if (!isFirebaseConfigured || !auth) {
      // Mock Logout
      setUser(null);
      return;
    }

    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting user to null
    } catch (error) {
      console.error("Logout failed:", error);
      // Force local logout if firebase fails
      setUser(null);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
  };

  // --- TEMPLATE STATES ---
  
  // 1. LOCAL DATA (Offline - User Created)
  const [customTemplatesData, setCustomTemplatesData] = useState<CustomTemplateData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_TEMPLATES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. ONLINE DATA (Cloud - Community Store)
  const [onlineTemplatesData, setOnlineTemplatesData] = useState<CustomTemplateData[]>([]);
  const [isFetchingOnline, setIsFetchingOnline] = useState(false);

  // --- TEMPLATE GENERATION LOGIC ---

  // Helper to convert raw data (JSON) to actionable Template objects
  const convertToTemplate = (data: CustomTemplateData, source: 'local' | 'online'): Template => ({
    ...data,
    iconName: source === 'local' ? 'custom' : 'globe',
    tactic: source === 'local' 
      ? "**Custom Template**: Do người dùng tự định nghĩa." 
      : "**Community Template**: Được tải từ Online Store.",
    isCustom: true,
    source: source,
    generate: (formData: Record<string, string>) => {
      let text = data.templateString;
      // Simple interpolation {{id}}
      data.inputs.forEach(input => {
        if (input.type === 'image') return; 
        const val = formData[input.id] || `[${input.label}]`;
        text = text.split(`{{${input.id}}}`).join(val);
      });
      return text;
    }
  });

  // 3. SYSTEM DATA (Offline - Hardcoded)
  const systemTemplates: Template[] = useMemo(() => {
    return TEMPLATES;
  }, []);

  const localTemplates: Template[] = useMemo(() => {
    return customTemplatesData.map(data => convertToTemplate(data, 'local'));
  }, [customTemplatesData]);

  const onlineTemplates: Template[] = useMemo(() => {
    return onlineTemplatesData.map(data => convertToTemplate(data, 'online'));
  }, [onlineTemplatesData]);

  // MERGE ALL SOURCES
  const allTemplates = useMemo(() => {
    return [...systemTemplates, ...localTemplates, ...onlineTemplates];
  }, [systemTemplates, localTemplates, onlineTemplates]);

  // Get Unique Categories for suggestion
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allTemplates.map(t => t.category));
    return Array.from(categories);
  }, [allTemplates]);

  // Selected Template State
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_TEMPLATE);
    return null; 
  });

  // Sync selected template on mount
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_TEMPLATE);
    if (savedId && !selectedTemplate) {
        const found = allTemplates.find(t => t.id === savedId);
        if (found) setSelectedTemplate(found);
    }
  }, [allTemplates, selectedTemplate]);

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    try {
      const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
      return savedForm ? JSON.parse(savedForm) : {};
    } catch {
      return {};
    }
  });

  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string>("// Điền thông tin bên trái để tạo Prompt...");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Create / Edit Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplateData, setEditingTemplateData] = useState<CustomTemplateData | null>(null);

  // --- EFFECTS ---

  useEffect(() => {
    if (selectedTemplate) {
        setGeneratedPrompt(selectedTemplate.generate(formData));
        
        const images: string[] = [];
        selectedTemplate.inputs.forEach(input => {
            if (input.type === 'image' && formData[input.id]) {
                images.push(formData[input.id]);
            }
        });
        setAttachedImages(images);

        localStorage.setItem(STORAGE_KEY_TEMPLATE, selectedTemplate.id);
    } else {
        localStorage.removeItem(STORAGE_KEY_TEMPLATE);
        setAttachedImages([]);
    }
  }, [selectedTemplate, formData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOM_TEMPLATES, JSON.stringify(customTemplatesData));
  }, [customTemplatesData]);

  // --- HANDLERS ---

  const handleSelectTemplate = (template: Template) => {
    if (selectedTemplate?.id === template.id) {
        setIsMobileMenuOpen(false);
        return;
    }
    setSelectedTemplate(template);
    setFormData({}); // Clear form when switching
    setIsMobileMenuOpen(false);
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSavePrompt = () => {
    if (!selectedTemplate) return;
    const newSavedPrompt: SavedPrompt = {
      id: Date.now().toString(),
      templateId: selectedTemplate.id,
      title: `${selectedTemplate.title}`,
      content: generatedPrompt,
      formData: { ...formData },
      createdAt: Date.now()
    };
    setSavedPrompts(prev => [...prev, newSavedPrompt]);
  };

  const handleLoadSavedPrompt = (prompt: SavedPrompt) => {
    const template = allTemplates.find(t => t.id === prompt.templateId);
    if (template) {
      setSelectedTemplate(template);
      setFormData(prompt.formData);
    } else {
        alert("Template gốc của prompt này đã bị xóa hoặc không tồn tại.");
    }
  };

  const handleDeleteSavedPrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa prompt này?')) {
      setSavedPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  // --- CUSTOM TEMPLATE CRUD ---

  const handleSaveCustomTemplate = (newTemplateData: CustomTemplateData) => {
    // Check if updating or creating
    const isUpdating = customTemplatesData.some(t => t.id === newTemplateData.id);

    if (isUpdating) {
        setCustomTemplatesData(prev => prev.map(t => t.id === newTemplateData.id ? newTemplateData : t));
        // If we are currently viewing this template, update the selection info
        if (selectedTemplate?.id === newTemplateData.id) {
            setSelectedTemplate(convertToTemplate(newTemplateData, 'local'));
        }
    } else {
        setCustomTemplatesData(prev => [...prev, newTemplateData]);
    }
  };

  const handleEditCurrentTemplate = () => {
    if (!selectedTemplate || selectedTemplate.source !== 'local') return;
    
    const rawData = customTemplatesData.find(t => t.id === selectedTemplate.id);
    if (rawData) {
        setEditingTemplateData(rawData);
        setIsCreateModalOpen(true);
    }
  };

  const handleDeleteCurrentTemplate = () => {
    if (!selectedTemplate || selectedTemplate.source !== 'local') return;

    if (window.confirm(`Bạn có chắc muốn xóa template "${selectedTemplate.title}" không?`)) {
        setCustomTemplatesData(prev => prev.filter(t => t.id !== selectedTemplate.id));
        setSelectedTemplate(null);
    }
  };

  const handleOpenCreateModal = () => {
      setEditingTemplateData(null); // Reset for new creation
      setIsCreateModalOpen(true);
  };

  // --- ONLINE / IMPORT / EXPORT LOGIC ---

  const handleFetchOnlineTemplates = async () => {
    setIsFetchingOnline(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockOnlineData: CustomTemplateData[] = [
            {
                id: "online_seo_expert",
                title: "SEO Content Master",
                desc: "Lập dàn ý bài viết chuẩn SEO chi tiết từ từ khóa chính.",
                category: "Marketing",
                tags: ["SEO", "Content", "Blog"],
                inputs: [
                    { id: "keyword", label: "Từ khóa chính", placeholder: "Ví dụ: Digital Marketing", type: "text" },
                    { id: "target_audience", label: "Đối tượng đọc", placeholder: "Chủ doanh nghiệp nhỏ", type: "text" }
                ],
                templateString: "Bạn là chuyên gia SEO Content. Hãy lập dàn ý chi tiết cho bài viết về từ khóa: '{{keyword}}'.\nĐối tượng mục tiêu: {{target_audience}}.\n\nYêu cầu:\n1. Tiêu đề hấp dẫn (chứa từ khóa).\n2. Cấu trúc H2, H3 rõ ràng.\n3. Các từ khóa phụ (LSI) cần chèn.\n4. Đề xuất Meta Description."
            },
            {
                id: "online_job_interview",
                title: "Mock Interviewer",
                desc: "Phỏng vấn thử cho vị trí công việc cụ thể.",
                category: "Career",
                tags: ["Interview", "Soft Skills"],
                inputs: [
                    { id: "job_role", label: "Vị trí ứng tuyển", placeholder: "Senior React Developer", type: "text" },
                    { id: "company_type", label: "Loại công ty", placeholder: "Product Company / Outsourcing", type: "text" }
                ],
                templateString: "Hãy đóng vai người phỏng vấn tại một {{company_type}}. Tôi đang ứng tuyển vị trí {{job_role}}.\n\nHãy đặt cho tôi 3 câu hỏi hóc búa: 1 về chuyên môn, 1 về kỹ năng mềm, và 1 về xử lý tình huống.\nSau đó, hãy đưa ra gợi ý cách trả lời ghi điểm."
            },
            {
                id: "online_midjourney_v6",
                title: "Midjourney V6 Photorealism",
                desc: "Tạo prompt vẽ ảnh siêu thực tế với Midjourney V6.",
                category: "Creative",
                tags: ["Midjourney", "AI Art", "Photography"],
                inputs: [
                    { id: "subject", label: "Chủ thể", placeholder: "A cyberpunk street food vendor", type: "text" },
                    { id: "lighting", label: "Ánh sáng/Thời gian", placeholder: "Neon lights, raining night", type: "text" }
                ],
                templateString: "/imagine prompt: {{subject}}. {{lighting}}. Photorealistic, 8k, highly detailed, shot on 35mm lens, cinematic depth of field, --v 6.0 --style raw"
            },
            {
                id: "online_react_component",
                title: "React + Tailwind Component",
                desc: "Tạo Component React đẹp mắt với Tailwind CSS.",
                category: "Coding",
                tags: ["React", "Tailwind", "UI"],
                inputs: [
                    { id: "component_name", label: "Tên Component", placeholder: "PricingCard", type: "text" },
                    { id: "features", label: "Mô tả tính năng", placeholder: "Có 3 gói giá, highlight gói ở giữa, responsive", type: "text" }
                ],
                templateString: "Viết code React (TypeScript) cho component {{component_name}}.\nSử dụng Tailwind CSS để style đẹp mắt, hiện đại.\n\nYêu cầu chức năng: {{features}}.\nChỉ trả về code, không cần giải thích."
            }
        ];
        
        setOnlineTemplatesData(mockOnlineData);
        // Removed alert for smoother UX, the UI updates automatically.
    } catch (error) {
        console.error("Failed to fetch online templates", error);
        alert("Không thể kết nối đến Online Store.");
    } finally {
        setIsFetchingOnline(false);
    }
  };

  const handleExportTemplates = () => {
    if (customTemplatesData.length === 0) {
      alert("Bạn chưa có template cá nhân (Local) nào để xuất.");
      return;
    }
    const dataStr = JSON.stringify(customTemplatesData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup_my_templates_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportTemplates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          throw new Error("Format không hợp lệ: Root phải là Array.");
        }
        const validTemplates = json.filter((t: any) => t.id && t.title && t.inputs && t.templateString);
        if (validTemplates.length === 0) {
           throw new Error("Không tìm thấy template hợp lệ trong file.");
        }
        const currentIds = new Set(customTemplatesData.map(t => t.id));
        const newTemplates = validTemplates.filter((t: CustomTemplateData) => !currentIds.has(t.id));

        if (newTemplates.length === 0) {
          alert("Tất cả template trong file đã tồn tại.");
        } else {
          setCustomTemplatesData(prev => [...prev, ...newTemplates]);
          alert(`Đã nhập thành công ${newTemplates.length} template.`);
        }
      } catch (err: any) {
        alert("Lỗi khi nhập file: " + err.message);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-200 selection:bg-sky-500/30">
      
      {/* Sidebar */}
      <Sidebar 
        templates={allTemplates} 
        savedPrompts={savedPrompts}
        selectedTemplateId={selectedTemplate?.id || null} 
        onSelectTemplate={handleSelectTemplate}
        onLoadSavedPrompt={handleLoadSavedPrompt}
        onDeleteSavedPrompt={handleDeleteSavedPrompt}
        onOpenCreateModal={handleOpenCreateModal}
        onExportTemplates={handleExportTemplates}
        onImportTemplates={handleImportTemplates}
        onFetchOnline={handleFetchOnlineTemplates}
        isFetchingOnline={isFetchingOnline}
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden relative shadow-inner">
        
        {/* Main Header (Desktop & Mobile) */}
        <header className="h-16 border-b border-white/5 bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10 shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
                 {/* Mobile Menu Toggle */}
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-400 p-2 hover:text-white hover:bg-white/10 rounded-full transition-all">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <h1 className="font-bold text-white text-lg tracking-tight truncate max-w-[200px] md:max-w-md">
                        {selectedTemplate ? selectedTemplate.title : "Trang Chủ"}
                    </h1>
                    
                    {/* Action Buttons for Custom Templates */}
                    {selectedTemplate && selectedTemplate.source === 'local' && (
                        <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-3">
                            <button 
                                onClick={handleEditCurrentTemplate}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                                title="Chỉnh sửa Template này"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={handleDeleteCurrentTemplate}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                                title="Xóa Template này"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Action: Login & Key Buttons */}
            <div className="flex items-center gap-2">
                {/* 1. API Key Button */}
                <button 
                   onClick={() => setIsApiKeyModalOpen(true)}
                   className={`flex items-center justify-center p-2 rounded-full border transition-all shadow-lg ${
                       apiKey 
                       ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-400 hover:bg-indigo-800/50 hover:text-white' 
                       : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                   }`}
                   title={apiKey ? "Cấu hình API Key (Đã kết nối)" : "Chưa cấu hình API Key"}
                >
                   <Key className="w-5 h-5" />
                </button>

                {/* 2. User Profile Button */}
                <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs md:text-sm shadow-lg ${
                        user 
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500' 
                        : 'bg-gradient-to-r from-indigo-600 to-sky-600 border-transparent hover:brightness-110 text-white'
                    }`}
                >
                    {user ? (
                    <img src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt="User" className="w-6 h-6 rounded-full border border-slate-500 shadow-sm" />
                    ) : (
                    <UserCircle className="w-5 h-5" />
                    )}
                    
                    <div className="hidden md:flex flex-col items-start leading-none gap-0.5">
                        <span className={`font-bold ${user ? 'text-slate-200' : 'text-white'}`}>
                            {user ? user.name : "Đăng nhập"}
                        </span>
                    </div>
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-smooth custom-scrollbar">
            
          {/* Left Column: Config */}
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
            <div className="md:hidden">
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                {selectedTemplate ? selectedTemplate.title : "Chào mừng trở lại"}
              </h2>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                {selectedTemplate ? selectedTemplate.desc : "Hãy chọn một template từ menu bên trái để bắt đầu tạo nội dung."}
              </p>
            </div>
            
            {/* Badges */}
            {selectedTemplate && (
              <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${
                      selectedTemplate.source === 'local' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
                      selectedTemplate.source === 'online' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      'bg-slate-700/30 border-slate-600/30 text-slate-400'
                  }`}>
                    {selectedTemplate.source === 'local' ? 'Personal' : 
                     selectedTemplate.source === 'online' ? 'Community' : 'System'}
                  </span>
                  {selectedTemplate.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-[10px] text-sky-400 font-mono">
                      #{tag}
                    </span>
                  ))}
              </div>
            )}

            {/* Form Inputs */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-indigo-500/5 rounded-2xl blur-xl -z-10"></div>
                <InputForm 
                template={selectedTemplate} 
                formData={formData} 
                onChange={handleInputChange} 
                apiKey={apiKey}
                />
            </div>

            {/* Explain Box */}
            {selectedTemplate && (
              <TacticBox tactic={selectedTemplate.tactic} />
            )}
          </div>

          {/* Right Column: Result */}
          <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-500 delay-100">
             <OutputDisplay 
                promptText={generatedPrompt} 
                onSave={handleSavePrompt}
                title={selectedTemplate?.title}
                attachedImages={attachedImages}
                apiKey={apiKey}
             />
          </div>

        </div>
      </main>

      {/* Create / Edit Template Modal */}
      {isCreateModalOpen && (
        <CreateTemplateModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveCustomTemplate}
          initialData={editingTemplateData}
          existingCategories={uniqueCategories}
        />
      )}

      {/* User Auth Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSave={handleSaveApiKey}
      />
    </div>
  );
};

export default App;