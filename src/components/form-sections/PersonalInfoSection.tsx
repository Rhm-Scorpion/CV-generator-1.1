import React from 'react';
import { useCV } from '../../CVContext';
import { TRANSLATIONS } from '../../constants';
import InputField from '../InputField';

export default function PersonalInfoSection() {
  const { data, updatePersonalInfo } = useCV();
  const t = TRANSLATIONS[data.meta.language];
  const pi = data.personalInfo;
  const isSr = data.meta.language === 'sr-Cyrl' || data.meta.language === 'sr-Latn';

  const field = (key: keyof typeof pi, label: string, opts?: {
    type?: string;
    placeholder?: string;
  }) => (
    <InputField
      label={label}
      path={`personalInfo.${key}`}
      value={pi[key]}
      onChange={(val) => updatePersonalInfo({ [key]: val })}
      type={opts?.type}
      placeholder={opts?.placeholder}
    />
  );

  return (
    <section className="card">
      <div className="section-title">
        <span className="section-number">1</span>
        {t.personalInfo}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field('firstName', t.firstName, { placeholder: '' })}
        {field('lastName', t.lastName, { placeholder: '' })}
        {field('dateOfBirth', t.dateOfBirth, {
          type: 'text',
          placeholder: isSr ? 'npr. 31.12.1998' : 'e.g. 1998-12-31',
        })}
        {field('address', t.address, { placeholder: '' })}
        {field('phone', t.phone, { type: 'tel', placeholder: '+1 24 123 4567' })}
        {field('email', t.email, { type: 'email', placeholder: '' })}
        {field('linkedin', t.linkedin, { placeholder: 'linkedin.com/in/username' })}
        {field('github', t.github, { placeholder: 'github.com/username' })}
        {field('website', t.website, { placeholder: 'example.com' })}
      </div>
    </section>
  );
}
