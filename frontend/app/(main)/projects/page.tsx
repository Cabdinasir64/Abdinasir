import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects – Full Stack Developer & Web Engineer from Somalia",
    description:
        "Explore a collection of modern, scalable, and production-ready projects developed by Abdinasir — Web Applications, Full-Stack Systems, UI/UX Solutions, and Cloud-Optimized Services.",
    keywords: [
        "Abdinasir",
        "Portfolio Projects",
        "Web Developer",
        "Full Stack Developer",
        "Next.js Projects",
        "Frontend Developer",
        "Backend Developer",
        "Somali Developer",
    ],
    alternates: {
        canonical: "https://abdinasir.dev/projects",
    },
    openGraph: {
        title: "Projects – Abdinasir | Portfolio",
        description:
            "A showcase of real-world applications, frontend builds, backend systems, and modern digital products developed by Abdinasir.",
        url: "https://abdinasir.dev/projects",
        siteName: "Abdinasir Portfolio",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Abdinasir – Portfolio Projects",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Projects – Abdinasir | Portfolio",
        description:
            "Browse high-quality and scalable web projects developed by Abdinasir.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const Hero = dynamic(() => import("@/components/projects/ProjectsHero"));
const ProjectList = dynamic(() => import("@/components/projects/ProjectsList"));

export default function Projects() {
    return (
        <>
            <Suspense>
                <Hero />
            </Suspense>

            <Suspense>
                <ProjectList />
            </Suspense>
        </>
    );
}
