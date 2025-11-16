import { Metadata } from "next";
import { Suspense } from "react";
import TestimonialListClient from '../../../components/admin/testimonials/TestimonialListClient'


export const metadata: Metadata = {
    title: "Testimonials - My Portfolio",
    description: "Admin panel to manage and showcase all client testimonials in your portfolio.",
    keywords: ["portfolio", "admin", "testimonials", "manage testimonials", "client feedback", "reviews"],
    authors: [{ name: "Abdinasir", url: "https://abdinasir.dev" }],
    openGraph: {
        title: "Testimonials - My Portfolio",
        description: "Manage and organize all client testimonials in your portfolio's admin panel.",
        url: "https://abdinasir.dev/admin/testimonials",
        siteName: "Abdinasir Portfolio",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Portfolio Testimonials Admin",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Testimonials - My Portfolio",
        description: "Manage and organize all client testimonials in your portfolio's admin panel.",
        images: ["/og-image.png"],
        creator: "@abdinasir",
    },
};


interface Testimonial {
    id: string;
    name: string;
    position?: string;
    image?: string;
    text: string;
    createdAt?: string;
}

interface FetchResult {
    testimonials: Testimonial[];
    error: string | null;
}

async function fetchTestimonials(): Promise<FetchResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch testimonials");

        const data = await res.json();
        return { testimonials: data.testimonials, error: null };
    } catch (err: any) {
        return { testimonials: [], error: err.message || "Unknown error" };
    }
}

export default async function TestimonialsPage() {
    const { testimonials, error } = await fetchTestimonials();

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Testimonials Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage and organize customer testimonials
                </p>
            </div>

            <Suspense fallback={<p>Loading testimonials...</p>}>
                <TestimonialListClient
                    initialTestimonials={testimonials}
                    fetchError={error}
                />
            </Suspense>
        </div>
    );
}
