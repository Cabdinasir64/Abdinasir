import { Router } from 'express';
import * as userControllers from '../controllers/userController';
import { customRateLimiter } from '../middleware/rateLimiter'
import { authMiddleware } from '../middleware/authMiddleware';
import { roleCheck } from '../middleware/roleCheck';

const router = Router();

router.post('/', userControllers.registerUser);
router.post('/login', customRateLimiter, userControllers.login);
router.post('/logout', authMiddleware, userControllers.logout);
router.get("/me", authMiddleware, roleCheck("admin"), userControllers.getMe);

export default router;
