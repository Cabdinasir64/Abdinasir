import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  currentLang: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLang: 'en',
      setLanguage: (lang: string) => set({ currentLang: lang }),
    }),
    {
      name: 'lang',
    }
  )
);