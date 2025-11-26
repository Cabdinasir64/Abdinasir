"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import React, { useMemo } from "react";
import SocialBar from "./SocialBar";

const HeroText = ({ delay, isRTL }: { delay: number, isRTL: boolean }) => {
    const { t } = useTranslation();

    const nameVariant = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: delay + 0.2
            }
        }
    }), [delay]);

    const letterVariant = useMemo(() => ({
        hidden: { opacity: 0, y: 30, x: -25 },
        visible: { opacity: 1, y: 0, x: 0 }
    }), []);

    const nameChars = useMemo(() => "Abdinasir".split(""), []);

    return (
        <div className={`flex-1 text-center lg:text-left ${isRTL ? 'lg:text-right' : ''} z-20`}>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay, duration: 0.5 }}
                className={`flex justify-center lg:justify-start ${isRTL ? 'lg:justify-end' : ''}`}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-surface-200 shadow-sm mb-1">
                    <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-lg"
                    >
                        👋
                    </motion.span>
                    <span className="text-surface-600 font-medium text-sm">
                        {t('hero.greeting')}
                    </span>
                </div>
            </motion.div>

            <motion.h1
                variants={nameVariant}
                initial="hidden"
                animate="visible"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-surface-900 tracking-tight mb-4"
            >
                {nameChars.map((char, index) => (
                    <motion.span key={index} variants={letterVariant} className="inline-block">
                        {char}
                    </motion.span>
                ))}
                <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: delay + 1.2, type: "spring" }}
                    className="text-primary-500 inline-block ml-1"
                >
                    .
                </motion.span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.5, duration: 0.5 }}
                className="text-2xl lg:text-4xl font-bold mb-6"
            >
                <span className="text-surface-400">{isRTL ? 'مطور ' : 'A '}</span>
                <motion.span
                    className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-[length:200%_auto]"
                    animate={{ backgroundPosition: ["0%", "200%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                    {t('hero.role')}
                </motion.span>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.7 }}
                className={`text-lg text-surface-600 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 ${isRTL ? 'lg:ml-auto lg:mr-0' : ''}`}
            >
                {t('hero.description')}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.9 }}
                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start ${isRTL ? 'lg:justify-end' : ''}`}
            >
                <Link
                    href="/projects"
                    className="px-8 py-4 bg-surface-900 text-white rounded-xl font-bold shadow-lg shadow-surface-900/20 
               hover:bg-primary-600 hover:scale-105 transition-all duration-300
               relative overflow-hidden group hover:shadow-xl hover:shadow-primary-500/30"
                >
                    {t('hero.cta_primary')}

                    <span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                        style={{
                            animation: 'shine 2s linear infinite'
                        }}
                    ></span>

                    <style jsx>{`
        @keyframes shine {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
        }
    `}</style>
                </Link>
                <Link
                    href="/contact"
                    className="px-8 py-4 bg-white text-surface-900 border border-surface-200 rounded-xl font-bold hover:border-primary-500 hover:text-primary-600 hover:-translate-y-1 transition-all duration-300"
                >
                    {t('hero.cta_secondary')}
                </Link>
            </motion.div>

            <div className={`flex justify-center lg:justify-start ${isRTL ? 'lg:justify-end' : ''}`}>
                <SocialBar delay={delay + 1.1} />
            </div>

        </div>
    );
};

export default React.memo(HeroText);