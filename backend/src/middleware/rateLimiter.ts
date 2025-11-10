import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 15,                
    message: { message: "Too many requests. Try again later." },
    standardHeaders: true,    
    legacyHeaders: false,  
});
