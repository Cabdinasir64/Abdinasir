import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 15,
    handler: (req, res) => {
        res.status(429).json({ message: "Too many requests. Please try again later." });
    },
    standardHeaders: true,
    legacyHeaders: false,
});
