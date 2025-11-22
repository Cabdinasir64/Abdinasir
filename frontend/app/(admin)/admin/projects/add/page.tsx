import ProjectForm from '../../../../../components/admin/projects/add/ProjectForm';
import { Project } from '@/types';
import { Suspense } from 'react';

interface PageProps {
  searchParams: {
    edit?: string;
  };
}

export const metadata = {
  title: 'Add New Project or Edit - My Portfolio',
  description: 'Create a new project or edit',
};

async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`);

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}


export default async function AddProjectPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const editId = params.edit;

  const initialData = editId ? await getProject(editId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-blue-50/30 p-4 md:p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectForm
          initialData={initialData}
          isEditing={!!editId && !!initialData}
        />
      </Suspense>
    </div>
  );
}