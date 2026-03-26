import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useCV } from '../CVContext';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  path: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  textarea?: boolean;
  rows?: number;
}

export default function InputField({
  label, value, onChange, path,
  type = 'text', placeholder, disabled, textarea, rows,
}: InputFieldProps) {
  const { errors, validateField } = useCV();
  const error = errors[path];

  const sharedProps = {
    className: cn('cv-input', textarea && 'resize-none', error && 'border border-red-400'),
    value: value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
      validateField(path, e.target.value);
    },
    onBlur: () => validateField(path, value),
    placeholder,
    disabled,
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="input-label">{label}</label>
      {textarea ? (
        <textarea rows={rows || 3} {...sharedProps} />
      ) : (
        <input type={type} {...sharedProps} />
      )}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[10px] text-red-500 font-medium"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
