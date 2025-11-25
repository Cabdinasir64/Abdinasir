"use client";
import { useEffect } from 'react';
import { useLanguageStore } from '@/stores/languageStore';
import i18n from '@/i18n';

export default function LanguageProvider() {

  useEffect(() => {
    const storedLang = localStorage.getItem('lang');
    let langToUse = 'en';

    if (storedLang) {
      try {
        const parsed = JSON.parse(storedLang);
        langToUse = parsed.state.currentLang;
      } catch (e) {
      }
    }

    if (langToUse !== i18n.language) {
      i18n.changeLanguage(langToUse);
    }

    document.documentElement.dir = langToUse === 'ar' ? 'rtl' : 'ltr';

    useLanguageStore.setState({ currentLang: langToUse });

  }, []);

  return null;
}