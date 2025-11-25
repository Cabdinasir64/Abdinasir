"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSkills } from "@/hooks/useSkills";
import { useLanguageStore } from "@/stores/languageStore";
import SkillItem from "./SkillItem";

const Skills = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const { skills, loading } = useSkills();
    const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const isRTL = currentLang === 'ar';

    useEffect(() => {
        if (skills.length > 0 && !activeSkillId) {
            setActiveSkillId(skills[0].id);
        }
    }, [skills]);

    if (loading) return (
        <div className="h-[200px] flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-surface-200 dark:border-surface-700 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">{t('common.loading')}</p>
            </div>
        </div>
    );

    return (
        <section className="py-20 bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 relative overflow-hidden border-t border-surface-200 dark:border-surface-700" id="skills">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-20" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary-100 dark:bg-secondary-900/20 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`mb-12 ${isRTL ? 'text-right pr-4 md:pr-12' : 'text-left pl-4 md:pl-6'}`}
                >
                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 mb-4"
                    >
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                        <span className="text-primary-700 dark:text-primary-300 font-semibold text-sm">
                            {t('skills.badge', 'Skills & Technologies')}
                        </span>
                    </motion.div>

                    <h2 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">
                        {t('skills.title')}
                    </h2>
                    <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl leading-relaxed">
                        {t('skills.subtitle')}
                    </p>
                </motion.div>
                <div
                    className="-mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    <div className={`absolute top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-surface-50 via-surface-50/80 to-transparent dark:from-surface-900 dark:via-surface-900/80 z-20 pointer-events-none ${isRTL ? 'left-auto right-0 bg-gradient-to-l' : 'left-0'}`} />

                    <div className={`absolute top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-surface-50 via-surface-50/80 to-transparent dark:from-surface-900 dark:via-surface-900/80 z-20 pointer-events-none ${isRTL ? 'right-auto left-0 bg-gradient-to-r' : 'right-0'}`} />

                    <div className="overflow-x-auto hide-scrollbar pb-8 px-4 sm:px-6 lg:px-8">
                        <div className={`flex items-start gap-3 ${isRTL ? 'pr-4 md:pr-12' : 'pl-4 md:pl-6'}`}>
                            {skills.map((skill) => (
                                <SkillItem
                                    key={skill.id}
                                    skill={skill}
                                    isActive={activeSkillId === skill.id}
                                    onClick={() => {
                                        setActiveSkillId(skill.id);
                                        document.getElementById(`skill-btn-${skill.id}`)?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'nearest',
                                            inline: 'center'
                                        });
                                    }}
                                    isRTL={isRTL}
                                />
                            ))}
                            <div className="w-12 flex-shrink-0" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Skills;