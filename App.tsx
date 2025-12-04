import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import TacticBox from './components/TacticBox';
import CreateTemplateModal from './components/CreateTemplateModal';
import { TEMPLATES } from './constants';
import { Template, SavedPrompt, CustomTemplateData } from './types';
import { Menu } from 'lucide-react';

const STORAGE_KEY_TEMPLATE = 'pe_template_id';
const STORAGE_KEY_FORM = 'pe_form_data';
const STORAGE_KEY_SAVED = 'pe_saved_prompts';
const STORAGE_KEY_CUSTOM_TEMPLATES = 'pe_custom_templates';

// Example Community Store URL (You can replace this with your own GitHub Raw Gist URL)
const COMMUNITY_TEMPLATES_URL = 'https://raw.githubusercontent.com/google-gemini/cookbook/main/examples/json/prompts.json'; 
// Note: Since the above is a dummy placeholder for structure, we might simulate a fetch error or handle it gracefully.

const App: React.FC = () => {
  // --- STATES ---
  
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
        // For demonstration, we'll simulate a fetch since the URL above might not have the exact schema we need.
        // In a real app, you would fetch(COMMUNITY_TEMPLATES_URL)
        
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Data simulation
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
        
        // Validate structure
        const validTemplates = json.filter((t: any) => t.id && t.title && t.inputs && t.templateString);
        
        if (validTemplates.length === 0) {
           throw new Error("Không tìm thấy template hợp lệ trong file.");
        }

        // Avoid duplicates ID
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
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <span className="font-bold text-slate-100">Prompt Engineer Pro</span>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-400 p-1 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
          {/* Left Column: Config */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedTemplate ? selectedTemplate.title : "Chọn một kịch bản"}
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                {selectedTemplate ? selectedTemplate.desc : "Hãy chọn template từ danh sách hoặc tạo mới."}
              </p>
              
              {/* Badges */}
              {selectedTemplate && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedTemplate.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-sky-400 font-mono">
                      {tag}
                    </span>
                  ))}
                  {/* Source Badge */}
                  <span className={`px-2 py-1 rounded border text-xs font-mono uppercase ${
                      selectedTemplate.source === 'local' ? 'bg-indigo-900/50 border-indigo-700 text-indigo-300' :
                      selectedTemplate.source === 'online' ? 'bg-green-900/50 border-green-700 text-green-300' :
                      'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {selectedTemplate.source === 'local' ? 'Local / Personal' : 
                     selectedTemplate.source === 'online' ? 'Online / Community' : 'System / Built-in'}
                  </span>
                </div>
              )}
            </div>

            {/* Form Inputs */}
            <InputForm 
              template={selectedTemplate} 
              formData={formData} 
              onChange={handleInputChange} 
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
    </div>
  );
};

export default App;