import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Skills | Full Stack Developer & Web Engineer from Somalia",
    description:
        "Explore the technical skills of Abdinasir — a passionate Computer Science student specializing in web development, software engineering, and modern technologies.",
    keywords: [
        "Abdinasir",
        "Portfolio",
        "Skills",
        "Web Developer",
        "Software Engineer",
        "Computer Science",
        "Next.js Developer",
        "JavaScript",
        "React"
    ],
    authors: [{ name: "Abdinasir", url: "https://abdinasir.dev" }],
    openGraph: {
        title: "Skills | Abdinasir",
        description:
            "A detailed overview of my technical skills and expertise in software development.",
        url: "https://abdinasir.dev/skills",
        siteName: "Abdinasir Portfolio",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Abdinasir Portfolio OG Image"
            }
        ],
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Skills | Abdinasir",
        description:
            "A detailed overview of my technical skills and expertise in software development.",
        images: ["/og-image.png"]
    }
};

const Hero = dynamic(() => import('@/components/skills/SkillsHero'));
const Skill = dynamic(() => import('@/components/skills/SkillsList'));

const Skills = () => {
    return <>
        <Suspense fallback={null}>
            <Hero />
            <Skill />
        </Suspense>
    </>;
};

export default Skills;
