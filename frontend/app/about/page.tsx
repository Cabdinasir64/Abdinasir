import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/about/AboutHero'));
const AboutStory = dynamic(() => import('@/components/about/AboutStory'));
const WorkFlow = dynamic(() => import('@/components/about/workflow/Workflow'));
const AboutCta = dynamic(() => import('@/components/about/AboutCta'));

export const metadata = {
    title: 'About Abdinasir - Full Stack Developer & Web Engineer from Somalia',
    description: 'Learn more about Abdinasir, a passionate software developer. Explore his portfolio, projects, and skills at Abdinasir.dev.',
    authors: [{ name: 'Abdinasir', url: 'https://abdinasir.dev' }],
    keywords: ['Abdinasir', 'portfolio', 'software developer', 'web developer', 'projects', 'About Abdinasir'],
    openGraph: {
        title: 'About Abdinasir - Abdinasir.dev',
        description: 'Discover the journey and portfolio of Abdinasir, a passionate software developer.',
        url: 'https://abdinasir.dev/about',
        siteName: 'Abdinasir.dev',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'About Abdinasir',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Abdinasir - Abdinasir.dev',
        description: 'Discover the journey and portfolio of Abdinasir, a passionate software developer.',
        site: '@Abdinasir',
        images: ['/og-image.png'],
    },
};

const About = () => {
    return (
        <Suspense fallback={null}>
            <Hero />
            <AboutStory />
            <WorkFlow />
            <AboutCta />
        </Suspense>
    );
};

export default About;
