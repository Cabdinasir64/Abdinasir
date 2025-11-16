"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Loader, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface Gallery {
  id?: string;
  title?: {
    en?: string;
    so?: string;
    ar?: string;
  };
  description?: {
    en?: string;
    so?: string;
    ar?: string;
  };
  categories?: string;
  link?: string;
  image?: string;
}

interface Props {
  gallery?: Gallery | null;
  fetchError?: string | null;
}


const allowedCategories = ["PROJECT", "PORTFOLIO", "EVENT", "OTHER", "WEB_DESIGN", "MOBILE_APP", "UI_UX", "BRANDING", "PHOTOGRAPHY"];

const getCategoryDisplayName = (category: string) => {
  const displayNames: { [key: string]: string } = {
    'PROJECT': 'Project',
    'PORTFOLIO': 'Portfolio',
    'EVENT': 'Event',
    'OTHER': 'Other',
    'WEB_DESIGN': 'Web Design',
    'MOBILE_APP': 'Mobile App',
    'UI_UX': 'UI/UX',
    'BRANDING': 'Branding',
    'PHOTOGRAPHY': 'Photography'
  };
  return displayNames[category] || category;
};

export default function GalleryFormClient({ gallery, fetchError }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(!!editId);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    title_en: "",
    title_so: "",
    title_ar: "",
    description_en: "",
    description_so: "",
    description_ar: "",
    categories: allowedCategories[0],
    link: ""
  });

  useEffect(() => {
    if (fetchError) toast.error(fetchError);
  }, [fetchError]);

  useEffect(() => {

    if (gallery) {
      setFormData({
        title_en: gallery.title?.en || "",
        title_so: gallery.title?.so || "",
        title_ar: gallery.title?.ar || "",
        description_en: gallery.description?.en || "",
        description_so: gallery.description?.so || "",
        description_ar: gallery.description?.ar || "",
        categories: gallery.categories || allowedCategories[0],
        link: gallery.link || ""
      });



      if (gallery.image) {
        setImagePreview(gallery.image);
      }
    }
    setInitializing(false);
  }, [gallery]);

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


    const formDataToSend = new FormData();

    formDataToSend.append("title_en", formData.title_en);
    formDataToSend.append("title_so", formData.title_so);
    formDataToSend.append("title_ar", formData.title_ar);
    formDataToSend.append("description_en", formData.description_en);
    formDataToSend.append("description_so", formData.description_so);
    formDataToSend.append("description_ar", formData.description_ar);
    formDataToSend.append("categories", formData.categories);

    if (formData.link) {
      formDataToSend.append("link", formData.link);
    }

    const imageInput = document.getElementById('galleryImage') as HTMLInputElement;
    if (imageInput?.files?.[0]) {
      formDataToSend.append("image", imageInput.files[0]);
    }

    const url = editId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/galleries/${editId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/galleries`;
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formDataToSend,
        credentials: "include",
      });

      const responseData = await res.json();

      if (!res.ok) {
        const errorMessage = responseData.error || responseData.message || "Failed to save gallery";
        throw new Error(errorMessage);
      }

      toast.success(editId ? "Gallery updated successfully!" : "Gallery created successfully!");

      setTimeout(() => {
        router.push("/admin/galleries");
        router.refresh();
      }, 1500);

    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing && editId) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery data...</p>
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
              {editId ? "Edit Gallery" : "Add New Gallery"}
            </h1>
            <p className="text-gray-600 mt-1">
              {editId ? "Update your gallery information" : "Create a new gallery for your portfolio"}
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
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Gallery Title
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  English Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => handleInputChange("title_en", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                  placeholder="e.g., E-commerce Website"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Somali Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title_so}
                  onChange={(e) => handleInputChange("title_so", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                  placeholder="e.g., Website Ganacsiga Internetka"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Arabic Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title_ar}
                  onChange={(e) => handleInputChange("title_ar", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right outline-none"
                  placeholder="مثال: موقع التجارة الإلكترونية"
                  dir="rtl"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Description
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  English Description
                </label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => handleInputChange("description_en", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none outline-none"
                  placeholder="Describe your project in English..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Somali Description
                </label>
                <textarea
                  value={formData.description_so}
                  onChange={(e) => handleInputChange("description_so", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none outline-none"
                  placeholder="Sharaxaada mashruucaada af Soomaaliga..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Arabic Description
                </label>
                <textarea
                  value={formData.description_ar}
                  onChange={(e) => handleInputChange("description_ar", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right resize-none outline-none"
                  placeholder="...صف مشروعك باللغة العربية"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categories}
                onChange={(e) => handleInputChange("categories", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                required
              >
                {allowedCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryDisplayName(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Link <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => handleInputChange("link", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                  placeholder="https://example.com"
                />
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
                  {editId ? "Update Gallery" : "Create Gallery"}
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
              Gallery Image
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Image Preview
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 min-h-[200px] flex items-center justify-center">
                {imagePreview ? (
                  <div className="space-y-3">
                    <Image
                      src={imagePreview}
                      alt="Gallery preview"
                      className="w-32 h-32 object-cover mx-auto rounded-lg"
                      width={128}
                      height={128}
                    />
                    <p className="text-sm text-gray-600">Image preview</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Click to upload gallery image
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
                id="galleryImage"
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