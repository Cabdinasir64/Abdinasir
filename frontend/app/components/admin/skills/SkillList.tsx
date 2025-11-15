"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

interface Skill {
    id: string;
    name: string;
    level: string;
    skillImage?: string;
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
        try {
            setLocalSkills(prev => prev.filter(s => s.id !== id)); 
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete skill");
            toast.success("Skill deleted successfully!");
            mutate();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete skill");
            mutate(); 
        }
    };

    if (error) return <p className="text-red-500">Error loading skills</p>;
    if (!data) return <p>Loading...</p>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Level</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {localSkills.map(skill => (
                        <motion.tr
                            key={skill.id}
                            whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                            className="transition-colors duration-200"
                        >
                            <td className="px-4 py-2">{skill.name}</td>
                            <td className="px-4 py-2">{skill.level}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <Link
                                    href={`/admin/skills/add?edit=${skill.id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors duration-200"
                                >
                                    <Edit className="w-4 h-4" /> Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(skill.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors duration-200"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
