import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  BookOpen,
  CandlestickChart,
  Calculator,
  Newspaper,
  Coins,
  Code2,
  Smartphone,
  Megaphone,
  Sparkles,
  ArrowRight,
  Hash,
  FolderTree,
  PenTool
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
  "book-open": BookOpen,
  // New Finance Icons
  "candlestick-chart": CandlestickChart,
  "calculator": Calculator,
  "newspaper": Newspaper,
  "coins": Coins,
  "code-2": Code2,
  // New Social Icons
  "smartphone": Smartphone,
  "megaphone": Megaphone,
  // Tech Icons
  "folder-tree": FolderTree,
  "sparkles": Sparkles,
  "pen-tool": PenTool
};

const POPULAR_TAGS = ["SEO", "Marketing", "Coding", "Email", "YouTube", "TikTok", "Business", "Design"];

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Suggestions for autocomplete (Top 5 matches)
  const suggestionTemplates = useMemo(() => {
    if (!searchTerm) return [];
    return filteredTemplates.slice(0, 5);
  }, [filteredTemplates, searchTerm]);

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

  const handleSuggestionClick = (template: Template) => {
    onSelectTemplate(template);
    setIsSearchFocused(false);
    onCloseMobile();
    // Optional: Keep search term or clear it? Let's keep it for context but user sees the selected one.
    // setSearchTerm(''); 
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    // Keep focus to show results
    setIsSearchFocused(false);
  };

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
          fixed md:relative top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:translate-x-0 md:opacity-100'}
        `}
      >
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="flex justify-between items-center mb-5">
              <div>
                  <h1 className="text-xl font-extrabold tracking-tight flex items-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                  <Brain className="w-6 h-6 text-sky-400 mr-2" />
                  Prompt Pro
                  </h1>
              </div>
              <button className="md:hidden text-slate-400 hover:text-white p-1" onClick={onCloseMobile}>&times;</button>
          </div>
          
          {/* Search Bar with Suggestions */}
          <div className="relative mb-4 group" ref={searchContainerRef}>
            <input 
              type="text"
              placeholder="Tìm kiếm templates..."
              value={searchTerm}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-500 transition-all group-hover:bg-slate-800"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 group-hover:text-slate-400 transition-colors" />
            
            {/* Clear Button */}
            {searchTerm && (
               <button 
                onClick={() => { setSearchTerm(''); setIsSearchFocused(true); }}
                className="absolute right-2 top-2.5 text-slate-500 hover:text-white"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            )}

            {/* Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-[60]">
                {searchTerm ? (
                  // Mode: Autocomplete Results
                  <>
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800/50 flex justify-between items-center">
                       <span>Gợi ý nhanh</span>
                       <span className="text-[9px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded-full">{filteredTemplates.length} results</span>
                    </div>
                    {suggestionTemplates.length > 0 ? (
                      <div>
                        {suggestionTemplates.map(t => {
                           const Icon = IconMap[t.iconName] || Terminal;
                           return (
                             <button
                               key={t.id}
                               onClick={() => handleSuggestionClick(t)}
                               className="w-full text-left px-3 py-2.5 text-xs text-slate-300 hover:bg-sky-600 hover:text-white flex items-center gap-2 transition-colors border-b border-slate-700/50 last:border-0"
                             >
                               <Icon className="w-3.5 h-3.5 opacity-70" />
                               <span className="truncate">{t.title}</span>
                               <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                             </button>
                           )
                        })}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-xs italic">
                        Không tìm thấy kết quả phù hợp.
                      </div>
                    )}
                  </>
                ) : (
                  // Mode: Popular Tags / Recommendations
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <span>Từ khóa phổ biến</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_TAGS.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="px-2 py-1 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded text-[10px] text-slate-300 hover:text-white transition-all flex items-center gap-1"
                        >
                          <Hash className="w-2.5 h-2.5 opacity-50" /> {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-lg">
            <button
                onClick={() => setActiveTab('library')}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                activeTab === 'library' ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
                Library
            </button>
            <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                activeTab === 'saved' ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
                Saved ({savedPrompts.length})
            </button>
          </div>
        </div>

        {/* Source Filters (Only in Library mode) */}
        {activeTab === 'library' && (
          <div className="px-4 py-2 border-b border-slate-800 flex justify-between gap-1 overflow-x-auto no-scrollbar bg-slate-900/30">
             <button onClick={() => setSourceFilter('all')} title="All" className={`p-1.5 rounded-md transition-colors ${sourceFilter === 'all' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>
                <Layers className="w-4 h-4" />
             </button>
             <button onClick={() => setSourceFilter('system')} title="System" className={`p-1.5 rounded-md transition-colors ${sourceFilter === 'system' ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>
                <Box className="w-4 h-4" />
             </button>
             <button onClick={() => setSourceFilter('local')} title="My Templates" className={`p-1.5 rounded-md transition-colors ${sourceFilter === 'local' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>
                <HardDrive className="w-4 h-4" />
             </button>
             <button onClick={() => setSourceFilter('online')} title="Online Store" className={`p-1.5 rounded-md transition-colors ${sourceFilter === 'online' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>
                <Cloud className="w-4 h-4" />
             </button>
          </div>
        )}
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {activeTab === 'library' && (
            <>
               {/* Quick Actions */}
               <div className="flex gap-2 mb-2">
                 <button 
                   onClick={() => {
                     onOpenCreateModal();
                     onCloseMobile();
                   }}
                   className="flex-1 border border-dashed border-slate-700 rounded-lg p-3 text-xs text-slate-400 hover:text-white hover:border-sky-500 hover:bg-sky-900/10 transition-all flex flex-col items-center justify-center gap-1 group"
                 >
                   <PlusCircle className="w-4 h-4 group-hover:text-sky-400" />
                   Create New
                 </button>
                 
                 {/* Only show Fetch button if filtering Online or All */}
                 {(sourceFilter === 'all' || sourceFilter === 'online') && (
                     <button 
                     onClick={onFetchOnline}
                     className="flex-1 border border-dashed border-slate-700 rounded-lg p-3 text-xs text-slate-400 hover:text-white hover:border-emerald-500 hover:bg-emerald-900/10 transition-all flex flex-col items-center justify-center gap-1 group"
                   >
                     <RefreshCw className={`w-4 h-4 group-hover:text-emerald-400 ${isFetchingOnline ? 'animate-spin' : ''}`} />
                     {isFetchingOnline ? 'Loading...' : 'Fetch Online'}
                   </button>
                 )}
               </div>

                {categories.length > 0 ? (
                  categories.map(cat => (
                    <div key={cat} className="space-y-1">
                      <div className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="h-px flex-1 bg-slate-800"></span>
                        {cat}
                        <span className="h-px flex-1 bg-slate-800"></span>
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
                              w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3 group relative
                              ${isActive 
                                ? 'bg-gradient-to-r from-sky-600/90 to-indigo-600/90 text-white font-bold shadow-lg shadow-sky-900/20 border border-transparent' 
                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent hover:border-slate-700'
                              }
                            `}
                          >
                            <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-sky-400'}`} />
                            <div className="truncate flex-1">
                                <div className="truncate">{template.title}</div>
                            </div>
                            
                            {/* Source Indicator Dot */}
                            {template.source === 'local' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]" title="Local"></div>}
                            {template.source === 'online' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" title="Online"></div>}
                          </button>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 text-xs py-10 flex flex-col items-center">
                      <Search className="w-8 h-8 mb-3 opacity-30"/>
                      <p>Không tìm thấy template nào.</p>
                      {(sourceFilter === 'online' && templates.length === 0) && (
                          <span className="mt-2 text-sky-400 cursor-pointer hover:underline" onClick={onFetchOnline}>Nhấn để tải từ Online Store</span>
                      )}
                  </div>
                )}
            </>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-2">
               {savedPrompts.length === 0 && (
                  <div className="text-center text-slate-500 text-sm py-12 flex flex-col items-center justify-center opacity-60">
                    <History className="w-10 h-10 mb-3 text-slate-600" />
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
                   className="group relative w-full text-left px-4 py-3 rounded-lg text-sm bg-slate-800/40 hover:bg-slate-800 transition-all border border-slate-800 hover:border-slate-600 cursor-pointer shadow-sm"
                 >
                   <div className="flex items-center gap-2 mb-1">
                     <Bookmark className="w-3.5 h-3.5 text-sky-500/80" />
                     <span className="font-bold text-slate-300 truncate group-hover:text-white transition-colors">{prompt.title}</span>
                   </div>
                   <div className="text-[10px] text-slate-500 mb-1 font-mono">
                     {new Date(prompt.createdAt).toLocaleString('vi-VN')}
                   </div>
                   
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       onDeleteSavedPrompt(prompt.id, e);
                     }}
                     className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                     title="Xóa"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                 </div>
               ))}
            </div>
          )}
        </nav>

        {/* Footer Actions for Backup */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
           <div className="flex gap-2 mb-2">
              <button 
                onClick={onExportTemplates}
                className="flex-1 flex items-center justify-center px-2 py-2 text-[10px] uppercase font-bold bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all"
                title="Xuất file JSON (Chỉ Local Templates)"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Backup
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center px-2 py-2 text-[10px] uppercase font-bold bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all"
                title="Nhập file JSON"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Restore
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