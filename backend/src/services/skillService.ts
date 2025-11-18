import prisma from "../prisma/prismaClient";
import mongoose from 'mongoose';
import { SkillCategory } from "@prisma/client";

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

const ALL_SKILL_CATEGORIES: SkillCategory[] = Object.values(SkillCategory);

interface SkillInput {
    userId: string;
    name: { en: string; ar: string; so: string };
    level: { en: string; ar: string; so: string };
    category: SkillCategory[];
    skillImage?: string;
}

export const createSkill = async (data: SkillInput) => {
    if (!data.userId || !isValidObjectId(data.userId)) {
        throw new Error("Invalid or missing userId.");
    }

    if (!Object.values(data.name).some(n => n && n.trim().length > 0)) {
        throw new Error("Skill name is required.");
    }

    if (!Object.values(data.level).some(l => l && l.trim().length > 0)) {
        throw new Error("Skill level is required.");
    }

    if (!data.category || data.category.length === 0) {
        throw new Error("skill category is required.");
    }
    for (const cat of data.category) {
        if (!ALL_SKILL_CATEGORIES.includes(cat)) {
            throw new Error(`Invalid skill category: ${cat}. Valid categories are: ${ALL_SKILL_CATEGORIES.join(", ")}`);
        }
    }

    if (!data.skillImage || data.skillImage.trim().length === 0) {
        throw new Error("Skill image path is required.");
    }

    return prisma.skill.create({ data });
};

export const getAllSkills = async () => {
    return prisma.skill.findMany();
};

export const getSkillById = async (id: string) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Skill ID format.");
    }
    const existing = await prisma.skill.findUnique({ where: { id } });
    return existing;
};

export const updateSkill = async (id: string, data: Partial<SkillInput>) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Skill ID format.");
    }

    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Skill not found.");
    }

    if (data.name) {
        if (!Object.values(data.name).some(n => n && n.trim().length > 0)) {
            throw new Error("Skill name cannot be empty if provided.");
        }
    }

    if (data.level) {
        if (!Object.values(data.level).some(l => l && l.trim().length > 0)) {
            throw new Error("Skill level cannot be empty if provided.");
        }
    }

    if (data.category) {
        if (data.category.length === 0) {
            throw new Error("At least one skill category is required if category field is provided for update.");
        }
        for (const cat of data.category) {
            if (!ALL_SKILL_CATEGORIES.includes(cat)) {
                throw new Error(`Invalid skill category: ${cat}. Valid categories are: ${ALL_SKILL_CATEGORIES.join(", ")}`);
            }
        }
    }

    if (data.skillImage) {
        if (data.skillImage.trim().length === 0) {
            throw new Error("Skill image path cannot be empty if provided.");
        }
    }


    return prisma.skill.update({
        where: { id },
        data,
    });
};

export const deleteSkill = async (id: string) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Skill ID format.");
    }

    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Skill not found.");
    }

    return prisma.skill.delete({ where: { id } });
};