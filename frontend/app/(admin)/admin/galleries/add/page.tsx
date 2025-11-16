import GalleryFormClient from "../../../../components/admin/galleries/add/GalleryFormClient";

export const metadata = {
    title: "Admin | Add/Edit Gallery",
    description: "Add or Edit a gallery in the admin panel",
};

interface Props {
    searchParams: Promise<{ edit?: string }>;
}

export default async function AddEditGalleryPage({ searchParams }: Props) {
    const params = await searchParams;
    const galleryId = params.edit;

    let fetchError: string | null = null;
    let galleryData = null;

    if (galleryId) {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/galleries/${galleryId}`,
                {
                    cache: "no-store",
                }
            );
            const data = await res.json();
            if (res.ok) {
                galleryData = data.gallery;
            } else {
                fetchError = data.message;
            }
        } catch (err: unknown) {
            const error = err as Error;
            fetchError = error.message;
        }
    }

    return (
        <GalleryFormClient gallery={galleryData} fetchError={fetchError} />
    );
}