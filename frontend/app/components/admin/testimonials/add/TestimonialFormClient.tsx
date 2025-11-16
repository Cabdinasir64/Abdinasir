"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Loader, Image as ImageIcon, User, Briefcase, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Testimonial {
    id?: string;
    name: string;
    position?: string;
    image?: string;
    text: {
        en?: string;
        so?: string;
        ar?: string;
    };
}

interface Props {
    testimonial?: Testimonial | null;
    FetchErrors: string | null
}

export default function TestimonialFormClient({ testimonial, FetchErrors }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');

    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(!!editId);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        name: "",
        position: "",
        text_en: "",
        text_so: "",
        text_ar: ""
    });

    useEffect(() => {
        if (FetchErrors) {
            toast.error(FetchErrors)
        }
    }, [FetchErrors])

    useEffect(() => {
        if (testimonial) {
            setFormData({
                name: testimonial.name || "",
                position: testimonial.position || "",
                text_en: testimonial.text?.en || "",
                text_so: testimonial.text?.so || "",
                text_ar: testimonial.text?.ar || ""
            });

            if (testimonial.image) {
                setImagePreview(testimonial.image);
            }
        }
        setInitializing(false);
    }, [testimonial]);

    const handleInputChange = (field: string, value: string) => {
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
                toast.error("Please select a valid image file (PNG, JPG, JPEG)");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
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

        if (!formData.name.trim()) {
            toast.error("Name is required");
            setLoading(false);
            return;
        }

        if (!formData.text_en.trim() && !formData.text_so.trim() && !formData.text_ar.trim()) {
            toast.error("At least one testimonial text is required");
            setLoading(false);
            return;
        }

        const submitData = new FormData();

        submitData.append("name", formData.name);
        if (formData.position) submitData.append("position", formData.position);
        if (formData.text_en) submitData.append("text_en", formData.text_en);
        if (formData.text_so) submitData.append("text_so", formData.text_so);
        if (formData.text_ar) submitData.append("text_ar", formData.text_ar);

        const imageInput = document.getElementById('testimonialImage') as HTMLInputElement;
        if (imageInput?.files?.[0]) {
            submitData.append("image", imageInput.files[0]);
        }

        const url = editId
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`;
        const method = editId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                body: submitData,
                credentials: "include",
            });

            const responseData = await res.json();

            if (!res.ok) {
                const errorMessage = responseData.error || responseData.message || "Failed to save testimonial";
                throw new Error(errorMessage);
            }

            toast.success(editId ? "Testimonial updated successfully!" : "Testimonial created successfully!");

            setTimeout(() => {
                router.push("/admin/testimonials");
                router.refresh();
            }, 1500);

        } catch (err: any) {
            console.error("Error saving testimonial:", err);
            toast.error(err.message || "Error saving testimonial. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (initializing && editId) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading testimonial data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {editId ? "Edit Testimonial" : "Add New Testimonial"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {editId ? "Update testimonial information" : "Create a new customer testimonial"}
                        </p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter person's name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Position <span className="text-gray-400">(Optional)</span>
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => handleInputChange("position", e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., Senior Developer at Google"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Testimonial Text
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    English Text <span className="text-gray-400">(At least one required)</span>
                                </label>
                                <div className="relative">
                                    <MessageCircle className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                    <textarea
                                        value={formData.text_en}
                                        onChange={(e) => handleInputChange("text_en", e.target.value)}
                                        rows={4}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Enter testimonial in English..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Somali Text <span className="text-gray-400">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <MessageCircle className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                    <textarea
                                        value={formData.text_so}
                                        onChange={(e) => handleInputChange("text_so", e.target.value)}
                                        rows={4}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Enter testimonial in Somali..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Arabic Text <span className="text-gray-400">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <MessageCircle className="absolute right-3 top-3 text-gray-400 w-4 h-4" />
                                    <textarea
                                        value={formData.text_ar}
                                        onChange={(e) => handleInputChange("text_ar", e.target.value)}
                                        rows={4}
                                        className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right resize-none"
                                        placeholder="أدخل الشهادة باللغة العربية..."
                                        dir="rtl"
                                    />
                                </div>
                            </div>
                        </div>
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
                                    {editId ? "Update Testimonial" : "Create Testimonial"}
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
                            Person Image
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
                                            alt="Testimonial preview"
                                            className="w-32 h-32 object-cover rounded-full mx-auto"
                                        />
                                        <p className="text-sm text-gray-600">Image preview</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Click to upload person's image
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG, JPEG (Max 5MB)
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
                                id="testimonialImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                            />
                            <p className="text-xs text-gray-500">
                                Supported: PNG, JPG, JPEG. Max size: 5MB
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}