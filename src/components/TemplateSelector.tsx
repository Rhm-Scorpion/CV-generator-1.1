import React from 'react';
import { useCV } from '../CVContext';
import { CVTemplate } from '../types';
import { TRANSLATIONS } from '../constants';
import { cn } from '../lib/utils';
import { Layout, Columns, AlignLeft } from 'lucide-react';

export const TemplateSelector: React.FC = () => {
  const { data, setTemplate } = useCV();
  const t = TRANSLATIONS[data.meta.language];
  const currentTemplate = data.meta.template;

  const templates: { id: CVTemplate; label: string; icon: React.ReactNode }[] = [
    { id: 'modern', label: t.modern, icon: <Layout className="w-4 h-4" /> },
    { id: 'classic', label: t.classic, icon: <Columns className="w-4 h-4" /> },
    { id: 'minimalist', label: t.minimalist, icon: <AlignLeft className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {t.selectTemplate}
      </label>
      <div className="flex gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => setTemplate(template.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border",
              currentTemplate === template.id
                ? "bg-accent text-white border-accent shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-accent/50 hover:bg-accent/5"
            )}
          >
            {template.icon}
            {template.label}
          </button>
        ))}
      </div>
    </div>
  );
};
