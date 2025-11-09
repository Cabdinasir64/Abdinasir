import { Request, Response, NextFunction } from "express";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers["x-api-key"] as string;
    if (!key || key !== process.env.IP_ROUTE_KEY) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};