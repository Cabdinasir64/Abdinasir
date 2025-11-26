"use client";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { warningToast } from '@/components/ui/Toaster';

const AboutCta = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    const handleResumeClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        warningToast(t('about_cta.coming_soon'));
    }, [t]);

    return (
        <section className="py-20 bg-surface-50 dark:bg-surface-950" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative overflow-hidden rounded-3xl bg-primary-900 dark:bg-surface-900 text-white shadow-2xl px-6 py-16 md:px-16 md:py-20 text-center"
                >

                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 pointer-events-none" />
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-30" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-500 rounded-full blur-[100px] opacity-30" />

                    <div className="relative z-10 max-w-3xl mx-auto">

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight"
                        >
                            <span>{t('about_cta.title')}</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            className="text-lg text-primary-100 mb-10 leading-relaxed"
                        >
                            <span>{t('about_cta.subtitle')}</span>
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link
                                href="/contact"
                                className="w-full sm:w-auto px-8 py-4 bg-white text-primary-900 font-bold rounded-full hover:bg-primary-50 transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <span>{t('about_cta.btn_contact')}</span>
                                <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>

                            <a
                                href="#"
                                onClick={handleResumeClick}
                                className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>{t('about_cta.btn_resume')}</span>
                            </a>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutCta;