import { LucideIcon } from 'lucide-react';

export interface InputConfig {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
}

export interface Template {
  id: string;
  category: string;
  iconName: string; // We will map string names to components
  title: string;
  desc: string;
  tags: string[];
  tactic: string;
  inputs: InputConfig[];
  generate: (data: Record<string, string>) => string;
}

export interface SavedPrompt {
  id: string;
  templateId: string;
  title: string;
  content: string;
  formData: Record<string, string>;
  createdAt: number;
}

export type Category = string;