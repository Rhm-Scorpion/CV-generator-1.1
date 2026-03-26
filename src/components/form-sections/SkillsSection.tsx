import React from 'react';
import { useCV } from '../../CVContext';
import { TRANSLATIONS, SKILLS_SUGGESTIONS } from '../../constants';
import { generateId } from '../../lib/utils';
import { AutocompleteInput } from '../AutocompleteInput';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  onConfirmRemove: (onConfirm: () => void) => void;
}

export default function SkillsSection({ onConfirmRemove }: Props) {
  const { data, updateData, errors, validateField } = useCV();
  const t = TRANSLATIONS[data.meta.language];

  const addSkill = (type: 'it' | 'additional') => {
    updateData({ skills: { ...data.skills, [type]: [...data.skills[type], { id: generateId(), value: '' }] } });
  };

  const removeSkill = (type: 'it' | 'additional', id: string) => {
    onConfirmRemove(() => {
      updateData({ skills: { ...data.skills, [type]: data.skills[type].filter(s => s.id !== id) } });
    });
  };

  const updateSkill = (type: 'it' | 'additional', index: number, val: string) => {
    const updated = { ...data.skills };
    updated[type][index].value = val;
    updateData({ skills: updated });
  };

  const renderSkillList = (type: 'it' | 'additional', label: string, suggestions: string[], placeholder: string) => (
    <div>
      <h3 className="input-label mb-4">{label}</h3>
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {data.skills[type].map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              className="flex items-center gap-2"
            >
              <div className="flex-1">
                <AutocompleteInput
                  value={skill.value}
                  onChange={(val) => {
                    updateSkill(type, i, val);
                    validateField(`skills.${type}.${skill.id}`, val);
                  }}
                  suggestions={suggestions}
                  placeholder={placeholder}
                />
                <AnimatePresence>
                  {errors[`skills.${type}.${skill.id}`] && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="text-[10px] text-red-500 font-medium"
                    >
                      {errors[`skills.${type}.${skill.id}`]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={() => removeSkill(type, skill.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <button onClick={() => addSkill(type)} className="btn-add py-2 mt-2">
          <Plus className="w-3 h-3" /> {t.addSkill}
        </button>
      </div>
    </div>
  );

  return (
    <section className="card">
      <div className="section-title">
        <span className="section-number">4</span>
        {t.skills}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderSkillList('it', t.itSkills, SKILLS_SUGGESTIONS.it, 'npr. MS Office')}
        {renderSkillList('additional', t.additionalSkills, SKILLS_SUGGESTIONS.additional, 'npr. Timski rad')}
      </div>
    </section>
  );
}
