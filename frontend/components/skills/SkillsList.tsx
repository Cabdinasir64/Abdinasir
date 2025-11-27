"use client";
import React, { useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { useSkillsFilter } from "@/hooks/useSkillsFilter";
import SkillsSkeleton from "./SkillsSkeleton";
import { getSkillPercentage } from "@/utils/skillHelpers";

const SkillsList = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    const {
        skills,
        loading,
        filtering,
        error,
        activeCategory,
        setActiveCategory,
        sortBy,
        setSortBy,
        currentPage,
        setCurrentPage,
        totalPages
    } = useSkillsFilter();

    const categories = useMemo(() => ["ALL", "PROGRAMMING", "FRONTEND", "STATEMANAGMENT", "BACKEND", "FRAMEWORK", "DATABASE", "TOOL", "CLOUD"], []);

    const handleCategoryChange = useCallback((cat: string) => setActiveCategory(cat), [setActiveCategory]);
    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value), [setSortBy]);
    const handlePageChange = useCallback((page: number) => setCurrentPage(page), [setCurrentPage]);

    const paginationItems = useMemo(() => [...Array(totalPages)], [totalPages]);

    return (
        <section className="py-16 bg-surface-50 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">

                    <div className="w-full lg:w-auto overflow-x-auto pb-2 hide-scrollbar">
                        <div className="flex gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border
                      ${activeCategory === cat
                                            ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30'
                                            : 'bg-white text-surface-600 border-surface-200 hover:bg-surface-100 hover:border-primary-200'}
                    `}
                                >
                                    <span >
                                        {cat === 'ALL' ? t('skills_list.filter_all') : t(`skills_list.categories.${cat}`)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full lg:w-auto min-w-[180px]">
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="w-full appearance-none px-5 py-3 rounded-xl bg-white border border-surface-200 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer shadow-sm"
                        >
                            <option value="newest">{t('skills_list.sort_newest')}</option>
                            <option value="oldest">{t('skills_list.sort_oldest')}</option>
                            <option value="name">{t('skills_list.sort_name')}</option>
                        </select>
                        <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'left-4' : 'right-4'}`}>
                            <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {filtering ? (
                    <SkillsSkeleton />
                ) : (
                    <>
                        {skills.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {skills.map((skill) => (
                                        <SkillCard key={skill.id} skill={skill} isRTL={isRTL} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-surface-800 mb-2">
                                    {t('skills_list.no_results')}
                                </h3>
                                <p className="text-surface-500 max-w-md">
                                    Try selecting a different category or clearing your filters.
                                </p>
                                <button
                                    onClick={() => handleCategoryChange("ALL")}
                                    className="mt-6 px-6 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                                >
                                    <span >{t('skills_list.filter_all')}</span>
                                </button>
                            </motion.div>
                        )}
                    </>
                )}

                {!filtering && skills.length > 0 && totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-3">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="p-3 rounded-xl bg-white border border-surface-200 text-surface-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 hover:border-surface-300 transition-all shadow-sm"
                        >
                            <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <div className="flex gap-2">
                            {paginationItems.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300
                       ${currentPage === i + 1
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                                            : 'bg-white text-surface-600 border border-surface-200 hover:border-primary-500 hover:text-primary-600'}
                     `}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="p-3 rounded-xl bg-white border border-surface-200 text-surface-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 hover:border-surface-300 transition-all shadow-sm"
                        >
                            <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

const SkillCard = memo(({ skill, isRTL }: { skill: any, isRTL: boolean }) => {
    const percentage = getSkillPercentage(skill.level);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-3xl p-6 border border-surface-200 hover:border-primary-500 hover:ring-4 hover:ring-primary-500/10 hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className={`flex flex-col h-full ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex justify-between items-start mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-14 h-14 p-2.5 bg-surface-50 rounded-2xl border border-surface-100 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <Image
                            src={skill.skillImage}
                            alt={skill.name}
                            width={100}
                            height={100}
                            className="object-contain w-full h-full"
                            sizes="100px"
                        />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-[10px] font-extrabold uppercase tracking-wider border border-primary-100">
                        {skill.level}
                    </span>
                </div>

                <div className="mb-6 flex-1">
                    <h3 className="text-xl font-bold text-surface-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {skill.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {skill.category.map((c: string) => (
                            <span key={c} className="px-2 py-0.5 rounded bg-surface-100 text-surface-500 text-xs font-medium lowercase border border-surface-200">
                                #{c}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <div className={`flex justify-between text-xs font-semibold mb-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-surface-400">Proficiency</span>
                        <span className="text-primary-600">{percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden border border-surface-100">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
});

SkillCard.displayName = "SkillCard";

export default SkillsList;