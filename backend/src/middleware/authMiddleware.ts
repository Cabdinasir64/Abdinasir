import { Request, Response, NextFunction } from "express";

export interface SessionUser {
    userId: string;
    username: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: SessionUser;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        req.user = {
            userId: req.session.user.userId,
            username: req.session.user.username,
            role: req.session.user.role
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authenticated" });
    }
};