"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trash2, Edit, Star } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface Skill {
    id: string;
    name: string;
    level: string;
    skillImage?: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    initialSkills: Skill[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SkillListClient({ initialSkills }: Props) {
    const { data, error, mutate } = useSWR<{ skills: Skill[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/skills`,
        fetcher,
        {
            refreshInterval: 5000,
            fallbackData: { skills: initialSkills },
        }
    );

    const [localSkills, setLocalSkills] = useState<Skill[]>(initialSkills);

    useEffect(() => {
        if (data?.skills) setLocalSkills(data.skills);
    }, [data]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this skill? This action cannot be undone.")) {
            return;
        }

        try {
            setLocalSkills(prev => prev.filter(s => s.id !== id));
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete skill");

            toast.success("Skill deleted successfully");
            mutate();
        } catch (err: any) {
            toast.error(err.message || "An error occurred while deleting the skill");
            mutate();
        }
    };

    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case "basic":
                return "bg-green-100 text-green-800 border-green-200";
            case "intermediate":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "advanced":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "expert":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getLevelStars = (level: string) => {
        switch (level.toLowerCase()) {
            case "basic":
                return 1;
            case "intermediate":
                return 2;
            case "advanced":
                return 3;
            case "expert":
                return 4;
            default:
                return 1;
        }
    };

    if (error) return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">An error occurred while fetching skills</p>
            <button
                onClick={() => mutate()}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
                Try again
            </button>
        </div>
    );

    if (!data) return (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

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
                            <p className="text-sm font-medium text-gray-600">Total Skills</p>
                            <p className="text-2xl font-bold text-gray-900">{localSkills.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Star className="w-6 h-6 text-blue-600" />
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
                            <p className="text-sm font-medium text-gray-600">Basic Level</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {localSkills.filter(s => s.level.toLowerCase() === 'basic').length}
                            </p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <Star className="w-6 h-6 text-red-600" />
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
                            <p className="text-sm font-medium text-gray-600">Advanced</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {localSkills.filter(s => s.level.toLowerCase() === 'advanced').length}
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <Star className="w-6 h-6 text-orange-600" />
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
                            <p className="text-sm font-medium text-gray-600">Intermediate</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {localSkills.filter(s => s.level.toLowerCase() === 'intermediate').length}
                            </p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Star className="w-6 h-6 text-yellow-600" />
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
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                            Skills Management
                        </h2>
                        <Link
                            href="/admin/skills/add"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 font-medium"
                        >
                            <Edit className="w-4 h-4" />
                            Add New Skill
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Skill
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                    Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <AnimatePresence>
                                {localSkills.map((skill, index) => (
                                    <motion.tr
                                        key={skill.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ backgroundColor: "#f8fafc" }}
                                        className="transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {skill.skillImage ? (
                                                    <Image
                                                        src={skill.skillImage}
                                                        alt={skill.name}
                                                        className="w-8 h-8 rounded-full object-cover mr-3"
                                                        width={32}
                                                        height={32}
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                                        {skill.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {skill.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 sm:hidden">
                                                        {skill.level}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(skill.level)}`}>
                                                    {skill.level}
                                                </span>
                                                <div className="flex">
                                                    {[...Array(4)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < getLevelStars(skill.level)
                                                                ? "text-yellow-400 fill-current"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/skills/add?edit=${skill.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    <span className="hidden sm:inline">Edit</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(skill.id)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {localSkills.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No skills found
                        </h3>
                        <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                            You haven't added any skills yet. Start by adding your first skill to showcase your expertise.
                        </p>
                        <Link
                            href="/admin/skills/add"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Add Your First Skill
                        </Link>
                    </motion.div>
                )}

                {localSkills.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-medium">{localSkills.length}</span> skills
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}