import React, { useState } from 'react';
import { Template, SavedPrompt } from '../types';
import { 
  Brain, 
  Video, 
  Code, 
  Bug, 
  Bot, 
  Terminal, 
  LineChart,
  History,
  Trash2,
  Bookmark,
  Mail,
  Database,
  FileText,
  Search,
  Target,
  Shield,
  FileJson,
  Layers,
  Youtube
} from 'lucide-react';

interface SidebarProps {
  templates: Template[];
  savedPrompts: SavedPrompt[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: Template) => void;
  onLoadSavedPrompt: (prompt: SavedPrompt) => void;
  onDeleteSavedPrompt: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const IconMap: Record<string, React.FC<{ className?: string }>> = {
  "chart-line": LineChart,
  "video": Video,
  "code": Code,
  "bug": Bug,
  "robot": Bot,
  "mail": Mail,
  "database": Database,
  "file-text": FileText,
  "search": Search,
  "target": Target,
  "shield": Shield,
  "file-json": FileJson,
  "layers": Layers,
  "youtube": Youtube
};

const Sidebar: React.FC<SidebarProps> = ({ 
  templates, 
  savedPrompts, 
  selectedTemplateId, 
  onSelectTemplate, 
  onLoadSavedPrompt,
  onDeleteSavedPrompt,
  isOpen, 
  onCloseMobile 
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'saved'>('templates');
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <aside 
      className={`
        fixed md:relative top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center text-slate-100">
            <Brain className="w-5 h-5 text-sky-400 mr-2" />
            Prompt Master
            </h1>
            <p className="text-xs text-slate-500 mt-1">Cấu hình cho Gemini Studio</p>
        </div>
        {/* Close button for mobile */}
        <button className="md:hidden text-slate-400" onClick={onCloseMobile}>
             &times;
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'templates' 
              ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-800/50' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'saved' 
              ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-800/50' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Đã lưu ({savedPrompts.length})
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {activeTab === 'templates' ? (
          categories.map(cat => (
            <div key={cat}>
              <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">
                {cat}
              </div>
              {templates.filter(t => t.category === cat).map(template => {
                const Icon = IconMap[template.iconName] || Terminal;
                const isActive = selectedTemplateId === template.id;
                
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template);
                      onCloseMobile();
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center gap-3 mb-1
                      ${isActive 
                        ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-900/20' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span className="truncate">{template.title}</span>
                  </button>
                );
              })}
            </div>
          ))
        ) : (
          <div className="space-y-2">
             {savedPrompts.length === 0 && (
                <div className="text-center text-slate-500 text-sm py-8">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Chưa có prompt nào được lưu.
                </div>
             )}
             {savedPrompts.slice().reverse().map(prompt => (
               <div 
                 key={prompt.id}
                 onClick={() => {
                   onLoadSavedPrompt(prompt);
                   onCloseMobile();
                 }}
                 className="group relative w-full text-left px-4 py-3 rounded-lg text-sm bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-800 hover:border-slate-700 cursor-pointer"
               >
                 <div className="flex items-center gap-2 mb-1">
                   <Bookmark className="w-3 h-3 text-sky-400" />
                   <span className="font-bold text-slate-300 truncate">{prompt.title}</span>
                 </div>
                 <div className="text-xs text-slate-500 mb-1">
                   {new Date(prompt.createdAt).toLocaleString('vi-VN')}
                 </div>
                 <div className="text-xs text-slate-600 truncate font-mono">
                   {prompt.content.substring(0, 50)}...
                 </div>
                 
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     onDeleteSavedPrompt(prompt.id, e);
                   }}
                   className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded opacity-0 group-hover:opacity-100 transition-all"
                   title="Xóa"
                 >
                   <Trash2 className="w-3 h-3" />
                 </button>
               </div>
             ))}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-center text-slate-500">
        Built for MMO & Tech Pros
      </div>
    </aside>
  );
};

export default Sidebar;