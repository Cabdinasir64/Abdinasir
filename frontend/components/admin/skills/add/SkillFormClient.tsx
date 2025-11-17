"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Loader, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";


export default function SkillFormClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("edit");

    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        name_en: "",
        name_so: "",
        name_ar: "",
        level_en: "",
        level_so: "",
        level_ar: "",
        category: [] as string[]
    });

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

                setFormData({
                    name_en: s.name?.en || "",
                    name_so: s.name?.so || "",
                    name_ar: s.name?.ar || "",
                    level_en: s.level?.en || "",
                    level_so: s.level?.so || "",
                    level_ar: s.level?.ar || "",
                    category: s.category || "",
                });

                if (s.skillImage) {
                    setImagePreview(s.skillImage);
                }
            } catch (err) {
                toast.error("Failed to load skill");
            } finally {
                setInitializing(false);
            }
        };

        loadSkill();
    }, [id]);

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview("");

            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image must be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const submitData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                submitData.append(key, JSON.stringify(value));
            } else {
                submitData.append(key, value);
            }
        });


        const imageInput = document.getElementById('skillImage') as HTMLInputElement;
        if (imageInput?.files?.[0]) {
            submitData.append("skillImage", imageInput.files[0]);
        }

        const url = id
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/skills/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/skills`;

        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                body: submitData,
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to save skill");

            toast.success(id ? "Skill updated successfully!" : "Skill created successfully!");

            setTimeout(() => {
                router.push("/admin/skills");
            }, 1000);

        } catch (error: any) {
            toast.error(error.message || "Failed to save skill");
        } finally {
            setLoading(false);
        }
    };

    if (initializing) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading skill...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto sm:px-4 lg:px-8 py-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                                {id ? "Edit Skill" : "Add New Skill"}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {id ? "Update your skill information" : "Add a new skill to your portfolio"}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8"
                >
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Skill Name
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    English Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name_en}
                                    onChange={(e) => handleInputChange("name_en", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., JavaScript"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Somali Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name_so}
                                    onChange={(e) => handleInputChange("name_so", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., JavaScript"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Arabic Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name_ar}
                                    onChange={(e) => handleInputChange("name_ar", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right"
                                    placeholder="مثال: جافاسكريبت"
                                    dir="rtl"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Skill Level
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    English Level <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.level_en}
                                    onChange={(e) => handleInputChange("level_en", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                >
                                    <option value="">Select Level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Somali Level <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.level_so}
                                    onChange={(e) => handleInputChange("level_so", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                >
                                    <option value="">Select Level</option>
                                    <option value="Bilow ah">Bilow ah</option>
                                    <option value="Dhexdhexaad">Dhexdhexaad</option>
                                    <option value="Sare">Sare</option>
                                    <option value="Khabiir">Khabiir</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Arabic Level <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.level_ar}
                                    onChange={(e) => handleInputChange("level_ar", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right"
                                    dir="rtl"
                                    required
                                >
                                    <option value="">اختر المستوى</option>
                                    <option value="مبتدئ">مبتدئ</option>
                                    <option value="متوسط">متوسط</option>
                                    <option value="متقدم">متقدم</option>
                                    <option value="خبير">خبير</option>
                                </select>
                            </div>
                        </div>

                        <select
                            multiple
                            value={formData.category}
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
                                handleInputChange("category", selectedOptions);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="PROGRAMMING">Programming</option>
                            <option value="FRONTEND">Frontend</option>
                            <option value="BACKEND">Backend</option>
                            <option value="FRAMEWORK">Framework</option>
                            <option value="DATABASE">Database</option>
                            <option value="TOOL">Tool</option>
                            <option value="CLOUD">Cloud</option>
                            <option value="OTHER">Other</option>
                        </select>


                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex-1 order-1 sm:order-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {id ? "Update Skill" : "Add Skill"}
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Skill Image
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Image Preview
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 min-h-[200px] flex items-center justify-center">
                                {imagePreview ? (
                                    <div className="space-y-3">
                                        <img
                                            src={imagePreview}
                                            alt="Skill preview"
                                            className="w-24 h-24 object-contain mx-auto rounded-lg"
                                        />
                                        <p className="text-sm text-gray-600">Image preview</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Click to upload skill image
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG, JPEG (Max 2MB)
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Image <span className="text-gray-400">(Optional)</span>
                            </label>
                            <input
                                id="skillImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                            />
                            <p className="text-xs text-gray-500">
                                Supported: PNG, JPG, JPEG. Max size: 2MB
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}