"use client";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";

import MyImage from "@/assets/A31.png";

const AboutStory = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    const renderText = useCallback((text: string) => {
        if (!text) return null;
        return text.split("**").map((part, index) =>
            index % 2 === 1 ? <span key={index} className="text-primary-600 font-bold">{part}</span> : part
        );
    }, []);

    return (
        <section
            className="py-24 bg-surface-50 dark:bg-surface-950 overflow-hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl -z-10" />

                        <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-surface-800 rotate-3 transition-transform hover:rotate-0 duration-500">
                            <Image
                                src={MyImage}
                                alt="Abdinasir Story"
                                fill
                                sizes="(max-width: 768px) 100vw, 500px"
                                className="object-cover"
                            />
                        </div>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className={`absolute bottom-8 ${isRTL ? '-right-6' : '-left-6'} bg-white dark:bg-surface-800 p-4 rounded-2xl shadow-xl border border-surface-100 dark:border-surface-700 max-w-[200px]`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center text-xl">
                                    🎓
                                </div>
                                <div>
                                    <p className="text-xs text-surface-500 font-bold uppercase tracking-wider">{t('about_story.stats.status')}</p>
                                    <p className="text-lg font-bold text-primary-600">{t('about_story.stats.semester')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 text-center lg:text-left rtl:lg:text-right"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-surface-100 dark:bg-surface-800 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-6">
                            {t('about_story.badge')}
                        </span>

                        <h2 className="text-3xl md:text-5xl font-extrabold text-surface-900 dark:text-white mb-8 leading-tight">
                            {t('about_story.title')}
                        </h2>

                        <div className="space-y-6 text-lg text-surface-600 dark:text-surface-300 leading-relaxed">
                            <p >
                                {renderText(t('about_story.p1'))}
                            </p>
                            <p suppressHydrationWarning>
                                {renderText(t('about_story.p2'))}
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-white dark:bg-surface-900 p-4 rounded-xl shadow-sm border border-surface-100 dark:border-surface-800">
                                <span className="text-2xl">📚</span>
                                <span className="font-semibold text-surface-800 dark:text-white">{t('about_story.stats.status')}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white dark:bg-surface-900 p-4 rounded-xl shadow-sm border border-surface-100 dark:border-surface-800">
                                <span className="text-2xl">💻</span>
                                <span className="font-semibold text-surface-800 dark:text-white">{t('about_story.stats.focus')}</span>
                            </div>
                        </div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutStory;