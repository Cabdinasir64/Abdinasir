"use client";
import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useVisitorId } from "@/hooks/useVisitorId";
import { successToast, errorToast, warningToast } from "@/components/ui/Toaster";
import ProjectDetailsSkeleton from "@/components/projects/ProjectDetailsSkeleton";
import ProjectGallery from "@/components/projects/ProjectGallery";
import ProjectSidebar from "@/components/projects/ProjectSidebar";
import { Project } from "@/types/project";

interface ProjectDetails extends Project {
    userStatus: {
        hasLiked: boolean;
        hasRated: boolean;
        userRating: number;
    };
}

export default function ProjectDetailsPage() {
    const { name } = useParams();
    const visitorId = useVisitorId();

    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!visitorId || !name) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/projects/name/${name}?visitorId=${visitorId}`);
                if (!res.ok) throw new Error("Project not found");
                const data: ProjectDetails = await res.json();

                setProject(data);
                
                fetch(`${baseUrl}/api/projects/${data.id}/view`, { method: 'POST' }).catch(() => {});

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [name, visitorId, baseUrl]);

    const handleLike = useCallback(async () => {
        if (!project || !visitorId) return;

        const previousProject = { ...project };
        const isLiking = !project.userStatus.hasLiked;

        setProject(prev => {
            if (!prev) return null;
            return {
                ...prev,
                likes: isLiking ? prev.likes + 1 : prev.likes - 1,
                userStatus: { ...prev.userStatus, hasLiked: isLiking }
            };
        });

        if (isLiking) successToast("Liked!");
        else warningToast("Unliked.");

        try {
            const res = await fetch(`${baseUrl}/api/projects/${project.id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitorId })
            });

            if (!res.ok) throw new Error("Failed");

        } catch (err) {
            setProject(previousProject);
            errorToast("Connection error, action reverted");
        }
    }, [project, visitorId, baseUrl]);

    const handleRateUpdate = useCallback((newRating: number) => {
        setProject(prev => prev ? {
            ...prev,
            rating: newRating,
            userStatus: { ...prev.userStatus, hasRated: true }
        } : null);
    }, []);

    if (loading) return <ProjectDetailsSkeleton />;
    if (!project) return <div className="h-screen flex items-center justify-center text-lg font-medium text-surface-600">Project Not Found</div>;

    return (
        <main className="min-h-screen bg-surface-50 dark:bg-surface-900 pb-20 pt-24">

            <ProjectHero project={project} onLike={handleLike} />

            <div className="container mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-16">
                    <ProjectDescription description={project.description} />
                    <ProjectGallery images={project.images} mainImage={project.mainImage} />
                </div>

                <ProjectSidebar
                    project={project}
                    visitorId={visitorId}
                    onRateUpdate={handleRateUpdate}
                />
            </div>
        </main>
    );
}

const ProjectHero = memo(({ project, onLike }: { project: ProjectDetails, onLike: () => void }) => {
    const displayRating = (project.rating || 0).toFixed(1);

    return (
        <div className="container mx-auto px-4 md:px-8 mb-8">
            <div className="relative h-[60vh] md:h-[70vh] w-full bg-surface-900 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                <Image
                    src={project.mainImage}
                    alt={project.name}
                    fill
                    className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-primary-600/90 backdrop-blur text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/10">
                                {project.categories[0]?.replace('_', ' ') || "Project"}
                            </span>
                            {project.userStatus.hasRated && (
                                <span className="px-3 py-1.5 bg-yellow-500/90 text-white text-xs font-bold rounded-full">
                                    You Rated This
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg max-w-4xl leading-tight">
                            {project.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/95 font-medium text-sm md:text-base">
                            <div className="flex items-center gap-2 bg-black/30 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-black/40 transition-colors">
                                <span className="text-lg">👁️</span> 
                                <span>{project.viewCount} Views</span>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-black/30 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-black/40 transition-colors">
                                <span className="text-lg">⭐</span> 
                                <span>{displayRating} Rating</span>
                            </div>

                            <button
                                onClick={onLike}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all border shadow-lg hover:scale-105 active:scale-95 group ${
                                    project.userStatus.hasLiked
                                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                                    : 'bg-white text-surface-900 border-white hover:bg-gray-100'
                                }`}
                            >
                                <svg 
                                    className={`w-5 h-5 transition-transform group-hover:animate-pulse ${project.userStatus.hasLiked ? 'fill-current' : 'fill-red-500'}`} 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="font-bold">{project.likes}</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
});
ProjectHero.displayName = "ProjectHero";

const ProjectDescription = memo(({ description }: { description: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-surface-900 p-8 md:p-10 rounded-[2rem] border border-surface-200 dark:border-surface-800 shadow-sm"
        >
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-6 border-b border-surface-100 dark:border-surface-800 pb-4">
                Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none text-surface-600 dark:text-surface-400 leading-relaxed text-lg whitespace-pre-line">
                {description}
            </div>
        </motion.div>
    );
});
ProjectDescription.displayName = "ProjectDescription";