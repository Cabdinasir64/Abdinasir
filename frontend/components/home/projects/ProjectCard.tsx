"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Project } from "@/types/project";

interface ProjectCardProps {
    project: Project;
    index: number;
    isRTL: boolean;
}

const ProjectCard = ({ project, index, isRTL }: ProjectCardProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col h-full bg-white dark:bg-surface-900 rounded-3xl overflow-hidden border border-surface-200 dark:border-surface-800 hover:shadow-2xl hover:shadow-primary-900/10 hover:border-primary-500/30 transition-all duration-500"
        >            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={project.mainImage}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                    <span className="px-3 py-1.5 text-xs font-bold text-white uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-sm">
                        {project.categories[0]}
                    </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                    <Link
                        href={project.link}
                        target="_blank"
                        className="w-14 h-14 flex items-center justify-center bg-white rounded-full text-surface-900 shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col flex-1 p-6 relative">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-3 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {project.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 3).map((tech, i) => (
                        <span
                            key={i}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.tech.length > 3 && (
                        <span className="px-2 py-1 text-[11px] font-semibold text-surface-400">
                            +{project.tech.length - 3}
                        </span>
                    )}
                </div>
                <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                    {project.description}
                </p>

                <div className="w-full h-px bg-surface-100 dark:bg-surface-800 mb-4" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-medium text-surface-500">
                        <div className="flex items-center gap-1.5" title="Views">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {project.viewCount}
                        </div>
                        <div className="flex items-center gap-1.5" title="Likes">
                            <svg className="w-4 h-4 text-accent-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            {project.likes}
                        </div>
                    </div>
                    <Link
                        href={project.link}
                        target="_blank"
                        className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all group/link"
                    >
                        {t('projects.view_live')}
                        <svg
                            className={`w-4 h-4 transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

            </div>
        </motion.div>
    );
};

export default ProjectCard;