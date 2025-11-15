import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as skillService from "../services/skillService";

export const createSkill = async (req: AuthRequest, res: Response) => {
    try {
        
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });

        const name = {
            en: req.body.name_en,
            so: req.body.name_so,
            ar: req.body.name_ar
        };

        const level = {
            en: req.body.level_en,
            so: req.body.level_so,
            ar: req.body.level_ar
        };
        const skillImage = req.file?.path;

        const skill = await skillService.createSkill({
            userId: req.user.userId,
            name,
            level,
            skillImage,
        });

        res.status(201).json({ message: "Skill created", skill });
    } catch (error: any) {
        res.status(400).json({ message: error?.message || "An unexpected error occurred" });
        console.error(error);
    }
};

export const getSkills = async (req: AuthRequest, res: Response) => {
    try {
        const lang = (req.query.lang as string) || 'en';

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
        res.status(500).json({ message: error?.message || "Failed to fetch skills" });
    }
};

export const getSkill = async (req: AuthRequest, res: Response) => {
    try {
        const skill = await skillService.getSkillById(req.params.id);
        if (!skill) return res.status(404).json({ message: "Skill not found" });

        res.json({ skill });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Failed to fetch skill" });
    }
};

export const updateSkill = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });

        const data: Partial<{
            name: {
                en: string;
                so: string;
                ar: string;
            };
            level: {
                en: string;
                so: string;
                ar: string;
            };
            skillImage: string;
        }> = {};

        if (req.body.name_en || req.body.name_so || req.body.name_ar) {
            data.name = {
                en: req.body.name_en,
                so: req.body.name_so,
                ar: req.body.name_ar,
            };
        }

        if (req.body.level_en || req.body.level_so || req.body.level_ar) {
            data.level = {
                en: req.body.level_en,
                so: req.body.level_so,
                ar: req.body.level_ar,
            };
        }

        if (req.file?.path) {
            data.skillImage = req.file.path;
        }

        const skill = await skillService.updateSkill(req.params.id, data);

        res.json({ message: "Skill updated", skill });
    } catch (error: any) {
        res.status(400).json({ message: error?.message || "Failed to update skill" });
        console.error(error);
    }
};


export const deleteSkill = async (req: AuthRequest, res: Response) => {
    try {
        await skillService.deleteSkill(req.params.id);
        res.json({ message: "Skill deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error?.message || "Failed to delete skill" });
    }
};
