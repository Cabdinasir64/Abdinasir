"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Trash2, Edit, Plus, Image as ImageIcon, Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";

interface Gallery {
  id: string;
  title: string;
  description: string;
  categories: string;
  image?: string;
  link?: string;
  createdAt?: string;
}

interface Props {
  initialGalleries: Gallery[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function GalleryListClient({ initialGalleries }: Props) {
  const { data, error, mutate } = useSWR<{ gallery: Gallery[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/galleries`,
    fetcher,
    {
      refreshInterval: 3000,
      fallbackData: { gallery: initialGalleries },
    }
  );

  const [localGalleries, setLocalGalleries] = useState(initialGalleries);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.gallery) {
      setLocalGalleries(data.gallery);
    }
  }, [data]);

  useEffect(() => {
    if(error){
      toast.error("dd")
    }
  }, [error])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery? This action cannot be undone.")) return;

    setDeletingId(id);
    const originalGalleries = localGalleries;

    setLocalGalleries(prev => prev.filter(g => g.id !== id));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/galleries/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete gallery");

      toast.success("Gallery deleted successfully!");
      mutate();
    } catch (err: unknown) {
      const error = err as Error;
      setLocalGalleries(originalGalleries);
      toast.error(error.message || "Failed to delete gallery");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'project': 'bg-blue-100 text-blue-800 border-blue-200',
      'portfolio': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'event': 'bg-red-100 text-red-800 border-red-200',
      'other': 'bg-gray-100 text-gray-800 border-gray-200',
      'web_design': 'bg-purple-100 text-purple-800 border-purple-200',
      'mobile_app': 'bg-green-100 text-green-800 border-green-200',
      'ui_ux': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'branding': 'bg-orange-100 text-orange-800 border-orange-200',
      'photography': 'bg-pink-100 text-pink-800 border-pink-200',
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const normalizedCategory = category.toLowerCase().replace(' ', '_');
    const key = normalizedCategory as keyof typeof colors;

    return colors[key] || colors.default;
  };

  const getCategoryDisplayName = (category: string) => {
    const displayNames: { [key: string]: string } = {
      'project': 'Project',
      'portfolio': 'Portfolio',
      'event': 'Event',
      'other': 'Other',
      'web_design': 'Web Design',
      'mobile_app': 'Mobile App',
      'ui_ux': 'UI/UX',
      'branding': 'Branding',
      'photography': 'Photography'
    };

    const normalizedCategory = category.toLowerCase().replace(' ', '_');
    return displayNames[normalizedCategory] || category;
  };

  const getCategoryCount = (category: string) => {
    return localGalleries.filter(g =>
      g.categories.toLowerCase().replace(' ', '_') === category.toLowerCase()
    ).length;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 font-medium mb-3">Failed to load galleries</div>
        <button
          onClick={() => mutate()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Galleries</p>
              <p className="text-2xl font-bold text-gray-900">{localGalleries.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {getCategoryCount('project')}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Web Design</p>
              <p className="text-2xl font-bold text-gray-900">
                {getCategoryCount('web_design')}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mobile Apps</p>
              <p className="text-2xl font-bold text-gray-900">
                {getCategoryCount('mobile_app')}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Galleries</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your portfolio galleries and projects
              </p>
            </div>
            <Link
              href="/admin/galleries/add"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add New Gallery
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gallery
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Created
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {localGalleries.map((gallery, index) => (
                  <motion.tr
                    key={gallery.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "#f8fafc" }}
                    className="transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {gallery.image ? (
                          <Image
                            src={gallery.image}
                            alt={gallery.title}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {gallery.title}
                          </p>
                          <p className="text-xs text-gray-500 sm:hidden">
                            {getCategoryDisplayName(gallery.categories)}
                          </p>
                          {gallery.link && (
                            <a
                              href={gallery.link}
                              target="_self"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Project
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(gallery.categories)}`}>
                        {getCategoryDisplayName(gallery.categories)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(gallery.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/galleries/add?edit=${gallery.id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(gallery.id)}
                          disabled={deletingId === gallery.id}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">
                            {deletingId === gallery.id ? 'Deleting...' : 'Delete'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {localGalleries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No galleries found
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm mx-auto">
              You haven't created any galleries yet. Start by adding your first gallery to showcase your work.
            </p>
            <Link
              href="/admin/galleries/add"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Gallery
            </Link>
          </motion.div>
        )}

        {localGalleries.length > 0 && (
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{localGalleries.length}</span> galleries
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}