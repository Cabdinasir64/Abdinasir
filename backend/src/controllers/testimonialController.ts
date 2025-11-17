import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as testimonialService from "../services/testimonialService";

export const createTestimonial = async (req: AuthRequest, res: Response) => {
    try {
        const { name, position } = req.body;

        const text = {
            en: req.body.text_en,
            so: req.body.text_so,
            ar: req.body.text_ar
        };
        const image = req.file?.path;

        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Name is required and must be a non-empty string" });
        }

        if (!position || typeof position !== "string" || !position.trim()) {
            return res.status(400).json({ message: "Position is required and must be a non-empty string" });
        }

        if (!text.en || !text.so || !text.ar) {
            return res.status(400).json({ message: "Text for all languages (en, so, ar) is required" });
        }

        const testimonial = await testimonialService.createTestimonial({
            userId: req.user.userId,
            name,
            text,
            position,
            image,
        });

        res.status(201).json({ message: "Testimonial created", testimonial });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to create testimonial" });
    }
};


export const getTestimonials = async (req: AuthRequest, res: Response) => {
    try {

        const supportedLangs = ["en", "so", "ar"];
        const lang = ((req.query.lang as string) || "en").trim().toLowerCase();

        if (!supportedLangs.includes(lang)) {
            return res.status(400).json({
                message: "Language not supported",
                supported: supportedLangs
            });
        }
        const testimonials = await testimonialService.getAllTestimonials();

        if (!testimonials || testimonials.length === 0) {
            return res.status(404).json({
                message: "No testimonials found"
            });
        }

        const localizedTestimonials = testimonials.map(testimonial => {
            const textObj = testimonial.text as Record<string, string> | undefined;

            return {
                ...testimonial,
                text: textObj?.[lang] || textObj?.['en'] || '',
            };
        });

        res.json({ testimonials: localizedTestimonials });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch testimonials" });
    }
};

export const getTestimonial = async (req: AuthRequest, res: Response) => {
    try {
        const testimonial = await testimonialService.getTestimonialById(req.params.id);

        if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

        res.json({ testimonial });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch testimonial" });
    }
};


export const updateTestimonial = async (req: AuthRequest, res: Response) => {
    try {
        const data: Partial<{
            name: string;
            text: { en: string; ar: string; so: string };
            position: string;
            image: string;
        }> = {};

        if (req.body.name && typeof req.body.name === "string" && req.body.name.trim()) {
            data.name = req.body.name.trim();
        }

        if (req.body.text_en || req.body.text_ar || req.body.text_so) {
            const text: { en: string; ar: string; so: string } = {
                en: req.body.text_en || "",
                ar: req.body.text_ar || "",
                so: req.body.text_so || "",
            };

            if (!text.en || !text.ar || !text.so) {
                return res.status(400).json({ message: "Text must include all three languages: en, ar, so" });
            }

            data.text = text;
        }

        if (req.body.position && typeof req.body.position === "string" && req.body.position.trim()) {
            data.position = req.body.position.trim();
        }

        if (req.file?.path) {
            data.image = req.file.path;
        }

        const testimonial = await testimonialService.updateTestimonial(req.params.id, data);

        res.json({ message: "Testimonial updated", testimonial });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to update testimonial" });
    }
};


export const deleteTestimonial = async (req: AuthRequest, res: Response) => {
    try {
        const result = await testimonialService.deleteTestimonial(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Testimonial not found" });
        }
        res.json({ message: "Testimonial deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to delete testimonial" });
    }
};
