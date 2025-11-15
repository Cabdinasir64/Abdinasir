import { Router } from 'express';
import * as userControllers from '../controllers/userController';
import { rateLimiter } from '../middleware/rateLimiter';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleCheck } from '../middleware/roleCheck';
import { uploadDynamic } from '../middleware/uploadImage';

const router = Router();
const upload = uploadDynamic("profile_images");

router.post('/', userControllers.registerUser);
router.post('/login', rateLimiter, userControllers.login);
router.post('/logout', authMiddleware, userControllers.logout);
router.get("/me", authMiddleware, roleCheck("admin"), userControllers.getMe);

router.post(
    '/profile-image',
    authMiddleware,
    upload.single('image'),
    userControllers.uploadProfileImage
);

export default router;
