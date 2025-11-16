import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as galleryService from "../services/galleryService";

const allowedCategories = ["PROJECT", "PORTFOLIO", "EVENT", "OTHER"] as const;
type CategoryType = typeof allowedCategories[number];

export const createGallery = async (req: AuthRequest, res: Response) => {
    try {
        const title = {
            en: req.body.title_en,
            so: req.body.title_so,
            ar: req.body.title_ar
        };

        const description = {
            en: req.body.description_en,
            so: req.body.description_so,
            ar: req.body.description_ar
        };

        const categories = req.body.categories as CategoryType;

        if (!allowedCategories.includes(categories)) {
            return res.status(400).json({ message: "Invalid category value" });
        }

        const image = req.file?.path;
        if (!image) return res.status(400).json({ message: "Image is required" });

        const link = req.body.link as string | undefined;

        const gallery = await galleryService.createGallery({
            userId: req.user.userId,
            image,
            title,
            description,
            categories,
            link,
        });

        res.status(201).json({ message: "Gallery created", gallery });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to create gallery" });
        console.error(error);
    }
};

export const getGalleries = async (req: AuthRequest, res: Response) => {
    try {
        const lang = (req.query.lang as string) || "en";

        const gallery = await galleryService.getAllGalleries();

        const localized = gallery.map(gallery => {
            const titleObj = gallery.title as Record<string, string> | undefined;
            const descriptionObj = gallery.description as Record<string, string> | undefined;

            return {
                ...gallery,
                title: titleObj?.[lang] || titleObj?.["en"],
                description: descriptionObj?.[lang] || descriptionObj?.["en"],
            };
        });

        res.json({ gallery: localized });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch galleries" });
        console.error(error);
    }
};

export const getGallery = async (req: AuthRequest, res: Response) => {
    try {
        const gallery = await galleryService.getGalleryById(req.params.id);

        if (!gallery) return res.status(404).json({ message: "Gallery not found" });

        res.json({ gallery });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch gallery" });
        console.error(error);
    }
};

export const updateGallery = async (req: AuthRequest, res: Response) => {
    try {
        const data: Partial<{
            title: { en: string; ar: string; so: string };
            description: { en: string; ar: string; so: string };
            categories: CategoryType;
            link: string;
            image: string;
        }> = {};

        if (req.body.title_en || req.body.title_ar || req.body.title_so) {
            data.title = {
                en: req.body.title_en,
                ar: req.body.title_ar,
                so: req.body.title_so,
            };
        }

        if (req.body.description_en || req.body.description_ar || req.body.description_so) {
            data.description = {
                en: req.body.description_en,
                ar: req.body.description_ar,
                so: req.body.description_so,
            };
        }

        if (req.body.categories) {
            if (!allowedCategories.includes(req.body.categories)) {
                return res.status(400).json({ message: "Invalid category" });
            }
            data.categories = req.body.categories as CategoryType;
        }

        if (req.body.link) {
            data.link = req.body.link;
        }

        if (req.file?.path) data.image = req.file.path;

        const gallery = await galleryService.updateGallery(req.params.id, data);

        res.json({ message: "Gallery updated", gallery });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to update gallery" });
        console.error(error);
    }
};

export const deleteGallery = async (req: AuthRequest, res: Response) => {
    try {
        await galleryService.deleteGallery(req.params.id);
        res.json({ message: "Gallery deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to delete gallery" });
        console.error(error);
    }
};
