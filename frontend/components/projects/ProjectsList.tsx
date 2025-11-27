"use client";
import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { Project } from "@/types/project";
import { errorToast } from "@/components/ui/Toaster";
import ProjectsSkeleton from "./ProjectsSkeleton";

const ProjectsList = () => {
  const { t } = useTranslation();
  const { currentLang } = useLanguageStore();
  const isRTL = currentLang === 'ar';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const categories = useMemo(() => ["ALL", "FRONTEND", "BACKEND", "FULL_STACK", "MOBILE_APP", "SAAS", "UI_UX", "OTHER"], []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects-cache`);

        if (!response.ok) throw new Error("Failed to fetch projects");
        const json = await response.json();
        setProjects(json.data);
      } catch (err: any) {
        errorToast(t('errors.fetch_failed') || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [t]);

  const processedProjects = useMemo(() => {
    let result = [...projects];

    if (activeCategory !== "ALL") {
      result = result.filter(p => p.categories.includes(activeCategory as any));
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "views") {
      result.sort((a, b) => b.viewCount - a.viewCount);
    }

    return result;
  }, [projects, activeCategory, sortBy]);

  const totalPages = Math.ceil(processedProjects.length / ITEMS_PER_PAGE);
  const displayedProjects = useMemo(() => processedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ), [processedProjects, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, sortBy]);

  const handleCategoryChange = useCallback((cat: string) => setActiveCategory(cat), []);
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value), []);
  const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);

  return (
    <section className="py-16 bg-surface-50 dark:bg-surface-950 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
          {/* Categories */}
          <div className="w-full lg:w-auto overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  disabled={loading}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border
                      ${activeCategory === cat
                      ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30'
                      : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-800 hover:bg-surface-100 dark:hover:bg-surface-800'}
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                  <span >{cat === 'ALL' ? t('skills_list.filter_all') : cat.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full lg:w-auto min-w-[200px]">
            <select
              value={sortBy}
              onChange={handleSortChange}
              disabled={loading}
              className={`w-full appearance-none px-5 py-3 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer shadow-sm ${loading ? 'opacity-50' : ''}`}
            >
              <option value="newest">{t('skills_list.sort_newest')}</option>
              <option value="oldest">{t('skills_list.sort_oldest')}</option>
              <option value="name">{t('skills_list.sort_name')}</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <ProjectsSkeleton />
        ) : (
          <>
            {displayedProjects.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {displayedProjects.map((project, index) => (
                    <ProjectItem key={project.id} project={project} isRTL={isRTL} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p suppressHydrationWarning className="text-xl text-surface-500">{t('skills_list.no_results')}</p>
                <button onClick={() => handleCategoryChange("ALL")} className="mt-4 text-primary-600 font-bold hover:underline">
                  Clear Filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center gap-3">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};

const ProjectItem = memo(({ project, isRTL, index }: { project: Project, isRTL: boolean, index: number }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      className="group flex flex-col bg-white dark:bg-surface-900 rounded-3xl overflow-hidden border border-surface-200 dark:border-surface-800 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={project.mainImage}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-bold bg-white/90 dark:bg-black/80 backdrop-blur rounded-lg shadow-sm text-surface-900 dark:text-white">
            {project.categories[0].replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2 line-clamp-1">{project.name}</h3>
        <div className="flex gap-4 text-xs text-surface-500 font-medium mb-4">
          <span className="flex items-center gap-1">👁️ {project.viewCount}</span>
          <span className="flex items-center gap-1">❤️ {project.likes}</span>
          <span className="flex items-center gap-1">⭐ {(project.rating || 0).toFixed(1)}</span>
        </div>

        <p suppressHydrationWarning className="text-surface-600 dark:text-surface-400 text-sm line-clamp-2 mb-6 flex-1">
          {project.description}
        </p>

        <Link
          href={`/projects/${project.name}`}
          className="w-full py-3 rounded-xl bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-primary-600 group-hover:text-white transition-all"
        >
          View Details
          <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    </motion.div>
  )
});

ProjectItem.displayName = "ProjectItem";

export default ProjectsList;