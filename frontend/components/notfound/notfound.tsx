"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";

export default function NotFound() {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const shapeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!textRef.current || !shapeRef.current) return;

        const xToText = gsap.quickTo(textRef.current, "x", { duration: 1, ease: "power2.out" });
        const yToText = gsap.quickTo(textRef.current, "y", { duration: 1, ease: "power2.out" });

        const xToShape = gsap.quickTo(shapeRef.current, "x", { duration: 1.5, ease: "power2.out" });
        const yToShape = gsap.quickTo(shapeRef.current, "y", { duration: 1.5, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPos = (clientX / innerWidth - 0.5) * 50;
            const yPos = (clientY / innerHeight - 0.5) * 50;

            xToText(-xPos * 2);
            yToText(-yPos * 2);

            xToShape(xPos);
            yToShape(yPos);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-surface-50 dark:bg-[#0B0F19]"
            dir={isRTL ? 'rtl' : 'ltr'}
        >

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none" />

            <div ref={shapeRef} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "backOut" }}
                    className="relative"
                >
                    <h1
                        ref={textRef}
                        className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-surface-500 to-surface-100 dark:from-surface-800 dark:to-surface-900 select-none"
                    >
                        404
                    </h1>

                    <motion.div
                        animate={{ y: [-20, 20, -20], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <span className="text-6xl md:text-8xl filter drop-shadow-lg">🛸</span>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-8 space-y-6"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-surface-900 dark:text-white">
                        {t('not_found.title')}
                    </h2>

                    <p className="text-lg md:text-xl text-surface-600 dark:text-surface-400 max-w-lg mx-auto">
                        {t('not_found.subtitle')}
                    </p>
                    <div className="pt-8">
                        <Link
                            href="/"
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-surface-900 dark:bg-surface-800 rounded-full hover:bg-primary-600 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
                        >
                            <span className={`transition-transform duration-300 ${isRTL ? 'ml-2' : 'mr-2'}`}>
                                <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                            {t('not_found.button')}
                        </Link>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}