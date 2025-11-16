import { Router } from "express";
import * as galleryController from "../controllers/galleryController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleCheck } from "../middleware/roleCheck";
import { uploadDynamic } from "../middleware/uploadImage"; 

const router = Router();
const upload = uploadDynamic("galleries_images");

router.post("/", authMiddleware, roleCheck("admin"), upload.single('image'), galleryController.createGallery);
router.get("/", galleryController.getGalleries);
router.get("/:id", galleryController.getGallery);
router.put("/:id", authMiddleware, roleCheck("admin"), upload.single('image'), galleryController.updateGallery);
router.delete("/:id", authMiddleware, roleCheck("admin"), galleryController.deleteGallery);

export default router;
