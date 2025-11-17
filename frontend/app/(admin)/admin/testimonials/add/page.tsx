import TestimonialFormClient from "../../../../../components/admin/testimonials/add/TestimonialFormClient";
import { Suspense } from "react";

export const metadata = {
    title: "Add/Edit Testimonial - My Portfolio",
    description: "Admin panel to add or edit client testimonials for your portfolio. Manage and showcase customer feedback effectively.",
    keywords: ["portfolio", "admin", "testimonials", "clients", "user feedback", "manage testimonials"],
    authors: [{ name: "Abdinasir", url: "https://abdinasir.dev" }],
    openGraph: {
        title: "Add/Edit Testimonial - My Portfolio",
        description: "Add or edit client testimonials in your admin panel and showcase user feedback in your portfolio.",
        url: "https://abdinasir.dev/admin/testimonials/add",
        siteName: "Abdinasir Portfolio",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Add/Edit Testimonial",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Add/Edit Testimonial - My Portfolio",
        description: "Admin panel to manage client testimonials for your portfolio.",
        images: ["/og-image.png"],
        creator: "@yourhandle",
    },
};


interface Props {
    searchParams: Promise<{ edit?: string }>;
}

export default async function AddEditTestimonialPage({ searchParams }: Props) {
    const params = await searchParams;
    const testimonialId = params.edit;

    let testimonialData = null;
    let FetchError: string | null = null

    if (testimonialId) {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${testimonialId}`,
                {
                    cache: "no-store",
                }
            );

            const data = await res.json();
            if (res.ok) {
                testimonialData = data.testimonial;
                FetchError = data.message
            } else {
                FetchError = data.message || "Failed to fetch testimonial"
            }
        } catch (err: unknown) {
            FetchError = (err as Error).message;
        }
    }

    return (
        <div className="p-4 sm:p-6">
            <Suspense fallback={<p>Loading testimonial form...</p>}>
                <TestimonialFormClient testimonial={testimonialData} FetchErrors={FetchError} />
            </Suspense>
        </div>
    );
}