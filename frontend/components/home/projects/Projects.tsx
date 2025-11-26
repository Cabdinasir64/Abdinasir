"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useProjects } from "@/hooks/useProjects";
import { useLanguageStore } from "@/stores/languageStore";
import ProjectCard from "./ProjectCard";
import React from "react"; 

const Projects = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const { projects, loading, error } = useProjects();

    const isRTL = currentLang === 'ar';

    if (loading) {
        return (
            <div className="py-40 flex flex-col items-center justify-center gap-4 bg-surface-50 dark:bg-surface-950">
                <div className="w-12 h-12 border-4 border-surface-200 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-surface-500 font-medium animate-pulse">{t('common.loading')}</p>
            </div>
        );
    }

    if (error || projects.length === 0) return null;

    return (
        <section className="py-24 bg-surface-50 dark:bg-surface-950 relative overflow-hidden" id="projects">

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-50/50 to-surface-50 dark:to-surface-950 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 dark:bg-primary-900/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-100/40 dark:bg-secondary-900/10 rounded-full blur-[100px] pointer-events-none" />


            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`mb-16 max-w-3xl ${isRTL ? 'mr-auto text-right' : 'ml-auto text-left'} md:mx-auto md:text-center`}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-3 border border-primary-100 dark:border-primary-800">
                            {t('projects.subtitle') || "Portfolio"}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-surface-900 dark:text-white mb-6 leading-tight">
                            {t('projects.title')}
                        </h2>
                    </motion.div>
                </div>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            isRTL={isRTL}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link
                        href="/projects"
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-surface-900 dark:bg-surface-800 rounded-full hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 focus:outline-none hover:-translate-y-1"
                    >
                        <span className="mr-2">{t('projects.see_all')}</span>
                        <svg
                            className={`w-5 h-5 transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
};

export default Projects;