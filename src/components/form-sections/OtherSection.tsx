import React from 'react';
import { useCV } from '../../CVContext';
import { TRANSLATIONS } from '../../constants';
import { generateId } from '../../lib/utils';
import InputField from '../InputField';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  onConfirmRemove: (onConfirm: () => void) => void;
}

// Fiksna polja koja uvek postoje — vozačka i dostupnost
const FIXED_FIELDS = ['driversLicense', 'availability'] as const;

export default function OtherSection({ onConfirmRemove }: Props) {
  const { data, updateData } = useCV();
  const t = TRANSLATIONS[data.meta.language];

  const getFixed = (label: string) => data.other.find(o => o.label === label);

  const updateFixed = (label: string, value: string) => {
    const updated = [...data.other];
    const idx = updated.findIndex(o => o.label === label);
    if (idx > -1) {
      updated[idx] = { ...updated[idx], value };
    } else {
      updated.push({ id: generateId(), label, value });
    }
    updateData({ other: updated });
  };

  const removeFixed = (label: string) => {
    const entry = getFixed(label);
    if (entry) {
      onConfirmRemove(() => {
        updateData({ other: data.other.filter(o => o.id !== entry.id) });
      });
    }
  };

  const customEntries = data.other.filter(o => !FIXED_FIELDS.includes(o.label as any));

  const updateCustom = (id: string, patch: { label?: string; value?: string }) => {
    updateData({ other: data.other.map(o => o.id === id ? { ...o, ...patch } : o) });
  };

  const addCustom = () => {
    updateData({ other: [...data.other, { id: generateId(), label: '', value: '' }] });
  };

  const removeCustom = (id: string) => {
    onConfirmRemove(() => {
      updateData({ other: data.other.filter(o => o.id !== id) });
    });
  };

  const FixedField = ({ label, placeholder }: { label: typeof FIXED_FIELDS[number]; placeholder: string }) => {
    const entry = getFixed(label);
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 items-end gap-3 p-3 bg-accent/5 rounded-md border border-accent/10">
        <div className="md:col-span-4">
          <label className="input-label">{t[label as keyof typeof t] || label}</label>
          <div className="cv-input bg-gray-50/50 text-gray-500 flex items-center h-[42px] border-dashed border border-gray-200">
            {t[label as keyof typeof t] || label}
          </div>
        </div>
        <div className="md:col-span-7">
          <InputField
            label={t.other}
            path={`other.${label}.value`}
            value={entry?.value || ''}
            onChange={(val) => updateFixed(label, val)}
            placeholder={placeholder}
          />
        </div>
        <div className="md:col-span-1 flex justify-end">
          {entry && (
            <button type="button" onClick={() => removeFixed(label)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="card">
      <div className="section-title">
        <span className="section-number">6</span>
        {t.other}
      </div>
      <div className="flex flex-col gap-4">
        <FixedField label="driversLicense" placeholder="npr. B kategorija" />
        <FixedField label="availability" placeholder="npr. Odmah dostupan" />

        <AnimatePresence initial={false}>
          {customEntries.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-12 items-end gap-3 relative"
            >
              <div className="md:col-span-4">
                <InputField
                  label={t.addOther} path={`other.${item.id}.label`}
                  value={item.label}
                  onChange={(val) => updateCustom(item.id, { label: val })}
                  placeholder="npr. Hobiji"
                />
              </div>
              <div className="md:col-span-7">
                <InputField
                  label={t.other} path={`other.${item.id}.value`}
                  value={item.value}
                  onChange={(val) => updateCustom(item.id, { value: val })}
                />
              </div>
              <div className="md:col-span-1 flex justify-end">
                <button type="button" onClick={() => removeCustom(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button type="button" onClick={addCustom} className="btn-add py-2">
          <Plus className="w-4 h-4" /> {t.addOther}
        </button>
      </div>
    </section>
  );
}
