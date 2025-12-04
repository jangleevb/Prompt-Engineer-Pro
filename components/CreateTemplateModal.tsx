import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Save, GripVertical } from 'lucide-react';
import { InputConfig, CustomTemplateData } from '../types';

interface CreateTemplateModalProps {
  onClose: () => void;
  onSave: (template: CustomTemplateData) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Custom');
  const [inputs, setInputs] = useState<InputConfig[]>([]);
  const [templateString, setTemplateString] = useState('');
  
  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Helper for input creation
  const addInput = () => {
    const id = `input_${Date.now()}`;
    setInputs([...inputs, { id, label: '', placeholder: '', type: 'text' }]);
  };

  const updateInput = (index: number, field: keyof InputConfig, value: string) => {
    const newInputs = [...inputs];
    // specific cast because type can only be 'text' | 'textarea' | 'image'
    if (field === 'type') {
       (newInputs[index] as any)[field] = value;
    } else {
       (newInputs[index] as any)[field] = value;
    }
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
      id: `custom_${Date.now()}`,
      title,
      desc,
      category,
      tags: ['Custom'],
      inputs,
      templateString
    };
    
    onSave(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-lg font-bold text-white">Tạo Template Mới</h2>
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
              <label className="block text-xs font-bold text-slate-400 mb-1">Danh mục</label>
              <input 
                value={category} onChange={e => setCategory(e.target.value)}
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm text-white focus:border-sky-500 outline-none"
                placeholder="Custom, Personal..."
              />
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
                  className={`flex gap-2 items-start bg-slate-900 p-2 rounded border border-slate-800 transition-all ${
                    draggedIndex === idx ? 'opacity-40 border-dashed border-sky-500 bg-slate-800' : 'hover:border-slate-600'
                  }`}
                >
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
                          <option value="image">Image Upload</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-1 rounded border border-slate-700 select-all">ID: {input.id}</span>
                        {input.type !== 'image' && (
                          <span className="text-[10px] text-slate-500">Dùng <code className="text-sky-400 select-all">{`{{${input.id}}}`}</code> trong prompt</span>
                        )}
                        {input.type === 'image' && (
                          <span className="text-[10px] text-orange-400 italic">Image input: Không dùng trong text prompt, sẽ tự động đính kèm.</span>
                        )}
                    </div>
                  </div>
                  <button onClick={() => removeInput(idx)} className="text-slate-500 hover:text-red-400 p-1 mt-1" title="Xóa input này">
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            <Save className="w-4 h-4 mr-2" /> Lưu Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;