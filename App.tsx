import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import TacticBox from './components/TacticBox';
import { TEMPLATES } from './constants';
import { Template, SavedPrompt } from './types';
import { Menu } from 'lucide-react';

const STORAGE_KEY_TEMPLATE = 'pe_template_id';
const STORAGE_KEY_FORM = 'pe_form_data';
const STORAGE_KEY_SAVED = 'pe_saved_prompts';

const App: React.FC = () => {
  // Initialize State from LocalStorage
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_TEMPLATE);
    return TEMPLATES.find(t => t.id === savedId) || null;
  });

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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Initialize generated prompt based on restored state
  const [generatedPrompt, setGeneratedPrompt] = useState<string>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_TEMPLATE);
    const template = TEMPLATES.find(t => t.id === savedId);
    
    let savedData = {};
    try {
        const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
        if (savedForm) savedData = JSON.parse(savedForm);
    } catch {}

    if (template) {
        return template.generate(savedData as Record<string, string>);
    }
    return "// Điền thông tin bên trái để tạo Prompt...";
  });

  // Persist Template Selection
  useEffect(() => {
    if (selectedTemplate) {
      localStorage.setItem(STORAGE_KEY_TEMPLATE, selectedTemplate.id);
    } else {
      localStorage.removeItem(STORAGE_KEY_TEMPLATE);
    }
  }, [selectedTemplate]);

  // Persist Form Data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData));
  }, [formData]);

  // Persist Saved Prompts
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  // Handle Template Switching
  const handleSelectTemplate = (template: Template) => {
    // If clicking the same template, do nothing
    if (selectedTemplate?.id === template.id) {
        setIsMobileMenuOpen(false);
        return;
    }

    setSelectedTemplate(template);
    setFormData({}); // Clear old data when switching templates
    setGeneratedPrompt(template.generate({}));
    setIsMobileMenuOpen(false);
  };

  const handleInputChange = (id: string, value: string) => {
    const newData = { ...formData, [id]: value };
    setFormData(newData);
    
    if (selectedTemplate) {
        setGeneratedPrompt(selectedTemplate.generate(newData));
    }
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
    const template = TEMPLATES.find(t => t.id === prompt.templateId);
    if (template) {
      setSelectedTemplate(template);
      setFormData(prompt.formData);
      setGeneratedPrompt(prompt.content);
    }
  };

  const handleDeleteSavedPrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering load
    if (window.confirm('Bạn có chắc muốn xóa prompt này?')) {
      setSavedPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-slate-950 text-slate-200">
      
      {/* Sidebar */}
      <Sidebar 
        templates={TEMPLATES} 
        savedPrompts={savedPrompts}
        selectedTemplateId={selectedTemplate?.id || null} 
        onSelectTemplate={handleSelectTemplate}
        onLoadSavedPrompt={handleLoadSavedPrompt}
        onDeleteSavedPrompt={handleDeleteSavedPrompt}
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden relative">
        
        {/* Header Mobile */}
        <div className="md:hidden p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <span className="font-bold text-slate-100">Prompt Generator</span>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-400 p-1">
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
                {selectedTemplate ? selectedTemplate.desc : "Hãy chọn danh mục bên trái để bắt đầu."}
              </p>
              
              {/* Badges */}
              {selectedTemplate && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedTemplate.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-sky-400 font-mono">
                      {tag}
                    </span>
                  ))}
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
          />

        </div>
      </main>
    </div>
  );
};

export default App;