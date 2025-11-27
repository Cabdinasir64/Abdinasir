import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadDynamic } from '../middleware/uploadImage';

const router = Router();

const projectUpload = uploadDynamic('projects').fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);
router.get('/name/:name', ProjectController.getProjectByName);

router.post('/:id/view', ProjectController.incrementView);
router.post('/:id/like', ProjectController.toggleLike);
router.post('/:id/rate', ProjectController.rateProject);

router.post(
    '/',
    authMiddleware,
    projectUpload,
    ProjectController.createProject
);

router.put(
    '/:id',
    authMiddleware,
    projectUpload,
    ProjectController.updateProject
);

router.delete(
    '/:id',
    authMiddleware,
    ProjectController.deleteProject
);

export default router;