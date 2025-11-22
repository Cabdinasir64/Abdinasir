'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import { ProjectsApiResponse, Project } from '@/types';
import ProjectsLoading from './ProjectsLoading';
import Link from 'next/link';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }
  return res.json();
});

interface ProjectListProps {
  initialData: ProjectsApiResponse | null;
}

export default function ProjectList({ initialData }: ProjectListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const buildApiUrl = () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/projects?page=${currentPage}&limit=10`;

    if (filterCategory) {
      url += `&category=${encodeURIComponent(filterCategory)}`;
    }

    return url;
  };

  const { data, error, isLoading, mutate: mutateData } = useSWR<ProjectsApiResponse | undefined>(
    buildApiUrl(),
    fetcher,
    {
      fallbackData: initialData ?? undefined,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
    }
  );



  const filteredProjects = data?.data ? data.data.filter(project => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      project.name.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.tech.some(tech => tech.toLowerCase().includes(searchLower)) ||
      project.categories.some(cat => cat.toLowerCase().includes(searchLower))
    );
  }) : [];

  const paginatedProjects = filteredProjects.slice(0, 10);
  const clientSideTotalPages = Math.ceil(filteredProjects.length / 10);

  const handleDelete = async (id: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    const deleteToast = toast.loading('Deleting project...');

    try {
      if (data) {
        const optimisticData = {
          ...data,
          data: data.data.filter(project => project.id !== id),
          pagination: {
            ...data.pagination,
            total: data.pagination.total - 1,
          },
        };
        mutateData(optimisticData, false);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        credentials: "include"
      });

      if (!response.ok) throw new Error('Delete failed');

      toast.success('Project deleted successfully', { id: deleteToast });

      mutateData();

    } catch (error) {
      mutateData();
      toast.error('Failed to delete project', { id: deleteToast });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setFilterCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };


  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to load projects</h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={() => mutateData()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </motion.div>
    );
  }

  if (!isLoading && data?.data.length === 0 && !searchTerm && !filterCategory) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first project</p>
          <Link
            href="/admin/projects/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create Project
          </Link>
        </div>
      </motion.div>
    );
  }

  if (!isLoading && searchTerm && paginatedProjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="w-24 h-24 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching projects</h3>
          <p className="text-gray-600 mb-4">No projects found for "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Clear Search
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>

      {data && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            label="Total Projects"
            value={searchTerm ? filteredProjects.length : data.pagination.total}
            icon="📊"
          />
          <StatCard
            label="Showing"
            value={paginatedProjects.length}
            icon="👁️"
          />
          <StatCard
            label="Total Pages"
            value={searchTerm ? clientSideTotalPages : data.pagination.totalPages}
            icon="📖"
          />
          <StatCard
            label="Current Page"
            value={currentPage}
            icon="📍"
          />
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search projects by name, description, or technology..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={filterCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option value="PORTFOLIO">Portfolio</option>
          <option value="WEB_DESIGN">Web Design</option>
          <option value="MOBILE_APP">Mobile App</option>
          <option value="UI_UX">UI/UX</option>
          <option value="MACHINE_LEARNING">Machine Learning</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm('');
            setFilterCategory('');
            setCurrentPage(1);
          }}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
        >
          Clear Filters
        </button>

        <button
          onClick={() => mutateData()}
          disabled={isLoading}
          className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-end mb-4"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live data</span>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isLoading ? (
          <ProjectsLoading />
        ) : (
          <motion.div
            key={`projects-${currentPage}-${searchTerm}-${filterCategory}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedProjects.map((project: Project, index: number) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                deletingId={deletingId}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {(searchTerm ? clientSideTotalPages > 1 : (data?.pagination?.totalPages ?? 1) > 1)
        && (
          <Pagination
            currentPage={currentPage}
            totalPages={searchTerm ? clientSideTotalPages : (data?.pagination.totalPages || 1)}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
    </>
  );
}

function ProjectCard({
  project,
  index,
  deletingId,
  onDelete
}: {
  project: Project;
  index: number;
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            delay: index * 0.1,
            duration: 0.6,
            ease: "easeOut"
          }
        }
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        {project.mainImage && (
          <Image
            src={project.mainImage}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            height={120}
            width={120}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {project.categories[0]}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {project.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs rounded-lg font-medium"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <EyeIcon className="w-4 h-4" />
            {project.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <HeartIcon className="w-4 h-4" />
            {project.likes}
          </span>
          <span className="flex items-center gap-1">
            <StarIcon className="w-4 h-4" />
            {project.rating.toFixed(1)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'PUBLISHED'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
            }`}>
            {project.status}
          </span>

          <div className="flex gap-2">
            <Link href={`/admin/projects/add?edit=${project.id}`}
             className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              Edit
            </Link>
            <button
              onClick={() => onDelete(project.id, project.name)}
              disabled={deletingId === project.id}
              className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === project.id ? (
                <span className="flex items-center gap-1">
                  <SpinnerIcon className="w-3 h-3 animate-spin" />
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </motion.div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}) {
  const getVisiblePages = () => {
    const pages = [];
    const showPages = 5;

    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pt-8"
    >
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Previous
        </button>

        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === page
              ? 'bg-blue-600 text-white shadow-lg transform scale-105'
              : 'border border-gray-300 hover:bg-gray-50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          Next
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
