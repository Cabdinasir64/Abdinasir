import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n'; 

interface LanguageState {
  currentLang: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLang: 'en',
      setLanguage: (lang: string) => {
        set({ currentLang: lang });
        i18n.changeLanguage(lang);

        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      },
    }),
    {
      name: 'lang',

      onRehydrateStorage: () => (state) => {
        if (state && state.currentLang) {
          i18n.changeLanguage(state.currentLang);

          if (state.currentLang === 'ar') {
            document.documentElement.dir = 'rtl';
          } else {
            document.documentElement.dir = 'ltr';
          }
        }
      },
    }
  )
);