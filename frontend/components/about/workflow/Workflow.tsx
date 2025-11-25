"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import WorkflowCard from "./WorkflowCard";

const Workflow = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    const steps = [
        { id: "1", icon: "🔍" },
        { id: "2", icon: "🎨" },
        { id: "3", icon: "💻" },
        { id: "4", icon: "🚀" },
    ];

    return (
        <section className="py-24 bg-surface-100 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-full bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="w-full flex flex-col items-center justify-center text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl flex flex-col items-center ml-[70px] sm:ml-18"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-3 border border-primary-100 dark:border-primary-800">
                            {t('workflow.title')}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-surface-900 dark:text-white mb-4">
                            {t('workflow.title')}
                        </h2>
                        <p className="text-lg text-surface-600 dark:text-surface-400">
                            {t('workflow.subtitle')}
                        </p>
                    </motion.div>
                </div>

                <div className="relative max-w-6xl mx-auto">

                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-surface-200 via-primary-500/50 to-surface-200 dark:from-surface-800 dark:via-primary-500/50 dark:to-surface-800 -translate-x-1/2 hidden md:block" />

                    <div className={`absolute top-0 bottom-0 w-0.5 bg-surface-200 dark:bg-surface-800 md:hidden 
             ${isRTL ? 'right-6' : 'left-6'}`}
                    />

                    <div className="space-y-12 md:space-y-0">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 50, x: isEven ? (isRTL ? 50 : -50) : (isRTL ? -50 : 50) }}
                                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                                    viewport={{ once: false, amount: 0.3 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                    className={`relative flex items-center md:justify-between flex-col md:flex-row`}
                                >

                                    <div className={`w-full md:w-5/12 mb-8 md:mb-0 
                     ${isRTL ? 'md:pl-12' : 'md:pr-12'}`}
                                    >

                                        {isEven ? (
                                            <div className={`${isRTL ? 'pr-16 md:pr-0' : 'pl-16 md:pl-0'}`}>
                                                <WorkflowCard step={step} index={index} isEven={isEven} isRTL={isRTL} />
                                            </div>
                                        ) : null}

                                        {!isEven && (
                                            <div className={`md:hidden ${isRTL ? 'pr-16' : 'pl-16'}`}>
                                                <WorkflowCard step={step} index={index} isEven={isEven} isRTL={isRTL} />
                                            </div>
                                        )}
                                    </div>

                                    <div className={`absolute top-0 flex items-center justify-center w-12 h-12 rounded-full bg-surface-50 dark:bg-surface-950 border-4 border-white dark:border-surface-900 shadow-lg z-20 
                    
                    ${isRTL ? 'right-0' : 'left-0'} 
                    md:left-1/2 md:-translate-x-1/2 md:right-auto
                  `}>
                                        <div className="w-4 h-4 bg-primary-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                                    </div>

                                    <div className={`w-full md:w-5/12 hidden md:block 
                     ${isRTL ? 'md:pr-12' : 'md:pl-12'}`}
                                    >
                                        {!isEven ? (
                                            <div className="">
                                                <WorkflowCard step={step} index={index} isEven={isEven} isRTL={isRTL} />
                                            </div>
                                        ) : null}
                                    </div>

                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Workflow;