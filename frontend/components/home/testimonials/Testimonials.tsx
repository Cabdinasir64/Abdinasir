"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useLanguageStore } from "@/stores/languageStore";

const Testimonials = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const { testimonials, loading, error } = useTestimonials();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const isRTL = currentLang === 'ar';

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, [testimonials.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }, [testimonials.length]);

    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, testimonials.length]);

    const variants = useMemo(() => ({
        enter: (direction: number) => ({
            x: direction > 0 ? (isRTL ? -100 : 100) : (isRTL ? 100 : -100),
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? (isRTL ? -100 : 100) : (isRTL ? 100 : -100),
            opacity: 0,
            scale: 0.9
        })
    }), [isRTL]);

    if (loading) return null;
    if (error || testimonials.length === 0) return null;

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-24 bg-white dark:bg-surface-900 relative overflow-hidden" id="testimonials">

            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl mix-blend-multiply" />
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary-100 rounded-full blur-3xl mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary-600 font-bold tracking-widest uppercase text-xs mb-2 block"
                    >
                        <span>{t('testimonials.title')}</span>
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-extrabold text-surface-900 dark:text-white"
                    >
                        <span>{t('testimonials.subtitle')}</span>
                    </motion.h2>
                </div>

                <div className="relative max-w-4xl mx-auto h-[400px] sm:h-[350px] flex items-center justify-center">

                    <button
                        onClick={prevSlide}
                        className={`absolute top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-surface-800 shadow-lg text-surface-600 hover:text-primary-600 hover:scale-110 transition-all hidden md:flex ${isRTL ? '-right-12' : '-left-12'}`}
                    >
                        <svg className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className={`absolute top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-surface-800 shadow-lg text-surface-600 hover:text-primary-600 hover:scale-110 transition-all hidden md:flex ${isRTL ? '-left-12' : '-right-12'}`}
                    >
                        <svg className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute w-full px-4"
                        >
                            <div className="bg-surface-50 dark:bg-surface-800 rounded-3xl p-8 md:p-12 text-center relative shadow-xl border border-surface-100 dark:border-surface-700 mx-auto max-w-3xl">

                                <div className="absolute top-6 left-8 opacity-10 pointer-events-none">
                                    <svg className="w-20 h-20 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                                    </svg>
                                </div>

                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <Image
                                        src={currentTestimonial.image}
                                        alt={currentTestimonial.name}
                                        fill
                                        className="object-cover rounded-full border-4 border-white dark:border-surface-700 shadow-md"
                                    />
                                </div>

                                <p className="text-lg md:text-2xl font-medium text-surface-700 dark:text-surface-300 italic mb-8 leading-relaxed relative z-10">
                                    "{currentTestimonial.text}"
                                </p>

                                <div>
                                    <h4 className="text-xl font-bold text-surface-900 dark:text-white">
                                        {currentTestimonial.name}
                                    </h4>
                                    <p className="text-sm text-primary-600 font-semibold mt-1">
                                        {currentTestimonial.position}
                                    </p>
                                </div>

                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? 'w-8 bg-primary-600'
                                : 'w-2 bg-surface-300 hover:bg-primary-300'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;