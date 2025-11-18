import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as skillService from "../services/skillService";
import { SkillCategory } from "@prisma/client";
import { sanitizeInput, isInputEmptyAfterSanitization, isWhitespaceOnly } from '../utils/sanitizer';

const ALL_SKILL_CATEGORIES: SkillCategory[] = Object.values(SkillCategory);

export const createSkill = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const { name_en, name_so, name_ar, level_en, level_so, level_ar } = req.body;
        let categoryInput = req.body.category; 

        if (isWhitespaceOnly(name_en || '') && isWhitespaceOnly(name_so || '') && isWhitespaceOnly(name_ar || '')) {
            return res.status(400).json({ message: "Skill name is required." });
        }

        const sanitizedName = {
            en: sanitizeInput(name_en || ''),
            so: sanitizeInput(name_so || ''),
            ar: sanitizeInput(name_ar || '')
        };
        if (isInputEmptyAfterSanitization(name_en || '') || isInputEmptyAfterSanitization(name_so || '') || isInputEmptyAfterSanitization(name_ar || '')) {
            return res.status(400).json({ message: "Invalid characters detected in skill name. HTML/script tags are not allowed." });
        }

        if (isWhitespaceOnly(level_en || '') && isWhitespaceOnly(level_so || '') && isWhitespaceOnly(level_ar || '')) {
            return res.status(400).json({ message: "Skill level is required." });
        }

        const sanitizedLevel = {
            en: sanitizeInput(level_en || ''),
            so: sanitizeInput(level_so || ''),
            ar: sanitizeInput(level_ar || '')
        };
        if (isInputEmptyAfterSanitization(level_en || '') || isInputEmptyAfterSanitization(level_so || '') || isInputEmptyAfterSanitization(level_ar || '')) {
            return res.status(400).json({ message: "Invalid characters detected in skill level. HTML/script tags are not allowed." });
        }

        let categories: SkillCategory[] = [];
        if (!categoryInput) {
            return res.status(400).json({ message: "Skill category is required." });
        }

        if (typeof categoryInput === "string") {
            try {
                categories = JSON.parse(categoryInput);
                if (!Array.isArray(categories)) categories = [categories]; 
            } catch (err) {
                return res.status(400).json({ message: "Invalid category format. Must be a JSON array or a single string." });
            }
        } else if (Array.isArray(categoryInput)) {
            categories = categoryInput;
        } else {
            categories = [categoryInput]; 
        }

        if (categories.length === 0) {
            return res.status(400).json({ message: "skill category is required." });
        }

        for (const cat of categories) {
            if (!ALL_SKILL_CATEGORIES.includes(cat)) {
                return res.status(400).json({ message: `Invalid skill category: ${cat}. Valid categories are: ${ALL_SKILL_CATEGORIES.join(", ")}` });
            }
        }

        const skillImage = req.file?.path;
        if (!skillImage) {
            return res.status(400).json({ message: "Skill image is required." });
        }

        const skill = await skillService.createSkill({
            userId: req.user.userId,
            name: sanitizedName,
            level: sanitizedLevel,
            category: categories,
            skillImage,
        });

        res.status(201).json({ message: "Skill created successfully", skill });
    } catch (error: any) {
        res.status(400).json({ message: error?.message || "An unexpected error occurred while creating skill." });
    }
};

export const getSkills = async (req: AuthRequest, res: Response) => {
    try {
        const supportedLangs = ["en", "so", "ar"];
        const lang = ((req.query.lang as string) || "en").trim().toLowerCase();

        if (!supportedLangs.includes(lang)) {
            return res.status(400).json({
                message: "Language not supported. Supported languages are: " + supportedLangs.join(", ")
            });
        }

        const skills = await skillService.getAllSkills();

        const localizedSkills = skills.map(skill => {
            const nameObj = skill.name as Record<string, string> | undefined;
            const levelObj = skill.level as Record<string, string> | undefined;

            return {
                ...skill,
                name: nameObj?.[lang] || nameObj?.['en'] || '',
                level: levelObj?.[lang] || levelObj?.['en'] || '',
            };
        });

        res.json({ skills: localizedSkills });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Failed to fetch skills." });
    }
};

export const getSkill = async (req: AuthRequest, res: Response) => {
    try {
        const skill = await skillService.getSkillById(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found." });
        }
        res.json({ skill });
    } catch (error: any) {
        const statusCode = error.message.includes("Invalid Skill ID format") ? 400 : 500;
        res.status(statusCode).json({ message: error?.message || "Failed to fetch skill." });
    }
};

export const updateSkill = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const { name_en, name_so, name_ar, level_en, level_so, level_ar } = req.body;
        let categoryInput = req.body.category;
        const data: Partial<{
            name: { en: string; so: string; ar: string; };
            level: { en: string; so: string; ar: string; };
            category: SkillCategory[];
            skillImage: string;
        }> = {};

        let hasUpdates = false; 

        if (name_en !== undefined || name_so !== undefined || name_ar !== undefined) {
            if (isWhitespaceOnly(name_en || '') && isWhitespaceOnly(name_so || '') && isWhitespaceOnly(name_ar || '')) {
                return res.status(400).json({ message: "Skill name cannot be empty if provided for update." });
            }
            const sanitizedName_en = sanitizeInput(name_en || '');
            const sanitizedName_so = sanitizeInput(name_so || '');
            const sanitizedName_ar = sanitizeInput(name_ar || '');

            if (isInputEmptyAfterSanitization(name_en || '') || isInputEmptyAfterSanitization(name_so || '') || isInputEmptyAfterSanitization(name_ar || '')) {
                return res.status(400).json({ message: "Invalid characters detected in skill name for update. HTML/script tags are not allowed." });
            }
            data.name = { en: sanitizedName_en, so: sanitizedName_so, ar: sanitizedName_ar };
            hasUpdates = true;
        }

        if (level_en !== undefined || level_so !== undefined || level_ar !== undefined) {
            if (isWhitespaceOnly(level_en || '') && isWhitespaceOnly(level_so || '') && isWhitespaceOnly(level_ar || '')) {
                return res.status(400).json({ message: "Skill level cannot be empty if provided for update." });
            }
            const sanitizedLevel_en = sanitizeInput(level_en || '');
            const sanitizedLevel_so = sanitizeInput(level_so || '');
            const sanitizedLevel_ar = sanitizeInput(level_ar || '');

            if (isInputEmptyAfterSanitization(level_en || '') || isInputEmptyAfterSanitization(level_so || '') || isInputEmptyAfterSanitization(level_ar || '')) {
                return res.status(400).json({ message: "Invalid characters detected in skill level for update. HTML/script tags are not allowed." });
            }
            data.level = { en: sanitizedLevel_en, so: sanitizedLevel_so, ar: sanitizedLevel_ar };
            hasUpdates = true;
        }

        if (categoryInput !== undefined) {
            let categories: SkillCategory[] = [];
            if (typeof categoryInput === "string") {
                try {
                    categories = JSON.parse(categoryInput);
                    if (!Array.isArray(categories)) categories = [categories];
                } catch (err) {
                    return res.status(400).json({ message: "Invalid category format for update. Must be a JSON array or a single string." });
                }
            } else if (Array.isArray(categoryInput)) {
                categories = categoryInput;
            } else {
                categories = [categoryInput];
            }

            if (categories.length === 0) {
                return res.status(400).json({ message: "skill category is required if category field is provided for update." });
            }

            for (const cat of categories) {
                if (!ALL_SKILL_CATEGORIES.includes(cat)) {
                    return res.status(400).json({ message: `Invalid skill category: ${cat}. Valid categories are: ${ALL_SKILL_CATEGORIES.join(", ")}` });
                }
            }
            data.category = categories;
            hasUpdates = true;
        }

        if (req.file?.path) {
            data.skillImage = req.file.path;
            hasUpdates = true;
        }

        if (!hasUpdates) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        const skill = await skillService.updateSkill(req.params.id, data);

        res.json({ message: "Skill updated successfully", skill });
    } catch (error: any) {
        const statusCode = (error.message.includes("Skill not found") || error.message.includes("Invalid Skill ID format")) ? 404 : 400;
        res.status(statusCode).json({ message: error?.message || "Failed to update skill. Please check your input." });
    }
};


export const deleteSkill = async (req: AuthRequest, res: Response) => {
    try {
        await skillService.deleteSkill(req.params.id);
        res.json({ message: "Skill deleted successfully." });
    } catch (error: any) {
        const statusCode = (error.message.includes("Skill not found") || error.message.includes("Invalid Skill ID format")) ? 404 : 400;
        res.status(statusCode).json({ message: error?.message || "Failed to delete skill." });
    }
};