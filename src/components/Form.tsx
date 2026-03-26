import React, { useState } from 'react';
import { useCV } from '../CVContext';
import { TRANSLATIONS } from '../constants';
import { TemplateSelector } from './TemplateSelector';
import { ConfirmationModal } from './ConfirmationModal';
import PersonalInfoSection from './form-sections/PersonalInfoSection';
import EducationSection from './form-sections/EducationSection';
import WorkSection from './form-sections/WorkSection';
import SkillsSection from './form-sections/SkillsSection';
import LanguagesSection from './form-sections/LanguagesSection';
import OtherSection from './form-sections/OtherSection';

export const Form: React.FC = () => {
  const { data } = useCV();
  const t = TRANSLATIONS[data.meta.language];
  const isRtl = data.meta.language === 'ar' || data.meta.language === 'he';

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    onConfirm: () => void;
  }>({ isOpen: false, onConfirm: () => {} });

  const askConfirm = (onConfirm: () => void) => {
    setConfirmDelete({ isOpen: true, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmDelete({ isOpen: false, onConfirm: () => {} });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      <TemplateSelector />
      <PersonalInfoSection />
      <EducationSection onConfirmRemove={askConfirm} />
      <WorkSection onConfirmRemove={askConfirm} />
      <SkillsSection onConfirmRemove={askConfirm} />
      <LanguagesSection onConfirmRemove={askConfirm} />
      <OtherSection onConfirmRemove={askConfirm} />

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        title={t.confirmDeleteTitle}
        message={t.confirmDeleteMessage}
        confirmLabel={t.confirmDeleteAction}
        cancelLabel={t.cancelAction}
        onConfirm={() => { confirmDelete.onConfirm(); closeConfirm(); }}
        onCancel={closeConfirm}
        isRtl={isRtl}
      />
    </div>
  );
};
