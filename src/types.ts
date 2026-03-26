export type Language = 'sr-Cyrl' | 'sr-Latn' | 'en' | 'sv' | 'de' | 'es' | 'ar' | 'he' | 'tr' | 'fr' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 'nl' | 'pl';

export interface EducationEntry {
  id: string;
  from: string;
  to: string;
  toPresent: boolean;
  institution: string;
  field: string;
}

export interface WorkExperienceEntry {
  id: string;
  from: string;
  to: string;
  toPresent: boolean;
  employer: string;
  city: string;
  country: string;
  jobTitle: string;
  description: string;
}

export interface SkillEntry {
  id: string;
  value: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  level: string;
}

export interface OtherEntry {
  id: string;
  label: string;
  value: string;
}

export type CVTemplate = 'modern' | 'classic' | 'minimalist';

export interface CVData {
  meta: {
    language: Language;
    template: CVTemplate;
    lastModified: string;
    version: number;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    website: string;
  };
  education: EducationEntry[];
  workExperience: WorkExperienceEntry[];
  skills: {
    it: SkillEntry[];
    additional: SkillEntry[];
  };
  languages: LanguageEntry[];
  other: OtherEntry[];
}
