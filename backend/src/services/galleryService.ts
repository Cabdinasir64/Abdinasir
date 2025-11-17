import prisma from "../prisma/prismaClient";

export interface GalleryInput {
    userId: string;
    image: string;
    title: { en: string; ar: string; so: string };
    description?: { en: string; ar: string; so: string };
    categories: ("PROJECT" | "PORTFOLIO" | "EVENT" | "OTHER" | "WEB_DESIGN" | "MOBILE_APP" | "UI_UX" | "BRANDING" | "PHOTOGRAPHY");
    link?: string;
}

export const createGallery = async (data: GalleryInput) => {
    return prisma.gallery.create({ data });
};

export const getAllGalleries = async () => {
    return prisma.gallery.findMany();
};

export const getGalleryById = async (id: string) => {
    return prisma.gallery.findUnique({ where: { id } });
};

export const updateGallery = async (id: string, data: Partial<GalleryInput>) => {
    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing) return null;

    return prisma.gallery.update({ where: { id }, data });
};

export const deleteGallery = async (id: string) => {
    const existing = await prisma.gallery.findUnique({ where: { id } });

    if (!existing) return null;

    return prisma.gallery.delete({ where: { id } });
};
