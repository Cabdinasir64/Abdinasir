import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { ProjectCategory } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

export const ProjectController = {

    createProject: async (req: AuthRequest, res: Response) => {
        try {
            const { name, description, categories, tech, link, status } = req.body;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!files || !files['mainImage']) {
                return res.status(400).json({ message: "Main image is required" });
            }

            const mainImage = files['mainImage'][0].path;
            const images = files['images'] ? files['images'].map(file => file.path) : [];

            const parsedCategories = Array.isArray(categories) ? categories : JSON.parse(categories || '[]');
            const parsedTech = Array.isArray(tech) ? tech : JSON.parse(tech || '[]');

            const project = await ProjectService.create({
                userID: req.user.userId,
                name,
                description,
                mainImage,
                images,
                categories: parsedCategories,
                tech: parsedTech,
                link,
                status
            });

            return res.status(201).json(project);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    },

    getAllProjects: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const category = req.query.category as ProjectCategory | undefined;

            const result = await ProjectService.getAll(page, limit, category);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    },

    getProjectById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const project = await ProjectService.getOne(id);
            return res.status(200).json(project);
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    },

    updateProject: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, categories, tech, link, status } = req.body;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            let mainImage;
            let images;

            if (files && files['mainImage']) {
                mainImage = files['mainImage'][0].path;
            }
            if (files && files['images']) {
                images = files['images'].map(file => file.path);
            }

            const parsedCategories = categories ? (Array.isArray(categories) ? categories : JSON.parse(categories)) : undefined;
            const parsedTech = tech ? (Array.isArray(tech) ? tech : JSON.parse(tech)) : undefined;

            const updatedProject = await ProjectService.update(id, req.user.id, {
                name,
                description,
                mainImage,
                images,
                categories: parsedCategories,
                tech: parsedTech,
                link,
                status
            });

            return res.status(200).json(updatedProject);
        } catch (error: any) {
            const status = error.message.includes("Unauthorized") ? 403 : 400;
            return res.status(status).json({ message: error.message });
        }
    },

    deleteProject: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            await ProjectService.delete(id);
            return res.status(200).json({ message: "Project deleted successfully" });
        } catch (error: any) {
            const status = error.message.includes("Unauthorized") ? 403 : 404;
            return res.status(status).json({ message: error.message });
        }
    }
};