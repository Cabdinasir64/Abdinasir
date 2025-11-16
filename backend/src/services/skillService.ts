import prisma from "../prisma/prismaClient";
import { SkillCategory } from "@prisma/client";

interface SkillInput {
    userId: string;
    name: { en: string; ar: string; so: string };
    level: { en: string; ar: string; so: string };
    category: SkillCategory;
    skillImage?: string;
}

export const createSkill = async (data: SkillInput) => {
    return prisma.skill.create({ data });
};

export const getAllSkills = async () => {
    return prisma.skill.findMany();
};

export const getSkillById = async (id: string) => {
    return prisma.skill.findUnique({ where: { id } });
};

export const updateSkill = async (id: string, data: Partial<SkillInput>) => {
    return prisma.skill.update({
        where: { id },
        data,
    });
};

export const deleteSkill = async (id: string) => {
    return prisma.skill.delete({ where: { id } });
};
