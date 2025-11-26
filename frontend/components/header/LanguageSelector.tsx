"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/stores/languageStore';
import Image from 'next/image';
import i18n from '@/i18n';

import USFlag from '@/assets/USAFlag.png';
import SomaliaFlag from '@/assets/SomaliaFlag.jpg';
import SaudiArabiaFlag from '@/assets/SaudiArabiaFlag.png';


const FlagImage = React.memo(({ src, alt }: { src: any, alt: string }) => (
    <div className="relative w-5 h-5 min-w-[20px] rounded-full overflow-hidden border border-surface-300 shadow-sm">
        <Image
            src={src}
            alt={alt}
            fill
            sizes="20px"
            className="object-cover"
        />
    </div>
));
FlagImage.displayName = 'FlagImage';

const LanguageSelector = () => {
    const { currentLang, setLanguage } = useLanguageStore();
    const [isOpen, setIsOpen] = useState(false);

    const languages = useMemo(() => [
        {
            code: 'en',
            name: 'English',
            flag: <FlagImage src={USFlag} alt="USA Flag" />
        },
        {
            code: 'so',
            name: 'Soomaali',
            flag: <FlagImage src={SomaliaFlag} alt="Somalia Flag" />
        },
        {
            code: 'ar',
            name: 'العربية',
            flag: <FlagImage src={SaudiArabiaFlag} alt="Saudi Flag" />
        }
    ], []);

    const handleLanguageChange = useCallback(async (langCode: string) => {
        try {
            await i18n.changeLanguage(langCode);
            setLanguage(langCode);
            setIsOpen(false);

            if (langCode === 'ar') {
                document.documentElement.dir = 'rtl';
                document.documentElement.lang = 'ar';
            } else {
                document.documentElement.dir = 'ltr';
                document.documentElement.lang = langCode;
            }
        } catch (error) {
            console.error("Error changing language:", error);
        }
    }, [setLanguage]);

    const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

    const currentFlag = useMemo(() => languages.find(l => l.code === currentLang)?.flag, [languages, currentLang]);

    return (
        <div className="relative z-50">
            <motion.button
                className="flex items-center gap-2 bg-surface-100 hover:bg-surface-200 text-surface-700 border border-surface-200 rounded-full pl-2 pr-3 py-1.5 transition-all shadow-sm"
                onClick={toggleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {currentFlag}
                <span className="text-xs font-semibold uppercase tracking-wide text-surface-600">
                    {currentLang}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-xs text-surface-400 ml-0.5"
                >
                    ▼
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`absolute top-full mt-2 w-44 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 overflow-hidden ${currentLang === 'ar' ? 'left-0' : 'right-0'
                            }`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 border-b border-surface-100 last:border-0 ${currentLang === lang.code
                                    ? 'bg-primary-50 text-primary-700 font-semibold'
                                    : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                                    }`}
                            >
                                {lang.flag}
                                <span className="flex-1 text-left">{lang.name}</span>

                                {currentLang === lang.code && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-1.5 h-1.5 rounded-full bg-primary-500"
                                    />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(LanguageSelector);