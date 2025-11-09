import { Router } from "express";
import { getIp } from "../controllers/ipController";
import { apiKeyAuth } from "../middleware/ipauth";
import rateLimit from "express-rate-limit";

const router = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
});

router.get("/", limiter, apiKeyAuth, getIp);

export default router;
