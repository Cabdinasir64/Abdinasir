import { Request, Response, NextFunction } from "express";


const requestsMap = new Map<string, { count: number; lastRequest: number }>();

const WINDOW_MS = 60 * 1000; 
const MAX_REQUESTS = 15;

export const customRateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";

    const now = Date.now();
    const entry = requestsMap.get(key);

    if (entry) {
        if (now - entry.lastRequest > WINDOW_MS) {
            requestsMap.set(key, { count: 1, lastRequest: now });
            next();
        } else {
            if (entry.count >= MAX_REQUESTS) {
                return res.status(429).json({ message: "Too many requests. Try again later." });
            } else {
                entry.count += 1;
                requestsMap.set(key, entry);
                next();
            }
        }
    } else {
        requestsMap.set(key, { count: 1, lastRequest: now });
        next();
    }
};
