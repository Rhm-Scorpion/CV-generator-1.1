import { CVData, Language } from "./types";
import { generateId } from "./lib/utils";

export const INITIAL_DATA: CVData = {
  meta: {
    language: 'en',
    template: 'modern',
    lastModified: new Date().toISOString(),
    version: 1,
  },
  personalInfo: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    website: '',
  },
  education: [
    { id: generateId(), from: '', to: '', toPresent: false, institution: '', field: '' }
  ],
  workExperience: [
    { id: generateId(), from: '', to: '', toPresent: false, employer: '', city: '', country: '', jobTitle: '', description: '' }
  ],
  skills: {
    it: [{ id: generateId(), value: '' }],
    additional: [{ id: generateId(), value: '' }]
  },
  languages: [
    { id: generateId(), language: '', level: 'A1' }
  ],
  other: [
    { id: 'license', label: 'driversLicense', value: '' },
    { id: 'relocation', label: 'relocation', value: '' },
    { id: 'availability', label: 'availability', value: '' }
  ]
};

export function detectInitialLanguage(): Language {
  const saved = localStorage.getItem('cv_language') as Language;
  if (saved) return saved;

  const browserLocales = navigator.languages || [navigator.language];

  for (const locale of browserLocales) {
    const tag = locale.toLowerCase();
    if (tag.startsWith('sr-cyrl')) return 'sr-Cyrl';
    if (tag.startsWith('sr-latn')) return 'sr-Latn';
    if (tag.startsWith('sr') || tag.startsWith('bs') || tag.startsWith('cnr') || tag.startsWith('hr')) return 'sr-Latn';
    if (tag.startsWith('fr')) return 'fr';
    if (tag.startsWith('tr')) return 'tr';
    if (tag.startsWith('he')) return 'he';
    if (tag.startsWith('ar')) return 'ar';
    if (tag.startsWith('de')) return 'de';
    if (tag.startsWith('es')) return 'es';
    if (tag.startsWith('sv')) return 'sv';
    if (tag.startsWith('en')) return 'en';
  }

  return 'en';
}
