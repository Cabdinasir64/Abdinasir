"use client";
import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";

const SkillsHero = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';


    const floatingShapes = useMemo(() => {
        return Array.from({ length: 6 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 80}%`,
            top: `${Math.random() * 80}%`,
            initialX: Math.random() * 1000,
            initialY: Math.random() * 500,
            duration: 10 + Math.random() * 10
        }));
    }, []);

    const blob1Anim = useMemo(() => ({ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }), []);
    const blob2Anim = useMemo(() => ({ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }), []);

    return (
        <section
            className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden bg-surface-500/30"
            dir={isRTL ? 'rtl' : 'ltr'}
        >

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[1]" />

                <motion.div
                    animate={blob1Anim}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-20 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={blob2Anim}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                    className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-500/10 rounded-full blur-[100px]"
                />

                {floatingShapes.map((shape) => (
                    <motion.div
                        key={shape.id}
                        className="absolute w-16 h-16 border border-primary-900 rounded-2xl opacity-20"
                        initial={{
                            x: shape.initialX,
                            y: shape.initialY,
                            rotate: 0
                        }}
                        animate={{
                            y: [0, -40, 0],
                            rotate: [0, 90, 180]
                        }}
                        transition={{
                            duration: shape.duration,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            left: shape.left,
                            top: shape.top
                        }}
                        suppressHydrationWarning
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-3xl mx-auto"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block py-1.5 px-4 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 text-primary-600 dark:text-primary-300 font-bold text-xs tracking-widest uppercase mb-6"
                    >
                        <span >{t('skills_hero.badge')}</span>
                    </motion.span>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-surface-900 dark:text-white mb-6 tracking-tight leading-tight">
                        {t('skills_hero.title')}
                    </h1>

                    <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 leading-relaxed max-w-2xl mx-auto">
                        {t('skills_hero.description')}
                    </p>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-surface-900/20  to-transparent" />

        </section>
    );
};

export default memo(SkillsHero);