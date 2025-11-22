import { Suspense } from 'react';
import ProjectList from '../../../../components/admin/projects/ProjectList';
import { ProjectsApiResponse } from '@/types';
import ProjectsLoading from '../../../../components/admin/projects/ProjectsLoading';
import Link from 'next/link';

export const metadata = {
  title: 'Projects Manager - My Portfolio',
  description: 'View, edit, and manage your portfolio projects',
  keywords: 'portfolio, projects, management, admin',
};

async function getProjectsData(): Promise<ProjectsApiResponse | null> {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/projects`;

  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch projects");
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Error fetching projects:");
    return null;
  }
}

export default async function ProjectsPage() {
  const initialData = await getProjectsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Projects Manager
            </h1>
            <p className="text-gray-600 mt-2 text-base max-w-2xl">
              Create, edit, and manage your portfolio projects with ease. Showcase your work to the world.
            </p>
          </div>
          <Link
            href="/admin/projects/add"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Project
          </Link>
        </div>

        <Suspense fallback={<ProjectsLoading />}>
          <ProjectList initialData={initialData} />
        </Suspense>
      </div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}
