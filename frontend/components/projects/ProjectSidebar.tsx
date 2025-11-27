"use client";
import { useState, useCallback, memo } from "react";
import { Project } from "@/types/project";
import { successToast, errorToast } from "@/components/ui/Toaster";

interface SidebarProps {
    project: Project & { userStatus: { hasLiked: boolean; hasRated: boolean; userRating: number; } };
    visitorId: string;
    onRateUpdate: (newRating: number) => void;
}

const ProjectSidebar = ({ project, visitorId, onRateUpdate }: SidebarProps) => {
    return (
        <div className="space-y-8 sticky top-24">
            <TechStack tech={project.tech} />
            <ProjectLinks link={project.link} />
            <RatingCard
                projectId={project.id}
                userStatus={project.userStatus}
                visitorId={visitorId}
                onRateUpdate={onRateUpdate}
            />
        </div>
    );
};

const TechStack = memo(({ tech }: { tech: string[] }) => (
    <div className="bg-white dark:bg-surface-900 p-6 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🛠️</span> Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
            {tech.map(t => (
                <span key={t} className="px-3 py-1.5 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-sm font-semibold rounded-lg border border-surface-200 dark:border-surface-700">
                    {t}
                </span>
            ))}
        </div>
    </div>
));
TechStack.displayName = "TechStack";

const ProjectLinks = memo(({ link }: { link?: string }) => (
    <div className="bg-white dark:bg-surface-900 p-6 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🔗</span> Links
        </h3>
        {link ? (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all font-bold shadow-lg hover:shadow-primary-500/30 hover:-translate-y-1"
            >
                Live Demo
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
        ) : (
            <p className="text-surface-500 text-sm italic">No live link available.</p>
        )}
    </div>
));
ProjectLinks.displayName = "ProjectLinks";

interface RatingCardProps {
    projectId: string;
    userStatus: { hasRated: boolean };
    visitorId: string;
    onRateUpdate: (newRating: number) => void;
}

const RatingCard = memo(({ projectId, userStatus, visitorId, onRateUpdate }: RatingCardProps) => {
    const [hoverRating, setHoverRating] = useState(0);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleRate = useCallback(async (rating: number) => {
        if (!visitorId) return;
        try {
            const res = await fetch(`${baseUrl}/api/projects/${projectId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitorId, rating })
            });

            if (!res.ok) throw new Error("Already rated");
            const data = await res.json();
            onRateUpdate(data.newAverage || data.rating);
            successToast("Thank you for rating!");
        } catch (err) {
            errorToast("You have already rated this project.");
        }
    }, [visitorId, projectId, baseUrl, onRateUpdate]);

    return (
        <div className="bg-gradient-to-br from-surface-900 to-black p-8 rounded-3xl text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/20 rounded-full blur-2xl -mr-10 -mt-10" />

            {!userStatus.hasRated ? (
                <>
                    <h3 className="text-lg font-bold mb-2">Rate this Project</h3>
                    <p className="text-sm text-gray-400 mb-6">Your feedback helps me improve!</p>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleRate(star)}
                                className="transition-transform hover:scale-125 focus:outline-none"
                            >
                                <svg
                                    className={`w-8 h-8 transition-colors duration-200 ${star <= hoverRating ? 'text-yellow-400 fill-current' : 'text-gray-600 fill-none stroke-current'}`}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3 text-2xl">🎉</div>
                    <h3 className="text-green-400 font-bold text-lg">Thanks for rating!</h3>
                    <p className="text-white/60 text-sm mt-1">You rated this project.</p>
                </div>
            )}
        </div>
    );
});
RatingCard.displayName = "RatingCard";

export default memo(ProjectSidebar);