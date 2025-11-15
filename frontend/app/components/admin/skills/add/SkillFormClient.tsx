"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface Skill {
    id?: string;
    name_en?: string;
    name_so?: string;
    name_ar?: string;
    level_en?: string;
    level_so?: string;
    level_ar?: string;
    skillImage?: string;
}

export default function SkillFormClient() {
    const searchParams = useSearchParams();
    const id = searchParams.get("edit");

    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);

    const [name_en, setNameEn] = useState("");
    const [name_so, setNameSo] = useState("");
    const [name_ar, setNameAr] = useState("");

    const [level_en, setLevelEn] = useState("");
    const [level_so, setLevelSo] = useState("");
    const [level_ar, setLevelAr] = useState("");

    const [skillImage, setSkillImage] = useState<File | null>(null);

    useEffect(() => {
        const loadSkill = async () => {
            if (!id) {
                setInitializing(false);
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/skills/${id}`,
                    { credentials: "include" }
                );

                if (!res.ok) throw new Error("Failed to load skill");

                const data = await res.json();
                const s = data.skill;

                setNameEn(s.name?.en || "");
                setNameSo(s.name?.so || "");
                setNameAr(s.name?.ar || "");

                setLevelEn(s.level?.en || "");
                setLevelSo(s.level?.so || "");
                setLevelAr(s.level?.ar || "");
            } catch (err) {
                toast.error("Cannot load skill");
            } finally {
                setInitializing(false);
            }
        };

        loadSkill();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name_en", name_en);
        formData.append("name_so", name_so);
        formData.append("name_ar", name_ar);

        formData.append("level_en", level_en);
        formData.append("level_so", level_so);
        formData.append("level_ar", level_ar);

        if (skillImage) formData.append("skillImage", skillImage);

        const url = id
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/skills/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/skills`;

        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                body: formData,
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to save skill");

            toast.success(id ? "Skill updated!" : "Skill created!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (initializing) return <p>Loading skill...</p>;

    return (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block">Name (EN)</label>
                    <input
                        type="text"
                        value={name_en}
                        onChange={(e) => setNameEn(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block">Name (SO)</label>
                    <input
                        type="text"
                        value={name_so}
                        onChange={(e) => setNameSo(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block">Name (AR)</label>
                    <input
                        type="text"
                        value={name_ar}
                        onChange={(e) => setNameAr(e.target.value)}
                        className="border px-3 py-2 rounded w-full text-right"
                        dir="rtl"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block">Level (EN)</label>
                    <input
                        type="text"
                        value={level_en}
                        onChange={(e) => setLevelEn(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block">Level (SO)</label>
                    <input
                        type="text"
                        value={level_so}
                        onChange={(e) => setLevelSo(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block">Level (AR)</label>
                    <input
                        type="text"
                        value={level_ar}
                        onChange={(e) => setLevelAr(e.target.value)}
                        className="border px-3 py-2 rounded w-full text-right"
                        dir="rtl"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block mb-1">Skill Image</label>
                <input
                    type="file"
                    onChange={(e) => setSkillImage(e.target.files?.[0] || null)}
                    className="w-full"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {loading ? "Saving..." : id ? "Update Skill" : "Add Skill"}
            </button>
        </form>
    );
}
