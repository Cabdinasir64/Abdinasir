import GalleryListClient from "../../../../components/admin/galleries/GalleryListClient";
import { Suspense } from "react";

export const metadata = {
    title: "Admin | Galleries",
    description: "Manage all your galleries in the admin panel",
};

interface Gallery {
    id: string;
    title: string;
    description: string;
    categories: string;
    image?: string;
    link?: string;
    createdAt?: string;
}

async function fetchGalleries(): Promise<Gallery[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/galleries`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch galleries");
    const data = await res.json();
    return data.gallery;
}

export default async function GalleriesPage() {
    const galleries = await fetchGalleries();

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-gray-600 mt-2">Manage and organize your portfolio galleries</p>
            </div>
            <Suspense fallback={<div>Loading galleries...</div>}>
                <GalleryListClient initialGalleries={galleries} />
            </Suspense>
        </div>
    );
}