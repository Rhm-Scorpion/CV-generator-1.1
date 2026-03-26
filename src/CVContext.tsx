import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CVData, Language, CVTemplate } from './types';
import { INITIAL_DATA, detectInitialLanguage } from './initialData';
import { storage } from './lib/storage';

interface CVContextType {
  data: CVData;
  errors: Record<string, string>;
  updateData: (newData: Partial<CVData>) => void;
  updatePersonalInfo: (info: Partial<CVData['personalInfo']>) => void;
  setLanguage: (lang: Language) => void;
  setTemplate: (template: CVTemplate) => void;
  isDirty: boolean;
  saveStatus: 'saved' | 'pending' | 'error';
  isLivePreview: boolean;
  setIsLivePreview: (val: boolean) => void;
  validateField: (path: string, value: any) => void;
  clearFieldError: (path: string) => void;
}

const LEGACY_ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const normalizeEducationYear = (value: string) => {
  if (!value) return '';
  if (LEGACY_ISO_DATE.test(value)) return value.slice(0, 4);
  return value.trim();
};

const normalizeWorkMonthYear = (value: string) => {
  if (!value) return '';

  if (LEGACY_ISO_DATE.test(value)) {
    const [year, month] = value.split('-');
    return `${month}/${year}`;
  }

  const compact = value.replace(/\s+/g, '');
  const match = compact.match(/^(\d{1,2})\/(\d{4})$/);
  if (match) {
    const month = match[1].padStart(2, '0');
    return `${month}/${match[2]}`;
  }

  return value.trim();
};

const normalizeStoredCvDates = (cvData: CVData): CVData => ({
  ...cvData,
  education: cvData.education.map((entry) => ({
    ...entry,
    from: normalizeEducationYear(entry.from),
    to: normalizeEducationYear(entry.to),
  })),
  workExperience: cvData.workExperience.map((entry) => ({
    ...entry,
    from: normalizeWorkMonthYear(entry.from),
    to: normalizeWorkMonthYear(entry.to),
  })),
});

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLivePreview, setIsLivePreview] = useState(() => {
    return localStorage.getItem('cv_live_preview') === 'true';
  });

  const [data, setData] = useState<CVData>(() => {
    const saved = storage.get('cv_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Basic migration check
        if (parsed.version === 1 || !parsed.version) {
          return normalizeStoredCvDates({
            ...INITIAL_DATA,
            ...parsed.data,
            meta: { ...INITIAL_DATA.meta, ...parsed.data?.meta },
          });
        }
      } catch (e) {
        console.error('Failed to parse saved CV data', e);
      }
    }

    const initialLang = detectInitialLanguage();
    return normalizeStoredCvDates({ ...INITIAL_DATA, meta: { ...INITIAL_DATA.meta, language: initialLang } });
  });

  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<'saved' | 'pending' | 'error'>(
    storage._available ? 'saved' : 'error'
  );

  const saveToStorage = useCallback((currentData: CVData) => {
    if (storage._available) {
      storage.set('cv_data', JSON.stringify({ version: 1, data: currentData }));
      setIsDirty(false);
      setSaveStatus('saved');
    } else {
      setSaveStatus('error');
    }
  }, []);

  useEffect(() => {
    if (isDirty) {
      const timeout = setTimeout(() => {
        saveToStorage(data);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [data, isDirty, saveToStorage]);

  const validateField = useCallback((path: string, value: any) => {
    let error = '';
    const lang = data.meta.language;
    const isSr = lang === 'sr-Cyrl' || lang === 'sr-Latn';
    const stringValue = typeof value === 'string' ? value.trim() : '';

    const shouldRequireValue = () => {
      const educationToMatch = path.match(/^education\.([^.]+)\.to$/);
      if (educationToMatch) {
        const entry = data.education.find((item) => item.id === educationToMatch[1]);
        return !entry?.toPresent;
      }

      const workToMatch = path.match(/^workExperience\.([^.]+)\.to$/);
      if (workToMatch) {
        const entry = data.workExperience.find((item) => item.id === workToMatch[1]);
        return !entry?.toPresent;
      }

      return true;
    };

    if (
      path === 'personalInfo.firstName' ||
      path === 'personalInfo.lastName' ||
      path === 'personalInfo.dateOfBirth' ||
      path === 'personalInfo.address'
    ) {
      if (!stringValue) {
        error = isSr ? 'Ovo polje je obavezno' : 'This field is required';
      }
    }

    if (path === 'personalInfo.email') {
      if (!stringValue) {
        error = isSr ? 'Email je obavezan' : 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
        error = isSr ? 'Neispravan format emaila' : 'Invalid email format';
      }
    }

    if (path === 'personalInfo.phone') {
      if (stringValue && !/^\+?[\d\s-]{7,20}$/.test(stringValue)) {
        error = isSr ? 'Neispravan format telefona' : 'Invalid phone format';
      }
    }

    if (path.startsWith('education.') || path.startsWith('workExperience.')) {
      if (shouldRequireValue() && !stringValue) {
        error = isSr ? 'Ovo polje je obavezno' : 'This field is required';
      }
    }

    if (!error && /^education\.[^.]+\.(from|to)$/.test(path) && stringValue) {
      if (!/^\d{4}$/.test(stringValue) && !LEGACY_ISO_DATE.test(stringValue)) {
        error = isSr
          ? 'Unesite godinu u formatu GGGG (npr. 2022)'
          : 'Enter year in YYYY format (e.g. 2022)';
      }
    }

    if (!error && /^workExperience\.[^.]+\.(from|to)$/.test(path) && stringValue) {
      if (!/^(0?[1-9]|1[0-2])\/\d{4}$/.test(stringValue) && !LEGACY_ISO_DATE.test(stringValue)) {
        error = isSr
          ? 'Unesite mesec i godinu u formatu MM/GGGG (npr. 03/2024)'
          : 'Enter month and year in MM/YYYY format (e.g. 03/2024)';
      }
    }

    if (path.startsWith('skills.') || path.startsWith('languages.') || path.startsWith('other.')) {
      if (!stringValue) {
        error = isSr ? 'Ovo polje je obavezno' : 'This field is required';
      }
    }

    setErrors((prev) => {
      if (error) {
        return { ...prev, [path]: error };
      }

      const newErrors = { ...prev };
      delete newErrors[path];
      return newErrors;
    });
  }, [data.education, data.meta.language, data.workExperience]);

  const clearFieldError = (path: string) => {
    setErrors((prev) => {
      if (!(path in prev)) return prev;

      const next = { ...prev };
      delete next[path];
      return next;
    });
  };

  const updateData = (newData: Partial<CVData>) => {
    setData((prev) => ({ ...prev, ...newData, meta: { ...prev.meta, lastModified: new Date().toISOString() } }));
    setIsDirty(true);
    setSaveStatus('pending');
  };

  const updatePersonalInfo = (info: Partial<CVData['personalInfo']>) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
      meta: { ...prev.meta, lastModified: new Date().toISOString() },
    }));
    setIsDirty(true);
    setSaveStatus('pending');
  };

  const setLanguage = (lang: Language) => {
    setData((prev) => ({ ...prev, meta: { ...prev.meta, language: lang } }));
    localStorage.setItem('cv_language', lang);
    setIsDirty(true);
    setSaveStatus('pending');
  };

  const setTemplate = (template: CVTemplate) => {
    setData((prev) => ({ ...prev, meta: { ...prev.meta, template } }));
    setIsDirty(true);
    setSaveStatus('pending');
  };

  const toggleLivePreview = (val: boolean) => {
    setIsLivePreview(val);
    localStorage.setItem('cv_live_preview', String(val));
  };

  return (
    <CVContext.Provider
      value={{
        data,
        errors,
        updateData,
        updatePersonalInfo,
        setLanguage,
        setTemplate,
        isDirty,
        saveStatus,
        isLivePreview,
        setIsLivePreview: toggleLivePreview,
        validateField,
        clearFieldError,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) throw new Error('useCV must be used within a CVProvider');
  return context;
};
