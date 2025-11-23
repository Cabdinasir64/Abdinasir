"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import useSWR from "swr";
import {
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Tag,
  Code,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Project, ProjectCategory } from "@/types";

interface ProjectFormProps {
  initialData?: Project | null;
  isEditing: boolean;
}

interface Skill {
  id: string;
  userId: string;
  name: string;
  level: string;
  category: string[];
  skillImage: string;
  createdAt: string;
  updatedAt: string;
}

interface SkillsResponse {
  skills: Skill[];
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

const PROJECT_CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: ProjectCategory.PORTFOLIO, label: "Portfolio" },
  { value: ProjectCategory.WEB_DESIGN, label: "Web Design" },
  { value: ProjectCategory.MOBILE_APP, label: "Mobile App" },
  { value: ProjectCategory.UI_UX, label: "UI/UX" },
  { value: ProjectCategory.MACHINE_LEARNING, label: "Machine Learning" },
  { value: ProjectCategory.OTHER, label: "Other" },
];

export default function ProjectForm({ initialData, isEditing }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");

  const [categories, setCategories] = useState<ProjectCategory[]>(
    initialData?.categories as ProjectCategory[] || []
  );
  const [tech, setTech] = useState<string[]>(initialData?.tech || []);

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    initialData?.mainImage || null
  );

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    initialData?.images || []
  );

  const [techInput, setTechInput] = useState("");
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const { data: skillsData, error: skillsError } = useSWR<SkillsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/skills`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const skillsSuggestions = skillsData?.skills?.map(skill => skill.name) || [];

  const filteredTechSuggestions = skillsSuggestions.filter(skill =>
    skill.toLowerCase().includes(techInput.toLowerCase()) &&
    !tech.includes(skill)
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = "Project name is required";
    if (!description.trim()) errors.description = "Description is required";
    if (categories.length === 0) errors.categories = "At least one category is required";
    if (tech.length === 0) errors.tech = "At least one technology is required";
    if (!isEditing && !mainImageFile && !mainImagePreview) {
      errors.mainImage = "Main image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
      setFormErrors(prev => ({ ...prev, mainImage: "" }));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => file.size <= 5 * 1024 * 1024);
      setGalleryFiles(prev => [...prev, ...files]);

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview(null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  const toggleCategory = (category: ProjectCategory) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setFormErrors(prev => ({ ...prev, categories: "" }));
  };

  const addTech = (techName?: string) => {
    const techToAdd = (techName || techInput).trim();
    if (techToAdd && !tech.includes(techToAdd)) {
      setTech(prev => [...prev, techToAdd]);
      setTechInput("");
      setShowTechSuggestions(false);
      setFormErrors(prev => ({ ...prev, tech: "" }));
    }
  };

  const removeTech = (techToRemove: string) => {
    setTech(prev => prev.filter(t => t !== techToRemove));
  };

  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTech();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    const submitToast = toast.loading(isEditing ? "Updating project..." : "Creating project...");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      if (link) formData.append("link", link.trim());
      formData.append("status", status);
      formData.append("categories", JSON.stringify(categories));
      formData.append("tech", JSON.stringify(tech));

      if (mainImageFile) {
        formData.append("mainImage", mainImageFile);
      } else if (isEditing && mainImagePreview && !mainImageFile) {
        formData.append("mainImage", mainImagePreview);
      }

      galleryFiles.forEach(file => {
        formData.append("images", file);
      });

      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${initialData?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/projects`;

      const method = isEditing ? "PUT" : "POST";

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(isEditing ? "Project updated successfully!" : "Project created successfully!", {
        id: submitToast,
        duration: 4000
      });

      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 1500);

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "An error occurred", { id: submitToast });
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Project" : "Create New Project"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing
                  ? `Update "${initialData?.name}" details`
                  : "Add a new project to your portfolio"
                }
              </p>
            </div>
          </div>
          {isEditing && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              Editing Mode
            </span>
          )}
        </div>
      </motion.div>

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-8"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <label className="block text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ImageIcon size={20} />
            Main Cover Image {!isEditing && <span className="text-red-500">*</span>}
          </label>

          <div className="relative">
            <div
              onClick={() => mainImageInputRef.current?.click()}
              className={`relative h-64 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group
                ${mainImagePreview ? 'border-blue-400 bg-gray-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
                ${formErrors.mainImage ? 'border-red-400 bg-red-50' : ''}`}
            >
              {mainImagePreview ? (
                <>
                  <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Upload size={32} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 font-medium">Click to upload cover image</p>
                  <p className="text-xs text-gray-400 mt-1">Recommended: 16:9 ratio, max 5MB</p>
                </div>
              )}
            </div>

            {mainImagePreview && (
              <button
                type="button"
                onClick={removeMainImage}
                className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}

            <input
              type="file"
              accept="image/*"
              ref={mainImageInputRef}
              onChange={handleMainImageChange}
              className="hidden"
            />
          </div>

          {formErrors.mainImage && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {formErrors.mainImage}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag size={16} />
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormErrors(prev => ({ ...prev, name: "" }));
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all
                ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. Portfolio Website"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {formErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <LinkIcon size={16} />
              Project Link
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="https://example.com"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setFormErrors(prev => ({ ...prev, description: "" }));
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none
              ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Describe your project details, features, and accomplishments..."
          />
          {formErrors.description && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {formErrors.description}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Categories <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {PROJECT_CATEGORIES.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => toggleCategory(category.value)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2
                  ${categories.includes(category.value)
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
              >
                {category.label}
                {categories.includes(category.value) && <CheckCircle size={14} />}
              </button>
            ))}
          </div>
          {formErrors.categories && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {formErrors.categories}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Code size={16} />
            Technologies <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <div className="flex gap-3">
              <input
                type="text"
                value={techInput}
                onChange={(e) => {
                  setTechInput(e.target.value);
                  setShowTechSuggestions(true);
                }}
                onKeyPress={handleTechKeyPress}
                onFocus={() => setShowTechSuggestions(true)}
                placeholder="Type technology (e.g. React, Node.js)..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => addTech()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <AnimatePresence>
              {showTechSuggestions && filteredTechSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-48 overflow-y-auto"
                >
                  {filteredTechSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => addTech(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-2">
            {tech.map((techItem) => (
              <span
                key={techItem}
                className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
              >
                {techItem}
                <button
                  type="button"
                  onClick={() => removeTech(techItem)}
                  className="hover:text-blue-900 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          {formErrors.tech && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {formErrors.tech}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none transition-all"
            >
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending Review</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Additional Images
            </label>
            <div className="flex flex-wrap gap-4">
              {galleryPreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <div className="h-20 w-20 rounded-lg overflow-hidden border border-gray-200">
                    <img src={src} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Plus size={20} />
                <span className="text-xs mt-1">Add Image</span>
              </button>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={galleryInputRef}
                onChange={handleGalleryChange}
                className="hidden"
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Save size={18} />
            )}
            {isEditing ? "Update Project" : "Create Project"}
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}