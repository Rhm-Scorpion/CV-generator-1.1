import React from 'react';
import { useCV } from '../CVContext';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Globe, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

export const Header: React.FC = () => {
  const { data, setLanguage, saveStatus, isLivePreview, setIsLivePreview } = useCV();
  const lang = data.meta.language;
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-50 bg-app-bg/80 backdrop-blur-md border-b border-border-card py-3 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4">
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-accent truncate max-w-[120px] sm:max-w-none">{t.title}</h1>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/50 rounded-full border border-border-card text-[10px] sm:text-xs font-medium">
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span className="text-green-700 hidden xs:inline">{t.saved}</span>
            </>
          )}
          {saveStatus === 'pending' && (
            <>
              <Loader2 className="w-3 h-3 text-amber-600 animate-spin" />
              <span className="text-amber-700 hidden xs:inline">{t.saving}</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="w-3 h-3 text-red-600" />
              <span className="text-red-700 hidden xs:inline">{t.notSaved}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => setIsLivePreview(!isLivePreview)}
          className={cn(
            "hidden md:flex items-center gap-2 px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-bold transition-all",
            isLivePreview 
              ? "bg-accent text-white shadow-md" 
              : "bg-white border border-border-card text-gray-600 hover:bg-gray-50"
          )}
        >
          {isLivePreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="hidden md:inline">{t.livePreview}</span>
        </button>

        <div className="h-6 w-px bg-border-card hidden xs:block" />

        <div className="flex items-center gap-1 sm:gap-2">
          <Globe className="w-3.5 h-3.5 text-accent-gold" />
          <select
            value={lang}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-xs sm:text-sm font-semibold outline-none cursor-pointer hover:text-accent transition-colors max-w-[80px] sm:max-w-none"
          >
          <option value="sr-Cyrl">Srpski (Ćir)</option>
          <option value="sr-Latn">Srpski (Lat)</option>
          <option value="en">English</option>
          <option value="sv">Svenska</option>
          <option value="de">Deutsch</option>
          <option value="es">Español</option>
          <option value="ar">العربية</option>
          <option value="he">עברית</option>
          <option value="tr">Türkçe</option>
          <option value="fr">Français</option>
          <option value="it">Italiano</option>
          <option value="pt">Português</option>
          <option value="ru">Русский</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="nl">Nederlands</option>
          <option value="pl">Polski</option>
        </select>
      </div>
    </div>
  </header>
);
};
