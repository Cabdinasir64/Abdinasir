"use client";
import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import MagneticButton from "./MagneticButton";

const CallToAction = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    const blob1Animation = useMemo(() => ({
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
        opacity: [0.3, 0.5, 0.3]
    }), []);

    const blob2Animation = useMemo(() => ({
        scale: [1, 1.5, 1],
        x: [0, -50, 0],
    }), []);

    return (
        <section className="relative py-32 overflow-hidden bg-surface-900 text-white">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40" />
                <motion.div
                    animate={blob1Animation}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
                />
                <motion.div
                    animate={blob2Animation}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-6"
                    >
                        <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-primary-300 text-sm font-semibold tracking-widest uppercase">
                            👋 {t('nav.contact') || "Get in Touch"}
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight max-w-4xl"
                    >
                        <span>{t('cta.title')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-surface-300 max-w-2xl mb-12 leading-relaxed"
                    >
                        <span>{t('cta.subtitle')}</span>
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        <MagneticButton href="/contact">
                            <span>{t('cta.button')}</span>
                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${isRTL ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </MagneticButton>
                    </motion.div>

                </div>
            </div>

        </section>
    );
};

export default memo(CallToAction);