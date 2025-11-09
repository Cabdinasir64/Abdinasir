import { Router } from 'express';
import * as userControllers from '../controllers/userController';

const router = Router();

router.post('/', userControllers.registerUser);
router.post('/login', userControllers.login);

export default router;
