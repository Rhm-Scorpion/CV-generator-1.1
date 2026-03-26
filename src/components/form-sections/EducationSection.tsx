import React from 'react';
import { useCV } from '../../CVContext';
import { TRANSLATIONS } from '../../constants';
import { generateId } from '../../lib/utils';
import InputField from '../InputField';
import SortableItem from '../SortableItem';
import { AnimatePresence } from 'motion/react';
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

export default function EducationSection({ onConfirmRemove }: Props) {
  const { data, updateData, validateField } = useCV();
  const t = TRANSLATIONS[data.meta.language];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = data.education.findIndex(i => i.id === active.id);
    const to = data.education.findIndex(i => i.id === over.id);
    updateData({ education: arrayMove(data.education, from, to) });
  };

  const updateEntry = (index: number, patch: Partial<typeof data.education[0]>) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], ...patch };
    updateData({ education: updated });
  };

  const addEntry = () => {
    updateData({
      education: [...data.education, {
        id: generateId(), from: '', to: '', toPresent: false, institution: '', field: '',
      }],
    });
  };

  const removeEntry = (id: string) => {
    onConfirmRemove(() => {
      updateData({ education: data.education.filter(e => e.id !== id) });
    });
  };

  return (
    <section className="card">
      <div className="section-title">
        <span className="section-number">2</span>
        {t.education}
      </div>
      <div className="flex flex-col gap-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={data.education} strategy={verticalListSortingStrategy}>
            <AnimatePresence initial={false}>
              {data.education.map((edu, i) => (
                <SortableItem key={edu.id} id={edu.id} onRemove={() => removeEntry(edu.id)}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <InputField
                      label={t.from} path={`education.${edu.id}.from`}
                      value={edu.from} type="date"
                      onChange={(val) => updateEntry(i, { from: val })}
                    />
                    <div>
                      <InputField
                        label={t.to} path={`education.${edu.id}.to`}
                        value={edu.to} type="date" disabled={edu.toPresent}
                        onChange={(val) => updateEntry(i, { to: val })}
                      />
                      <div className="mt-1 flex items-center gap-1">
                        <input
                          type="checkbox" id={`edu-present-${edu.id}`}
                          checked={edu.toPresent}
                          onChange={(e) => {
                            updateEntry(i, { toPresent: e.target.checked, to: e.target.checked ? '' : edu.to });
                            validateField(`education.${edu.id}.to`, e.target.checked ? '' : edu.to);
                          }}
                          className="w-3 h-3 accent-accent"
                        />
                        <label htmlFor={`edu-present-${edu.id}`} className="text-[10px] text-gray-500 uppercase font-medium">
                          {t.present}
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <InputField
                        label={t.institution} path={`education.${edu.id}.institution`}
                        value={edu.institution}
                        onChange={(val) => updateEntry(i, { institution: val })}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <InputField
                        label={t.field} path={`education.${edu.id}.field`}
                        value={edu.field}
                        onChange={(val) => updateEntry(i, { field: val })}
                      />
                    </div>
                  </div>
                </SortableItem>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
        <button onClick={addEntry} className="btn-add">
          <Plus className="w-4 h-4" /> {t.addEducation}
        </button>
      </div>
    </section>
  );
}
