import React, { useState, useMemo, useRef } from 'react';
import { Template, SavedPrompt, TemplateSource } from '../types';
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
  Youtube,
  PlusCircle,
  PencilRuler,
  Image,
  Palette,
  Captions,
  LayoutTemplate,
  ShoppingBag,
  Globe,
  Shuffle,
  Lock,
  Upload,
  Download,
  Cloud,
  HardDrive,
  Box,
  RefreshCw,
  ScanSearch,
  PieChart,
  Users,
  Share2,
  Briefcase,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  templates: Template[];
  savedPrompts: SavedPrompt[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: Template) => void;
  onLoadSavedPrompt: (prompt: SavedPrompt) => void;
  onDeleteSavedPrompt: (id: string, e: React.MouseEvent) => void;
  onOpenCreateModal: () => void;
  onExportTemplates: () => void;
  onImportTemplates: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFetchOnline: () => void;
  isFetchingOnline: boolean;
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
  "youtube": Youtube,
  "custom": PencilRuler,
  "image": Image,
  "palette": Palette,
  "captions": Captions,
  "layout-template": LayoutTemplate,
  "shopping-bag": ShoppingBag,
  "globe": Globe,
  "shuffle": Shuffle,
  "lock": Lock,
  "scan-search": ScanSearch,
  "pie-chart": PieChart,
  "users": Users,
  "share-2": Share2,
  "briefcase": Briefcase,
  "book-open": BookOpen
};

const Sidebar: React.FC<SidebarProps> = ({ 
  templates, 
  savedPrompts, 
  selectedTemplateId, 
  onSelectTemplate, 
  onLoadSavedPrompt,
  onDeleteSavedPrompt,
  onOpenCreateModal,
  onExportTemplates,
  onImportTemplates,
  onFetchOnline,
  isFetchingOnline,
  isOpen, 
  onCloseMobile 
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'saved'>('library');
  const [sourceFilter, setSourceFilter] = useState<'all' | TemplateSource>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter templates based on search term AND source
  const filteredTemplates = useMemo(() => {
    let result = templates;

    // Filter by Source
    if (sourceFilter !== 'all') {
      result = result.filter(t => t.source === sourceFilter);
    }

    // Filter by Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(lowerTerm) || 
        t.desc.toLowerCase().includes(lowerTerm) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerTerm))
      );
    }
    return result;
  }, [templates, searchTerm, sourceFilter]);

  // Group templates by category
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, Template[]> = {};
    filteredTemplates.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTemplates]);

  const categories = Object.keys(groupedTemplates);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ease-in-out backdrop-blur-sm ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside 
        className={`
          fixed md:relative top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:translate-x-0 md:opacity-100'}
        `}
      >
        <div className="p-4 border-b border-slate-800">
          <div className="flex justify-between items-center mb-4">
              <div>
                  <h1 className="text-xl font-bold tracking-tight flex items-center text-slate-100">
                  <Brain className="w-5 h-5 text-sky-400 mr-2" />
                  Prompt Pro
                  </h1>
              </div>
              <button className="md:hidden text-slate-400 hover:text-white p-1" onClick={onCloseMobile}>&times;</button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-3">
            <input 
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          {/* Main Tabs */}
          <div className="flex bg-slate-800/50 p-1 rounded-lg">
            <button
                onClick={() => setActiveTab('library')}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                activeTab === 'library' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
                Library
            </button>
            <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                activeTab === 'saved' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
                Saved ({savedPrompts.length})
            </button>
          </div>
        </div>

        {/* Source Filters (Only in Library mode) */}
        {activeTab === 'library' && (
          <div className="px-4 py-2 border-b border-slate-800 flex justify-between gap-1 overflow-x-auto no-scrollbar">
             <button onClick={() => setSourceFilter('all')} title="All" className={`p-1.5 rounded-md ${sourceFilter === 'all' ? 'bg-sky-900/50 text-sky-400' : 'text-slate-500 hover:bg-slate-800'}`}>
                <Layers className="w-4 h-4" />
             </button>
             <button onClick={() => setSourceFilter('system')} title="System" className={`p-1.5 rounded-md ${sourceFilter === 'system' ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:bg-slate-800'}`}>
                <Box className="w-4 h-4" />
             </button>
             <button onClick={() => setSourceFilter('local')} title="My Templates" className={`p-1.5 rounded-md ${sourceFilter === 'local' ? 'bg-indigo-900/50 text-indigo-400' : 'text-slate-500 hover:bg-slate-800'}`}>
                <HardDrive className="w-4 h-4" />
             </button>
             <button onClick={() => setSourceFilter('online')} title="Online Store" className={`p-1.5 rounded-md ${sourceFilter === 'online' ? 'bg-green-900/50 text-green-400' : 'text-slate-500 hover:bg-slate-800'}`}>
                <Cloud className="w-4 h-4" />
             </button>
          </div>
        )}
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          
          {activeTab === 'library' && (
            <>
               {/* Quick Actions */}
               <div className="flex gap-2 mb-4">
                 <button 
                   onClick={() => {
                     onOpenCreateModal();
                     onCloseMobile();
                   }}
                   className="flex-1 border border-dashed border-slate-600 rounded-lg p-2 text-xs text-slate-400 hover:text-white hover:border-sky-500 hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-1 group"
                 >
                   <PlusCircle className="w-4 h-4 group-hover:text-sky-400" />
                   Create
                 </button>
                 
                 {/* Only show Fetch button if filtering Online or All */}
                 {(sourceFilter === 'all' || sourceFilter === 'online') && (
                     <button 
                     onClick={onFetchOnline}
                     className="flex-1 border border-dashed border-slate-600 rounded-lg p-2 text-xs text-slate-400 hover:text-white hover:border-green-500 hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-1 group"
                   >
                     <RefreshCw className={`w-4 h-4 group-hover:text-green-400 ${isFetchingOnline ? 'animate-spin' : ''}`} />
                     {isFetchingOnline ? 'Loading...' : 'Fetch Online'}
                   </button>
                 )}
               </div>

                {categories.length > 0 ? (
                  categories.map(cat => (
                    <div key={cat}>
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-2">
                        {cat}
                      </div>
                      {groupedTemplates[cat].map(template => {
                        const Icon = IconMap[template.iconName] || (template.isCustom ? IconMap['custom'] : Terminal);
                        const isActive = selectedTemplateId === template.id;
                        
                        return (
                          <button
                            key={template.id}
                            onClick={() => {
                              onSelectTemplate(template);
                              onCloseMobile();
                            }}
                            className={`
                              w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-3 mb-1 group relative
                              ${isActive 
                                ? 'bg-sky-600 text-white font-bold shadow-md' 
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }
                            `}
                          >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                            <div className="truncate flex-1">
                                <div className="truncate">{template.title}</div>
                            </div>
                            
                            {/* Source Indicator Dot */}
                            {template.source === 'local' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Local"></div>}
                            {template.source === 'online' && <div className="w-1.5 h-1.5 rounded-full bg-green-500" title="Online"></div>}
                          </button>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 text-xs py-10 flex flex-col items-center">
                      <Search className="w-6 h-6 mb-2 opacity-50"/>
                      Không tìm thấy template nào.
                      {(sourceFilter === 'online' && templates.length === 0) && (
                          <span className="mt-2 text-sky-400 cursor-pointer" onClick={onFetchOnline}>Nhấn Fetch Online để tải</span>
                      )}
                  </div>
                )}
            </>
          )}

          {activeTab === 'saved' && (
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

        {/* Footer Actions for Backup */}
        <div className="p-4 border-t border-slate-800">
           <div className="flex gap-2 mb-2">
              <button 
                onClick={onExportTemplates}
                className="flex-1 flex items-center justify-center px-2 py-1.5 text-[10px] uppercase font-bold bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Xuất file JSON (Chỉ Local Templates)"
              >
                <Download className="w-3 h-3 mr-1.5" /> Backup Local
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center px-2 py-1.5 text-[10px] uppercase font-bold bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Nhập file JSON"
              >
                <Upload className="w-3 h-3 mr-1.5" /> Restore
              </button>
              <input 
                 type="file" 
                 accept=".json" 
                 ref={fileInputRef} 
                 className="hidden" 
                 onChange={onImportTemplates}
              />
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;