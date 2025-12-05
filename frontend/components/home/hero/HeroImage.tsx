"use client";
import { motion, easeInOut, spring } from "framer-motion";
import Image from "next/image";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import ProfilePic from '@/assets/PortfolioImage.jpg';

const HeroImage = ({ delay, isRTL }: { delay: number, isRTL: boolean }) => {
    const { t } = useTranslation();

    const containerVariants = useMemo(() => ({
        initial: { opacity: 0, x: isRTL ? -50 : 50 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: delay + 0.4, duration: 0.8, type: spring }
    }), [delay, isRTL]);

    const floatAnimation1 = useMemo(() => ({
        animate: { y: [0, -15, 0] },
        transition: { duration: 4, repeat: Infinity, ease: easeInOut }
    }), []);

    const floatAnimation2 = useMemo(() => ({
        animate: { y: [0, 15, 0] },
        transition: { duration: 4, repeat: Infinity, ease: easeInOut }
    }), []);

    return (
        <motion.div
            className="relative w-full max-w-[450px] aspect-square mx-auto lg:mx-0 z-10"
            initial={containerVariants.initial}
            animate={containerVariants.animate}
            transition={containerVariants.transition}
        >

            <div className={`absolute top-0 w-full h-full bg-gradient-to-bl from-primary-100 to-secondary-100 rounded-[3rem] transform rotate-6 scale-95 transition-transform hover:rotate-3 ${isRTL ? '-rotate-6 hover:-rotate-3' : ''}`} />

            <div className="relative w-full h-full bg-white/60 backdrop-blur-sm p-3 rounded-[2.5rem] shadow-2xl border border-white">
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-surface-100">
                    <Image
                        src={ProfilePic}
                        alt="Abdinasir Portfolio"
                        fill
                        className="object-cover object-top hover:scale-110 transition-transform duration-700 ease-in-out"
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority={false}
                        quality={75}
                    />
                </div>
            </div>

            <motion.div
                style={{ willChange: "transform, opacity" }}
                animate={floatAnimation1.animate}
                transition={floatAnimation1.transition}
                className={`absolute top-12 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-surface-100 flex items-center gap-3 z-20 
          ${isRTL ? 'left-[-20px] lg:left-[-40px]' : 'right-[-20px] lg:right-[-40px]'}`}
            >
                <span className="text-3xl">🚀</span>
                <div className="text-left">
                    <p className="font-bold text-surface-900 text-lg leading-none">1+</p>
                    <p className="text-xs text-surface-500 font-bold uppercase">{t('hero.experience_badge')}</p>
                </div>
            </motion.div>

            <motion.div
                style={{ willChange: "transform, opacity" }}
                animate={floatAnimation2.animate}
                transition={floatAnimation2.transition}
                className={`absolute bottom-12 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-surface-100 flex items-center gap-3 z-20
          ${isRTL ? 'right-[-20px] lg:right-[-40px]' : 'left-[-20px] lg:left-[-40px]'}`}
            >
                <span className="text-3xl">💻</span>
                <div className="text-left">
                    <p className="font-bold text-surface-900 text-lg leading-none">5+</p>
                    <p className="text-xs text-surface-500 font-bold uppercase">{t('hero.projects_badge')}</p>
                </div>
            </motion.div>

        </motion.div>
    );
};

export default React.memo(HeroImage);