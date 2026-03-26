import React from 'react';
import { useCV } from '../../CVContext';
import { TRANSLATIONS, SKILLS_SUGGESTIONS } from '../../constants';
import { generateId } from '../../lib/utils';
import InputField from '../InputField';
import SortableItem from '../SortableItem';
import { AutocompleteInput } from '../AutocompleteInput';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor,
  KeyboardSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';

interface Props {
  onConfirmRemove: (onConfirm: () => void) => void;
}

export default function WorkSection({ onConfirmRemove }: Props) {
  const { data, updateData, errors, validateField, clearFieldError } = useCV();
  const t = TRANSLATIONS[data.meta.language];
  const isSr = data.meta.language === 'sr-Cyrl' || data.meta.language === 'sr-Latn';

  const normalizeMonthYearInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = data.workExperience.findIndex(i => i.id === active.id);
    const to = data.workExperience.findIndex(i => i.id === over.id);
    updateData({ workExperience: arrayMove(data.workExperience, from, to) });
  };

  const updateEntry = (index: number, patch: Partial<typeof data.workExperience[0]>) => {
    const updated = [...data.workExperience];
    updated[index] = { ...updated[index], ...patch };
    updateData({ workExperience: updated });
  };

  const addEntry = () => {
    updateData({
      workExperience: [...data.workExperience, {
        id: generateId(), from: '', to: '', toPresent: false,
        employer: '', city: '', country: '', jobTitle: '', description: '',
      }],
    });
  };

  const removeEntry = (id: string) => {
    onConfirmRemove(() => {
      updateData({ workExperience: data.workExperience.filter(w => w.id !== id) });
    });
  };

  return (
    <section className="card">
      <div className="section-title">
        <span className="section-number">3</span>
        {t.workExperience}
      </div>
      <div className="flex flex-col gap-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={data.workExperience} strategy={verticalListSortingStrategy}>
            <AnimatePresence initial={false}>
              {data.workExperience.map((work, i) => (
                <SortableItem key={work.id} id={work.id} onRemove={() => removeEntry(work.id)}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <InputField
                      label={t.from} path={`workExperience.${work.id}.from`}
                      value={work.from}
                      placeholder={isSr ? 'npr. 03/2024' : 'e.g. 03/2024'}
                      onChange={(val) => updateEntry(i, { from: normalizeMonthYearInput(val) })}
                    />
                    <div>
                      <InputField
                        label={t.to} path={`workExperience.${work.id}.to`}
                        value={work.to}
                        placeholder={isSr ? 'npr. 11/2025' : 'e.g. 11/2025'}
                        disabled={work.toPresent}
                        onChange={(val) => updateEntry(i, { to: normalizeMonthYearInput(val) })}
                      />
                      <div className="mt-1 flex items-center gap-1">
                        <input
                          type="checkbox" id={`work-present-${work.id}`}
                          checked={work.toPresent}
                          onChange={(e) => {
                            updateEntry(i, { toPresent: e.target.checked, to: e.target.checked ? '' : work.to });
                            if (e.target.checked) {
                              clearFieldError(`workExperience.${work.id}.to`);
                            } else {
                              validateField(`workExperience.${work.id}.to`, work.to);
                            }
                          }}
                          className="w-3 h-3 accent-accent"
                        />
                        <label htmlFor={`work-present-${work.id}`} className="text-[10px] text-gray-500 uppercase font-medium">
                          {t.currently || t.present}
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        label={t.employer} path={`workExperience.${work.id}.employer`}
                        value={work.employer}
                        onChange={(val) => updateEntry(i, { employer: val })}
                      />
                    </div>
                    <InputField
                      label={t.city} path={`workExperience.${work.id}.city`}
                      value={work.city}
                      onChange={(val) => updateEntry(i, { city: val })}
                    />
                    <InputField
                      label={t.country} path={`workExperience.${work.id}.country`}
                      value={work.country}
                      onChange={(val) => updateEntry(i, { country: val })}
                    />
                    <div className="md:col-span-2">
                      <label className="input-label">{t.jobTitle}</label>
                      <AutocompleteInput
                        value={work.jobTitle}
                        onChange={(val) => {
                          updateEntry(i, { jobTitle: val });
                          validateField(`workExperience.${work.id}.jobTitle`, val);
                        }}
                        suggestions={SKILLS_SUGGESTIONS.jobTitles}
                        placeholder="npr. Software Engineer"
                      />
                      <AnimatePresence>
                        {errors[`workExperience.${work.id}.jobTitle`] && (
                          <motion.span
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            className="text-[10px] text-red-500 font-medium"
                          >
                            {errors[`workExperience.${work.id}.jobTitle`]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="md:col-span-4">
                      <InputField
                        label={t.jobDescription} path={`workExperience.${work.id}.description`}
                        value={work.description} textarea
                        onChange={(val) => updateEntry(i, { description: val })}
                      />
                    </div>
                  </div>
                </SortableItem>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
        <button onClick={addEntry} className="btn-add">
          <Plus className="w-4 h-4" /> {t.addWork}
        </button>
      </div>
    </section>
  );
}
