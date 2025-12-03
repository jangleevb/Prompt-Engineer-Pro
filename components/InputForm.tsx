import React from 'react';
import { Template } from '../types';
import { ArrowLeft } from 'lucide-react';

interface InputFormProps {
  template: Template | null;
  formData: Record<string, string>;
  onChange: (id: string, value: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ template, formData, onChange }) => {
  if (!template) {
    return (
      <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg flex items-center justify-center h-48">
        <div className="text-center text-slate-500 italic flex items-center">
          <ArrowLeft className="mr-2 w-4 h-4" /> Chọn mẫu để hiển thị form nhập liệu
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
      {template.inputs.map(input => (
        <div key={input.id}>
          <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">
            {input.label}
          </label>
          {input.type === 'textarea' ? (
            <textarea
              rows={4}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm font-mono focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder-slate-600"
              placeholder={input.placeholder}
              value={formData[input.id] || ''}
              onChange={(e) => onChange(input.id, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder-slate-600"
              placeholder={input.placeholder}
              value={formData[input.id] || ''}
              onChange={(e) => onChange(input.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default InputForm;