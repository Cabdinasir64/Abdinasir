import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as galleryService from "../services/galleryService";
import { sanitizeInput, isInputEmptyAfterSanitization, isWhitespaceOnly } from '../utils/sanitizer'; 

const allowedCategories = ["PROJECT", "PORTFOLIO", "EVENT", "OTHER", "WEB_DESIGN", "MOBILE_APP", "UI_UX", "BRANDING", "PHOTOGRAPHY"] as const;
type CategoryType = typeof allowedCategories[number];

export const createGallery = async (req: AuthRequest, res: Response) => {
    try {
        const { title_en, title_so, title_ar, description_en, description_so, description_ar, categories, link } = req.body;

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        if (isWhitespaceOnly(title_en || '') && isWhitespaceOnly(title_so || '') && isWhitespaceOnly(title_ar || '')) {
            return res.status(400).json({ message: "title is required." });
        }

        const sanitizedTitle = {
            en: sanitizeInput(title_en || ''),
            so: sanitizeInput(title_so || ''),
            ar: sanitizeInput(title_ar || '')
        };
        const sanitizedDescription = {
            en: sanitizeInput(description_en || ''),
            so: sanitizeInput(description_so || ''),
            ar: sanitizeInput(description_ar || '')
        };
        const sanitizedLink = link ? sanitizeInput(link) : undefined;

        if (isInputEmptyAfterSanitization(title_en || '') || isInputEmptyAfterSanitization(title_so || '') || isInputEmptyAfterSanitization(title_ar || '')) {
            return res.status(400).json({ message: "Invalid characters detected in title. HTML/script tags are not allowed." });
        }
        if (isInputEmptyAfterSanitization(description_en || '') || isInputEmptyAfterSanitization(description_so || '') || isInputEmptyAfterSanitization(description_ar || '')) {
            return res.status(400).json({ message: "Invalid characters detected in description. HTML/script tags are not allowed." });
        }
        if (link && isInputEmptyAfterSanitization(link)) {
            return res.status(400).json({ message: "Invalid characters detected in link. HTML/script tags are not allowed." });
        }

        if (!categories) {
            return res.status(400).json({ message: "Category is required." });
        }
        if (!allowedCategories.includes(categories)) {
            return res.status(400).json({ message: "Invalid category value. Please choose from: " + allowedCategories.join(", ") });
        }

        const image = req.file?.path;
        if (!image) {
            return res.status(400).json({ message: "Image is required." });
        }

        const gallery = await galleryService.createGallery({
            userId: req.user.userId,
            image,
            title: sanitizedTitle,
            description: sanitizedDescription,
            categories,
            link: sanitizedLink,
        });

        res.status(201).json({ message: "Gallery created successfully", gallery });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to create gallery. Please check your input." });
    }
};

export const getGalleries = async (req: AuthRequest, res: Response) => {
    try {
        const allowedLangs = ["en", "so", "ar"];
        let lang = ((req.query.lang as string) || "en").trim().toLowerCase();

        if (!allowedLangs.includes(lang)) {
            return res.status(400).json({
                message: "Language not supported. Supported languages are: " + allowedLangs.join(", "),
                supported: allowedLangs
            });
        }

        const gallery = await galleryService.getAllGalleries();

        const localized = gallery.map(item => {
            const titleObj = item.title as Record<string, string> | undefined;
            const descriptionObj = item.description as Record<string, string> | undefined;

            return {
                ...item,
                title: titleObj?.[lang] || titleObj?.["en"],
                description: descriptionObj?.[lang] || descriptionObj?.["en"],
            };
        });

        res.json({ gallery: localized });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch galleries." });
    }
};

export const getGallery = async (req: AuthRequest, res: Response) => {
    try {
        const gallery = await galleryService.getGalleryById(req.params.id);

        if (!gallery) {
            return res.status(404).json({ message: "Gallery not found." }); 
        }
        res.json({ gallery });
    } catch (error: any) {
        res.status(error.message.includes("Invalid Gallery ID format") ? 400 : 500).json({ message: error.message || "Failed to fetch gallery." });
    }
};

export const updateGallery = async (req: AuthRequest, res: Response) => {
    try {
        const { title_en, title_so, title_ar, description_en, description_so, description_ar, categories, link } = req.body;
        const data: Partial<{
            title: { en: string; ar: string; so: string };
            description: { en: string; ar: string; so: string };
            categories: CategoryType;
            link: string;
            image: string;
        }> = {};

        if (title_en !== undefined || title_ar !== undefined || title_so !== undefined) {
            if (isWhitespaceOnly(title_en || '') && isWhitespaceOnly(title_so || '') && isWhitespaceOnly(title_ar || '')) {
                return res.status(400).json({ message: "Title cannot be empty in all languages if provided for update." });
            }

            const sanitizedTitle_en = sanitizeInput(title_en || '');
            const sanitizedTitle_so = sanitizeInput(title_so || '');
            const sanitizedTitle_ar = sanitizeInput(title_ar || '');

            if (isInputEmptyAfterSanitization(title_en || '') || isInputEmptyAfterSanitization(title_so || '') || isInputEmptyAfterSanitization(title_ar || '')) {
                return res.status(400).json({ message: "Invalid characters detected in title for update. HTML/script tags are not allowed." });
            }
            data.title = { en: sanitizedTitle_en, ar: sanitizedTitle_ar, so: sanitizedTitle_so };
        }

        if (description_en !== undefined || description_ar !== undefined || description_so !== undefined) {
            const sanitizedDescription_en = sanitizeInput(description_en || '');
            const sanitizedDescription_so = sanitizeInput(description_so || '');
            const sanitizedDescription_ar = sanitizeInput(description_ar || '');

            if (isInputEmptyAfterSanitization(description_en || '') || isInputEmptyAfterSanitization(description_so || '') || isInputEmptyAfterSanitization(description_ar || '')) {
                return res.status(400).json({ message: "Invalid characters detected in description for update. HTML/script tags are not allowed." });
            }
            data.description = { en: sanitizedDescription_en, ar: sanitizedDescription_ar, so: sanitizedDescription_so };
        }

        if (categories !== undefined) {
            if (!allowedCategories.includes(categories)) {
                return res.status(400).json({ message: "Invalid category value for update. Please choose from: " + allowedCategories.join(", ") });
            }
            data.categories = categories;
        }

        if (link !== undefined) {
            const sanitizedLink = sanitizeInput(link);
            if (isInputEmptyAfterSanitization(link)) {
                return res.status(400).json({ message: "Invalid characters detected in link for update. HTML/script tags are not allowed." });
            }
            data.link = sanitizedLink;
        }

        if (req.file?.path) {
            data.image = req.file.path;
        }

        if (Object.keys(data).length === 0 && !req.file?.path) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        const gallery = await galleryService.updateGallery(req.params.id, data);

        res.json({ message: "Gallery updated successfully", gallery });
    } catch (error: any) {
        if (error.message.includes("Gallery not found") || error.message.includes("Invalid Gallery ID format")) {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message || "Failed to update gallery. Please check your input." });
    }
};

export const deleteGallery = async (req: AuthRequest, res: Response) => {
    try {
        await galleryService.deleteGallery(req.params.id);
        res.json({ message: "Gallery deleted successfully." });
    } catch (error: any) {
        if (error.message.includes("Gallery not found") || error.message.includes("Invalid Gallery ID format")) {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message || "Failed to delete gallery." });
    }
};