"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Trash2, Edit, Plus, User, Calendar, Quote } from "lucide-react";

interface Testimonial {
    id: string;
    name: string;
    position?: string;
    image?: string;
    text: string,
    createdAt?: string;
}

interface Props {
    initialTestimonials: Testimonial[];
    fetchError: string | null
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TestimonialListClient({ initialTestimonials, fetchError }: Props) {
    const { data, error, mutate } = useSWR<{ testimonials: Testimonial[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`,
        fetcher,
        {
            refreshInterval: 3000,
            fallbackData: { testimonials: initialTestimonials },
        }
    );

    const [localTestimonials, setLocalTestimonials] = useState(initialTestimonials);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (data?.testimonials) {
            setLocalTestimonials(data.testimonials);
        }
    }, [data]);

    useEffect(() => {
        if (fetchError || error) {
            toast.error(fetchError || error || "Failed to fetch testimonials");
        }
    }, [fetchError, error]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) return;

        setDeletingId(id);
        const originalTestimonials = localTestimonials;

        setLocalTestimonials(prev => prev.filter(t => t.id !== id));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete testimonial");

            toast.success("Testimonial deleted successfully!");
            mutate();
        } catch (err: unknown) {
            const error = err as Error
            setLocalTestimonials(originalTestimonials);
            toast.error(error.message || "Failed to delete testimonial");
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

    const getPositionType = (position: string) => {
        if (!position) return 'other';
        const lowerPosition = position.toLowerCase();

        if (lowerPosition.includes('developer') || lowerPosition.includes('engineer') || lowerPosition.includes('programmer')) return 'tech';
        if (lowerPosition.includes('manager') || lowerPosition.includes('director') || lowerPosition.includes('lead')) return 'management';
        if (lowerPosition.includes('designer') || lowerPosition.includes('artist') || lowerPosition.includes('creative')) return 'creative';
        if (lowerPosition.includes('student') || lowerPosition.includes('learner') || lowerPosition.includes('trainee')) return 'student';
        if (lowerPosition.includes('ceo') || lowerPosition.includes('founder') || lowerPosition.includes('owner') || lowerPosition.includes('president')) return 'executive';

        return 'other';
    };

    const getPositionColor = (type: string) => {
        const colors = {
            'tech': 'bg-blue-100 text-blue-800 border-blue-200',
            'management': 'bg-green-100 text-green-800 border-green-200',
            'creative': 'bg-purple-100 text-purple-800 border-purple-200',
            'student': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'executive': 'bg-red-100 text-red-800 border-red-200',
            'other': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[type as keyof typeof colors] || colors.other;
    };

    const getTextPreview = (text: string) => {
        return text || 'No text available';
    };

    const getMobileTextPreview = (text: string) => {
        const preview = getTextPreview(text);
        return preview.length > 50 ? preview.substring(0, 50) + '...' : preview;
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-600 font-medium mb-3">Failed to load testimonials</div>
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
                            <p className="text-sm font-medium text-gray-600">Total Testimonials</p>
                            <p className="text-2xl font-bold text-gray-900">{localTestimonials.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Quote className="w-6 h-6 text-blue-600" />
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
                            <p className="text-sm font-medium text-gray-600">With Images</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {localTestimonials.filter(t => t.image).length}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <User className="w-6 h-6 text-green-600" />
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
                            <p className="text-sm font-medium text-gray-600">With Position</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {localTestimonials.filter(t => t.position && t.position.trim() !== '').length}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <User className="w-6 h-6 text-purple-600" />
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
                            <p className="text-sm font-medium text-gray-600">This Month</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {localTestimonials.filter(t => {
                                    const created = new Date(t.createdAt || '');
                                    const now = new Date();
                                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                                }).length}
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-orange-600" />
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
                            <h2 className="text-lg font-semibold text-gray-900">All Testimonials</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage customer testimonials and reviews
                            </p>
                        </div>
                        <Link
                            href="/admin/testimonials/add"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Testimonial
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Person
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Testimonial
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                    Position
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
                                {localTestimonials.map((testimonial, index) => (
                                    <motion.tr
                                        key={testimonial.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ backgroundColor: "#f8fafc" }}
                                        className="transition-colors duration-150"
                                    >
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {testimonial.image ? (
                                                    <img
                                                        src={testimonial.image}
                                                        alt={testimonial.name}
                                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {testimonial.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 sm:hidden">
                                                        {getMobileTextPreview(testimonial.text)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-normal hidden md:table-cell">
                                            <p className="text-sm text-gray-900 line-clamp-2">
                                                {getTextPreview(testimonial.text)}
                                            </p>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                            {testimonial.position ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPositionColor(getPositionType(testimonial.position))}`}>
                                                    {testimonial.position}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No position</span>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(testimonial.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/testimonials/add?edit=${testimonial.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    <span className="hidden sm:inline">Edit</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(testimonial.id)}
                                                    disabled={deletingId === testimonial.id}
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    <span className="hidden sm:inline">
                                                        {deletingId === testimonial.id ? 'Deleting...' : 'Delete'}
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

                {localTestimonials.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Quote className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No testimonials found
                        </h3>
                        <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                            You haven't added any testimonials yet. Start by adding your first testimonial to showcase customer feedback.
                        </p>
                        <Link
                            href="/admin/testimonials/add"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Testimonial
                        </Link>
                    </motion.div>
                )}

                {localTestimonials.length > 0 && (
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-medium">{localTestimonials.length}</span> testimonials
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}