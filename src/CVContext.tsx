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
}

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
          return { ...INITIAL_DATA, ...parsed.data, meta: { ...INITIAL_DATA.meta, ...parsed.data?.meta } };
        }
      } catch (e) {
        console.error("Failed to parse saved CV data", e);
      }
    }
    const initialLang = detectInitialLanguage();
    return { ...INITIAL_DATA, meta: { ...INITIAL_DATA.meta, language: initialLang } };
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

    if (
      path === 'personalInfo.firstName' || 
      path === 'personalInfo.lastName' || 
      path === 'personalInfo.dateOfBirth' || 
      path === 'personalInfo.address'
    ) {
      if (!value || value.trim() === '') {
        error = isSr ? 'Ово поље је обавезно' : 'This field is required';
      }
    }

    if (path === 'personalInfo.email') {
      if (!value || value.trim() === '') {
        error = isSr ? 'Имејл је обавезан' : 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = isSr ? 'Неисправан формат имејла' : 'Invalid email format';
      }
    }

    if (path === 'personalInfo.phone') {
      if (value && !/^\+?[\d\s-]{7,20}$/.test(value)) {
        error = isSr ? 'Неисправан формат телефона' : 'Invalid phone format';
      }
    }

    if (path.startsWith('education.') || path.startsWith('workExperience.')) {
      if (!value || value.trim() === '') {
        error = isSr ? 'Ово поље је обавезно' : 'This field is required';
      }
    }

    if (path.startsWith('skills.') || path.startsWith('languages.') || path.startsWith('other.')) {
      if (!value || value.trim() === '') {
        error = isSr ? 'Ово поље је обавезно' : 'This field is required';
      }
    }

    setErrors(prev => {
      if (error) {
        return { ...prev, [path]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      }
    });
  }, [data.meta.language]);

  const updateData = (newData: Partial<CVData>) => {
    setData(prev => ({ ...prev, ...newData, meta: { ...prev.meta, lastModified: new Date().toISOString() } }));
    setIsDirty(true);
    setSaveStatus('pending');
  };

  const updatePersonalInfo = (info: Partial<CVData['personalInfo']>) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
      meta: { ...prev.meta, lastModified: new Date().toISOString() }
    }));
    setIsDirty(true);
    setSaveStatus('pending');
  };

  const setLanguage = (lang: Language) => {
    setData(prev => ({ ...prev, meta: { ...prev.meta, language: lang } }));
    localStorage.setItem('cv_language', lang);
    setIsDirty(true);
    setSaveStatus('pending');
  };

  const setTemplate = (template: CVTemplate) => {
    setData(prev => ({ ...prev, meta: { ...prev.meta, template } }));
    setIsDirty(true);
    setSaveStatus('pending');
  };

  useEffect(() => {
  
  }, []);

  const toggleLivePreview = (val: boolean) => {
    setIsLivePreview(val);
    localStorage.setItem('cv_live_preview', String(val));
  };

  return (
    <CVContext.Provider value={{ 
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
      validateField
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) throw new Error('useCV must be used within a CVProvider');
  return context;
};
