import React, { createContext, useState, useContext, useCallback } from 'react';
import { en } from '../translations/en';
import { ms } from '../translations/ms';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  const translations = {
    en,
    ms
  };

  const t = useCallback((key, params = {}) => {
    // Split the key by dot to handle nested objects
    const keys = key.split('.');
    let translated = translations[language];

    // Traverse the nested object
    for (const k of keys) {
      if (translated && typeof translated === 'object' && k in translated) {
        translated = translated[k];
      } else {
        // If key is not found, return the original key or a default
        translated = key;
        break;
      }
    }

    // If the final value is not a string, return the original key
    if (typeof translated !== 'string') {
      return key;
    }

    for (const [paramKey, paramValue] of Object.entries(params)) {
      translated = translated.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
    }
    return translated;
  }, [language, translations]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 