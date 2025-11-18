import prisma from "../prisma/prismaClient";
import mongoose from 'mongoose';

export interface GalleryInput {
    userId: string;
    image: string;
    title: { en: string; ar: string; so: string };
    description?: { en: string; ar: string; so: string };
    categories: ("PROJECT" | "PORTFOLIO" | "EVENT" | "OTHER" | "WEB_DESIGN" | "MOBILE_APP" | "UI_UX" | "BRANDING" | "PHOTOGRAPHY");
    link?: string;
}

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

export const createGallery = async (data: GalleryInput) => {
    if (!data.userId || !isValidObjectId(data.userId)) {
        throw new Error("Invalid or missing userId.");
    }
    if (!data.image) {
        throw new Error("Image path is required.");
    }
    if (Object.values(data.title).every(t => !t)) { 
        throw new Error("Title is required.");
    }
    if (!data.categories) {
        throw new Error("Category is required.");
    }

  

    return prisma.gallery.create({ data });
};

export const getAllGalleries = async () => {
    return prisma.gallery.findMany();
};

export const getGalleryById = async (id: string) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Gallery ID format."); 
    }
    const existing = await prisma.gallery.findUnique({ where: { id } });
    return existing;
};


export const updateGallery = async (id: string, data: Partial<GalleryInput>) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Gallery ID format."); 
    }

    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Gallery not found."); 
    }

    if (data.title) {
        if (Object.values(data.title).every(t => !t || t.trim().length === 0)) {
            throw new Error("Title cannot be empty in all languages if provided.");
        }
    }

    return prisma.gallery.update({ where: { id }, data });
};

export const deleteGallery = async (id: string) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Gallery ID format."); 
    }

    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Gallery not found."); 
    }

    return prisma.gallery.delete({ where: { id } });
};