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

const App: React.FC = () => {
  // --- STATES ---
  
  // Custom Templates from LocalStorage
  const [customTemplatesData, setCustomTemplatesData] = useState<CustomTemplateData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_TEMPLATES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Convert Custom Templates Data to useable Template objects with generate function
  const customTemplates: Template[] = useMemo(() => {
    return customTemplatesData.map(data => ({
      ...data,
      iconName: 'custom',
      tactic: "**Custom Template**: Do người dùng tự định nghĩa.",
      isCustom: true,
      generate: (formData: Record<string, string>) => {
        let text = data.templateString;
        // Simple interpolation {{id}}
        data.inputs.forEach(input => {
          if (input.type === 'image') return; // Do not interpolate image base64 into text
          const val = formData[input.id] || `[${input.label}]`;
          // Replace all occurrences
          text = text.split(`{{${input.id}}}`).join(val);
        });
        return text;
      }
    }));
  }, [customTemplatesData]);

  // Merge System + Custom Templates
  const allTemplates = useMemo(() => [...customTemplates, ...TEMPLATES], [customTemplates]);

  // Selected Template
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_TEMPLATE);
    return null; 
  });

  // Sync selected template on mount (deferred to ensure allTemplates is ready)
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

  // Update generated prompt and extract images when data or template changes
  useEffect(() => {
    if (selectedTemplate) {
        setGeneratedPrompt(selectedTemplate.generate(formData));
        
        // Extract images from formData based on template inputs
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
      
      {/* Sidebar (Includes Overlay) */}
      <Sidebar 
        templates={allTemplates} 
        savedPrompts={savedPrompts}
        selectedTemplateId={selectedTemplate?.id || null} 
        onSelectTemplate={handleSelectTemplate}
        onLoadSavedPrompt={handleLoadSavedPrompt}
        onDeleteSavedPrompt={handleDeleteSavedPrompt}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden relative">
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <span className="font-bold text-slate-100">Prompt Generator</span>
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
                  {selectedTemplate.isCustom && (
                    <span className="px-2 py-1 rounded bg-indigo-900/50 border border-indigo-700 text-xs text-indigo-300 font-mono">
                      User Created
                    </span>
                  )}
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