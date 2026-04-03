// ── Hook: useLanguage ──
import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState('en');

  const toggleLang = useCallback(() => {
    setCurrentLang(prev => prev === 'en' ? 'hi' : 'en');
  }, []);

  const t = useCallback((key) => {
    return translations[currentLang]?.[key] ?? translations['en']?.[key] ?? key;
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, toggleLang, t, setCurrentLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
