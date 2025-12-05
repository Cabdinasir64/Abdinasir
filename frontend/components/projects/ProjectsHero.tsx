"use client";
import React, { useMemo, memo } from "react";
import { motion, easeOut } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";

const ProjectsHero = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    const container = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }), []);

    const item = useMemo(() => ({
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }
    }), []);

    const blob1Anim = useMemo(() => ({
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 50, 0]
    }), []);

    const blob2Anim = useMemo(() => ({
        scale: [1, 1.5, 1],
        opacity: [0.2, 0.4, 0.2],
        x: [0, -50, 0]
    }), []);

    return (
        <section
            className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-surface-50 overflow-hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
        >

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                <motion.div
                    animate={blob1Anim}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
                />
                <motion.div
                    animate={blob2Anim}
                    transition={{ duration: 15, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.div variants={item} className="mb-6 flex justify-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm text-sm font-medium text-primary-600 dark:text-primary-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span >{t('projects_hero.badge')}</span>
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={item}
                        className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-6 leading-tight"
                    >
                        {t('projects_hero.title')}
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="text-lg md:text-xl text-surface-600 dark:text-surface-400 leading-relaxed max-w-2xl mx-auto mb-12"

                    >
                        {t('projects_hero.description')}
                    </motion.p>

                    <motion.div
                        variants={item}
                        className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-surface-200 dark:border-surface-800/50 pt-10 mt-10 max-w-3xl mx-auto"
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-surface-900 dark:text-white mb-1">5+</div>
                            <div className="text-sm text-surface-500 font-medium uppercase tracking-wider">{t('projects_hero.stats.projects')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-surface-900 dark:text-white mb-1">1+</div>
                            <div className="text-sm text-surface-500 font-medium uppercase tracking-wider">{t('projects_hero.stats.experience')}</div>
                        </div>
                        <div className="text-center col-span-2 md:col-span-1">
                            <div className="text-3xl font-bold text-surface-900 dark:text-white mb-1">∞</div>
                            <div className="text-sm text-surface-500 font-medium uppercase tracking-wider">{t('projects_hero.stats.coffee')}</div>
                        </div>
                    </motion.div>

                </motion.div>

            </div>

            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-surface-50 dark:from-surface-950 to-transparent pointer-events-none" />

        </section>
    );
};

export default memo(ProjectsHero);