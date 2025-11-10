import { Router } from 'express';
import * as userControllers from '../controllers/userController';
import { rateLimiter } from '../middleware/rateLimiter'
import { authMiddleware } from '../middleware/authMiddleware';
import { roleCheck } from '../middleware/roleCheck';

const router = Router();

router.post('/', userControllers.registerUser);
router.post('/login', rateLimiter, userControllers.login);
router.post('/logout', authMiddleware, userControllers.logout);
router.get("/me", authMiddleware, roleCheck("admin"), userControllers.getMe);

export default router;
