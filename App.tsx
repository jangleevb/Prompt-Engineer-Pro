import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import TacticBox from './components/TacticBox';
import CreateTemplateModal from './components/CreateTemplateModal';
import LoginModal from './components/LoginModal';
import { TEMPLATES } from './constants';
import { Template, SavedPrompt, CustomTemplateData } from './types';
import { Menu, UserCircle, Key } from 'lucide-react';

const STORAGE_KEY_TEMPLATE = 'pe_template_id';
const STORAGE_KEY_FORM = 'pe_form_data';
const STORAGE_KEY_SAVED = 'pe_saved_prompts';
const STORAGE_KEY_CUSTOM_TEMPLATES = 'pe_custom_templates';
const STORAGE_KEY_USER = 'pe_user_profile';
const STORAGE_KEY_API_KEY = 'pe_user_api_key';

const App: React.FC = () => {
  // --- USER & API STATE ---
  const [user, setUser] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Load User
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) setUser(JSON.parse(savedUser));

    // Load API Key
    const savedKey = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleLogin = () => {
    // Simulate Google Login
    const mockUser = {
      name: "Nguyễn Văn Dev",
      email: "dev.pro@gmail.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    };
    setUser(mockUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const handleSaveCustomTemplate = (newTemplateData: CustomTemplateData) => {
    setCustomTemplatesData(prev => [...prev, newTemplateData]);
  };

  // --- ONLINE / IMPORT / EXPORT LOGIC ---

  const handleFetchOnlineTemplates = async () => {
    setIsFetchingOnline(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockOnlineData: CustomTemplateData[] = [
            {
                id: "online_seo_expert",
                title: "SEO Keyword Researcher (Online)",
                desc: "Từ cộng đồng: Nghiên cứu từ khóa long-tail.",
                category: "Marketing",
                tags: ["SEO", "Community"],
                inputs: [{ id: "topic", label: "Chủ đề", placeholder: "Giày chạy bộ", type: "text" }],
                templateString: "Hãy đóng vai chuyên gia SEO. Nghiên cứu 10 từ khóa long-tail cho chủ đề: {{topic}}."
            }
        ];
        
        setOnlineTemplatesData(mockOnlineData);
        alert(`Đã tải thành công ${mockOnlineData.length} template từ Online Store.`);
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
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-slate-950 text-slate-200">
      
      {/* Sidebar */}
      <Sidebar 
        templates={allTemplates} 
        savedPrompts={savedPrompts}
        selectedTemplateId={selectedTemplate?.id || null} 
        onSelectTemplate={handleSelectTemplate}
        onLoadSavedPrompt={handleLoadSavedPrompt}
        onDeleteSavedPrompt={handleDeleteSavedPrompt}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onExportTemplates={handleExportTemplates}
        onImportTemplates={handleImportTemplates}
        onFetchOnline={handleFetchOnlineTemplates}
        isFetchingOnline={isFetchingOnline}
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden relative">
        
        {/* Main Header (Desktop & Mobile) */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
            <div className="flex items-center gap-3">
                 {/* Mobile Menu Toggle */}
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-400 p-1 hover:text-white transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden md:block">
                    <h1 className="font-bold text-white text-lg">
                        {selectedTemplate ? selectedTemplate.title : "Prompt Engineer Pro"}
                    </h1>
                </div>
            </div>

            {/* Right Action: Login / Key */}
            <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-700 transition-all text-xs md:text-sm"
            >
                {user ? (
                   <img src={user.avatar} alt="User" className="w-5 h-5 rounded-full border border-slate-500" />
                ) : (
                   <UserCircle className="w-5 h-5 text-slate-400" />
                )}
                
                <div className="flex flex-col items-start leading-none">
                    <span className="font-bold text-slate-200">
                        {user ? user.name : "Đăng nhập / Key"}
                    </span>
                    {apiKey && (
                        <span className="text-[10px] text-green-400 font-mono flex items-center gap-1 mt-0.5">
                            <Key className="w-2.5 h-2.5" /> API KEY: ACTIVE
                        </span>
                    )}
                </div>
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-smooth">
            
          {/* Left Column: Config */}
          <div className="space-y-6">
            <div className="md:hidden">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedTemplate ? selectedTemplate.title : "Chào mừng"}
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                {selectedTemplate ? selectedTemplate.desc : "Hãy chọn một template để bắt đầu."}
              </p>
            </div>
            
            {/* Badges (Only show on desktop here, mobile shows above if needed but kept simple) */}
            {selectedTemplate && (
              <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-2 py-1 rounded border text-xs font-mono uppercase ${
                      selectedTemplate.source === 'local' ? 'bg-indigo-900/50 border-indigo-700 text-indigo-300' :
                      selectedTemplate.source === 'online' ? 'bg-green-900/50 border-green-700 text-green-300' :
                      'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {selectedTemplate.source === 'local' ? 'Personal' : 
                     selectedTemplate.source === 'online' ? 'Community' : 'System'}
                  </span>
                  {selectedTemplate.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-sky-400 font-mono">
                      {tag}
                    </span>
                  ))}
              </div>
            )}

            {/* Form Inputs */}
            <InputForm 
              template={selectedTemplate} 
              formData={formData} 
              onChange={handleInputChange} 
              apiKey={apiKey}
            />

            {/* Explain Box */}
            {selectedTemplate && (
              <TacticBox tactic={selectedTemplate.tactic} />
            )}
          </div>

          {/* Right Column: Result */}
          <OutputDisplay 
            promptText={generatedPrompt} 
            onSave={handleSavePrompt}
            title={selectedTemplate?.title}
            attachedImages={attachedImages}
            apiKey={apiKey}
          />

        </div>
      </main>

      {/* Create Template Modal */}
      {isCreateModalOpen && (
        <CreateTemplateModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveCustomTemplate}
        />
      )}

      {/* Login & API Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />
    </div>
  );
};

export default App;