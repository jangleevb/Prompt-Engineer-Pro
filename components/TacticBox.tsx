import React from 'react';
import { Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Optional, but since we have bold text in tactics, simple rendering or markdown is good. 
// Actually, to avoid extra deps if not needed, we can just use simple string rendering or dangerouslySetInnerHTML if trusted. 
// Given the prompt constraints on libs, I will stick to a simple parser or dangerouslySetInnerHTML as the content is static constant.

interface TacticBoxProps {
  tactic?: string;
}

const TacticBox: React.FC<TacticBoxProps> = ({ tactic }) => {
  if (!tactic) return null;

  // Simple formatter for **text** to <strong>text</strong>
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-indigo-300">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-lg mt-6">
      <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center">
        <Lightbulb className="w-4 h-4 mr-2" />
        Giải Mã Chiến Thuật
      </h3>
      <p className="text-slate-300 text-sm leading-relaxed">
        {formatText(tactic)}
      </p>
    </div>
  );
};

export default TacticBox;