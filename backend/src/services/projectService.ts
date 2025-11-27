import { PrismaClient, ProjectCategory } from '@prisma/client';
import {
    sanitizeInput,
    isInputEmptyAfterSanitization,
    isWhitespaceOnly,
    validateProjectCategory,
    validateTechStack,
    validateURL,
    validateObjectId
} from '../utils/sanitizer';

const prisma = new PrismaClient();

interface CreateProjectDTO {
    userID: string;
    name: string;
    description: string;
    mainImage: string;
    images: string[];
    categories: ProjectCategory[];
    tech: string[];
    link?: string;
    status?: string;
}

interface UpdateProjectDTO {
    name?: string;
    description?: string;
    mainImage?: string;
    images?: string[];
    categories?: ProjectCategory[];
    tech?: string[];
    link?: string;
    status?: string;
}

export const ProjectService = {
    async create(data: CreateProjectDTO) {
        if (isWhitespaceOnly(data.name)) {
            throw new Error("Name cannot be empty.");
        }
        if (isInputEmptyAfterSanitization(data.name)) {
            throw new Error("The project name contains invalid data (HTML/Script). Please enter a valid name.");
        }

        if (isWhitespaceOnly(data.description)) {
            throw new Error("Description cannot be empty.");
        }
        if (isInputEmptyAfterSanitization(data.description)) {
            throw new Error("The description contains invalid data (HTML/Script). Please enter a valid description.");
        }

        if (!validateTechStack(data.tech)) {
            throw new Error("Invalid tech stack format.");
        }

        if (data.link && !validateURL(data.link)) {
            throw new Error("Invalid project link URL.");
        }

        const sanitizedName = sanitizeInput(data.name);
        const sanitizedDesc = sanitizeInput(data.description);

        return await prisma.project.create({
            data: {
                userID: data.userID,
                name: sanitizedName,
                description: sanitizedDesc,
                mainImage: data.mainImage,
                images: data.images,
                categories: data.categories,
                tech: data.tech,
                link: data.link || null,
                status: data.status || "PENDING",
            }
        });
    },

    async getAll(page: number = 1, limit: number = 10, category?: ProjectCategory) {
        const skip = (page - 1) * limit;

        const whereClause = category ? {
            categories: {
                has: category
            }
        } : {};

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.project.count({ where: whereClause })
        ]);

        return {
            data: projects,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async getOne(id: string) {
        if (!validateObjectId(id)) throw new Error("Invalid Project ID");

        const project = await prisma.project.findUnique({
            where: { id }
        });

        if (!project) throw new Error("Project not found");
        return project;
    },

    async update(id: string, userID: string, data: UpdateProjectDTO) {
        if (!validateObjectId(id)) throw new Error("Invalid Project ID");

        const existingProject = await prisma.project.findUnique({ where: { id } });
        if (!existingProject) throw new Error("Project not found");

        const updateData: any = { ...data };

        if (data.name !== undefined) {
            if (isWhitespaceOnly(data.name)) throw new Error("Name cannot be empty.");
            if (isInputEmptyAfterSanitization(data.name)) {
                throw new Error("The project name contains invalid data (HTML/Script).");
            }
            updateData.name = sanitizeInput(data.name);
        }

        if (data.description !== undefined) {
            if (isWhitespaceOnly(data.description)) throw new Error("Description cannot be empty.");
            if (isInputEmptyAfterSanitization(data.description)) {
                throw new Error("The description contains invalid data (HTML/Script).");
            }
            updateData.description = sanitizeInput(data.description);
        }

        if (data.link && !validateURL(data.link)) {
            throw new Error("Invalid URL");
        }

        return await prisma.project.update({
            where: { id },
            data: updateData
        });
    },

    async delete(id: string) {
        if (!validateObjectId(id)) throw new Error("Invalid Project ID");

        const existingProject = await prisma.project.findUnique({ where: { id } });
        if (!existingProject) throw new Error("Project not found");



        return await prisma.project.delete({
            where: { id }
        });
    }
};
