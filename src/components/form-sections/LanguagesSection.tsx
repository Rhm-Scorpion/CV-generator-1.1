import React from 'react';
import { useCV } from '../../CVContext';
import { TRANSLATIONS, LEVELS, SKILLS_SUGGESTIONS } from '../../constants';
import { generateId } from '../../lib/utils';
import { AutocompleteInput } from '../AutocompleteInput';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  onConfirmRemove: (onConfirm: () => void) => void;
}

export default function LanguagesSection({ onConfirmRemove }: Props) {
  const { data, updateData, errors, validateField } = useCV();
  const t = TRANSLATIONS[data.meta.language];

  const updateEntry = (index: number, patch: Partial<typeof data.languages[0]>) => {
    const updated = [...data.languages];
    updated[index] = { ...updated[index], ...patch };
    updateData({ languages: updated });
  };

  const addEntry = () => {
    updateData({ languages: [...data.languages, { id: generateId(), language: '', level: 'A1' }] });
  };

  const removeEntry = (id: string) => {
    onConfirmRemove(() => {
      updateData({ languages: data.languages.filter(l => l.id !== id) });
    });
  };

  return (
    <section className="card">
      <div className="section-title">
        <span className="section-number">5</span>
        {t.languages}
      </div>
      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {data.languages.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col sm:flex-row sm:items-end gap-3 relative"
            >
              <div className="flex-1">
                <label className="input-label">{t.languageName}</label>
                <AutocompleteInput
                  value={entry.language}
                  onChange={(val) => {
                    updateEntry(i, { language: val });
                    validateField(`languages.${entry.id}.language`, val);
                  }}
                  suggestions={SKILLS_SUGGESTIONS.languages}
                  placeholder="npr. Engleski"
                />
                <AnimatePresence>
                  {errors[`languages.${entry.id}.language`] && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="text-[10px] text-red-500 font-medium"
                    >
                      {errors[`languages.${entry.id}.language`]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-full sm:w-32">
                <label className="input-label">{t.level}</label>
                <select
                  className="cv-input appearance-none"
                  value={entry.level}
                  onChange={(e) => updateEntry(i, { level: e.target.value })}
                >
                  {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="absolute top-0 right-0 sm:static sm:mb-1 p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <button type="button" onClick={addEntry} className="btn-add py-2">
          <Plus className="w-4 h-4" /> {t.addLanguage}
        </button>
      </div>
    </section>
  );
}
