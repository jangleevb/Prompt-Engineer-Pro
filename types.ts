import { LucideIcon } from 'lucide-react';

export type TemplateSource = 'system' | 'local' | 'online';

export interface InputConfig {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'image' | 'file';
}

export interface Template {
  id: string;
  category: string;
  iconName: string; 
  title: string;
  desc: string;
  tags: string[];
  tactic: string;
  inputs: InputConfig[];
  generate: (data: Record<string, string>) => string;
  isCustom?: boolean; 
  templateString?: string; // For custom/online templates storage
  source: TemplateSource; // New property to distinguish origin
}

export interface SavedPrompt {
  id: string;
  templateId: string;
  title: string;
  content: string;
  formData: Record<string, string>;
  createdAt: number;
}

export interface CustomTemplateData {
  id: string;
  title: string;
  desc: string;
  inputs: InputConfig[];
  templateString: string;
  category: string;
  tags: string[];
  type?: string;
}

export type Category = string;