import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as testimonialService from "../services/testimonialService";
import { sanitizeInput, isInputEmptyAfterSanitization, isWhitespaceOnly } from '../utils/sanitizer';

export const createTestimonial = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const { name: rawName, position: rawPosition, text_en, text_so, text_ar } = req.body;

        if (!rawName || isWhitespaceOnly(rawName)) {
            return res.status(400).json({ message: "Name is required and cannot be empty." });
        }
        const name = sanitizeInput(rawName);
        if (isInputEmptyAfterSanitization(rawName)) {
            return res.status(400).json({ message: "Invalid characters detected in name. HTML/script tags are not allowed." });
        }

        let position: string | undefined;
        if (rawPosition !== undefined) {
            if (isWhitespaceOnly(rawPosition)) {
                return res.status(400).json({ message: "Position cannot be empty if provided." });
            }
            position = sanitizeInput(rawPosition);
            if (isInputEmptyAfterSanitization(rawPosition)) {
                return res.status(400).json({ message: "Invalid characters detected in position. HTML/script tags are not allowed." });
            }
        }
        
        if (isWhitespaceOnly(text_en || '') || isWhitespaceOnly(text_so || '') || isWhitespaceOnly(text_ar || '')) {
            return res.status(400).json({ message: "Testimonial text is required and cannot be empty." });
        }
        const text = {
            en: sanitizeInput(text_en || ''),
            so: sanitizeInput(text_so || ''),
            ar: sanitizeInput(text_ar || '')
        };
        if (isInputEmptyAfterSanitization(text_en || '') || isInputEmptyAfterSanitization(text_so || '') || isInputEmptyAfterSanitization(text_ar || '')) {
            return res.status(400).json({ message: "Invalid characters detected in text. HTML/script tags are not allowed." });
        }

        const image = req.file?.path;

        const testimonial = await testimonialService.createTestimonial({
            userId: req.user.userId,
            name,
            text,
            position,
            image,
        });

        res.status(201).json({ message: "Testimonial created successfully", testimonial });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "An unexpected error occurred while creating testimonial." });
    }
};


export const getTestimonials = async (req: AuthRequest, res: Response) => {
    try {
        const supportedLangs = ["en", "so", "ar"];
        const lang = ((req.query.lang as string) || "en").trim().toLowerCase();

        if (!supportedLangs.includes(lang)) {
            return res.status(400).json({
                message: "Language not supported. Supported languages are: " + supportedLangs.join(", ")
            });
        }
        const testimonials = await testimonialService.getAllTestimonials();

        const localizedTestimonials = testimonials.map(testimonial => {
            const textObj = testimonial.text as Record<string, string> | undefined;

            return {
                ...testimonial,
                text: textObj?.[lang] || textObj?.['en'] || '',
            };
        });

        res.json({ testimonials: localizedTestimonials });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch testimonials." });
    }
};

export const getTestimonial = async (req: AuthRequest, res: Response) => {
    try {
        const testimonial = await testimonialService.getTestimonialById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found." });
        }
        res.json({ testimonial });
    } catch (error: any) {
        const statusCode = error.message.includes("Invalid Testimonial ID format") ? 400 : 500;
        res.status(statusCode).json({ message: error.message || "Failed to fetch testimonial." });
    }
};


export const updateTestimonial = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const { name: rawName, position: rawPosition, text_en, text_so, text_ar } = req.body;
        const data: Partial<{
            name: string;
            text: { en: string; ar: string; so: string };
            position: string;
            image: string;
        }> = {};

        let hasUpdates = false; 

        if (rawName !== undefined) {
            if (isWhitespaceOnly(rawName)) {
                return res.status(400).json({ message: "Name cannot be empty if provided for update." });
            }
            const name = sanitizeInput(rawName);
            if (isInputEmptyAfterSanitization(rawName)) {
                return res.status(400).json({ message: "Invalid characters detected in name for update. HTML/script tags are not allowed." });
            }
            data.name = name;
            hasUpdates = true;
        }

        if (rawPosition !== undefined) {
            if (isWhitespaceOnly(rawPosition)) {
                return res.status(400).json({ message: "Position cannot be empty if provided for update." });
            }
            const position = sanitizeInput(rawPosition);
            if (isInputEmptyAfterSanitization(rawPosition)) {
                return res.status(400).json({ message: "Invalid characters detected in position for update. HTML/script tags are not allowed." });
            }
            data.position = position;
            hasUpdates = true;
        }

        if (text_en !== undefined || text_so !== undefined || text_ar !== undefined) {
            if (isWhitespaceOnly(text_en || '') || isWhitespaceOnly(text_so || '') || isWhitespaceOnly(text_ar || '')) {
                return res.status(400).json({ message: "Testimonial text is required if text field is provided for update." });
            }
            const text = {
                en: sanitizeInput(text_en || ''),
                so: sanitizeInput(text_so || ''),
                ar: sanitizeInput(text_ar || '')
            };
            if (isInputEmptyAfterSanitization(text_en || '') || isInputEmptyAfterSanitization(text_so || '') || isInputEmptyAfterSanitization(text_ar || '')) {
                return res.status(400).json({ message: "Invalid characters detected in text for update. HTML/script tags are not allowed." });
            }
            data.text = text;
            hasUpdates = true;
        }

        if (req.file?.path) {
            data.image = req.file.path;
            hasUpdates = true;
        } else if (req.body.image === null || req.body.image === '') {
            data.image = null as any; 
            hasUpdates = true;
        }

        if (!hasUpdates) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }
        
        const testimonial = await testimonialService.updateTestimonial(req.params.id, data);

        res.json({ message: "Testimonial updated successfully", testimonial });
    } catch (error: any) {
        const statusCode = (error.message.includes("Testimonial not found") || error.message.includes("Invalid Testimonial ID format")) ? 404 : 400;
        res.status(statusCode).json({ message: error.message || "Failed to update testimonial. Please check your input." });
    }
};


export const deleteTestimonial = async (req: AuthRequest, res: Response) => {
    try {
        await testimonialService.deleteTestimonial(req.params.id);
        res.json({ message: "Testimonial deleted successfully." });
    } catch (error: any) {
        const statusCode = (error.message.includes("Testimonial not found") || error.message.includes("Invalid Testimonial ID format")) ? 404 : 400;
        res.status(statusCode).json({ message: error.message || "Failed to delete testimonial." });
    }
};