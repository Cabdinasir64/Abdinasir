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
        } catch (err) {
            fetchError = "An error occurred while fetching gallery data.";
        }
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {galleryId ? "Edit Gallery" : "Add New Gallery"}
                </h1>
                <p className="text-gray-600 mt-2">
                    {galleryId ? "Update your gallery information" : "Create a new gallery for your portfolio"}
                </p>
            </div>
            <GalleryFormClient gallery={galleryData} fetchError={fetchError} />
        </div>
    );
}