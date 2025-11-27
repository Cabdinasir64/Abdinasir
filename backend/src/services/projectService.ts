import { PrismaClient, ProjectCategory } from '@prisma/client';
import {
    sanitizeInput,
    isInputEmptyAfterSanitization,
    isWhitespaceOnly,
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
        if (isWhitespaceOnly(data.name)) throw new Error("Name cannot be empty.");
        if (isInputEmptyAfterSanitization(data.name)) throw new Error("Invalid name.");
        if (data.categories.length === 0) throw new Error("At least one category is required.");

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
        const whereClause = category ? { categories: { has: category } } : {};

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

    async getOne(id: string, visitorId?: string) {
        if (!validateObjectId(id)) throw new Error("Invalid Project ID");

        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) throw new Error("Project not found");

        const userStatus = await ProjectService.getUserStatus(id, visitorId);
        return { ...project, userStatus };
    },

    async getOneByName(name: string, visitorId?: string) {
        if (!name) throw new Error("Project name is required");

        const project = await prisma.project.findFirst({
            where: { name: name }
        });

        if (!project) throw new Error("Project not found");

        const userStatus = await ProjectService.getUserStatus(project.id, visitorId);
        return { ...project, userStatus };
    },

    async update(id: string, userID: string, data: UpdateProjectDTO) {
        if (!validateObjectId(id)) throw new Error("Invalid Project ID");

        const existing = await prisma.project.findUnique({ where: { id } });
        if (!existing) throw new Error("Project not found");

        const updateData: any = { ...data };
        if (data.name) updateData.name = sanitizeInput(data.name);
        if (data.description) updateData.description = sanitizeInput(data.description);

        return await prisma.project.update({
            where: { id },
            data: updateData
        });
    },

    async delete(id: string) {
        if (!validateObjectId(id)) throw new Error("Invalid Project ID");
        await prisma.projectView.deleteMany({ where: { projectId: id } });

        return await prisma.project.delete({ where: { id } });
    },


    async getUserStatus(projectId: string, visitorId?: string) {
        if (!visitorId) return { hasLiked: false, hasRated: false, userRating: 0 };

        const record = await prisma.projectView.findFirst({
            where: { projectId, visitorId }
        });

        return {
            hasLiked: record?.liked || false,
            hasRated: record?.rating !== null && record?.rating !== undefined,
            userRating: record?.rating || 0
        };
    },

    async incrementView(projectId: string) {
        if (!validateObjectId(projectId)) throw new Error("Invalid ID");

        return await prisma.project.update({
            where: { id: projectId },
            data: { viewCount: { increment: 1 } }
        });
    },

    async toggleLike(projectId: string, visitorId: string) {
        if (!validateObjectId(projectId)) throw new Error("Invalid ID");
        if (!visitorId) throw new Error("Visitor ID is required");

        let viewRecord = await prisma.projectView.findFirst({
            where: { projectId, visitorId }
        });

        if (!viewRecord) {
            viewRecord = await prisma.projectView.create({
                data: { projectId, visitorId }
            });
        }

        const isCurrentlyLiked = viewRecord.liked || false;

        await prisma.projectView.update({
            where: { id: viewRecord.id },
            data: { liked: !isCurrentlyLiked }
        });

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                likes: { increment: isCurrentlyLiked ? -1 : 1 }
            }
        });

        return {
            likes: updatedProject.likes,
            hasLiked: !isCurrentlyLiked
        };
    },

    async rateProject(projectId: string, visitorId: string, ratingValue: number) {
        if (!validateObjectId(projectId)) throw new Error("Invalid ID");
        if (!visitorId) throw new Error("Visitor ID is required");
        if (ratingValue < 1 || ratingValue > 5) throw new Error("Rating must be between 1 and 5");

        let viewRecord = await prisma.projectView.findFirst({
            where: { projectId, visitorId }
        });

        if (!viewRecord) {
            viewRecord = await prisma.projectView.create({
                data: { projectId, visitorId }
            });
        }

        await prisma.projectView.update({
            where: { id: viewRecord.id },
            data: { rating: ratingValue }
        });

        const aggregations = await prisma.projectView.aggregate({
            where: {
                projectId: projectId,
                rating: { not: null }
            },
            _avg: { rating: true },
            _count: { rating: true }
        });

        const newAverage = aggregations._avg.rating || 0;

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { rating: newAverage }
        });

        return {
            newAverage: updatedProject.rating,
            totalRatings: aggregations._count.rating,
            hasRated: true
        };
    }
};