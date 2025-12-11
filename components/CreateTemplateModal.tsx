import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, GripVertical, List } from 'lucide-react';
import { InputConfig, CustomTemplateData } from '../types';

interface CreateTemplateModalProps {
  onClose: () => void;
  onSave: (template: CustomTemplateData) => void;
  initialData?: CustomTemplateData | null; // For Editing Mode
  existingCategories?: string[]; // For Category Suggestions
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ 
  onClose, 
  onSave, 
  initialData, 
  existingCategories = [] 
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Custom');
  const [inputs, setInputs] = useState<InputConfig[]>([]);
  const [templateString, setTemplateString] = useState('');
  
  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Initialize data if in Edit Mode
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDesc(initialData.desc);
      setCategory(initialData.category);
      setInputs(initialData.inputs);
      setTemplateString(initialData.templateString);
    }
  }, [initialData]);

  // Helper for input creation
  const addInput = () => {
    const id = `input_${Date.now()}`;
    setInputs([...inputs, { id, label: '', placeholder: '', type: 'text' }]);
  };

  const updateInput = (index: number, field: keyof InputConfig, value: any) => {
    const newInputs = [...inputs];
    (newInputs[index] as any)[field] = value;
    setInputs(newInputs);
  };
  
  // Handle options update for Select type
  const updateInputOptions = (index: number, optionsString: string) => {
     const options = optionsString.split(',').map(s => {
         const trimmed = s.trim();
         return { label: trimmed, value: trimmed };
     }).filter(o => o.value);
     
     const newInputs = [...inputs];
     newInputs[index].options = options;
     setInputs(newInputs);
  };

  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Create a copy and swap items
    const newInputs = [...inputs];
    const draggedItem = newInputs[draggedIndex];
    
    // Remove from old position
    newInputs.splice(draggedIndex, 1);
    // Insert at new position
    newInputs.splice(index, 0, draggedItem);
    
    setInputs(newInputs);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    if (!title || !templateString) {
      alert("Vui lòng nhập Tên Template và Nội dung Prompt!");
      return;
    }
    
    const newTemplate: CustomTemplateData = {
      // If editing, keep old ID, else generate new ID
      id: initialData ? initialData.id : `custom_${Date.now()}`,
      title,
      desc,
      category: category || 'Custom',
      tags: initialData ? initialData.tags : ['Custom'], // Preserve tags or default
      inputs,
      templateString
    };
    
    onSave(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-lg font-bold text-white">
            {initialData ? 'Chỉnh sửa Template' : 'Tạo Template Mới'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Tên Template</label>
              <input 
                value={title} onChange={e => setTitle(e.target.value)}
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm text-white focus:border-sky-500 outline-none"
                placeholder="Ví dụ: Email đòi nợ..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 flex justify-between">
                Danh mục (Phân loại)
              </label>
              <div className="relative">
                <input 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm text-white focus:border-sky-500 outline-none"
                  placeholder="Chọn hoặc nhập mới..."
                  list="category-suggestions"
                />
                <List className="absolute right-2 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <datalist id="category-suggestions">
                  {existingCategories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                  <option value="Marketing" />
                  <option value="Coding" />
                  <option value="Writing" />
                  <option value="Business" />
                </datalist>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Mô tả ngắn</label>
            <input 
              value={desc} onChange={e => setDesc(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm text-white focus:border-sky-500 outline-none"
              placeholder="Mô tả công dụng của prompt này..."
            />
          </div>

          {/* Inputs Builder */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-sky-400 uppercase">1. Định nghĩa Input</label>
              <button onClick={addInput} className="text-xs flex items-center bg-sky-600 hover:bg-sky-500 text-white px-2 py-1 rounded">
                <Plus className="w-3 h-3 mr-1" /> Thêm Input
              </button>
            </div>
            
            {inputs.length === 0 && <p className="text-slate-500 text-xs italic">Chưa có input nào. Prompt sẽ là tĩnh.</p>}

            <div className="space-y-2">
              {inputs.map((input, idx) => (
                <div 
                  key={input.id} 
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()} // Essential to allow drop
                  className={`flex flex-col gap-2 bg-slate-900 p-2 rounded border border-slate-800 transition-all ${
                    draggedIndex === idx ? 'opacity-40 border-dashed border-sky-500 bg-slate-800' : 'hover:border-slate-600'
                  }`}
                >
                  <div className="flex gap-2 items-start">
                      {/* Drag Handle */}
                      <div className="mt-2 text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400 p-1" title="Kéo để thay đổi thứ tự">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input 
                              value={input.label} onChange={e => updateInput(idx, 'label', e.target.value)}
                              className="flex-1 p-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-600 focus:border-sky-500 outline-none"
                              placeholder="Label (VD: Tên khách hàng)"
                            />
                            <select 
                              value={input.type} onChange={e => updateInput(idx, 'type', e.target.value)}
                              className="p-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300 focus:border-sky-500 outline-none"
                            >
                              <option value="text">Short Text</option>
                              <option value="textarea">Long Text</option>
                              <option value="select">Dropdown (Chọn)</option>
                              <option value="image">Image Upload</option>
                              <option value="file">File Upload</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-1 rounded border border-slate-700 select-all">ID: {input.id}</span>
                                {input.type !== 'image' && (
                                <span className="text-[10px] text-slate-500">Dùng <code className="text-sky-400 select-all">{`{{${input.id}}}`}</code> trong prompt</span>
                                )}
                            </div>

                            {/* Validation Controls */}
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1.5 cursor-pointer bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 hover:border-slate-600">
                                    <input 
                                        type="checkbox" 
                                        checked={!!input.required} 
                                        onChange={e => updateInput(idx, 'required', e.target.checked)}
                                        className="w-3 h-3 rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                                    />
                                    <span className="text-[10px] text-slate-300 select-none">Bắt buộc</span>
                                </label>
                                
                                {input.type === 'text' && (
                                    <select
                                        value={input.validationRule || ''}
                                        onChange={e => updateInput(idx, 'validationRule', e.target.value || undefined)}
                                        className="p-0.5 px-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 focus:border-sky-500 outline-none"
                                        title="Quy tắc kiểm tra định dạng"
                                    >
                                        <option value="">Không kiểm tra định dạng</option>
                                        <option value="email">Email</option>
                                        <option value="url">URL</option>
                                    </select>
                                )}
                            </div>
                        </div>
                      </div>
                      <button onClick={() => removeInput(idx)} className="text-slate-500 hover:text-red-400 p-1 mt-1" title="Xóa input này">
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                  
                  {/* Additional settings for Select type */}
                  {input.type === 'select' && (
                       <div className="ml-7">
                           <input 
                              value={input.options?.map(o => o.value).join(', ') || ''} 
                              onChange={e => updateInputOptions(idx, e.target.value)}
                              className="w-full p-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:border-sky-500 outline-none"
                              placeholder="Nhập các lựa chọn, ngăn cách bằng dấu phẩy (VD: Tùy chọn A, Tùy chọn B, Tùy chọn C)"
                           />
                       </div>
                  )}

                </div>
              ))}
            </div>
          </div>

          {/* Prompt Builder */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex-1 flex flex-col">
            <label className="text-xs font-bold text-green-400 uppercase mb-2">2. Cấu trúc Prompt</label>
            <p className="text-xs text-slate-500 mb-2">
              Viết prompt mẫu của bạn vào đây. Sử dụng cú pháp <code className="text-sky-400">{`{{input_id}}`}</code> để chèn dữ liệu từ input.
            </p>
            <textarea 
              value={templateString} onChange={e => setTemplateString(e.target.value)}
              className="w-full h-40 p-3 rounded bg-slate-900 border border-slate-700 text-sm font-mono text-slate-300 focus:border-green-500 outline-none resize-none"
              placeholder="Ví dụ: Viết email đòi nợ khách hàng {{input_123}} số tiền {{input_456}}..."
            />
          </div>

        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm bg-sky-600 hover:bg-sky-500 text-white rounded font-bold flex items-center shadow-lg shadow-sky-900/20 transition-all">
            <Save className="w-4 h-4 mr-2" /> 
            {initialData ? 'Cập nhật Template' : 'Lưu Template Mới'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;