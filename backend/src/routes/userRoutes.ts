import { Router } from 'express';
import * as userControllers from '../controllers/userController';
import { rateLimiter } from '../middleware/rateLimiter'
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', userControllers.registerUser);
router.post('/login', rateLimiter, userControllers.login);
router.post('/logout', authMiddleware, userControllers.logout);

export default router;
